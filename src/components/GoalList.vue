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
            ? 'bg-indigo-100 text-indigo-800'
            : 'bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-800'
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
        class="goal-card bg-white shadow rounded-lg p-4 hover:shadow-lg transition-shadow duration-200"
      >
        <div class="flex justify-between items-start mb-3">
          <h3 class="text-lg font-medium text-gray-800">{{ goal.title || '未命名目標' }}</h3>
          <div class="flex space-x-2">
            <button
              class="text-gray-400 hover:text-indigo-600"
              @click="$emit('edit', goal)"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
              class="text-gray-400 hover:text-red-600"
              @click="confirmDelete(goal)"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        
        <div class="flex items-center text-gray-600 mb-3 text-sm">
          <span
            class="px-2 py-1 rounded-full text-xs mr-2"
            :class="getFrequencyTypeClass(goal.frequencyType)"
          >
            {{ getFrequencyTypeLabel(goal.frequencyType || 'day') }}
          </span>
          <span v-if="goal.time || goal.daysOfWeek?.length">
            <i class="far fa-clock mr-1"></i>
            {{ formatExecutionTime(goal) }}
          </span>
        </div>

        <p v-if="goal.description" class="text-gray-600 text-sm mb-3">
          {{ goal.description }}
        </p>

        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-600">
            本週進度：{{ goal.completedTimes || 0 }}/{{ goal.timesPerPeriod || 1 }}
          </span>
          <span class="text-sm font-medium text-indigo-600">
            {{ calculateProgress(goal) }}%
          </span>
        </div>

        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-indigo-600 h-2 rounded-full"
            :style="{ width: calculateProgress(goal) + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- 刪除確認對話框 -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-sm mx-4">
        <h4 class="text-lg font-semibold mb-4">確認刪除</h4>
        <p class="text-gray-600 mb-6">
          確定要刪除「{{ goalToDelete?.title }}」這個目標嗎？此操作無法復原。
        </p>
        <div class="flex justify-end space-x-4">
          <button
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            @click="cancelDelete"
          >
            取消
          </button>
          <button
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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
  methods: {
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
        day: 'bg-blue-100 text-blue-800',
        weekly: 'bg-purple-100 text-purple-800',
        monthly: 'bg-green-100 text-green-800'
      }
      return classes[type] || ''
    },
    formatExecutionTime(goal) {
      if (!goal.daysOfWeek || !Array.isArray(goal.daysOfWeek)) {
        return goal.time || '未設定時間'
      }
      
      const days = goal.daysOfWeek.map(day => {
        const dayLabels = {
          Monday: '週一',
          Tuesday: '週二',
          Wednesday: '週三',
          Thursday: '週四',
          Friday: '週五',
          Saturday: '週六',
          Sunday: '週日'
        }
        return dayLabels[day]
      }).join('、')
      
      return `${days} ${goal.time || ''}`
    },
    calculateProgress(goal) {
      if (!goal || !goal.timesPerPeriod) return 0
      return Math.round(((goal.completedTimes || 0) / (goal.timesPerPeriod || 1)) * 100)
    },
    confirmDelete(goal) {
      this.goalToDelete = goal
      this.showDeleteConfirm = true
    },
    cancelDelete() {
      this.goalToDelete = null
      this.showDeleteConfirm = false
    },
    confirmDeleteAction() {
      this.$emit('delete', this.goalToDelete.id)
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