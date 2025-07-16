<template>
  <div class="bg-white shadow-md rounded-lg p-4">
    <div class="mb-4">
      <input
        type="text"
        v-model="searchQuery"
        @input="handleSearch"
        placeholder="Search by reference number or client name..."
        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
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
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Items</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
              ${{ calculateTotalPrice(invoice.items, invoice.shipping?.shipping_cost).toFixed(2) }}
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
  </div>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue';
import { useInvoices } from '@/composables/useInvoices';

const { invoices, isLoading, errorMessage, fetchInvoices, deleteInvoice } = useInvoices();

const searchQuery = ref('');

let searchTimeout = null;
const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchInvoices({ search: searchQuery.value });
  }, 300); // Debounce for 300ms
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatStatus = (status) => {
  if (!status) return 'Unknown';
  return status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
};

const getStatusClass = (status) => {
  switch (status) {
    case 'on_delivery':
      return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800';
    case 'delivered':
      return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800';
    case 'pending':
      return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800';
    case 'draft':
      return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800';
    default:
      return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800';
  }
};

const calculateTotalPrice = (items, shippingCost = 0) => {
  let subtotal = 0;
  if (items) {
    items.forEach(item => {
      subtotal += (Number(item.quantity) || 0) * (Number(item.unit_price) || 0);
    });
  }
  return subtotal + (Number(shippingCost) || 0);
};

const confirmDelete = async (id) => {
  if (confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
    await deleteInvoice(id);
    await fetchInvoices({ search: searchQuery.value });
  }
};

onMounted(() => {
  fetchInvoices();
});
</script>

<style scoped>
/* Add any component-specific styles here if necessary */
</style>

///

<!-- <template>
  <div class="bg-white shadow-md rounded-lg p-4">
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
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Items</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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

    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center"
    >
      <div class="relative p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Confirm Deletion</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">Are you sure you want to delete this invoice? This action cannot be undone.</p>
          </div>
          <div class="items-center px-4 py-3">
            <button
              @click="deleteInvoice(invoiceToDeleteId); showDeleteModal = false;"
              class="px-4 py-2 bg-red-600 text-white rounded-md w-full hover:bg-red-700"
            >
              Delete
            </button>
            <button
              @click="showDeleteModal = false"
              class="mt-3 px-4 py-2 bg-white text-gray-700 border rounded-md w-full hover:bg-gray-100"
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
</style> -->