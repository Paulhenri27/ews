<template>
  <div>
    <MenuComponent />
    <div class="vocabulary-container">
      <!-- Header -->
      <header class="header">
        <h1>English Vocabulary Builder</h1>
        <p>
          Expand your English vocabulary with our comprehensive collection of words and phrases.
          Each entry includes the original word, translation, and a contextual example to help you
          understand how it's used in everyday conversations.
        </p>
      </header>

      <!-- Image Section -->
      <section class="image-section">
        <div class="image-container">
          <img src="@/assets/logo.jpg" alt="Vocabulary learning" />
        </div>
        <div class="text-container">
          <p>
            Building a strong vocabulary is essential for language fluency. Use this collection to learn new words,
            review existing ones, and see how they're used in context. Regular practice with these vocabulary items
            will significantly improve your speaking and writing skills.
          </p>
          <div class="button-group">
            <button class="free-button">{{ vocabulary.length }} vocabulary items</button>
            <button class="premium-button">Premium: 1000+ words</button>
          </div>
        </div>
      </section>

      <!-- Tabs -->
      <nav class="tabs">
        <button :class="{ active: currentTab === 'all' }" @click="currentTab = 'all'">all words</button>
        <button :class="{ active: currentTab === 'new' }" @click="currentTab = 'new'">recently added</button>
      </nav>

      <!-- Loading and Error States -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading vocabulary...</p>
      </div>

      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- All Words Tab -->
      <section v-else-if="currentTab === 'all'" class="content-section">
        <h2>All Vocabulary Words</h2>
        <table>
          <thead>
          <tr>
            <th>Word</th>
            <th>Translation</th>
            <th>Description</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in vocabulary" :key="item.id">
            <td data-label="Word"><strong>{{ item.word }}</strong></td>
            <td data-label="Translation">{{ item.translation }}</td>
            <td data-label="Description">{{ item.description }}</td>
          </tr>
          </tbody>
        </table>
      </section>

      <!-- Recently Added Tab -->
      <section v-else-if="currentTab === 'new'" class="content-section">
        <h2>Recently Added Words</h2>
        <table>
          <thead>
          <tr>
            <th>Word</th>
            <th>Translation</th>
            <th>Description</th>
            <th>Added</th>
          </tr>
          </thead>
          <tbody>
          <!-- Recently Added Tab -->
          <tr v-for="item in recentVocabulary" :key="item.id">
            <td data-label="Word"><strong>{{ item.word }}</strong></td>
            <td data-label="Translation">{{ item.translation }}</td>
            <td data-label="Description">{{ item.description }}</td>
            <td data-label="Date Added">{{ formatDate(item.createdAt) }}</td>
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
  name: 'VocabularyView',
  components: {
    MenuComponent
  },
  data() {
    return {
      currentTab: 'all',
      vocabulary: [],
      loading: true,
      error: null
    };
  },
  computed: {
    recentVocabulary() {
      return [...this.vocabulary]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 15);
    }
  },
  mounted() {
    this.fetchVocabulary();
  },
  methods: {
    async fetchVocabulary() {
      try {
        this.loading = true;

        // Get the stored token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
          this.error = "Authentication required. Please log in.";
          this.loading = false;
          return;
        }

        const response = await axios.get('https://mamanmakuetchehelene.site/vocabulary/today', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        this.vocabulary = response.data;
        this.loading = false;
      } catch (err) {
        console.error('Error fetching vocabulary:', err);
        this.error = "Failed to load vocabulary. Please try again later.";
        this.loading = false;
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }
};
</script>

<style scoped>
.vocabulary-container {
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

/* Column width distribution */
table th:nth-child(1),
table td:nth-child(1) {
  width: 30%;
}

table th:nth-child(2),
table td:nth-child(2) {
  width: 30%;
}

table th:nth-child(3),
table td:nth-child(3) {
  width: 40%;
}

/* For the recent tab that has 4 columns, adjust the widths */
section[v-else-if="currentTab === 'new'"] table th:nth-child(1),
section[v-else-if="currentTab === 'new'"] table td:nth-child(1) {
  width: 25%;
}

section[v-else-if="currentTab === 'new'"] table th:nth-child(2),
section[v-else-if="currentTab === 'new'"] table td:nth-child(2) {
  width: 25%;
}

section[v-else-if="currentTab === 'new'"] table th:nth-child(3),
section[v-else-if="currentTab === 'new'"] table td:nth-child(3) {
  width: 35%;
}

section[v-else-if="currentTab === 'new'"] table th:nth-child(4),
section[v-else-if="currentTab === 'new'"] table td:nth-child(4) {
  width: 15%;
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
    padding: 20px 10px;
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

  table th:nth-child(3),
  table td:nth-child(3) {
    width: 100%;
  }

  /* Card style for mobile */
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
    padding: 10px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  td {
    border: none;
    position: relative;
    padding: 30px 10px 10px 10px; /* Top padding for label */
    margin-bottom: 5px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  td:last-child {
    border-bottom: none;
  }

  /* Use data attributes for the label content */
  td:before {
    content: attr(data-label);
    position: absolute;
    top: 8px;
    left: 10px;
    width: 100%;
    font-weight: bold;
    color: #3A86FF;
    font-size: 0.85em;
    text-transform: uppercase;
  }

  /* Remove previous pseudo-element content */
  td:nth-of-type(1):before,
  td:nth-of-type(2):before,
  td:nth-of-type(3):before,
  td:nth-of-type(4):before {
    content: attr(data-label);
  }

  /* Add more space for description */
  td[data-label="Description"] {
    min-height: 60px;
  }
}
</style>