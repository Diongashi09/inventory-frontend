<template>
  <div class="container mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
    <div v-if="isLoading" class="text-center text-gray-600">Loading supply details...</div>
    <div v-else-if="errorMessage" class="text-center text-red-600 text-lg">
      <p>Error: {{ errorMessage }}</p>
      <button @click="router.back()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go Back</button>
    </div>
    <div v-else-if="supply">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Supply #{{ supply.reference_number }}</h1>
        <div class="space-x-2">
          <button @click="goToEditSupply(supply.id)" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Edit Supply</button>
          <button @click="router.back()" class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Go Back</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h2 class="text-xl font-semibold text-gray-700 mb-3">Supply Information</h2>
          <p class="mb-2"><span class="font-medium">ID:</span> {{ supply.id }}</p>
          <!-- Access supplier name via client relationship -->
          <p class="mb-2"><span class="font-medium">Supplier:</span> {{ supply.supplier_name || supply.supplier?.name || 'N/A' }}</p>
          <p class="mb-2"><span class="font-medium">Supplier Type:</span> {{ supply.supplier_type ? formatStatus(supply.supplier_type) : 'N/A' }}</p>
          <p class="mb-2"><span class="font-medium">Date:</span> {{ formatDate(supply.date) }}</p>
          <p class="mb-2"><span class="font-medium">Status:</span>
            <span :class="getStatusClass(supply.status)">
              {{ formatStatus(supply.status) }}
            </span>
          </p>
          <p class="mb-2"><span class="font-medium">Created By:</span> {{ supply.creator?.name || 'N/A' }}</p>
        </div>
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
          <h2 class="text-xl font-bold text-blue-800 mb-3">Cost Details</h2>
          <p class="mb-2"><span class="font-medium">Tariff Fee:</span> ${{ Number(supply.tariff_fee).toFixed(2) ?? '0.00' }}</p>
          <p class="mb-2"><span class="font-medium">Import Cost:</span> ${{ Number(supply.import_cost).toFixed(2) ?? '0.00' }}</p>
          <p class="mb-2">
            <span class="font-medium">Total Items:</span>
            {{ Array.isArray(supply.items) ? supply.items.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0 }}
          </p>
          <p class="mb-2">
            <span class="font-medium">Total Supply Price:</span>
            ${{ Array.isArray(supply.items) ? calculateTotalPrice(supply.items).toFixed(2) : '0.00' }}
          </p>
        </div>
      </div>

      <!-- Supply Items -->
      <div class="mt-6 bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-600">
        <h2 class="text-xl font-bold text-indigo-800 mb-3">Items Supplied</h2>
        <div v-if="Array.isArray(supply.items) && supply.items.length > 0">
          <ul class="space-y-2">
            <li v-for="item in supply.items" :key="item.id" class="border-b pb-2 last:border-b-0">
              <p class="font-semibold">{{ item.product?.name || 'Unknown Product' }}</p>
              <p class="text-sm text-gray-700">
                Quantity: {{ item.quantity }} | Unit Price: ${{ Number(item.unit_price).toFixed(2) }} | Total: ${{ Number(item.total_price).toFixed(2) }}
              </p>
            </li>
          </ul>
        </div>
        <p v-else class="text-gray-600">No items listed for this supply.</p>
      </div>


      <div class="mt-6 text-gray-600 text-sm">
        <p>Created: {{ new Date(supply.created_at).toLocaleString() }}</p>
        <p>Last Updated: {{ new Date(supply.updated_at).toLocaleString() }}</p>
      </div>
    </div>
    <div v-else class="text-center text-gray-600">
      <p>Supply not found.</p>
      <button @click="router.back()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go Back</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSupplies } from '@/composables/useSupplies';

const { getSupplyById, supply, isLoading, errorMessage } = useSupplies();
const route = useRoute();
const router = useRouter();

// Helper to calculate total price of supply items
function calculateTotalPrice(items) {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => sum + Number(item.total_price || 0), 0);
}

function formatDate(dateString) {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatStatus(status) {
  const statusMap = {
    'pending': 'Pending',
    'in_review': 'In Review', // Added 'in_review' based on migration
    'received': 'Received',
    'cancelled': 'Cancelled',
    'person': 'Person', // For supplier_type
    'company': 'Company', // For supplier_type
  };
  return statusMap[status] || status;
}

function getStatusClass(status) {
  switch (status) {
    case 'received':
      return 'bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold';
    case 'pending':
    case 'in_review': // Added in_review
      return 'bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold';
    case 'cancelled':
      return 'bg-red-200 text-red-800 px-2 py-1 rounded-full text-xs font-semibold';
    default:
      return 'bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold';
  }
}

function goToEditSupply(id) {
  router.push({ name: 'EditSupply', params: { id } });
}

onMounted(() => {
  const id = route.params.id;
  if (id) getSupplyById(id);
});
</script>


<!-- <template>
  <div class="container mx-auto p-4 bg-white shadow-md rounded-lg">
    <h2 class="text-2xl font-semibold mb-4">Supply Details</h2>

    <div v-if="isLoading" class="text-center py-8">
      <p>Loading supply details...</p>
    </div>

    <div v-else-if="errorMessage" class="text-red-600 text-center py-8">
      <p>{{ errorMessage }}</p>
    </div>

    <div v-else-if="supply">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <p><strong>Name:</strong> {{ supply.name }}</p>
        <p><strong>Category:</strong> {{ supply.category }}</p>
        <p><strong>Quantity:</strong> {{ supply.quantity }}</p>
        <p><strong>Unit Price:</strong> ${{ supply.unitPrice ? supply.unitPrice.toFixed(2) : '0.00' }}</p>
        <p><strong>Supplier:</strong> {{ supply.supplier }}</p>
        <p><strong>Received Date:</strong> {{ formatDate(supply.receivedDate) }}</p>
        <p class="col-span-2"><strong>Notes:</strong> {{ supply.notes || 'N/A' }}</p>
        <p><strong>Created At:</strong> {{ formatDate(supply.createdAt) }}</p>
        <p><strong>Last Updated:</strong> {{ formatDate(supply.updatedAt) }}</p>
      </div>

      <div class="mt-6 flex space-x-4">
        <router-link
          :to="{ name: 'EditSupply', params: { id: supply.id } }"
          class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Edit Supply
        </router-link>
        <button
          @click="confirmDelete"
          class="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Delete Supply
        </button>
        <button
          @click="router.back()"
          class="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Back to List
        </button>
      </div>
    </div>


    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div class="relative p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Confirm Deletion</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">
              Are you sure you want to delete this supply record? This action cannot be undone.
            </p>
          </div>
          <div class="items-center px-4 py-3">
            <button
              @click="executeDelete"
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
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSupplies } from '@/composables/useSupplies';

const route = useRoute();
const router = useRouter();
const { supply, isLoading, errorMessage, getSupplyById, deleteSupply } = useSupplies();

const showDeleteModal = ref(false);

onMounted(async () => {
  const supplyId = route.params.id;
  if (supplyId) {
    await getSupplyById(supplyId);
  }
});

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const confirmDelete = () => {
  showDeleteModal.value = true;
};

const executeDelete = async () => {
  showDeleteModal.value = false;
  if (supply.value && supply.value.id) {
    await deleteSupply(supply.value.id);
    if (!errorMessage.value) {
      router.push({ name: 'Supplies' });
    }
  }
};
</script>

<style scoped>
</style> -->

<!-- space -->

<!-- <template>
  <div class="container mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
    <div v-if="isLoading" class="text-center text-gray-600">Loading supply details...</div>
    <div v-else-if="error" class="text-center text-red-600 text-lg">
      <p>Error: {{ error }}</p>
      <button @click="router.back()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go Back</button>
    </div>
    <div v-else-if="supply">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Supply #{{ supply.reference_number }}</h1>
        <button @click="router.back()" class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Go Back</button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h2 class="text-xl font-semibold text-gray-700 mb-3">Supply Information</h2>
          <p class="mb-2"><span class="font-medium">Date:</span> {{ formatDate(supply.date) }}</p>
          <p class="mb-2"><span class="font-medium">Supplier Type:</span> {{ formatSupplierType(supply.supplier_type) }}</p>
          <p class="mb-2"><span class="font-medium">Supplier:</span> {{ supply.client?.name || 'N/A' }}</p>
          <p class="mb-2"><span class="font-medium">Created By:</span> {{ supply.creator?.name || 'N/A' }}</p>
          <p class="mb-2">
            <span class="font-medium">Status:</span>
            <span :class="getStatusClass(supply.status)">
                {{ formatStatus(supply.status) }}
            </span>
          </p>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <h2 class="text-xl font-semibold text-gray-700 mb-3">Cost Details</h2>
          <p class="mb-2"><span class="font-medium">Tariff Fee:</span> ${{ Number(supply.tariff_fee || 0).toFixed(2) }}</p>
          <p class="mb-2"><span class="font-medium">Import Cost:</span> ${{ Number(supply.import_cost || 0).toFixed(2) }}</p>
        </div>
      </div>

      <h3 class="text-xl font-semibold text-gray-700 mb-3">Supply Items</h3>
      <table class="w-full table-auto border-collapse mb-6">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-2 text-left">Product</th>
            <th class="p-2 text-right">Quantity</th>
            <th class="p-2 text-right">Unit Price</th>
            <th class="p-2 text-right">Total Price</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in supply.items" :key="item.id" class="border-t">
            <td class="p-2">{{ item.product?.name || 'N/A' }}</td>
            <td class="p-2 text-right">{{ item.quantity }}</td>
            <td class="p-2 text-right">${{ Number(item.unit_price).toFixed(2) }}</td>
            <td class="p-2 text-right">${{ Number(item.total_price).toFixed(2) }}</td>
          </tr>
          <tr v-if="supply.items.length === 0">
            <td colspan="4" class="p-4 text-center text-gray-500">No items in this supply.</td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-100 font-semibold">
            <tr>
                <td colspan="3" class="p-2 text-right">Subtotal:</td>
                <td class="p-2 text-right">${{ calculateItemsTotalPrice(supply.items).toFixed(2) }}</td>
            </tr>
            <tr>
                <td colspan="3" class="p-2 text-right">Tariff Fee:</td>
                <td class="p-2 text-right">${{ Number(supply.tariff_fee || 0).toFixed(2) }}</td>
            </tr>
            <tr>
                <td colspan="3" class="p-2 text-right">Import Cost:</td>
                <td class="p-2 text-right">${{ Number(supply.import_cost || 0).toFixed(2) }}</td>
            </tr>
            <tr>
                <td colspan="3" class="p-2 text-right">Grand Total:</td>
                <td class="p-2 text-right">${{ calculateGrandTotal(supply).toFixed(2) }}</td>
            </tr>
        </tfoot>
      </table>

      <div class="mt-6 text-gray-600 text-sm">
        <p>Created: {{ new Date(supply.created_at).toLocaleString() }}</p>
        <p>Last Updated: {{ new Date(supply.updated_at).toLocaleString() }}</p>
      </div>
    </div>
    <div v-else class="text-center text-gray-600">
      <p>Supply not found.</p>
      <button @click="router.back()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go Back</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchSupply } from '../../composables/useSupplies';

const route = useRoute();
const router = useRouter();

const supply = ref(null);
const isLoading = ref(true);
const error = ref(null);

const supplyId = ref(route.params.id);

async function loadSupply() {
  isLoading.value = true;
  error.value = null;
  supply.value = null;

  try {
    const fetchedSupply = await fetchSupply(supplyId.value);
    if (fetchedSupply) {
      supply.value = fetchedSupply;
    } else {
      error.value = "Supply not found.";
    }
  } catch (err) {
    console.error("Failed to fetch supply:", err);
    error.value = err.message || "Failed to load supply details.";
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadSupply);

watch(
  () => route.params.id,
  (newId) => {
    supplyId.value = newId;
    loadSupply();
  }
);

function calculateItemsTotalPrice(items) {
  return items.reduce((sum, item) => sum + Number(item.total_price), 0);
}

function calculateGrandTotal(spply) {
    const itemsTotal = calculateItemsTotalPrice(spply.items);
    const tariffFee = Number(spply.tariff_fee || 0);
    const importCost = Number(spply.import_cost || 0);
    return itemsTotal + tariffFee + importCost;
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatStatus(status) {
    const statusMap = {
        'pending': 'Pending',
        'in_review': 'In Review',
        'received': 'Received',
        'cancelled': 'Cancelled',
    };
    return statusMap[status] || status;
}

function getStatusClass(status) {
    switch (status) {
        case 'received':
            return 'inline-block bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold';
        case 'in_review':
            return 'inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold';
        case 'pending':
            return 'inline-block bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold';
        case 'cancelled':
            return 'inline-block bg-red-200 text-red-800 px-2 py-1 rounded-full text-xs font-semibold';
        default:
            return 'inline-block bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold';
    }
}

function formatSupplierType(type) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}
</script>

<style scoped>

</style> -->