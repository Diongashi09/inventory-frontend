<template>
    <div class="bg-white shadow-md rounded-lg p-6">
      <h3 class="text-lg font-semibold mb-2 text-gray-700">{{ title }}</h3>
      <p class="text-3xl font-bold text-indigo-600">{{ value }}</p>
      <p v-if="description" class="text-sm text-gray-500 mt-2">{{ description }}</p>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
  });
  </script>
  
  <style scoped>
  /* No specific styles needed, Tailwind handles it */
  </style>
  