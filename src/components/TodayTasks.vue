<template>
  <div class="today-tasks" :class="{ 'dark': isDarkMode }">
    <div class="tasks-header">
      <h2>今日任務</h2>
    </div>
    
    <div class="tasks-list">
      <div v-for="task in sortedTasks" :key="task.id" class="task-list-item bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex items-center transition-all duration-300" :class="{ 'opacity-75': task.status === 'completed' }">
        <div class="flex-1">
          <div class="flex items-center">
            <input type="checkbox" class="task-checkbox w-5 h-5 text-indigo-600 dark:text-indigo-500 rounded mr-3 cursor-pointer" :checked="task.status === 'completed'" @change="toggleTaskStatus(task)">
            <span class="task-title text-lg font-medium" :class="[task.status === 'completed' ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-800 dark:text-gray-100']">{{ task.title }}</span>
            <div class="ml-3 flex items-center gap-2">
              <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">{{ getFrequencyText(task.frequencyType) }}</span>
              <span v-if="getFrequencyInfo(task)" class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">{{ getFrequencyInfo(task) }}</span>
            </div>
          </div>
          <p class="text-gray-500 dark:text-gray-400 mt-1 ml-8">
            <i class="far fa-clock mr-1"></i>今日 {{ formatTime(task.time) }}
          </p>
        </div>
        <div class="flex items-center">
          <div class="px-3 py-1 rounded-full text-sm" :class="getStatusClass(task.status)">{{ getStatusText(task.status) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useTaskStore } from '../stores/taskStore';
import { useThemeStore } from '../stores/themeStore';

export default {
  name: 'TodayTasks',
  
  setup() {
    const taskStore = useTaskStore();
    const themeStore = useThemeStore();

    const sortedTasks = computed(() => {
      return [...taskStore.todayTasks].sort((a, b) => {
        const timeA = a.time ? a.time.split(':').map(Number) : [24, 0];
        const timeB = b.time ? b.time.split(':').map(Number) : [24, 0];
        return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
      });
    });

    const isDarkMode = computed(() => themeStore.isDarkMode);

    const formatTime = (time) => {
      if (!time) return '未設定時間';
      return time;
    };

    const getFrequencyText = (type) => {
      const types = {
        daily: '每日',
        weekly: '每週',
        monthly: '每月',
        once: '單次'
      };
      return types[type] || '未知';
    };

    const getFrequencyInfo = (task) => {
      switch (task.frequencyType) {
        case 'weekly':
          return `週${task.weekdays.map(d => '日一二三四五六'[d]).join('、')}`;
        case 'monthly':
          return `每月 ${task.monthDays.join('、')} 日`;
        case 'daily':
          return '每天';
        default:
          return '';
      }
    };

    const completeTask = async (task) => {
      await taskStore.completeTask(task.id);
    };

    const toggleTaskStatus = async (task) => {
      await taskStore.toggleTaskStatus(task.id);
    };

    const getStatusClass = (status) => {
      const classes = {
        'completed': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
        'in-progress': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
        'not-started': 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
      };
      return classes[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
    };

    const getStatusText = (status) => {
      const texts = {
        'completed': '已完成',
        'in-progress': '進行中',
        'not-started': '未開始'
      };
      return texts[status] || '未知';
    };

    return {
      sortedTasks,
      isDarkMode,
      formatTime,
      getFrequencyText,
      getFrequencyInfo,
      completeTask,
      toggleTaskStatus,
      getStatusClass,
      getStatusText
    };
  }
};
</script>

<style scoped>
.today-tasks {
  padding: 1.5rem;
  background-color: #ffffff;
  min-height: 100vh;
  transition: all 0.3s ease;
}

.today-tasks.dark {
  background-color: #1a1a2e;
  color: #e1e1e1;
}

.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-list-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  gap: 1rem;
}

.dark .task-list-item {
  background-color: #2d4059;
}

.task-time {
  font-size: 0.9rem;
  color: #666;
  min-width: 80px;
}

.dark .task-time {
  color: #a0a0a0;
}

.task-content {
  flex: 1;
}

.task-content h3 {
  margin: 0;
  font-size: 1.1rem;
}

.task-meta {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.dark .task-meta {
  color: #a0a0a0;
}

.frequency-type {
  background-color: #e9ecef;
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  margin-right: 0.5rem;
}

.dark .frequency-type {
  background-color: #3d5a80;
}

.task-actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  background-color: #4a90e2;
  color: white;
  cursor: pointer;
}

.task-actions button.completed {
  background-color: #2ecc71;
}

.dark .task-actions button {
  background-color: #3d5a80;
}

.dark .task-actions button.completed {
  background-color: #2d6a4f;
}

@media (max-width: 768px) {
  .tasks-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style> 