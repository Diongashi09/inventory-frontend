<template>
  <div class="container mx-auto p-4 bg-white shadow-md rounded-lg">
    <h2 class="text-2xl font-semibold mb-4">{{ isEditing ? 'Edit Employee' : 'Create New Manager' }}</h2>

    <form @submit.prevent="submitForm" class="space-y-6">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Employee Name</label>
        <input
          type="text"
          id="name"
          v-model="localEmployee.name"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          v-model="localEmployee.email"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
          :readonly="isEditing" 
        />
      </div>

      <!-- Role selection only for editing or if backend had a generic store method -->
      <!-- For creation, UserController@createManager hardcodes role to 'Manager' -->
      <div v-if="isEditing">
        <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
        <select
          id="role"
          v-model="localEmployee.role_id"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        >
          <option value="">Select Role</option>
          <!-- Assuming these are your backend role IDs. Verify them! -->
          <option :value="1">Admin</option>
          <option :value="2">Manager</option>
          <!-- <option :value="3">Staff</option> -->
        </select>
      </div>
      <!-- Removed phone, address, hireDate, notes as they are not handled by UserController -->
      <!-- Removed previous complex password handling logic -->
      <div v-if="!isEditing">
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            v-model="localEmployee.password"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div class="mt-2">
          <label for="password_confirmation" class="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            id="password_confirmation"
            v-model="localEmployee.password_confirmation"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
      </div>
      <p v-else class="text-sm text-gray-500 mt-4">Password can be changed via profile settings or admin password reset.</p>


      <div class="flex justify-end space-x-4">
        <button
          type="button"
          @click="cancel"
          class="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          {{ isEditing ? 'Update Employee' : 'Create Manager' }}
        </button>
      </div>

      <div v-if="errorMessage" class="text-red-600 mt-4">{{ errorMessage }}</div>
    </form>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useEmployees } from '@/composables/useEmployees';

const router = useRouter();
const route = useRoute();
const { employee: fetchedEmployeeFromComposable, getEmployeeById, createEmployee, updateEmployee, errorMessage, clearErrorMessage } = useEmployees();

const isEditing = computed(() => route.params.id !== undefined);

// Local state for the form, strictly based on UserController's handled fields
const localEmployee = reactive({
  id: null,
  name: '',
  email: '',
  role_id: null, // This is the ID of the role (e.g., 1 for Admin, 2 for Manager, 3 for Staff)
  password: '',
  password_confirmation: '',
});

// Initialize form data when component mounts or route changes for editing
onMounted(async () => {
  clearErrorMessage();
  if (isEditing.value && route.params.id) {
    const fetchedEmployee = await getEmployeeById(route.params.id);
    if (fetchedEmployee) {
      // Map fetched data to local form state
      localEmployee.id = fetchedEmployee.id;
      localEmployee.name = fetchedEmployee.name || '';
      localEmployee.email = fetchedEmployee.email || '';
      localEmployee.role_id = fetchedEmployee.role_id || null;
      // Passwords are not fetched
      localEmployee.password = '';
      localEmployee.password_confirmation = '';
    } else {
        errorMessage.value = errorMessage.value || "Employee not found or failed to load.";
    }
  } else {
    // Reset local employee for new creation
    Object.assign(localEmployee, {
      id: null,
      name: '',
      email: '',
      role_id: null, // Will be overridden by backend to Manager if using createManager
      password: '',
      password_confirmation: '',
    });
  }
});


// Function to submit the form
const submitForm = async () => {
  clearErrorMessage();

  // Basic frontend validation based on backend expectations
  if (!localEmployee.name || !localEmployee.email) {
    errorMessage.value = "Name and Email are required.";
    return;
  }

  // Password validation specific to CREATE
  if (!isEditing.value) {
    if (!localEmployee.password || !localEmployee.password_confirmation) {
      errorMessage.value = "Password and Confirm Password are required for new employees.";
      return;
    }
    if (localEmployee.password !== localEmployee.password_confirmation) {
      errorMessage.value = "Password and confirmation do not match.";
      return;
    }
    if (localEmployee.password.length < 6) {
      errorMessage.value = "Password must be at least 6 characters.";
      return;
    }
  }

  // Prepare data for submission based on backend UserController validation
  const payload = {
    name: localEmployee.name,
    email: localEmployee.email,
  };

  if (isEditing.value) {
    // For update, role_id is optional but can be sent
    if (localEmployee.role_id !== null) {
        payload.role_id = localEmployee.role_id;
    }
    // Only send password fields if they are explicitly filled during update
    if (localEmployee.password && localEmployee.password_confirmation) {
      if (localEmployee.password !== localEmployee.password_confirmation) {
        errorMessage.value = "Password and confirmation do not match."; // Double check
        return;
      }
      if (localEmployee.password.length < 6) {
        errorMessage.value = "Password must be at least 6 characters.";
        return;
      }
      payload.password = localEmployee.password;
      payload.password_confirmation = localEmployee.password_confirmation;
    }
  } else {
    // For creation, always include password fields
    payload.password = localEmployee.password;
    payload.password_confirmation = localEmployee.password_confirmation;
    // role_id is NOT sent for creation via createManager, backend hardcodes it.
  }

  try {
    if (isEditing.value) {
      await updateEmployee(localEmployee.id, payload);
      alert('Employee updated successfully!');
    } else {
      // When creating, the backend createManager method will set the role to 'Manager'
      await createEmployee(payload); // This calls /users/manager
      alert('New Manager created successfully!'); // More specific alert
    }
    router.push({ name: 'Employees' });
  } catch (error) {
    console.error("Operation failed:", error);
    alert("Operation failed: " + (errorMessage.value || error.message || "An unknown error occurred. Check console for details."));
  }
};

const cancel = () => {
  router.push({ name: 'Employees' });
};
</script>



<!-- <template>
  <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
      <h2 class="text-xl mb-4">{{ employee.id ? 'Edit Employee Profile' : 'Create New Manager' }}</h2>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Name</label>
          <input
            v-model="local.name"
            type="text"
            required
            class="w-full border p-2 rounded mt-1"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="local.email"
            type="email"
            required
            class="w-full border p-2 rounded mt-1"
            :disabled="!!employee.id && !hasRole('Admin')"
          />
        </div>

        <div v-if="employee.id && hasRole('Admin') && roles.length > 0">
          <label class="block text-sm font-medium text-gray-700">Role</label>
          <select
            v-model="local.role_id"
            class="w-full border p-2 rounded mt-1"
          >
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
        </div>

        
        <div v-if="!employee.id || (employee.id && showPasswordFields && (hasRole('Admin') || (employee.id === authUser.id)))">
          <p v-if="employee.id" class="text-sm text-gray-500 mb-2">Leave password fields blank to keep current password.</p>
          <div>
            <label class="block text-sm font-medium text-gray-700">Password</label>
            <input
              v-model="local.password"
              type="password"
              :required="!employee.id"
              class="w-full border p-2 rounded mt-1"
            />
          </div>
          <div class="mt-2">
            <label class="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              v-model="local.password_confirmation"
              type="password"
              :required="!employee.id"
              class="w-full border p-2 rounded mt-1"
            />
          </div>
        </div>

        <div v-if="employee.id && !showPasswordFields && (!hasRole('Admin') && employee.id === authUser.id)" class="mt-4">
          <button type="button" @click="showPasswordFields = true" class="text-blue-600 hover:underline text-sm">
            Change Password
          </button>
        </div>

        <div v-if="employee.id && !showPasswordFields && hasRole('Admin')" class="mt-4">
          <button type="button" @click="showPasswordFields = true" class="text-blue-600 hover:underline text-sm">
            Reset Password
          </button>
        </div>


        <div class="flex justify-end space-x-2">
          <button
            type="button"
            class="px-4 py-2 border rounded hover:bg-gray-100"
            @click="$emit('cancel')"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Employee
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, ref } from 'vue';
import { useAuth } from '@/composables/useAuth'; 

const props = defineProps({
  employee: { type: Object, default: () => ({}) }, 
  roles: { type: Array, default: () => [] },
});

const emit = defineEmits(['save', 'cancel']);

const { hasRole, user: authUser } = useAuth(); 

const local = reactive({
  id: null,
  name: '',
  email: '',
  role_id: null,
  password: '',
  password_confirmation: '',
});

const showPasswordFields = ref(false);

watch(
  () => props.employee,
  (emp) => {
    Object.assign(local, {
      id: emp.id || null,
      name: emp.name || '',
      email: emp.email || '',
      role_id: emp.role_id || null,
      password: '',
      password_confirmation: '',
    });
    showPasswordFields.value = !emp.id || hasRole('Admin');
  },
  { immediate: true }
);

function onSubmit() {
  const payload = {
    name: local.name,
    email: local.email,
  };

  if (local.password || local.password_confirmation) { 
    if (local.password !== local.password_confirmation) {
      alert('Password and confirmation do not match.');
      return;
    }
    if (local.password.length < 6) {
        alert('Password must be at least 6 characters.');
        return;
    }
    payload.password = local.password;
    payload.password_confirmation = local.password_confirmation;
  }

  if (local.id && hasRole('Admin')) {
    payload.role_id = local.role_id;
  } else if (!local.id) {
  }

  emit('save', { id: local.id, ...payload });
}
</script>

<style scoped>
</style> -->