<!-- src/views/admin/VocabularyManager.vue -->
<template>
  <div class="admin-layout">
    <AdminMenu />
    <div class="admin-content">
      <h1>Vocabulary Manager</h1>

      <!-- Add Vocabulary Form Section -->
      <div class="manager-section">
        <div class="form-container">
          <h2>Add New Vocabulary</h2>

          <form @submit.prevent="addVocabulary" class="add-form">
            <div class="form-group">
              <label for="word">Word</label>
              <input
                  type="text"
                  id="word"
                  v-model="formData.word"
                  placeholder="Enter word"
                  required
              />
            </div>

            <div class="form-group">
              <label for="translation">Translation</label>
              <input
                  type="text"
                  id="translation"
                  v-model="formData.translation"
                  placeholder="Enter translation"
                  required
              />
            </div>

            <div class="form-group">
              <label for="description">Description</label>
              <textarea
                  id="description"
                  v-model="formData.description"
                  rows="4"
                  placeholder="Enter description or example usage"
                  required
              ></textarea>
            </div>

            <div class="form-actions">
              <button
                  type="submit"
                  class="submit-btn"
                  :disabled="isSubmitting"
              >
                <span v-if="isSubmitting">Submitting...</span>
                <span v-else>Add Vocabulary</span>
              </button>
            </div>
          </form>

          <div v-if="submitMessage" :class="`submit-message ${submitStatus}`">
            {{ submitMessage }}
          </div>
        </div>
      </div>

      <!-- Vocabulary List Section -->
      <div class="manager-section mt-30">
        <h2>Existing Vocabulary</h2>

        <div v-if="loading" class="loading-indicator">
          <span>Loading vocabulary...</span>
        </div>

        <div v-else-if="vocabularyItems.length === 0" class="empty-state">
          <p>No vocabulary items available.</p>
        </div>

        <div v-else class="table-container">
          <table class="vocabulary-table">
            <thead>
            <tr>
              <th>Word</th>
              <th>Translation</th>
              <th>Description</th>
              <th>Date Added</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in vocabularyItems" :key="item.id">
              <td>{{ item.word }}</td>
              <td>{{ item.translation }}</td>
              <td>{{ item.description }}</td>
              <td>{{ formatDate(item.createdAt) }}</td>
              <td>
                <button @click="confirmDelete(item)" class="delete-btn">
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
          <p>Are you sure you want to delete "{{ itemToDelete?.word }}"?</p>
          <p class="warning">This action cannot be undone.</p>
          <div class="dialog-actions">
            <button @click="deleteItem" class="confirm-btn" :disabled="isDeleting">
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
  name: 'VocabularyManager',
  components: {
    AdminMenu
  },
  data() {
    return {
      formData: {
        word: '',
        translation: '',
        description: ''
      },
      isSubmitting: false,
      submitMessage: '',
      submitStatus: '',
      vocabularyItems: [],
      loading: false,
      error: null,
      showConfirmDialog: false,
      itemToDelete: null,
      isDeleting: false
    }
  },
  mounted() {
    this.fetchVocabulary();
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    async fetchVocabulary() {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://mamanmakuetchehelene.site/vocabulary/all', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.vocabularyItems = response.data;
      } catch (error) {
        console.error('Error fetching vocabulary:', error);
        this.error = 'Failed to load vocabulary items';
      } finally {
        this.loading = false;
      }
    },
    async addVocabulary() {
      this.isSubmitting = true;
      this.submitMessage = '';

      try {
        const token = localStorage.getItem('token');
        await axios.post('https://mamanmakuetchehelene.site/vocabulary/add', this.formData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        // Success
        this.submitMessage = 'Vocabulary added successfully!';
        this.submitStatus = 'success';

        // Reset form
        this.formData = {
          word: '',
          translation: '',
          description: ''
        };

        // Refresh vocabulary list
        this.fetchVocabulary();

      } catch (error) {
        console.error('Error adding vocabulary:', error);
        this.submitMessage = error.response?.data?.message || 'Failed to add vocabulary';
        this.submitStatus = 'error';
      } finally {
        this.isSubmitting = false;
      }
    },
    confirmDelete(item) {
      this.itemToDelete = item;
      this.showConfirmDialog = true;
    },
    cancelDelete() {
      this.itemToDelete = null;
      this.showConfirmDialog = false;
    },
    async deleteItem() {
      if (!this.itemToDelete) return;

      this.isDeleting = true;
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://mamanmakuetchehelene.site/vocabulary/delete/${this.itemToDelete.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Remove from local array
        this.vocabularyItems = this.vocabularyItems.filter(item => item.id !== this.itemToDelete.id);

        // Show success message
        this.submitMessage = 'Vocabulary deleted successfully!';
        this.submitStatus = 'success';

        // Close dialog
        this.showConfirmDialog = false;
        this.itemToDelete = null;
      } catch (error) {
        console.error('Error deleting vocabulary:', error);
        this.submitMessage = error.response?.data?.message || 'Failed to delete vocabulary';
        this.submitStatus = 'error';
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

.form-container {
  max-width: 700px;
}

h2 {
  margin-bottom: 20px;
  color: #2c3e50;
}

.add-form {
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
textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-family: inherit;
  font-size: 14px;
}

textarea {
  resize: vertical;
  min-height: 80px;
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

.submit-message {
  margin-top: 20px;
  padding: 12px;
  border-radius: 5px;
  font-weight: 500;
}

.submit-message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.submit-message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* Table Styles */
.table-container {
  overflow-x: auto;
}

.vocabulary-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.vocabulary-table th,
.vocabulary-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.vocabulary-table th {
  background-color: #f8fafc;
  font-weight: 600;
}

.vocabulary-table tr:hover {
  background-color: #f8fafc;
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