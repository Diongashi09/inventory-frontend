<template>
  <div class="bg-white shadow-md rounded-lg p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold">Invoices</h2>
      <router-link
        :to="{ name: 'CreateInvoice' }"
        class="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Create New Invoice
      </router-link>
    </div>

    <div v-if="isLoading" class="text-center py-8">
      <p>Loading invoices...</p>
    </div>

    <div v-else-if="errorMessage" class="text-red-600 text-center py-8">
      <p>{{ errorMessage }}</p>
    </div>

    <div v-else-if="invoices.length === 0" class="text-center py-8">
      <p>No invoices found. Start by creating a new one!</p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Invoice #
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Items
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Price
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="invoice in invoices" :key="invoice.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ invoice.reference_number }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ invoice.client?.name || 'Unknown Client' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(invoice.date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(invoice.status)">
                {{ formatStatus(invoice.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ invoice.items ? invoice.items.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0 }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              ${{ calculateTotalPrice(invoice.items).toFixed(2) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <router-link
                :to="{ name: 'InvoiceDetails', params: { id: invoice.id } }"
                class="text-indigo-600 hover:text-indigo-900 mr-4"
              >
                View
              </router-link>
              <router-link
                :to="{ name: 'EditInvoice', params: { id: invoice.id } }"
                class="text-green-600 hover:text-green-900 mr-4"
              >
                Edit
              </router-link>
              <button
                @click="confirmDelete(invoice.id)"
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div class="relative p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Confirm Deletion</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">
              Are you sure you want to delete this invoice? This action cannot be undone.
            </p>
          </div>
          <div class="items-center px-4 py-3">
            <button
              @click="deleteInvoice(invoiceToDeleteId); showDeleteModal = false;"
              class="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Delete
            </button>
            <button
              @click="showDeleteModal = false"
              class="mt-3 px-4 py-2 bg-white text-gray-700 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
import { ref } from 'vue';
import { useInvoices } from '@/composables/useInvoices';

const props = defineProps({
  invoices: {
    type: Array,
    required: true,
    default: () => []
  },
  isLoading: Boolean,
  errorMessage: String
});

const emit = defineEmits(['edit', 'delete', 'start-shipping']);

const showDeleteModal = ref(false);
const invoiceToDeleteId = ref(null);

function confirmDelete(id) {
  invoiceToDeleteId.value = id;
  showDeleteModal.value = true;
}

function deleteInvoice(id) {
  emit('delete', id);
}

// Helper to format date
function formatDate(dateString) {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Helper to calculate total price
function calculateTotalPrice(items) {
  if (!items) return 0;
  return items.reduce((sum, item) => sum + Number(item.total_price || 0), 0);
}

// Helper to format status
function formatStatus(status) {
  const statusMap = {
    'draft': 'Draft',
    'pending': 'Pending',
    'on_delivery': 'On Delivery',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled',
    'awaiting_stock': 'Awaiting Stock'
  };
  return statusMap[status] || status;
}

// Helper to get status class
function getStatusClass(status) {
  switch (status) {
    case 'delivered':
      return 'bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold';
    case 'on_delivery':
      return 'bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold';
    case 'pending':
    case 'awaiting_stock':
      return 'bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold';
    case 'cancelled':
      return 'bg-red-200 text-red-800 px-2 py-1 rounded-full text-xs font-semibold';
    case 'draft':
      return 'bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold';
    default:
      return 'bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold';
  }
}
</script>

<style scoped>
/* Add any component-specific styles here if necessary */
</style>