<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Dashboard</h1>

    <div class="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 class="text-xl font-semibold mb-2">Welcome to your Inventory Management System!</h2>
      <p v-if="isAuthenticated" class="text-gray-700">
        Your current role: <span class="font-medium text-indigo-600">{{ userRole }}</span>
      </p>
      <p v-else class="text-gray-700">
        Please log in to access the system features.
      </p>
    </div>

    <div v-if="isAnyLoading" class="text-center text-gray-600 py-8">
      Loading dashboard data...
    </div>

    <div v-else>
      <!-- Quick Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <!-- Using new computed properties for card values -->
        <DashboardCard title="Total Products" :value="totalProductsCount" description="All products in stock" />
        <DashboardCard title="Total Employees" :value="totalEmployeesCount" description="All registered users" />
        <DashboardCard title="Total Invoices" :value="totalInvoicesCount" description="All invoices created" />
        <DashboardCard title="Pending Invoices" :value="pendingInvoicesCount" description="Invoices awaiting delivery or stock" />
        <DashboardCard title="Total Supplies" :value="totalSuppliesCount" description="All supply records" />
        <DashboardCard title="Pending Supplies" :value="pendingSuppliesCount" description="Supplies not yet received" />
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          title="Invoice Status Distribution"
          :labels="invoiceStatusLabels"
          :data="invoiceStatusData"
          :background-color="['#4A90E2', '#F5A623', '#50E3C2', '#BD10E0', '#E24A4A', '#7ED321']"
          :border-color="['#3A80D2', '#E59613', '#40D3B2', '#AC00D0', '#D23A3A', '#6EC211']"
        />

        <LineChart
          title="Monthly Transaction Volume (Last 6 Months)"
          :labels="monthlyTransactionLabels"
          :data="monthlyTransactionData"
          border-color="#F5A623"
          background-color="rgba(245, 166, 35, 0.2)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useProducts } from '@/composables/useProducts';
import { useInvoices } from '@/composables/useInvoices';
import { useSupplies } from '@/composables/useSupplies';
import { useTransactions } from '@/composables/useTransactions';
import { useEmployees } from '@/composables/useEmployees';

import DashboardCard from '@/components/Dashboard/DashboardCard.vue';
import BarChart from '@/components/charts/BarChart.vue';
import LineChart from '@/components/charts/LineChart.vue';

// Composables
const { isAuthenticated, userRole } = useAuth();
const { products, fetchProducts, isLoading: productsLoading } = useProducts();
const { invoices, fetchInvoices, isLoading: invoicesLoading } = useInvoices();
const { supplies, fetchSupplies, isLoading: suppliesLoading } = useSupplies();
const { transactions, fetchTransactions, isLoading: transactionsLoading } = useTransactions();
const { employees, fetchEmployees, isLoading: employeesLoading } = useEmployees();

// Loading States
const isAnyLoading = computed(() =>
  productsLoading.value ||
  invoicesLoading.value ||
  suppliesLoading.value ||
  transactionsLoading.value ||
  employeesLoading.value
);

// Derived Data for Cards - NEW COMPUTED PROPERTIES for totals
const totalProductsCount = computed(() => products.value?.length ?? 0);
const totalEmployeesCount = computed(() => employees.value?.length ?? 0);
const totalInvoicesCount = computed(() => invoices.value?.data?.length ?? 0);
const totalSuppliesCount = computed(() => supplies.value?.length ?? 0);


const pendingInvoicesCount = computed(() => {
  // Debug log: This log already indicates invoices.value is an object with data property
  // console.log('invoices.value (in pendingInvoicesCount):', invoices.value);
  if (!Array.isArray(invoices.value?.data)) {
    return 0;
  }
  return invoices.value.data.filter(invoice =>
    invoice.status === 'pending' || invoice.status === 'awaiting_stock'
  ).length;
});

const pendingSuppliesCount = computed(() => {
  // Debug log: This log already indicates supplies.value is an array
  // console.log('supplies.value (in pendingSuppliesCount):', supplies.value);
  if (!Array.isArray(supplies.value)) {
    return 0;
  }
  return supplies.value.filter(supply =>
    supply.status === 'pending' || supply.status === 'in_review'
  ).length;
});


// Data for Charts
const invoiceStatusLabels = ref([]);
const invoiceStatusData = ref([]);

const prepareInvoiceStatusData = () => {
  const statusCounts = {
    'draft': 0,
    'pending': 0,
    'on_delivery': 0,
    'delivered': 0,
    'cancelled': 0,
    'awaiting_stock': 0,
  };

  // Debug log: This log confirms invoices.value is an object with data property
  // console.log('invoices.value (in prepareInvoiceStatusData before loop):', invoices.value);
  if (Array.isArray(invoices.value?.data)) {
    invoices.value.data.forEach(invoice => {
      if (statusCounts.hasOwnProperty(invoice.status)) {
        statusCounts[invoice.status]++;
      }
    });
  }

  invoiceStatusLabels.value = Object.keys(statusCounts).map(status => {
    const words = status.split('_');
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  });
  invoiceStatusData.value = Object.values(statusCounts);
};


const monthlyTransactionLabels = ref([]);
const monthlyTransactionData = ref([]);

const prepareMonthlyTransactionData = () => {
  const months = [];
  const today = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push(d.toLocaleString('default', { month: 'short' }));
  }
  monthlyTransactionLabels.value = months;

  const transactionCounts = Array(6).fill(0);

  // Debug log: This log confirms transactions.value is an array
  // console.log('transactions.value (in prepareMonthlyTransactionData before loop):', transactions.value);
  if (Array.isArray(transactions.value)) {
    transactions.value.forEach(transaction => {
      const transactionDate = new Date(transaction.created_at);
      const diffMonths = (today.getFullYear() - transactionDate.getFullYear()) * 12 + (today.getMonth() - transactionDate.getMonth());

      if (diffMonths >= 0 && diffMonths < 6) {
        transactionCounts[5 - diffMonths] += Number(transaction.quantity);
      }
    });
  }
  monthlyTransactionData.value = transactionCounts;
};


onMounted(async () => {
  await Promise.all([
    fetchProducts(),
    fetchInvoices(),
    fetchSupplies(),
    fetchTransactions(),
    fetchEmployees(),
  ]);

  // --- DEBUGGING LOGS (keep these for your own verification) ---
  console.log('--- Dashboard Data After Fetching (from onMounted) ---');
  console.log('products.value:', products.value);
  console.log('invoices.value:', invoices.value);
  console.log('supplies.value:', supplies.value);
  console.log('transactions.value:', transactions.value);
  console.log('employees.value:', employees.value);
  console.log('------------------------------------');
  // --- END DEBUGGING LOGS ---

  prepareInvoiceStatusData();
  prepareMonthlyTransactionData();
});
</script>

<style scoped>
/* No specific styles needed for Dashboard.vue, Tailwind handles it */
</style>
