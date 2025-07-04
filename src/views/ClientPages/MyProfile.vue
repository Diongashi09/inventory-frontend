<template>
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">My Profile</h1>
  
      <div v-if="isLoading" class="text-center text-gray-500">Loading your profile...</div>
      <div v-else-if="errorMessage" class="text-red-600 text-center p-4 bg-red-100 border border-red-200 rounded-md">
        {{ errorMessage }}
      </div>
      <div v-else-if="!clientProfile" class="text-center text-gray-500 p-4 bg-gray-50 rounded-md">
        No client profile found for your account. Please contact support.
      </div>
      <div v-else-if="clientProfile" class="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto">
        <form @submit.prevent="handleProfileUpdate" class="space-y-4">
          <!-- User Email (Read-only) -->
          <div>
            <label for="userEmail" class="block text-sm font-medium text-gray-700">Login Email</label>
            <input
              type="email"
              id="userEmail"
              :value="user?.email"
              class="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm cursor-not-allowed"
              readonly
            />
            <p class="mt-1 text-xs text-gray-500">Your login email cannot be changed here.</p>
          </div>
  
          <!-- Client Name / Company Name (editable) -->
          <div>
            <label for="clientName" class="block text-sm font-medium text-gray-700">
              <!-- {{ clientProfile.client_type === 'individual' ? 'Your Name' : 'Company Name' }} -->
              {{ clientType === 'individual' ? 'Your Name' : 'Company Name' }}
            </label>
            <input
              type="text"
              id="clientName"
              v-model="clientProfileForm.name"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
  
          <!-- Contact Person (conditional, editable) -->
          <div v-if="clientType === 'company'">
            <label for="contactPerson" class="block text-sm font-medium text-gray-700">Contact Person</label>
            <input
              type="text"
              id="contactPerson"
              v-model="clientProfileForm.contact_person"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
  
          <!-- Phone (editable) -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              id="phone"
              v-model="clientProfileForm.phone"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
  
          <!-- Address (editable) -->
          <div>
            <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              id="address"
              v-model="clientProfileForm.address"
              rows="3"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>
  
          <!-- Additional Info (editable) -->
          <div>
            <label for="additionalInfo" class="block text-sm font-medium text-gray-700">Additional Information</label>
            <textarea
              id="additionalInfo"
              v-model="clientProfileForm.additional_info"
              rows="3"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>
  
          <button
            type="submit"
            :disabled="isUpdating || isLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span v-if="isUpdating">Updating...</span>
            <span v-else>Update Profile</span>
          </button>
        </form>
        <div v-if="updateSuccessMessage" class="mt-4 text-green-600 text-center p-3 bg-green-100 border border-green-200 rounded-md">
          {{ updateSuccessMessage }}
        </div>
        <div v-if="updateErrorMessage" class="mt-4 text-red-600 text-center p-3 bg-red-100 border border-red-200 rounded-md">
          {{ updateErrorMessage }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch, computed } from 'vue';
  import { useAuth } from '@/composables/useAuth';
  import { useClients } from '@/composables/useClients'; // Import the updated useClients composable
  
  const { user } = useAuth(); // Get the authenticated user object (which should have .client loaded)
  const { clientProfile, isLoading, errorMessage, fetchMyProfile, updateMyProfile, updateSuccessMessage, updateErrorMessage, isUpdating } = useClients();
  
  // Form state, initialized as an empty ref. Will be populated once clientProfile is fetched.
  const clientProfileForm = ref({
    name: '',
    contact_person: null,
    phone: '',
    address: '',
    additional_info: '',
  });
  
  const clientType = computed(() => clientProfile.value?.client_type);

  onMounted(async () => {
    await fetchMyProfile(); // Fetch the client's own profile data
  });
  
  // Watch for changes in clientProfile (after fetchMyProfile completes)
  // and populate the form fields.
  watch(clientProfile, (newProfile) => {
    if (newProfile) {
      clientProfileForm.value = {
        name: newProfile.name || '',
        contact_person: newProfile.contact_person || null,
        phone: newProfile.phone || '',
        address: newProfile.address || '',
        additional_info: newProfile.additional_info || '',
        // email is excluded as per requirement
      };
    }
  }, { immediate: true }); // immediate: true ensures this runs on initial component mount
  
  const handleProfileUpdate = async () => {
    // Only send fields that are relevant for update based on client_type
    const payload = {
      name: clientProfileForm.value.name,
      phone: clientProfileForm.value.phone,
      address: clientProfileForm.value.address,
      additional_info: clientProfileForm.value.additional_info,
    };
  
    if (clientProfile.value.client_type === 'company') {
      payload.contact_person = clientProfileForm.value.contact_person;
    }
  
    await updateMyProfile(payload);
  };
  </script>
  
  <style scoped>
  /* Styles go here */
  </style>
  