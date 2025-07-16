<template>
    <div class="p-6 space-y-4">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold">Manage Suppliers (Vendors)</h1>
        <button
          class="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out whitespace-nowrap"
          @click="goToCreateVendor"
        >
          New Vendor
        </button>
      </div>
  
      <div class="mb-4">
        <input
          type="text"
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="Search vendors by name, email, or contact person..."
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
  
      <div v-if="isLoadingVendors" class="text-center text-gray-600 py-8">
        Loading suppliers...
      </div>
      <div v-else-if="errorVendors" class="text-center text-red-600 py-8">
        <p>{{ errorVendors }}</p>
      </div>
      <div v-else>
        <div v-if="vendors.length > 0" class="overflow-x-auto bg-white shadow-md rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Person</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th scope="col" class="relative px-6 py-3"><span class="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="vendor in vendors" :key="vendor.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ vendor.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ vendor.contact_person || 'N/A' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ vendor.email || 'N/A' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ vendor.phone || 'N/A' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="goToEditVendor(vendor)" class="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                  <button @click="confirmDeleteVendor(vendor.id)" class="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="text-gray-600">No suppliers found.</p>
      </div>
  
      <div v-if="showDeleteVendorModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
        <div class="relative p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3 text-center">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Confirm Deletion</h3>
            <div class="mt-2 px-7 py-3">
              <p class="text-sm text-gray-500">
                Are you sure you want to delete this supplier? This action cannot be undone.
              </p>
            </div>
            <div class="items-center px-4 py-3 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                @click="performDeleteVendor"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Delete
              </button>
              <button
                type="button"
                @click="showDeleteVendorModal = false"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useVendors } from '@/composables/useVendors';
  
  const { vendors, isLoadingVendors, errorVendors, fetchVendors, deleteVendor } = useVendors();
  const router = useRouter();
  
  const showDeleteVendorModal = ref(false);
  const vendorToDeleteId = ref(null);
  const searchQuery = ref('');
  
  let searchTimeout = null;
  
  onMounted(() => {
    fetchVendors(); // Load all vendors when component mounts
  });
  
  const handleSearch = () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
          fetchVendors({ search: searchQuery.value }); // Pass search query to fetchVendors
      }, 300);
  };
  
  // Navigate to the new VendorCompanyForm for creation
  function goToCreateVendor() {
    router.push({ name: 'CreateVendorCompany' });
  }
  
  // Navigate to the new VendorCompanyForm for editing
  function goToEditVendor(vendor) {
    router.push({ name: 'EditVendorCompany', params: { id: vendor.id } });
  }
  
  function confirmDeleteVendor(id) {
    vendorToDeleteId.value = id;
    showDeleteVendorModal.value = true;
  }
  
  async function performDeleteVendor() {
    showDeleteVendorModal.value = false;
    if (vendorToDeleteId.value) {
      try {
        await deleteVendor(vendorToDeleteId.value);
        alert('Supplier deleted successfully!');
        await fetchVendors({ search: searchQuery.value }); // Re-fetch with current search query
      } catch (error) {
        console.error("Error deleting supplier:", error);
        alert("Failed to delete supplier: " + (errorVendors.value || error.message));
      }
    }
  }
  </script>
  
  <style scoped>
  /* Add any component-specific styles here if necessary */
  </style>