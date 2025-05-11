<template>
  <div class="container mx-auto px-4 py-6 max-w-4xl">
    <!-- 週統計標題與切換週 -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg mb-6 p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          <font-awesome-icon icon="chart-bar" class="text-indigo-600 dark:text-indigo-400 mr-2" />
          週進度分析
        </h2>
        <div class="flex items-center">
          <button 
            class="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 mr-3"
            @click="changeWeek(-1)"
            :disabled="loading"
          >
            <font-awesome-icon icon="chevron-left" />
          </button>
          <span class="font-medium dark:text-gray-300">{{ formattedWeekRange }}</span>
          <button 
            class="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 ml-3"
            @click="changeWeek(1)"
            :disabled="isCurrentWeek || loading"
          >
            <font-awesome-icon icon="chevron-right" />
          </button>
        </div>
      </div>
      
      <!-- 錯誤訊息 -->
      <div 
        v-if="error"
        class="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative mb-6"
        role="alert"
      >
        <span class="block sm:inline">{{ error }}</span>
        <button
          class="absolute top-0 bottom-0 right-0 px-4 py-3"
          @click="error = null"
        >
          <font-awesome-icon icon="times" />
        </button>
      </div>

      <!-- 週總結摘要卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <!-- 卡片1：本週目標完成率 -->
        <div class="stat-card bg-gradient-to-br from-indigo-500 to-indigo-700 dark:from-indigo-600 dark:to-indigo-900 text-white rounded-lg p-4 flex items-center transition-all duration-300 hover:shadow-lg">
          <div class="mr-4 bg-white bg-opacity-30 rounded-full p-3">
            <font-awesome-icon icon="bullseye" class="text-xl" />
          </div>
          <div>
            <p class="text-white text-opacity-90 text-sm">目標完成率</p>
            <p class="text-2xl font-bold">{{ completionRate }}%</p>
          </div>
        </div>
        
        <!-- 卡片2：已完成目標數 -->
        <div class="stat-card bg-gradient-to-br from-green-500 to-green-700 dark:from-green-600 dark:to-green-900 text-white rounded-lg p-4 flex items-center transition-all duration-300 hover:shadow-lg">
          <div class="mr-4 bg-white bg-opacity-30 rounded-full p-3">
            <font-awesome-icon icon="check-circle" class="text-xl" />
          </div>
          <div>
            <p class="text-white text-opacity-90 text-sm">已完成任務</p>
            <p class="text-2xl font-bold">{{ completedCount }} 項</p>
          </div>
        </div>
        
        <!-- 卡片3：連續達成天數 -->
        <div class="stat-card bg-gradient-to-br from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-900 text-white rounded-lg p-4 flex items-center transition-all duration-300 hover:shadow-lg">
          <div class="mr-4 bg-white bg-opacity-30 rounded-full p-3">
            <font-awesome-icon icon="fire" class="text-xl" />
          </div>
          <div>
            <p class="text-white text-opacity-90 text-sm">連續達成</p>
            <p class="text-2xl font-bold">{{ consecutiveDays }} 天</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 載入中狀態 -->
    <div 
      v-if="loading"
      class="flex justify-center items-center py-8"
    >
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      <span class="ml-2 text-gray-600 dark:text-gray-300">載入中...</span>
    </div>

    <!-- 主要分析區域 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- 每日完成趨勢圖 -->
      <div class="md:col-span-2 bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">本週任務完成趨勢</h3>
        <div class="h-64 min-h-[200px] chart-container">
          <canvas ref="weeklyTrendChart" width="400" height="200"></canvas>
        </div>
      </div>
      
      <!-- 目標分類比例圖 -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">目標分類比例</h3>
        <div class="h-64 min-h-[200px] chart-container">
          <canvas ref="goalCategoryChart" width="400" height="200"></canvas>
        </div>
      </div>
      
      <!-- 各目標完成狀況 -->
      <div class="md:col-span-3 bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">各目標週進度</h3>
        <div v-if="goalsProgress.length === 0" class="text-center py-6 text-gray-500 dark:text-gray-400">
          <font-awesome-icon icon="info-circle" class="text-2xl mb-2" />
          <p>本週尚無目標數據</p>
        </div>
        <div v-else class="space-y-4">
          <div v-for="goal in goalsProgress" :key="goal.id">
            <div class="flex justify-between items-center mb-1">
              <span class="text-gray-700 dark:text-gray-300 font-medium">{{ goal.title }}</span>
              <span class="text-indigo-600 dark:text-indigo-400 font-medium">{{ goal.completed }}/{{ goal.target }}</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div class="bg-indigo-600 dark:bg-indigo-500 h-3 rounded-full" :style="{ width: goal.percentage + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import Chart from 'chart.js/auto';
import { 
  getWeekDates, 
  formatDate, 
  getWeekCompletionRate, 
  getWeekCompletedCount, 
  getConsecutiveDays, 
  getWeekTrendData, 
  getGoalCategoryRatio, 
  getGoalsWeeklyProgress 
} from '../services/weeklyStatsService';

export default {
  name: 'WeeklyStats',
  
  setup() {
    // 狀態變量
    const currentWeekDate = ref(new Date());
    const loading = ref(true);
    const error = ref(null);
    const completionRate = ref(0);
    const completedCount = ref(0);
    const consecutiveDays = ref(0);
    const weekTrendData = ref([]);
    const goalCategoryData = ref({ day: 0, weekly: 0, monthly: 0 });
    const goalsProgress = ref([]);
    
    // 圖表實例
    let weeklyTrendChart = null;
    let goalCategoryChart = null;
    
    // DOM 引用
    const weeklyTrendChart_ref = ref(null);
    const goalCategoryChart_ref = ref(null);
    
    // 計算屬性
    const formattedWeekRange = computed(() => {
      const { startDate, endDate } = getWeekDates(currentWeekDate.value);
      const startMonth = startDate.getMonth() + 1;
      const endMonth = endDate.getMonth() + 1;
      const startDay = startDate.getDate();
      const endDay = endDate.getDate();
      const year = startDate.getFullYear();
      
      // 如果週跨月，則顯示完整日期
      if (startMonth !== endMonth) {
        return `${year}年${startMonth}月${startDay}日 - ${endMonth}月${endDay}日`;
      } else {
        return `${year}年${startMonth}月${startDay}日 - ${endDay}日`;
      }
    });
    
    const isCurrentWeek = computed(() => {
      const today = new Date();
      const { startDate, endDate } = getWeekDates(currentWeekDate.value);
      return today >= startDate && today <= endDate;
    });
    
    // 方法
    const loadWeeklyStats = async () => {
      try {
        loading.value = true;
        error.value = null;
        
        // 並行獲取所有數據
        const [
          weekCompletionRate,
          weekCompletedCount,
          daysCount,
          trendData,
          categoryData,
          progressData
        ] = await Promise.all([
          getWeekCompletionRate(currentWeekDate.value),
          getWeekCompletedCount(currentWeekDate.value),
          getConsecutiveDays(),
          getWeekTrendData(currentWeekDate.value),
          getGoalCategoryRatio(),
          getGoalsWeeklyProgress(currentWeekDate.value)
        ]);
        
        // 更新數據
        completionRate.value = weekCompletionRate;
        completedCount.value = weekCompletedCount;
        consecutiveDays.value = daysCount;
        weekTrendData.value = trendData;
        goalCategoryData.value = categoryData;
        goalsProgress.value = progressData;
        
        // 確保數據更新後，等待下一個tick再更新圖表
        await nextTick();
        updateCharts();
      } catch (err) {
        console.error('載入週統計數據失敗:', err);
        error.value = '載入數據失敗，請重新整理頁面';
      } finally {
        loading.value = false;
      }
    };
    
    const changeWeek = (offset) => {
      const newDate = new Date(currentWeekDate.value);
      newDate.setDate(newDate.getDate() + (offset * 7));
      currentWeekDate.value = newDate;
    };
    
    const updateCharts = () => {
      // 確保元素存在
      if (!weeklyTrendChart_ref.value || !goalCategoryChart_ref.value) {
        console.log('圖表容器還未準備好，稍後再嘗試繪製圖表');
        return;
      }
      
      // 清除舊圖表
      if (weeklyTrendChart) {
        weeklyTrendChart.destroy();
      }
      if (goalCategoryChart) {
        goalCategoryChart.destroy();
      }
      
      // 創建週趨勢圖
      if (weeklyTrendChart_ref.value) {
        const ctx = weeklyTrendChart_ref.value.getContext('2d');
        if (!ctx) {
          console.error('無法獲取週趨勢圖繪製上下文');
          return;
        }
        
        const labels = weekTrendData.value.map(day => day.weekday);
        const completedData = weekTrendData.value.map(day => day.completed);
        const totalData = weekTrendData.value.map(day => day.total);
        
        weeklyTrendChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [
              {
                label: '完成任務數',
                data: completedData,
                borderColor: '#4F46E5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                tension: 0.3,
                fill: true
              },
              {
                label: '總任務數',
                data: totalData,
                borderColor: '#9CA3AF',
                backgroundColor: 'rgba(156, 163, 175, 0.1)',
                tension: 0.3,
                borderDash: [5, 5],
                fill: false
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top'
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
              }
            }
          }
        });
      }
      
      // 創建目標分類比例圖
      if (goalCategoryChart_ref.value) {
        const ctx = goalCategoryChart_ref.value.getContext('2d');
        if (!ctx) {
          console.error('無法獲取目標分類比例圖繪製上下文');
          return;
        }
        
        const { day, weekly, monthly } = goalCategoryData.value;
        
        // 檢查數據是否有效
        if (day === undefined || weekly === undefined || monthly === undefined) {
          console.error('目標分類數據不完整，無法繪製圖表');
          return;
        }
        
        // 檢查是否有數據（如果全部為0則顯示提示信息）
        const totalGoals = day + weekly + monthly;
        if (totalGoals === 0) {
          // 如果沒有數據，可以繪製一個特殊的空狀態圖表或者不繪製
          console.log('沒有目標分類數據可顯示');
          // 清除舊圖表但不繪製新的
          if (goalCategoryChart) {
            goalCategoryChart.destroy();
            goalCategoryChart = null;
          }
          return;
        }
        
        // 獲取深色模式狀態以調整顏色
        const isDarkMode = document.documentElement.classList.contains('dark');
        const textColor = isDarkMode ? '#e5e7eb' : '#374151';
        
        goalCategoryChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['每日', '每週', '每月'],
            datasets: [{
              data: [day, weekly, monthly],
              backgroundColor: [
                '#4F46E5',  // 靛青色
                '#8B5CF6',  // 紫色
                '#EC4899'   // 粉紅色
              ],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  color: textColor
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw;
                    const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: ${value} (${percentage}%)`;
                  }
                }
              }
            },
            cutout: '65%'
          }
        });
      }
    };
    
    // 添加在 setup 函數中，負責檢查並延遲初始化圖表
    const initChartsWithDelay = () => {
      // 確保圖表容器已渲染並有尺寸
      setTimeout(() => {
        if (weeklyTrendChart_ref.value && 
            goalCategoryChart_ref.value && 
            !loading.value) {
          console.log('延遲初始化圖表');
          updateCharts();
        }
      }, 100); // 100ms延遲，給DOM渲染一些時間
    };
    
    // 監聽週日期變化
    watch(currentWeekDate, async () => {
      await loadWeeklyStats();
      nextTick(() => {
        updateCharts();
      });
    });
    
    // 生命週期鉤子
    onMounted(async () => {
      await loadWeeklyStats();
      
      // 使用 nextTick 確保DOM已更新後再初始化圖表
      nextTick(() => {
        updateCharts();
        // 額外的延遲初始化，以防第一次嘗試失敗
        initChartsWithDelay();
        
        // 添加視窗大小調整事件監聽，當視窗調整大小時重繪圖表
        window.addEventListener('resize', updateCharts);
      });
      
      // 監聽深色模式變化，更新圖表
      const observer = new MutationObserver(() => {
        updateCharts();
      });
      
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
      
      return () => {
        observer.disconnect();
        window.removeEventListener('resize', updateCharts);
      };
    });
    
    onUnmounted(() => {
      // 銷毀圖表實例
      if (weeklyTrendChart) {
        weeklyTrendChart.destroy();
      }
      if (goalCategoryChart) {
        goalCategoryChart.destroy();
      }
    });
    
    return {
      // 數據
      currentWeekDate,
      loading,
      error,
      completionRate,
      completedCount,
      consecutiveDays,
      goalsProgress,
      
      // 計算屬性
      formattedWeekRange,
      isCurrentWeek,
      
      // 方法
      changeWeek,
      loadWeeklyStats,
      
      // DOM 引用
      weeklyTrendChart: weeklyTrendChart_ref,
      goalCategoryChart: goalCategoryChart_ref
    };
  }
};
</script>

<style scoped>
.stat-card {
  transition: all 0.3s ease;
}
.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.chart-container {
  position: relative;
  width: 100%;
}

@media (max-width: 640px) {
  .chart-container {
    min-height: 180px;
  }
}
</style> 