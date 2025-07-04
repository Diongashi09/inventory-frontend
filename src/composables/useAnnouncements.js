import { ref } from 'vue'
import { useAxios } from '@/composables/useAxios'

const announcements = ref([])
const announcement = ref(null)
const isLoading = ref(false)
const errorMessage = ref(null)

export function useAnnouncements() {
  const { api } = useAxios()

  const clearErrorMessage = () => {
    errorMessage.value = null
  }

  const fetchAnnouncements = async (options = {}) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      let url = '/announcements';
      const params = new URLSearchParams();

      if (options.limit) {
        params.append('limit', options.limit);
      }
      // Add other filters/parameters if needed in the future
      // if (options.someFilter) {
      //   params.append('some_filter', options.someFilter);
      // }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await api.get(url);
      announcements.value = response.data || [];
    } catch (error) {
      console.error("Error fetching announcements:", error);
      errorMessage.value =
        error.response?.data?.message || 'Failed to load announcements.';
    } finally {
      isLoading.value = false;
    }
  };

  // const fetchAnnouncements = async () => {
  //   isLoading.value = true
  //   clearErrorMessage()
  //   try {
  //     const response = await api.get('/announcements')
  //     announcements.value = response.data || []
  //   } catch (error) {
  //     console.error("Error fetching announcements:", error)
  //     errorMessage.value =
  //       error.response?.data?.message || 'Failed to load announcements.'
  //   } finally {
  //     isLoading.value = false
  //   }
  // }

  const getAnnouncementById = async (id) => {
    isLoading.value = true
    clearErrorMessage()
    try {
      const response = await api.get(`/announcements/${id}`)
      announcement.value = response.data
      return announcement.value
    } catch (error) {
      console.error(`Error fetching announcement with ID ${id}:`, error)
      errorMessage.value =
        error.response?.data?.message || `Failed to load announcement with ID ${id}.`
    } finally {
      isLoading.value = false
    }
  }

  const createAnnouncement = async (data) => {
    isLoading.value = true
    clearErrorMessage()
    try {
      const response = await api.post('/announcements', data)
      announcements.value.unshift(response.data)
      return response.data
    } catch (error) {
      console.error('Error creating announcement:', error)
      errorMessage.value =
        error.response?.data?.message || 'Failed to create announcement.'
    } finally {
      isLoading.value = false
    }
  }

  const updateAnnouncement = async (id, data) => {
    isLoading.value = true
    clearErrorMessage()
    try {
      const response = await api.put(`/announcements/${id}`, data)
      const index = announcements.value.findIndex((a) => a.id === id)
      if (index !== -1) {
        announcements.value[index] = response.data
      }//e bojm update ni single announcement ne local announcements arr pa i bo refetch krejt announcementss
      return response.data
    } catch (error) {
      console.error(`Error updating announcement with ID ${id}:`, error)
      errorMessage.value =
        error.response?.data?.message || `Failed to update announcement with ID ${id}.`
    } finally {
      isLoading.value = false
    }
  }

  const deleteAnnouncement = async (id) => {
    isLoading.value = true
    clearErrorMessage()
    try {
      await api.delete(`/announcements/${id}`)
      announcements.value = announcements.value.filter((a) => a.id !== id)
      console.log(`Announcement with ID ${id} deleted.`)
    } catch (error) {
      console.error(`Error deleting announcement with ID ${id}:`, error)
      errorMessage.value = error.response?.data?.message || `Failed to delete announcement with ID ${id}.`
    } finally {
      isLoading.value = false
    }
  }

  return {
    announcements,
    announcement,
    isLoading,
    errorMessage,
    clearErrorMessage,
    fetchAnnouncements,
    getAnnouncementById,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
  }
}