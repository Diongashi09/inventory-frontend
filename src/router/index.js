// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '@/composables/useAuth'; // Absolute path

// --- Auth Views (from src/views/AuthPages/) ---
import Login from '@/views/AuthPages/Login.vue';
import Register from '@/views/AuthPages/Register.vue';
import ForgotPassword from '@/views/AuthPages/ForgotPassword.vue';
import ResetPassword from '@/views/AuthPages/ResetPassword.vue';

// --- Main Layout (from src/layouts/) ---
import SidebarLayout from '@/layouts/SidebarLayout.vue';

// --- Application Views ---
import Dashboard from '@/views/Dashboard.vue'; // Directly in src/views/

// Products (from src/views/ProductPages/ and src/components/Products/)
import Products from '@/views/ProductPages/Products.vue';
import ProductDetails from '@/views/ProductPages/ProductDetails.vue';
import ProductForm from '@/components/Products/ProductForm.vue'; // Used for create/edit
import MyProfile from '@/views/ClientPages/MyProfile.vue'; 

// Clients (from src/views/ClientPages/ and src/components/Clients/)
import Clients from '@/views/ClientPages/Clients.vue';
import ClientDetails from '@/views/ClientPages/ClientDetails.vue';
import ClientForm from '@/components/Clients/ClientForm.vue';

// Invoices (from src/views/InvoicePages/ and src/components/Invoices/)
import Invoices from '@/views/InvoicePages/Invoices.vue';
import InvoiceDetails from '@/views/InvoicePages/InvoiceDetails.vue';
import InvoiceForm from '@/components/Invoices/InvoiceForm.vue';
import MyOrders from '@/views/ClientPages/MyOrders.vue';

// Supplies (from src/views/SupplyPages/ and src/components/Supplies/)
import Supplies from '@/views/SupplyPages/Supplies.vue';
import SupplyDetails from '@/views/SupplyPages/SupplyDetails.vue';
import SupplyForm from '@/components/Supplies/SupplyForm.vue';

// Shippings (from src/views/ShippingPages/ and src/components/Shippings/)
import Shippings from '@/views/ShippingPages/Shippings.vue';
import ShippingDetails from '@/views/ShippingPages/ShippingDetails.vue';
// Note: ShippingStatusForm is a modal, used within Shippings.vue, not directly a route component

// Transactions (from src/views/TransactionPages/ and src/components/)
import Transactions from '@/views/TransactionPages/Transactions.vue';
import TransactionDetails from '@/views/TransactionPages/TransactionDetails.vue';
// Note: TransactionTable.vue is directly in src/components/

// Employee Management (Renamed from Users)
import Employees from '@/views/EmployeesPages/Employees.vue';
import EmployeeDetails from '@/views/EmployeesPages/EmployeeDetails.vue';
import EmployeeForm from '@/components/Employees/EmployeeForm.vue';

const routes = [
  { 
    path: '/login', 
    name: 'Login', 
    component: Login,
    meta: { guestOnly: true }
  },
  {
    path: '/register', 
    name: 'Register', 
    component: Register ,
    meta: { guestOnly: true }
  },
  { 
    path: '/forgot-password', 
    name: 'ForgotPassword', 
    component: ForgotPassword ,
    meta: { guestOnly: true }
  },
  { 
    path: '/reset-password', 
    name: 'ResetPassword', 
    component: ResetPassword,
    meta: { guestOnly: true }
  },
  {
    path: '/',
    component: SidebarLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Dashboard', component: Dashboard, meta: { requiredRoles: ['Admin', 'Manager', 'Client'] } },

      // Products & Categories
      { path: 'products', name: 'Products', component: Products, meta: { requiredRoles: ['Admin', 'Manager', 'Client'] } },
      { path: 'products/new', name: 'CreateProduct', component: ProductForm, meta: { requiredRoles: ['Admin', 'Manager'] } },
      { path: 'products/:id', name: 'ProductDetails', component: ProductDetails, props: true, meta: { requiredRoles: ['Admin', 'Manager', 'Client'] } },
      { path: 'products/:id/edit', name: 'EditProduct', component: ProductForm, props: true, meta: { requiredRoles: ['Admin', 'Manager'] } },

      // My Orders (Client Specific) - Accessible only to Client role
      { path: 'my-orders', name: 'MyOrders', component: MyOrders, meta: { requiredRoles: ['Client'] } },
      { path: 'my-orders/:id', name: 'MyOrderDetails', component: InvoiceDetails, props: true, meta: { requiredRoles: ['Client'] } }, // Client views their own invoice details

      
      // My Profile (Client Specific) - Accessible only to Client role
      { path: 'my-profile', name: 'MyProfile', component: MyProfile, meta: { requiredRoles: ['Client'] } },

      // Clients
      { path: 'clients', name: 'Clients', component: Clients, meta: { requiredRoles: ['Admin', 'Manager', 'Client'] } },
      { path: 'clients/new', name: 'CreateClient', component: ClientForm, meta: { requiredRoles: ['Admin', 'Manager'] } },
      { path: 'clients/:id', name: 'ClientDetails', component: ClientDetails, props: true, meta: { requiredRoles: ['Admin', 'Manager', 'Client'] } },
      { path: 'clients/:id/edit', name: 'EditClient', component: ClientForm, props: true, meta: { requiredRoles: ['Admin', 'Manager'] } },

      // Invoices
      { path: 'invoices', name: 'Invoices', component: Invoices, meta: { requiredRoles: ['Admin', 'Manager',] } },
      { path: 'invoices/new', name: 'CreateInvoice', component: InvoiceForm, meta: { requiredRoles: ['Admin', 'Manager',] } },
      { path: 'invoices/:id', name: 'InvoiceDetails', component: InvoiceDetails, props: true, meta: { requiredRoles: ['Admin', 'Manager',] } },
      { path: 'invoices/:id/edit', name: 'EditInvoice', component: InvoiceForm, props: true, meta: { requiredRoles: ['Admin', 'Manager'] } },

      // Supplies
      { path: 'supplies', name: 'Supplies', component: Supplies, meta: { requiredRoles: ['Admin', 'Manager', ] } },
      { path: 'supplies/new', name: 'CreateSupply', component: SupplyForm, meta: { requiredRoles: ['Admin', 'Manager', ] } },
      { path: 'supplies/:id', name: 'SupplyDetails', component: SupplyDetails, props: true, meta: { requiredRoles: ['Admin', 'Manager', ] } },
      { path: 'supplies/:id/edit', name: 'EditSupply', component: SupplyForm, props: true, meta: { requiredRoles: ['Admin', 'Manager'] } },

      // Shippings
      { path: 'shippings', name: 'Shippings', component: Shippings, meta: { requiredRoles: ['Admin', 'Manager', ] } },
      { path: 'shippings/:invoiceId/details', name: 'ShippingDetails', component: ShippingDetails, props: true, meta: { requiredRoles: ['Admin', 'Manager', ] } },

      // Transactions
      { path: 'transactions', name: 'Transactions', component: Transactions, meta: { requiredRoles: ['Admin', 'Manager'] } },
      { path: 'transactions/:id', name: 'TransactionDetails', component: TransactionDetails, props: true, meta: { requiredRoles: ['Admin', 'Manager'] } },

      // Employee Management (Renamed from Users)
      { path: 'employees', name: 'Employees', component: Employees, meta: { requiredRoles: ['Admin'] } },
      { path: 'employees/new-manager', name: 'CreateManager', component: EmployeeForm, meta: { requiredRoles: ['Admin'] } },
      {
        path: 'employees/:id',
        name: 'EmployeeDetails',
        component: EmployeeDetails,
        props: true,
        meta: { requiredRoles: ['Admin', 'Manager', ] }
      },
      { path: 'employees/:id/edit', name: 'EditEmployee', component: EmployeeForm, props: true, meta: { requiredRoles: ['Admin', 'Manager', 'Staff'] } },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: to => {
      const auth = useAuth();
      return auth.isAuthenticated.value ? { name: 'Dashboard' } : { name: 'Login' };
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// router.beforeEach((to, from, next) => {
//   const auth = useAuth();
//   const isAuthenticated = auth.isAuthenticated.value;

//   const publicRoutes = ['Login', 'Register', 'ForgotPassword', 'ResetPassword'];
//   const isPublicRoute = publicRoutes.includes(to.name);

//   if (to.meta.requiresAuth && !isAuthenticated) {
//     next({ name: 'Login' });
//   } else if (isAuthenticated && isPublicRoute) {
//     next({ name: 'Dashboard' });
//   } else if (isAuthenticated && to.meta.requiredRoles) {
//     if (!auth.hasAnyRole(to.meta.requiredRoles)) {
//       alert('Access Denied: You do not have permission to access this page.');
//       if (from.path === '/' || !from.name) { 
//          next({ name: 'Dashboard' });
//       } else {
//          next(from.path);
//       }
//     } else {
//       next();
//     }
//   } else {
//     next();
//   }
// });


router.beforeEach((to,from,next) => {
  const { isAuthenticated, hasAnyRole } = useAuth();

  //1) If route requires login
  if(to.meta.requiresAuth){
    if(!isAuthenticated.value){
      return next({ name: 'Login' });
    }

    //2) If you declared requiredRoles on this route..
    const requiredRoles = to.meta.requiredRoles ?? [];
    if(requiredRoles > 0){
      if(hasAnyRole(requiredRoles)){
        return next();
      } else {
        alert('Access Denies: You do not have permission to access this page.');
        return next(from.name ? { name: from.name } : { name: 'Dashboard' });
      }
    }

    //3) No roles specified -> just proceed
    return next();
  }

    // Routes only for guests…
    if(to.meta.guestOnly){
      if(isAuthenticated.value){
        return next({name: 'Dashboard'});
      }
      return next();
    }

    // Anything else -> proceed
    next();
});


//qikjo posht previously
// router.beforeEach((to, from, next) => {
//   const { isAuthenticated, hasAnyRole } = useAuth(); // Get auth state and role checker

//   // If the route requires authentication
//   if (to.meta.requiresAuth) {
//     if (!isAuthenticated.value) {
//       // User is not authenticated, redirect to login
//       next({ name: 'Login' });
//     } else {
//       // User is authenticated, check roles
//       if (to.meta.roles && to.meta.roles.length > 0) {
//         if (hasAnyRole(to.meta.roles)) {
//           next(); // User has required role, proceed
//         } else {
//           // User is authenticated but doesn't have required role
//           alert('Access Denied: You do not have permission to access this page.');
//           next(from.name ? { name: from.name } : { name: 'Dashboard' }); // Go back or to dashboard
//         }
//       } else {
//         next(); // Route requires auth but no specific roles are defined, proceed
//       }
//     }
//   }
//   // If the route is only for guests (unauthenticated users)
//   else if (to.meta.guestOnly) {
//     if (isAuthenticated.value) {
//       // User is authenticated, redirect to dashboard
//       next({ name: 'Dashboard' });
//     } else {
//       next(); // Not authenticated, proceed
//     }
//   }
//   // No specific meta requiresAuth or guestOnly
//   else {
//     next(); // Simply proceed
//   }
// });

export default router;


// space


// import { createRouter, createWebHistory } from 'vue-router'
// import { useAuth } from '@/composables/useAuth'
// import HomeView from '../views/HomeView.vue'
// import Login from '@/views/AuthPages/Login.vue'
// import Register from '@/views/AuthPages/Register.vue'
// import ForgotPassword from '@/views/AuthPages/ForgotPassword.vue'
// import ResetPassword from '@/views/AuthPages/ResetPassword.vue'

// import SidebarLayout from '@/layouts/SidebarLayout.vue'

// import Dashboard from '@/views/Dashboard.vue'

// import Products from '@/views/ProductPages/Products.vue'
// import ProductDetails from '@/views/ProductPages/ProductDetails.vue'

// import Supplies from '@/views/SupplyPages/Supplies.vue'
// import SupplyDetails from '@/views/SupplyPages/SupplyDetails.vue';

// import Invoices from '@/views/InvoicePages/Invoices.vue'
// import InvoiceDetails from '@/views/InvoicePages/InvoiceDetails.vue';
// import InvoiceForm from '@/components/Invoices/InvoiceForm.vue';


// import Clients from '@/views/ClientPages/Clients.vue';
// import ClientDetails from '@/views/ClientPages/ClientDetails.vue';
// import ClientForm from '@/components/Clients/ClientForm.vue';

// import Shippings from '@/views/ShippingPages/Shippings.vue';
// import ShippingDetails from '@/views/ShippingPages/ShippingDetails.vue';

// import Transactions from '@/views/TransactionPages/Transactions.vue'; 
// import TransactionDetails from '@/views/TransactionPages/TransactionDetails.vue';

// import Employees from '@/views/EmployeesPages/Employees.vue'; 
// import EmployeeDetails from '@/views/EmployeesPages/EmployeeDetails.vue';

// const routes = [
//   // {
//   //   path: '/',
//   //   name: 'home',
//   //   component: HomeView
//   // },
//   { path: '/login', component: Login },
//   { path: '/register', component: Register },
//   { path: '/forgot-password', component: ForgotPassword },
//   { path: '/reset-password', component: ResetPassword },
//   {
//     path: '/',
//     component: SidebarLayout,
//     meta: { requiresAuth: true },
//     children: [
//       { 
//         path: '', 
//         component: Dashboard, 
//         name:'Dashboard', 
//         meta: { requiredRoles: ['Admin', 'Manager', 'Staff']} 
//       },
//       //Products
//       { 
//         path: 'products', 
//         component: Products,
//         name: 'Products',
//         meta: { requiredRoles: ['Admin', 'Manager', 'Staff'] }
//       },
//       {
//         path: 'products/:id', 
//         name: 'ProductDetails', 
//         component: ProductDetails,
//         props: true,
//         meta: { requiredRoles: ['Admin', 'Manager', 'Staff'] }
//       },
//       //Clients
//       { 
//         path: 'clients', 
//         name: 'Clients', 
//         component: Clients, 
//         meta: { requiredRoles: ['Admin', 'Manager', 'Staff'] } 
//       },
//       { 
//         path: 'clients/:id', 
//         name: 'ClientDetails', 
//         component: ClientDetails, 
//         props: true, 
//         meta: { requiredRoles: ['Admin', 'Manager', 'Staff'] } 
//       },
//       // Supplies Routes
//       { 
//         path: 'supplies', 
//         name: 'Supplies', 
//         component: Supplies, 
//         meta: { requiredRoles: ['Admin', 'Manager', 'Staff'] } 
//       },
//       { 
//         path: 'supplies/new', 
//         name: 'CreateSupply', 
//         component: SupplyForm, 
//         meta: { requiredRoles: ['Admin', 'Manager', 'Staff'] } 
//       },
//       { path: 'supplies/:id', 
//         name: 'SupplyDetails', 
//         component: SupplyDetails, 
//         props: true, 
//         meta: { requiredRoles: ['Admin', 'Manager', 'Staff'] } 
//       },
//       { 
//         path: 'supplies/:id/edit', 
//         name: 'EditSupply', 
//         component: SupplyForm, 
//         props: true,
//         meta: { requiredRoles: ['Admin', 'Manager'] } 
//       },
//       { path: 'invoices', component: Invoices, name: 'Invoices' },
//       {
//         path: 'invoices/:id', 
//         name: 'InvoiceDetails',
//         component: InvoiceDetails,
//         props: true 
//       },
//       // Shippings Routes
//       { 
//         path: 'shippings', 
//         name: 'Shippings', 
//         component: Shippings, 
//         meta: { requiredRoles: ['Admin', 'Manager', 'Staff'] } 
//       },
//       // Note: ShippingDetails uses invoiceId as prop, ensure consistency in usage
//       { 
//         path: 'shippings/:invoiceId/details', 
//         name: 'ShippingDetails', 
//         component: ShippingDetails, 
//         props: true, 
//         meta: { requiredRoles: ['Admin', 'Manager', 'Staff'] } 
//       },
//       // Transactions Routes (Only Admin & Manager can view)
//       { 
//         path: 'transactions', 
//         name: 'Transactions', 
//         component: Transactions, 
//         meta: { requiredRoles: ['Admin', 'Manager'] } 
//       },
//       { 
//         path: 'transactions/:id', 
//         name: 'TransactionDetails', 
//         component: TransactionDetails, 
//         props: true, 
//         meta: { requiredRoles: ['Admin', 'Manager'] } 
//       },
//       //Employees routes
//       { 
//         path: 'employees', 
//         component: Users, 
//         name: 'Users' , 
//         meta: { requiredRoles: ['Admin'] }
//       }, // Main Users List
//       {
//         path: 'employees/:id',
//         name: 'UserDetails',
//         component: UserDetails,
//         props: true,
//         meta: { requiredRoles: ['Admin', 'Manager', 'Staff'] }
//       }
//     ]
//   },
//   { 
//     path: '/:pathMatch(.*)*', name: 'NotFound', redirect: '/'
//   }
// ]

// const routes = [
//   { path: '/login', name: 'Login', component: Login },
//   { path: '/register', name: 'Register', component: Register },
//   { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },
//   { path: '/reset-password', name: 'ResetPassword', component: ResetPassword },
//   {
//     path: '/',
//     component: SidebarLayout,
//     meta: { requiresAuth: true }, 
//     children: [
//       { path: '', name: 'Dashboard', component: Dashboard, meta: { requiredRoles: ['Admin', 'Manager', 'Staff'] } },

//       { path: 'products', name: 'Products', component: Products, meta: { requiredRoles: ['Admin', 'Manager', 'Staff'] } },
//       { path: 'products/:id', name: 'ProductDetails', component: ProductDetails, props: true, meta: { requiredRoles: ['Admin', 'Manager', 'Staff'] } },
//       { path: 'clients', name: 'Clients', component: Clients, meta: { requiredRoles: ['Admin', 'Manager', 'Staff'] } },
//       { path: 'clients/new', name: 'CreateClient', component: ClientForm, meta: { requiredRoles: ['Admin', 'Manager'] } }, 
//       { path: 'clients/:id', name: 'ClientDetails', component: ClientDetails, props: true, meta: { requiredRoles: ['Admin', 'Manager', 'Staff'] } },
//       { path: 'clients/:id/edit', name: 'EditClient', component: ClientForm, props: true, meta: { requiredRoles: ['Admin', 'Manager'] } }, 
//       { path: 'invoices', name: 'Invoices', component: Invoices, meta: { requiredRoles: ['Admin', 'Manager', 'Staff'] } },
//       { path: 'invoices/new', name: 'CreateInvoice', component: InvoiceForm, meta: { requiredRoles: ['Admin', 'Manager', 'Staff'] } },
//       { path: 'invoices/:id', name: 'InvoiceDetails', component: InvoiceDetails, props: true, meta: { requiredRoles: ['Admin', 'Manager', 'Staff'] } },
//       { path: 'invoices/:id/edit', name: 'EditInvoice', component: InvoiceForm, props: true, meta: { requiredRoles: ['Admin', 'Manager'] } },

//       { path: 'supplies', name: 'Supplies', component: Supplies, meta: { requiredRoles: ['Admin', 'Manager', 'Staff'] } },
//       { path: 'supplies/new', name: 'CreateSupply', component: SupplyForm, meta: { requiredRoles: ['Admin', 'Manager', 'Staff'] } }, 
//       { path: 'supplies/:id', name: 'SupplyDetails', component: SupplyDetails, props: true, meta: { requiredRoles: ['Admin', 'Manager', 'Staff'] } },
//       { path: 'supplies/:id/edit', name: 'EditSupply', component: SupplyForm, props: true, meta: { requiredRoles: ['Admin', 'Manager'] } }, 
//       { path: 'shippings', name: 'Shippings', component: Shippings, meta: { requiredRoles: ['Admin', 'Manager', 'Staff'] } },
//       { path: 'shippings/:invoiceId/details', name: 'ShippingDetails', component: ShippingDetails, props: true, meta: { requiredRoles: ['Admin', 'Manager', 'Staff'] } },
//       { path: 'transactions', name: 'Transactions', component: Transactions, meta: { requiredRoles: ['Admin', 'Manager'] } },
//       { path: 'transactions/:id', name: 'TransactionDetails', component: TransactionDetails, props: true, meta: { requiredRoles: ['Admin', 'Manager'] } },
//       { path: 'employees', name: 'Employees', component: Employees, meta: { requiredRoles: ['Admin'] } }, 
//       { path: 'employees/new-manager', name: 'CreateManager', component: EmployeeForm, meta: { requiredRoles: ['Admin'] } },
//       {
//         path: 'employees/:id', 
//         name: 'EmployeeDetails',
//         component: EmployeeDetails,
//         props: true,
//         meta: { requiredRoles: ['Admin', 'Manager', 'Staff'] }
//       },
//       { path: 'employees/:id/edit', name: 'EditEmployee', component: EmployeeForm, props: true, meta: { requiredRoles: ['Admin', 'Manager', 'Staff'] } },

//     ]
//   },
//   {
//     path: '/:pathMatch(.*)*',
//     name: 'NotFound',
//     redirect: to => {
//       const auth = useAuth();
//       return auth.isAuthenticated.value ? { name: 'Dashboard' } : { name: 'Login' };
//     }
//   }
// ];

// const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
//   routes
// })

// router.beforeEach((to, from, next) => {
//   const auth = useAuth();
//   const isAuthenticated = auth.isAuthenticated.value;

//   const publicRoutes = ['Login', 'Register', 'ForgotPassword', 'ResetPassword'];
//   const isPublicRoute = publicRoutes.includes(to.name);

//   if (to.meta.requiresAuth && !isAuthenticated) {
//     next({ name: 'Login' });
//   } else if (isAuthenticated && isPublicRoute) {
//     next({ name: 'Dashboard' });
//   } else if (isAuthenticated && to.meta.requiredRoles) { 
//     if (!auth.hasAnyRole(to.meta.requiredRoles)) {
//       alert('Access Denied: You do not have permission to access this page.');
//       if (from.path === '/' || !from.path.startsWith('/')) { 
//          next({ name: 'Dashboard' });
//       } else {
//          next(from.path); 
//       }
//     } else {
//       next(); 
//     }
//   } else {
//     next();
//   }
// });

// space

// router.beforeEach((to, from, next) => {
//   const auth = useAuth();
//   const isAuthenticated = auth.isAuthenticated.value;
//   const userRole = auth.userRole.value;

//   // Public routes (login, register, forgot-password, reset-password)
//   const publicRoutes = ['Login', 'Register', 'ForgotPassword', 'ResetPassword'];
//   const isPublicRoute = publicRoutes.includes(to.name);

//   if (to.meta.requiresAuth && !isAuthenticated) {
//     // If route requires auth and user is not authenticated, redirect to login
//     next({ name: 'Login' });
//   } else if (isAuthenticated && isPublicRoute) {
//     // If user is authenticated and tries to go to a public route, redirect to dashboard
//     next({ name: 'Dashboard' });
//   } else if (to.meta.requiredRoles) {
//     // If route has required roles and user is authenticated, check roles
//     if (!auth.hasAnyRole(to.meta.requiredRoles)) {
//       // User is authenticated but doesn't have the required role
//       alert('Access Denied: You do not have permission to view this page.'); // Consider a more user-friendly modal/toast
//       next(from.path === '/' ? { name: 'Dashboard' } : from.path); // Redirect back or to dashboard
//     } else {
//       next(); // Role is authorized, proceed
//     }
//   } else {
//     // No specific auth/role requirements, or handled by previous conditions
//     next();
//   }
// });

//----

// router.beforeEach((to, from, next) => {
//   // const token = localStorage.getItem('token')
//   const auth = useAuth()

//   if (to.meta.requiresAuth && !auth.token.value) {
//     next('/login')
//   } else {
//     next()
//   }
// })

// export default router