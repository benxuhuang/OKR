<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <nav class="bg-white shadow-md dark:bg-gray-800">
      <div class="flex items-center justify-between px-6 py-3 max-w-4xl mx-auto">
        <div class="text-xl font-bold text-indigo-700 dark:text-indigo-400">
          <router-link to="/">
            <i class="fas fa-clipboard-check mr-2"></i>OKR
          </router-link>
        </div>
        
        <!-- 桌面版選單 -->
        <ul class="hidden md:flex items-center space-x-4">
          <li>
            <router-link 
              to="/today-tasks" 
              class="px-3 py-2 rounded-md font-medium"
              :class="[
                $route.path === '/today-tasks' 
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' 
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              ]"
            >
              <font-awesome-icon icon="tasks" class="mr-1" />今日任務
            </router-link>
          </li>
          <li>
            <router-link 
              to="/goals" 
              class="px-3 py-2 rounded-md font-medium"
              :class="[
                $route.path === '/goals' 
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' 
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              ]"
            >
              <font-awesome-icon icon="bullseye" class="mr-1" />目標管理
            </router-link>
          </li>
          <li>
            <router-link 
              to="/weekly-stats" 
              class="px-3 py-2 rounded-md font-medium"
              :class="[
                $route.path === '/weekly-stats' 
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' 
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              ]"
            >
              <font-awesome-icon icon="chart-bar" class="mr-1" />週統計
            </router-link>
          </li>
          <li>
            <router-link 
              to="/monthly-stats" 
              class="px-3 py-2 rounded-md font-medium"
              :class="[
                $route.path === '/monthly-stats' 
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' 
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              ]"
            >
              <font-awesome-icon icon="calendar-alt" class="mr-1" />月統計
            </router-link>
          </li>
          <li>
            <router-link 
              to="/settings" 
              class="px-3 py-2 rounded-md font-medium"
              :class="[
                $route.path === '/settings' 
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' 
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              ]"
            >
              <font-awesome-icon icon="cog" class="mr-1" />設定
            </router-link>
          </li>
          <li>
            <button 
              @click="toggleDarkMode" 
              class="px-3 py-2 rounded-md font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <font-awesome-icon :icon="isDarkMode ? 'sun' : 'moon'" class="mr-1" />
            </button>
          </li>
        </ul>

        <!-- 行動版選單按鈕 -->
        <div class="flex md:hidden items-center space-x-3">
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen" 
            class="p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label="選單"
          >
            <font-awesome-icon icon="bars" />
          </button>
          <!-- <button 
            @click="toggleDarkMode" 
            class="p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label="切換主題"
          >
            <font-awesome-icon :icon="isDarkMode ? 'sun' : 'moon'" />
          </button> -->
        </div>
      </div>

      <!-- 行動版下拉選單 -->
      <div 
        v-if="mobileMenuOpen" 
        class="md:hidden bg-white dark:bg-gray-800 shadow-inner"
      >
        <div class="px-4 py-2 space-y-1">
          <router-link 
            to="/today-tasks" 
            class="block px-3 py-2 rounded-md font-medium"
            :class="[
              $route.path === '/today-tasks' 
                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' 
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            ]"
            @click="mobileMenuOpen = false"
          >
            <font-awesome-icon icon="tasks" class="mr-1" />今日任務
          </router-link>
          <router-link 
            to="/goals" 
            class="block px-3 py-2 rounded-md font-medium"
            :class="[
              $route.path === '/goals' 
                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' 
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            ]"
            @click="mobileMenuOpen = false"
          >
            <font-awesome-icon icon="bullseye" class="mr-1" />目標管理
          </router-link>
          <router-link 
            to="/weekly-stats" 
            class="block px-3 py-2 rounded-md font-medium"
            :class="[
              $route.path === '/weekly-stats' 
                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' 
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            ]"
            @click="mobileMenuOpen = false"
          >
            <font-awesome-icon icon="chart-bar" class="mr-1" />週統計
          </router-link>
          <router-link 
            to="/monthly-stats" 
            class="block px-3 py-2 rounded-md font-medium"
            :class="[
              $route.path === '/monthly-stats' 
                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' 
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            ]"
            @click="mobileMenuOpen = false"
          >
            <font-awesome-icon icon="calendar-alt" class="mr-1" />月統計
          </router-link>
          <router-link 
            to="/settings" 
            class="block px-3 py-2 rounded-md font-medium"
            :class="[
              $route.path === '/settings' 
                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' 
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            ]"
            @click="mobileMenuOpen = false"
          >
            <font-awesome-icon icon="cog" class="mr-1" />設定
          </router-link>
        </div>
      </div>
    </nav>

    <router-view></router-view>
  </div>
</template>

<script>
import { useThemeStore } from './stores/themeStore';
import { computed, ref } from 'vue';

export default {
  name: 'App',
  setup() {
    const themeStore = useThemeStore();
    const isDarkMode = computed(() => themeStore.isDarkMode);
    const mobileMenuOpen = ref(false);
    
    const toggleDarkMode = () => {
      themeStore.toggleDarkMode();
    };
    
    return {
      isDarkMode,
      toggleDarkMode,
      mobileMenuOpen
    };
  }
}
</script>

<style>
@import './style.css';

/* 新增選單按鈕樣式 */
.menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
}
</style> 