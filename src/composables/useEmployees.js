import { ref } from 'vue';
import { useAxios } from '@/composables/useAxios';

const employees = ref([]);
const employee = ref(null);
const isLoading = ref(false);
const errorMessage = ref(null);

export function useEmployees() {
  const { api } = useAxios(); // Initialize useAxios inside the composable function

  const clearErrorMessage = () => {
    errorMessage.value = null;
  };

  const fetchEmployees = async (params = {}) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      const response = await api.get('/users', {params});
      employees.value = response.data || [];
    } catch (error) {
      console.error("Error fetching employees:", error);
      errorMessage.value = error.response?.data?.message || 'Failed to load employees.';
    } finally {
      isLoading.value = false;
    }
  };

  const getEmployeeById = async (id) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      const response = await api.get(`/users/${id}`);
      employee.value = response.data;
      return employee.value;
    } catch (error) {
      console.error(`Error fetching employee with ID ${id}:`, error);
      errorMessage.value = error.response?.data?.message || `Failed to load employee with ID ${id}.`;
    } finally {
      isLoading.value = false;
    }
  };

  // const createEmployee = async (employeeData) => {
  //   isLoading.value = true;
  //   clearErrorMessage();
  //   try {
  //     const response = await api.post('/users', employeeData);
  //     console.log('Employee created:', response.data);
  //   } catch (error) {
  //     console.error("Error creating employee:", error);
  //     errorMessage.value = error.response?.data?.message || 'Failed to create employee.';
  //   } finally {
  //     isLoading.value = false;
  //   }
  // };

  const updateEmployee = async (id, employeeData) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      const response = await api.put(`/users/${id}`, employeeData);
      console.log('Employee updated:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating employee with ID ${id}:`, error);
      errorMessage.value = error.response?.data?.message || `Failed to update employee with ID ${id}.`;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteEmployee = async (id) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      await api.delete(`/users/${id}`);
      employees.value = employees.value.filter(e => e.id !== id);
      console.log(`Employee with ID ${id} deleted.`);
    } catch (error) {
      console.error(`Error deleting employee with ID ${id}:`, error);
      errorMessage.value = error.response?.data?.message || `Failed to delete employee with ID ${id}.`;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    employees,
    employee,
    isLoading,
    errorMessage,
    clearErrorMessage,
    fetchEmployees,
    getEmployeeById,
    // createEmployee,
    updateEmployee,
    deleteEmployee,
  };
}



// // src/composables/useUsers.js
// import { ref } from 'vue';
// import api from './useAxios'; // Ensure this path is correct for your Axios instance

// const employees = ref([]);
// const roles = ref([]); // To store roles for the UserForm

// /**
//  * Fetches all users from the backend.
//  */
// async function fetchEmployees() {
//     try {
//         const response = await api.get('/users');
//         employees.value = response.data; // Assuming index returns direct array of User models
//         return employees.value;
//     } catch (error) {
//         console.error("Error fetching employees:", error);
//         throw error;
//     }
// }

// /**
//  * Fetches a single user by their ID, including their role.
//  * @param {number|string} id - The ID of the user.
//  */
// async function fetchEmployee(id) {
//     try {
//         const response = await api.get(`/users/${id}`);
//         return response.data; // Returns user model with role loaded
//     } catch (error) {
//         console.error(`Error fetching employee ${id}:`, error);
//         throw error;
//     }
// }

// /**
//  * Fetches all available roles for the form.
//  */
// async function fetchRoles() {
//     try {
//         // Assuming you have an endpoint like /roles that returns all roles
//         const response = await api.get('/roles');
//         roles.value = response.data; // Adjust based on your roles API response structure
//         return roles.value;
//     } catch (error) {
//         console.error("Error fetching roles:", error);
//         throw error;
//     }
// }

// /**
//  * Creates a new manager user.
//  * This directly calls the `createManager` method on your UserController.
//  */
// async function createManager(employeeData) {
//     try {
//         // Backend expects: name, email, password, password_confirmation
//         const response = await api.post('/users/create-manager', employeeData);
//         return response.data; // Returns the created user with role
//     } catch (error) {
//         console.error("Error creating manager:", error);
//         throw error;
//     }
// }

// /**
//  * Updates an existing user.
//  * @param {number|string} id - The ID of the user to update.
//  * @param {object} userData - The data to update (name, email, password, role_id).
//  */
// async function updateEmployee(id, employeeData) {
//     try {
//         const response = await api.put(`/users/${id}`, employeeData);
//         return response.data; // Returns the updated user
//     } catch (error) {
//         console.error(`Error updating user ${id}:`, error);
//         throw error;
//     }
// }

// /**
//  * Deletes a user.
//  * @param {number|string} id - The ID of the user to delete.
//  */
// async function deleteEmployee(id) {
//     try {
//         await api.delete(`/users/${id}`);
//     } catch (error) {
//         console.error(`Error deleting user ${id}:`, error);
//         throw error;
//     }
// }

// export {
//     employees,
//     roles,
//     fetchEmployees,
//     fetchEmployee,
//     fetchRoles,
//     createManager,
//     updateEmployee,
//     deleteEmployee
// };