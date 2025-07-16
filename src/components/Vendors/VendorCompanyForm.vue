<template>
    <div class="p-6 bg-white shadow-md rounded-lg">
      <h2 class="text-2xl font-semibold mb-4">{{ isEditMode ? 'Edit Supplier' : 'Create New Supplier' }}</h2>
  
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Supplier Name <span class="text-red-500">*</span></label>
          <input
            type="text"
            id="name"
            v-model="form.name"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
          <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name[0] }}</p>
        </div>
  
        <div>
          <label for="contact_person" class="block text-sm font-medium text-gray-700">Contact Person</label>
          <input
            type="text"
            id="contact_person"
            v-model="form.contact_person"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <p v-if="errors.contact_person" class="mt-1 text-sm text-red-600">{{ errors.contact_person[0] }}</p>
        </div>
  
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            id="phone"
            v-model="form.phone"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone[0] }}</p>
        </div>
  
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email[0] }}</p>
        </div>
  
        <div>
          <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            id="address"
            v-model="form.address"
            rows="3"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
          <p v-if="errors.address" class="mt-1 text-sm text-red-600">{{ errors.address[0] }}</p>
        </div>
  
        <div>
          <label for="additional_info" class="block text-sm font-medium text-gray-700">Additional Information</label>
          <textarea
            id="additional_info"
            v-model="form.additional_info"
            rows="4"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
          <p v-if="errors.additional_info" class="mt-1 text-sm text-red-600">{{ errors.additional_info[0] }}</p>
        </div>
  
        <div v-if="submitError" class="text-red-600 text-sm mt-2">
          {{ submitError }}
        </div>
  
        <div class="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            @click="router.back()"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isLoadingVendors"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {{ isLoadingVendors ? 'Saving...' : (isEditMode ? 'Update Supplier' : 'Create Supplier') }}
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted, watch } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useVendors } from '@/composables/useVendors';
  
  const router = useRouter();
  const route = useRoute();
  const { createVendor, updateVendor, isLoadingVendors, errorVendors, fetchVendors, vendors, clearErrorVendors } = useVendors();
  
  const isEditMode = ref(false);
  const vendorId = ref(null);
  const submitError = ref(null);
  
  const form = reactive({
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    additional_info: '',
  });
  
  const errors = ref({}); // To store validation errors from the backend
  
  onMounted(async () => {
    if (route.params.id) {
      isEditMode.value = true;
      vendorId.value = route.params.id;
      await fetchVendors(); // Ensure vendors are loaded to find the one to edit
      const vendorToEdit = vendors.value.find(v => v.id == vendorId.value);
      if (vendorToEdit) {
        Object.assign(form, vendorToEdit); // Populate form with existing data
      } else {
        // If vendor not found, maybe redirect or show error
        console.warn(`Vendor with ID ${vendorId.value} not found for editing.`);
        router.replace({ name: 'VendorsPage' }); // Redirect back to list
      }
    }
  });
  
  // Watch for changes in errorVendors from the composable
  watch(errorVendors, (newError) => {
    if (newError) {
      // Attempt to parse validation errors if available
      try {
        const errorData = JSON.parse(newError);
        if (errorData.errors) {
          errors.value = errorData.errors;
        } else {
          submitError.value = newError;
        }
      } catch (e) {
        submitError.value = newError; // Not JSON, just display as-is
      }
    } else {
      submitError.value = null;
      errors.value = {}; // Clear errors when no error
    }
  });
  
  const submitForm = async () => {
    submitError.value = null;
    errors.value = {}; // Clear previous errors
  
    try {
      if (isEditMode.value) {
        await updateVendor(vendorId.value, form);
        alert('Supplier updated successfully!');
      } else {
        await createVendor(form);
        alert('Supplier created successfully!');
      }
      router.push({ name: 'VendorsPage' }); // Redirect back to the vendors list
    } catch (err) {
      // Errors are now handled by the watch effect on errorVendors
      console.error('Form submission error:', err);
    }
  };
  </script>