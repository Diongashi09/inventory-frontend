<template>
    <!-- <p>Current route: {{ currentPath }}</p>
    <p>Public: {{ isPublicRoute  }}</p> -->
    <!-- <nav v-if="isPublicRoute" class="text-center mt-1 space-x-4">
      <router-link to="/login">Login</router-link> |
      <router-link to="/register">Register</router-link>
    </nav> -->
    <router-view />
  
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';

const { initializeAuth } = useAuth();

onMounted(() => {
  // Call initializeAuth to check for an existing token in localStorage
  // and re-establish the user's session if valid.
  initializeAuth();
});

// import { computed, watch } from 'vue';
// import { useRoute } from 'vue-router'

// const route = useRoute()

// const currentPath = computed(() => route.path)

// const publicPages = ['/login', '/register', '/forgot-password', '/reset-password'];
// const isPublicRoute = computed(() => publicPages.includes(currentPath.value))


// watch(() => route.path, (newPath) => {
//   console.log('ROUTE CHANGED to: ', newPath);
// })
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');


#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>