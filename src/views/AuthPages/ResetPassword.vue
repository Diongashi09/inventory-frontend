<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 p-4">
    <div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm border border-gray-100">
      <div class="text-center mb-6">
        <h2 class="text-3xl font-extrabold text-gray-900">Set New Password</h2>
        <p class="mt-2 text-sm text-gray-600">Enter your new password below</p>
      </div>

      <form @submit.prevent="handleResetPassword" class="space-y-4">
        <div>
          <label for="new-password" class="sr-only">New Password</label>
          <input
            id="new-password"
            v-model="form.password"
            type="password"
            placeholder="New Password"
            class="input-modern"
            required
            autocomplete="new-password"
          />
        </div>
        <div>
          <label for="confirm-password" class="sr-only">Confirm Password</label>
          <input
            id="confirm-password"
            v-model="form.password_confirmation"
            type="password"
            placeholder="Confirm New Password"
            class="input-modern"
            required
            autocomplete="new-password"
          />
        </div>

        <button type="submit" class="btn-modern w-full">Reset Password</button>

        <p v-if="message" class="text-green-600 text-center mt-3 font-medium">{{ message }}</p>
        <p v-if="error" class="text-red-600 text-center mt-2 font-medium">{{ error }}</p>
      </form>

      <div class="mt-6 text-center text-sm">
        <p class="text-gray-600">
          Already reset?
          <router-link to="/login" class="text-blue-600 hover:text-blue-800 font-medium">
            Go to Login
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<!-- <template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <form @submit.prevent="handleResetPassword" class="bg-white p-6 rounded shadow-md w-full max-w-sm">
      <h2 class="text-2xl font-bold mb-4 text-center">Reset Password</h2>

      <input v-model="form.password" type="password" placeholder="New Password" class="input mb-2" required />
      <input v-model="form.password_confirmation" type="password" placeholder="Confirm Password" class="input mb-4" required />

      <button type="submit" class="btn w-full">Reset Password</button>

      <p v-if="message" class="text-green-600 text-center mt-3">{{ message }}</p>
      <p v-if="error" class="text-red-500 text-center mt-2">{{ error }}</p>
    </form>
  </div>
</template> -->

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { resetPassword } = useAuth()
const route = useRoute()
const router = useRouter()

const form = ref({
  password: '',
  password_confirmation: ''
})

const error = ref('')
const message = ref('')

const handleResetPassword = async () => {
  error.value = ''
  message.value = ''

  const token = route.query.token
  const email = route.query.email

  if (!token || !email) {
    error.value = 'Invalid reset link.'
    return
  }

  if (form.value.password !== form.value.password_confirmation) {
    error.value = 'Passwords do not match.';
    return;
  }
  if (form.value.password.length < 6) {
    error.value = 'Password must be at least 6 characters.';
    return;
  }

  try {
    await resetPassword(
      email,
      form.value.password,
      form.value.password_confirmation,
      token
    )
    message.value = 'Password has been reset. You can now log in.'
    setTimeout(() => router.push('/login'), 2000)
  } catch (err) {
    error.value = err.response?.data?.message || 'Reset failed.'
  }
}
</script>

<style scoped>
.input-modern {
  @apply block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200;
}
.btn-modern {
  @apply bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 shadow-md hover:shadow-lg;
}
</style>


<!-- <style scoped>
.input {
  @apply block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500;
}
.btn {
  @apply bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700;
}
</style> -->
