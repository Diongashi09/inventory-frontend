<template>
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">Shop Our Products</h1>
  
      <!-- Cart Summary & Link -->
      <div class="bg-indigo-50 p-4 rounded-lg shadow-md mb-6 flex items-center justify-between">
        <p class="text-indigo-800 text-lg font-semibold">
          Your Cart: {{ cartTotalItems }} items (Total: ${{ cartTotalPrice.toFixed(2) }})
        </p>
        <router-link :to="{ name: 'CartView' }" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md shadow-sm transition duration-200">
          View Cart <i class="fas fa-shopping-cart ml-2"></i>
        </router-link>
      </div>
  
      <!-- Category Filter -->
      <!-- Alignment fix: Removed md:w-1/3 from select and added flex-col items-start to parent div -->
      <div class="mb-6 flex flex-col items-start">
        <label for="categoryFilter" class="block text-sm font-medium text-gray-700 mb-2">Filter by Category:</label>
        <select
          id="categoryFilter"
          v-model="selectedCategoryId"
          @change="filterProductsByCategory"
          class="block w-full sm:w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
        >
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
  
      <div v-if="isLoading" class="text-center text-gray-500">Loading products...</div>
      <div v-else-if="errorMessage" class="text-red-600 text-center p-4 bg-red-100 border border-red-200 rounded-md">
        {{ errorMessage }}
      </div>
      <div v-else-if="products.length === 0" class="text-center text-gray-500 p-4 bg-gray-50 rounded-md">
        No products found matching your criteria.
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="product in products" :key="product.id" class="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
          <div class="p-4 flex-grow">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ product.name }}</h3>
            <p v-if="product.category" class="text-sm text-gray-500 mb-2">Category: {{ product.category.name }}</p>
            <p class="text-gray-700 text-sm mb-4 line-clamp-3">{{ product.description || 'No description available.' }}</p>
            <div class="flex items-baseline justify-between mb-4">
              <span class="text-2xl font-bold text-indigo-600">${{ product.price_incl_vat.toFixed(2) }}</span>
              <span class="text-sm text-gray-600">/ {{ product.unit }}</span>
            </div>
            <p v-if="product.stock_quantity <= 0" class="text-red-500 text-sm font-semibold">Out of Stock</p>
            <p v-else-if="product.stock_quantity < 10" class="text-orange-500 text-sm font-semibold">Low Stock ({{ product.stock_quantity }} available)</p>
            <p v-else class="text-green-600 text-sm font-semibold">In Stock ({{ product.stock_quantity }} available)</p>
          </div>
          <div class="p-4 border-t bg-gray-50 flex items-center justify-between">
            <!-- Quantity controls: Plus/Minus buttons -->
            <div class="flex items-center space-x-2">
              <button
                @click="decrementQuantity(product.id)"
                :disabled="productQuantities[product.id] <= 1 || product.stock_quantity <= 0"
                class="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              <span class="w-10 text-center border border-gray-300 rounded-md py-1 text-sm bg-white">
                {{ productQuantities[product.id] }}
              </span>
              <button
                @click="incrementQuantity(product.id, product.stock_quantity)"
                :disabled="productQuantities[product.id] >= product.stock_quantity || product.stock_quantity <= 0"
                class="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
  
            <button
              @click="handleAddToCart(product)"
              :disabled="product.stock_quantity <= 0 || productQuantities[product.id] <= 0"
              class="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md shadow-sm transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useProducts } from '@/composables/useProducts';
  import { useCart } from '@/composables/useCart';
  
  const { products, categories, isLoading, errorMessage, fetchProducts, fetchCategories } = useProducts();
  const { cartTotalItems, cartTotalPrice, addToCart } = useCart();
  
  const selectedCategoryId = ref('');
  const productQuantities = ref({});
  
  onMounted(async () => {
    await fetchProducts();
    await fetchCategories();
  
    // Initialize quantities for all products to 1
    products.value.forEach(product => {
      productQuantities.value[product.id] = 1;
    });
  });
  
  const filterProductsByCategory = () => {
    fetchProducts(selectedCategoryId.value ? { category_id: selectedCategoryId.value } : {});
  };
  
  const incrementQuantity = (productId, maxQuantity) => {
    if (productQuantities.value[productId] < maxQuantity) {
      productQuantities.value[productId]++;
    }
  };
  
  const decrementQuantity = (productId) => {
    if (productQuantities.value[productId] > 1) {
      productQuantities.value[productId]--;
    }
  };
  
  const handleAddToCart = (product) => {
    const quantity = productQuantities.value[product.id];
    if (quantity > 0 && quantity <= product.stock_quantity) {
      addToCart(product, quantity);
      // Optionally reset quantity to 1 after adding to cart
      // productQuantities.value[product.id] = 1;
    } else {
      alert(`Invalid quantity for ${product.name}. Please ensure quantity is between 1 and ${product.stock_quantity}.`);
    }
  };
  </script>
  
  <style scoped>
  /* Add specific styles if needed */
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  </style>
  