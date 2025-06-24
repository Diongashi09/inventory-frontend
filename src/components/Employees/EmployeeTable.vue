<template>
  <div class="bg-white shadow-md rounded-lg p-4">
    <div v-if="employees.length === 0" class="text-center py-8">
      <p>No employees found. Start by creating a new one!</p>
    </div>
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="employee in employees" :key="employee.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ employee.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ employee.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ employee.role?.name || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(employee.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="$emit('view', employee)" class="text-indigo-600 hover:text-indigo-900 mr-4">View</button>
              <button @click="$emit('edit', employee)" class="text-green-600 hover:text-green-900 mr-4">Edit</button>
              <button @click="$emit('delete', employee.id)" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  employees: {
    type: Array,
    required: true,
    default: () => []
  }
});

function formatDate(dateString) {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}
</script>

<!-- <template>
  <div class="bg-white shadow-md rounded-lg p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold">Employee Management</h2>
      <router-link
        :to="{ name: 'CreateManager' }"
        class="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Add New Employee
      </router-link>
    </div>

    <div v-if="isLoading" class="text-center py-8">
      <p>Loading employees...</p>
    </div>

    <div v-else-if="errorMessage" class="text-red-600 text-center py-8">
      <p>{{ errorMessage }}</p>
    </div>

    <div v-else-if="employees.length === 0" class="text-center py-8">
      <p>No employees found. Add new employees to your team!</p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Phone
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hire Date
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="employee in employees" :key="employee.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ employee.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ employee.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span
                :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  employee.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                  employee.role === 'Manager' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                ]"
              >
                {{ employee.role }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ employee.phone || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(employee.hireDate) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <router-link
                :to="{ name: 'EmployeeDetails', params: { id: employee.id } }"
                class="text-indigo-600 hover:text-indigo-900 mr-4"
              >
                View
              </router-link>
              <router-link
                :to="{ name: 'EditEmployee', params: { id: employee.id } }"
                class="text-green-600 hover:text-green-900 mr-4"
              >
                Edit
              </router-link>
              <button
                @click="confirmDelete(employee.id)"
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>


    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div class="relative p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Confirm Deletion</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">
              Are you sure you want to delete this employee record? This action cannot be undone.
            </p>
          </div>
          <div class="items-center px-4 py-3">
            <button
              @click="deleteEmployee(employeeToDeleteId); showDeleteModal = false;"
              class="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Delete
            </button>
            <button
              @click="showDeleteModal = false"
              class="mt-3 px-4 py-2 bg-white text-gray-700 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useEmployees } from '@/composables/useEmployees';

const { employees, isLoading, errorMessage, fetchEmployees, deleteEmployee } = useEmployees();

const showDeleteModal = ref(false);
const employeeToDeleteId = ref(null);

onMounted(async () => {
  await fetchEmployees();
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const confirmDelete = (id) => {
  employeeToDeleteId.value = id;
  showDeleteModal.value = true;
};
</script>

<style scoped>
</style> -->


<!-- space -->

<!-- <template>
  <table class="w-full table-auto border-collapse">
    <thead class="bg-gray-100">
      <tr>
        <th class="p-2 text-left">ID</th>
        <th class="p-2 text-left">Name</th>
        <th class="p-2 text-left">Email</th>
        <th class="p-2 text-left">Role</th>
        <th class="p-2 text-center w-[160px]">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="employee in employees"
        :key="employee.id"
        class="border-t hover:bg-gray-50 cursor-pointer"
        @click="goToEmployeeDetails(employee.id)"
      >
        <td class="p-2 font-medium text-left">{{ employee.id }}</td>
        <td class="p-2 text-left">{{ employee.name }}</td>
        <td class="p-2 text-left">{{ employee.email }}</td>
        <td class="p-2 text-left">{{ employee.role?.name || 'N/A' }}</td>
        <td class="p-2 flex items-center justify-center space-x-2 h-full" @click.stop>
          <button
            v-if="hasRole('Admin') || (employee.id === user?.id)"
            class="px-2 py-1 text-xs bg-blue-400 text-white rounded-md hover:bg-blue-500 flex-shrink-0 w-[60px]"
            @click="$emit('edit', employee)"
          >
            Edit
          </button>
          <button
            v-if="hasRole('Admin')"
            class="px-2 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 flex-shrink-0 w-[60px]"
            @click="$emit('delete', employee.id)"
          >
            Delete
          </button>
        </td>
      </tr>
      <tr v-if="employees.length === 0">
        <td colspan="5" class="p-4 text-center text-gray-500">No employees found.</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { hasRole, user } = useAuth(); 

const props = defineProps({
  employees: { type: Array, required: true }
});

const emit = defineEmits(['edit', 'delete']);

function goToEmployeeDetails(id) {
  router.push({ name: 'EmployeeDetails', params: { id: id } });
}
</script>

<style scoped>
</style> -->