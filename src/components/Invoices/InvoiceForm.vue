<template>
  <div class="container mx-auto p-4 bg-white shadow-md rounded-lg">
    <h2 class="text-2xl font-semibold mb-4">{{ isEditing ? 'Edit Invoice' : 'Create New Invoice' }}</h2>

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Invoice Header Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-if="isEditing">
          <label for="referenceNumber" class="block text-sm font-medium text-gray-700">Reference Number</label>
          <input
            type="text"
            id="referenceNumber"
            v-model="localInvoice.reference_number"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label for="clientId" class="block text-sm font-medium text-gray-700">Client</label>
          <select
            id="clientId"
            v-model="localInvoice.customer_id"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="">Select a Client</option>
            <option v-for="client in clients" :key="client.id" :value="client.id">{{ client.name }}</option>
          </select>
        </div>
        <div v-if="isEditing">
          <label for="invoiceDate" class="block text-sm font-medium text-gray-700">Invoice Date</label>
          <input
            type="date"
            id="invoiceDate"
            v-model="localInvoice.date"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <!-- Removed Due Date as it's not in backend -->
      </div>

      <!-- Invoice Items Section - Display for both Create and Edit, but only submit for Create -->
      <div class="mt-8">
        <h3 class="text-xl font-medium mb-4">Invoice Items</h3>
        <div v-for="(item, index) in localInvoice.items" :key="index" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end border-b pb-4">
          <div>
            <label :for="`product-${index}`" class="block text-sm font-medium text-gray-700">Product</label>
            <select
              :id="`product-${index}`"
              v-model="item.product_id"
              @change="updateItemPrice(index)"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="">Select a Product</option>
              <option v-for="product in products" :key="product.id" :value="product.id">{{ product.name }}</option>
            </select>
          </div>
          <div>
            <label :for="`quantity-${index}`" class="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              :id="`quantity-${index}`"
              v-model.number="item.quantity"
              @input="calculateTotals"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              min="1"
              required
            />
          </div>
          <div>
            <label :for="`price-${index}`" class="block text-sm font-medium text-gray-700">Price per Unit</label>
            <input
              type="number"
              :id="`price-${index}`"
              v-model.number="item.unit_price"
              @input="calculateTotals"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              step="0.01"
              required
            />
          </div>
          <div class="flex items-center justify-end">
            <button
              type="button"
              @click="removeItem(index)"
              class="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Remove
            </button>
          </div>
        </div>
        <button
          type="button"
          @click="addItem"
          class="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add Item
        </button>
      </div>

      <!-- Shipping Information (only for new invoices, as not handled by backend update) -->
      <div v-if="!isEditing" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <div>
          <label for="shippingCompany" class="block text-sm font-medium text-gray-700">Shipping Company (Optional)</label>
          <input
            type="text"
            id="shippingCompany"
            v-model="localInvoice.shipping_company"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label for="shippingCost" class="block text-sm font-medium text-gray-700">Shipping Cost (Optional)</label>
          <input
            type="number"
            id="shippingCost"
            v-model.number="localInvoice.shipping_cost"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <!-- Totals Section - Kept for frontend display only -->
      <div class="mt-8 border-t pt-6">
        <div class="flex justify-between items-center text-lg font-medium mb-2">
          <span>Subtotal:</span>
          <span>${{ localInvoice.subtotal.toFixed(2) }}</span>
        </div>
        <!-- Removed Tax Rate as it's not in backend -->
        <div class="flex justify-between items-center text-lg font-bold">
          <span>Total:</span>
          <span>${{ localInvoice.total.toFixed(2) }}</span>
        </div>
      </div>

      <!-- Status (only for editing as backend sets it on create) -->
      <div v-if="isEditing">
        <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
        <select
          id="status"
          v-model="localInvoice.status"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        >
          <!-- Status options as per your migration enum -->
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="on_delivery">On Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <!-- Removed Notes as it's not in backend -->

      <!-- Form Actions -->
      <div class="flex justify-end space-x-4 mt-6">
        <button
          type="button"
          @click="cancel"
          class="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          {{ isEditing ? 'Update Invoice' : 'Create Invoice' }}
        </button>
      </div>

      <div v-if="errorMessage" class="text-red-600 mt-4">{{ errorMessage }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useInvoices } from '@/composables/useInvoices';
import { useClients } from '@/composables/useClients';
import { useProducts } from '@/composables/useProducts';

const router = useRouter();
const route = useRoute();
const {
  invoice: fetchedInvoiceFromComposable,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  errorMessage,
  clearErrorMessage
} = useInvoices();
const { clients, fetchClients } = useClients();
const { products, fetchProducts } = useProducts();

const isEditing = computed(() => route.params.id !== undefined);

// Local state for the form, initialized from the composable's invoice or as a new invoice
const localInvoice = reactive({
  id: null,
  reference_number: '',
  customer_id: '',
  date: new Date().toISOString().split('T')[0], // Backend will generate for create, only used for display/edit
  // Removed dueDate, taxRate, notes as they are not in backend migrations
  items: [],
  subtotal: 0, // Calculated frontend
  total: 0,    // Calculated frontend
  status: 'draft', // Backend will set for create, used for edit
  shipping_company: '', // Only for create
  shipping_cost: 0,     // Only for create
});

// Function to add a new item to the invoice
const addItem = () => {
  // Initialize with product_id, quantity, and unit_price (formatted to 2 decimal places)
  localInvoice.items.push({ product_id: '', quantity: 1, unit_price: 0.00 });
  calculateTotals();
};

// Function to remove an item from the invoice
const removeItem = (index) => {
  localInvoice.items.splice(index, 1);
  calculateTotals();
};

// Function to update item price when product is selected
const updateItemPrice = (index) => {
  const selectedProduct = products.value.find(p => p.id === localInvoice.items[index].product_id);
  if (selectedProduct) {
    // Format to 2 decimal places to prevent "valid value" error
    localInvoice.items[index].unit_price = Number(selectedProduct.price_incl_vat).toFixed(2);
  } else {
    localInvoice.items[index].unit_price = 0.00; // Reset if product unselected
  }
  calculateTotals();
};

// Function to calculate subtotal, tax, and total
const calculateTotals = () => {
  let sub = 0;
  localInvoice.items.forEach(item => {
    // Ensure both quantity and unit_price are treated as numbers
    sub += (Number(item.quantity) || 0) * (Number(item.unit_price) || 0);
  });
  localInvoice.subtotal = sub;
  // Removed taxRate from here as well
  localInvoice.total = sub; // Total is just subtotal if no taxRate
};

// Initialize form data when component mounts or route changes for editing
onMounted(async () => {
  clearErrorMessage();
  await fetchClients();
  await fetchProducts();

  if (isEditing.value && route.params.id) {
    await getInvoiceById(route.params.id);
    if (fetchedInvoiceFromComposable.value) {
      // Map backend data to local form structure for editing
      localInvoice.id = fetchedInvoiceFromComposable.value.id;
      localInvoice.reference_number = fetchedInvoiceFromComposable.value.reference_number;
      localInvoice.customer_id = fetchedInvoiceFromComposable.value.customer_id;
      localInvoice.date = fetchedInvoiceFromComposable.value.date;
      localInvoice.status = fetchedInvoiceFromComposable.value.status;

      // Map invoice_items from backend to local items structure for form display
      localInvoice.items = fetchedInvoiceFromComposable.value.items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: Number(item.unit_price).toFixed(2), // Format unit_price for input
      }));

      // Shipping details are not updatable via the main invoice update endpoint
      // so we don't load them into localInvoice for editing.
      // localInvoice.shipping_company = fetchedInvoiceFromComposable.value.shipping?.shipping_company || '';
      // localInvoice.shipping_cost = Number(fetchedInvoiceFromComposable.value.shipping?.shipping_cost) || 0;

    } else {
        errorMessage.value = errorMessage.value || "Invoice not found or failed to load.";
    }
  } else {
    // Reset local invoice for new creation
    Object.assign(localInvoice, {
      id: null,
      reference_number: '',
      customer_id: '',
      date: new Date().toISOString().split('T')[0], // Default for display, but backend sets actual date
      items: [],
      subtotal: 0,
      total: 0,
      status: 'draft', // Default for display, but backend sets actual status
      shipping_company: '',
      shipping_cost: 0,
    });
    addItem(); // Add one initial item for new invoices
  }
  calculateTotals(); // Initial calculation
});

// Watch for changes in items to recalculate totals
watch(() => localInvoice.items, calculateTotals, { deep: true });


// Function to submit the form
const submitForm = async () => {
  clearErrorMessage();

  // Frontend validations (remain crucial)
  if (!localInvoice.customer_id) {
    errorMessage.value = "Please select a client for the invoice.";
    return;
  }
  if (localInvoice.items.length === 0) {
    errorMessage.value = "Please add at least one item to the invoice.";
    return;
  }
  if (localInvoice.items.some(item => !item.product_id)) {
    errorMessage.value = "Please select a product for all invoice items.";
    return;
  }
  if (localInvoice.items.some(item => item.quantity <= 0)) {
    errorMessage.value = "Quantity for all items must be at least 1.";
    return;
  }
  if (localInvoice.items.some(item => Number(item.unit_price) <= 0)) { // Ensure numeric check
    errorMessage.value = "Unit price for all items must be greater than 0.";
    return;
  }


  try {
    if (isEditing.value) {
      // Payload for updating an invoice (matches InvoiceController@update validation)
      // Reference Number, Date, Customer_ID, Customer_Type are the only ones currently updated by backend
      const updatePayload = {
        reference_number: localInvoice.reference_number,
        date: localInvoice.date,
        customer_id: localInvoice.customer_id,
        // Derive customer_type from the selected client as backend update method validates it
        customer_type: clients.value.find(c => c.id === localInvoice.customer_id)?.client_type || 'company',
      };
      // status is NOT included here as your update method does not validate it directly.
      // Items are NOT included here as your update method does NOT process them.
      // Shipping is NOT included here as your update method does NOT process them.

      await updateInvoice(localInvoice.id, updatePayload);
      alert('Invoice updated successfully!');

    } else {
      // Payload for creating a new invoice (matches InvoiceController@store validation)
      const createPayload = {
        customer_id: localInvoice.customer_id,
        products: localInvoice.items.map(item => ({
          id: item.product_id, // Backend expects 'id' (product ID)
          quantity: item.quantity,
          // Backend's InvoiceService will use product->price_incl_vat regardless of unit_price sent.
          // However, if your backend *also* validates or expects `unit_price` in the products array
          // during creation (even if it's eventually overridden), it's safer to include it.
          // Your InvoiceController@store validation does NOT include 'products.*.unit_price',
          // but your InvoiceService *does* calculate it from the product.
          // For strict adherence, we *don't* send unit_price here as it's not validated.
          // If you decide to add unit_price validation to store method, uncomment the line below.
          // unit_price: Number(item.unit_price),
        })),
      };

      // Add optional shipping fields if they have values, as backend 'store' allows them
      if (localInvoice.shipping_company) {
        createPayload.shipping_company = localInvoice.shipping_company;
      }
      if (localInvoice.shipping_cost > 0) {
        createPayload.shipping_cost = localInvoice.shipping_cost;
      }

      await createInvoice(createPayload);
      alert('Invoice created successfully!');
    }
    router.push({ name: 'Invoices' }); // Redirect to invoices list after success
  } catch (err) {
    console.error("Failed to save invoice:", err);
    alert("Operation failed: " + (errorMessage.value || err.message || "An unknown error occurred. Please check the console for details."));
  }
};

const cancel = () => {
  router.back();
};
</script>

<style scoped>
/* Add any component-specific styles here if necessary */
</style>
