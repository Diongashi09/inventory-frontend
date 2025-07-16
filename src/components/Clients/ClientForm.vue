<!-- src/components/Clients/ClientForm.vue -->
<template>
  <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <h2 class="text-xl font-semibold mb-4">{{ local.id ? 'Edit Client' : 'Create New Client' }}</h2>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Name <span class="text-red-500">*</span></label>
          <input
            v-model="local.name"
            type="text"
            required
            class="w-full border p-2 rounded mt-1"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Client Type <span class="text-red-500">*</span></label>
          <select
            v-model="local.client_type"
            required
            class="w-full border p-2 rounded mt-1"
            @change="handleClientTypeChange"
          >
            <option :value="null" disabled>— Select Type —</option>
            <option value="individual">Individual</option>
            <option value="company">Company</option>
          </select>
        </div>

        <!-- Contact Person field, shown only if client_type is 'company' -->
        <div v-if="local.client_type === 'company'">
          <label class="block text-sm font-medium text-gray-700">Contact Person <span class="text-red-500">*</span></label>
          <input
            v-model="local.contact_person"
            type="text"
            :required="local.client_type === 'company'"
            class="w-full border p-2 rounded mt-1"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Phone (Optional)</label>
          <input
            v-model="local.phone"
            type="tel"
            class="w-full border p-2 rounded mt-1"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Email <span class="text-red-500">*</span></label>
          <input
            v-model="local.email"
            type="email"
            required
            class="w-full border p-2 rounded mt-1"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Address (Optional)</label>
          <textarea
            v-model="local.address"
            rows="3"
            class="w-full border p-2 rounded mt-1"
          ></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Additional Info (Optional)</label>
          <textarea
            v-model="local.additional_info"
            rows="3"
            class="w-full border p-2 rounded mt-1"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-2">
          <button
            type="button"
            class="px-4 py-2 border rounded hover:bg-gray-100"
            @click="$emit('cancel')"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Client
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  client: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['save', 'cancel']);

const local = reactive({
  id: null,
  name: '',
  client_type: null, // Initialize as null so "Select Type" is default
  contact_person: '',
  phone: '',
  email: '',
  address: '',
  additional_info: '',
});

watch(
  () => props.client,
  (clnt) => {
    Object.assign(local, {
      id: clnt.id || null,
      name: clnt.name || '',
      client_type: clnt.client_type || null,
      contact_person: clnt.contact_person || '',
      phone: clnt.phone || '',
      email: clnt.email || '',
      address: clnt.address || '',
      additional_info: clnt.additional_info || '',
    });
  },
  { immediate: true }
);

// Function to handle changes in client_type
function handleClientTypeChange() {
  // Clear contact_person if client_type changes to individual or null
  if (local.client_type !== 'company') {
    local.contact_person = '';
  }
}

function onSubmit() {
  // Frontend validation for client_type
  if (local.client_type === null) {
    alert('Please select a client type.');
    return;
  }

  // Frontend validation for contact_person if client_type is 'company'
  if (local.client_type === 'company' && !local.contact_person) {
    alert('Contact Person is required for company clients.');
    return;
  }

  // Frontend validation for email (since it's now required)
  if (!local.email) {
    alert('Email is required.');
    return;
  }

  emit('save', { id: local.id, ...local });
}
</script>

<style scoped>
/* Specific styling for the form if needed */
</style>


<!-- <template>
  <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <h2 class="text-xl font-semibold mb-4">{{ local.id ? 'Edit Client' : 'Create New Client' }}</h2>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Name</label>
          <input
            v-model="local.name"
            type="text"
            required
            class="w-full border p-2 rounded mt-1"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Client Type</label>
          <select
            v-model="local.client_type"
            required
            class="w-full border p-2 rounded mt-1"
          >
            <option :value="null" disabled>— Select Type —</option>
            <option value="individual">Individual</option>
            <option value="company">Company</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Contact Person (Optional)</label>
          <input
            v-model="local.contact_person"
            type="text"
            class="w-full border p-2 rounded mt-1"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Phone (Optional)</label>
          <input
            v-model="local.phone"
            type="tel"
            class="w-full border p-2 rounded mt-1"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Email (Optional)</label>
          <input
            v-model="local.email"
            type="email"
            class="w-full border p-2 rounded mt-1"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Address (Optional)</label>
          <textarea
            v-model="local.address"
            rows="3"
            class="w-full border p-2 rounded mt-1"
          ></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Additional Info (Optional)</label>
          <textarea
            v-model="local.additional_info"
            rows="3"
            class="w-full border p-2 rounded mt-1"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-2">
          <button
            type="button"
            class="px-4 py-2 border rounded hover:bg-gray-100"
            @click="$emit('cancel')"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Client
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  client: { type: Object, default: () => ({}) }, 
});

const emit = defineEmits(['save', 'cancel']);

const local = reactive({
  id: null,
  name: '',
  client_type: null,
  contact_person: '',
  phone: '',
  email: '',
  address: '',
  additional_info: '',
});

watch(
  () => props.client,
  (clnt) => {
    Object.assign(local, {
      id: clnt.id || null,
      name: clnt.name || '',
      client_type: clnt.client_type || null,
      contact_person: clnt.contact_person || '',
      phone: clnt.phone || '',
      email: clnt.email || '',
      address: clnt.address || '',
      additional_info: clnt.additional_info || '',
    });
  },
  { immediate: true } 
);

function onSubmit() {
  if (local.client_type === null) {
      alert('Please select a client type.');
      return;
  }
  emit('save', { id: local.id, ...local }); updating
}
</script>

<style scoped>
</style> -->