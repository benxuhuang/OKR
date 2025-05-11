<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6 dark:text-gray-100">系統設定</h1>
    
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4 dark:text-gray-200">資料管理</h2>
      
      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <h3 class="font-medium dark:text-gray-200">匯出資料</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">將所有目標和任務資料匯出為 JSON 檔案</p>
          </div>
          <button 
            @click="exportData" 
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <font-awesome-icon icon="download" class="mr-2" />
            匯出
          </button>
        </div>

        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <h3 class="font-medium dark:text-gray-200">匯入資料</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">從 JSON 檔案匯入目標和任務資料</p>
          </div>
          <button 
            @click="importData" 
            class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            <font-awesome-icon icon="upload" class="mr-2" />
            匯入
          </button>
        </div>

        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <h3 class="font-medium dark:text-gray-200">重設資料庫</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">清除所有資料並重設資料庫（此操作無法復原）</p>
          </div>
          <button 
            @click="resetDatabase" 
            class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            <font-awesome-icon icon="trash" class="mr-2" />
            重設
          </button>
        </div>
      </div>
    </div>

    <!-- 隱藏的檔案輸入欄位 -->
    <input
      type="file"
      ref="fileInput"
      style="display: none"
      accept=".json"
      @change="handleFileImport"
    >
  </div>
</template>

<script>
import { ref } from 'vue';
import { exportData, importData, resetDatabase } from '../services/indexedDB';

export default {
  name: 'Settings',
  
  setup() {
    const fileInput = ref(null);

    const exportDataHandler = async () => {
      try {
        await exportData();
      } catch (error) {
        alert('匯出失敗：' + error.message);
      }
    };

    const importDataHandler = () => {
      fileInput.value.click();
    };

    const handleFileImport = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      try {
        await importData(file);
        alert('匯入成功');
      } catch (error) {
        alert('匯入失敗：' + error.message);
      }
      event.target.value = '';
    };

    const resetDatabaseHandler = async () => {
      if (confirm('確定要重設資料庫嗎？這將清除所有資料且無法復原！')) {
        try {
          await resetDatabase();
        } catch (error) {
          alert('重設失敗：' + error.message);
        }
      }
    };

    return {
      fileInput,
      exportData: exportDataHandler,
      importData: importDataHandler,
      handleFileImport,
      resetDatabase: resetDatabaseHandler
    };
  }
};
</script> 