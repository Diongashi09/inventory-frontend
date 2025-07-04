<template>
  <div 
    class="min-h-screen flex items-center justify-center bg-gray-50 p-4"
    :style="bgStyle"
  >
    <div class="max-w-md w-full bg-white p-8 rounded-xl shadow">
      <h2 class="text-xl font-bold mb-4">Create your account</h2>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <!-- Name / Company Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700">I am a:</label>
          <select v-model="form.client_type" required
                  class="mt-1 block w-full border rounded px-3 py-2">
            <option value="individual">Individual</option>
            <option value="company">Company</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            {{ form.client_type==='company' ? 'Company Name' : 'Your Name' }}
          </label>
          <input v-model="form.name" type="text" required
                 class="mt-1 block w-full border rounded px-3 py-2"
                 :placeholder="form.client_type==='company' ? 'Acme Corp.' : 'John Doe'" />
        </div>

        <!-- If company, also ask for contact person -->
        <div v-if="form.client_type==='company'">
          <label class="block text-sm font-medium text-gray-700">Contact Person</label>
          <input v-model="form.contact_person" type="text" required
                 class="mt-1 block w-full border rounded px-3 py-2"
                 placeholder="Jane Smith" />
        </div>

        <!-- email & password -->
        <div>
          <label class="sr-only">Email</label>
          <input v-model="form.email" type="email" required
                 class="mt-1 block w-full border rounded px-3 py-2"
                 placeholder="you@example.com" />
        </div>
        <div>
          <input v-model="form.password" type="password" required
                 class="mt-1 block w-full border rounded px-3 py-2"
                 placeholder="Password" />
        </div>
        <div>
          <input v-model="form.password_confirmation" type="password" required
                 class="mt-1 block w-full border rounded px-3 py-2"
                 placeholder="Confirm Password" />
        </div>

        <!-- optional client fields -->
        <div>
          <input v-model="form.phone" type="tel"
                 class="mt-1 block w-full border rounded px-3 py-2"
                 placeholder="Phone (optional)" />
        </div>
        <div>
          <textarea v-model="form.address"
                    class="mt-1 block w-full border rounded px-3 py-2"
                    rows="2"
                    placeholder="Address (optional)"></textarea>
        </div>
        <div>
          <textarea v-model="form.additional_info"
                    class="mt-1 block w-full border rounded px-3 py-2"
                    rows="2"
                    placeholder="Additional info (optional)"></textarea>
        </div>

        <button type="submit"
                class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                :disabled="isLoading">
          <span v-if="isLoading">Registering…</span>
          <span v-else>Register</span>
        </button>

        <p v-if="errorMessage" class="text-red-600 text-sm mt-2 text-center">
          {{ errorMessage }}
        </p>
      </form>

      <p class="mt-4 text-center text-sm text-gray-600">
        Already have an account?
        <router-link to="/login" class="text-blue-600 hover:underline">
          Log in
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useRouter } from 'vue-router';

import bgImg from '@/assets/supply-chain-representation-with-van-top-view.jpg'


const router = useRouter();
const { register, isLoading, errorMessage } = useAuth();

const form = ref({
  client_type:       'individual',
  name:              '',
  contact_person:    '',
  email:             '',
  password:          '',
  password_confirmation: '',
  phone:             '',
  address:           '',
  additional_info:   '',
});



async function handleRegister() {
  // simple client-side sanity:
  if (form.value.password !== form.value.password_confirmation) {
    return alert("Passwords don't match");
  }

  // strip out contact_person if not needed
  const payload = { ...form.value };
  // if (payload.client_type !== 'company') {
  //   delete payload.contact_person;
  // }

  if(payload.client_type === 'company'){
    payload.company_name = payload.name;
  } else {
    delete payload.company_name;
    delete payload.contact_person;
  }

  try {
    await register(payload);
    router.push({ name: 'Dashboard' });
  } catch (e) {
    // register() already sets `errorMessage`
  }
}
</script>


<!-- <template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 p-4">
    <div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm border border-gray-100">
      <div class="text-center mb-6">
        <h2 class="text-3xl font-extrabold text-gray-900">Let's Join!</h2>
        <p class="mt-2 text-sm text-gray-600">Create your new account</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label for="name" class="sr-only">Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            placeholder="Full Name"
            class="input-modern"
            required
            autocomplete="name"
          />
        </div>
        <div>
          <label for="email" class="sr-only">Email</label>
          <input
            id="email"
            v-model="form.email"
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
            v-model="form.password"
            type="password"
            placeholder="Password"
            class="input-modern"
            required
            autocomplete="new-password"
          />
        </div>
        <div>
          <label for="confirmPassword" class="sr-only">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            placeholder="Confirm Password"
            class="input-modern"
            required
            autocomplete="new-password"
          />
        </div>

        <button type="submit" class="btn-modern-green w-full">Register</button>

        <p v-if="error" class="text-red-600 mt-3 text-sm text-center font-medium">{{ error }}</p>
      </form>

      <div class="mt-6 text-center text-sm">
        <p class="text-gray-600">
          Already have an account?
          <router-link to="/login" class="text-blue-600 hover:text-blue-800 font-medium">
            Log In
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const { register } = useAuth();
const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});
const error = ref('');
const router = useRouter();

const handleRegister = async () => {
  error.value = ''; // Clear previous errors
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Passwords do not match.';
    return;
  }
  if (form.value.password.length < 6) {
    error.value = 'Password must be at least 6 characters.';
    return;
  }

  try {
    await register(
      form.value.name,
      form.value.email,
      form.value.password,
      form.value.confirmPassword,
      3 // Assuming role_id 3 is the default for new registrations (e.g., 'user' or 'customer')
    );
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed.';
  }
};
</script>


<style scoped>
.input-modern {
  @apply block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200;
}
.btn-modern-green {
  @apply bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 shadow-md hover:shadow-lg;
}
</style> -->

<!--   -->

<!-- <template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <form @submit.prevent="handleRegister" class="bg-white p-6 rounded shadow-md w-full max-w-sm">
      <h2 class="text-2xl font-bold mb-4 text-center">Register</h2>

      <input v-model="form.name" type="text" placeholder="Name" class="input mb-2" required />
      <input v-model="form.email" type="email" placeholder="Email" class="input mb-2" required />
      <input v-model="form.password" type="password" placeholder="Password" class="input mb-2" required />
      <input v-model="form.confirmPassword" type="password" placeholder="Confirm Password" class="input mb-2" required />

      <button type="submit" class="btn w-full">Register</button>

      <p v-if="error" class="text-red-500 mt-2 text-sm text-center">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const { register } = useAuth()
const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})
const error = ref('')
const router = useRouter()

const handleRegister = async () => {
    if (form.value.password !== form.value.confirmPassword){
        error.value = 'Passwords do not match'
        return
    }

    try {
        await register({
            name: form.value.name,
            email: form.value.email,
            password: form.value.password,
            password_confirmation: form.value.confirmPassword,
            role_id: 3
        })
        router.push('/')
    } catch (err) {
        error.value = err.response?.data?.message || 'Registration failed'
    }
}

</script>

<style scoped>
 .input {
  @apply block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500;
}
.btn {
  @apply bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700;
}
</style> -->