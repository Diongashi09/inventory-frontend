import { ref } from 'vue';
import { useAxios } from '@/composables/useAxios'; // Path to your useAxios composable

const products = ref([]);
const product = ref(null);
const categories = ref([]);
const isLoading = ref(false);
const errorMessage = ref(null);

export function useProducts() {
  // Initialize useAxios inside the composable function
  const { api } = useAxios();


  const clearErrorMessage = () => {
    errorMessage.value = null;
  };

  // Fetch all products
  const fetchProducts = async (params = {}) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      const response = await api.get('/products', { params: params });
      products.value = response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      errorMessage.value = error.response?.data?.message || 'Failed to load products.';
    } finally {
      isLoading.value = false;
    }
  };

  // Fetch a single product by ID
  const getProductById = async (id) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      const response = await api.get(`/products/${id}`);
      product.value = response.data;
      return product.value;
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      errorMessage.value = error.response?.data?.message || `Failed to load product with ID ${id}.`;
    } finally {
      isLoading.value = false;
    }
  };

//   async function fetchCategories() {
//     try {
//         const response = await api.get('/categories');
//         categories.value = response.data; // Assuming it returns raw array of categories
//         return categories.value;
//     } catch (error) {
//         console.error("Error fetching categories:", error);
//         throw error;
//     }
//  }

 const fetchCategories = async () => {
  isLoading.value = true;
  clearErrorMessage();
  try {
    const response = await api.get('/categories');
    categories.value = response.data;
    return categories.value;
  } catch (error) {
    console.error("Error fetching categories:", error);
    errorMessage.value = error.response?.data?.message || 'Failed to fetch category.';
  } finally {
    isLoading.value = false;
  }
 }

  // Create a new product
  const createProduct = async (productData) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      const response = await api.post('/products', productData);
      // Optionally, add the new product to the list or navigate
      // products.value.push(response.data);
      console.log('Product created:', response.data);
    } catch (error) {
      console.error("Error creating product:", error);
      errorMessage.value = error.response?.data?.message || 'Failed to create product.';
    } finally {
      isLoading.value = false;
    }
  };

  // Update an existing product
  const updateProduct = async (id, productData) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      const response = await api.put(`/products/${id}`, productData);
      // Optionally, update the product in the list if it's there
      // const index = products.value.findIndex(p => p.id === id);
      // if (index !== -1) products.value[index] = response.data;
      console.log('Product updated:', response.data);
    } catch (error) {
      console.error(`Error updating product with ID ${id}:`, error);
      errorMessage.value = error.response?.data?.message || `Failed to update product with ID ${id}.`;
    } finally {
      isLoading.value = false;
    }
  };

  // Delete a product
  const deleteProduct = async (id) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      await api.delete(`/products/${id}`);
      // Filter out the deleted product from the list
      products.value = products.value.filter(p => p.id !== id);
      console.log(`Product with ID ${id} deleted.`);
    } catch (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      errorMessage.value = error.response?.data?.message || `Failed to delete product with ID ${id}.`;
    } finally {
      isLoading.value = false;
    }
  };


  const createCategory = async (categoryData) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      const response = await api.post('/categories',categoryData);
      console.log('Category created: ',response.data);
      return response.data;
    } catch (error){
      console.error("Error creating category:",error);
      errorMessage.value = error.response?.data?.message || 'Failed to create category.' ;
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  const deleteCategory = async (id) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      await api.delete(`/categories/${id}`);
      console.log(`Category with ID ${id} deleted.`);
      categories.value = categories.value.filter(cat => cat.id !== id);
    } catch (error){
      console.error(`Error deleting category with ID ${id}:`,error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    products,
    product,
    categories,
    isLoading,
    errorMessage,
    clearErrorMessage,
    fetchProducts,
    fetchCategories,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createCategory,
    deleteCategory
  };
}


// import { ref } from 'vue';
// import api from './useAxios';

// const products = ref([]);
// const categories = ref([]);

// export async function fetchProducts(){
//   try {
//     const response = await api.get('/products');
//       products.value = response.data.data || response.data;
//       return products.value;
//   } catch (e) {
//     console.error('fetchProducts failed:', e.response?.data || e.message)
//     throw e
//   }
// }

// export async function fetchProduct(id){
//   try {
//     const response = await api.get(`/products/${id}`);
//     return response.data.data || response.data;
//   } catch (error){
//     console.log(`Error fetching product with ID ${id}:`, error);
//     throw error;
//   }
// }



// export async function createProduct(payload){
//   try {
//     const { data } = await api.post('/products', payload)
//     return data
//   } catch (e) {
//     console.error('createProduct failed:', e.response?.data || e.message)
//     throw e
//   }
// }

// export async function updateProduct(id, payload){
//   try {
//     const { data } = await api.put(`/products/${id}`, payload)
//     return data
//   } catch (e) {
//     console.error('updateProduct failed:', e.response?.data || e.message)
//     throw e
//   }
// }

// export async function deleteProduct(id){
//   try {
//     await api.delete(`/products/${id}`)
//   } catch (e) {
//     console.error('deleteProduct failed:', e.response?.data || e.message)
//     throw e
//   }
// }

