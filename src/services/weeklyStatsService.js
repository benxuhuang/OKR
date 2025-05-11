import { openDB } from 'idb';

const DB_NAME = 'okr_system';
const DB_VERSION = 2;
const TASK_STORE = 'tasks';
const GOAL_STORE = 'goals';

/**
 * 獲取資料庫連接
 */
async function getDb() {
  return openDB(DB_NAME, DB_VERSION);
}

/**
 * 獲取週開始和結束日期
 * @param {Date} currentDate - 當前日期
 * @returns {{startDate: Date, endDate: Date}} - 週開始和結束日期
 */
export const getWeekDates = (currentDate = new Date()) => {
  const date = new Date(currentDate);
  const day = date.getDay(); // 0-6, 0是星期日
  
  // 設定為本週的開始（星期一）和結束（星期日）
  const startDate = new Date(date);
  startDate.setDate(date.getDate() - ((day + 6) % 7));
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);
  
  return { startDate, endDate };
};

/**
 * 格式化日期為 YYYY-MM-DD 格式
 * @param {Date} date - 日期
 * @returns {string} - 格式化後的日期字串
 */
export const formatDate = (date) => {
  return date.toLocaleDateString('zh-TW', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  }).replace(/\//g, '-');
};

/**
 * 獲取指定週的總完成率
 * @param {Date} weekDate - 週日期
 * @returns {Promise<number>} - 總完成率（百分比）
 */
export const getWeekCompletionRate = async (weekDate = new Date()) => {
  try {
    const { startDate, endDate } = getWeekDates(weekDate);
    const startStr = formatDate(startDate);
    const endStr = formatDate(endDate);
    
    const db = await getDb();
    const goals = await db.getAll(GOAL_STORE);
    const tasks = await db.getAll(TASK_STORE);
    
    // 篩選本週任務（僅包含每日和每週目標）
    const weeklyTasks = tasks.filter(task => {
      const goal = goals.find(g => g.id === task.goalId);
      return task.date >= startStr && 
             task.date <= endStr && 
             goal && 
             (goal.frequencyType === 'day' || goal.frequencyType === 'weekly');
    });
    
    if (weeklyTasks.length === 0) return 0;
    
    const completedTasks = weeklyTasks.filter(task => task.status === 'completed');
    return Math.round((completedTasks.length / weeklyTasks.length) * 100);
  } catch (error) {
    console.error('獲取週完成率失敗:', error);
    return 0;
  }
};

/**
 * 獲取指定週的已完成項目總次數
 * @param {Date} weekDate - 週日期
 * @returns {Promise<number>} - 已完成項目總次數
 */
export const getWeekCompletedCount = async (weekDate = new Date()) => {
  try {
    const { startDate, endDate } = getWeekDates(weekDate);
    const startStr = formatDate(startDate);
    const endStr = formatDate(endDate);
    
    const db = await getDb();
    const goals = await db.getAll(GOAL_STORE);
    const tasks = await db.getAll(TASK_STORE);
    
    // 篩選本週任務（僅包含每日和每週目標）
    const weeklyTasks = tasks.filter(task => {
      const goal = goals.find(g => g.id === task.goalId);
      return task.date >= startStr && 
             task.date <= endStr && 
             goal && 
             (goal.frequencyType === 'day' || goal.frequencyType === 'weekly');
    });
    
    return weeklyTasks.filter(task => task.status === 'completed').length;
  } catch (error) {
    console.error('獲取週完成次數失敗:', error);
    return 0;
  }
};

/**
 * 獲取連續達成天數
 * @returns {Promise<number>} - 連續達成天數
 */
export const getConsecutiveDays = async () => {
  try {
    const db = await getDb();
    const tasks = await db.getAll(TASK_STORE);
    
    // 按日期分組
    const tasksByDate = {};
    tasks.forEach(task => {
      if (!tasksByDate[task.date]) {
        tasksByDate[task.date] = [];
      }
      tasksByDate[task.date].push(task);
    });
    
    // 轉換為數組並按日期排序（最新的日期在前）
    const dates = Object.keys(tasksByDate).sort((a, b) => new Date(b) - new Date(a));
    
    let consecutiveDays = 0;
    const today = formatDate(new Date());
    let currentDate = today;
    
    // 從今天開始往前檢查，如果有一天未完成所有任務則重設計數
    while (dates.includes(currentDate)) {
      const dayTasks = tasksByDate[currentDate] || [];
      const allCompleted = dayTasks.length > 0 && dayTasks.every(task => task.status === 'completed');
      
      if (!allCompleted) break;
      
      consecutiveDays++;
      
      // 計算前一天的日期
      const prevDate = new Date(currentDate);
      prevDate.setDate(prevDate.getDate() - 1);
      currentDate = formatDate(prevDate);
    }
    
    return consecutiveDays;
  } catch (error) {
    console.error('獲取連續達成天數失敗:', error);
    return 0;
  }
};

/**
 * 獲取週趨勢數據（每天完成任務數）
 * @param {Date} weekDate - 週日期
 * @returns {Promise<Array>} - 週趨勢數據
 */
export const getWeekTrendData = async (weekDate = new Date()) => {
  try {
    const { startDate, endDate } = getWeekDates(weekDate);
    const db = await getDb();
    const tasks = await db.getAll(TASK_STORE);
    
    // 創建一週的日期範圍
    const dateRange = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dateRange.push(formatDate(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // 統計每天的任務完成情況
    const trendData = dateRange.map(date => {
      const dailyTasks = tasks.filter(task => task.date === date);
      const completedCount = dailyTasks.filter(task => task.status === 'completed').length;
      const totalCount = dailyTasks.length;
      
      return {
        date,
        weekday: new Date(date).toLocaleDateString('zh-TW', { weekday: 'short' }),
        completed: completedCount,
        total: totalCount
      };
    });
    
    return trendData;
  } catch (error) {
    console.error('獲取週趨勢數據失敗:', error);
    return [];
  }
};

/**
 * 獲取目標分類比例
 * @returns {Promise<Object>} - 目標分類比例
 */
export const getGoalCategoryRatio = async () => {
  try {
    const db = await getDb();
    const goals = await db.getAll(GOAL_STORE);
    
    // 統計各頻率類型的目標數量
    const categoryCounts = {
      day: goals.filter(goal => goal.frequencyType === 'day').length,
      weekly: goals.filter(goal => goal.frequencyType === 'weekly').length,
      monthly: goals.filter(goal => goal.frequencyType === 'monthly').length
    };
    
    return categoryCounts;
  } catch (error) {
    console.error('獲取目標分類比例失敗:', error);
    return { day: 0, weekly: 0, monthly: 0 };
  }
};

/**
 * 獲取各目標週進度
 * @param {Date} weekDate - 週日期
 * @returns {Promise<Array>} - 各目標週進度
 */
export const getGoalsWeeklyProgress = async (weekDate = new Date()) => {
  try {
    const { startDate, endDate } = getWeekDates(weekDate);
    const startStr = formatDate(startDate);
    const endStr = formatDate(endDate);
    
    const db = await getDb();
    const goals = await db.getAll(GOAL_STORE);
    const tasks = await db.getAll(TASK_STORE);
    
    // 計算每個目標的週進度
    const goalsProgress = goals.map(goal => {
      // 獲取該目標在本週的任務
      const goalTasks = tasks.filter(task => 
        task.goalId === goal.id && 
        task.date >= startStr && 
        task.date <= endStr
      );
      
      // 計算完成數量
      const completedCount = goalTasks.filter(task => task.status === 'completed').length;
      
      // 計算目標次數（每日目標按7天計算，週目標按設定的次數計算）
      let targetCount = 0;
      if (goal.frequencyType === 'day') {
        // 統計每日目標在一週內應該執行的天數
        targetCount = goal.daysOfWeek.length;
      } else if (goal.frequencyType === 'weekly') {
        // 週目標直接使用設定的次數
        targetCount = goal.timesPerPeriod;
      } else {
        // 月目標不在週統計中顯示
        return null;
      }
      
      // 計算完成百分比
      const percentage = targetCount > 0 ? Math.round((completedCount / targetCount) * 100) : 0;
      
      return {
        id: goal.id,
        title: goal.title,
        completed: completedCount,
        target: targetCount,
        percentage,
        frequencyType: goal.frequencyType
      };
    }).filter(Boolean); // 過濾掉月目標（null值）
    
    return goalsProgress;
  } catch (error) {
    console.error('獲取目標週進度失敗:', error);
    return [];
  }
}; 