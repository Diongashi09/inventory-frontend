<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 p-4">
    <div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm border border-gray-100">
      <div class="text-center mb-6">
        <h2 class="text-3xl font-extrabold text-gray-900">Password Reset</h2>
        <p class="mt-2 text-sm text-gray-600">Enter your email to receive a reset link</p>
      </div>

      <form @submit.prevent="handleForgotPassword" class="space-y-5">
        <div>
          <label for="email" class="sr-only">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Your email address"
            class="input-modern"
            required
            autocomplete="email"
          />
        </div>
        <button type="submit" class="btn-modern w-full">Send Reset Link</button>

        <p v-if="message" class="text-green-600 text-center mt-3 font-medium">{{ message }}</p>
        <p v-if="error" class="text-red-600 text-center mt-2 font-medium">{{ error }}</p>
      </form>

      <div class="mt-6 text-center text-sm">
        <p>
          <router-link to="/login" class="text-blue-600 hover:text-blue-800 font-medium">
            Remembered your password? Go to Login
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useRouter } from 'vue-router'; // Import useRouter

const { sendPasswordReset } = useAuth();
const email = ref('');
const message = ref('');
const error = ref('');
const router = useRouter(); // Initialize useRouter

const handleForgotPassword = async () => {
  message.value = '';
  error.value = '';
  try {
    await sendPasswordReset( email.value );
    message.value = 'If an account with that email exists, a password reset link has been sent.';
    // Optionally redirect to login after a delay if you want
    // setTimeout(() => router.push('/login'), 5000);
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to send reset link. Please try again.';
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
</style>

<!-- <template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <form @submit.prevent="handleForgotPassword" class="bg-white p-6 rounded shadow-md w-full max-w-sm">
      <h2 class="text-2xl font-bold mb-4 text-center">Forgot Password</h2>

      <input v-model="email" type="email" placeholder="Enter your email" class="input mb-4" required />
      <button type="submit" class="btn w-full">Send Reset Link</button>

      <p v-if="message" class="text-green-600 text-center mt-3">{{ message }}</p>
      <p v-if="error" class="text-red-500 text-center mt-2">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { forgotPassword } = useAuth()
const email = ref('')
const message = ref('')
const error = ref('')

const handleForgotPassword = async () => {
  message.value = ''
  error.value = ''
  try {
    await forgotPassword({ email: email.value })
    message.value = 'Reset link sent to your email.'
  } catch (err) {
    error.value = err.response?.data?.message || 'Something went wrong.'
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
