<template>
  <div class="container mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
    <div v-if="isLoading" class="text-center text-gray-600">Loading employee details...</div>
    <div v-else-if="errorMessage" class="text-center text-red-600 text-lg">
      <p>Error: {{ errorMessage }}</p>
      <button @click="router.back()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go Back</button>
    </div>
    <div v-else-if="employee">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Employee: {{ employee.name }}</h1>
        <div class="space-x-2">
          <button @click="goToEditEmployee(employee.id)" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Edit Employee</button>
          <button @click="router.back()" class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Go Back</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h2 class="text-xl font-semibold text-gray-700 mb-3">Employee Information</h2>
          <p class="mb-2"><span class="font-medium">ID:</span> {{ employee.id }}</p>
          <p class="mb-2"><span class="font-medium">Name:</span> {{ employee.name }}</p>
          <p class="mb-2"><span class="font-medium">Email:</span> {{ employee.email }}</p>
          <p class="mb-2"><span class="font-medium">Role:</span> {{ employee.role?.name || 'N/A' }}</p>
        </div>
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
          <h2 class="text-xl font-bold text-blue-800 mb-3">Additional Info</h2>
          <p class="mb-2"><span class="font-medium">Created At:</span> {{ formatDate(employee.created_at) }}</p>
          <p class="mb-2"><span class="font-medium">Updated At:</span> {{ formatDate(employee.updated_at) }}</p>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-600">
      <p>Employee not found.</p>
      <button @click="router.back()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go Back</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useEmployees } from '@/composables/useEmployees';

const { getEmployeeById, employee, isLoading, errorMessage } = useEmployees();
const route = useRoute();
const router = useRouter();

function formatDate(dateString) {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function goToEditEmployee(id) {
  router.push({ name: 'EditEmployee', params: { id } });
}

onMounted(() => {
  const id = route.params.id;
  if (id) getEmployeeById(id);
});
</script>

<!-- <template>
  <div class="container mx-auto p-4 bg-white shadow-md rounded-lg">
    <h2 class="text-2xl font-semibold mb-4">Employee Details</h2>

    <div v-if="isLoading" class="text-center py-8">
      <p>Loading employee details...</p>
    </div>

    <div v-else-if="errorMessage" class="text-red-600 text-center py-8">
      <p>{{ errorMessage }}</p>
    </div>

    <div v-else-if="employee">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <p><strong>Name:</strong> {{ employee.name }}</p>
        <p><strong>Email:</strong> {{ employee.email }}</p>
        <p><strong>Role:</strong> {{ employee.role }}</p>
        <p><strong>Phone:</strong> {{ employee.phone || 'N/A' }}</p>
        <p><strong>Address:</strong> {{ employee.address || 'N/A' }}</p>
        <p><strong>Hire Date:</strong> {{ formatDate(employee.hireDate) }}</p>
        <p class="col-span-2"><strong>Notes:</strong> {{ employee.notes || 'N/A' }}</p>
        <p><strong>Created At:</strong> {{ formatDate(employee.createdAt) }}</p>
        <p><strong>Last Updated:</strong> {{ formatDate(employee.updatedAt) }}</p>
      </div>

      <div class="mt-6 flex space-x-4">
        <router-link
          :to="{ name: 'EditEmployee', params: { id: employee.id } }"
          class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Edit Employee
        </router-link>
        <button
          @click="confirmDelete"
          class="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Delete Employee
        </button>
        <button
          @click="router.back()"
          class="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Back to List
        </button>
      </div>
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
              @click="executeDelete"
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
import { useRoute, useRouter } from 'vue-router';
import { useEmployees } from '@/composables/useEmployees';

const route = useRoute();
const router = useRouter();
const { employee, isLoading, errorMessage, getEmployeeById, deleteEmployee } = useEmployees();

const showDeleteModal = ref(false);

onMounted(async () => {
  const employeeId = route.params.id;
  if (employeeId) {
    await getEmployeeById(employeeId);
  }
});

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const confirmDelete = () => {
  showDeleteModal.value = true;
};

const executeDelete = async () => {
  showDeleteModal.value = false;
  if (employee.value && employee.value.id) {
    await deleteEmployee(employee.value.id);
    if (!errorMessage.value) {
      router.push({ name: 'Employees' });
    }
  }
};
</script>

<style scoped>
</style> -->

<!-- space -->

<!-- <template>
  <div class="container mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
    <div v-if="isLoading" class="text-center text-gray-600">Loading employee details...</div>
    <div v-else-if="error" class="text-center text-red-600 text-lg">
      <p>Error: {{ error }}</p>
      <button @click="router.back()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go Back</button>
    </div>
    <div v-else-if="employee">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Employee: {{ employee.name }}</h1>
        <div class="space-x-2">
            <button
                v-if="hasRole('Admin') || (employee.id === authUser?.id)"
                @click="goToEditEmployee(employee.id)"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Edit Profile
            </button>
            <button @click="router.back()" class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Go Back</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h2 class="text-xl font-semibold text-gray-700 mb-3">Personal Information</h2>
          <p class="mb-2"><span class="font-medium">ID:</span> {{ employee.id }}</p>
          <p class="mb-2"><span class="font-medium">Name:</span> {{ employee.name }}</p>
          <p class="mb-2"><span class="font-medium">Email:</span> {{ employee.email }}</p>
        </div>

        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
          <h2 class="text-xl font-bold text-blue-800 mb-3">Role Details</h2>
          <p class="mb-2"><span class="font-medium">Role:</span> {{ employee.role?.name || 'N/A' }}</p>
          <p class="mb-2"><span class="font-medium">Description:</span> {{ employee.role?.description || 'No description provided.' }}</p>
        </div>
      </div>

      <div class="mt-6 text-gray-600 text-sm">
        <p>Created: {{ new Date(employee.created_at).toLocaleString() }}</p>
        <p>Last Updated: {{ new Date(employee.updated_at).toLocaleString() }}</p>
      </div>
    </div>
    <div v-else class="text-center text-gray-600">
      <p>Employee not found.</p>
      <button @click="router.back()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go Back</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchEmployee } from '@/composables/useEmployees';
import { useAuth } from '@/composables/useAuth'; 

const route = useRoute();
const router = useRouter();

const employee = ref(null); 
const isLoading = ref(true);
const error = ref(null);

const { hasRole, user: authUser } = useAuth(); 

const props = defineProps({
  id: { type: [String, Number], required: true } 
});

async function loadEmployeeDetails() {
  isLoading.value = true;
  error.value = null;
  employee.value = null;

  try {
    const fetchedEmployee = await fetchEmployee(props.id); 
    if (fetchedEmployee) {
      employee.value = fetchedEmployee;
    } else {
      error.value = "Employee not found or you don't have permission.";
    }
  } catch (err) {
    console.error("Failed to fetch employee details:", err);
    error.value = err.response?.data?.message || "Failed to load employee details.";
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadEmployeeDetails);

watch(
  () => props.id,
  (newId) => {
    if (newId) {
      loadEmployeeDetails();
    }
  }
);

function goToEditEmployee(employeeId) {
  router.push({ name: 'EditEmployee', params: { id: employeeId } });
}
</script>

<style scoped>
</style> -->