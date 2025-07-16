// src/composables/useVendors.js
import { ref } from "vue";
import { useAxios } from "@/composables/useAxios";

const vendors = ref([]);
const isLoadingVendors = ref(false);
const errorVendors = ref(null);

export function useVendors(){
    const { api }  = useAxios();

    const clearErrorVendors = () => {
        errorVendors.value = null;
    }

    // --- CRITICAL FOR SEARCH ---
    const fetchVendors = async (params = {}) => { // Accepts a params object
        isLoadingVendors.value = true;
        clearErrorVendors();
        try {
            const response = await api.get('/vendor-companies', { params }); // Pass params to axios
            vendors.value = response.data.data || [];
        } catch (error) {
            console.error("Error fetching vendors:", error);
            errorVendors.value = error.response?.data?.message || 'Failed to load vendors.';
        } finally {
            isLoadingVendors.value = false;
        }
    }

    const deleteVendor = async (id) => {
        isLoadingVendors.value = true;
        clearErrorVendors();
        try {
            await api.delete(`/vendor-companies/${id}`);
            vendors.value = vendors.value.filter(vendor => vendor.id !== id);
        } catch (error) {
            console.error(`Error deleting vendor with ID ${id}:`, error);
            errorVendors.value = error.response?.data?.message || `Failed to delete vendor with ID ${id}.`;
            throw error;
        } finally {
            isLoadingVendors.value = false;
        }
    }

    const createVendor = async (vendorData) => {
        isLoadingVendors.value = true;
        clearErrorVendors();
        try {
            const response = await api.post('/vendor-companies', vendorData);
            // Optionally, you might want to add this to the local `vendors` ref
            // or re-fetch `vendors.value.push(response.data.data);`
            return response.data.data;
        } catch (error) {
            console.error("Error creating vendor:", error);
            errorVendors.value = error.response?.data?.message || 'Failed to create vendor.';
            throw error;
        } finally {
            isLoadingVendors.value = false;
        }
    };

    const updateVendor = async (id, vendorData) => {
        isLoadingVendors.value = true;
        clearErrorVendors();
        try {
            const response = await api.put(`/vendor-companies/${id}`, vendorData);
            // Update the vendor in the local state
            const index = vendors.value.findIndex(v => v.id === id);
            if (index !== -1) {
                vendors.value[index] = response.data.data;
            }
            return response.data.data;
        } catch (error) {
            console.error(`Error updating vendor with ID ${id}:`, error);
            errorVendors.value = error.response?.data?.message || `Failed to update vendor with ID ${id}.`;
            throw error;
        } finally {
            isLoadingVendors.value = false;
        }
    };

    return {
        vendors,
        isLoadingVendors,
        errorVendors,
        fetchVendors,
        deleteVendor,
        createVendor,
        updateVendor,
        clearErrorVendors,
    }
}