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
            class="px-3 py-2 bg-indigo-100 text-indigo-800 rounded-md font-medium"
          >
            <i class="fas fa-tasks mr-1"></i>今日任務
          </router-link>
          <router-link
            to="/goals"
            class="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
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

    <!-- 頁面內容 -->
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">
        <i class="fas fa-tasks text-indigo-600 mr-2"></i>
        今日任務
      </h2>
      <p class="text-gray-600">此功能正在開發中...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TodayTasks'
}
</script> 