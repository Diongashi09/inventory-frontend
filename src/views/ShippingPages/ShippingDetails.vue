<template>
  <div class="container mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
    <div v-if="isLoading" class="text-center text-gray-600">Loading shipping details...</div>
    <div v-else-if="errorMessage" class="text-center text-red-600 text-lg">
      <p>Error: {{ errorMessage }}</p>
      <button @click="router.back()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go Back</button>
    </div>
    <div v-else-if="shipping">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Shipping #{{ shipping.tracking_id || 'N/A' }}</h1>
        <div class="space-x-2">
          <button @click="router.back()" class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Go Back</button>
          <!-- Update status button, similar to table, allows direct action from details -->
          <button
            v-if="hasAnyRole(['Admin', 'Manager']) && (shipping.status === 'on_delivery' || shipping.status === 'pending' || shipping.status === 'awaiting_stock')"
            @click="onUpdateStatus(shipping)"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {{ shipping.status === 'on_delivery' ? 'Mark Delivered' : 'Start Shipping' }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <!-- Shipping Summary -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h2 class="text-xl font-semibold text-gray-700 mb-3">Shipping Summary</h2>
          <p class="mb-2"><span class="font-medium">Tracking ID:</span> {{ shipping.tracking_id || 'N/A' }}</p>
          <p class="mb-2"><span class="font-medium">Company:</span> {{ shipping.shipping_company || 'N/A' }}</p>
          <p class="mb-2"><span class="font-medium">Cost:</span> ${{ Number(shipping.shipping_cost).toFixed(2) }}</p>
          <p class="mb-2"><span class="font-medium">Status:</span>
            <span :class="getStatusClass(shipping.status)">
              {{ formatStatus(shipping.status) }}
            </span>
          </p>
          <p class="mb-2"><span class="font-medium">Associated Invoice:</span>
            <router-link
              v-if="shipping.invoice?.id"
              :to="{ name: 'InvoiceDetails', params: { id: shipping.invoice.id }}"
              class="text-indigo-600 hover:underline"
            >
              #{{ shipping.invoice.reference_number || shipping.invoice.id }}
            </router-link>
            <span v-else>N/A</span>
          </p>
          <p class="mb-2"><span class="font-medium">Client:</span> {{ shipping.invoice?.client?.name || 'N/A' }}</p>
        </div>

        <!-- Timestamps -->
        <div class="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-600">
          <h2 class="text-xl font-bold text-indigo-800 mb-3">Timestamps</h2>
          <p class="mb-2"><span class="font-medium">Created:</span> {{ new Date(shipping.created_at).toLocaleString() }}</p>
          <p class="mb-2"><span class="font-medium">Last Updated:</span> {{ new Date(shipping.updated_at).toLocaleString() }}</p>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-600">
      <p>Shipping not found.</p>
      <button @click="router.back()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go Back</button>
    </div>

    <!-- Simple alert for status updates -->
    <div v-if="statusUpdateMessage" class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
      {{ statusUpdateMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useShippings } from '@/composables/useShippings';
import { useAuth } from '@/composables/useAuth'; // For role checks

const { shipping, getShippingById, updateShippingStatus, isLoading, errorMessage } = useShippings();
const { hasAnyRole } = useAuth(); // Use the hasAnyRole composable
const route = useRoute();
const router = useRouter();

const statusUpdateMessage = ref('');

async function loadShippingDetails() {
  const id = route.params.id;
  if (id) {
    await getShippingById(id);
  }
}

onMounted(loadShippingDetails);

// Function to handle status update from the details page
async function onUpdateStatus(shippingData) {
  if (!hasAnyRole(['Admin', 'Manager'])) {
    alert('You do not have permission to update shipping status.');
    return;
  }

  const currentStatus = shippingData.status;
  let newStatus;
  if (currentStatus === 'on_delivery') {
    newStatus = 'delivered';
  } else if (currentStatus === 'pending' || currentStatus === 'awaiting_stock') {
    newStatus = 'on_delivery';
  } else {
    alert(`Cannot change status from "${currentStatus}".`);
    return;
  }

  if (!confirm(`Are you sure you want to change status of tracking ID ${shippingData.tracking_id} from "${currentStatus}" to "${newStatus}"?`)) {
    return;
  }

  try {
    await updateShippingStatus(shippingData.tracking_id, newStatus);
    statusUpdateMessage.value = `Status updated to ${newStatus}.`;
    setTimeout(() => statusUpdateMessage.value = '', 3000); // Clear message after 3 seconds
    await loadShippingDetails(); // Re-fetch to update the details view
  } catch (error) {
    console.error("Failed to update status:", error);
    alert("Failed to update status: " + (errorMessage.value || error.message));
  }
}

function formatDate(dateString) {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
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
