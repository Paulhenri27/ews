<!-- src/views/admin/Dashboard.vue -->
<template>
  <div class="admin-layout">
    <AdminMenu />
    <div class="admin-content">
      <h1>Admin Dashboard</h1>
    </div>
  </div>
</template>

<script>
import AdminMenu from '@/components/admin/AdminMenu.vue';
import axios from 'axios';

export default {
  name: 'AdminDashboard',
  components: {
    AdminMenu
  },
  data() {
    return {
      stats: {
        readingCount: 0,
        listeningCount: 0,
        vocabularyCount: 0,
        userCount: 0
      },
      loading: false,
      error: null
    }
  },
  mounted() {
    this.fetchStats();
  },
  methods: {
    async fetchStats() {
      try {
        this.loading = true;
        const token = localStorage.getItem('token');

        if (!token) {
          this.$router.push('/login');
          return;
        }

        const response = await axios.get('https://mamanmakuetchehelene.site/admin/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        this.stats = response.data;
        this.loading = false;
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        this.error = "Failed to load statistics";
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
/* In ReadingManager.vue, update the .admin-layout and .admin-content styles */
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

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.stat-value {
  font-size: 36px;
  font-weight: bold;
  color: #3A86FF;
  margin-bottom: 8px;
}

.stat-label {
  color: #7f8c8d;
  font-size: 14px;
  text-transform: uppercase;
}

.quick-actions {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

h2 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.action-btn {
  background-color: #3A86FF;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: #2a76ef;
}
</style>