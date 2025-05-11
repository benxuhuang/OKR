<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-md">
      <ul class="flex items-center justify-between px-6 py-3 max-w-4xl mx-auto">
        <li class="text-xl font-bold text-indigo-700">
          <i class="fas fa-clipboard-check mr-2"></i>OKR 系統
        </li>
        <li class="flex items-center space-x-4">
          <router-link 
            to="/today-tasks" 
            class="px-3 py-2 rounded-md font-medium"
            :class="[
              $route.path === '/today-tasks' 
                ? 'bg-indigo-100 text-indigo-800' 
                : 'text-gray-600 hover:bg-gray-100'
            ]"
          >
            <i class="fas fa-tasks mr-1"></i>今日任務
          </router-link>
          <router-link 
            to="/goals" 
            class="px-3 py-2 rounded-md font-medium"
            :class="[
              $route.path === '/goals' 
                ? 'bg-indigo-100 text-indigo-800' 
                : 'text-gray-600 hover:bg-gray-100'
            ]"
          >
            <i class="fas fa-bullseye mr-1"></i>目標管理
          </router-link>
          <router-link 
            to="/weekly-stats" 
            class="px-3 py-2 rounded-md font-medium"
            :class="[
              $route.path === '/weekly-stats' 
                ? 'bg-indigo-100 text-indigo-800' 
                : 'text-gray-600 hover:bg-gray-100'
            ]"
          >
            <i class="fas fa-chart-bar mr-1"></i>週統計
          </router-link>
          <router-link 
            to="/monthly-stats" 
            class="px-3 py-2 rounded-md font-medium"
            :class="[
              $route.path === '/monthly-stats' 
                ? 'bg-indigo-100 text-indigo-800' 
                : 'text-gray-600 hover:bg-gray-100'
            ]"
          >
            <i class="fas fa-calendar-alt mr-1"></i>月統計
          </router-link>
        </li>
      </ul>
    </nav>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import './style.css';
</style> 