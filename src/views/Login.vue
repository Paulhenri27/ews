<template>
  <div :class="['page', { effect: isEffectActive }]">
    <div class="menu">
      <img :src="exampleImage" alt="Logo" class="image-menu">
    </div>
    <div class="views">
      <video class="background-video" autoplay muted loop>
        <source :src="backgroundVideo" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div class="split">
        <div class="form-container">
          <div class="top">
            <div class="title">Welcome Back!</div>
            <div class="sub-title">Log in to your account</div>
          </div>
          <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
          <form @submit.prevent="handleLogin">
            <input
                type="email"
                id="email"
                placeholder="Email"
                v-model="email"
                required
            />
            <input
                type="password"
                id="password"
                placeholder="Password"
                v-model="password"
                required
            />
            <button type="submit">Login</button>
            <button type="button" class="oauth-button" @click="handleOAuth2Login">
              Login with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { login } from '../services/authService.js';
import logoImage from '@/assets/logo.jpg';
import backgroundVideo from '@/assets/form-video.mp4';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      isEffectActive: false,
      exampleImage: logoImage, // Update path to your logo
      backgroundVideo:backgroundVideo, // Update path to your video
    };
  },
  methods: {
    ...mapActions(['setToken']),
    async handleLogin() {
      try {
        const { token } = await login({ email: this.email, password: this.password });
        this.setToken(token);
        this.$router.push('/home');
      } catch (error) {
        this.errorMessage = 'Invalid credentials';
      }
    },
    handleOAuth2Login() {
      window.location.href = 'https://mamanmakuetchehelene.site/oauth2/authorization/google';
    }
  },
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.menu {
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0 15px;
}

.image-menu {
  width: 80px;
}

.views {
  flex: 1;
  display: flex;
  flex-direction: row-reverse;
  background: transparent;
  height: calc(100% - 80px); /* Adjust based on your menu height */
  position: relative; /* For proper positioning of background video */
}

.split {
  max-width: 800px;
  height: 100%;
  z-index: 1;
  background-color: rgba(58, 134, 255, 0.3);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}

.background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

.form-container {
  display: flex;
  flex-direction: column;
  width: 600px;
}

.form-container .top {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 50px;
  margin-bottom: 50px;
}

.form-container .top .title {
  color: #fff;
  font-size: 34px;
}

.form-container .top .sub-title {
  color: #fff;
}

.form-container form {
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  gap: 15px;
  align-items: flex-end;
  margin-right: 25px;
}

.form-container form input {
  height: 25px;
  width: 70%;
  border: 1px solid #3A86FF;
  border-radius: 4px;
  padding: 4px 8px;
}

.form-container form button {
  width: 175px;
  background-color: #FFD166;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.form-container form button:hover {
  background-color: #ffc633;
}

.oauth-button {
  background-color: #3A86FF !important;
  color: white !important;
  border: 1px solid #FFFFFF !important;
}

.oauth-button:hover {
  background-color: #2a75ee !important;
}
.effect {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.effect::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  z-index: 4;
  pointer-events: none;
}

.views .split .form-container .error {
  color: #FFD166;
  font-size: 24px;
  margin-bottom: 10px;
  margin-right: 41px;
  text-align: end;
}

@media (max-width: 450px) {
  .form-container form {
    margin-left: 20%;
  }

  .form-container .top {
    margin-right: 25px;
  }

  .views .split .form-container .error {
    font-size: 20px;
  }
}

@media (max-width: 350px) {
  .form-container .top {
    margin-right: 25px;
  }

  .views .split .form-container .error {
    font-size: 15px;
  }
}
</style>

