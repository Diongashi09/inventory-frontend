<template>
    <div class="bg-white shadow-md rounded-lg p-6">
      <h3 class="text-lg font-semibold mb-4 text-gray-700">{{ title }}</h3>
      <!-- Render canvas only if there's data, otherwise show a message -->
      <canvas :id="chartId" ref="chartCanvas" v-if="data && data.length > 0"></canvas>
      <p v-else class="text-center text-gray-500 py-4">No data available for this chart.</p>
    </div>
  </template>
  
  <script setup>
  import { onMounted, watch, ref, onUnmounted } from 'vue'; // FIX: Added onUnmounted import
  import Chart from 'chart.js/auto'; // Import Chart.js
  
  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    labels: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    backgroundColor: {
      type: Array,
      default: () => ['#4A90E2', '#50E3C2', '#F5A623', '#BD10E0', '#7ED321', '#9013FE'], // Default colors
    },
    borderColor: {
      type: Array,
      default: () => ['#3A80D2', '#40D3B2', '#E59613', '#AC00D0', '#6EC211', '#8003EE'], // Default colors
    },
  });
  
  const chartInstance = ref(null);
  const chartCanvas = ref(null); // Ref for the canvas element itself
  const chartId = ref(`bar-chart-${Math.random().toString(36).substring(7)}`); // Unique ID for canvas
  
  const renderChart = () => {
    // Get the canvas context
    const ctx = chartCanvas.value;
  
    // If there's no canvas element or no data, ensure chart is destroyed and exit
    if (!ctx || !props.data || props.data.length === 0 || !props.labels || props.labels.length === 0) {
      if (chartInstance.value) {
        chartInstance.value.destroy();
        chartInstance.value = null; // Explicitly nullify the instance
      }
      return;
    }
  
    // If a chart instance already exists, update its data
    if (chartInstance.value) {
      chartInstance.value.data.labels = props.labels;
      chartInstance.value.data.datasets[0].data = props.data;
      chartInstance.value.data.datasets[0].backgroundColor = props.backgroundColor;
      chartInstance.value.data.datasets[0].borderColor = props.borderColor;
      chartInstance.value.update(); // Update the existing chart
    } else {
      // Otherwise, create a new chart instance
      chartInstance.value = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: props.labels,
          datasets: [{
            label: props.title,
            data: props.data,
            backgroundColor: props.backgroundColor,
            borderColor: props.borderColor,
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // Allows chart to take available space
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: false, // No need for legend if only one dataset
            }
          }
        },
      });
    }
  };
  
// const renderChart = () => {
//   const canvas = chartCanvas.value;
//   if (!canvas || !canvas.getContext) return;

//   const ctx = canvas.getContext('2d');
//   if (!ctx || !props.labels || !props.data || props.labels.length === 0 || props.data.length === 0) {
//     if (chartInstance.value) {
//       chartInstance.value.destroy();
//       chartInstance.value = null;
//     }
//     return;
//   }

//   if (chartInstance.value) {
//     chartInstance.value.data.labels = props.labels;
//     chartInstance.value.data.datasets[0].data = props.data;
//     chartInstance.value.update();
//   } else {
//     chartInstance.value = new Chart(ctx, {
//       type: 'bar', // or 'line'
//       data: {
//         labels: props.labels,
//         datasets: [{
//           label: props.title,
//           data: props.data,
//           backgroundColor: props.backgroundColor,
//           borderColor: props.borderColor,
//           borderWidth: 1,
//           fill: props.fill ?? false
//         }],
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         scales: {
//           y: { beginAtZero: true }
//         },
//         plugins: {
//           legend: { display: false }
//         }
//       }
//     });
//   }
// };


  onMounted(() => {
    renderChart();
  });
  
  // Watch for changes in the canvas ref (when v-if makes it available) or data/labels
  watch([chartCanvas, () => props.data, () => props.labels], () => {
    renderChart();
  }, { deep: true, flush: 'post' });
  
  // Clean up chart instance when component is unmounted to prevent memory leaks
  onUnmounted(() => {
    if (chartInstance.value) {
      chartInstance.value.destroy();
      chartInstance.value = null;
    }
  });
  </script>
  
  <style scoped>
  canvas {
    max-height: 300px; /* Limit chart height */
    width: 100% !important; /* Ensure it takes full width */
    height: auto !important; /* Adjust height automatically */
  }
  </style>
  