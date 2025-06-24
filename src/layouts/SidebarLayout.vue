<template>
  <div class="flex min-h-screen bg-gray-100 text-gray-800">
    <Sidebar />
    <div class="flex-1 overflow-y-auto h-screen">
      <main class="p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
 import Sidebar from '@/components/Sidebar/Sidebar.vue'
</script>

<style>

</style>