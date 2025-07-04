<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-semibold">Clients</h1>
      <button
        class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        @click="goToCreateClient"
      >
        New Client
      </button>
    </div>
    <ClientTable
      :clients="clients"
      @edit="goToEditClient"
      @delete="requestDelete"
    />
    <div v-if="isLoading">Loading...</div>
    <div v-if="errorMessage">{{ errorMessage }}</div>

    <ClientForm
      v-if="showForm"
      :client="editingClient"
      @save="onSave"
      @cancel="closeForm"
    />

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
        <h2 class="text-lg font-semibold mb-4">Delete Client</h2>
        <p>Are you sure you want to delete <span class="font-bold">{{ clientToDelete?.name }}</span>? This action cannot be undone.</p>
        <div class="flex justify-end space-x-2 mt-6">
          <button @click="cancelDelete" class="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
          <button @click="confirmDelete" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>

    <!-- Notification -->
    <div
      v-if="notification.show"
      :class="[
        'fixed bottom-6 right-6 px-6 py-3 rounded shadow-lg z-50',
        notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
      ]"
    >
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useClients } from '@/composables/useClients';
import ClientTable from '@/components/Clients/ClientTable.vue';
import ClientForm from '@/components/Clients/ClientForm.vue';
// No specific logic needed here as ClientTable handles its own data fetching

const { clients, fetchClients, createClient, updateClient, deleteClient, isLoading, errorMessage } = useClients();

const showForm = ref(false);
const editingClient = ref({});
const showDeleteModal = ref(false);
const clientToDelete = ref(null);

const notification = ref({
  show: false,
  message: '',
  type: 'success',
});

onMounted(() => {
  fetchClients();
});

function goToCreateClient() {
  editingClient.value = {};
  showForm.value = true;
}

function goToEditClient(client) {
  editingClient.value = { ...client };
  showForm.value = true;
}

function closeForm() {
  showForm.value = false;
  editingClient.value = {};
}

async function onSave(clientData) {
  try {
    if (clientData.id) {
      await updateClient(clientData.id, clientData);
      showNotification('Client updated successfully!', 'success');
    } else {
      await createClient(clientData);
      showNotification('Client created successfully!', 'success');
    }
    await fetchClients();
    closeForm();
  } catch (error) {
    showNotification("Failed to save client: " + (error.response?.data?.message || error.message), 'error');
  }
}

function requestDelete(client) {
  clientToDelete.value = client;
  showDeleteModal.value = true;
}

async function confirmDelete() {
  if (!clientToDelete.value) return;
  try {
    await deleteClient(clientToDelete.value.id);
    showNotification('Client deleted successfully!', 'success');
    await fetchClients();
  } catch (error) {
    showNotification("Failed to delete client: " + (error.response?.data?.message || error.message), 'error');
  } finally {
    showDeleteModal.value = false;
    clientToDelete.value = null;
  }
}

function cancelDelete() {
  showDeleteModal.value = false;
  clientToDelete.value = null;
}

function showNotification(message, type = 'success') {
  notification.value = { show: true, message, type };
  setTimeout(() => {
    notification.value.show = false;
  }, 3000);
}

</script>

<style scoped>
/* Scoped styles for Clients.vue if any */
</style>
