<template>
  <div class="bg-white shadow-md rounded-lg p-4">
    <div v-if="shippings.length === 0" class="text-center py-8">
      <p>No shippings found.</p>
    </div>
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="shipping in shippings" :key="shipping.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ shipping.tracking_id || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ shipping.invoice?.reference_number || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ shipping.invoice?.client?.name || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ shipping.shipping_company || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
              ${{ Number(shipping.shipping_cost).toFixed(2) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(shipping.status)">
                {{ formatStatus(shipping.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="$emit('view', shipping)" class="text-indigo-600 hover:text-indigo-900 mr-4">View</button>
              <button
                v-if="hasAnyRole(['Admin', 'Manager']) && (shipping.status === 'on_delivery' || shipping.status === 'pending' || shipping.status === 'awaiting_stock')"
                @click="$emit('update-status', shipping)"
                class="text-blue-600 hover:text-blue-900"
              >
                {{ shipping.status === 'on_delivery' ? 'Mark Delivered' : 'Start Shipping' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'; // Import useAuth to check roles

const props = defineProps({
  shippings: {
    type: Array,
    required: true,
    default: () => []
  }
});

const emit = defineEmits(['view', 'update-status']); // Emitting update-status event

const { hasAnyRole } = useAuth(); // Use the hasAnyRole composable

function formatDate(dateString) {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatStatus(status) {
  const statusMap = {
    'pending': 'Pending',
    'awaiting_stock': 'Awaiting Stock',
    'on_delivery': 'On Delivery',
    'delivered': 'Delivered',
  };
  return statusMap[status] || status;
}

function getStatusClass(status) {
  switch (status) {
    case 'delivered':
      return 'bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold';
    case 'on_delivery':
      return 'bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold';
    case 'pending':
    case 'awaiting_stock':
      return 'bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold';
    default:
      return 'bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold';
  }
}
</script>


<!-- space -->

<!-- <template>
  <table class="w-full table-auto border-collapse">
    <thead class="bg-gray-100">
      <tr>
        <th class="p-2 text-left">Tracking ID</th>
        <th class="p-2 text-left">Invoice Ref.</th>
        <th class="p-2 text-left">Client</th>
        <th class="p-2 text-left">Company</th>
        <th class="p-2 text-right">Cost</th>
        <th class="p-2 text-left">Status</th>
        <th class="p-2 text-left">Invoice Date</th>
        <th class="p-2 text-center w-[220px]">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="shipping in shippings"
        :key="shipping.id"
        class="border-t hover:bg-gray-50 cursor-pointer"
        @click="goToShippingDetails(shipping.invoice_id)"
      >
        <td class="p-2 font-medium text-left">{{ shipping.tracking_id || 'N/A' }}</td>
        <td class="p-2 text-left">{{ shipping.reference_number }}</td>
        <td class="p-2 text-left">{{ shipping.client?.name || 'N/A' }}</td>
        <td class="p-2 text-left">{{ shipping.shipping_company || 'N/A' }}</td>
        <td class="p-2 text-right">${{ Number(shipping.shipping_cost).toFixed(2) }}</td>
        <td class="p-2">
            <span :class="getStatusClass(shipping.status)">
                {{ formatStatus(shipping.status) }}
            </span>
        </td>
        <td class="p-2 text-left">{{ formatDate(shipping.date) }}</td>
        <td class="p-2 flex items-center justify-center space-x-2 h-full">
          <button
            v-if="hasAnyRole(['Admin', 'Manager'])"
            class="px-2 py-1 text-xs bg-blue-400 text-white rounded-md hover:bg-blue-500 flex-shrink-0 w-[100px]" 
            @click="$emit('edit-status', shipping)" 
          >
            Update Status
          </button>
          <button
            v-if="hasAnyRole(['Admin', 'Manager', 'Staff'])"
            class="px-2 py-1 text-xs bg-gray-400 text-white rounded-md hover:bg-gray-500 flex-shrink-0 w-[100px]"
            @click="goToInvoiceDetails(shipping.invoice_id)"
          >
            View Invoice
          </button>
        </td>
      </tr>
      <tr v-if="shippings.length === 0">
        <td colspan="8" class="p-4 text-center text-gray-500">No shippings found.</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { hasAnyRole } = useAuth(); 

const props = defineProps({
  shippings: { type: Array, required: true }
});

const emit = defineEmits(['edit-status']);

function goToShippingDetails(invoiceId) {
  router.push({ name: 'ShippingDetails', params: { invoiceId: invoiceId } });
}

function goToInvoiceDetails(invoiceId) {
  router.push({ name: 'InvoiceDetails', params: { id: invoiceId } });
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatStatus(status) {
    const statusMap = {
        'pending': 'Pending',
        'awaiting_stock': 'Awaiting Stock',
        'on_delivery': 'On Delivery',
        'delivered': 'Delivered',
    };
    return statusMap[status] || status;
}

function getStatusClass(status) {
    switch (status) {
        case 'delivered':
            return 'bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold';
        case 'on_delivery':
            return 'bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold';
        case 'pending':
        case 'awaiting_stock':
            return 'bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold';
        default:
            return 'bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold';
    }
}
</script>

<style scoped>
</style> -->