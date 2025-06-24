<template>
  <div class="container mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
    <div v-if="isLoading" class="text-center text-gray-600">Loading transaction details...</div>
    <div v-else-if="errorMessage" class="text-center text-red-600 text-lg">
      <p>Error: {{ errorMessage }}</p>
      <button @click="router.back()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go Back</button>
    </div>
    <div v-else-if="transaction">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Transaction #{{ transaction.id }}</h1>
        <div>
          <button @click="router.back()" class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Go Back</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h2 class="text-xl font-semibold text-gray-700 mb-3">Transaction Information</h2>
          <p class="mb-2"><span class="font-medium">ID:</span> {{ transaction.id }}</p>
          <p class="mb-2"><span class="font-medium">Product:</span> {{ transaction.product?.name || 'N/A' }}</p>
          <p class="mb-2"><span class="font-medium">Type:</span> {{ formatType(transaction.type) }}</p>
          <p class="mb-2"><span class="font-medium">Quantity:</span> {{ transaction.quantity }}</p>
          <p class="mb-2"><span class="font-medium">Date:</span> {{ formatDate(transaction.created_at) }}</p>
        </div>
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
          <h2 class="text-xl font-bold text-blue-800 mb-3">Creator</h2>
          <p class="mb-2"><span class="font-medium">Name:</span> {{ transaction.creator?.name || 'N/A' }}</p>
          <p class="mb-2"><span class="font-medium">Email:</span> {{ transaction.creator?.email || 'N/A' }}</p>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-600">
      <p>Transaction not found.</p>
      <button @click="router.back()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go Back</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTransactions } from '@/composables/useTransactions';

const { getTransactionById, transaction, isLoading, errorMessage } = useTransactions();
const route = useRoute();
const router = useRouter();

function formatDate(dateString) {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatType(type) {
  if (!type) return '';
  return type.charAt(0).toUpperCase() + type.slice(1);
}

onMounted(() => {
  const id = route.params.id;
  if (id) getTransactionById(id);
});
</script>

<!-- <template>
  <div class="container mx-auto p-4 bg-white shadow-md rounded-lg">
    <h2 class="text-2xl font-semibold mb-4">Transaction Details</h2>

    <div v-if="isLoading" class="text-center py-8">
      <p>Loading transaction details...</p>
    </div>

    <div v-else-if="errorMessage" class="text-red-600 text-center py-8">
      <p>{{ errorMessage }}</p>
    </div>

    <div v-else-if="transaction">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <p><strong>Transaction ID:</strong> {{ transaction.id }}</p>
        <p><strong>Invoice ID:</strong> {{ transaction.invoiceId }}</p>
        <p><strong>Amount:</strong> ${{ transaction.amount ? transaction.amount.toFixed(2) : '0.00' }}</p>
        <p><strong>Type:</strong> {{ transaction.type }}</p>
        <p><strong>Date:</strong> {{ formatDate(transaction.transactionDate) }}</p>
        <p><strong>Payment Method:</strong> {{ transaction.paymentMethod }}</p>
        <p class="col-span-2"><strong>Notes:</strong> {{ transaction.notes || 'N/A' }}</p>
        <p><strong>Created At:</strong> {{ formatDate(transaction.createdAt) }}</p>
        <p><strong>Last Updated:</strong> {{ formatDate(transaction.updatedAt) }}</p>
      </div>

      <div class="mt-6 flex space-x-4">
        
        <button
          @click="confirmDelete"
          class="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Delete Transaction
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
              Are you sure you want to delete this transaction record? This action cannot be undone.
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
import { useTransactions } from '@/composables/useTransactions';

const route = useRoute();
const router = useRouter();
const { transaction, isLoading, errorMessage, getTransactionById, deleteTransaction } = useTransactions();

const showDeleteModal = ref(false);

onMounted(async () => {
  const transactionId = route.params.id;
  if (transactionId) {
    await getTransactionById(transactionId);
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
  if (transaction.value && transaction.value.id) {
    await deleteTransaction(transaction.value.id);
    if (!errorMessage.value) {
      router.push({ name: 'Transactions' });
    }
  }
};
</script>

<style scoped>
</style> -->

<!-- space -->

<!-- <template>
  <div class="container mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
    <div v-if="isLoading" class="text-center text-gray-600">Loading transaction details...</div>
    <div v-else-if="error" class="text-center text-red-600 text-lg">
      <p>Error: {{ error }}</p>
      <button @click="router.back()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go Back</button>
    </div>
    <div v-else-if="transaction">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Transaction #{{ transaction.id }}</h1>
        <button @click="router.back()" class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Go Back</button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
          <h2 class="text-xl font-bold text-blue-800 mb-3">Transaction Information</h2>
          <p class="mb-2"><span class="font-medium">Type:</span>
            <span :class="getTypeClass(transaction.type)">
                {{ formatType(transaction.type) }}
            </span>
          </p>
          <p class="mb-2"><span class="font-medium">Quantity:</span> {{ transaction.quantity }}</p>
          <p class="mb-2"><span class="font-medium">Total Amount:</span> ${{ Number(transaction.total).toFixed(2) }}</p>
          <p class="mb-2"><span class="font-medium">Date:</span> {{ formatDate(transaction.created_at) }}</p>
          <p class="mb-2"><span class="font-medium">Last Updated:</span> {{ formatDate(transaction.updated_at) }}</p>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <h2 class="text-xl font-semibold text-gray-700 mb-3">Related Product</h2>
          <template v-if="transaction.product">
            <p class="mb-2"><span class="font-medium">Product Name:</span> {{ transaction.product.name }}</p>
            <p class="mb-2"><span class="font-medium">Product Code:</span> {{ transaction.product.code }}</p>
            <p class="mb-2"><span class="font-medium">Current Stock:</span> {{ transaction.product.stock }}</p>
            <p class="mb-2"><span class="font-medium">Price:</span> ${{ Number(transaction.product.price).toFixed(2) }}</p>
            <div class="mt-4 text-center">
              <button
                @click="goToProductDetails(transaction.product.id)"
                class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                View Product Details
              </button>
            </div>
          </template>
          <p v-else class="text-gray-500">Product details not available.</p>
        </div>

        <div class="md:col-span-2 bg-gray-50 p-4 rounded-lg">
          <h2 class="text-xl font-semibold text-gray-700 mb-3">Created By</h2>
          <template v-if="transaction.creator">
            <p class="mb-2"><span class="font-medium">Name:</span> {{ transaction.creator.name }}</p>
            <p class="mb-2"><span class="font-medium">Email:</span> {{ transaction.creator.email }}</p>
          </template>
          <p v-else class="text-gray-500">Creator details not available.</p>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-600">
      <p>Transaction not found.</p>
      <button @click="router.back()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go Back</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchTransaction } from '../../composables/useTransactions'; 

const route = useRoute();
const router = useRouter();

const transaction = ref(null);
const isLoading = ref(true);
const error = ref(null);

const props = defineProps({
  id: { type: [String, Number], required: true } 
});

async function loadTransactionDetails() {
  isLoading.value = true;
  error.value = null;
  transaction.value = null;

  try {
    const fetchedTransaction = await fetchTransaction(props.id);
    if (fetchedTransaction) {
      transaction.value = fetchedTransaction;
    } else {
      error.value = "Transaction not found.";
    }
  } catch (err) {
    console.error("Failed to fetch transaction details:", err);
    error.value = err.message || "Failed to load transaction details.";
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadTransactionDetails);

watch(
  () => props.id,
  (newId) => {
    if (newId) {
      loadTransactionDetails();
    }
  }
);

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatType(type) {
    const typeMap = {
        'sale': 'Sale',
        'purchase': 'Purchase',
        'adjustment': 'Adjustment',
        'return': 'Return',
    };
    return typeMap[type] || type;
}

function getTypeClass(type) {
    switch (type) {
        case 'sale':
            return 'inline-block bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold';
        case 'purchase':
            return 'inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold';
        case 'adjustment':
            return 'inline-block bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs font-semibold';
        case 'return':
            return 'inline-block bg-red-200 text-red-800 px-2 py-1 rounded-full text-xs font-semibold';
        default:
            return 'inline-block bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold';
    }
}

function goToProductDetails(id) {
  router.push({ name: 'ProductDetails', params: { id: id } });
}
</script>

<style scoped>
</style> -->