<template>
  <aside class="w-64 bg-white border-r shadow-lg flex flex-col h-screen">
    <div class="px-6 py-4 text-xl font-bold border-b flex items-center gap-2">
      <img :src="dashboardLogo" alt="Inventory Logo" class="w-6 h-6" />
      <span>Inventory</span>
    </div>


    <nav class="flex-grow px-2 mt-4 space-y-1 overflow-y-auto">
      <!-- Links visible to Admin, Manager, Client -->
      <SidebarLink icon="fas fa-tachometer-alt" text="Dashboard" :to="{ name: 'Dashboard' }" :requiredRoles="['Admin', 'Manager', 'Client']" exact />
      <SidebarLink icon="fas fa-box" text="Products" :to="{ name: 'Products' }" :requiredRoles="['Admin', 'Manager', 'Client']" />

      <!-- Client-Specific Links -->
      <SidebarLink
        v-if="hasAnyRole(['Client'])"
        icon="fas fa-shopping-bag"
        text="My Orders"
        :to="{ name: 'MyOrders' }"
        :requiredRoles="['Client']"
      />
      <SidebarLink
        v-if="hasAnyRole(['Client'])"
        icon="fas fa-user-circle"
        text="My Profile"
        :to="{ name: 'MyProfile' }"
        :requiredRoles="['Client']"
      />

      <!-- Admin/Manager Specific Links -->
      <SidebarLink v-if="hasAnyRole(['Admin', 'Manager'])" icon="fas fa-users" text="Clients" :to="{ name: 'Clients' }" :requiredRoles="['Admin', 'Manager']" />
      <SidebarLink v-if="hasAnyRole(['Admin', 'Manager'])" icon="fas fa-file-invoice" text="Invoices" :to="{ name: 'Invoices' }" :requiredRoles="['Admin', 'Manager']" />
      <SidebarLink v-if="hasAnyRole(['Admin', 'Manager'])" icon="fas fa-warehouse" text="Supplies" :to="{ name: 'Supplies' }" :requiredRoles="['Admin', 'Manager']" />
      <SidebarLink v-if="hasAnyRole(['Admin', 'Manager'])" icon="fas fa-truck" text="Shippings" :to="{ name: 'Shippings' }" :requiredRoles="['Admin', 'Manager']" />
      <SidebarLink v-if="hasAnyRole(['Admin', 'Manager'])" icon="fas fa-exchange-alt" text="Transactions" :to="{ name: 'Transactions' }" :requiredRoles="['Admin', 'Manager']" />
      <SidebarLink v-if="hasAnyRole(['Admin'])" icon="fas fa-user-tie" text="Employees" :to="{ name: 'Employees' }" :requiredRoles="['Admin']" />
    </nav>

    <!-- <nav class="flex-grow px-2 mt-4 space-y-1 overflow-y-auto">
      <SidebarLink icon="fas fa-tachometer-alt" text="Dashboard" :to="{ name: 'Dashboard' }" :requiredRoles="['Admin', 'Manager', 'Client']" exact/>
      <SidebarLink icon="fas fa-box" text="Products" :to="{ name: 'Products' }" :requiredRoles="['Admin', 'Manager', 'Client']" />
      <SidebarLink icon="fas fa-users" text="Clients" :to="{ name: 'Clients' }" :requiredRoles="['Admin', 'Manager', 'Client']" />
      <SidebarLink icon="fas fa-file-invoice" text="Invoices" :to="{ name: 'Invoices' }" :requiredRoles="['Admin', 'Manager', 'Client']" />
      <SidebarLink icon="fas fa-warehouse" text="Supplies" :to="{ name: 'Supplies' }" :requiredRoles="['Admin', 'Manager', 'Client']" />
      <SidebarLink icon="fas fa-truck" text="Shippings" :to="{ name: 'Shippings' }" :requiredRoles="['Admin', 'Manager', 'Client']" />
      <SidebarLink icon="fas fa-exchange-alt" text="Transactions" :to="{ name: 'Transactions' }" :requiredRoles="['Admin', 'Manager']" />
      <SidebarLink icon="fas fa-user-tie" text="Employees" :to="{ name: 'Employees' }" :requiredRoles="['Admin']" />
    </nav> -->

    <!-- <div class="border-t p-4">
      <button
        @click="showLogoutModal = true"
        class="w-full text-left text-red-600 hover:underline py-2 px-4 rounded"
      >
        Logout
      </button>
    </div> -->

  <div class="border-t p-4">
      <button
       @click="showLogoutModal = true"
       class="w-full flex items-center text-red-600 hover:underline py-2 px-4 rounded gap-2"
       >
         <i class="fas fa-sign-out-alt w-5 text-center"></i>
      <span>Logout</span>
    </button>
  </div>


    <div
      v-if="showLogoutModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h3 class="text-lg font-semibold mb-4">Confirm Logout</h3>
        <p class="text-gray-700 mb-6">Are you sure you want to log out?</p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showLogoutModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            @click="handleLogout"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<!-- <template>
  <div class="flex flex-col h-full bg-gray-800 text-white w-64 space-y-4 py-4 px-3">
    <div class="flex items-center justify-center h-16 border-b border-gray-700">
      <span class="text-2xl font-bold">Admin Panel</span>
    </div>

    <nav class="flex-1 space-y-2">
      <SidebarLink icon="fas fa-tachometer-alt" text="Dashboard" :to="{ name: 'Dashboard' }" :requiredRoles="['Admin', 'Manager', 'Staff']" />
      <SidebarLink icon="fas fa-box" text="Products" :to="{ name: 'Products' }" :requiredRoles="['Admin', 'Manager', 'Staff']" />
      <SidebarLink icon="fas fa-users" text="Clients" :to="{ name: 'Clients' }" :requiredRoles="['Admin', 'Manager', 'Staff']" />
      <SidebarLink icon="fas fa-file-invoice" text="Invoices" :to="{ name: 'Invoices' }" :requiredRoles="['Admin', 'Manager', 'Staff']" />
      <SidebarLink icon="fas fa-warehouse" text="Supplies" :to="{ name: 'Supplies' }" :requiredRoles="['Admin', 'Manager', 'Staff']" />
      <SidebarLink icon="fas fa-truck" text="Shippings" :to="{ name: 'Shippings' }" :requiredRoles="['Admin', 'Manager', 'Staff']" />
      <SidebarLink icon="fas fa-exchange-alt" text="Transactions" :to="{ name: 'Transactions' }" :requiredRoles="['Admin', 'Manager']" />
      <SidebarLink icon="fas fa-user-tie" text="Employees" :to="{ name: 'Employees' }" :requiredRoles="['Admin']" />
    </nav>

    <div class="flex items-center justify-center p-4 border-t border-gray-700">
      <button
        @click="logout"
        class="flex items-center px-4 py-2 text-red-400 hover:text-red-500 hover:bg-gray-700 rounded-md transition duration-200 w-full justify-center"
      >
        <i class="fas fa-sign-out-alt mr-2"></i>
        <span>Logout</span>
      </button>
    </div>
  </div>
</template> -->


<script setup>
import { ref } from 'vue';
import SidebarLink from '@/components/Sidebar/SidebarLink.vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import dashboardLogo from '@/assets/checklist.png'; // Adjust path if needed

const router = useRouter();
const { logout, hasAnyRole } = useAuth();

const showLogoutModal = ref(false);

const handleLogout = async () => {
  showLogoutModal.value = false;
  await logout();
  router.push({ name: 'Login' });
};
</script>

<!-- <script setup>
import SidebarLink from '@/components/Sidebar/SidebarLink.vue';
import { useAuth } from '@/composables/useAuth';
import { useRouter } from 'vue-router';

const { logout: authLogout } = useAuth();
const router = useRouter();

const logout = async () => {
  await authLogout();
  router.push({ name: 'Login' });
};
</script>

<style scoped>
/* No specific styles needed here as Tailwind handles most of it */
</style> -->


<!-- <template>
  <aside class="w-64 bg-white border-r shadow-lg flex flex-col h-screen">
    <div class="px-6 py-4 text-xl font-bold border-b flex items-center gap-2">
      <img :src="dashboardLogo" alt="Inventory Logo" class="w-6 h-6" />
      <span>Inventory</span>
    </div>

    <nav class="flex-grow px-2 mt-4 space-y-1 overflow-y-auto">
      <SidebarLink to="/" label="Dashboard" :icon="dashboard" />

      <SidebarLink to="/products" label="Products" :icon="products" />


      <SidebarLink to="/clients" label="Clients" :icon="clientsIcon" />

      <SidebarLink to="/invoices" label="Invoices" :icon="invoice" />

      <SidebarLink to="/supplies" label="Supplies" :icon="supply" />

      <SidebarLink to="/shippings" label="Shippings" :icon="shipped" />

      <SidebarLink v-if="hasAnyRole(['Admin', 'Manager'])" to="/transactions" label="Transactions" :icon="transaction" />

      <SidebarLink v-if="hasRole('Admin')" to="/employees" label="Employees" :icon="employeesIcon" />

      
      <SidebarLink v-if="isAuthenticated && user?.id" :to="`/employees/${user.id}`" label="My Profile" :icon="profileIcon" />

    </nav>

    <div class="border-t p-4">
      <button
        @click="showLogoutModal = true"
        class="w-full text-left text-red-600 hover:underline py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>

    <div
      v-if="showLogoutModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h3 class="text-lg font-semibold mb-4">Confirm Logout</h3>
        <p class="text-gray-700 mb-6">Are you sure you want to log out?</p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showLogoutModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            @click="handleLogout"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue';
import SidebarLink from './SidebarLink.vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth'; 


import invoice from '@/assets/bill.png';
import supply from '@/assets/supply-chain-management.png';
import dashboard from '@/assets/dashboard.png';
import products from '@/assets/warehouse.png';
import dashboardLogo from '@/assets/checklist.png';
import shipped from '@/assets/shipped.png';
import transaction from '@/assets/transactional-data.png';
import employeesIcon from '@/assets/employees.png';
import clientsIcon from '@/assets/handshake.png'; 
import profileIcon from '@/assets/user.png'; 

const router = useRouter();
const { logout, hasRole, hasAnyRole, isAuthenticated, user } = useAuth(); 

const showLogoutModal = ref(false);

const handleLogout = async () => {
  showLogoutModal.value = false;
  await logout();
  router.push('/login');
};
</script>

<style scoped>
</style> -->

<!-- space -->

<!-- <template>
  <aside class="w-64 bg-white border-r shadow-lg flex flex-col h-screen"> <div class="px-6 py-4 text-xl font-bold border-b flex items-center gap-2">
      <img :src="dashboardLogo" alt="Inventory Logo" class="w-6 h-6" />
      <span>Inventory</span>
    </div>

    <nav class="flex-grow px-2 mt-4 space-y-1 overflow-y-auto"> <SidebarLink to="/" label="Dashboard" :icon="dashboard" />
      <SidebarLink to="/products" label="Products" :icon="products" />
      <SidebarLink to="/invoices" label="Invoices" :icon="invoice" />
      <SidebarLink to="/supplies" label="Supplies" :icon="supply" />
      <SidebarLink to="/shippings" label="Shippings" :icon="shipped" />
      <SidebarLink to="/transactions" label="Transactions" :icon="transaction" />
      <SidebarLink to="/employees" label="Employees" :icon="employees" /> </nav>

    <div class="border-t p-4">
      <button
        @click="showLogoutModal = true"
        class="w-full text-left text-red-600 hover:underline py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>

    <div
      v-if="showLogoutModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h3 class="text-lg font-semibold mb-4">Confirm Logout</h3>
        <p class="text-gray-700 mb-6">Are you sure you want to log out?</p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showLogoutModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            @click="handleLogout"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>


<script setup>
import { ref } from 'vue'

import SidebarLink from './SidebarLink.vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import invoice from '@/assets/bill.png'
import supply from '@/assets/supply-chain-management.png'
import dashboard from '@/assets/dashboard.png'
import products from '@/assets/warehouse.png'
import dashboardLogo from '@/assets/checklist.png'
import shipped from '@/assets/shipped.png'
import transaction from '@/assets/transactional-data.png'
import employees from '@/assets/employees.png'

const router = useRouter()
const { logout } = useAuth()

const showLogoutModal = ref(false);

const handleLogout = async () => {
  showLogoutModal.value = false;
  await logout()
  router.push('/login')
}
</script> -->