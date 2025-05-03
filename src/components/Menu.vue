<template>
  <div class="menu-container">
    <!-- Desktop Menu -->
    <div class="menu">
      <div class="menu-left">
        <a href="/home">
          <img src="@/assets/logo.jpg" alt="Logo" class="logo" />
        </a>
      </div>

      <div  v-if="isAuthenticated"  class="menu-center" :class="{ 'menu-mobile-open': isMobileMenuOpen }">
        <router-link to="/reading" class="menu-link">Reading</router-link>
        <router-link to="/listening" class="menu-link">Listening</router-link>
        <router-link to="/vocabulary" class="menu-link">Vocabulary</router-link>
      </div>
      <div v-else class="menu-center-empty"></div>

      <div class="menu-right">
        <template v-if="isAuthenticated">
        <router-link to="/chat" class="icon-link">
          <i class="fas fa-comment"></i>
        </router-link>
        <button v-if="isAdmin" @click="goToAdminPanel" class="admin-button">
          Panel
        </button>
        </template>
        <template v-else>
          <router-link to="/login" class="auth-button login">Login</router-link>
          <router-link to="/register" class="auth-button signup">Sign Up</router-link>
        </template>
      </div>

      <!-- Mobile Menu Toggle -->
      <div v-if="isAuthenticated" class="burger-menu" @click="toggleMobileMenu">
        <div class="burger-line" :class="{ 'line1': isMobileMenuOpen }"></div>
        <div class="burger-line" :class="{ 'line2': isMobileMenuOpen }"></div>
        <div class="burger-line" :class="{ 'line3': isMobileMenuOpen }"></div>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <div class="mobile-overlay" v-if="isMobileMenuOpen" @click="closeMobileMenu"></div>
  </div>
</template>

<script>
export default {
  name: 'MenuComponent',
  data() {
    return {
      isMobileMenuOpen: false,
      isAdmin: false,
      user : {},
    };
  },
  computed:{
    isAuthenticated() {
      // Check if token exists and is not expired
      const token = localStorage.getItem('token');
      if (!token) return false;

      try {
        // Basic token expiration check
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp > Date.now() / 1000;
      } catch (e) {
        return false;
      }
    }
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
      if (this.isMobileMenuOpen) {
        document.body.classList.add('menu-open');
      } else {
        document.body.classList.remove('menu-open');
      }
    },

    closeMobileMenu() {
      this.isMobileMenuOpen = false;
      document.body.classList.remove('menu-open');
    },
    goToAdminPanel() {
      this.$router.push('/admin');
    }
  },
  mounted() {

    const userString = localStorage.getItem('user');

    if (userString) {
      try {
        const userObj = JSON.parse(userString);
        this.isAdmin = userObj.role === 'ADMIN';
        this.user = userObj;
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.isAdmin = false;
      }
    } else {
      this.isAdmin = false;
    }
  }
};
</script>

<style scoped>
.menu-container {
  position: relative;
  width: 100%;
}

.menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 70px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.menu-left {
  display: flex;
  align-items: center;
}

.logo {
  height: 50px;
  width: auto;
}

.menu-center {
  display: flex;
  gap: 30px;
}

.menu-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  font-size: 16px;
  padding: 5px 0;
  position: relative;
}

.menu-link:after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: #3494E6;
  transition: width 0.3s;
}

.menu-link:hover:after {
  width: 100%;
}

.menu-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* Add these styles to your <style> section */
.auth-button {
  padding: 8px 15px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  display: inline-block;
}

.auth-button.login {
  background-color: #3494E6; /* Blue color, matching the admin button */
  color: white;
}

.auth-button.login:hover {
  background-color: #2980b9; /* Darker blue on hover */
}

.auth-button.signup {
  background-color: #F9CA24; /* Yellow color */
  color: #333;
}

.auth-button.signup:hover {
  background-color: #F0B90B; /* Darker yellow on hover */
}

.icon-link {
  color: #333;
  font-size: 20px;
}

.admin-button {
  background-color: #3494E6;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.admin-button:hover {
  background-color: #2980b9;
}

.burger-menu {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 20px;
  cursor: pointer;
  z-index: 102;
}

.burger-line {
  width: 100%;
  height: 3px;
  background-color: #333;
  transition: all 0.3s ease;
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

/* Responsive styles */
@media (max-width: 768px) {
  .menu-center {
    position: fixed;
    top: 0;
    right: -250px;
    width: 250px;
    height: 100vh;
    background: white;
    flex-direction: column;
    padding: 80px 20px 20px;
    z-index: 101;
    overflow-y: auto;
    transition: right 0.3s ease;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  }

  body.menu-open {
    overflow: hidden;
  }

  .menu-mobile-open {
    right: 0;
  }

  .burger-menu {
    display: flex;
  }

  /* Burger animation */
  .line1 {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .line2 {
    opacity: 0;
  }

  .line3 {
    transform: rotate(-45deg) translate(5px, -5px);
  }
}
</style>