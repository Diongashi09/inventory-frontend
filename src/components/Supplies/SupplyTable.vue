<template>
  <div class="bg-white shadow-md rounded-lg p-4">
    <div v-if="supplies.length === 0" class="text-center py-8">
      <p>No supplies found. Start by creating a new one!</p>
    </div>
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference #</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="supply in supplies" :key="supply.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ supply.reference_number }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ supply.supplier_name || supply.supplier?.name || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(supply.date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(supply.status)">
                {{ formatStatus(supply.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="$emit('view', supply)" class="text-indigo-600 hover:text-indigo-900 mr-4">View</button>
              <button @click="$emit('edit', supply)" class="text-green-600 hover:text-green-900 mr-4">Edit</button>
              <button @click="$emit('delete', supply.id)" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  supplies: {
    type: Array,
    required: true,
    default: () => []
  }
});

function formatDate(dateString) {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatStatus(status) {
  const statusMap = {
    'pending': 'Pending',
    'received': 'Received',
    'cancelled': 'Cancelled'
  };
  return statusMap[status] || status;
}

function getStatusClass(status) {
  switch (status) {
    case 'received':
      return 'bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold';
    case 'pending':
      return 'bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold';
    case 'cancelled':
      return 'bg-red-200 text-red-800 px-2 py-1 rounded-full text-xs font-semibold';
    default:
      return 'bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold';
  }
}
</script>


<!-- <template>
  <div class="bg-white shadow-md rounded-lg p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold">Supplies Inventory</h2>
      <router-link
        :to="{ name: 'CreateSupply' }"
        class="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Add New Supply
      </router-link>
    </div>

    <div v-if="isLoading" class="text-center py-8">
      <p>Loading supplies...</p>
    </div>

    <div v-else-if="errorMessage" class="text-red-600 text-center py-8">
      <p>{{ errorMessage }}</p>
    </div>

    <div v-else-if="supplies.length === 0" class="text-center py-8">
      <p>No supplies found. Add new supplies to your inventory!</p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Unit Price
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Supplier
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Received Date
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="supply in supplies" :key="supply.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ supply.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ supply.category }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ supply.quantity }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              ${{ supply.unitPrice ? supply.unitPrice.toFixed(2) : '0.00' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ supply.supplier }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(supply.receivedDate) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <router-link
                :to="{ name: 'SupplyDetails', params: { id: supply.id } }"
                class="text-indigo-600 hover:text-indigo-900 mr-4"
              >
                View
              </router-link>
              <router-link
                :to="{ name: 'EditSupply', params: { id: supply.id } }"
                class="text-green-600 hover:text-green-900 mr-4"
              >
                Edit
              </router-link>
              <button
                @click="confirmDelete(supply.id)"
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
              Are you sure you want to delete this supply record? This action cannot be undone.
            </p>
          </div>
          <div class="items-center px-4 py-3">
            <button
              @click="deleteSupply(supplyToDeleteId); showDeleteModal = false;"
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
import { useSupplies } from '@/composables/useSupplies';

const { supplies, isLoading, errorMessage, fetchSupplies, deleteSupply } = useSupplies();

const showDeleteModal = ref(false);
const supplyToDeleteId = ref(null);

onMounted(async () => {
  await fetchSupplies();
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const confirmDelete = (id) => {
  supplyToDeleteId.value = id;
  showDeleteModal.value = true;
};
</script>

<style scoped>

</style> -->


<!-- <template>
  <table class="w-full table-auto border-collapse">
    <thead class="bg-gray-100">
      <tr>
        <th class="p-2 text-left">Ref. No.</th>
        <th class="p-2 text-left">Supplier</th>
        <th class="p-2 text-left">Date</th>
        <th class="p-2 text-center">Total Items</th>
        <th class="p-2 text-right">Total Cost</th>
        <th class="p-2 text-left">Status</th>
        <th class="p-2 text-left">Created By</th>
        <th class="p-2 text-center w-[200px]">Actions</th> 
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="supply in supplies"
        :key="supply.id"
        class="border-t hover:bg-gray-50 cursor-pointer"
        @click="goToSupplyDetails(supply.id)"
      >
        <td class="p-2 font-medium text-left">{{ supply.reference_number }}</td>
        <td class="p-2 text-left">{{ supply.client?.name || 'N/A' }} ({{ supply.supplier_type }})</td>
        <td class="p-2 text-left">{{ formatDate(supply.date) }}</td>
        <td class="p-2 text-center">{{ supply.items.reduce((sum, item) => sum + item.quantity, 0) }}</td>
        <td class="p-2 text-right">${{ calculateGrandTotal(supply).toFixed(2) }}</td>
        <td class="p-2">
            <span :class="getStatusClass(supply.status)">
                {{ formatStatus(supply.status) }}
            </span>
        </td>
        <td class="p-2">{{ supply.creator?.name || 'N/A' }}</td>
        <td class="p-2 flex items-center justify-center space-x-2 h-full">
          <button
            v-if="hasAnyRole(['Admin', 'Manager'])"
            class="px-2 py-1 text-xs bg-blue-400 text-white rounded-md hover:bg-blue-500 flex-shrink-0 w-[80px]" 
            @click="$emit('edit', supply)"
          >
            Edit Status
          </button>
          <button
            v-if="hasRole('Admin')"
            class="px-2 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 flex-shrink-0 w-[80px]"
            @click="$emit('delete', supply.id)"
          >
            Delete
          </button>
        </td>
      </tr>
      <tr v-if="supplies.length === 0">
        <td colspan="8" class="p-4 text-center text-gray-500">No supplies found.</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth'; 

const router = useRouter();
const { hasRole, hasAnyRole } = useAuth(); 

const props = defineProps({
  supplies: { type: Array, required: true }
});

const emit = defineEmits(['edit', 'delete']);

function goToSupplyDetails(supplyId) {
  router.push({ name: 'SupplyDetails', params: { id: supplyId } });
}

function calculateItemsTotalPrice(items) {
  return items.reduce((sum, item) => sum + Number(item.total_price), 0);
}

function calculateGrandTotal(supply) {
    const itemsTotal = calculateItemsTotalPrice(supply.items);
    const tariffFee = Number(supply.tariff_fee || 0);
    const importCost = Number(supply.import_cost || 0);
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
            return 'bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold';
        case 'in_review':
            return 'bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold';
        case 'pending':
            return 'bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold';
        case 'cancelled':
            return 'bg-red-200 text-red-800 px-2 py-1 rounded-full text-xs font-semibold';
        default:
            return 'bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold';
    }
}
</script>

<style scoped>
</style> -->