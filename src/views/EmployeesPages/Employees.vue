<template>
  <div class="p-6 space-y-4">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold">Employees</h1>
      <button
        class="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out whitespace-nowrap"
        @click="goToCreateEmployee"
      >
        Create Employee
      </button>
    </div>

    <div class="mb-4">
      <input
        type="text"
        v-model="searchQuery"
        @input="handleSearch"
        placeholder="Search by name or email..."
        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>

    <div v-if="isLoading" class="text-center text-gray-600 py-8">
      Loading employees...
    </div>

    <div v-else>
      <EmployeeTable
        :employees="Array.isArray(employees) ? employees : employees.data || []"
        @view="goToEmployeeDetails"
        @edit="goToEditEmployee"
        @delete="onDelete"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useEmployees } from '@/composables/useEmployees';
import EmployeeTable from '@/components/Employees/EmployeeTable.vue';

const { employees, fetchEmployees, deleteEmployee, isLoading, errorMessage } = useEmployees();
const router = useRouter();

const searchQuery = ref('');
let searchTimeout = null;

async function loadAllEmployees(params = {}) {
  await fetchEmployees(params);
}

onMounted(()=>{
  loadAllEmployees();
});

// Handle search input with debouncing
const handleSearch = () => {
  clearTimeout(searchTimeout); // Clear previous timeout
  searchTimeout = setTimeout(() => {
    loadAllEmployees({ search: searchQuery.value }); // Trigger fetch after debounce
  }, 300); // 300ms debounce time
};

function goToCreateEmployee() {
  router.push({ name: 'CreateEmployee' });
}

function goToEditEmployee(employee) {
  router.push({ name: 'EditEmployee', params: { id: employee.id } });
}

function goToEmployeeDetails(employee) {
  router.push({ name: 'EmployeeDetails', params: { id: employee.id } });
}

async function onDelete(id) {
  if (!confirm('Are you sure you want to delete this employee?')) return;
  await deleteEmployee(id);
  await loadAllEmployees({search: searchQuery.value});
}
</script>

<style scoped>
/* Scoped styles for Employees.vue if any */
</style>

<!-- space -->

<!-- <template>
  <div class="p-6 space-y-4">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold">Employees Management</h1>
      <button
        v-if="hasRole('Admin')"
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        @click="goToCreateManager"
      >
        Create Manager
      </button>
    </div>

    <div v-if="isLoading" class="text-center text-gray-600 py-8">
      Loading employees...
      <p class="text-sm">Please wait while we fetch the employee data.</p>
    </div>

    <EmployeeTable
      v-else
      :employees="employees"
      @edit="goToEditEmployee"
      @delete="onDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  employees,
  fetchEmployees,
  deleteEmployee
} from '@/composables/useEmployees';
import { useAuth } from '@/composables/useAuth'; 

import EmployeeTable from '@/components/Employees/EmployeeTable.vue';

const router = useRouter();
const { hasRole } = useAuth(); 

const isLoading = ref(true);

async function loadAllEmployees() {
  isLoading.value = true;
  try {
    await fetchEmployees(); 
  } catch (error) {
    console.error("Error loading employees:", error);
    alert("Failed to load data: " + (error.response?.data?.message || error.message));
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadAllEmployees);

function goToCreateManager() {
  router.push({ name: 'CreateManager' });
}

function goToEditEmployee(employee) {
  router.push({ name: 'EditEmployee', params: { id: employee.id } });
}

async function onDelete(id) {
  if (!confirm('Are you sure you want to delete this employee? This action cannot be undone.')) return;
  isLoading.value = true;
  try {
    await deleteEmployee(id);
    alert('Employee deleted successfully!');
    await loadAllEmployees(); 
  } catch (error) {
    console.error("Error deleting employee:", error);
    alert("Failed to delete employee: " + (error.response?.data?.message || error.message));
  } finally {
    isLoading.value = false;
  }
}
</script>

<style>
</style> -->