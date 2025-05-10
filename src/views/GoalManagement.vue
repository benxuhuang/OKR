<template>
  <div class="container mx-auto px-4 py-6 max-w-4xl">
    <!-- 導航欄 -->
    <nav class="bg-white shadow-md rounded-lg mb-6">
      <ul class="flex items-center justify-between px-6 py-3">
        <li class="text-xl font-bold text-indigo-700">
          <i class="fas fa-clipboard-check mr-2"></i>OKR 系統
        </li>
        <li class="flex items-center space-x-4">
          <router-link
            to="/today"
            class="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <i class="fas fa-tasks mr-1"></i>今日任務
          </router-link>
          <router-link
            to="/goals"
            class="px-3 py-2 bg-indigo-100 text-indigo-800 rounded-md font-medium"
          >
            <i class="fas fa-bullseye mr-1"></i>目標管理
          </router-link>
          <router-link
            to="/weekly"
            class="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <i class="fas fa-chart-bar mr-1"></i>週統計
          </router-link>
          <router-link
            to="/monthly"
            class="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <i class="fas fa-calendar-alt mr-1"></i>月統計
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- 目標管理標題與搜尋 -->
    <div class="bg-white shadow rounded-lg mb-6 p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-semibold text-gray-800">
          <i class="fas fa-bullseye text-indigo-600 mr-2"></i>
          目標管理
        </h2>
        <div class="flex items-center">
          <div class="relative mr-2">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜尋目標..."
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 outline-none"
            >
            <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>
          <button
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center"
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
      searchQuery: ''
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
      }
    },
    async loadGoals() {
      try {
        this.goals = await getAllGoals()
      } catch (error) {
        console.error('載入目標失敗:', error)
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
          completedTimes: 0,
          timesPerPeriod: parseInt(goalData.timesPerPeriod) || 1,
          daysOfWeek: Array.isArray(goalData.daysOfWeek) ? [...goalData.daysOfWeek] : [],
          time: goalData.time || '',
          description: goalData.description || '',
          progress: 0
        };

        if (this.editingGoal) {
          // 更新現有目標
          const updatedGoal = {
            ...this.editingGoal,
            ...baseGoal,
            updatedAt: new Date().toISOString()
          };
          await updateGoal(updatedGoal);
        } else {
          // 新增目標
          const newGoal = {
            ...baseGoal,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          await addGoal(newGoal);
        }

        await this.loadGoals();
        this.handleFormCancel();
      } catch (error) {
        console.error('儲存目標失敗:', error);
      }
    },
    handleFormCancel() {
      this.showForm = false
      this.editingGoal = null
    },
    handleEdit(goal) {
      this.editingGoal = goal
      this.showForm = true
    },
    async handleDelete(goalId) {
      try {
        await deleteGoal(goalId)
        await this.loadGoals()
      } catch (error) {
        console.error('刪除目標失敗:', error)
      }
    }
  }
}
</script> 