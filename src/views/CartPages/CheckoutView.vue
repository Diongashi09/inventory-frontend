<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Checkout</h1>

    <div v-if="cartItems.length === 0" class="text-center text-gray-500 p-4 bg-gray-50 rounded-md">
      Your cart is empty. Please add items before checking out.
      <router-link :to="{ name: 'ClientProductList' }" class="text-indigo-600 hover:underline">
        Go to Shop
      </router-link>
    </div>

    <div v-else class="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
      <h2 class="text-2xl font-semibold mb-4">Order Summary</h2>
      <!-- ... your table ... -->

      <h2 class="text-2xl font-semibold mb-4">Shipping Information</h2>
      <form @submit.prevent="placeOrder" class="space-y-4">
        <div>
          <label for="shippingCompany" class="block text-sm font-medium text-gray-700">
            Shipping Company
          </label>
          <select
            id="shippingCompany"
            v-model="shippingDetails.shipping_company"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
          >
            <option disabled value="">Please select</option>
            <option value="FedEx">FedEx</option>
            <option value="DHL">DHL</option>
            <option value="UPS">UPS</option>
          </select>
        </div>

        <div v-if="orderErrorMessage" class="text-red-600 p-3 bg-red-100 rounded-md">
          {{ orderErrorMessage }}
        </div>
        <div v-if="orderSuccessMessage" class="text-green-600 p-3 bg-green-100 rounded-md">
          {{ orderSuccessMessage }}
        </div>

        <div class="flex justify-between items-center mt-6">
          <router-link :to="{ name: 'CartView' }" class="text-indigo-600 hover:underline">
            ← Back to Cart
          </router-link>
          <button
            type="submit"
            :disabled="isPlacingOrder || cartItems.length === 0"
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-md shadow-lg disabled:opacity-50"
          >
            <span v-if="isPlacingOrder">Placing Order…</span>
            <span v-else>Place Order</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '@/composables/useCart'
import { useOrders } from '@/composables/useOrders'

const router = useRouter()
const { cartItems, cartTotalPrice, clearCart } = useCart()
const { createOrder, isLoading: isPlacingOrder, errorMessage: orderErrorMessage } = useOrders()

const orderSuccessMessage = ref(null)

const shippingDetails = reactive({
  shipping_company: 'FedEx',
})

// compute shipping cost
const calculatedShippingCost = computed(() => {
  switch (shippingDetails.shipping_company) {
    case 'DHL': return 12.5
    case 'UPS': return 15
    default:    return 10
  }
})

const placeOrder = async () => {
  if (!shippingDetails.shipping_company) {
    orderErrorMessage.value = 'Please select a shipping company.'
    return
  }

  const payload = {
    items: cartItems.value.map(i => ({
      product_id: i.id,
      quantity:   i.quantity,
    })),
    shipping_company: shippingDetails.shipping_company,
    shipping_cost:    calculatedShippingCost.value,
  }

  // clear prior messages
  orderErrorMessage.value = null
  orderSuccessMessage.value = null

  try {
    const newOrder = await createOrder(payload)   // <-- now calls POST /orders

    if (newOrder?.reference_number) {
      orderSuccessMessage.value = `Order placed! Ref: ${newOrder.reference_number}`
      clearCart()
      setTimeout(() => router.push({ name: 'MyOrders' }), 2000)
    }
  } catch (e) {
    console.error(e)
  }
}
</script>


<!-- <template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Checkout</h1>

    <div v-if="cartItems.length === 0" class="text-center text-gray-500 p-4 bg-gray-50 rounded-md">
      Your cart is empty. Please add items before checking out.
      <router-link :to="{ name: 'ClientProductList' }" class="text-indigo-600 hover:underline">Go to Shop</router-link>
    </div>
    <div v-else class="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
      <h2 class="text-2xl font-semibold mb-4">Order Summary</h2>
      <div class="border border-gray-200 rounded-md mb-6 overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in cartItems" :key="item.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.quantity }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">${{ item.price_incl_vat.toFixed(2) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                ${{ (item.price_incl_vat * item.quantity).toFixed(2) }}
              </td>
            </tr>
          </tbody>
        </table>
        <div class="p-4 bg-gray-50 text-right font-bold text-lg text-gray-900">
          Total: ${{ cartTotalPrice.toFixed(2) }}
        </div>
      </div>

      <h2 class="text-2xl font-semibold mb-4">Shipping Information</h2>
      <form @submit.prevent="placeOrder" class="space-y-4">
        <div>
          <label for="shippingCompany" class="block text-sm font-medium text-gray-700">Shipping Company</label>
          <select
           id="shippingCompany"
           v-model="shippingDetails.shipping_company"
           class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
           >
            <option disabled value="">Please select</option>
            <option value="FedEx">FedEx</option>
            <option value="DHL">DHL</option>
            <option value="UPS">UPS</option>
          </select>
        </div>

        <div v-if="orderErrorMessage" class="text-red-600 text-center p-3 bg-red-100 border border-red-200 rounded-md">
          {{ orderErrorMessage }}
        </div>
        <div v-if="orderSuccessMessage" class="text-green-600 text-center p-3 bg-green-100 border border-green-200 rounded-md">
          {{ orderSuccessMessage }}
        </div>

        <div class="flex justify-between items-center mt-6">
          <router-link :to="{ name: 'CartView' }" class="text-indigo-600 hover:underline">
            <i class="fas fa-arrow-left mr-2"></i> Back to Cart
          </router-link>
          <button
            type="submit"
            :disabled="isPlacingOrder || cartItems.length === 0"
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-md shadow-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isPlacingOrder">Placing Order...</span>
            <span v-else>Place Order</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'; // Import computed
import { useRouter } from 'vue-router';
import { useCart } from '@/composables/useCart';
import { useInvoices } from '@/composables/useInvoices';

const router = useRouter();
const { cartItems, cartTotalPrice, clearCart } = useCart();
const { createInvoice, isLoading: isPlacingOrder, errorMessage: orderErrorMessage } = useInvoices();

const orderSuccessMessage = ref(null);

const shippingDetails = reactive({
  shipping_company: 'FedEx', // Default for initial selection
});

// Computed property to calculate shipping cost based on selected company
const calculatedShippingCost = computed(() => {
  switch (shippingDetails.shipping_company) {
    case 'DHL':
      return 12.5;
    case 'UPS':
      return 15;
    case 'FedEx':
    default:
      return 10;
  }
});

const placeOrder = async () => {
  if (cartItems.value.length === 0) {
    orderErrorMessage.value = 'Your cart is empty. Please add products before placing an order.';
    return;
  }
  
  if (!shippingDetails.shipping_company) {
    orderErrorMessage.value = 'Please select a shipping company before placing your order.';
    return;
  }

  const productsForInvoice = cartItems.value.map(item => ({
    id: item.id,
    quantity: item.quantity,
  }));
  
  const invoicePayload = {
    products: productsForInvoice,
    shipping_company: shippingDetails.shipping_company || null,
    shipping_cost: calculatedShippingCost.value, // Use the computed value here
  };
  
  orderSuccessMessage.value = null; // Clear previous success messages
  orderErrorMessage.value = null; // Clear previous error messages
  
  try {
    const response = await createInvoice(invoicePayload);

    const newInvoice = response?.invoice ?? response;

    if (newInvoice && newInvoice.reference_number){
        orderSuccessMessage.value = `Order placed successfully! Invoice Reference: ${newInvoice.reference_number}`
    }

    clearCart();

    setTimeout(()=>{
        router.push({name: 'MyOrders'});
    },2500)
  } catch (error) {
    console.error("Error placing order:", error);
  }
};
</script>

<style scoped>
</style> -->

<!-- //////////////////////  -->

<!-- <template>
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">Checkout</h1>
  
      <div v-if="cartItems.length === 0" class="text-center text-gray-500 p-4 bg-gray-50 rounded-md">
        Your cart is empty. Please add items before checking out.
        <router-link :to="{ name: 'ClientProductList' }" class="text-indigo-600 hover:underline">Go to Shop</router-link>
      </div>
      <div v-else class="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
        <h2 class="text-2xl font-semibold mb-4">Order Summary</h2>
        <div class="border border-gray-200 rounded-md mb-6 overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in cartItems" :key="item.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.quantity }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">${{ item.price_incl_vat.toFixed(2) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  ${{ (item.price_incl_vat * item.quantity).toFixed(2) }}
                </td>
              </tr>
            </tbody>
          </table>
          <div class="p-4 bg-gray-50 text-right font-bold text-lg text-gray-900">
            Total: ${{ cartTotalPrice.toFixed(2) }}
          </div>
        </div>
  
        <h2 class="text-2xl font-semibold mb-4">Shipping Information</h2>
        <form @submit.prevent="placeOrder" class="space-y-4">
          
          <div>
            <label for="shippingCompany" class="block text-sm font-medium text-gray-700">Shipping Company</label>
            <select
             id="shippingCompany"
             v-model="shippingDetails.shipping_company"
             class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
             >
              <option disabled value="">Please select</option>
              <option value="FedEx">FedEx</option>
              <option value="DHL">DHL</option>
              <option value="UPS">UPS</option>
            </select>
          </div>
  
          <div v-if="orderErrorMessage" class="text-red-600 text-center p-3 bg-red-100 border border-red-200 rounded-md">
            {{ orderErrorMessage }}
          </div>
          <div v-if="orderSuccessMessage" class="text-green-600 text-center p-3 bg-green-100 border border-green-200 rounded-md">
            {{ orderSuccessMessage }}
          </div>
  
          <div class="flex justify-between items-center mt-6">
            <router-link :to="{ name: 'CartView' }" class="text-indigo-600 hover:underline">
              <i class="fas fa-arrow-left mr-2"></i> Back to Cart
            </router-link>
            <button
              type="submit"
              :disabled="isPlacingOrder || cartItems.length === 0"
              class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-md shadow-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isPlacingOrder">Placing Order...</span>
              <span v-else>Place Order</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { useCart } from '@/composables/useCart';
  import { useInvoices } from '@/composables/useInvoices';
  
  const router = useRouter();
  const { cartItems, cartTotalPrice, clearCart } = useCart();
  const { createInvoice, isLoading: isPlacingOrder, errorMessage: orderErrorMessage } = useInvoices();
  
  const orderSuccessMessage = ref(null);
  
  const shippingDetails = reactive({
    shipping_company: '',
    shipping_cost: 0,
  });
  
const placeOrder = async () => {
  if (cartItems.value.length === 0) {
    orderErrorMessage.value = 'Your cart is empty. Please add products before placing an order.';
    return;
  }
  
  if (!shippingDetails.shipping_company) {
    orderErrorMessage.value = 'Please select a shipping company before placing your order.';
    return;
  }

  const productsForInvoice = cartItems.value.map(item => ({
    id: item.id,
    quantity: item.quantity,
  }));
  
  const invoicePayload = {
    products: productsForInvoice,
    shipping_company: shippingDetails.shipping_company || null,
    shipping_cost: shippingDetails.shipping_cost || 0,
    // customer_id will be automatically merged by InvoiceController if client is authenticated
   };
  
    orderSuccessMessage.value = null; // Clear previous success messages
    orderErrorMessage.value = null; // Clear previous error messages
  
    try {

    //   const newInvoice = await createInvoice(invoicePayload);
    //   orderSuccessMessage.value = `Order placed successfully! Invoice Reference: ${newInvoice.reference_number}`;
    //   clearCart(); // Clear the cart after successful order
    //   // Optionally redirect to My Orders page or invoice details
    //   setTimeout(() => {
    //     router.push({ name: 'MyOrders' });
    //   }, 2000);

        const response = await createInvoice(invoicePayload);

        const newInvoice = response?.invoice ?? response;

        if (newInvoice && newInvoice.reference_number){
            orderSuccessMessage.value = `Order placed successfully! Invoice Reference: ${newInvoice.reference_number}`
        }

        clearCart();

        setTimeout(()=>{
            router.push({name: 'MyOrders'});
        },2500)
    } catch (error) {
      // Error message is already set by useInvoices composable
      console.error("Error placing order:", error);
    }
  };
  </script>
  
  <style scoped>
  /* Add specific styles if needed */
  </style>
   -->