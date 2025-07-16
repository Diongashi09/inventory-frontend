<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">My Orders</h1>

    <div v-if="isLoading" class="text-center text-gray-500">Loading your orders...</div>

    <div
      v-else-if="errorMessage"
      class="text-red-600 text-center p-4 bg-red-100 border border-red-200 rounded-md"
    >
      {{ errorMessage }}
    </div>

    <div
      v-else-if="orders.length === 0"
      class="text-center text-gray-500 p-4 bg-gray-50 rounded-md"
    >
      You haven't placed any orders yet.
    </div>

    <div v-else class="overflow-x-auto bg-white shadow-md rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reference No.
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created By
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Items
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="o in orders" :key="o.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ o.reference_number }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(o.date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ o.creator?.name || 'Unknown' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ o.items?.length || 0 }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <router-link
                :to="{ name: 'MyOrderDetails', params: { id: o.id } }"
                class="text-indigo-600 hover:text-indigo-900"
              >
                View Details
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useOrders } from '@/composables/useOrders'

const { orders, isLoading, errorMessage, fetchOrders } = useOrders()

onMounted(() => {
  fetchOrders()
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}
</script>


<!-- <template>
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">My Orders</h1>
  
      <div v-if="isLoading" class="text-center text-gray-500">Loading your orders...</div>
      <div v-else-if="errorMessage" class="text-red-600 text-center p-4 bg-red-100 border border-red-200 rounded-md">
        {{ errorMessage }}
      </div>
      <div v-else-if="invoices.length === 0" class="text-center text-gray-500 p-4 bg-gray-50 rounded-md">
        You haven't placed any orders yet.
      </div>
      <div v-else class="overflow-x-auto bg-white shadow-md rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference No.</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
              <th class="px-6 py-3 text-left text-xs font-font-medium text-gray-500 uppercase tracking-wider">Total Products</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="invoice in invoices" :key="invoice.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ invoice.reference_number }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(invoice.date) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ invoice.creator ? invoice.creator.name : 'Unknown' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ invoice.items ? invoice.items.length : 0 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <router-link :to="{ name: 'MyOrderDetails', params: { id: invoice.id } }" class="text-indigo-600 hover:text-indigo-900 mr-4">View Details</router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template> -->

<!-- <template>
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">My Orders</h1>
  
      <div v-if="isLoading" class="text-center text-gray-500">Loading your orders...</div>
      <div v-else-if="errorMessage" class="text-red-600 text-center p-4 bg-red-100 border border-red-200 rounded-md">
        {{ errorMessage }}
      </div>
      <div v-else-if="invoices.length === 0" class="text-center text-gray-500 p-4 bg-gray-50 rounded-md">
        You haven't placed any orders yet.
      </div>
      <div v-else class="overflow-x-auto bg-white shadow-md rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference No.</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
              <th class="px-6 py-3 text-left text-xs font-font-medium text-gray-500 uppercase tracking-wider">Total Products</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="invoice in invoices" :key="invoice.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ invoice.reference_number }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(invoice.date) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span :class="getStatusClass(invoice.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ invoice.status.replace(/_/g, ' ') }}
                  </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ invoice.creator.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ invoice.items.length }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <router-link :to="{ name: 'MyOrderDetails', params: { id: invoice.id } }" class="text-indigo-600 hover:text-indigo-900 mr-4">View Details</router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template> -->
  
  <!-- <script setup>
  import { onMounted } from 'vue';
  import { useInvoices } from '@/composables/useInvoices'; // Use the invoices composable
  
  const { invoices, isLoading, errorMessage, fetchInvoices } = useInvoices();
  
  onMounted(() => {
    // fetchInvoices will automatically filter by the client's ID on the backend
    // due to the logic added in InvoiceController@index.
    fetchInvoices();
  });
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'on_delivery':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  </script>
  
  <style scoped>
  </style>
   -->