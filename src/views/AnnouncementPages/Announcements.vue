<template>
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">Announcements</h1>
  
      <!-- Button to create new announcement (visible only to Admin/Manager) -->
      <div v-if="hasAnyRole(['Admin', 'Manager'])" class="mb-6 text-right">
        <router-link
          :to="{ name: 'CreateAnnouncement' }"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <i class="fas fa-plus-circle mr-2"></i> Create New Announcement
        </router-link>
      </div>
  
      <div v-if="isLoading" class="text-center text-gray-500">Loading announcements...</div>
      <div v-else-if="errorMessage" class="text-red-600 text-center p-4 bg-red-100 border border-red-200 rounded-md">
        {{ errorMessage }}
      </div>
      <div v-else-if="announcements.length === 0" class="text-center text-gray-500 p-4 bg-gray-50 rounded-md">
        No announcements found.
      </div>
      <div v-else class="space-y-6">
        <div
          v-for="announcement in announcements"
          :key="announcement.id"
          class="bg-white shadow-md rounded-lg p-6 border border-gray-200"
        >
          <h2 class="text-2xl font-semibold text-gray-900 mb-2">{{ announcement.title }}</h2>
          <p class="text-gray-700 mb-4 whitespace-pre-wrap">{{ announcement.content }}</p>
          <div class="flex flex-wrap items-center text-sm text-gray-500">
            <span class="mr-4">
              <i class="fas fa-calendar-alt mr-1"></i> Published: {{ formatDate(announcement.published_at) }}
            </span>
            <span v-if="announcement.expires_at" class="mr-4">
              <i class="fas fa-hourglass-end mr-1"></i> Expires: {{ formatDate(announcement.expires_at) }}
            </span>
            <span v-if="announcement.creator" class="mr-4">
              <i class="fas fa-user mr-1"></i> By: {{ announcement.creator.name }}
            </span>
            <span v-if="!announcement.published_at || new Date(announcement.published_at) > new Date()" class="text-yellow-600">
              <i class="fas fa-clock mr-1"></i> Scheduled
            </span>
            <span v-else-if="announcement.expires_at && new Date(announcement.expires_at) < new Date()" class="text-red-600">
              <i class="fas fa-exclamation-circle mr-1"></i> Expired
            </span>
          </div>
          <!-- Admin/Manager actions (Edit/Delete) - You can add these later if needed -->
          <!-- <div v-if="hasAnyRole(['Admin', 'Manager'])" class="mt-4 flex space-x-2">
            <button @click="editAnnouncement(announcement.id)" class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
            <button @click="deleteAnnouncement(announcement.id)" class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
          </div> -->
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  import { useAnnouncements } from '@/composables/useAnnouncements';
  import { useAuth } from '@/composables/useAuth';
  
  const { announcements, isLoading, errorMessage, fetchAnnouncements } = useAnnouncements();
  const { hasAnyRole } = useAuth();
  
  onMounted(() => {
    fetchAnnouncements();
  });
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // You can add edit/delete functions here if you implement those features
  // const editAnnouncement = (id) => {
  //   // router.push({ name: 'EditAnnouncement', params: { id } });
  //   console.log('Edit announcement:', id);
  // };
  
  // const deleteAnnouncement = async (id) => {
  //   if (confirm('Are you sure you want to delete this announcement?')) {
  //     await deleteAnnouncement(id); // Call the delete function from useAnnouncements
  //     fetchAnnouncements(); // Refresh the list
  //   }
  // };
  </script>
  
  <style scoped>
  /* Add specific styles if needed */
  </style>