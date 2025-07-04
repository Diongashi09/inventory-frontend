<template>
  <div class="container mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
    <div v-if="isLoading" class="text-center text-gray-600">Loading invoice details...</div>
    <div v-else-if="error" class="text-center text-red-600 text-lg">
      <p>Error: {{ error }}</p>
      <button @click="router.back()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go Back</button>
    </div>
    <div v-else-if="invoice">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Invoice #{{ invoice.reference_number }}</h1>
        <div class="space-x-2">
          <button
            v-if="hasAnyRole(['Admin', 'Manager'])"
            @click="goToEditInvoice(invoice.id)"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Invoice
          </button>
          <button @click="router.back()" class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Go Back</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h2 class="text-xl font-semibold text-gray-700 mb-3">Invoice Summary</h2>
          <p class="mb-2"><span class="font-medium">Invoice Date:</span> {{ formatDate(invoice.date) }}</p>
          <p class="mb-2"><span class="font-medium">Client:</span> {{ invoice.client?.name || 'N/A' }} ({{ invoice.customer_type }})</p>
          <p class="mb-2"><span class="font-medium">Invoice Status:</span>
            <span :class="getStatusClass(invoice.status)">
              {{ formatStatus(invoice.status) }}
            </span>
          </p>
          <p class="mb-2"><span class="font-medium">Created By:</span> {{ invoice.creator?.name || 'N/A' }}</p>
          <p class="mb-2">
            <span class="font-medium">Total Items:</span>
            {{ Array.isArray(invoice.items) ? invoice.items.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0 }}
          </p>
          <p class="mb-2">
            <span class="font-medium">Total Price:</span>
            ${{ Array.isArray(invoice.items) ? calculateTotalPrice(invoice.items).toFixed(2) : '0.00' }}
          </p>
        </div>

        <div class="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-600">
          <h2 class="text-xl font-bold text-indigo-800 mb-3">Items Ordered</h2>
          <div v-if="Array.isArray(invoice.items) && invoice.items.length > 0">
            <ul class="space-y-2">
              <li v-for="item in invoice.items" :key="item.id" class="border-b pb-2 last:border-b-0">
                <p class="font-semibold">{{ item.product?.name || 'Unknown Product' }}</p>
                <p class="text-sm text-gray-700">
                  Quantity: {{ item.quantity }} | Unit Price: ${{ Number(item.unit_price).toFixed(2) }} | Total: ${{ Number(item.total_price).toFixed(2) }}
                </p>
              </li>
            </ul>
          </div>
          <p v-else class="text-gray-600">No items listed for this invoice.</p>
        </div>
      </div>

      <div v-if="invoice.shipping" class="mt-6 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-600">
        <h2 class="text-xl font-bold text-yellow-800 mb-3">Shipping Details</h2>
        <p class="mb-2"><span class="font-medium">Tracking ID:</span> {{ invoice.shipping.tracking_id || 'N/A' }}</p>
        <p class="mb-2"><span class="font-medium">Company:</span> {{ invoice.shipping.shipping_company || 'N/A' }}</p>
        <p class="mb-2"><span class="font-medium">Cost:</span> ${{ Number(invoice.shipping.shipping_cost).toFixed(2) }}</p>
        <p class="mb-2"><span class="font-medium">Shipping Status:</span>
          <span :class="getStatusClass(invoice.shipping.status)">
            {{ formatStatus(invoice.shipping.status) }}
          </span>
        </p>
      </div>
      <p v-else class="mt-6 text-gray-600">No shipping information available for this invoice.</p>

      <div class="mt-6 text-gray-600 text-sm">
        <p>Created: {{ new Date(invoice.created_at).toLocaleString() }}</p>
        <p>Last Updated: {{ new Date(invoice.updated_at).toLocaleString() }}</p>
      </div>
    </div>
    <div v-else class="text-center text-gray-600">
      <p>Invoice not found.</p>
      <button @click="router.back()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go Back</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useInvoices } from '@/composables/useInvoices';

const { getInvoiceById, isLoading, errorMessage } = useInvoices();
const { hasAnyRole } = useAuth();

const route = useRoute();
const router = useRouter();

const invoice = ref(null);
const error = ref(null); // Local error state for display

async function loadInvoiceDetails() {
  error.value = null; // Clear previous errors
  invoice.value = null; // Clear previous invoice data
  const id = route.params.id;

  if (!id) {
    error.value = "No Invoice ID provided.";
    return;
  }

  try {
    const fetchedInvoice = await getInvoiceById(id); // This calls your composable
    if (fetchedInvoice) {
      invoice.value = fetchedInvoice;
    } else {
      // If getInvoiceById returns null or false, use the errorMessage from composable
      error.value = errorMessage.value || "Invoice not found.";
    }
  } catch (err) {
    console.error("Failed to fetch invoice details:", err);
    // Use the composable's errorMessage if available, otherwise generic error
    error.value = errorMessage.value || err.response?.data?.message || "Failed to load invoice details due to an unexpected error.";
  }
}

// Load details when component mounts
onMounted(loadInvoiceDetails);

// Watch for changes in the route parameter 'id' to reload details
watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId && newId !== oldId) {
      loadInvoiceDetails();
    }
  }
);

// Helper function to calculate total price of items
function calculateTotalPrice(items) {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => sum + Number(item.total_price || 0), 0);
}

// Helper function to format date strings
function formatDate(dateString) {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Helper function to format status strings for display
function formatStatus(status) {
  const statusMap = {
    'draft': 'Draft',
    'pending': 'Pending',
    'on_delivery': 'On Delivery',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled',
    'awaiting_stock': 'Awaiting Stock' // Handles shipping status as well
  };
  return statusMap[status] || status; // Fallback to raw status if not mapped
}

// Helper function to get Tailwind CSS classes based on status for styling
function getStatusClass(status) {
  switch (status) {
    case 'delivered':
      return 'bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold';
    case 'on_delivery':
      return 'bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold';
    case 'pending':
    case 'awaiting_stock': // Apply same style for pending and awaiting stock
      return 'bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold';
    case 'cancelled':
      return 'bg-red-200 text-red-800 px-2 py-1 rounded-full text-xs font-semibold';
    case 'draft':
      return 'bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold';
    default:
      return 'bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold';
  }
}

// Function to navigate to the invoice edit page
function goToEditInvoice(invoiceId) {
  router.push({ name: 'EditInvoice', params: { id: invoiceId } });
}
</script>

<style scoped>
/* No changes needed to styles based on the request */
</style>