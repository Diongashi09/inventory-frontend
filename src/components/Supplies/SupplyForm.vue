<template>
  <div class="container mx-auto p-4 bg-white shadow-md rounded-lg">
    <h2 class="text-2xl font-semibold mb-4">{{ isEditing ? 'Edit Supply' : 'Create New Supply' }}</h2>

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Fields available for editing / display -->
      <div v-if="isEditing">
        <label for="referenceNumber" class="block text-sm font-medium text-gray-700">Reference Number</label>
        <input
          type="text"
          id="referenceNumber"
          v-model="localSupply.reference_number"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          disabled
        />
      </div>

      <div v-if="isEditing">
        <label for="date" class="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          id="date"
          v-model="localSupply.date"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          disabled
        />
      </div>

      <!-- Supplier Selection (for both create & display in edit) -->
      <div>
        <label for="supplierType" class="block text-sm font-medium text-gray-700">Supplier Type</label>
        <select
          id="supplierType"
          v-model="localSupply.supplier_type"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
          :disabled="isEditing"
        >
          <option value="">Select Supplier Type</option>
          <option value="person">Person</option>
          <option value="company">Company</option>
        </select>
      </div>

      <div>
        <label for="supplierId" class="block text-sm font-medium text-gray-700">Supplier</label>
        <select
          id="supplierId"
          v-model="localSupply.supplier_id"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          :disabled="isEditing" 
        >
          <option :value="null">Select a Supplier (Optional)</option>
          <option v-for="client in clients" :key="client.id" :value="client.id">{{ client.name }}</option>
        </select>
      </div>

      <!-- Tariff Fee & Import Cost (for both create & display in edit) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="tariffFee" class="block text-sm font-medium text-gray-700">Tariff Fee</label>
          <input
            type="number"
            id="tariffFee"
            v-model.number="localSupply.tariff_fee"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            step="0.01"
            min="0"
            :disabled="isEditing" 
          />
        </div>
        <div>
          <label for="importCost" class="block text-sm font-medium text-gray-700">Import Cost</label>
          <input
            type="number"
            id="importCost"
            v-model.number="localSupply.import_cost"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            step="0.01"
            min="0"
            :disabled="isEditing" 
          />
        </div>
      </div>

      <!-- Supply Items (for both create & display in edit, but only modify in create) -->
      <div class="mt-8">
        <h3 class="text-xl font-medium mb-4">Supply Items</h3>
        <div v-for="(item, index) in localSupply.items" :key="index" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end border-b pb-4">
          <div>
            <label :for="`product-${index}`" class="block text-sm font-medium text-gray-700">Product</label>
            <select
              :id="`product-${index}`"
              v-model="item.product_id"
              @change="updateItemPrice(index)"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              :disabled="isEditing" 
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
              :disabled="isEditing" 
            />
          </div>
          <div>
            <label :for="`unitPrice-${index}`" class="block text-sm font-medium text-gray-700">Unit Price</label>
            <input
              type="number"
              :id="`unitPrice-${index}`"
              v-model.number="item.unit_price"
              @input="calculateTotals"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              step="0.01"
              min="0"
              required
              :disabled="isEditing"
            />
          </div>
          <div class="flex items-center justify-end">
            <button
              type="button"
              @click="removeItem(index)"
              class="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              v-if="!isEditing" 
            >
              Remove
            </button>
          </div>
        </div>
        <button
          type="button"
          @click="addItem"
          class="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          v-if="!isEditing" 
        >
          Add Item
        </button>
      </div>

      <!-- Status (only editable in edit mode, and is the only thing updateable) -->
      <div>
        <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
        <select
          id="status"
          v-model="localSupply.status"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        >
          <option value="pending">Pending</option>
          <option value="in_review">In Review</option>
          <option value="received">Received</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <!-- Totals Section - Purely frontend for display -->
      <div class="mt-8 border-t pt-6">
        <div class="flex justify-between items-center text-lg font-medium mb-2">
          <span>Subtotal:</span>
          <span>${{ localSupply.subtotal.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between items-center text-lg font-bold">
          <span>Total:</span>
          <span>${{ localSupply.total.toFixed(2) }}</span>
        </div>
      </div>

      <div class="flex justify-end space-x-4">
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
          {{ isEditing ? 'Update Supply' : 'Create Supply' }}
        </button>
      </div>

      <div v-if="errorMessage" class="text-red-600 mt-4">{{ errorMessage }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useSupplies } from '@/composables/useSupplies';
import { useClients } from '@/composables/useClients';
import { useProducts } from '@/composables/useProducts';

const router = useRouter();
const route = useRoute();
const { supply: fetchedSupplyFromComposable, getSupplyById, createSupply, updateSupply, errorMessage, clearErrorMessage } = useSupplies();
const { clients, fetchClients } = useClients();
const { products, fetchProducts } = useProducts();

const isEditing = computed(() => route.params.id !== undefined);

// Local state for the form
const localSupply = reactive({
  id: null,
  reference_number: '', // Display only for edit, backend generates for create
  date: '',             // Display only for edit, backend generates for create
  supplier_type: '',
  supplier_id: null,
  tariff_fee: 0,
  import_cost: 0,
  status: 'pending',
  items: [],
  subtotal: 0,
  total: 0,
});

// Function to add a new item to the supply
const addItem = () => {
  localSupply.items.push({ product_id: '', quantity: 1, unit_price: 0.00 });
  calculateTotals();
};

// Function to remove an item from the supply
const removeItem = (index) => {
  localSupply.items.splice(index, 1);
  calculateTotals();
};

// Function to update item price when product is selected
const updateItemPrice = (index) => {
  const selectedProduct = products.value.find(p => p.id === localSupply.items[index].product_id);
  if (selectedProduct) {
    localSupply.items[index].unit_price = Number(selectedProduct.price_incl_vat).toFixed(2);
  } else {
    localSupply.items[index].unit_price = 0.00;
  }
  calculateTotals();
};

// Function to calculate subtotal and total for frontend display
const calculateTotals = () => {
  let sub = 0;
  localSupply.items.forEach(item => {
    sub += (Number(item.quantity) || 0) * (Number(item.unit_price) || 0);
  });
  localSupply.subtotal = sub;
  localSupply.total = sub;
};

// Initialize form data when component mounts or route changes for editing
onMounted(async () => {
  clearErrorMessage();
  await fetchClients();
  await fetchProducts();

  if (isEditing.value && route.params.id) {
    const fetchedSupply = await getSupplyById(route.params.id);
    if (fetchedSupply) {
      localSupply.id = fetchedSupply.id;
      localSupply.reference_number = fetchedSupply.reference_number;
      // FIX: Ensure date is correctly formatted for input type="date"
      localSupply.date = fetchedSupply.date ? fetchedSupply.date.split('T')[0] : '';
      localSupply.supplier_type = fetchedSupply.supplier_type || '';
      localSupply.supplier_id = fetchedSupply.supplier_id || null;
      localSupply.tariff_fee = Number(fetchedSupply.tariff_fee) || 0;
      localSupply.import_cost = Number(fetchedSupply.import_cost) || 0;
      localSupply.status = fetchedSupply.status || 'pending';

      localSupply.items = fetchedSupply.items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: Number(item.unit_price).toFixed(2),
      }));
    } else {
        errorMessage.value = errorMessage.value || "Supply not found or failed to load.";
    }
  } else {
    Object.assign(localSupply, {
      id: null,
      reference_number: '',
      date: new Date().toISOString().split('T')[0],
      supplier_type: '',
      supplier_id: null,
      tariff_fee: 0,
      import_cost: 0,
      status: 'pending',
      items: [],
      subtotal: 0,
      total: 0,
    });
    addItem();
  }
  calculateTotals();
});


// Function to submit the form
const submitForm = async () => {
  clearErrorMessage();

  if (!localSupply.supplier_type) {
    errorMessage.value = "Please select a supplier type.";
    return;
  }
  if (localSupply.supplier_type && localSupply.supplier_id === null) {
      errorMessage.value = "Please select a supplier for the chosen type.";
      return;
  }

  if (!isEditing.value) {
    if (localSupply.items.length === 0) {
      errorMessage.value = "Please add at least one item to the supply.";
      return;
    }
    if (localSupply.items.some(item => !item.product_id)) {
      errorMessage.value = "Please select a product for all supply items.";
      return;
    }
    if (localSupply.items.some(item => item.quantity <= 0)) {
      errorMessage.value = "Quantity for all items must be at least 1.";
      return;
    }
    if (localSupply.items.some(item => Number(item.unit_price) <= 0)) {
      errorMessage.value = "Unit price for all items must be greater than 0.";
      return;
    }
  }

  try {
    if (isEditing.value) {
      const updatePayload = {
        status: localSupply.status,
      };
      await updateSupply(localSupply.id, updatePayload);
      alert('Supply status updated successfully!');
    } else {
      const createPayload = {
        supplier_type: localSupply.supplier_type,
        supplier_id: localSupply.supplier_id,
        tariff_fee: localSupply.tariff_fee || undefined,
        import_cost: localSupply.import_cost || undefined,
        status: localSupply.status || 'pending',
        items: localSupply.items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: Number(item.unit_price),
        })),
      };
      await createSupply(createPayload);
      alert('Supply created successfully!');
    }
    router.push({ name: 'Supplies' });
  } catch (error) {
    console.error("Operation failed:", error);
    alert("Operation failed: " + (errorMessage.value || error.message || "An unknown error occurred. Check console for details."));
  }
};

const cancel = () => {
  router.push({ name: 'Supplies' });
};
</script>


<!-- space -->

<!-- <template>
  <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <h2 class="text-xl mb-4">{{ local.id ? 'Edit Supply Status' : 'New Supply' }}</h2>
      <form @submit.prevent="onSubmit" class="space-y-4">

        <div v-if="local.id">
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <select
                v-model="local.status"
                required
                class="w-full border p-2 rounded mt-1"
            >
                <option value="pending">Pending</option>
                <option value="in_review">In Review</option>
                <option value="received">Received</option>
                <option value="cancelled">Cancelled</option>
            </select>
        </div>

        <template v-else>
            <div>
                <label class="block text-sm font-medium text-gray-700">Supplier Type</label>
                <select
                    v-model="local.supplier_type"
                    required
                    class="w-full border p-2 rounded mt-1"
                >
                    <option :value="null" disabled>— Select Supplier Type —</option>
                    <option value="person">Person</option>
                    <option value="company">Company</option>
                </select>
            </div>

            <div v-if="local.supplier_type">
                <label class="block text-sm font-medium text-gray-700">Select Supplier (Optional)</label>
                <select
                    v-model="local.supplier_id"
                    class="w-full border p-2 rounded mt-1"
                >
                    <option :value="null">— No Specific Supplier —</option>
                    <option
                        v-for="client in filteredClients"
                        :key="client.id"
                        :value="client.id"
                    >
                        {{ client.name }}
                    </option>
                </select>
            </div>

            <div class="flex space-x-4">
                <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700">Tariff Fee (Optional)</label>
                    <input
                        v-model.number="local.tariff_fee"
                        type="number"
                        min="0"
                        step="0.01"
                        class="w-full border p-2 rounded mt-1"
                        placeholder="0.00"
                    />
                </div>
                <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700">Import Cost (Optional)</label>
                    <input
                        v-model.number="local.import_cost"
                        type="number"
                        min="0"
                        step="0.01"
                        class="w-full border p-2 rounded mt-1"
                        placeholder="0.00"
                    />
                </div>
            </div>

            <hr class="my-4">

            <h3 class="text-lg font-semibold mb-2">Supply Items</h3>
            <div class="space-y-3">
            <div
                v-for="(item, index) in local.items"
                :key="index"
                class="flex items-center space-x-2 bg-gray-50 p-3 rounded"
            >
                <div class="flex-1">
                <label class="block text-xs font-medium text-gray-600">Product</label>
                <select
                    v-model="item.product_id"
                    required
                    class="w-full border p-1 rounded text-sm"
                    @change="updateUnitPrice(item)"
                >
                    <option :value="null" disabled>— Select Product —</option>
                    <option
                    v-for="product in products"
                    :key="product.id"
                    :value="product.id"
                    >
                    {{ product.name }}
                    </option>
                </select>
                </div>
                <div class="w-24">
                <label class="block text-xs font-medium text-gray-600">Quantity</label>
                <input
                    v-model.number="item.quantity"
                    type="number"
                    min="1"
                    required
                    class="w-full border p-1 rounded text-sm"
                />
                </div>
                <div class="w-24">
                <label class="block text-xs font-medium text-gray-600">Unit Price</label>
                <input
                    v-model.number="item.unit_price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    class="w-full border p-1 rounded text-sm"
                />
                </div>
                <button
                type="button"
                @click="removeItem(index)"
                class="text-red-500 hover:text-red-700 text-sm mt-4"
                title="Remove Item"
                >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clip-rule="evenodd" />
                </svg>
                </button>
            </div>
            </div>
            <button
            type="button"
            @click="addItem"
            class="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
            >
            Add Supply Item
            </button>

            <hr class="my-4">
        </template>

        <div class="flex justify-end space-x-2">
          <button
            type="button"
            class="px-4 py-2 border rounded"
            @click="$emit('cancel')"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Supply
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, computed } from 'vue';

const props = defineProps({
  supply: { type: Object, default: () => ({}) },
  clients: { type: Array, default: () => [] },
  products: { type: Array, default: () => [] } 
});

const emit = defineEmits(['save', 'cancel']);

const local = reactive({
  id: null,
  supplier_type: null,
  supplier_id: null,
  tariff_fee: 0,
  import_cost: 0,
  status: 'pending', 
  items: [], 
});

watch(
  () => props.supply,
  (spply) => {
    Object.assign(local, {
      id: spply.id || null,
      supplier_type: spply.supplier_type || null,
      supplier_id: spply.supplier_id || null,
      tariff_fee: spply.tariff_fee || 0,
      import_cost: spply.import_cost || 0,
      status: spply.status || 'pending',
      items: spply.items?.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price
      })) || [],
    });
  },
  { immediate: true, deep: true }
);

const filteredClients = computed(() => {
  if (!local.supplier_type) return props.clients; 
  return props.clients.filter(client => client.client_type === local.supplier_type);
});


function addItem() {
  local.items.push({ product_id: null, quantity: 1, unit_price: 0 });
}

function removeItem(index) {
  local.items.splice(index, 1);
}

function updateUnitPrice(item) {
  const selectedProduct = props.products.find(p => p.id === item.product_id);
  if (selectedProduct) {
    item.unit_price = selectedProduct.price_incl_vat; 
  }
}

function onSubmit() {
  if (local.id) {
    emit('save', { id: local.id, status: local.status });
    return;
  }

  if (local.supplier_type === null) {
      alert('Please select a supplier type.');
      return;
  }
  if (local.items.length === 0) {
    alert('A supply must have at least one product item.');
    return;
  }
  for (const item of local.items) {
    if (item.product_id === null || item.quantity <= 0 || item.unit_price <= 0) {
      alert('All supply items must have a selected product, a quantity greater than 0, and a unit price greater than 0.');
      return;
    }
  }


  const payload = {
    supplier_type: local.supplier_type,
    supplier_id: local.supplier_id,
    tariff_fee: local.tariff_fee,
    import_cost: local.import_cost,
    status: local.status,
    items: local.items, 
  };

  emit('save', payload);
}
</script>

<style scoped>
</style> -->