<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Manage Product Categories</h2>
          <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 text-2xl leading-none">
            &times;
          </button>
        </div>
  
        <div class="mb-6 border-b pb-4">
          <h3 class="text-lg font-medium mb-3">Add New Category</h3>
          <form @submit.prevent="addNewCategory" class="flex gap-2">
            <input
              type="text"
              v-model="newCategoryName"
              placeholder="Category Name"
              class="flex-grow border px-3 py-2 rounded-md text-sm"
              required
            />
            <button
              type="submit"
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              :disabled="isSavingCategory"
            >
              {{ isSavingCategory ? 'Adding...' : 'Add Category' }}
            </button>
          </form>
          <p v-if="addCategoryError" class="text-red-500 text-sm mt-2">{{ addCategoryError }}</p>
        </div>
  
        <div>
          <h3 class="text-lg font-medium mb-3">Existing Categories</h3>
          <ul v-if="localCategories.length" class="space-y-2 max-h-60 overflow-y-auto pr-2">
            <li
              v-for="cat in localCategories"
              :key="cat.id"
              class="flex justify-between items-center bg-gray-50 p-2 rounded-md"
            >
              <span>{{ cat.name }}</span>
              <button
                @click="requestDeleteCategory(cat)"
                class="text-red-600 hover:text-red-800"
                :disabled="isDeletingCategory === cat.id"
              >
                {{ isDeletingCategory === cat.id ? 'Deleting...' : 'Delete' }}
              </button>
            </li>
          </ul>
          <p v-else class="text-gray-600">No categories found.</p>
          <p v-if="deleteCategoryError" class="text-red-500 text-sm mt-2">{{ deleteCategoryError }}</p>
        </div>
  
        <div v-if="showCategoryDeleteConfirm" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div class="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <h2 class="text-lg font-semibold mb-4">Confirm Category Deletion</h2>
            <p>Are you sure you want to delete category "<span class="font-bold">{{ categoryToDelete?.name }}</span>"?</p>
            <div class="flex justify-end space-x-2 mt-6">
              <button @click="cancelCategoryDelete" class="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
              <button @click="confirmCategoryDelete" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import { useProducts } from '@/composables/useProducts'; // Use useProducts composable
  
  const props = defineProps({
    categories: {
      type: Array,
      required: true,
      default: () => [],
    },
  });
  
  const emit = defineEmits(['close', 'category-added', 'category-deleted']);
  
  const { createCategory, deleteCategory } = useProducts(); // Assuming these are now in useProducts
  
  const newCategoryName = ref('');
  const isSavingCategory = ref(false);
  const addCategoryError = ref(null);
  
  const localCategories = ref([...props.categories]); // Use a local ref for reactivity if categories are updated
  watch(() => props.categories, (newCategories) => {
    localCategories.value = [...newCategories];
  });
  
  const categoryToDelete = ref(null);
  const showCategoryDeleteConfirm = ref(false);
  const isDeletingCategory = ref(null); // To disable button during delete operation
  const deleteCategoryError = ref(null);
  
  async function addNewCategory() {
    addCategoryError.value = null;
    if (!newCategoryName.value.trim()) {
      addCategoryError.value = 'Category name cannot be empty.';
      return;
    }
    isSavingCategory.value = true;
    try {
      const newCat = await createCategory({ name: newCategoryName.value.trim() });
      // Assuming createCategory returns the new category object
      if (newCat && newCat.id) {
          localCategories.value.push(newCat); // Add to local list immediately for UI update
          newCategoryName.value = '';
          emit('category-added'); // Notify parent
      } else {
          throw new Error("Failed to add category: Invalid response from server.");
      }
    } catch (error) {
      addCategoryError.value = error.response?.data?.message || 'Failed to add category.';
      console.error("Error adding category:", error);
    } finally {
      isSavingCategory.value = false;
    }
  }
  
  function requestDeleteCategory(category) {
    categoryToDelete.value = category;
    showCategoryDeleteConfirm.value = true;
  }
  
  async function confirmCategoryDelete() {
    if (!categoryToDelete.value) return;
  
    isDeletingCategory.value = categoryToDelete.value.id; // Set ID to disable specific button
    deleteCategoryError.value = null;
  
    try {
      await deleteCategory(categoryToDelete.value.id);
      localCategories.value = localCategories.value.filter(
        (cat) => cat.id !== categoryToDelete.value.id
      );
      emit('category-deleted'); // Notify parent
    } catch (error) {
      deleteCategoryError.value = error.response?.data?.message || 'Failed to delete category.';
      console.error("Error deleting category:", error);
    } finally {
      showCategoryDeleteConfirm.value = false;
      categoryToDelete.value = null;
      isDeletingCategory.value = null; // Clear disabled state
    }
  }
  
  function cancelCategoryDelete() {
    showCategoryDeleteConfirm.value = false;
    categoryToDelete.value = null;
  }
  </script>
  
  <style scoped>
  /* Basic modal overlay and content styling for demonstration */
  /* You might already have global modal styles, adjust as needed */
  </style>