<!-- src/views/ProductPages/Products.vue -->
<template>
  <div class="p-6 space-y-4">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold">Products Management</h1>
      <button
        v-if="hasAnyRole(['Admin', 'Manager'])"
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        @click="goToCreateProduct"
      >
        New Product
      </button>
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

    <!-- Delete Confirmation Modal -->
<div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
  <div class="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
    <h2 class="text-lg font-semibold mb-4">Delete Product</h2>
    <p>Are you sure you want to delete <span class="font-bold">{{ productToDelete?.name }}</span>? This action cannot be undone.</p>
    <div class="flex justify-end space-x-2 mt-6">
      <button @click="cancelDelete" class="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
      <button @click="confirmDelete" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
    </div>
  </div>
</div>

<!-- Notification -->
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// import {
//   products,
//   fetchProducts,
//   deleteProduct
// } from '@/composables/useProducts'; // Absolute path
import { useAuth } from '@/composables/useAuth';
import { useProducts} from '@/composables/useProducts';


import ProductTable from '@/components/Products/ProductTable.vue'; // Corrected path
import ProductForm from '@/components/Products/ProductForm.vue';

const router = useRouter();
const { hasAnyRole } = useAuth();
const { products, fetchProducts, deleteProduct, updateProduct, createProduct } = useProducts();

const isLoading = ref(true);
const showForm = ref(false);
const editingProduct = ref({});

const showDeleteModal = ref(false);
const productToDelete = ref(null);

const notification = ref({
  show: false,
  message: '',
  type: 'success'
});

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
    await fetchProducts();
  } catch (error) {
    console.error("Error loading products:", error);
    alert("Failed to load products: " + (error.response?.data?.message || error.message));
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadAllProducts);

function goToCreateProduct() {
  editingProduct.value = {};
  showForm.value = true;
  // router.push({ name: 'CreateProduct' });
}

function goToEditProduct(product) {
  editingProduct.value = { ...product };
  showForm.value = true;
  // router.push({ name: 'EditProduct', params: { id: product.id } });
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
    } else {
      await createProduct(productData);
    }
    await loadAllProducts();
    closeForm();
  } catch (error) {
    alert("Failed to save product: " + (error.response?.data?.message || error.message));
  } finally {
    isLoading.value = false;
  }
}

// async function onDelete(id) {
//   if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
//   isLoading.value = true;
//   try {
//     await deleteProduct(id);
//     alert('Product deleted successfully!');
//     await loadAllProducts();
//   } catch (error) {
//     console.error("Error deleting product:", error);
//     alert("Failed to delete product: " + (error.response?.data?.message || error.message));
//   } finally {
//     isLoading.value = false;
//   }
// }
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