<template>
  <div class="bg-white shadow-md rounded-lg p-4">
    <div v-if="products.length === 0" class="text-center py-8 text-gray-500">
      <p>No products found. Start by creating a new one!</p>
    </div>
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Stock per Unit</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price (Excl. VAT)</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price (Incl. VAT)</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="product in products"
            :key="product.id"
            class="hover:bg-gray-50 cursor-pointer"
            @click="goToProductDetails(product.id)"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ product.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.category?.name || 'N/A' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{{ product.stock_quantity }} - {{ product.unit }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">${{ Number(product.price_excl_vat).toFixed(2) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">${{ Number(product.price_incl_vat).toFixed(2) }}</td>
            <!-- <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.unit }}</td> -->
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" @click.stop>
              <button
                v-if="hasAnyRole(['Admin', 'Manager'])"
                @click.stop="$emit('edit', product)"
                class="text-indigo-600 hover:text-indigo-900 mr-4"
              >
                Edit
              </button>
              <button
                v-if="hasRole('Admin')"
                @click.stop="$emit('delete', product)"
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { hasRole, hasAnyRole } = useAuth()

const props = defineProps({
  products: { type: Array, required: true }
})

const emit = defineEmits(['edit', 'delete'])

function goToProductDetails(id) {
  router.push({ name: 'ProductDetails', params: { id } })
}
</script>

<style scoped>
/* You can add scoped styles here if needed */
</style>


<!-- <template>
  <table class="w-full table-auto border-collapse">
    <thead class="bg-gray-100">
      <tr>
        <th class="p-2 text-left">ID</th>
        <th class="p-2 text-left">Name</th>
        <th class="p-2 text-left">Category</th>
        <th class="p-2 text-center">Stock</th>
        <th class="p-2 text-right">Price (Excl. VAT)</th>
        <th class="p-2 text-right">Price (Incl. VAT)</th>
        <th class="p-2 text-left">Unit</th>
        <th class="p-2 text-center w-[160px]">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="product in products"
        :key="product.id"
        class="border-t hover:bg-gray-50 cursor-pointer"
        @click="goToProductDetails(product.id)"
      >
        <td class="p-2 font-medium text-left">{{ product.id }}</td>
        <td class="p-2 text-left">{{ product.name }}</td>
        <td class="p-2 text-left">{{ product.category?.name || 'N/A' }}</td>
        <td class="p-2 text-center">{{ product.stock_quantity }}</td>
        <td class="p-2 text-right">${{ Number(product.price_excl_vat).toFixed(2) }}</td>
        <td class="p-2 text-right">${{ Number(product.price_incl_vat).toFixed(2) }}</td>
        <td class="p-2 text-left">{{ product.unit }}</td>
        <td class="p-2 flex items-center justify-center space-x-2 h-full" @click.stop>
          <button
            v-if="hasAnyRole(['Admin', 'Manager'])"
            class="px-2 py-1 text-xs bg-blue-400 text-white rounded-md hover:bg-blue-500 flex-shrink-0 w-[60px]"
            @click="$emit('edit', product)"
          >
            Edit
          </button>

          <button
            v-if="hasRole('Admin')"
            class="px-2 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 flex-shrink-0 w-[60px]"
            @click="$emit('delete', product)"
          >
            Delete
          </button>
        </td>
      </tr>
      <tr v-if="products.length === 0">
        <td colspan="8" class="p-4 text-center text-gray-500">No products found.</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth'; // Absolute path

const router = useRouter();
const { hasRole, hasAnyRole } = useAuth(); // Destructure helpers

const props = defineProps({
  products: { type: Array, required: true }
});

const emit = defineEmits(['edit', 'delete']);

function goToProductDetails(id) {
  router.push({ name: 'ProductDetails', params: { id: id } });
}
</script>

<style scoped>
</style> -->



<!-- <template>
  <table class="w-full table-auto border-collapse">
    <thead class="bg-gray-100">
      <tr>
        <th class="p-2 text-left">Name</th>
        <th class="p-2 text-left">Category</th>
        <th class="p-2 text-right">Stock</th>
        <th class="p-2 text-right">Price</th>
        <th class="p-2 text-right">Price Incl VAT</th>
        <th class="p-2 text-right">VAT Rate</th>
        <th class="p-2 text-left">Unit</th>
        <th class="p-2 text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="p in products"
        :key="p.id"
        class="border-t hover:bg-gray-50 cursor-pointer" 
        @click="goToProductDetails(p.id)" 
      >
        <td class="p-2">{{ p.name }}</td>
        <td class="p-2">{{ p.category?.name || '—' }}</td>
        <td class="p-2 text-right">{{ p.stock_quantity }}</td> -->
        <!-- <td class="p-2 text-right">${{ p.price_excl_vat.toFixed(2) }}</td> -->
         <!-- <td class="p-2 text-right">${{ Number(p.price_excl_vat).toFixed(2) }}</td>
        <td class="p-2 text-right">
            ${{ Number(p.price_incl_vat).toFixed(2) }}
        </td> -->
        <!-- <td class="p-2 text-right">
            ${{ p.price_excl_vat != null ? Number(p.price_excl_vat).toFixed(2) : 'N/A' }}
        </td>
        <td class="p-2 text-right">
            ${{ p.price_incl_vat != null ? Number(p.price_incl_vat).toFixed(2) : 'N/A' }}
        </td>
        <td class="p-2 text-right">{{ p.vat_rate }}%</td>
        <td class="p-2">{{ p.unit }}</td>
        <td class="p-2 text-center space-x-2">
          <button
            class="px-2 py-1 text-sm bg-yellow-400 rounded"
            @click="$emit('edit', p)"
          >
            Edit
          </button>
          <button
            class="px-2 py-1 text-sm bg-red-500 text-white rounded"
            @click="$emit('delete', p.id)"
          >
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

defineProps({
    products: { type: Array, required: true }
})
defineEmits(['edit','delete'])

function goToProductDetails(productId) {
    router.push({ name: 'ProductDetails', params: { id: productId } });
}
</script>

<style>

</style> -->