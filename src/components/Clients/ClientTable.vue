<!-- src/components/Clients/ClientTable.vue -->
<template>
  <table class="w-full table-auto border-collapse">
    <thead class="bg-gray-100">
      <tr>
        <th class="p-2 text-left">ID</th>
        <th class="p-2 text-left">Name</th>
        <th class="p-2 text-left">Type</th>
        <th class="p-2 text-left">Contact Person</th>
        <th class="p-2 text-left">Phone</th>
        <th class="p-2 text-left">Email</th>
        <th class="p-2 text-center w-[160px]">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="client in clients"
        :key="client.id"
        class="border-t hover:bg-gray-50 cursor-pointer"
        @click="goToClientDetails(client.id)"
      >
        <td class="p-2 font-medium text-left">{{ client.id }}</td>
        <td class="p-2 text-left">{{ client.name }}</td>
        <td class="p-2 text-left">{{ formatClientType(client.client_type) }}</td>
        <td class="p-2 text-left">{{ client.contact_person || 'N/A' }}</td>
        <td class="p-2 text-left">{{ client.phone || 'N/A' }}</td>
        <td class="p-2 text-left">{{ client.email || 'N/A' }}</td>
        <td class="p-2 flex items-center justify-center space-x-2 h-full" @click.stop>
          <button
            v-if="hasAnyRole(['Admin', 'Manager'])"
            class="px-2 py-1 text-xs bg-blue-400 text-white rounded-md hover:bg-blue-500 flex-shrink-0 w-[60px]"
            @click="$emit('edit', client)"
          >
            Edit
          </button>
          <button
            v-if="hasRole('Admin')"
            class="px-2 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 flex-shrink-0 w-[60px]"
            @click="$emit('delete', client)"
          >
            Delete
          </button>
        </td>
      </tr>
      <tr v-if="clients.length === 0">
        <td colspan="7" class="p-4 text-center text-gray-500">No clients found.</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth'; // Absolute path

const router = useRouter();
const { hasAnyRole, hasRole } = useAuth();

const props = defineProps({
  clients: { type: Array, required: true, default: () => [] }
});

const emit = defineEmits(['edit', 'delete']);

function goToClientDetails(id) {
  router.push({ name: 'ClientDetails', params: { id: id } });
}

function formatClientType(type) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}
</script>

<style scoped>
/* Add any specific styles for the table here */
</style>


<!-- <template>
  <table class="w-full table-auto border-collapse">
    <thead class="bg-gray-100">
      <tr>
        <th class="p-2 text-left">ID</th>
        <th class="p-2 text-left">Name</th>
        <th class="p-2 text-left">Type</th>
        <th class="p-2 text-left">Contact Person</th>
        <th class="p-2 text-left">Phone</th>
        <th class="p-2 text-left">Email</th>
        <th class="p-2 text-center w-[160px]">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="client in clients"
        :key="client.id"
        class="border-t hover:bg-gray-50 cursor-pointer"
        @click="goToClientDetails(client.id)"
      >
        <td class="p-2 font-medium text-left">{{ client.id }}</td>
        <td class="p-2 text-left">{{ client.name }}</td>
        <td class="p-2 text-left">{{ formatClientType(client.client_type) }}</td>
        <td class="p-2 text-left">{{ client.contact_person || 'N/A' }}</td>
        <td class="p-2 text-left">{{ client.phone || 'N/A' }}</td>
        <td class="p-2 text-left">{{ client.email || 'N/A' }}</td>
        <td class="p-2 flex items-center justify-center space-x-2 h-full" @click.stop>
          <button
            v-if="hasAnyRole(['Admin', 'Manager'])"
            class="px-2 py-1 text-xs bg-blue-400 text-white rounded-md hover:bg-blue-500 flex-shrink-0 w-[60px]"
            @click="$emit('edit', client)"
          >
            Edit
          </button>
          <button
            v-if="hasRole('Admin')"
            class="px-2 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 flex-shrink-0 w-[60px]"
            @click="$emit('delete', client.id)"
          >
            Delete
          </button>
        </td>
      </tr>
      <tr v-if="clients.length === 0">
        <td colspan="7" class="p-4 text-center text-gray-500">No clients found.</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth'; 

const router = useRouter();
const { hasAnyRole, hasRole } = useAuth(); 

const props = defineProps({
  clients: { type: Array, required: true }
});

const emit = defineEmits(['edit', 'delete']);

function goToClientDetails(id) {
  router.push({ name: 'ClientDetails', params: { id: id } });
}

function formatClientType(type) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}
</script>

<style scoped>
</style> -->