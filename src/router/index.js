import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Reading from '../views/Reading.vue'


const isAuthenticated = () => {
  const token = localStorage.getItem('token')
  if (!token) return false

  try {
    // Decode and check token expiration
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp > Date.now() / 1000
  } catch (e) {
    return false
  }
}

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/reading',
    name: 'Reading',
    component: Reading,
    meta: { requiresAuth: true }
  },
  {
    path: '/listening',
    name: 'Listening',
    component: () => import('../views/Listening.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/vocabulary',
    name: 'Vocabulary',
    component: () => import('../views/Vocabulary.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('../views/Chat.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    component: () => import('@/views/admin/Dashboard.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/reading',
    component: () => import('@/views/admin/ReadingManager.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/listening',
    component: () => import('@/views/admin/ListeningManager.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/vocabulary',
    component: () => import('@/views/admin/VocabularyManager.vue'),
    meta: { requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})


router.beforeEach((to, from, next) => {
  // Check if route requires admin role
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    // Get user from localStorage
    const userStr = localStorage.getItem('user');

    if (!userStr) {
      // No user found, redirect to login
      next('/login');
      return;
    }

    try {
      // Parse user object
      const user = JSON.parse(userStr);

      // Check if user has ADMIN role
      if (user.role !== 'ADMIN') {
        // Not an admin, redirect to home
        next('/home');
        return;
      }

      // User is an admin, proceed
      next();
    } catch (error) {
      console.error('Error parsing user object:', error);
      next('/login');
    }
  } else {
    // Not an admin route, proceed normally
    next();
  }
})
export default router