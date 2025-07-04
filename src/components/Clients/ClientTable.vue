<template>
  <div class="bg-white shadow-md rounded-lg p-4">
    <div v-if="clients.length === 0" class="text-center py-8 text-gray-500">
      <p>No clients found.</p>
    </div>
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Person</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="client in clients"
            :key="client.id"
            class="hover:bg-gray-50 cursor-pointer"
            @click="goToClientDetails(client.id)"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ client.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ client.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatClientType(client.client_type) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ client.contact_person || 'N/A' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ client.phone || 'N/A' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ client.email || 'N/A' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" @click.stop>
              <button
                v-if="hasAnyRole(['Admin', 'Manager'])"
                @click="$emit('edit', client)"
                class="text-indigo-600 hover:text-indigo-900 mr-4"
              >
                Edit
              </button>
              <button
                v-if="hasRole('Admin')"
                @click="$emit('delete', client)"
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { hasAnyRole, hasRole } = useAuth()

const props = defineProps({
  clients: { type: Array, required: true, default: () => [] }
})

const emit = defineEmits(['edit', 'delete'])

function goToClientDetails(id) {
  router.push({ name: 'ClientDetails', params: { id } })
}

function formatClientType(type) {
  if (!type) return ''
  return type.charAt(0).toUpperCase() + type.slice(1)
}
</script>

<style scoped>
/* Add styles here if needed */
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
</style> -->




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