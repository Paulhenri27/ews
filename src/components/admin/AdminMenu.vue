<!-- src/components/admin/AdminMenu.vue -->
<template>
  <div class="admin-menu">
    <div class="admin-header">
      <h2>Admin Panel</h2>
      <span class="admin-badge">Administrator</span>
    </div>

    <nav class="admin-nav">
      <router-link to="/admin" class="nav-item" exact>
        <i class="fas fa-tachometer-alt"></i> Dashboard
      </router-link>
      <router-link to="/admin/reading" class="nav-item">
        <i class="fas fa-book"></i> Reading Content
      </router-link>
      <router-link to="/admin/listening" class="nav-item">
        <i class="fas fa-headphones"></i> Listening Content
      </router-link>
      <router-link to="/admin/vocabulary" class="nav-item">
        <i class="fas fa-language"></i> Vocabulary
      </router-link>
      <router-link to="/" class="nav-item exit">
        <i class="fas fa-sign-out-alt"></i> Exit Admin
      </router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'AdminMenu'
}
</script>

<style scoped>
/* In AdminMenu.vue, update the .admin-menu style */
.admin-menu {
  background-color: #2c3e50;
  color: white;
  width: 250px;
  height: 100vh;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
  z-index: 100;
}

.admin-header {
  padding: 20px;
  border-bottom: 1px solid #3c5168;
}

.admin-header h2 {
  margin: 0 0 10px 0;
  color: #fff;
}

.admin-badge {
  background-color: #3A86FF;
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 12px;
  text-transform: uppercase;
}

.admin-nav {
  padding: 20px 0;
}

.nav-item {
  display: block;
  padding: 15px 20px;
  color: #ecf0f1;
  text-decoration: none;
  transition: background-color 0.2s;
  font-weight: 500;
}

.nav-item:hover, .nav-item.router-link-active {
  background-color: #3A86FF;
  color: white;
}

.nav-item i {
  margin-right: 10px;
  width: 20px;
  text-align: center;
}

.exit {
  margin-top: 30px;
  border-top: 1px solid #3c5168;
}
</style>