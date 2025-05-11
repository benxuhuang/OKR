import { openDB } from 'idb';

const DB_NAME = 'okr_system';
const DB_VERSION = 2;
const TASK_STORE = 'tasks';

// 初始化資料庫連接
const getDb = async () => {
  return openDB(DB_NAME, DB_VERSION);
};

/**
 * 獲取目標在當日的進度
 * @param {string} goalId - 目標ID
 * @returns {Promise<{completed: number, target: number}>} - 完成次數與目標次數
 */
export const getDailyProgress = async (goalId) => {
  try {
    const db = await getDb();
    const today = new Date();
    
    // 格式化為 YYYY-MM-DD
    const todayStr = today.toLocaleDateString('zh-TW', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }).replace(/\//g, '-');
    
    // 獲取今日所有與該目標相關的任務
    const tasks = await db.getAllFromIndex(TASK_STORE, 'goalId', goalId);
    const todayTasks = tasks.filter(task => task.date === todayStr);
    
    // 計算完成的任務數
    const completedCount = todayTasks.filter(task => task.status === 'completed').length;
    
    return {
      completed: completedCount,
      target: 1 // 每日目標通常是每天執行一次
    };
  } catch (error) {
    console.error('獲取每日進度失敗:', error);
    return { completed: 0, target: 1 };
  }
};

/**
 * 獲取目標在當週的進度
 * @param {string} goalId - 目標ID
 * @returns {Promise<{completed: number, target: number}>} - 完成次數與目標次數
 */
export const getWeeklyProgress = async (goalId) => {
  try {
    const db = await getDb();
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0-6, 0 是星期日
    
    // 設定為本週的開始（星期日）和結束（星期六）
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - dayOfWeek);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);
    
    // 格式化日期為 YYYY-MM-DD
    const startStr = startDate.toLocaleDateString('zh-TW', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }).replace(/\//g, '-');
    
    const endStr = endDate.toLocaleDateString('zh-TW', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }).replace(/\//g, '-');
    
    // 獲取該目標在此週期內的所有任務
    const tasks = await db.getAllFromIndex(TASK_STORE, 'goalId', goalId);
    const tasksInPeriod = tasks.filter(task => 
      task.date >= startStr && task.date <= endStr
    );
    
    // 計算完成的任務數
    const completedCount = tasksInPeriod.filter(task => task.status === 'completed').length;
    
    // 獲取目標，從中取得週期目標次數
    const tx = db.transaction('goals', 'readonly');
    const goal = await tx.store.get(goalId);
    
    return {
      completed: completedCount,
      target: goal?.timesPerPeriod || 0
    };
  } catch (error) {
    console.error('獲取每週進度失敗:', error);
    return { completed: 0, target: 0 };
  }
};

/**
 * 獲取目標在當月的進度
 * @param {string} goalId - 目標ID
 * @returns {Promise<{completed: number, target: number}>} - 完成次數與目標次數
 */
export const getMonthlyProgress = async (goalId) => {
  try {
    const db = await getDb();
    const today = new Date();
    
    // 設定為本月的第一天和最後一天
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    // 格式化日期為 YYYY-MM-DD
    const startStr = startDate.toLocaleDateString('zh-TW', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }).replace(/\//g, '-');
    
    const endStr = endDate.toLocaleDateString('zh-TW', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }).replace(/\//g, '-');
    
    // 獲取該目標在此週期內的所有任務
    const tasks = await db.getAllFromIndex(TASK_STORE, 'goalId', goalId);
    const tasksInPeriod = tasks.filter(task => 
      task.date >= startStr && task.date <= endStr
    );
    
    // 計算完成的任務數
    const completedCount = tasksInPeriod.filter(task => task.status === 'completed').length;
    
    // 獲取目標，從中取得月度目標次數
    const tx = db.transaction('goals', 'readonly');
    const goal = await tx.store.get(goalId);
    
    return {
      completed: completedCount,
      target: goal?.timesPerPeriod || 0
    };
  } catch (error) {
    console.error('獲取每月進度失敗:', error);
    return { completed: 0, target: 0 };
  }
};

/**
 * 獲取目標的進度（根據頻率類型）
 * @param {Object} goal - 目標對象
 * @returns {Promise<{completed: number, target: number}>} - 完成次數與目標次數
 */
export const getGoalProgress = async (goal) => {
  if (!goal || !goal.id) {
    return { completed: 0, target: 0 };
  }
  
  switch (goal.frequencyType) {
    case 'day':
      return getDailyProgress(goal.id);
    case 'weekly':
      return getWeeklyProgress(goal.id);
    case 'monthly':
      return getMonthlyProgress(goal.id);
    default:
      return { completed: 0, target: goal.timesPerPeriod || 0 };
  }
}; 