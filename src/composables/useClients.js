import { ref } from 'vue';
import { useAxios } from '@/composables/useAxios';

const clients = ref([]);
const client = ref(null);
const clientProfile = ref(null);
const isLoading = ref(false);
const isUpdating = ref(false);
const errorMessage = ref(null);
const updateSuccessMessage = ref(null);
const updateErrorMessage = ref(null);



export function useClients() {
  const { api } = useAxios(); // Initialize useAxios inside the composable function

  const clearErrorMessage = () => {
    errorMessage.value = null;
    updateErrorMessage.value = null;
    updateSuccessMessage.value = null;
  };

  //Admin/Manager Client Management
  const fetchClients = async () => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      const response = await api.get('/clients');
      clients.value = response.data;
      // return client.value;
    } catch (error) {
      console.error("Error fetching clients:", error);
      errorMessage.value = error.response?.data?.message || 'Failed to load clients.';
    } finally {
      isLoading.value = false;
    }
  };

  const getClientById = async (id) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      const response = await api.get(`/clients/${id}`);
      client.value = response.data;
      return client.value;
    } catch (error) {
      console.error(`Error fetching client with ID ${id}:`, error);
      errorMessage.value = error.response?.data?.message || `Failed to load client with ID ${id}.`;
    } finally {
      isLoading.value = false;
    }
  };

  const createClient = async (clientData) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      const response = await api.post('/clients', clientData);
      console.log('Client created:', response.data);
    } catch (error) {
      console.error("Error creating client:", error);
      errorMessage.value = error.response?.data?.message || 'Failed to create client.';
    } finally {
      isLoading.value = false;
    }
  };

  const updateClient = async (id, clientData) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      const response = await api.put(`/clients/${id}`, clientData);
      console.log('Client updated:', response.data);
    } catch (error) {
      console.error(`Error updating client with ID ${id}:`, error);
      errorMessage.value = error.response?.data?.message || `Failed to update client with ID ${id}.`;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteClient = async (id) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      await api.delete(`/clients/${id}`);
      clients.value = clients.value.filter(c => c.id !== id);
      console.log(`Client with ID ${id} deleted.`);
    } catch (error) {
      console.error(`Error deleting client with ID ${id}:`, error);
      errorMessage.value = error.response?.data?.message || `Failed to delete client with ID ${id}.`;
    } finally {
      isLoading.value = false;
    }
  };

//Client Specific Profile Management

const fetchMyProfile = async () => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      // Calls the new backend endpoint for the authenticated client's profile
      const response = await api.get('/client/profile');
      clientProfile.value = response.data;
      console.log('Fetched client profile:', clientProfile.value);
    } catch (error) {
      console.error("Error fetching client profile:", error);
      errorMessage.value = error.response?.data?.message || 'Failed to load your profile.';
    } finally {
      isLoading.value = false;
    }
  };

  const updateMyProfile = async (profileData) => {
    isUpdating.value = true; // Use separate loading state for update
    updateErrorMessage.value = null; // Clear previous update errors
    updateSuccessMessage.value = null; // Clear previous success messages
    try {
      // Calls the new backend endpoint for updating the authenticated client's profile
      const response = await api.patch('/client/profile', profileData);
      clientProfile.value = response.data.client; // Backend returns 'client' nested in response
      updateSuccessMessage.value = response.data.message || 'Profile updated successfully!';
      console.log('Client profile updated:', response.data);
    } catch (error) {
      console.error("Error updating client profile:", error);
      updateErrorMessage.value = error.response?.data?.message || 'Failed to update your profile.';
    } finally {
      isUpdating.value = false;
    }
  };


  return {
    clients,
    client,
    clientProfile,
    isLoading,
    isUpdating,
    errorMessage,
    updateSuccessMessage,
    updateErrorMessage,
    clearErrorMessage,
    fetchClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
    fetchMyProfile,
    updateMyProfile
  };
}




// // src/composables/useClients.js
// import { ref } from 'vue';
// import api from './useAxios';

// const clients = ref([]);

// /**
//  * Fetches all clients from the backend.
//  */
// async function fetchClients() {
//     try {
//         const response = await api.get('/clients');
//         // Assuming /clients endpoint returns an array directly or under a 'data' key
//         clients.value = response.data.data || response.data; // Adjust based on your actual ClientController response (resource or raw)
//         return clients.value;
//     } catch (error) {
//         console.error("Error fetching clients:", error);
//         throw error;
//     }
// }

// /**
//  * Fetches a single client by ID.
//  * @param {number|string} id - The ID of the client.
//  */
// async function fetchClient(id) {
//     try {
//         const response = await api.get(`/clients/${id}`);
//         return response.data.data || response.data; // Adjust based on your actual ClientController response
//     } catch (error) {
//         console.error(`Error fetching client ${id}:`, error);
//         throw error;
//     }
// }

// /**
//  * Creates a new client.
//  * @param {object} clientData - The client data.
//  */
// async function createClient(clientData) {
//     try {
//         const response = await api.post('/clients', clientData);
//         return response.data.data || response.data; // Adjust based on your actual ClientController response
//     } catch (error) {
//         console.error("Error creating client:", error);
//         throw error;
//     }
// }

// /**
//  * Updates an existing client.
//  * @param {number|string} id - The ID of the client to update.
//  * @param {object} clientData - The updated client data.
//  */
// async function updateClient(id, clientData) {
//     try {
//         const response = await api.put(`/clients/${id}`, clientData);
//         return response.data.data || response.data; // Adjust based on your actual ClientController response
//     } catch (error) {
//         console.error(`Error updating client ${id}:`, error);
//         throw error;
//     }
// }

// /**
//  * Deletes a client.
//  * @param {number|string} id - The ID of the client to delete.
//  */
// async function deleteClient(id) {
//     try {
//         await api.delete(`/clients/${id}`);
//     } catch (error) {
//         console.error(`Error deleting client ${id}:`, error);
//         throw error;
//     }
// }

// export {
//     clients,
//     fetchClients,
//     fetchClient,
//     createClient,
//     updateClient,
//     deleteClient
// };