<template>
  <div class="min-h-screen bg-gray-100" :class="{ 'dark': isDarkMode }">
    <nav class="bg-white shadow-md dark:bg-gray-800">
      <ul class="flex items-center justify-between px-6 py-3 max-w-4xl mx-auto">
        <li class="text-xl font-bold text-indigo-700 dark:text-indigo-400">
          <i class="fas fa-clipboard-check mr-2"></i>OKR
        </li>
        <li class="flex items-center space-x-4">
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
          <button 
            @click="toggleDarkMode" 
            class="px-3 py-2 rounded-md font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <font-awesome-icon :icon="isDarkMode ? 'sun' : 'moon'" class="mr-1" />
          </button>
        </li>
      </ul>
    </nav>

    <router-view></router-view>
  </div>
</template>

<script>
import { useThemeStore } from './stores/themeStore';
import { computed } from 'vue';

export default {
  name: 'App',
  setup() {
    const themeStore = useThemeStore();
    const isDarkMode = computed(() => themeStore.isDarkMode);
    
    const toggleDarkMode = () => {
      themeStore.toggleDarkMode();
    };

    // 初始化主題
    themeStore.initTheme();
    
    return {
      isDarkMode,
      toggleDarkMode
    };
  }
}
</script>

<style>
@import './style.css';

.dark {
  @apply bg-gray-900 text-gray-100;
}
</style> 