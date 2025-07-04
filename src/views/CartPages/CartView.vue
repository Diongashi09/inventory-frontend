<template>
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">Your Shopping Cart</h1>
  
      <div v-if="cartItems.length === 0" class="text-center text-gray-500 p-4 bg-gray-50 rounded-md">
        Your cart is empty. <router-link :to="{ name: 'ClientProductList' }" class="text-indigo-600 hover:underline">Start shopping!</router-link>
      </div>
      <div v-else class="bg-white shadow-md rounded-lg p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in cartItems" :key="item.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${{ item.price_incl_vat.toFixed(2) }} / {{ item.unit }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <input
                    type="number"
                    min="1"
                    v-model.number="item.quantity"
                    @change="updateCartItemQuantity(item.id, item.quantity)"
                    class="w-20 p-2 border border-gray-300 rounded-md text-center text-sm"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  ${{ (item.price_incl_vat * item.quantity).toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="removeFromCart(item.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <div class="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-900">Cart Total: ${{ cartTotalPrice.toFixed(2) }}</h2>
          <div>
            <button
              @click="clearCart"
              class="mr-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 shadow-sm transition duration-200"
            >
              Clear Cart
            </button>
            <router-link
              :to="{ name: 'CheckoutView' }"
              class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-sm transition duration-200"
            >
              Proceed to Checkout <i class="fas fa-arrow-right ml-2"></i>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useCart } from '@/composables/useCart';
  
  const { cartItems, cartTotalItems, cartTotalPrice, updateCartItemQuantity, removeFromCart, clearCart } = useCart();
  </script>
  
  <style scoped>
  /* Add specific styles if needed */
  </style>
  