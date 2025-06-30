import { ref } from 'vue';
import { useAxios } from '@/composables/useAxios';

const invoices = ref([]);
const invoice = ref(null);
const isLoading = ref(false);
const errorMessage = ref(null);

export function useInvoices() {
  const { api } = useAxios(); // Initialize useAxios inside the composable function


  const clearErrorMessage = () => {
    errorMessage.value = null;
  };

  const fetchInvoices = async () => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      const response = await api.get('/invoices');
      invoices.value = response.data.data;
    } catch (error) {
      console.error("Error fetching invoices:", error);
      errorMessage.value = error.response?.data?.message || 'Failed to load invoices.';
    } finally {
      isLoading.value = false;
    }
  };

  const getInvoiceById = async (id) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      const response = await api.get(`/invoices/${id}`);
      invoice.value = response.data;
      return invoice.value;
    } catch (error) {
      console.error(`Error fetching invoice with ID ${id}:`, error);
      errorMessage.value = error.response?.data?.message || `Failed to load invoice with ID ${id}.`;
    } finally {
      isLoading.value = false;
    }
  };

  const createInvoice = async (invoiceData) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      const response = await api.post('/invoices', invoiceData);
      console.log('Invoice created:', response.data);
      return response.data.data;
    } catch (error) {
      console.error("Error creating invoice:", error);
      errorMessage.value = error.response?.data?.message || 'Failed to create invoice.';
    } finally {
      isLoading.value = false;
    }
  };

  const updateInvoice = async (id, invoiceData) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      const response = await api.put(`/invoices/${id}`, invoiceData);
      console.log('Invoice updated:', response.data);
    } catch (error) {
      console.error(`Error updating invoice with ID ${id}:`, error);
      errorMessage.value = error.response?.data?.message || `Failed to update invoice with ID ${id}.`;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteInvoice = async (id) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      await api.delete(`/invoices/${id}`);
      invoices.value = invoices.value.filter(i => i.id !== id);
      console.log(`Invoice with ID ${id} deleted.`);
    } catch (error) {
      console.error(`Error deleting invoice with ID ${id}:`, error);
      errorMessage.value = error.response?.data?.message || `Failed to delete invoice with ID ${id}.`;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    invoices,
    invoice,
    isLoading,
    errorMessage,
    clearErrorMessage,
    fetchInvoices,
    getInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice,
  };
}



// import { ref } from "vue";
// import api from './useAxios';

// const invoices = ref([]);
// // const clients = ref([]);

// async function fetchInvoices() {
//     try {
//         const response = await api.get('/invoices');
//         invoices.value = response.data.data; 
//         return invoices.value;
//     } catch (error) {
//         console.error("Error fetching invoices:", error);
//         throw error;
//     }
// }

// async function fetchInvoice(id) {
//     try {
//         const response = await api.get(`/invoices/${id}`);
//         return response.data.data;
//     } catch (error) {
//         console.error(`Error fetching invoice with ID ${id}:`, error);
//         throw error;
//     }
// }

// // async function fetchClients() {
// //     try {
// //         const response = await api.get('/clients'); // Assuming a /clients endpoint
// //         // Assuming /clients returns a direct array of clients, not nested under 'data'
// //         // Adjust this if your ClientController also uses ClientResource::collection
// //         clients.value = response.data;
// //         return clients.value;
// //     } catch (error) {
// //         console.error("Error fetching clients:", error);
// //         throw error;
// //     }
// // }

// async function createInvoice(invoiceData) {
//     try {
//         const response = await api.post('/invoices', invoiceData);
//         // Backend returns: { message: ..., invoice: InvoiceResource }
//         // We'll return the invoice data, which is already formatted by InvoiceResource
//         return response.data.invoice;
//     } catch (error) {
//         console.error("Error creating invoice:", error);
//         throw error;
//     }
// }

// async function updateInvoice(id, invoiceData) {
//     try {
//         const response = await api.put(`/invoices/${id}`, invoiceData);
//         // Backend returns: { message: ..., invoice: InvoiceResource }
//         // We'll return the invoice data, which is already formatted by InvoiceResource
//         return response.data.invoice;
//     } catch (error) {
//         console.error(`Error updating invoice with ID ${id}:`, error);
//         throw error;
//     }
// }

// async function deleteInvoice(id) {
//     try {
//         await api.delete(`/invoices/${id}`);
//     } catch (error) {
//         console.error(`Error deleting invoice with ID ${id}:`, error);
//         throw error;
//     }
// }

// // async function startShipping(invoiceId, trackingId) {
// //     try {
// //         const response = await api.post(`/invoices/${invoiceId}/start-shipping`, {
// //             tracking_id: trackingId 
// //         });
// //         return response.data; // Returns { message: 'Shipping started.' }
// //     } catch (error) {
// //         console.error(`Error starting shipping for invoice ${invoiceId}:`, error);
// //         throw error;
// //     }
// // }

// async function startShipping(invoiceId, trackingId, shippingCompany, shippingCost) {
//     try {
//         // This endpoint expects a single object with all details
//         const response = await api.post(`/invoices/${invoiceId}/start-shipping`, {
//             tracking_id: trackingId,
//             shipping_company: shippingCompany,
//             shipping_cost: shippingCost
//         });
//         return response.data;
//     } catch (error) {
//         console.error(`Error starting shipping for invoice ${invoiceId}:`, error);
//         throw error;
//     }
// }

// export {
//     invoices,
//     // clients,
//     fetchInvoices,
//     fetchInvoice,
//     // fetchClients,
//     createInvoice,
//     updateInvoice,
//     deleteInvoice,
//     startShipping
// };