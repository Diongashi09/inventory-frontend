<!-- src/views/ProductPages/ProductDetails.vue -->
<template>
  <div class="container mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
    <div v-if="isLoading" class="text-center text-gray-600">Loading product details...</div>
    <div v-else-if="error" class="text-center text-red-600 text-lg">
      <p>Error: {{ error }}</p>
      <button @click="router.back()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go Back</button>
    </div>
    <div v-else-if="product">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Product: {{ product.name }}</h1>
        <div class="space-x-2">
            <button
                v-if="hasAnyRole(['Admin', 'Manager'])"
                @click="goToEditProduct(product.id)"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Edit Product
            </button>
            <button @click="router.back()" class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Go Back</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <!-- Product Information -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h2 class="text-xl font-semibold text-gray-700 mb-3">Product Information</h2>
          <p class="mb-2"><span class="font-medium">ID:</span> {{ product.id }}</p>
          <p class="mb-2"><span class="font-medium">Name:</span> {{ product.name }}</p>
          <p class="mb-2"><span class="font-medium">Description:</span> {{ product.description || 'N/A' }}</p>
          <p class="mb-2"><span class="font-medium">Category:</span> {{ product.category?.name || 'Uncategorized' }}</p>
          <p class="mb-2"><span class="font-medium">Unit:</span> {{ product.unit }}</p>
        </div>

        <!-- Stock & Pricing -->
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
          <h2 class="text-xl font-bold text-blue-800 mb-3">Stock & Pricing</h2>
          <p class="mb-2"><span class="font-medium">Current Stock:</span> {{ product.stock_quantity }}</p>
          <p class="mb-2"><span class="font-medium">Price (Excl. VAT):</span> ${{ Number(product.price_excl_vat).toFixed(2) }}</p>
          <p class="mb-2"><span class="font-medium">VAT Rate:</span> {{ Number(product.vat_rate).toFixed(2) }}%</p>
          <p class="mb-2"><span class="font-medium">Price (Incl. VAT):</span> ${{ Number(product.price_incl_vat).toFixed(2) }}</p>
        </div>
      </div>

      <div class="mt-6 text-gray-600 text-sm">
        <p>Created: {{ new Date(product.created_at).toLocaleString() }}</p>
        <p>Last Updated: {{ new Date(product.updated_at).toLocaleString() }}</p>
      </div>
    </div>
    <div v-else class="text-center text-gray-600">
      <p>Product not found.</p>
      <button @click="router.back()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go Back</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// import { fetchProduct } from '@/composables/useProducts'; // Absolute path
import { useProducts } from '@/composables/useProducts';
import { useAuth } from '@/composables/useAuth'; // Absolute path

const route = useRoute();
const router = useRouter();

const { getProductById, isLoading, errorMessage } = useProducts();

const product = ref(null);
const error = ref(null);

const { hasAnyRole } = useAuth(); // For role check on edit button

const props = defineProps({
  id: { type: [String, Number], required: true }
});

async function loadProductDetails() {
  error.value = null;
  product.value = null;

  try {
    const fetchedProduct = await getProductById(props.id);
    if (fetchedProduct) {
      product.value = fetchedProduct;
    } else {
      error.value = "Product not found.";
    }
  } catch (err) {
    console.error("Failed to fetch product details:", err);
    error.value = err.response?.data?.message || "Failed to load product details.";
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadProductDetails);

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadProductDetails();
    }
  }
);

function goToEditProduct(productId) {
  router.push({ name: 'EditProduct', params: { id: productId } });
}
</script>

<style scoped>
/* Specific styling for the details page if needed */
</style>

<!-- space -->

<!-- <template>
  <div class="container mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
    <div v-if="isLoading" class="text-center text-gray-600">Loading product details...</div>
    <div v-else-if="error" class="text-center text-red-600 text-lg">
      <p>Error: {{ error }}</p>
      <button @click="router.back()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go Back</button>
    </div>
    <div v-else-if="product">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-800">{{ product.name }}</h1>
        <button @click="router.back()" class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Go Back</button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h2 class="text-xl font-semibold text-gray-700 mb-3">Product Information</h2>
          <p class="mb-2"><span class="font-medium">Category:</span> {{ product.category?.name || 'N/A' }}</p>
          <p class="mb-2"><span class="font-medium">Description:</span> {{ product.description || 'No description provided.' }}</p>
          <p class="mb-2"><span class="font-medium">Stock Quantity:</span> {{ product.stock_quantity }} {{ product.unit }}</p>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <h2 class="text-xl font-semibold text-gray-700 mb-3">Pricing Details</h2>
          <p class="mb-2"><span class="font-medium">Price (Excl. VAT):</span> ${{ Number(product.price_excl_vat).toFixed(2) }}</p>
          <p class="mb-2"><span class="font-medium">VAT Rate:</span> {{ product.vat_rate }}%</p>
          <p class="mb-2"><span class="font-medium">Price (Incl. VAT):</span> ${{ Number(product.price_incl_vat).toFixed(2) }}</p>
        </div>
      </div>

      <div class="mt-6 text-gray-600 text-sm">
        <p>Created: {{ new Date(product.created_at).toLocaleString() }}</p>
        <p>Last Updated: {{ new Date(product.updated_at).toLocaleString() }}</p>
      </div>
    </div>
    <div v-else class="text-center text-gray-600">
      <p>Product not found.</p>
      <button @click="router.back()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go Back</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchProduct } from '../../composables/useProducts';

const route = useRoute();
const router = useRouter();

const product = ref(null);
const isLoading = ref(true);
const error = ref(null);

const productId = ref(route.params.id);

async function loadProduct() {
    isLoading.value = true;
    error.value = null;
    product.value = null;

    try {
        const fetchedProduct = await fetchProduct(productId.value);
        if(fetchedProduct){
            product.value = fetchedProduct;
        } else {
            error.value = "Product not found"
        }
    } catch (err){
        console.log('Failed to fetch product: ',err);
        error.value = err.message || "Failed to load product details.";
    } finally {
        isLoading.value = false;
    }
}

onMounted(loadProduct);

watch(() => route.params.id, (newId) => {
    productId.value = newId;
    loadProduct();
})

</script>

<style>

</style> -->