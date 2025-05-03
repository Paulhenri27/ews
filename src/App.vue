<template>
  <div class="app">
    <router-view />
    <app-footer />
  </div>
</template>

<script>
import AppFooter from '@/components/AppFooter.vue;

export default {
  components: {
    AppFooter
  },
  name: 'App'
}
</script>

<style>
@import 'bootstrap/dist/css/bootstrap.min.css';

html, body, #app {
  height: 100%; /* Full viewport height */
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%; /* Make sure app takes full height */
  display: flex;
  flex-direction: column;
}

body {
  margin: 0;
  padding: 0;
}
</style>
