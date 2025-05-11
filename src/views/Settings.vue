<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-6">
      <font-awesome-icon icon="cog" class="mr-2" />設定
    </h1>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        <font-awesome-icon icon="bell" class="mr-2 text-indigo-600 dark:text-indigo-400" />
        通知設定
      </h2>
      
      <div v-if="!notificationStore.isSupported" class="mb-4 p-3 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-md flex items-center">
        <font-awesome-icon icon="exclamation-triangle" class="mr-2" />
        <span>您的瀏覽器不支援通知功能，請使用支援通知的瀏覽器（如Chrome、Firefox或Edge）。</span>
      </div>
      
      <div v-else-if="notificationStore.isPermissionDenied" class="mb-4 p-3 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-md flex items-center">
        <font-awesome-icon icon="exclamation-triangle" class="mr-2" />
        <span>您已拒絕通知權限，請在瀏覽器設定中重新授權以啟用通知功能。</span>
      </div>
      
      <div v-else class="space-y-4">
        <div class="flex justify-between items-center border-b dark:border-gray-700 pb-3">
          <div>
            <p class="font-medium text-gray-700 dark:text-gray-300">啟用任務提醒通知</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">任務執行時間前5分鐘發送提醒通知</p>
          </div>
          <button 
            @click="notificationStore.toggleNotifications()" 
            class="px-3 py-1 rounded-md"
            :class="notificationStore.notificationsEnabled ? 
              'bg-indigo-600 text-white dark:bg-indigo-700' : 
              'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'"
          >
            <font-awesome-icon 
              :icon="notificationStore.notificationsEnabled ? 'bell' : 'bell-slash'" 
              class="mr-1" 
            />
            {{ notificationStore.notificationsEnabled ? '已啟用' : '已停用' }}
          </button>
        </div>
        
        <div class="flex justify-between items-center border-b dark:border-gray-700 pb-3">
          <div>
            <p class="font-medium text-gray-700 dark:text-gray-300">啟用背景常駐偵測</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">在瀏覽器背景保持運行以確保收到通知</p>
          </div>
          <button 
            @click="notificationStore.toggleBackgroundMonitor()" 
            :disabled="!notificationStore.notificationsEnabled"
            class="px-3 py-1 rounded-md"
            :class="[
              notificationStore.backgroundMonitorEnabled && notificationStore.notificationsEnabled ? 
                'bg-indigo-600 text-white dark:bg-indigo-700' : 
                'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
              !notificationStore.notificationsEnabled ? 'opacity-50 cursor-not-allowed' : ''
            ]"
          >
            <font-awesome-icon 
              :icon="notificationStore.backgroundMonitorEnabled ? 'check-circle' : 'times-circle'" 
              class="mr-1" 
            />
            {{ notificationStore.backgroundMonitorEnabled ? '已啟用' : '已停用' }}
          </button>
        </div>
        
        <div v-if="notificationStore.isPermissionDefault" class="p-3 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-md">
          <p class="mb-2"><font-awesome-icon icon="question-circle" class="mr-2" />尚未獲得通知權限</p>
          <button 
            @click="notificationStore.requestPermission" 
            class="px-3 py-1 bg-blue-600 text-white dark:bg-blue-700 rounded-md"
          >
            <font-awesome-icon icon="bell" class="mr-1" />
            請求通知權限
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        <font-awesome-icon icon="sun" class="mr-2 text-indigo-600 dark:text-indigo-400" />
        介面設定
      </h2>
      
      <div class="flex justify-between items-center">
        <div>
          <p class="font-medium text-gray-700 dark:text-gray-300">深色模式</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">切換深色/淺色主題</p>
        </div>
        <button 
          @click="themeStore.toggleDarkMode" 
          class="px-3 py-1 rounded-md"
          :class="themeStore.isDarkMode ? 
            'bg-indigo-600 text-white dark:bg-indigo-700' : 
            'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'"
        >
          <font-awesome-icon :icon="themeStore.isDarkMode ? 'moon' : 'sun'" class="mr-1" />
          {{ themeStore.isDarkMode ? '深色' : '淺色' }}
        </button>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        <font-awesome-icon icon="cog" class="mr-2 text-indigo-600 dark:text-indigo-400" />
        資料管理
      </h2>
      
      <div class="space-y-4">
        <div class="flex justify-between items-center border-b dark:border-gray-700 pb-3">
          <div>
            <p class="font-medium text-gray-700 dark:text-gray-300">匯出資料</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">將您的目標和任務資料匯出為檔案</p>
          </div>
          <button
            @click="exportData"
            class="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800"
          >
            <font-awesome-icon icon="download" class="mr-1" />
            匯出
          </button>
        </div>
        
        <div class="flex justify-between items-center border-b dark:border-gray-700 pb-3">
          <div>
            <p class="font-medium text-gray-700 dark:text-gray-300">匯入資料</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">從檔案匯入目標和任務資料</p>
          </div>
          <label
            class="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer dark:bg-indigo-700 dark:hover:bg-indigo-800"
          >
            <font-awesome-icon icon="upload" class="mr-1" />
            匯入
            <input type="file" class="hidden" @change="importData" accept=".json">
          </label>
        </div>
        
        <div class="flex justify-between items-center">
          <div>
            <p class="font-medium text-gray-700 dark:text-gray-300">重設資料</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">清除所有目標和任務資料</p>
          </div>
          <button
            @click="confirmReset"
            class="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
          >
            <font-awesome-icon icon="trash" class="mr-1" />
            重設
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useThemeStore } from '../stores/themeStore';
import { useNotificationStore } from '../stores/notificationStore';
import { resetDatabase, exportData as dbExport, importData as dbImport } from '../services/indexedDB';

export default {
  name: 'Settings',
  setup() {
    const themeStore = useThemeStore();
    const notificationStore = useNotificationStore();
    
    const confirmReset = async () => {
      if (confirm('確定要重設所有資料嗎？此操作無法恢復！')) {
        try {
          await resetDatabase();
          alert('資料已重設');
        } catch (error) {
          alert(`重設資料時發生錯誤: ${error.message}`);
        }
      }
    };
    
    const exportData = async () => {
      try {
        await dbExport();
      } catch (error) {
        alert(`匯出資料時發生錯誤: ${error.message}`);
      }
    };
    
    const importData = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      try {
        if (confirm('匯入將覆蓋現有資料，確定要繼續嗎？')) {
          await dbImport(file);
          alert('資料已成功匯入');
          window.location.reload();
        }
      } catch (error) {
        alert(`匯入資料時發生錯誤: ${error.message}`);
      }
      // 重置 file input
      event.target.value = null;
    };
    
    return {
      themeStore,
      notificationStore,
      confirmReset,
      exportData,
      importData
    };
  }
};
</script> 