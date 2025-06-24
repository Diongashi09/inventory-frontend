<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-6">Login to Your Account</h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="••••••••"
            required
          />
        </div>

        <div v-if="errorMessage" class="text-red-600 text-sm text-center">
          {{ errorMessage }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span v-if="isLoading">Logging in...</span>
            <span v-else>Login</span>
          </button>
        </div>
      </form>

      <div class="mt-6 text-center">
        <router-link
          :to="{ name: 'ForgotPassword' }"
          class="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Forgot your password?
        </router-link>
      </div>
      <div class="mt-4 text-center">
        Don't have an account?
        <router-link
          :to="{ name: 'Register' }"
          class="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Register here
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const email = ref('');
const password = ref('');
const router = useRouter();
const { login, isAuthenticated, isLoading, errorMessage, clearErrorMessage } = useAuth();

// Watch for authentication status changes
watch(isAuthenticated, (newValue) => {
  if (newValue) {
    router.push({ name: 'Dashboard' }); // Redirect to dashboard on successful login
  }
});

// Clear error message when email or password changes
watch([email, password], () => {
  clearErrorMessage();
});

const handleLogin = async () => {
  await login(email.value, password.value);
  // The watch on isAuthenticated will handle the redirect if login is successful.
  // The errorMessage ref from useAuth will automatically update if there's an error.
};
</script>

<style scoped>
/* Add any component-specific styles here if necessary */
</style>


<!-- space -->

<!-- <template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 p-4">
    <div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm border border-gray-100">
      <div class="text-center mb-6">
        <h2 class="text-3xl font-extrabold text-gray-900">Welcome Back!</h2>
        <p class="mt-2 text-sm text-gray-600">Sign in to your account</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label for="email" class="sr-only">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Email address"
            class="input-modern"
            required
            autocomplete="email"
          />
        </div>
        <div>
          <label for="password" class="sr-only">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Password"
            class="input-modern"
            required
            autocomplete="current-password"
          />
        </div>

        <button type="submit" class="btn-modern w-full">Log In</button>

        <p v-if="error" class="text-red-600 mt-3 text-sm text-center font-medium">{{ error }}</p>
      </form>

      <div class="mt-6 text-center text-sm space-y-3">
        <p>
          <router-link to="/forgot-password" class="text-blue-600 hover:text-blue-800 font-medium">
            Forgot your password?
          </router-link>
        </p>
        <p class="text-gray-600">
          Don't have an account?
          <router-link to="/register" class="text-green-600 hover:text-green-800 font-medium">
            Sign Up
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const { login, isAuthenticated, isLoading, errorMessage, clearErrorMessage } = useAuth();
const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

const handleLogin = async () => {
  error.value = ''; // Clear previous errors
  try {
    await login({ email: email.value, password: password.value });
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed. Please check your credentials.';
  }
};
</script>

<style scoped>
.input-modern {
  @apply block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200;
}
.btn-modern {
  @apply bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 shadow-md hover:shadow-lg;
}
</style> -->

<!-- space -->


<!-- <template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <form @submit.prevent="handleLogin" class="bg-white p-6 rounded shadow-md w-full max-w-sm">
      <h2 class="text-2xl font-bold mb-4 text-center">Login</h2>

      <input v-model="email" type="email" placeholder="Email" class="input mb-3" required />
      <input v-model="password" type="password" placeholder="Password" class="input mb-4" required />

      <button type="submit" class="btn w-full">Login</button>

      <p v-if="error" class="text-red-500 mt-2 text-sm text-center">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
 import { ref } from 'vue'
 import { useRouter } from 'vue-router'
 import { useAuth } from '@/composables/useAuth'

 const { login } = useAuth()
 const email = ref('')
 const password = ref('')
 const error = ref('')
 const router = useRouter()

 const handleLogin = async () => {
    try {
        await login({email: email.value, password: password.value})
        router.push('/')
    } catch (err) {
        error.value = err.response?.data?.message || 'Login failed'
    }
 }
</script>

<style scoped>
.input {
  @apply block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500;
}
.btn {
  @apply bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700;
}
</style> -->