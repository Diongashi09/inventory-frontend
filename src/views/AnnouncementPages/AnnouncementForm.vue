<template>
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">Create New Announcement</h1>
  
      <div class="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              id="title"
              v-model="form.title"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
  
          <div>
            <label for="content" class="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              id="content"
              v-model="form.content"
              rows="6"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            ></textarea>
          </div>
  
          <div>
            <label for="published_at" class="block text-sm font-medium text-gray-700">Publish Date & Time (Optional)</label>
            <input
              type="datetime-local"
              id="published_at"
              v-model="form.published_at"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <p class="mt-1 text-xs text-gray-500">Leave empty to publish immediately.</p>
          </div>
  
          <div>
            <label for="expires_at" class="block text-sm font-medium text-gray-700">Expiry Date & Time (Optional)</label>
            <input
              type="datetime-local"
              id="expires_at"
              v-model="form.expires_at"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <p class="mt-1 text-xs text-gray-500">Announcement will expire after this date.</p>
            <p v-if="dateError" class="mt-1 text-sm text-red-600">{{ dateError }}</p>
          </div>
  
          <div v-if="errorMessage" class="text-red-600 text-center p-3 bg-red-100 border border-red-200 rounded-md">
            {{ errorMessage }}
          </div>
          <div v-if="successMessage" class="text-green-600 text-center p-3 bg-green-100 border border-green-200 rounded-md">
            {{ successMessage }}
          </div>
  
          <button
            type="submit"
            :disabled="isLoading || dateError"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">Creating...</span>
            <span v-else>Create Announcement</span>
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAnnouncements } from '@/composables/useAnnouncements'; // Adjust path if needed
  
  const router = useRouter();
  const { createAnnouncement, isLoading, errorMessage, clearErrorMessage } = useAnnouncements();
  
  const successMessage = ref(null);
  
  const form = reactive({
    title: '',
    content: '',
    published_at: null,
    expires_at: null,
  });
  
  // Computed property for date validation
  const dateError = computed(() => {
    if (form.published_at && form.expires_at) {
      const published = new Date(form.published_at);
      const expires = new Date(form.expires_at);
      if (expires < published) {
        return 'Expiry date cannot be before the publish date.';
      }
    }
    return null;
  });
  
  // Watch for changes in form fields to clear messages
  watch(form, () => {
    clearErrorMessage();
    successMessage.value = null;
  }, { deep: true });
  
  const handleSubmit = async () => {
    if (dateError.value) {
      return; // Prevent submission if there's a date error
    }
  
    // Prepare payload, converting empty strings to null for nullable fields
    const payload = {
      title: form.title,
      content: form.content,
      published_at: form.published_at || null,
      expires_at: form.expires_at || null,
    };
  
    try {
      await createAnnouncement(payload);
      successMessage.value = 'Announcement created successfully!';
      // Optionally reset form after successful submission
      Object.assign(form, {
        title: '',
        content: '',
        published_at: null,
        expires_at: null,
      });
      // Redirect after a short delay
      setTimeout(() => {
        router.push({ name: 'Announcements' }); // Assuming you have a route named 'Announcements' for listing
      }, 2000);
    } catch (error) {
      // errorMessage is already set by useAnnouncements composable
      console.error("Failed to create announcement:", error);
    }
  };
  </script>
  
  <style scoped>
  /* Add specific styles if needed */
  </style>
  