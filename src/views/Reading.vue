<template>
  <div>
    <MenuComponent />
    <div class="english-texts">
      <!-- Header -->
      <header class="header">
        <h1>English Texts for Beginners</h1>
        <p>
          English texts for beginners to practice reading and comprehension online and for free. Practicing your comprehension of written English will both improve your vocabulary and understanding of grammar and word order. The texts below are designed to help you develop while giving you an instant evaluation of your progress.
        </p>
      </header>

      <!-- Image Section -->
      <section class="image-section">
        <div class="image-container">
          <img src="@/assets/reading.jpg" alt="Student studying" />
        </div>
        <div class="text-container">
          <p>
            Prepared by experienced English teachers, the texts, articles, and conversations are brief and appropriate to your level of proficiency. You will feel both challenged and accomplished! You can even download (as PDF) and print the texts and exercises. It's enjoyable, fun, and free. Good luck!
          </p>
          <div class="button-group">
            <button class="free-button">{{ pdfs.length }} free texts</button>
            <button class="premium-button">Premium: 200+ texts</button>
          </div>
        </div>
      </section>

      <!-- Tabs -->
      <nav class="tabs">
        <button :class="{ active: currentTab === 'all' }" @click="currentTab = 'all'">all texts</button>
        <button :class="{ active: currentTab === 'new' }" @click="currentTab = 'new'">new texts</button>
      </nav>

      <!-- Loading and Error States -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading reading materials...</p>
      </div>

      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- Content Sections -->
      <section v-else-if="currentTab === 'all'" class="content-section">
        <div v-for="(levelPdfs, level) in groupedPdfs" :key="level">
          <h2>Level {{ level }}</h2>
          <table>
            <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>PDF</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="pdf in levelPdfs" :key="pdf.id">
              <td><a :href="pdf.accessUrl" target="_blank">{{ pdf.originalFilename }}</a></td>
              <td>{{ pdf.description || 'No description available' }}</td>
              <td class="pdf-cell">
                <a :href="pdf.accessUrl" download class="pdf-link">
                  <i class="far fa-file-pdf"></i>
                </a>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- New Texts Tab -->
      <section v-else-if="currentTab === 'new'" class="content-section">
        <h2>New Texts</h2>
        <table>
          <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Level</th>
            <th>PDF</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="pdf in recentPdfs" :key="pdf.id">
            <td><a :href="pdf.accessUrl" target="_blank">{{ pdf.originalFilename }}</a></td>
            <td>{{ pdf.description || 'No description available' }}</td>
            <td>{{ pdf.level }}</td>
            <td class="pdf-cell">
              <a :href="pdf.accessUrl" download class="pdf-link">
                <i class="far fa-file-pdf"></i>
              </a>
            </td>
          </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
  <FooterComponent />
  <FooterComponent />
</template>

<script>
import MenuComponent from '@/components/Menu.vue'
import FooterComponent from '@/components/AppFooter.vue'
import axios from 'axios';

export default {
  name: 'ReadingView',
  components: {
    MenuComponent,
    FooterComponent
  },
  data() {
    return {
      currentTab: 'all',
      pdfs: [],
      loading: true,
      error: null
    };
  },
  computed: {
    groupedPdfs() {
      // Group PDFs by level
      const grouped = {};
      this.pdfs.forEach(pdf => {
        const level = pdf.level || 'Uncategorized';
        if (!grouped[level]) {
          grouped[level] = [];
        }
        grouped[level].push(pdf);
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
    // Keep the recentPdfs computed property as is
    recentPdfs() {
      return [...this.pdfs]
          .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
          .slice(0, 10);
    }
  },
  mounted() {
    this.fetchPdfs();
  },
  methods: {
    async fetchPdfs() {
      try {
        this.loading = true;

        // Get the stored token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
          this.error = "Authentication required. Please log in.";
          this.loading = false;
          return;
        }

        const response = await axios.get('https://mamanmakuetchehelene.site/api/files/type/PDF', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        this.pdfs = response.data;
        this.loading = false;
      } catch (err) {
        console.error('Error fetching PDFs:', err);
        this.error = "Failed to load reading materials. Please try again later.";
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
/* General Styles */
.english-texts {
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
}

.image-container {
  flex: 0 0 500px;
}

.image-container img {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
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

.pdf-cell {
  text-align: center;
  width: 80px;
}

.pdf-link {
  color: #3A86FF;
  font-size: 24px;
  display: inline-block;
  transition: color 0.2s;
}

.pdf-link:hover {
  color: #FFD166;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.text-container {
  flex: 1;
  padding: 25px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  height: 10%;
}

.text-container:hover {
  box-shadow: 0 8px 16px rgba(58, 134, 255, 0.2);
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
}

@media (max-width: 480px) {
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
    display: none;
  }
}
</style>