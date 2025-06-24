<!-- src/views/ClientPages/ClientDetails.vue -->
<template>
  <div class="container mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
    <div v-if="isLoading" class="text-center text-gray-600">Loading client details...</div>
    <div v-else-if="error" class="text-center text-red-600 text-lg">
      <p>Error: {{ error }}</p>
      <button @click="router.back()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go Back</button>
    </div>
    <div v-else-if="client">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Client: {{ client.name }}</h1>
        <div class="space-x-2">
            <button
                v-if="hasAnyRole(['Admin', 'Manager'])"
                @click="goToEditClient(client.id)"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Edit Client
            </button>
            <button @click="router.back()" class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Go Back</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <!-- Client Information -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h2 class="text-xl font-semibold text-gray-700 mb-3">Client Information</h2>
          <p class="mb-2"><span class="font-medium">ID:</span> {{ client.id }}</p>
          <p class="mb-2"><span class="font-medium">Name:</span> {{ client.name }}</p>
          <p class="mb-2"><span class="font-medium">Type:</span> {{ formatClientType(client.client_type) }}</p>
          <p class="mb-2"><span class="font-medium">Contact Person:</span> {{ client.contact_person || 'N/A' }}</p>
          <p class="mb-2"><span class="font-medium">Phone:</span> {{ client.phone || 'N/A' }}</p>
          <p class="mb-2"><span class="font-medium">Email:</span> {{ client.email || 'N/A' }}</p>
        </div>

        <!-- Additional Information -->
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
          <h2 class="text-xl font-bold text-blue-800 mb-3">Location & Notes</h2>
          <p class="mb-2"><span class="font-medium">Address:</span> {{ client.address || 'N/A' }}</p>
          <p class="mb-2"><span class="font-medium">Additional Info:</span> {{ client.additional_info || 'N/A' }}</p>
        </div>
      </div>

      <div class="mt-6 text-gray-600 text-sm">
        <p>Created: {{ new Date(client.created_at).toLocaleString() }}</p>
        <p>Last Updated: {{ new Date(client.updated_at).toLocaleString() }}</p>
      </div>
    </div>
    <div v-else class="text-center text-gray-600">
      <p>Client not found.</p>
      <button @click="router.back()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go Back</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// import { fetchClient } from '@/composables/useClients'; // Absolute path
import { useAuth } from '@/composables/useAuth'; // Absolute path
import { useClients } from '@/composables/useClients';

const route = useRoute();
const router = useRouter();
const { getClientById, isLoading, errorMessage } = useClients();

const client = ref(null);
// const isLoading = ref(true);
const error = ref(null);

const { hasAnyRole } = useAuth();

const props = defineProps({
  id: { type: [String, Number], required: true }
});

async function loadClientDetails() {
  // isLoading.value = true;
  error.value = null;
  client.value = null;

  try {
    const fetchedClient = await getClientById(props.id);
    if (fetchedClient) {
      client.value = fetchedClient;
      // client.value = getClientById.client ? getClientById.client.value : null;
    } else {
      error.value = "Client not found.";
    }
  } catch (err) {
    console.error("Failed to fetch client details:", err);
    error.value = err.response?.data?.message || "Failed to load client details.";
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadClientDetails);

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadClientDetails();
    }
  }
);

function formatClientType(type) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function goToEditClient(clientId) {
  router.push({ name: 'EditClient', params: { id: clientId } });
}
</script>

<style scoped>
/* Specific styling for the details page if needed */
</style>


<!-- <template>
  <div class="container mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
    <div v-if="isLoading" class="text-center text-gray-600">Loading client details...</div>
    <div v-else-if="error" class="text-center text-red-600 text-lg">
      <p>Error: {{ error }}</p>
      <button @click="router.back()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go Back</button>
    </div>
    <div v-else-if="client">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Client: {{ client.name }}</h1>
        <div class="space-x-2">
            <button
                v-if="hasAnyRole(['Admin', 'Manager'])"
                @click="goToEditClient(client.id)"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Edit Client
            </button>
            <button @click="router.back()" class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Go Back</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h2 class="text-xl font-semibold text-gray-700 mb-3">Client Information</h2>
          <p class="mb-2"><span class="font-medium">ID:</span> {{ client.id }}</p>
          <p class="mb-2"><span class="font-medium">Name:</span> {{ client.name }}</p>
          <p class="mb-2"><span class="font-medium">Type:</span> {{ formatClientType(client.client_type) }}</p>
          <p class="mb-2"><span class="font-medium">Contact Person:</span> {{ client.contact_person || 'N/A' }}</p>
          <p class="mb-2"><span class="font-medium">Phone:</span> {{ client.phone || 'N/A' }}</p>
          <p class="mb-2"><span class="font-medium">Email:</span> {{ client.email || 'N/A' }}</p>
        </div>

        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
          <h2 class="text-xl font-bold text-blue-800 mb-3">Location & Notes</h2>
          <p class="mb-2"><span class="font-medium">Address:</span> {{ client.address || 'N/A' }}</p>
          <p class="mb-2"><span class="font-medium">Additional Info:</span> {{ client.additional_info || 'N/A' }}</p>
        </div>
      </div>

      <div class="mt-6 text-gray-600 text-sm">
        <p>Created: {{ new Date(client.created_at).toLocaleString() }}</p>
        <p>Last Updated: {{ new Date(client.updated_at).toLocaleString() }}</p>
      </div>
    </div>
    <div v-else class="text-center text-gray-600">
      <p>Client not found.</p>
      <button @click="router.back()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go Back</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchClient } from '../composables/useClients'; // New composable
import { useAuth } from '@/composables/useAuth'; // For role check

const route = useRoute();
const router = useRouter();

const client = ref(null);
const isLoading = ref(true);
const error = ref(null);

const { hasAnyRole } = useAuth(); 

const props = defineProps({
  id: { type: [String, Number], required: true } 
});

async function loadClientDetails() {
  isLoading.value = true;
  error.value = null;
  client.value = null;

  try {
    const fetchedClient = await fetchClient(props.id);
    if (fetchedClient) {
      client.value = fetchedClient;
    } else {
      error.value = "Client not found.";
    }
  } catch (err) {
    console.error("Failed to fetch client details:", err);
    error.value = err.response?.data?.message || "Failed to load client details.";
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadClientDetails);

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadClientDetails();
    }
  }
);

function formatClientType(type) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function goToEditClient(clientId) {
  router.push({ name: 'EditClient', params: { id: clientId } });
}
</script>

<style scoped>
</style> -->