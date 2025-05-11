<template>
  <div class="today-tasks" :class="{ 'dark': isDarkMode }">
    <div class="tasks-header">
      <h2>今日任務</h2>
    </div>
    
    <div class="tasks-list">
      <div v-for="task in sortedTasks" :key="task.id" class="task-item">
        <div class="task-time">{{ formatTime(task.executionTime) }}</div>
        <div class="task-content">
          <h3>{{ task.title }}</h3>
          <div class="task-meta">
            <span class="frequency-type">{{ getFrequencyText(task.frequencyType) }}</span>
            <span class="frequency-info">{{ getFrequencyInfo(task) }}</span>
          </div>
        </div>
        <div class="task-actions">
          <button @click="completeTask(task)" :class="{ 'completed': task.completed }">
            {{ task.completed ? '已完成' : '完成' }}
          </button>
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
        return new Date(a.executionTime) - new Date(b.executionTime);
      });
    });

    const isDarkMode = computed(() => themeStore.isDarkMode);

    const formatTime = (time) => {
      return new Date(time).toLocaleTimeString('zh-TW', {
        hour: '2-digit',
        minute: '2-digit'
      });
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

    return {
      sortedTasks,
      isDarkMode,
      formatTime,
      getFrequencyText,
      getFrequencyInfo,
      completeTask
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

.task-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  gap: 1rem;
}

.dark .task-item {
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