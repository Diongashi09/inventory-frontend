<template>
  <router-link
    v-if="hasRequiredRole"
    :to="to"
    class="w-full"
    :exact="exact"
    active-class="active-link"
    exact-active-class="active-link"
  >
    <div class="sidebar-link-base">
      <!-- Always render this div to reserve space, visibility toggled via class -->
      <div class="left-indicator" />
      
      <i :class="icon" class="icon" />
      <span class="label">
        {{ text }}
      </span>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue';
import { useAuth } from '@/composables/useAuth';

const props = defineProps({
  to: {
    type: [String, Object],
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  requiredRoles: {
    type: Array,
    default: () => [],        // If empty, visible to all authenticated users
  },
  exact: {
    type: Boolean,
    default: false,
  }
});

// Grab your role-checking helper
const { hasAnyRole } = useAuth();

const hasRequiredRole = computed(() => {
  // no roles required → show link
  if (!props.requiredRoles.length) {
    return true;
  }
  // otherwise only show if user has one of the requiredRoles
  return hasAnyRole(props.requiredRoles);
});
</script>

<style scoped>
.sidebar-link-base {
  @apply relative flex items-center gap-3 px-8 py-3 transition-colors hover:bg-gray-100 text-gray-800 rounded-md;
  padding-left: 1rem;
  position: relative;
}

/* The 5px indicator space - always rendered, just transparent unless active */
.left-indicator {
  width: 5px;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-color: transparent;
  transition: background-color 0.2s;
}

/* When the <router-link> is active, Tailwind’s classes get added */
.active-link {
  @apply bg-gray-100;
}
.active-link .left-indicator {
  background-color: #bfdbfe; /* Tailwind’s blue-200 */
}

.icon {
  @apply w-6 text-center text-gray-800;
}

.label {
  @apply font-medium text-gray-800;
}
</style>


<!-- <template>
  <router-link
    v-if="hasRequiredRole"
    :to="to"
    class="w-full"
    :exact="exact"
    active-class="active-link"
    exact-active-class="active-link"
  >
    <div class="sidebar-link-base">
      <div class="left-indicator" />
      
      <i :class="icon" class="icon" />
      <span class="label">
        {{ text }}
      </span>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue';
import { useAuth } from '@/composables/useAuth';

const props = defineProps({
  to: {
    type: Object,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  requiredRoles: {
    type: Array,
    default: () => [],
  },
  exact: {
    type: Boolean,
    default: false,
  }
});

const { hasAnyRole } = useAuth();

const hasRequiredRole = computed(() => {
  if (!props.requiredRoles || props.requiredRoles.length === 0) {
    return true;
  }
  return hasAnyRole(props.requiredRoles);
});
</script>

<style scoped>
.sidebar-link-base {
  @apply relative flex items-center gap-3 px-8 py-3 transition-colors hover:bg-gray-100 text-gray-800 rounded-md;
  padding-left: 2rem;
  position: relative;
  border-radius: 6px; 
}

.left-indicator {
  width: 5px;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-color: transparent;
  transition: background-color 0.2s;
}

.active-link {
  @apply bg-gray-100;
}

.active-link .left-indicator {
  background-color: #bfdbfe; 
}

.icon {
  @apply w-6 text-center text-gray-800;
}

.label {
  @apply font-medium text-gray-800;
}
</style> -->





//////////////

<!-- <template>
  <router-link
    v-if="hasRequiredRole"
    :to="to"
    class="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-100 rounded-md transition duration-200"
    :active-class="exact ? '' : 'bg-gray-100 text-white'"
    :exact-active-class="exact ? 'bg-gray-100 text-white' : ''"
  >
    <i :class="icon" class="w-6 mr-3 text-center"></i>
    <span>{{ text }}</span>
  </router-link>
</template>

<script setup>
import { computed } from 'vue';
import { useAuth } from '@/composables/useAuth';

const props = defineProps({
  to: {
    type: Object,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  requiredRoles: {
    type: Array,
    default: () => [],
  },
  exact: {
    type: Boolean,
    default: false,
  }
});

const { hasAnyRole } = useAuth();

const hasRequiredRole = computed(() => {
  if (!props.requiredRoles || props.requiredRoles.length === 0) {
    return true; // No roles required, visible to all authenticated users
  }
  return hasAnyRole(props.requiredRoles);
});
</script>

<style scoped>
/* No specific styles needed here as Tailwind handles most of it */
</style> -->


<!-- space -->

<!-- <template>
  <router-link
    :to="to"
    class="flex items-center gap-3 px-4 py-2 rounded"
    :class="{
      'hover:bg-gray-100': !isActive, 
      'bg-gray-100 font-semibold text-blue-700': isActive 
    }"
  >
    <img v-if="icon" :src="icon" class="w-5 h-5" alt="" />
    <span class="text-sm tracking-wide">{{ label }}</span>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  to: { type: String, required: true },
  label: { type: String, required: true },
  icon: { type: String, default: '' }
})

const route = useRoute()
const isActive = computed(() => {
  if (props.to === '') return route.path === '/'
  return route.path === '/' + props.to
})

</script> -->