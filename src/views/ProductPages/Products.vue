<template>
  <div class="p-6 space-y-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Products Management</h1>
    </div>

    <CategoryManagerModal
      v-if="showCategoryModal"
      :categories="categories"
      @close="closeCategoryModal"
      @category-added="handleCategoryAdded"
      @category-deleted="handleCategoryDeleted"
    />

    <div class="flex items-center gap-4 mb-4 flex-wrap justify-between"> <div class="flex items-center gap-4 flex-wrap">
        <input
          type="text"
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="Search by name or description..."
          class="border border-gray-300 px-3 py-2 rounded-md text-sm w-full sm:w-64 focus:ring-blue-500 focus:border-blue-500"
        />

        <select v-model="selectedCategory" class="border border-gray-300 px-3 py-2 rounded-md text-sm w-full sm:w-48 focus:ring-blue-500 focus:border-blue-500">
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>

        <select v-model="sortBy" class="border border-gray-300 px-3 py-2 rounded-md text-sm w-full sm:w-48 focus:ring-blue-500 focus:border-blue-500">
          <option value="">Sort by</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      <div class="flex space-x-3 mt-4 sm:mt-0"> <button
          v-if="hasAnyRole(['Admin', 'Manager'])"
          class="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out whitespace-nowrap"
          @click="showCategoryManager"
        >
          Manage Categories
        </button>

        <button
          v-if="hasAnyRole(['Admin', 'Manager'])"
          class="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out whitespace-nowrap"
          @click="goToCreateProduct"
        >
          New Product
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="text-center text-gray-600 py-8">
      Loading products...
      <p class="text-sm">Please wait while we fetch product data.</p>
    </div>

    <ProductTable
      v-else
      :products="products"
      @edit="goToEditProduct"
      @delete="requestDelete"
    />

    <ProductForm
      v-if="showForm"
      :product="editingProduct"
      @save="onSave"
      @cancel="closeForm"
    />

    <div
      v-if="showDeleteModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
        <h2 class="text-lg font-semibold mb-4">Delete Product</h2>
        <p>
          Are you sure you want to delete
          <span class="font-bold">{{ productToDelete?.name }}</span>? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-2 mt-6">
          <button @click="cancelDelete" class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition duration-150 ease-in-out">Cancel</button>
          <button @click="confirmDelete" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-150 ease-in-out">
            Delete
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="notification.show"
      :class="[
        'fixed bottom-6 right-6 px-6 py-3 rounded shadow-lg z-50',
        notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
      ]"
    >
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useProducts} from '@/composables/useProducts';


import ProductTable from '@/components/Products/ProductTable.vue';
import ProductForm from '@/components/Products/ProductForm.vue';
import CategoryManagerModal from '@/components/Products/CategoryManagerModal.vue';

const router = useRouter();
const { hasAnyRole } = useAuth();
const {
  products,
  categories,
  fetchProducts,
  fetchCategories,
  deleteProduct,
  updateProduct,
  createProduct,
  createCategory,
  deleteCategory
} = useProducts();

const isLoading = ref(true);
const showForm = ref(false);
const editingProduct = ref({});

const showDeleteModal = ref(false);
const productToDelete = ref(null);

const selectedCategory = ref('');
const sortBy = ref('');
const searchQuery = ref(''); // New reactive variable for search

let searchTimeout = null; // For debouncing search input

const notification = ref({
  show: false,
  message: '',
  type: 'success'
});

const showCategoryModal = ref(false);

function showCategoryManager(){
  showCategoryModal.value = true;
}

async function closeCategoryModal(){
  showCategoryModal.value = false;
  await fetchCategories();
  await loadAllProducts();
}

async function handleCategoryAdded() {
  showNotification('Category added successfully!','success');
  await fetchCategories();
}

async function handleCategoryDeleted(){
  showNotification('Category deleted successfully!','success');
  await fetchCategories();
  await loadAllProducts();
}

function requestDelete(product) {
  productToDelete.value = product;
  showDeleteModal.value = true;
}

async function confirmDelete() {
  if (!productToDelete.value) return;
  isLoading.value = true;
  try {
    await deleteProduct(productToDelete.value.id);
    showNotification('Product deleted successfully!', 'success');
    await loadAllProducts();
  } catch (error) {
    showNotification("Failed to delete product: " + (error.response?.data?.message || error.message), 'error');
  } finally {
    isLoading.value = false;
    showDeleteModal.value = false;
    productToDelete.value = null;
  }
}

function cancelDelete() {
  showDeleteModal.value = false;
  productToDelete.value = null;
}

function showNotification(message, type = 'success') {
  notification.value = { show: true, message, type };
  setTimeout(() => {
    notification.value.show = false;
  }, 3000);
}

async function loadAllProducts() {
  isLoading.value = true;
  try {
    await fetchProducts({
      category_id: selectedCategory.value || undefined,
      sort_by: sortBy.value || undefined,
      search: searchQuery.value || undefined, // Pass search query to fetchProducts
    });
  } catch (error) {
    console.error("Error loading products:", error);
    alert("Failed to load products: " + (error.response?.data?.message || error.message));
  } finally {
    isLoading.value = false;
  }
}

const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    loadAllProducts();
  }, 300); // Debounce search input by 300ms
};

onMounted(async () => {
  await fetchCategories();
  await loadAllProducts();
});

watch([selectedCategory, sortBy], loadAllProducts); // Watch filters for changes

function goToCreateProduct() {
  editingProduct.value = {};
  showForm.value = true;
}

function goToEditProduct(product) {
  editingProduct.value = { ...product };
  showForm.value = true;
}

function closeForm() {
  showForm.value = false;
  editingProduct.value = {};
}

async function onSave(productData) {
  isLoading.value = true;
  try {
    if (productData.id) {
      await updateProduct(productData.id, productData);
      showNotification('Product updated successfully!', 'success');
    } else {
      await createProduct(productData);
      showNotification('Product created successfully!', 'success');
    }
    await loadAllProducts();
    closeForm();
  } catch (error) {
    showNotification("Failed to save product: " + (error.response?.data?.message || error.message), 'error');
  } finally {
    isLoading.value = false;
  }
}
</script>

<style>
/* Your styles */
</style>


<!-- <template>
  <div class="p-6 space-y-4">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold">Products</h1>
      <button
        class="px-4 py-2 bg-green-600 text-white rounded"
        @click="openForm()"
      >
        New Product
      </button>
    </div>

    <div v-if="isLoading" class="text-center text-gray-600 py-8">
      Loading products...
    </div>
    
     add search / filter here -->

    <!-- <ProductTable
      :products="products"
      @edit="openForm"
      @delete="onDelete"
    /> -->

    <!-- <ProductForm
      v-if="showForm"
      :product="editing"
      :categories="categories"
      @save="onSave"
      @cancel="() => (showForm = false)"
    />
  </div>
</template> -->

<!-- <script setup>
import { ref, onMounted } from 'vue';
import { fetchProducts, fetchCategories, createProduct, updateProduct, deleteProduct } from '../../composables/useProducts';

import ProductTable from '../../components/Products/ProductTable.vue';
import ProductForm from '../../components/Products/ProductForm.vue';
import { useAuth } from '@/composables/useAuth';

const products = ref([]);
const categories = ref([]);
const showForm = ref(false);
const editing = ref({});
const isLoading = ref(true);

async function loadAll() {
    try {
        products.value = await fetchProducts();
        categories.value = await fetchCategories();
    } catch (error) {
        console.log("Error loading products or categories", error);
    } finally {
        isLoading.value = false;
    }
}

// onMounted(loadAll);
onMounted(async () => {
    isLoading.value = true;
    await loadAll();
})

function openForm(item = null){
    editing.value = item ? { ...item } : {}
    showForm.value = true;
}

async function onSave({ id, ...data}) {
    if(id){
        await updateProduct(id,data);
    } else {
        await createProduct(data);
    }
    showForm.value = false;
    await loadAll();
}

async function onDelete(id) {
    if (!confirm('Really delete this product?')) return;
    await deleteProduct(id);
    await loadAll();
}
</script>

<style>

</style> --> 