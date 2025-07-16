import { ref } from 'vue';
import { useAxios } from '@/composables/useAxios';

const orders = ref([]);
const order  = ref(null);
const isLoading = ref(false);
const errorMessage = ref(null);

export function useOrders() {
  const { api } = useAxios();

  const clearError = () => errorMessage.value = null;

  const fetchOrders = async (params = {}) => {
    isLoading.value = true;
    clearError();
    try {
      const res = await api.get('/orders', { params });
      orders.value = res.data.data || [];
    } catch (e) {
      errorMessage.value = e.response?.data?.message || 'Failed to load orders.';
    } finally {
      isLoading.value = false;
    }
  };

  const getOrderById = async (id) => {
    isLoading.value = true;
    clearError();
    try {
      const res = await api.get(`/orders/${id}`);
      order.value = res.data.data;
      return order.value;
    } catch (e) {
      errorMessage.value = e.response?.data?.message || `Failed to load order ${id}.`;
    } finally {
      isLoading.value = false;
    }
  };

  const createOrder = async (data) => {
    isLoading.value = true;
    clearError();
    try {
      const res = await api.post('/orders', data);
      return res.data.data;
    } catch (e) {
      errorMessage.value = e.response?.data?.message || 'Failed to create order.';
    } finally {
      isLoading.value = false;
    }
  };

  const deleteOrder = async (id) => {
    isLoading.value = true;
    clearError();
    try {
      await api.delete(`/orders/${id}`);
      orders.value = orders.value.filter(o => o.id !== id);
    } catch (e) {
      errorMessage.value = e.response?.data?.message || `Failed to delete order ${id}.`;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    orders,
    order,
    isLoading,
    errorMessage,
    fetchOrders,
    getOrderById,
    createOrder,
    deleteOrder,
  };
}
