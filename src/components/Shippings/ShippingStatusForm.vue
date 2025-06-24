<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
    <div class="relative p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3 text-center">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Update Shipping Status</h3>
        <div class="mt-2 px-7 py-3">
          <label for="status" class="block text-sm font-medium text-gray-700 text-left mb-1">New Status</label>
          <select
            id="status"
            v-model="newStatus"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="Pending">Pending</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Delayed">Delayed</option>
            <option value="Exception">Exception</option>
          </select>

          <div v-if="errorMessage" class="text-red-600 text-sm mt-2">{{ errorMessage }}</div>
        </div>
        <div class="items-center px-4 py-3">
          <button
            @click="submitStatus"
            class="px-4 py-2 bg-indigo-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Update
          </button>
          <button
            @click="$emit('close')"
            class="mt-3 px-4 py-2 bg-white text-gray-700 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useShippings } from '@/composables/useShippings';

const props = defineProps({
  shippingId: {
    type: String,
    required: true,
  },
  currentStatus: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['close', 'statusUpdated']);

const { updateShippingStatus, errorMessage, clearErrorMessage } = useShippings();
const newStatus = ref(props.currentStatus);

const submitStatus = async () => {
  clearErrorMessage();
  await updateShippingStatus(props.shippingId, newStatus.value);
  if (!errorMessage.value) {
    emit('statusUpdated');
    emit('close');
  }
};

onMounted(() => {
  clearErrorMessage(); 
});
</script>

<style scoped>
</style>



<!-- <template>
  <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-sm">
      <h2 class="text-xl mb-4">Update Shipping Status</h2>
      <p class="mb-4 text-gray-700">For Invoice #<span class="font-semibold">{{ invoiceReference }}</span> (Tracking ID: <span class="font-semibold">{{ currentTrackingId }}</span>)</p>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">New Status</label>
        <select
          v-model="localStatus"
          required
          class="w-full border p-2 rounded"
        >
          <option value="on_delivery">On Delivery</option>
          <option value="delivered">Delivered</option>
        </select>
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
          type="button"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          @click="onSubmit"
        >
          Update
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  invoiceReference: { type: String, default: '' },
  currentTrackingId: { type: String, required: true }, 
  currentStatus: { type: String, default: 'pending' },
});

const emit = defineEmits(['save', 'cancel']);


const localStatus = ref('');

watch(
  () => props.currentStatus,
  (newStatus) => {
    localStatus.value = newStatus;
  },
  { immediate: true }
);

function onSubmit() {
  emit('save', {
    tracking_id: props.currentTrackingId, 
    status: localStatus.value, 
  });
}
</script>

<style scoped>
</style> -->