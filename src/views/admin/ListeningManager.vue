<!-- src/views/admin/ListeningManager.vue -->
<template>
  <div class="admin-layout">
    <AdminMenu />
    <div class="admin-content">
      <h1>Listening Materials Manager</h1>

      <!-- Upload Form Section -->
      <div class="manager-section">
        <div class="upload-form-container">
          <h2>Add New Listening Material</h2>

          <form @submit.prevent="uploadFiles" class="upload-form">
            <div class="form-group">
              <label for="title">Title</label>
              <input
                  type="text"
                  id="title"
                  v-model="formData.title"
                  placeholder="Enter title for this listening exercise"
                  required
              />
            </div>

            <div class="form-group">
              <label for="audioFile">Audio File (MP3)</label>
              <div class="file-input-wrapper">
                <input
                    type="file"
                    id="audioFile"
                    ref="audioFileInput"
                    @change="handleAudioFileChange"
                    accept="audio/mpeg"
                    required
                />
                <div class="file-info" v-if="selectedAudioFile">
                  <span>{{ selectedAudioFile.name }}</span>
                  <span class="file-size">{{ formatFileSize(selectedAudioFile.size) }}</span>
                </div>
              </div>
              <small>Only MP3 files are accepted</small>
            </div>

            <div class="form-group">
              <label for="textFile">Text Transcript (DOCX)</label>
              <div class="file-input-wrapper">
                <input
                    type="file"
                    id="textFile"
                    ref="textFileInput"
                    @change="handleTextFileChange"
                    accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    required
                />
                <div class="file-info" v-if="selectedTextFile">
                  <span>{{ selectedTextFile.name }}</span>
                  <span class="file-size">{{ formatFileSize(selectedTextFile.size) }}</span>
                </div>
              </div>
              <small>Only DOCX files are accepted</small>
            </div>

            <div class="form-group">
              <label for="level">Language Level</label>
              <select id="level" v-model="formData.level" required>
                <option value="" disabled>Select a level</option>
                <option value="A1">A1 - Beginner</option>
                <option value="A2">A2 - Elementary</option>
                <option value="B1">B1 - Intermediate</option>
                <option value="B2">B2 - Upper Intermediate</option>
                <option value="C1">C1 - Advanced</option>
                <option value="C2">C2 - Proficient</option>
              </select>
            </div>

            <div class="form-group">
              <label for="description">Description</label>
              <textarea
                  id="description"
                  v-model="formData.description"
                  rows="4"
                  placeholder="Enter a description for this listening material"
                  required
              ></textarea>
            </div>

            <div class="form-actions">
              <button
                  type="submit"
                  class="submit-btn"
                  :disabled="isUploading"
              >
                <span v-if="isUploading">Uploading...</span>
                <span v-else>Upload Files</span>
              </button>
            </div>
          </form>

          <div v-if="uploadMessage" :class="`upload-message ${uploadStatus}`">
            {{ uploadMessage }}
          </div>
        </div>
      </div>

      <!-- Listening Materials List Section -->
      <div class="manager-section mt-30">
        <h2>Existing Listening Materials</h2>

        <div v-if="loading" class="loading-indicator">
          <span>Loading materials...</span>
        </div>

        <div v-else-if="listeningFiles.length === 0" class="empty-state">
          <p>No listening materials available.</p>
        </div>

        <div v-else class="table-container">
          <table class="materials-table">
            <thead>
            <tr>
              <th>Title</th>
              <th>Level</th>
              <th>Description</th>
              <th>Audio</th>
              <th>Transcript</th>
              <th>Date Added</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="file in listeningFiles" :key="file.id">
              <td>{{ file.title }}</td>
              <td>{{ file.level }}</td>
              <td>{{ file.description }}</td>
              <td>
                <audio controls class="audio-player">
                  <source :src="file.audioFile.accessUrl" type="audio/mpeg">
                  Your browser does not support the audio element.
                </audio>
              </td>
              <td>
                <a :href="file.textFile.accessUrl" target="_blank" class="file-link">
                  {{ file.textFile.originalFilename }}
                </a>
              </td>
              <td>{{ formatDate(file.createdAt) }}</td>
              <td>
                <button @click="confirmDelete(file)" class="delete-btn">
                  Delete
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Confirmation Modal -->
      <div v-if="showConfirmDialog" class="modal-overlay">
        <div class="confirm-dialog">
          <h3>Confirm Deletion</h3>
          <p>Are you sure you want to delete "{{ fileToDelete?.title }}"?</p>
          <p class="warning">This action cannot be undone.</p>
          <div class="dialog-actions">
            <button @click="deleteFile" class="confirm-btn" :disabled="isDeleting">
              {{ isDeleting ? 'Deleting...' : 'Delete' }}
            </button>
            <button @click="cancelDelete" class="cancel-btn">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminMenu from '@/components/admin/AdminMenu.vue';
import axios from 'axios';

export default {
  name: 'ListeningManager',
  components: {
    AdminMenu
  },
  data() {
    return {
      selectedAudioFile: null,
      selectedTextFile: null,
      formData: {
        title: '',
        level: '',
        description: ''
      },
      isUploading: false,
      uploadMessage: '',
      uploadStatus: '',
      listeningFiles: [],
      loading: false,
      error: null,
      showConfirmDialog: false,
      fileToDelete: null,
      isDeleting: false
    }
  },
  mounted() {
    this.fetchListeningFiles();
  },
  methods: {
    handleAudioFileChange(event) {
      const file = event.target.files[0];
      if (file && file.type === 'audio/mpeg') {
        this.selectedAudioFile = file;
      } else {
        this.$refs.audioFileInput.value = '';
        this.selectedAudioFile = null;
        this.uploadMessage = 'Please select a valid MP3 file';
        this.uploadStatus = 'error';
      }
    },
    handleTextFileChange(event) {
      const file = event.target.files[0];
      // Check for DOCX MIME type
      if (file && file.name.endsWith('.docx')) {
        this.selectedTextFile = file;
      } else {
        this.$refs.textFileInput.value = '';
        this.selectedTextFile = null;
        this.uploadMessage = 'Please select a valid DOCX file';
        this.uploadStatus = 'error';
      }
    },
    formatFileSize(bytes) {
      if (bytes < 1024) return bytes + ' bytes';
      else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
      else return (bytes / 1048576).toFixed(1) + ' MB';
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    async fetchListeningFiles() {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://mamanmakuetchehelene.site/api/media-pairs', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.listeningFiles = response.data;
      } catch (error) {
        console.error('Error fetching listening files:', error);
        this.error = 'Failed to load listening materials';
      } finally {
        this.loading = false;
      }
    },
    async uploadFiles() {
      if (!this.selectedAudioFile || !this.selectedTextFile) {
        this.uploadMessage = 'Please select both audio and text files';
        this.uploadStatus = 'error';
        return;
      }

      this.isUploading = true;
      this.uploadMessage = '';

      // Create FormData object
      const formData = new FormData();
      formData.append('audioFile', this.selectedAudioFile);
      formData.append('textFile', this.selectedTextFile);
      formData.append('title', this.formData.title);
      formData.append('level', this.formData.level);
      formData.append('description', this.formData.description);

      try {
        const token = localStorage.getItem('token');

        await axios.post('https://mamanmakuetchehelene.site/api/media-pairs/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });

        // Success
        this.uploadMessage = 'Files uploaded successfully!';
        this.uploadStatus = 'success';

        // Reset form
        this.selectedAudioFile = null;
        this.selectedTextFile = null;
        this.formData.title = '';
        this.formData.level = '';
        this.formData.description = '';
        this.$refs.audioFileInput.value = '';
        this.$refs.textFileInput.value = '';

        // Refresh file list
        this.fetchListeningFiles();

      } catch (error) {
        console.error('Error uploading files:', error);
        this.uploadMessage = error.response?.data?.message || 'Failed to upload files';
        this.uploadStatus = 'error';
      } finally {
        this.isUploading = false;
      }
    },
    confirmDelete(file) {
      this.fileToDelete = file;
      this.showConfirmDialog = true;
    },
    cancelDelete() {
      this.fileToDelete = null;
      this.showConfirmDialog = false;
    },
    async deleteFile() {
      if (!this.fileToDelete) return;

      this.isDeleting = true;
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://mamanmakuetchehelene.site/api/media-pairs/${this.fileToDelete.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Remove from local array
        this.listeningFiles = this.listeningFiles.filter(file => file.id !== this.fileToDelete.id);

        // Show success message
        this.uploadMessage = 'File deleted successfully!';
        this.uploadStatus = 'success';

        // Close dialog
        this.showConfirmDialog = false;
        this.fileToDelete = null;
      } catch (error) {
        console.error('Error deleting file:', error);
        this.uploadMessage = error.response?.data?.message || 'Failed to delete file';
        this.uploadStatus = 'error';
      } finally {
        this.isDeleting = false;
      }
    }
  }
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.admin-content {
  flex: 1;
  padding: 30px;
  background-color: #f5f7fa;
  margin-left: 250px; /* Same as the width of AdminMenu */
  min-height: 100vh;
}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
  border-bottom: 2px solid #3A86FF;
  padding-bottom: 10px;
}

.manager-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  padding: 30px;
}

.mt-30 {
  margin-top: 30px;
}

.upload-form-container {
  max-width: 700px;
}

h2 {
  margin-bottom: 20px;
  color: #2c3e50;
}

.upload-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: 600;
  color: #2c3e50;
}

input[type="text"],
select,
textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-family: inherit;
  font-size: 14px;
}

input[type="file"] {
  padding: 10px;
  border: 2px dashed #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  cursor: pointer;
}

.file-info {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  background: #edf2ff;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
}

.file-size {
  color: #666;
}

small {
  color: #7f8c8d;
  font-size: 12px;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

.audio-player {
  max-width: 200px;
  height: 35px;
}

.form-actions {
  margin-top: 10px;
}

.submit-btn {
  background-color: #3A86FF;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background-color: #2a76ef;
}

.submit-btn:disabled {
  background-color: #a0c0ff;
  cursor: not-allowed;
}

.upload-message {
  margin-top: 20px;
  padding: 12px;
  border-radius: 5px;
  font-weight: 500;
}

.upload-message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.upload-message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* Table Styles */
.table-container {
  overflow-x: auto;
}

.materials-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.materials-table th,
.materials-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.materials-table th {
  background-color: #f8fafc;
  font-weight: 600;
}

.materials-table tr:hover {
  background-color: #f8fafc;
}

.file-link {
  color: #3A86FF;
  text-decoration: none;
  font-weight: 500;
}

.file-link:hover {
  text-decoration: underline;
}

.delete-btn {
  background-color: #e53e3e;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s;
}

.delete-btn:hover {
  background-color: #c53030;
}

.loading-indicator, .empty-state {
  padding: 20px;
  text-align: center;
  color: #718096;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.confirm-dialog {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.confirm-dialog h3 {
  margin-top: 0;
  color: #2c3e50;
}

.warning {
  color: #e53e3e;
  font-size: 14px;
  margin-top: 10px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.confirm-btn {
  background-color: #e53e3e;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-btn:disabled {
  background-color: #f56565;
  cursor: not-allowed;
}

.cancel-btn {
  background-color: #e2e8f0;
  color: #4a5568;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
</style>