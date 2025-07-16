<!-- src/views/InvoicePages/Invoices.vue -->
<template>
  <div class="p-6 space-y-4">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold">Invoices</h1>
      <button
        v-if="hasAnyRole(['Admin', 'Manager', 'Staff'])"
        class="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out whitespace-nowrap"
        @click="goToCreateInvoice"
      >
        Create New Invoice
      </button>
    </div>

    <div v-if="isLoading" class="text-center text-gray-600 py-8">
      <p>Loading invoices...</p>
      <p class="text-sm">Please wait while we fetch the data.</p>
    </div>

    <InvoiceTable
      v-else
      :invoices="invoices || []"
      @edit="goToEditInvoice"
      @delete="onDelete"
      @start-shipping="onStartShipping"
    />

    <ShippingStatusForm
      v-if="showShippingForm"
      :invoice="shippingInvoice"
      @save="onSaveShipping"
      @cancel="() => (showShippingForm = false)"
    />
  </div>
</template>


<!-- <template>
  <div class="p-6 space-y-4">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold">Invoices</h1>
    </div>

    <div v-if="isLoading" class="text-center text-gray-600 py-8">
      Loading invoices...
      <p class="text-sm">Please wait while we fetch the data.</p>
    </div>

    <InvoiceTable
      v-else
      :invoices="invoices || []"
      @edit="goToEditInvoice"
      @delete="onDelete"
      @start-shipping="onStartShipping"
    />

    <ShippingStatusForm
      v-if="showShippingForm"
      :invoice="shippingInvoice"
      @save="onSaveShipping"
      @cancel="() => (showShippingForm = false)"
    />
  </div>
</template> -->

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useInvoices } from '@/composables/useInvoices';
import { useAuth } from '@/composables/useAuth'; // Absolute path


import InvoiceTable from '@/components/Invoices/InvoiceTable.vue'; // Corrected path
import ShippingStatusForm from '@/components/Shippings/ShippingStatusForm.vue'; // Corrected path

const { invoices, fetchInvoices, deleteInvoice, startShipping } = useInvoices();

const router = useRouter();
const { hasAnyRole } = useAuth();

const showShippingForm = ref(false);
const shippingInvoice = ref({});
const isLoading = ref(true);

async function loadAllInvoices() {
  isLoading.value = true;
  try {
    await fetchInvoices();
  } catch (error) {
    console.error("Error loading invoices:", error);
    alert("Failed to load invoices: " + (error.response?.data?.message || error.message));
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadAllInvoices);

function goToCreateInvoice() {
  router.push({ name: 'CreateInvoice' });
}

function goToEditInvoice(invoice) {
  router.push({ name: 'EditInvoice', params: { id: invoice.id } });
}

function onStartShipping(invoice) {
  shippingInvoice.value = invoice;
  showShippingForm.value = true;
}

async function onSaveShipping(payload) {
  isLoading.value = true;
  try {
    // Assuming startShipping needs invoiceId, tracking_id, shipping_company, shipping_cost
    // The payload emitted from ShippingStatusForm might need adjustment based on your backend startShipping
    await startShipping(payload.invoiceId, payload.tracking_id, payload.shipping_company, payload.shipping_cost);
    alert('Shipping started successfully!');
    showShippingForm.value = false;
    await loadAllInvoices();
  } catch (error) {
    console.error("Error starting shipping:", error);
    alert("Failed to start shipping: " + (error.response?.data?.message || error.message));
  } finally {
    isLoading.value = false;
  }
}

async function onDelete(id) {
  isLoading.value = true;
  try {
    await deleteInvoice(id);
    alert('Invoice deleted successfully!');
    await loadAllInvoices();
  } catch (error) {
    console.error("Error deleting invoice:", error);
    alert("Failed to delete invoice: " + (error.response?.data?.message || error.message));
  } finally {
    isLoading.value = false;
  }
}
</script>

<style>
/* Scoped styles are optional here, Tailwind is mostly utility-first */
</style>


<!-- space -->

<!-- <template>
  <div class="p-6 space-y-4">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold">Invoices</h1>
      <button
        v-if="hasAnyRole(['Admin', 'Manager', 'Staff'])"
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        @click="goToCreateInvoice"
      >
        New Invoice
      </button>
    </div>

    <div v-if="isLoading" class="text-center text-gray-600 py-8">
      Loading invoices...
      <p class="text-sm">Please wait while we fetch the data.</p>
    </div>

    <InvoiceTable
      v-else
      :invoices="invoices"
      @edit="goToEditInvoice"
      @delete="onDelete"
      @start-shipping="onStartShipping"
    />

    <StartShippingForm
      v-if="showShippingForm"
      :invoice="shippingInvoice"
      @save="onSaveShipping"
      @cancel="() => (showShippingForm = false)"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  invoices,
  fetchInvoices,
  deleteInvoice,
  startShipping
} from '@/composables/useInvoices';

import InvoiceTable from '@/components/Invoices/InvoiceTable.vue';

import { useAuth } from '@/composables/useAuth'; 

const router = useRouter(); 
const { hasAnyRole } = useAuth(); 

const showShippingForm = ref(false);
const shippingInvoice = ref({});
const isLoading = ref(true);

async function loadAllInvoices() {
  isLoading.value = true;
  try {
    await fetchInvoices(); 
  } catch (error) {
    console.error("Error loading invoices:", error);
    alert("Failed to load invoices: " + (error.response?.data?.message || error.message));
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadAllInvoices);

function goToCreateInvoice() {
  router.push({ name: 'CreateInvoice' });
}

function goToEditInvoice(invoice) {
  router.push({ name: 'EditInvoice', params: { id: invoice.id } });
}

function onStartShipping(invoice) {
  shippingInvoice.value = invoice;
  showShippingForm.value = true;
}

async function onSaveShipping(payload) {
  isLoading.value = true; 
  try {
    await startShipping(payload.invoiceId, payload.tracking_id, payload.shipping_company, payload.shipping_cost);
    alert('Shipping started successfully!');
    showShippingForm.value = false;
    await loadAllInvoices(); 
  } catch (error) {
    console.error("Error starting shipping:", error);
    alert("Failed to start shipping: " + (error.response?.data?.message || error.message));
  } finally {
    isLoading.value = false;
  }
}

async function onDelete(id) {
  if (!confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) return;
  isLoading.value = true; 
  try {
    await deleteInvoice(id);
    alert('Invoice deleted successfully!');
    await loadAllInvoices(); 
  } catch (error) {
    console.error("Error deleting invoice:", error);
    alert("Failed to delete invoice: " + (error.response?.data?.message || error.message));
  } finally {
    isLoading.value = false;
  }
}
</script>

<style>

</style> -->

<!-- space -->

<!-- <template>
  <div class="p-6 space-y-4">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold">Invoices</h1>
      <button
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        @click="openForm()"
      >
        New Invoice
      </button>
    </div>

    <div v-if="isLoading" class="text-center text-gray-600 py-8">
      Loading invoices...
      <p class="text-sm">Please wait while we fetch the data.</p>
    </div>

    <InvoiceTable
      v-else
      :invoices="invoices"
      @edit="openForm"
      @delete="onDelete"
      @start-shipping="onStartShipping"
    />

    <InvoiceForm
      v-if="showForm"
      :invoice="editingInvoice"
      :clients="clients"
      :products="productsForInvoiceForm"
      @save="onSave"
      @cancel="() => (showForm = false)"
    />

    <div v-if="showShippingModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-sm">
            <h2 class="text-xl mb-4">Start Shipping</h2>
            <p class="mb-4 text-gray-700">Invoice #<span class="font-semibold">{{ invoiceToShip?.reference_number }}</span></p>
            <input
                v-model="trackingId"
                type="text"
                placeholder="Enter Tracking ID (optional)"
                class="w-full border p-2 rounded mb-4"
            />
            <div class="flex justify-end space-x-2">
                <button
                    type="button"
                    class="px-4 py-2 border rounded hover:bg-gray-100"
                    @click="showShippingModal = false"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    @click="confirmStartShipping"
                >
                    Confirm Shipping
                </button>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchInvoices, createInvoice, updateInvoice, deleteInvoice, fetchClients, startShipping, invoices, clients } from '../../composables/useInvoices';
import { fetchProducts } from '../../composables/useProducts'; // Need product data for the invoice items in the form

import InvoiceTable from '../../components/Invoices/InvoiceTable.vue';
import InvoiceForm from '../../components/Invoices/InvoiceForm.vue';

// Removed 'invoices' and 'clients' from being local refs, as they are now imported from useInvoices
// const invoices = ref([]);
// const clients = ref([]);

const productsForInvoiceForm = ref([]); // Products needed for invoice items
const showForm = ref(false);
const editingInvoice = ref({});
const isLoading = ref(true);

// For shipping modal
const showShippingModal = ref(false);
const invoiceToShip = ref(null);
const trackingId = ref('');

async function loadAll() {
  isLoading.value = true;
  try {
    await fetchInvoices(); // Updates the shared 'invoices' ref from useInvoices
    await fetchClients();   // Updates the shared 'clients' ref from useInvoices
    productsForInvoiceForm.value = await fetchProducts(); // Fetch products for invoice items
  } catch (error) {
    console.error("Error loading invoices or related data:", error);
    alert("Failed to load data: " + (error.response?.data?.message || error.message));
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadAll);

function openForm(invoice = null) {
  // When opening form, ensure 'products' array is initialized for new items
  editingInvoice.value = invoice ? { ...invoice } : { products: [] };
  showForm.value = true;
}

async function onSave(invoiceData) {
  isLoading.value = true; // Show loading while saving/updating
  try {
    if (invoiceData.id) {
      await updateInvoice(invoiceData.id, invoiceData);
      alert('Invoice updated successfully!');
    } else {
      await createInvoice(invoiceData);
      alert('Invoice created successfully!');
    }
    showForm.value = false;
    await loadAll(); // Reload data after save
  } catch (error) {
    console.error("Error saving invoice:", error);
    alert("Failed to save invoice: " + (error.response?.data?.message || error.message));
  } finally {
    isLoading.value = false;
  }
}

async function onDelete(id) {
  if (!confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) return;
  isLoading.value = true; // Show loading while deleting
  try {
    await deleteInvoice(id);
    alert('Invoice deleted successfully!');
    await loadAll(); // Reload data after delete
  } catch (error) {
    console.error("Error deleting invoice:", error);
    alert("Failed to delete invoice: " + (error.response?.data?.message || error.message));
  } finally {
    isLoading.value = false;
  }
}

function onStartShipping(invoice) {
    invoiceToShip.value = invoice;
    trackingId.value = invoice.shipping?.tracking_id || ''; // Pre-fill if exists
    showShippingModal.value = true;
}

async function confirmStartShipping() {
    if (!invoiceToShip.value) return;

    isLoading.value = true;
    try {
        await startShipping(invoiceToShip.value.id, trackingId.value);
        alert('Shipping initiated successfully!');
        showShippingModal.value = false;
        await loadAll(); // Refresh data
    } catch (error) {
        console.error("Error initiating shipping:", error);
        alert("Failed to start shipping: " + (error.response?.data?.message || error.message));
    } finally {
        isLoading.value = false;
    }
}
</script>

<style>
/* Scoped styles are optional here, Tailwind is mostly utility-first */
</style> -->