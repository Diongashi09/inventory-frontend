<template>
  <div class="p-6 space-y-4">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold">Transactions</h1>
    </div>

    <div class="mb-4">
      <input
        type="text"
        v-model="searchQuery"
        @input="handleSearch"
        placeholder="Search by creator name..."
        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>

    <div v-if="isLoading" class="text-center text-gray-600 py-8">
      Loading transactions...
    </div>

    <div v-else>
      <TransactionTable
        :transactions="Array.isArray(transactions) ? transactions : transactions.data || []"
        @view="goToTransactionDetails"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTransactions } from '@/composables/useTransactions';
import TransactionTable from '@/components/TransactionTable.vue';

const { transactions, fetchTransactions, isLoading, errorMessage } = useTransactions();
const router = useRouter();

const searchQuery = ref(''); // New reactive variable for search
let searchTimeout = null; // For debouncing search input

async function loadAllTransactions(params = {}) {
  await fetchTransactions(params);
}

onMounted(() => {
  loadAllTransactions();
});

// Handle search input with debouncing
const handleSearch = () => {
  clearTimeout(searchTimeout); // Clear previous timeout
  searchTimeout = setTimeout(() => {
    loadAllTransactions({ search: searchQuery.value }); // Trigger fetch after debounce
  }, 300); // 300ms debounce time
};


function goToTransactionDetails(transaction) {
  router.push({ name: 'TransactionDetails', params: { id: transaction.id } });
}
</script>

<!-- space -->

<!-- <template>
  <div class="p-6 space-y-4">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold">Transaction History</h1>
      </div>

    <div v-if="isLoading" class="text-center text-gray-600 py-8">
      Loading transactions...
    </div>

    <TransactionTable
      v-else
      :transactions="transactions"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { transactions, fetchTransactions } from '../../composables/useTransactions'; 

import TransactionTable from '../../components/TransactionTable.vue';


const isLoading = ref(true);

async function loadTransactions() {
  isLoading.value = true;
  try {
    await fetchTransactions(); 
  } catch (error) {
    console.error("Error loading transactions:", error);
    alert("Failed to load transactions: " + (error.response?.data?.message || error.message));
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadTransactions);
</script>

<style>
</style> -->