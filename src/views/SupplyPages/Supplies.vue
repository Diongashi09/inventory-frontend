<template>
  <div class="p-6 space-y-4">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold">Supplies</h1>
      <button
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        @click="goToCreateSupply"
      >
        New Supply
      </button>
    </div>

    <div v-if="isLoading" class="text-center text-gray-600 py-8">
      Loading supplies...
    </div>
    <div v-else-if="errorMessage" class="text-center text-red-600 py-8">
      <p>{{ errorMessage }}</p>
    </div>
    <div v-else>
      <SupplyTable
        :supplies="supplies" 
        @view="goToSupplyDetails"
        @edit="goToEditSupply"
        @delete="confirmDelete" 
      />
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div class="relative p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Confirm Deletion</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">
              Are you sure you want to delete this supply? This action cannot be undone.
            </p>
          </div>
          <div class="items-center px-4 py-3 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="performDelete"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Delete
            </button>
            <button
              type="button"
              @click="showDeleteModal = false"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
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
import { useRouter } from 'vue-router';
import { useSupplies } from '@/composables/useSupplies';
import SupplyTable from '@/components/Supplies/SupplyTable.vue';

const { supplies, fetchSupplies, deleteSupply, isLoading, errorMessage } = useSupplies();
const router = useRouter();

const showDeleteModal = ref(false);
const supplyToDeleteId = ref(null);

async function loadAllSupplies() { // Renamed from loadAllInvoices
  await fetchSupplies();
}

onMounted(loadAllSupplies);

function goToCreateSupply() { // Corrected navigation for creation
  router.push({ name: 'CreateSupply' });
}

function goToEditSupply(supply) {
  router.push({ name: 'EditSupply', params: { id: supply.id } });
}

function goToSupplyDetails(supply) {
  router.push({ name: 'SupplyDetails', params: { id: supply.id } });
}

function confirmDelete(id) { // Open modal
  supplyToDeleteId.value = id;
  showDeleteModal.value = true;
}

async function performDelete() { // Action after confirming delete
  showDeleteModal.value = false; // Close modal immediately
  if (supplyToDeleteId.value) {
    try {
      await deleteSupply(supplyToDeleteId.value);
      alert('Supply deleted successfully!');
      // The `deleteSupply` composable already updates `supplies.value` by filtering.
      // So, `await loadAllSupplies()` is not strictly necessary here unless you want
      // to re-fetch fresh data from the server.
    } catch (error) {
      console.error("Error deleting supply:", error);
      alert("Failed to delete supply: " + (errorMessage.value || error.message));
    }
  }
}
</script>

<style scoped>
/* Scoped styles for Supplies.vue if any */
</style>



<!-- space -->

<!-- <template>
  <div class="p-6 space-y-4">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold">Supplies</h1>
      <button
        v-if="hasAnyRole(['Admin', 'Manager', 'Staff'])"
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        @click="goToCreateSupply"
      >
        New Supply
      </button>
    </div>

    <div v-if="isLoading" class="text-center text-gray-600 py-8">
      Loading supplies...
      <p class="text-sm">Please wait while we fetch the data.</p>
    </div>

    <SupplyTable
      v-else
      :supplies="supplies"
      @edit="goToEditSupply"
      @delete="onDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; 
import {
  supplies,
  fetchSupplies,
  deleteSupply
} from '@/composables/useSupplies';
import { useAuth } from '@/composables/useAuth'; 

import SupplyTable from '@/components/Supplies/SupplyTable.vue';

const router = useRouter();
const { hasAnyRole } = useAuth(); 

const isLoading = ref(true);

async function loadAllSupplies() {
  isLoading.value = true;
  try {
    await fetchSupplies(); 
  } catch (error) {
    console.error("Error loading supplies:", error);
    alert("Failed to load data: " + (error.response?.data?.message || error.message));
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadAllSupplies);

function goToCreateSupply() {
  router.push({ name: 'CreateSupply' });
}

function goToEditSupply(supply) {
  router.push({ name: 'EditSupply', params: { id: supply.id } });
}

async function onDelete(id) {
  if (!confirm('Are you sure you want to delete this supply? This action cannot be undone.')) return;
  isLoading.value = true;
  try {
    await deleteSupply(id);
    alert('Supply deleted successfully!');
    await loadAllSupplies();
  } catch (error) {
    console.error("Error deleting supply:", error);
    alert("Failed to delete supply: " + (error.response?.data?.message || error.message));
  } finally {
    isLoading.value = false;
  }
}
</script>

<style>

</style> -->

<!-- sdsd -->

<!-- <template>
  <div class="p-6 space-y-4">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold">Supplies</h1>
      <button
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        @click="openForm()"
      >
        New Supply
      </button>
    </div>

    <div v-if="isLoading" class="text-center text-gray-600 py-8">
      Loading supplies...
      <p class="text-sm">Please wait while we fetch the data.</p>
    </div>

    <SupplyTable
      v-else
      :supplies="supplies"
      @edit="openForm"
      @delete="onDelete"
    />

    <SupplyForm
      v-if="showForm"
      :supply="editingSupply"
      :clients="clients"
      :products="products"
      @save="onSave"
      @cancel="() => (showForm = false)"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  supplies,
  clients,
  products, // products for item selection
  fetchSupplies,
  fetchClients,
  fetchProductsForSupply,
  createSupply,
  updateSupply,
  deleteSupply
} from '../../composables/useSupplies';

import SupplyTable from '../../components/Supplies/SupplyTable.vue';
import SupplyForm from '../../components/Supplies/SupplyForm.vue';

const showForm = ref(false);
const editingSupply = ref({});
const isLoading = ref(true);

async function loadAll() {
  isLoading.value = true;
  try {
    await fetchSupplies(); // Updates the shared 'supplies' ref
    await fetchClients();   // Updates the shared 'clients' ref
    await fetchProductsForSupply(); // Updates the shared 'products' ref for item selection
  } catch (error) {
    console.error("Error loading supplies or related data:", error);
    alert("Failed to load data: " + (error.response?.data?.message || error.message));
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadAll);

function openForm(supply = null) {
  // When opening form, ensure 'items' array is initialized for new items
  editingSupply.value = supply ? { ...supply } : { items: [], status: 'pending', tariff_fee: 0, import_cost: 0 };
  showForm.value = true;
}

async function onSave(supplyData) {
  isLoading.value = true; // Show loading while saving/updating
  try {
    if (supplyData.id) {
      // For update, only status is sent
      await updateSupply(supplyData.id, { status: supplyData.status });
      alert('Supply status updated successfully!');
    } else {
      await createSupply(supplyData);
      alert('Supply created successfully!');
    }
    showForm.value = false;
    await loadAll(); // Reload data after save
  } catch (error) {
    console.error("Error saving supply:", error);
    alert("Failed to save supply: " + (error.response?.data?.message || error.message));
  } finally {
    isLoading.value = false;
  }
}

async function onDelete(id) {
  if (!confirm('Are you sure you want to delete this supply? This action cannot be undone.')) return;
  isLoading.value = true; // Show loading while deleting
  try {
    await deleteSupply(id);
    alert('Supply deleted successfully!');
    await loadAll(); // Reload data after delete
  } catch (error) {
    console.error("Error deleting supply:", error);
    alert("Failed to delete supply: " + (error.response?.data?.message || error.message));
  } finally {
    isLoading.value = false;
  }
}
</script>

<style>
/* Scoped styles are optional here, Tailwind is mostly utility-first */
</style> -->