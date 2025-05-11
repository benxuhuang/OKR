<template>
  <div class="container mx-auto px-4 py-6 max-w-4xl">
    <!-- 目標管理標題與搜尋 -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg mb-6 p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          <i class="fas fa-bullseye text-indigo-600 dark:text-indigo-400 mr-2"></i>
          目標管理
        </h2>
        <div class="flex items-center">
          <div class="relative mr-2">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜尋目標..."
              class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 focus:border-indigo-400 dark:focus:border-indigo-600 transition-all duration-200 outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            >
            <i class="fas fa-search absolute left-3 top-3 text-gray-400 dark:text-gray-500"></i>
          </div>
          <button
            class="px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors duration-200 flex items-center"
            @click="showForm = true"
          >
            <i class="fas fa-plus mr-2"></i>新增目標
          </button>
        </div>
      </div>
    </div>

    <!-- 目標表單 -->
    <div v-if="showForm" class="mb-6">
      <GoalForm
        :goal="editingGoal"
        :is-edit="!!editingGoal"
        @submit="handleFormSubmit"
        @cancel="handleFormCancel"
      />
    </div>

    <!-- 目標列表 -->
    <GoalList
      :goals="filteredGoals"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- 懸浮按鈕 -->
    <div class="fixed bottom-6 right-6">
      <button
        v-if="!showForm"
        class="bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-800 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
        @click="showForm = true"
      >
        <i class="fas fa-plus text-xl"></i>
      </button>
    </div>

    <!-- 操作結果提示 -->
    <div
      v-if="notification.show"
      class="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center transition-all duration-300"
      :class="{
        'opacity-100': notification.show,
        'opacity-0': !notification.show,
        'bg-green-700 dark:bg-green-800': notification.type === 'success',
        'bg-red-700 dark:bg-red-800': notification.type === 'error'
      }"
    >
      <i
        class="mr-2"
        :class="{
          'fas fa-check-circle': notification.type === 'success',
          'fas fa-exclamation-circle': notification.type === 'error'
        }"
      ></i>
      {{ notification.message }}
    </div>
  </div>
</template>

<script>
import GoalForm from '../components/GoalForm.vue'
import GoalList from '../components/GoalList.vue'
import { initDB, addGoal, getAllGoals, updateGoal, deleteGoal } from '../services/indexedDB'

export default {
  name: 'GoalManagement',
  components: {
    GoalForm,
    GoalList
  },
  data() {
    return {
      goals: [],
      showForm: false,
      editingGoal: null,
      searchQuery: '',
      notification: {
        show: false,
        message: '',
        type: 'success', // 'success' 或 'error'
        timeout: null
      }
    }
  },
  computed: {
    filteredGoals() {
      if (!this.searchQuery) {
        return this.goals
      }
      const query = this.searchQuery.toLowerCase()
      return this.goals.filter(goal =>
        goal.title.toLowerCase().includes(query)
      )
    }
  },
  async created() {
    await this.initializeDB()
    await this.loadGoals()
  },
  methods: {
    async initializeDB() {
      try {
        await initDB()
      } catch (error) {
        console.error('初始化資料庫失敗:', error)
        this.showNotification('初始化資料庫失敗，請重新整理頁面', 'error')
      }
    },
    async loadGoals() {
      try {
        this.goals = await getAllGoals()
      } catch (error) {
        console.error('載入目標失敗:', error)
        this.showNotification('載入目標失敗', 'error')
      }
    },
    async handleFormSubmit(goalData) {
      try {
        if (!goalData.title?.trim()) {
          console.error('目標標題不能為空');
          return;
        }

        const baseGoal = {
          title: goalData.title.trim(),
          frequencyType: goalData.frequencyType || 'day',
          completedTimes: goalData.completedTimes || 0,
          timesPerPeriod: parseInt(goalData.timesPerPeriod) || 1,
          daysOfWeek: Array.isArray(goalData.daysOfWeek) ? [...goalData.daysOfWeek] : [],
          time: goalData.time || '',
          description: goalData.description || '',
          progress: goalData.progress || 0
        };

        if (this.editingGoal) {
          // 更新現有目標
          const updatedGoal = {
            ...this.editingGoal,
            ...baseGoal,
            updatedAt: new Date().toISOString()
          };
          await updateGoal(updatedGoal);
          this.showNotification('目標已成功更新', 'success');
        } else {
          // 新增目標
          const newGoal = {
            ...baseGoal,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          await addGoal(newGoal);
          this.showNotification('目標已成功新增', 'success');
        }

        await this.loadGoals();
        this.handleFormCancel();
      } catch (error) {
        console.error('儲存目標失敗:', error);
        this.showNotification('儲存目標失敗', 'error');
      }
    },
    handleFormCancel() {
      this.showForm = false
      this.editingGoal = null
    },
    handleEdit(goal) {
      if (!goal || !goal.id) {
        this.showNotification('編輯失敗：無效的目標資料', 'error')
        return
      }
      
      this.editingGoal = { ...goal } // 複製目標物件，避免直接修改原始資料
      this.showForm = true
      
      // 滾動到表單位置
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }, 100)
    },
    async handleDelete(goalId) {
      if (!goalId) {
        this.showNotification('刪除失敗：無效的目標 ID', 'error')
        return
      }

      try {
        await deleteGoal(goalId)
        // 重新載入目標列表
        await this.loadGoals()
        this.showNotification('目標已成功刪除', 'success')
      } catch (error) {
        console.error('刪除目標失敗:', error)
        this.showNotification('刪除目標失敗', 'error')
      }
    },
    showNotification(message, type = 'success') {
      // 清除先前的計時器
      if (this.notification.timeout) {
        clearTimeout(this.notification.timeout)
      }
      
      // 設定新的通知
      this.notification = {
        show: true,
        message,
        type,
        timeout: setTimeout(() => {
          this.notification.show = false
        }, 3000)
      }
    }
  }
}
</script>

<style scoped>
.router-link-active {
  font-weight: 600;
  background-color: rgba(79, 70, 229, 0.1);
  color: rgb(79, 70, 229);
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.notification-enter-active {
  animation: slideUp 0.3s ease-out;
}

.notification-leave-active {
  animation: slideUp 0.3s ease-in reverse;
}
</style> 