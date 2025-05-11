<template>
  <div class="container mx-auto px-4 py-6 max-w-4xl">
    <!-- 今日日期與進度概要 -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg mb-6 p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          <i class="far fa-calendar-check text-indigo-600 dark:text-indigo-400 mr-2"></i>
          今日任務
        </h2>
        <div class="text-right">
          <p class="text-gray-600 dark:text-gray-300 font-medium">{{ formattedDate }}</p>
          <p class="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
            已完成 {{ completedCount }}/{{ totalTasks }} 項任務
          </p>
        </div>
      </div>
      
      <!-- 進度條 -->
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
        <div 
          class="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full transition-all duration-300" 
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
      
      <!-- 分類標籤 -->
      <div class="flex flex-wrap gap-2 mb-4">
        <button 
          v-for="filter in filters" 
          :key="filter.value"
          class="px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200"
          :class="[
            currentFilter === filter.value 
              ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-800 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-indigo-900 dark:hover:text-indigo-200'
          ]"
          @click="currentFilter = filter.value"
        >
          {{ filter.label }} ({{ getFilterCount(filter.value) }})
        </button>
      </div>
    </div>

    <!-- 錯誤訊息 -->
    <div 
      v-if="error"
      class="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative mb-6"
      role="alert"
    >
      <span class="block sm:inline">{{ error }}</span>
      <button
        class="absolute top-0 bottom-0 right-0 px-4 py-3"
        @click="error = null"
      >
        <i class="fas fa-times"></i>
      </button>
    </div>
    
    <!-- 載入中狀態 -->
    <div 
      v-if="loading"
      class="flex justify-center items-center py-8"
    >
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      <span class="ml-2 text-gray-600 dark:text-gray-300">載入中...</span>
    </div>

    <!-- 無任務提示 -->
    <div 
      v-else-if="filteredTasks.length === 0"
      class="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center"
    >
      <i class="far fa-calendar-check text-gray-400 dark:text-gray-600 text-4xl mb-4"></i>
      <p class="text-gray-600 dark:text-gray-300">
        {{ currentFilter === 'all' ? '今日暫無任務' : '無符合條件的任務' }}
      </p>
    </div>

    <!-- 任務列表 -->
    <div v-else class="space-y-4">
      <div 
        v-for="task in filteredTasks" 
        :key="task.id"
        class="task-list-item bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex items-center transition-all duration-300"
        :class="{ 'opacity-75': task.status === 'completed' }"
      >
        <div class="flex-1">
          <div class="flex items-center">
            <input 
              type="checkbox" 
              class="task-checkbox w-5 h-5 text-indigo-600 dark:text-indigo-500 rounded mr-3 cursor-pointer transition-colors duration-200"
              :checked="task.status === 'completed'"
              @change="toggleTaskStatus(task)"
            >
            <span 
              class="task-title text-lg font-medium transition-all duration-200"
              :class="[
                task.status === 'completed' 
                  ? 'text-gray-400 dark:text-gray-500 line-through' 
                  : 'text-gray-800 dark:text-gray-100'
              ]"
            >{{ task.title }}</span>
          </div>
          <p class="text-gray-500 dark:text-gray-400 mt-1 ml-8">
            <i class="far fa-clock mr-1"></i>今日 {{ formatTime(task.time) }}
          </p>
        </div>
        <div class="flex items-center">
          <div 
            class="px-3 py-1 rounded-full text-sm"
            :class="getStatusClass(task.status)"
          >
            {{ getStatusText(task.status) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { getTodayTasks, updateTaskStatus } from '../services/taskService';

export default {
  name: 'TodayTasks',
  
  setup() {
    const tasks = ref([]);
    const currentFilter = ref('all');
    const loading = ref(false);
    const error = ref(null);
    
    const filters = [
      { label: '全部', value: 'all' },
      { label: '待完成', value: 'pending' },
      { label: '已完成', value: 'completed' }
    ];

    const loadTasks = async () => {
      try {
        loading.value = true;
        error.value = null;
        tasks.value = await getTodayTasks();
      } catch (err) {
        console.error('載入今日任務失敗:', err);
        error.value = '載入任務失敗，請重新整理頁面';
      } finally {
        loading.value = false;
      }
    };

    const toggleTaskStatus = async (task) => {
      try {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        await updateTaskStatus(task.id, newStatus);
        await loadTasks(); // 重新載入任務列表
      } catch (err) {
        console.error('更新任務狀態失敗:', err);
        error.value = '更新任務狀態失敗';
      }
    };

    const filteredTasks = computed(() => {
      if (currentFilter.value === 'all') {
        return tasks.value;
      }
      return tasks.value.filter(task => task.status === currentFilter.value);
    });

    const completedCount = computed(() => 
      tasks.value.filter(task => task.status === 'completed').length
    );

    const totalTasks = computed(() => tasks.value.length);

    const progressPercentage = computed(() => 
      totalTasks.value ? (completedCount.value / totalTasks.value) * 100 : 0
    );

    const formattedDate = computed(() => {
      const date = new Date();
      const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 · 星期${weekdays[date.getDay()]}`;
    });

    const getFilterCount = (filterValue) => {
      if (filterValue === 'all') {
        return tasks.value.length;
      }
      return tasks.value.filter(task => task.status === filterValue).length;
    };

    const formatTime = (time) => {
      if (!time) return '未設定時間';
      return time;
    };

    const getStatusClass = (status) => {
      switch (status) {
        case 'completed':
          return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
        case 'pending':
          return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
        default:
          return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
      }
    };

    const getStatusText = (status) => {
      switch (status) {
        case 'completed':
          return '已完成';
        case 'pending':
          return '待完成';
        default:
          return '未知狀態';
      }
    };

    // 每5分鐘重新載入一次任務，確保時間相關的顯示是最新的
    let intervalId;
    onMounted(() => {
      loadTasks();
      intervalId = setInterval(loadTasks, 300000);
    });

    onUnmounted(() => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    });

    return {
      tasks,
      currentFilter,
      filters,
      loading,
      error,
      filteredTasks,
      completedCount,
      totalTasks,
      progressPercentage,
      formattedDate,
      toggleTaskStatus,
      getFilterCount,
      formatTime,
      getStatusClass,
      getStatusText
    };
  }
};
</script>

<style scoped>
.task-list-item {
  transition: all 0.3s ease;
}

.task-list-item:hover {
  transform: translateX(5px);
}

.task-checkbox:checked + .task-title {
  text-decoration: line-through;
  color: #a0aec0;
}
</style> 