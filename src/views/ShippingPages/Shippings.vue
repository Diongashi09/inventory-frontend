<template>
  <div class="p-6 space-y-4">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold">Shippings</h1>
      <!-- No "New Shipping" button as shippings are created via invoices -->
    </div>

    <div class="mb-4">
      <input
        type="text"
        v-model="searchQuery"
        @input="handleSearch"
        placeholder="Search by Tracking ID, Invoice #, or Client name..."
        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>

    <div v-if="isLoading" class="text-center text-gray-600 py-8">
      Loading shippings...
    </div>
    <div v-else-if="errorMessage" class="text-center text-red-600 py-8">
      <p>{{ errorMessage }}</p>
    </div>
    <div v-else>
      <ShippingTable
        :shippings="shippings"
        @view="goToShippingDetails"
        @update-status="onUpdateStatus"
      />
    </div>

    <!-- Simple alert for status updates -->
    <div v-if="statusUpdateMessage" class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
      {{ statusUpdateMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useShippings } from '@/composables/useShippings';
import { useAuth } from '@/composables/useAuth'; // Assuming useAuth for role checks
import ShippingTable from '@/components/Shippings/ShippingTable.vue';

const { shippings, fetchShippings, updateShippingStatus, isLoading, errorMessage } = useShippings();
const { hasAnyRole } = useAuth(); // To control who can update status if needed
const router = useRouter();

const statusUpdateMessage = ref('');
const searchQuery = ref('');
let searchTimeout = null;

async function loadAllShippings(params = {}) {
  await fetchShippings(params);
}

onMounted(() => {
  loadAllShippings();
});

const handleSearch = () => {
  clearTimeout(searchTimeout); // Clear previous timeout
  searchTimeout = setTimeout(() => {
    loadAllShippings({ search: searchQuery.value }); // Trigger fetch after debounce
  }, 300); // 300ms debounce time
};

function goToShippingDetails(shipping) {
  router.push({ name: 'ShippingDetails', params: { id: shipping.id } });
}

async function onUpdateStatus(shippingData) {
  // Only allow Admin/Manager to update status (adjust roles as per your policy)
  if (!hasAnyRole(['Admin', 'Manager'])) {
    alert('You do not have permission to update shipping status.');
    return;
  }

  // A simple way to get new status - for a real app, use a modal or dropdown
  const currentStatus = shippingData.status;
  let newStatus;
  if (currentStatus === 'on_delivery') {
    newStatus = 'delivered';
  } else if (currentStatus === 'pending' || currentStatus === 'awaiting_stock') {
    // If you allow changing from pending/awaiting_stock to on_delivery manually here
    // Make sure your backend logic allows this transition (startShipping does it)
    newStatus = 'on_delivery';
  } else {
    alert(`Cannot change status from "${currentStatus}".`);
    return;
  }

  // Confirmation before sending
  if (!confirm(`Are you sure you want to change status of tracking ID ${shippingData.tracking_id} from "${currentStatus}" to "${newStatus}"?`)) {
    return;
  }

  try {
    await updateShippingStatus(shippingData.tracking_id, newStatus);
    statusUpdateMessage.value = `Status for ${shippingData.tracking_id} updated to ${newStatus}.`;
    setTimeout(() => statusUpdateMessage.value = '', 3000); // Clear message after 3 seconds
    // Re-fetch to update the table immediately
    await loadAllShippings({search: searchQuery.value});
  } catch (error) {
    console.error("Failed to update status:", error);
    alert("Failed to update status: " + (errorMessage.value || error.message));
  }
}
</script>

<style scoped>
/* Scoped styles for Shippings.vue if any */
</style>
