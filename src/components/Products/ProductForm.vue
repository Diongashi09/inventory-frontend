<!-- src/components/Products/ProductForm.vue -->
<template>
  <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <h2 class="text-xl font-semibold mb-4">{{ local.id ? 'Edit Product' : 'Create New Product' }}</h2>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Name</label>
          <input
            v-model="local.name"
            type="text"
            required
            class="w-full border p-2 rounded mt-1"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Description (Optional)</label>
          <textarea
            v-model="local.description"
            rows="3"
            class="w-full border p-2 rounded mt-1"
          ></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Category</label>
          <select
            v-model="local.category_id"
            class="w-full border p-2 rounded mt-1"
          >
            <option :value="null">— Select Category —</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Initial Stock Quantity</label>
          <input
            v-model.number="local.stock_quantity"
            type="number"
            min="0"
            required
            class="w-full border p-2 rounded mt-1"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Price (Excl. VAT)</label>
          <input
            v-model.number="local.price_excl_vat"
            type="number"
            step="0.01"
            min="0"
            required
            class="w-full border p-2 rounded mt-1"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">VAT Rate (%)</label>
          <input
            v-model.number="local.vat_rate"
            type="number"
            step="0.01"
            min="0"
            max="100"
            required
            class="w-full border p-2 rounded mt-1"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Unit</label>
          <select
            v-model="local.unit"
            required
            class="w-full border p-2 rounded mt-1"
          >
            <option value="pcs">Pieces (pcs)</option>
            <option value="kg">Kilograms (kg)</option>
            <option value="ltr">Liters (ltr)</option>
          </select>
        </div>

        <div class="flex justify-end space-x-2">
          <button
            type="button"
            class="px-4 py-2 border rounded hover:bg-gray-100"
            @click="$emit('cancel')"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Product
          </button>
        </div>
      </form>
    </div>
  </div>
</template>


<script setup>
import { reactive, watch, onMounted } from 'vue';
import { useProducts } from '@/composables/useProducts';
// import { fetchCategories } from '@/composables/useProducts'; // Absolute path
const { fetchCategories, categories } = useProducts();

const props = defineProps({
  product: { type: Object, default: () => ({}) }, // Prop for existing product data
});

const emit = defineEmits(['save', 'cancel']);

const local = reactive({
  id: null,
  name: '',
  description: '',
  category_id: null,
  stock_quantity: 0,
  price_excl_vat: 0,
  vat_rate: 0,
  unit: 'pcs',
});

onMounted(async () => {
  console.log('ProductForm mounted, fetching categories...');
  try {
    await fetchCategories();
    console.log('Categories after fetch', categories.value);
    // const fetchedCategories = await fetchCategories();
    // categories.splice(0, categories.length, ...fetchedCategories); // Populate reactive array
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
});

// Watch for changes in the 'product' prop to populate the form for editing
watch(
  () => props.product,
  (prod) => {
    Object.assign(local, {
      id: prod.id || null,
      name: prod.name || '',
      description: prod.description || '',
      category_id: prod.category_id || null,
      stock_quantity: prod.stock_quantity || 0,
      price_excl_vat: prod.price_excl_vat || 0,
      vat_rate: prod.vat_rate || 0,
      unit: prod.unit || 'pcs',
    });
  },
  { immediate: true } // Run immediately on component mount/prop change
);

function onSubmit() {
  emit('save', { id: local.id, ...local }); // Emit the local data for saving/updating
}
</script>

<style scoped>
/* Specific styling for the form if needed */
</style>



<!-- <template>
  <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <h2 class="text-xl mb-4">{{ product.id ? 'Edit' : 'New' }} Product</h2>
      <form @submit.prevent="onSubmit" class="space-y-3">
        <div>
          <label class="block text-sm">Name</label>
          <input
            v-model="local.name"
            type="text"
            required
            class="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label class="block text-sm">Category</label>
          <select v-model="local.category_id" class="w-full border p-2 rounded">
            <option :value="null">— none —</option>
            <option
              v-for="c in categories"
              :key="c.id"
              :value="c.id"
            >{{ c.name }}</option>
          </select>
        </div>
        <div class="flex space-x-2">
          <div class="flex-1">
            <label class="block text-sm">Price</label>
            <input
              v-model.number="local.price_excl_vat"
              type="number"
              required
              class="w-full border p-2 rounded"
            />
          </div>
          <div class="w-24">
            <label class="block text-sm">VAT %</label>
            <input
              v-model.number="local.vat_rate"
              type="number"
              required
              class="w-full border p-2 rounded"
            />
          </div>
        </div>
        <div class="flex space-x-2">
          <div class="flex-1">
            <label class="block text-sm">Stock Qty</label>
            <input
              v-model.number="local.stock_quantity"
              type="number"
              min="0"
              class="w-full border p-2 rounded"
            />
          </div>
          <div class="w-24">
            <label class="block text-sm">Unit</label>
            <select v-model="local.unit" class="w-full border p-2 rounded">
              <option value="pcs">pcs</option>
              <option value="kg">kg</option>
              <option value="ltr">ltr</option>
            </select>
          </div>
        </div>
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
            class="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, toRefs, watch } from 'vue'

const props = defineProps({
    product: {type: Object, default: () => ({})},
    categories: {type: Array, default: () => []}
})
const emit = defineEmits(['save','cancel'])

// local copy so we can edit freely
const local = reactive({
  id: null,
  name: '',
  category_id: null,
  price_excl_vat: 0,
  vat_rate: 0,
  stock_quantity: 0,
  unit: 'pcs'
})

// sync incoming product
watch(
  () => props.product,
  (p) => {
    Object.assign(local, {
      id: p.id || null,
      name: p.name || '',
      category_id: p.category_id ?? null,
      price_excl_vat: p.price_excl_vat ?? 0,
      vat_rate: p.vat_rate ?? 0,
      stock_quantity: p.stock_quantity ?? 0,
      unit: p.unit || 'pcs'
    })
  },
  { immediate: true }
)

function onSubmit(){
    // emit a clean object
//   const { id, ...data } = toRefs(local)
 
//   emit('save', { id: local.id, ...data })
 emit('save', { ...local })
}

</script>

<style>

</style> -->