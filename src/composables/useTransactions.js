import { ref } from 'vue';
import { useAxios } from '@/composables/useAxios';

const transactions = ref([]);
const transaction = ref(null);
const isLoading = ref(false);
const errorMessage = ref(null);

export function useTransactions() {
  const { api } = useAxios(); // Initialize useAxios inside the composable function

  const clearErrorMessage = () => {
    errorMessage.value = null;
  };

  const fetchTransactions = async (params = {}) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      const response = await api.get('/transactions', {params});
      transactions.value = response.data.data || [];
    } catch (error) {
      console.error("Error fetching transactions:", error);
      errorMessage.value = error.response?.data?.message || 'Failed to load transactions.';
    } finally {
      isLoading.value = false;
    }
  };

  const getTransactionById = async (id) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      const response = await api.get(`/transactions/${id}`);
      transaction.value = response.data.data;
    } catch (error) {
      console.error(`Error fetching transaction with ID ${id}:`, error);
      errorMessage.value = error.response?.data?.message || `Failed to load transaction with ID ${id}.`;
    } finally {
      isLoading.value = false;
    }
  };

  // No create/update/delete for transactions typically, as they are records of events.
  // If you need these, you'd add them here similar to other composables.

  return {
    transactions,
    transaction,
    isLoading,
    errorMessage,
    clearErrorMessage,
    fetchTransactions,
    getTransactionById,
  };
}



// // src/composables/useTransactions.js
// import { ref } from 'vue';
// import api from './useAxios'; // Ensure this path is correct for your Axios instance

// const transactions = ref([]);

// /**
//  * Fetches all transactions from the backend.
//  */
// async function fetchTransactions() {
//     try {
//         const response = await api.get('/transactions');
//         transactions.value = response.data;
//         return transactions.value;
//     } catch (error) {
//         console.error("Error fetching transactions:", error);
//         throw error;
//     }
// }

// /**
//  * Fetches a single transaction by its ID, including related product and creator.
//  * @param {number|string} id - The ID of the transaction.
//  */
// async function fetchTransaction(id) {
//     try {
//         const response = await api.get(`/transactions/${id}`);
//         return response.data; // This should be the transaction with product and creator loaded
//     } catch (error) {
//         console.error(`Error fetching transaction ${id}:`, error);
//         throw error;
//     }
// }

// export {
//     transactions,
//     fetchTransactions,
//     fetchTransaction
// };