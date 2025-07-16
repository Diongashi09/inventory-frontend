import { ref } from 'vue';
import { useAxios } from '@/composables/useAxios';

const shippings = ref([]);
const shipping = ref(null);
const isLoading = ref(false);
const errorMessage = ref(null);

export function useShippings() {
  const { api } = useAxios();

  const clearErrorMessage = () => {
    errorMessage.value = null;
  };

  const fetchShippings = async (params = {}) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      // FIX: Assuming your ShippingController@index returns data directly (no 'data' key wrapper)
      const response = await api.get('/shippings', {params});
      shippings.value = response.data || []; // Assign response.data directly
    } catch (error) {
      console.error("Error fetching shippings:", error);
      errorMessage.value = error.response?.data?.message || 'Failed to load shippings.';
    } finally {
      isLoading.value = false;
    }
  };

  const getShippingById = async (id) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      // FIX: Assuming your ShippingController@show returns data directly (no 'data' key wrapper)
      const response = await api.get(`/shippings/${id}`);
      shipping.value = response.data; // Assign response.data directly
      return shipping.value;
    } catch (error) {
      console.error(`Error fetching shipping with ID ${id}:`, error);
      errorMessage.value = error.response?.data?.message || `Failed to load shipping with ID ${id}.`;
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const updateShippingStatus = async (trackingId, newStatus) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      const response = await api.patch('/webhook/shipping-status', {
        tracking_id: trackingId,
        status: newStatus
      });
      console.log('Shipping status updated via webhook:', response.data);
      // Re-fetch the specific shipping to update UI if it's the current one
      // We don't use response.data.data here either, assuming webhook returns direct object or simple message
      if (shipping.value && shipping.value.tracking_id === trackingId) {
        // Since getShippingById is now fixed to not expect .data.data, this will work.
        await getShippingById(shipping.value.id);
      }
      return response.data;
    } catch (error) {
      console.error(`Error updating shipping status for tracking ID ${trackingId}:`, error.response?.data || error.message);
      errorMessage.value = error.response?.data?.message || error.message || 'Failed to update shipping status.';
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    shippings,
    shipping,
    isLoading,
    errorMessage,
    clearErrorMessage,
    fetchShippings,
    getShippingById,
    updateShippingStatus,
  };
}




// // src/composables/useShippings.js
// import { ref } from 'vue';
// import api from './useAxios'; // Ensure this path is correct for your Axios instance
// import { fetchInvoices as fetchAllInvoices } from './useInvoices'; // Import from useInvoices

// const shippings = ref([]);

// /**
//  * Fetches all invoices and extracts their shipping data.
//  * This is a workaround as there's no direct /shippings endpoint.
//  */
// async function fetchShippings() {
//     try {
//         const allInvoices = await fetchAllInvoices(); // This fetches ALL invoices
//         // Filter invoices that have shipping data with a tracking ID
//         shippings.value = allInvoices
//             .filter(invoice => invoice.shipping && invoice.shipping.tracking_id)
//             .map(invoice => ({
//                 id: invoice.id, // Using invoice ID as a unique identifier for the shipping record in frontend
//                 invoice_id: invoice.id, // Reference to the parent invoice
//                 reference_number: invoice.reference_number,
//                 date: invoice.date, // Invoice date
//                 client: invoice.client, // Client data
//                 shipping_company: invoice.shipping.company,
//                 shipping_cost: invoice.shipping.cost,
//                 status: invoice.shipping.status, // Shipping status
//                 tracking_id: invoice.shipping.tracking_id,
//                 created_at: invoice.created_at, // Invoice created_at
//                 updated_at: invoice.updated_at, // Invoice updated_at
//                 // Add any other relevant invoice/shipping fields you need for the table
//             }));
//         return shippings.value;
//     } catch (error) {
//         console.error("Error fetching shippings (from invoices):", error);
//         throw error;
//     }
// }

// /**
//  * Updates the status of a shipping record via the dedicated webhook endpoint.
//  * This is the primary function for changing a shipment's status after creation.
//  * Your backend's ShippingWebhookController takes `tracking_id` and `status`.
//  */
// async function updateShippingStatusViaWebhook(trackingId, status) {
//     try {
//         const response = await api.post('/shipping-webhook', {
//             tracking_id: trackingId,
//             status: status
//         });
//         return response.data; // Returns { message: 'Shipping status updated successfully' }
//     } catch (error) {
//         console.error(`Error updating shipping status via webhook for tracking ID ${trackingId}:`, error);
//         throw error;
//     }
// }

// export {
//     shippings,
//     fetchShippings,
//     updateShippingStatusViaWebhook  
// };