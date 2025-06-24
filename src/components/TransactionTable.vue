<template>
  <div class="bg-white shadow-md rounded-lg p-4">
    <div v-if="transactions.length === 0" class="text-center py-8">
      <p>No transactions found.</p>
    </div>
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="transaction in transactions" :key="transaction.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ transaction.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ transaction.product?.name || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatType(transaction.transaction_type) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ transaction.quantity }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(transaction.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ transaction.creator?.name || 'N/A' }}
              <!-- {{ transaction.created_by || 'N/A' }} -->
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="$emit('view', transaction)" class="text-indigo-600 hover:text-indigo-900">View</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  transactions: {
    type: Array,
    required: true,
    default: () => []
  }
});

function formatDate(dateString) {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatType(type) {
  if (!type) return '';
  return type.charAt(0).toUpperCase() + type.slice(1);
}
</script>

<!-- <template>
  <div class="bg-white shadow-md rounded-lg p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold">Transactions History</h2>
      
    </div>

    <div v-if="isLoading" class="text-center py-8">
      <p>Loading transactions...</p>
    </div>

    <div v-else-if="errorMessage" class="text-red-600 text-center py-8">
      <p>{{ errorMessage }}</p>
    </div>

    <div v-else-if="transactions.length === 0" class="text-center py-8">
      <p>No transaction records found.</p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Transaction ID
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Invoice #
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Payment Method
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="transaction in transactions" :key="transaction.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ transaction.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ getInvoiceNumber(transaction.invoiceId) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              ${{ transaction.amount ? transaction.amount.toFixed(2) : '0.00' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ transaction.type }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(transaction.transactionDate) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ transaction.paymentMethod }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <router-link
                :to="{ name: 'TransactionDetails', params: { id: transaction.id } }"
                class="text-indigo-600 hover:text-indigo-900 mr-4"
              >
                View
              </router-link>
              <button
                @click="confirmDelete(transaction.id)"
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
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
              @click="deleteTransaction(transactionToDeleteId); showDeleteModal = false;"
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
import { useTransactions } from '@/composables/useTransactions';
import { useInvoices } from '@/composables/useInvoices'; 

const { transactions, isLoading, errorMessage, fetchTransactions, deleteTransaction } = useTransactions();
const { invoices, fetchInvoices } = useInvoices(); 
const showDeleteModal = ref(false);
const transactionToDeleteId = ref(null);

onMounted(async () => {
  await fetchTransactions();
  await fetchInvoices(); 
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const getInvoiceNumber = (invoiceId) => {
  const invoice = invoices.value.find(i => i.id === invoiceId);
  return invoice ? invoice.invoiceNumber : 'N/A';
};

const confirmDelete = (id) => {
  transactionToDeleteId.value = id;
  showDeleteModal.value = true;
};
</script>

<style scoped>
</style> -->

<!-- space -->

<!-- <template>
  <table class="w-full table-auto border-collapse">
    <thead class="bg-gray-100">
      <tr>
        <th class="p-2 text-left">ID</th>
        <th class="p-2 text-left">Product</th>
        <th class="p-2 text-left">Type</th>
        <th class="p-2 text-right">Quantity</th>
        <th class="p-2 text-right">Total</th>
        <th class="p-2 text-left">Date</th>
        <th class="p-2 text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="transaction in transactions"
        :key="transaction.id"
        class="border-t hover:bg-gray-50 cursor-pointer"
        @click="goToTransactionDetails(transaction.id)"
      >
        <td class="p-2 font-medium">{{ transaction.id }}</td>
        <td class="p-2">{{ transaction.product?.name || 'N/A' }}</td>
        <td class="p-2">
            <span :class="getTypeClass(transaction.type)">
                {{ formatType(transaction.type) }}
            </span>
        </td>
        <td class="p-2 text-right">{{ transaction.quantity }}</td>
        <td class="p-2 text-right">${{ Number(transaction.total).toFixed(2) }}</td>
        <td class="p-2">{{ formatDate(transaction.created_at) }}</td>
        <td class="p-2 text-center">
          <button
            class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            @click.stop="goToTransactionDetails(transaction.id)"
          >
            View Details
          </button>
        </td>
      </tr>
      <tr v-if="transactions.length === 0">
        <td colspan="7" class="p-4 text-center text-gray-500">No transactions found.</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  transactions: { type: Array, required: true }
});

function goToTransactionDetails(id) {
  router.push({ name: 'TransactionDetails', params: { id: id } });
}

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
            return 'bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold';
        case 'purchase':
            return 'bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold';
        case 'adjustment':
            return 'bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs font-semibold';
        case 'return':
            return 'bg-red-200 text-red-800 px-2 py-1 rounded-full text-xs font-semibold';
        default:
            return 'bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold';
    }
}
</script>

<style scoped>
</style> -->