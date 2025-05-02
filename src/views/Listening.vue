<template>
  <div>
    <MenuComponent />
    <div class="listening-materials">
      <!-- Header -->
      <header class="header">
        <h1>English Listening Materials</h1>
        <p>
          Improve your English listening skills with our collection of audio materials. Each recording comes with a text transcript to help you follow along. Listening regularly will enhance your comprehension, pronunciation, and overall fluency.
        </p>
      </header>

      <!-- Image Section -->
      <section class="image-section">
        <div class="image-container">
          <img src="@/assets/logo.jpg" alt="Student listening" />
        </div>
        <div class="text-container">
          <p>
            Our listening materials are organized by difficulty level, from beginner (A1) to advanced (C2). Practice with authentic recordings that expose you to different accents, speaking speeds, and vocabulary. Download transcripts to review content at your own pace.
          </p>
          <div class="button-group">
            <button class="free-button">{{ mediaPairs.length }} free audio materials</button>
            <button class="premium-button">Premium: 100+ more materials</button>
          </div>
        </div>
      </section>

      <!-- Tabs -->
      <nav class="tabs">
        <button :class="{ active: currentTab === 'all' }" @click="currentTab = 'all'">all materials</button>
        <button :class="{ active: currentTab === 'new' }" @click="currentTab = 'new'">new materials</button>
      </nav>

      <!-- Loading and Error States -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading listening materials...</p>
      </div>

      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- Content Sections -->
      <section v-else-if="currentTab === 'all'" class="content-section">
        <div v-for="(levelItems, level) in groupedMediaPairs" :key="level">
          <h2>Level {{ level }}</h2>
          <table>
            <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Audio</th>
              <th>Transcript</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in levelItems" :key="item.id">
              <td>{{ item.title || item.audioFile.originalFilename }}</td>
              <td>{{ item.description || 'No description available' }}</td>
              <td class="audio-cell">
                <audio controls class="audio-player">
                  <source :src="item.audioFile.accessUrl" :type="item.audioFile.contentType">
                  Your browser does not support the audio element.
                </audio>
              </td>
              <td class="text-cell">
                <a :href="item.textFile.accessUrl" target="_blank" class="text-link">
                  <i class="far fa-file-alt"></i>
                </a>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- New Materials Tab -->
      <section v-else-if="currentTab === 'new'" class="content-section">
        <h2>New Listening Materials</h2>
        <table>
          <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Level</th>
            <th>Audio</th>
            <th>Transcript</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in recentMediaPairs" :key="item.id">
            <td>{{ item.title || item.audioFile.originalFilename }}</td>
            <td>{{ item.description || 'No description available' }}</td>
            <td>{{ item.level }}</td>
            <td class="audio-cell">
              <audio controls class="audio-player">
                <source :src="item.audioFile.accessUrl" :type="item.audioFile.contentType">
                Your browser does not support the audio element.
              </audio>
            </td>
            <td class="text-cell">
              <a :href="item.textFile.accessUrl" target="_blank" class="text-link">
                <i class="far fa-file-alt"></i>
              </a>
            </td>
          </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<script>
import MenuComponent from '@/components/Menu.vue'
import axios from 'axios';

export default {
  name: 'ListeningView',
  components: {
    MenuComponent
  },
  data() {
    return {
      currentTab: 'all',
      mediaPairs: [],
      loading: true,
      error: null
    };
  },
  computed: {
    groupedMediaPairs() {
      // Group media pairs by level
      const grouped = {};
      this.mediaPairs.forEach(item => {
        const level = item.level || 'Uncategorized';
        if (!grouped[level]) {
          grouped[level] = [];
        }
        grouped[level].push(item);
      });

      // Define level order
      const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Uncategorized'];

      // Create a new ordered object
      const orderedGroups = {};

      // Add levels in the correct order (only if they exist in grouped)
      levelOrder.forEach(level => {
        if (grouped[level] && grouped[level].length > 0) {
          orderedGroups[level] = grouped[level];
        }
      });

      // Add any other levels not in our predefined order
      Object.keys(grouped).forEach(level => {
        if (!levelOrder.includes(level)) {
          orderedGroups[level] = grouped[level];
        }
      });

      return orderedGroups;
    },
    recentMediaPairs() {
      // Sort media pairs by createdAt and get the 10 most recent
      return [...this.mediaPairs]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10);
    }
  },
  mounted() {
    this.fetchMediaPairs();
  },
  methods: {
    async fetchMediaPairs() {
      try {
        this.loading = true;

        // Get the stored token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
          this.error = "Authentication required. Please log in.";
          this.loading = false;
          return;
        }

        const response = await axios.get('https://mamanmakuetchehelene.site/api/media-pairs', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        this.mediaPairs = response.data;
        this.loading = false;
      } catch (err) {
        console.error('Error fetching media pairs:', err);
        this.error = "Failed to load listening materials. Please try again later.";
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.listening-materials {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  margin-bottom: 30px;
}

.header h1 {
  font-size: 32px;
  margin-bottom: 15px;
  color: #3A86FF;
}

.header p {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
}

.image-section {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  align-items: center;
}

.image-container {
  flex: 0 0 300px;
}

.image-container img {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.text-container {
  flex: 1;
}

.text-container p {
  margin-bottom: 20px;
  line-height: 1.6;
}

.button-group {
  display: flex;
  gap: 15px;
}

.free-button {
  background-color: #3A86FF;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.free-button:hover {
  background-color: #2a76ef;
}

.premium-button {
  background-color: #FFD166;
  color: #333;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.premium-button:hover {
  background-color: #ffc633;
}

.tabs {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}

.tabs button {
  background-color: transparent;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: bold;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.2s;
}

.tabs button.active {
  background-color: #3A86FF;
  border-radius: 5px;
  color: white;
}

.content-section {
  margin-bottom: 40px;
}

.content-section h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #3A86FF;
  border-bottom: 2px solid #3A86FF;
  padding-bottom: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border-radius: 5px;
  overflow: hidden;
}

table th,
table td {
  padding: 15px;
  text-align: left;
}

table th {
  background-color: #3A86FF;
  color: white;
  font-weight: 500;
}

table tr {
  background-color: white;
  border-bottom: 1px solid #f0f0f0;
}

table tr:nth-child(even) {
  background-color: #f9f9f9;
}

table tr:hover {
  background-color: rgba(58, 134, 255, 0.05);
}

.audio-cell {
  min-width: 250px;
}

.audio-player {
  width: 100%;
  height: 40px;
}

.text-cell {
  text-align: center;
  width: 80px;
}

.text-link {
  color: #3A86FF;
  font-size: 24px;
  display: inline-block;
  transition: color 0.2s;
}

.text-link:hover {
  color: #FFD166;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.loading-spinner {
  border: 4px solid rgba(58, 134, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #3A86FF;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #ff4757;
  text-align: center;
  font-size: 18px;
  margin: 40px 0;
  padding: 20px;
  background-color: #ffe6e6;
  border-radius: 5px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .image-section {
    flex-direction: column;
  }

  .image-container {
    flex: 0 0 auto;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }

  .header h1 {
    font-size: 28px;
  }

  table th,
  table td {
    padding: 10px;
  }

  .audio-cell {
    min-width: 180px;
  }
}

@media (max-width: 580px) {
  .header h1 {
    font-size: 24px;
  }

  .button-group {
    flex-direction: column;
  }

  .tabs button {
    padding: 8px 12px;
    font-size: 14px;
  }

  table {
    font-size: 14px;
  }

  /* Convert table to card-like layout on small screens */
  table, thead, tbody, th, td, tr {
    display: block;
  }

  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  tr {
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 1px 5px rgba(0,0,0,0.1);
  }

  td {
    position: relative;
    padding-left: 40%;
    border: none;
    border-bottom: 1px solid #eee;
  }

  td:before {
    position: absolute;
    top: 12px;
    left: 10px;
    width: 35%;
    white-space: nowrap;
    font-weight: bold;
    color: #3A86FF;
  }


  .audio-cell, .text-cell {
    width: 100%;
    min-width: 100%;
    text-align: left;
  }

  .audio-player {
    width: 100%;
    height: 35px;
    margin-top: 5px;
  }

  .text-cell {
    text-align: center;
  }

  .text-link {
    font-size: 20px;
    display: block;
    margin-top: 5px;
  }


}

@media (max-width: 400px) {
  .content-section h2 {
    font-size: 20px;
  }

  td {
    padding-left: 35%;
  }

  td:before {
    width: 30%;
  }
}
</style>