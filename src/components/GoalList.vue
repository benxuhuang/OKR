<template>
  <div class="space-y-4">
    <!-- 篩選器 -->
    <div class="flex flex-wrap gap-2 mb-4">
      <button
        v-for="filter in filters"
        :key="filter.value"
        class="px-3 py-1 rounded-full text-sm font-medium"
        :class="[
          currentFilter === filter.value
            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
            : 'bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-800 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-indigo-900 dark:hover:text-indigo-200'
        ]"
        @click="currentFilter = filter.value"
      >
        {{ filter.label }} ({{ getFilteredCount(filter.value) }})
      </button>
    </div>

    <!-- 目標列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="goal in filteredGoals"
        :key="goal.id"
        class="goal-card bg-white dark:bg-gray-800 shadow rounded-lg p-4 hover:shadow-lg transition-shadow duration-200"
      >
        <div class="flex justify-between items-start mb-3">
          <h3 class="text-lg font-medium text-gray-800 dark:text-gray-100 flex-1 pr-2">{{ goal.title || '未命名目標' }}</h3>
          <div class="flex space-x-2 shrink-0">
            <button
              class="p-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 flex items-center justify-center w-8 h-8"
              @click="$emit('edit', goal)"
              title="編輯目標"
            >
              <font-awesome-icon icon="edit" class="text-lg" />
            </button>
            <button
              class="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 flex items-center justify-center w-8 h-8"
              @click="confirmDelete(goal)"
              title="刪除目標"
            >
              <font-awesome-icon icon="trash" class="text-lg" />
            </button>
          </div>
        </div>
        
        <div class="flex flex-wrap items-center text-gray-600 dark:text-gray-300 mb-3 text-sm gap-2">
          <span
            class="px-2 py-1 rounded-full text-xs"
            :class="getFrequencyTypeClass(goal.frequencyType)"
          >
            {{ getFrequencyTypeLabel(goal.frequencyType || 'day') }}
          </span>
          <span v-if="goal.time || goal.daysOfWeek?.length" class="truncate max-w-full">
            <font-awesome-icon icon="clock" class="mr-1" />
            {{ formatExecutionTime(goal) }}
          </span>
        </div>

        <p v-if="goal.description" class="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
          {{ goal.description }}
        </p>

        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-600 dark:text-gray-300">
            {{ getProgressLabel(goal) }}：{{ goalProgress[goal.id]?.completed || 0 }}/{{ goalProgress[goal.id]?.target || goal.timesPerPeriod || 1 }}
          </span>
          <span class="text-sm font-medium text-indigo-600 dark:text-indigo-400">
            {{ calculateProgressPercentage(goal) }}%
          </span>
        </div>

        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            class="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all duration-300"
            :style="{ width: calculateProgressPercentage(goal) + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- 刪除確認對話框 -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300"
      @click.self="cancelDelete"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4 transform transition-all duration-300 scale-100 opacity-100 shadow-xl">
        <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">確認刪除</h4>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          確定要刪除「{{ goalToDelete?.title }}」這個目標嗎？此操作無法復原。
        </p>
        <div class="flex justify-end space-x-4">
          <button
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            @click="cancelDelete"
          >
            取消
          </button>
          <button
            class="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors duration-200"
            @click="confirmDeleteAction"
          >
            刪除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getGoalProgress } from '../services/progressService';

export default {
  name: 'GoalList',
  props: {
    goals: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      currentFilter: 'all',
      showDeleteConfirm: false,
      goalToDelete: null,
      goalProgress: {}, // 存儲各目標的進度數據
      filters: [
        { label: '全部', value: 'all' },
        { label: '每日', value: 'day' },
        { label: '每週', value: 'weekly' },
        { label: '每月', value: 'monthly' }
      ]
    }
  },
  computed: {
    filteredGoals() {
      if (this.currentFilter === 'all') {
        return this.goals
      }
      return this.goals.filter(goal => goal.frequencyType === this.currentFilter)
    }
  },
  watch: {
    goals: {
      immediate: true,
      handler(newGoals) {
        if (newGoals && newGoals.length) {
          this.fetchAllGoalsProgress();
        }
      }
    }
  },
  methods: {
    async fetchAllGoalsProgress() {
      const progressMap = {};
      
      for (const goal of this.goals) {
        if (goal.id) {
          const progress = await getGoalProgress(goal);
          progressMap[goal.id] = progress;
        }
      }
      
      this.goalProgress = progressMap;
    },
    getFilteredCount(filterValue) {
      if (filterValue === 'all') {
        return this.goals.length
      }
      return this.goals.filter(goal => goal.frequencyType === filterValue).length
    },
    getFrequencyTypeLabel(type) {
      const labels = {
        day: '每日',
        weekly: '每週',
        monthly: '每月'
      }
      return labels[type] || type
    },
    getFrequencyTypeClass(type) {
      const classes = {
        day: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
        weekly: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
        monthly: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
      }
      return classes[type] || ''
    },
    getProgressLabel(goal) {
      const labels = {
        day: '本日進度',
        weekly: '本週進度',
        monthly: '本月進度'
      }
      return labels[goal.frequencyType] || '進度'
    },
    formatExecutionTime(goal) {
      if (!goal.daysOfWeek || !Array.isArray(goal.daysOfWeek)) {
        return goal.time || '未設定時間'
      }
      
      const days = goal.daysOfWeek.map(day => {
        const dayLabels = {
          Monday: '一',
          Tuesday: '二',
          Wednesday: '三',
          Thursday: '四',
          Friday: '五',
          Saturday: '六',
          Sunday: '日'
        }
        return dayLabels[day]
      }).join('、')
      
      return `${days} ${goal.time || ''}`
    },
    calculateProgressPercentage(goal) {
      if (!goal || !goal.id) return 0;
      
      const progress = this.goalProgress[goal.id];
      if (!progress) return 0;
      
      const { completed, target } = progress;
      if (!target) return 0;
      
      return Math.round((completed / target) * 100);
    },
    confirmDelete(goal) {
      this.goalToDelete = goal
      this.showDeleteConfirm = true
      // 添加焦點陷阱，避免用戶在對話框開啟時與背景互動
      document.body.style.overflow = 'hidden'
    },
    cancelDelete() {
      this.goalToDelete = null
      this.showDeleteConfirm = false
      // 恢復頁面滾動
      document.body.style.overflow = ''
    },
    confirmDeleteAction() {
      if (this.goalToDelete && this.goalToDelete.id) {
        this.$emit('delete', this.goalToDelete.id)
      }
      this.cancelDelete()
    }
  }
}
</script>

<style scoped>
.goal-card {
  transition: all 0.3s ease;
}
.goal-card:hover {
  transform: translateY(-3px);
}
</style> 