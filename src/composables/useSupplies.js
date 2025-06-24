import { ref } from 'vue';
import { useAxios } from '@/composables/useAxios';

const supplies = ref([]);
const supply = ref(null);
const isLoading = ref(false);
const errorMessage = ref(null);

export function useSupplies() {
  const { api } = useAxios(); // Initialize useAxios inside the composable function

  const clearErrorMessage = () => {
    errorMessage.value = null;
  };

  const fetchSupplies = async () => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      const response = await api.get('/supplies');
      supplies.value = response.data.data || [];
    } catch (error) {
      console.error("Error fetching supplies:", error);
      errorMessage.value = error.response?.data?.message || 'Failed to load supplies.';
    } finally {
      isLoading.value = false;
    }
  };

  const getSupplyById = async (id) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      const response = await api.get(`/supplies/${id}`);
      supply.value = response.data.data || [];
      return supply.value;
    } catch (error) {
      console.error(`Error fetching supply with ID ${id}:`, error);
      errorMessage.value = error.response?.data?.message || `Failed to load supply with ID ${id}.`;
    } finally {
      isLoading.value = false;
    }
  };

  const createSupply = async (supplyData) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      const response = await api.post('/supplies', supplyData);
      console.log('Supply created:', response.data);
      return response.data.data;//supply objekti krijum temporarily
    } catch (error) {
      console.error("Error creating supply:", error);
      errorMessage.value = error.response?.data?.message || 'Failed to create supply.';
    } finally {
      isLoading.value = false;
    }
  };

  const updateSupply = async (id, supplyData) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      const response = await api.put(`/supplies/${id}`, supplyData);
      console.log('Supply updated:', response.data);
    } catch (error) {
      console.error(`Error updating supply with ID ${id}:`, error);
      errorMessage.value = error.response?.data?.message || `Failed to update supply with ID ${id}.`;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteSupply = async (id) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      await api.delete(`/supplies/${id}`);
      supplies.value = supplies.value.filter(s => s.id !== id);
      console.log(`Supply with ID ${id} deleted.`);
    } catch (error) {
      console.error(`Error deleting supply with ID ${id}:`, error);
      errorMessage.value = error.response?.data?.message || `Failed to delete supply with ID ${id}.`;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    supplies,
    supply,
    isLoading,
    errorMessage,
    clearErrorMessage,
    fetchSupplies,
    getSupplyById,
    createSupply,
    updateSupply,
    deleteSupply,
  };
}



// // src/composables/useSupplies.js
// import { ref } from 'vue';
// import api from './useAxios'; // Same folder

// const supplies = ref([]);

// async function fetchSupplies() {
//     try {
//         const response = await api.get('/supplies');
//         supplies.value = response.data.data || response.data;
//         return supplies.value;
//     } catch (error) {
//         console.error("Error fetching supplies:", error);
//         throw error;
//     }
// }

// async function fetchSupply(id) {
//     try {
//         const response = await api.get(`/supplies/${id}`);
//         return response.data.data || response.data;
//     } catch (error) {
//         console.error(`Error fetching supply ${id}:`, error);
//         throw error;
//     }
// }

// async function createSupply(supplyData) {
//     try {
//         const response = await api.post('/supplies', supplyData);
//         return response.data.data || response.data;
//     } catch (error) {
//         console.error("Error creating supply:", error);
//         throw error;
//     }
// }

// async function updateSupply(id, supplyData) {
//     try {
//         const response = await api.put(`/supplies/${id}`, supplyData);
//         return response.data.data || response.data;
//     } catch (error) {
//         console.error(`Error updating supply ${id}:`, error);
//         throw error;
//     }
// }

// async function deleteSupply(id) {
//     try {
//         await api.delete(`/supplies/${id}`);
//     } catch (error) {
//         console.error(`Error deleting supply ${id}:`, error);
//         throw error;
//     }
// }

// export {
//     supplies,
//     fetchSupplies,
//     fetchSupply,
//     createSupply,
//     updateSupply,
//     deleteSupply
// };


// // // src/composables/useSupplies.js
// // import { ref } from 'vue';
// // import api from './useAxios'; // Ensure this path is correct for your Axios instance

// // const supplies = ref([]);
// // const clients = ref([]); // To store clients for the form
// // const products = ref([]); // To store products for supply items

// // async function fetchSupplies() {
// //     try {
// //         const response = await api.get('/supplies');
// //         // Your SupplieController returns SupplieResource::collection, which nests data under 'data'
// //         supplies.value = response.data.data;
// //         return supplies.value;
// //     } catch (error) {
// //         console.error("Error fetching supplies:", error);
// //         throw error;
// //     }
// // }

// // async function fetchSupply(id) {
// //     try {
// //         const response = await api.get(`/supplies/${id}`);
// //         // Your SupplieController returns new SupplieResource, which also nests under 'data'
// //         return response.data.data;
// //     } catch (error) {
// //         console.error(`Error fetching supply with ID ${id}:`, error);
// //         throw error;
// //     }
// // }

// // async function fetchClients() {
// //     try {
// //         const response = await api.get('/clients'); // Assuming a /clients endpoint
// //         // Adjust this if your ClientController also uses ClientResource::collection
// //         clients.value = response.data;
// //         return clients.value;
// //     } catch (error) {
// //         console.error("Error fetching clients:", error);
// //         throw error;
// //     }
// // }

// // async function fetchProductsForSupply() {
// //     try {
// //         const response = await api.get('/products'); // Assuming a /products endpoint returning ProductSummaryResource
// //         // Adjust this if your ProductController also uses ProductResource::collection
// //         products.value = response.data.data; // Assuming it's wrapped in 'data'
// //         return products.value;
// //     } catch (error) {
// //         console.error("Error fetching products:", error);
// //         throw error;
// //     }
// // }


// // async function createSupply(supplyData) {
// //     try {
// //         // The service automatically generates reference_number and date
// //         // The controller validates for supplier_type, supplier_id, tariff_fee, import_cost, status, and items
// //         const response = await api.post('/supplies', supplyData);
// //         // Backend returns the created SupplieResource directly
// //         return response.data.data; // Assuming it's wrapped in 'data' by the resource
// //     } catch (error) {
// //         console.error("Error creating supply:", error);
// //         throw error;
// //     }
// // }

// // async function updateSupply(id, supplyData) {
// //     try {
// //         // Your controller's update method only allows 'status' to be updated
// //         // It returns the raw model, not a resource.
// //         const response = await api.put(`/supplies/${id}`, supplyData);
// //         return response.data; // Returns the raw Supply model
// //     } catch (error) {
// //         console.error(`Error updating supply with ID ${id}:`, error);
// //         throw error;
// //     }
// // }

// // async function deleteSupply(id) {
// //     try {
// //         await api.delete(`/supplies/${id}`);
// //     } catch (error) {
// //         console.error(`Error deleting supply with ID ${id}:`, error);
// //         throw error;
// //     }
// // }

// // export {
// //     supplies,
// //     clients,
// //     products, // Export products for supply form
// //     fetchSupplies,
// //     fetchSupply,
// //     fetchClients,
// //     fetchProductsForSupply,
// //     createSupply,
// //     updateSupply,
// //     deleteSupply,
// // };