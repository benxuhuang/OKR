import { getTodayTasks, updateTaskStatus } from './indexedDB';

const DB_NAME = 'okr_system';
const DB_VERSION = 1;
const TASK_STORE = 'tasks';
const GOAL_STORE = 'goals';

// 中文星期對照表
const WEEKDAY_MAP = {
  '日': 0,
  '一': 1,
  '二': 2,
  '三': 3,
  '四': 4,
  '五': 5,
  '六': 6
};

// 英文星期對照表（用於相容性）
const ENGLISH_WEEKDAY_MAP = {
  'Sunday': 0,
  'Monday': 1,
  'Tuesday': 2,
  'Wednesday': 3,
  'Thursday': 4,
  'Friday': 5,
  'Saturday': 6
};

async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // 建立任務資料表
      if (!db.objectStoreNames.contains(TASK_STORE)) {
        const taskStore = db.createObjectStore(TASK_STORE, { keyPath: 'id', autoIncrement: true });
        taskStore.createIndex('date', 'date');
        taskStore.createIndex('goalId', 'goalId');
        taskStore.createIndex('status', 'status');
      }
      
      // 建立目標資料表
      if (!db.objectStoreNames.contains(GOAL_STORE)) {
        const goalStore = db.createObjectStore(GOAL_STORE, { keyPath: 'id', autoIncrement: true });
        goalStore.createIndex('frequencyType', 'frequencyType');
        goalStore.createIndex('title', 'title');
      }
    }
  });
}

async function generateDailyTasks(dateStr) {
  const db = await initDB();
  
  try {
    // 取得所有目標
    const goals = await db.getAll(GOAL_STORE);
    console.log('已取得目標:', goals);
    
    if (!goals || goals.length === 0) {
      console.log('沒有找到任何目標');
      return [];
    }

    const tasks = [];
    const date = new Date(dateStr);

    for (const goal of goals) {
      const shouldGenerate = await shouldGenerateTaskForGoal(goal, date);
      if (shouldGenerate) {
        tasks.push({
          goalId: goal.id,
          title: goal.title,
          date: dateStr,
          time: goal.time,
          status: 'pending',
          frequencyType: goal.frequencyType,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }

    // 批量儲存今日任務
    if (tasks.length > 0) {
      const tx = db.transaction(TASK_STORE, 'readwrite');
      await Promise.all(tasks.map(task => tx.store.add(task)));
      await tx.done;
      console.log('已生成今日任務:', tasks);
    }

    return tasks;
  } catch (error) {
    console.error('生成今日任務失敗:', error);
    throw new Error('生成今日任務時發生錯誤');
  }
}

async function shouldGenerateTaskForGoal(goal, date) {
  try {
    const db = await initDB();
    const dayOfWeek = date.getDay(); // 0-6, 0 是星期日
    
    // 檢查是否為執行日
    const goalDays = goal.daysOfWeek.map(day => {
      // 支援中文和英文的星期格式
      return WEEKDAY_MAP[day] !== undefined ? WEEKDAY_MAP[day] : ENGLISH_WEEKDAY_MAP[day];
    });

    if (!goalDays.includes(dayOfWeek)) {
      return false;
    }

    // 檢查週期內是否已達到執行次數
    const startDate = new Date(date);
    let endDate = new Date(date);

    switch (goal.frequencyType) {
      case 'day':
        return true; // 每日任務固定生成
      case 'weekly':
        // 設定為本週的開始（週一）和結束（週日）
        startDate.setDate(date.getDate() - ((dayOfWeek + 6) % 7));
        endDate.setDate(startDate.getDate() + 6);
        break;
      case 'monthly':
        // 設定為本月的第一天和最後一天
        startDate.setDate(1);
        endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
        break;
      default:
        console.warn('未知的頻率類型:', goal.frequencyType);
        return false;
    }

    // 轉換日期為本地格式字串進行比較
    const startStr = startDate.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' })
      .replace(/\//g, '-');
    const endStr = endDate.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' })
      .replace(/\//g, '-');

    // 查詢指定時間範圍內的已完成任務數
    const completedTasks = await db.getAllFromIndex(TASK_STORE, 'goalId', goal.id);
    
    const completedCount = completedTasks.filter(task => {
      return task.status === 'completed' &&
             task.date >= startStr &&
             task.date <= endStr;
    }).length;

    console.log(`目標 ${goal.title} 在當前週期內已完成 ${completedCount}/${goal.timesPerPeriod} 次`);
    return completedCount < goal.timesPerPeriod;
  } catch (error) {
    console.error('檢查是否應生成任務時發生錯誤:', error);
    throw new Error('檢查任務生成條件時發生錯誤');
  }
}

export { getTodayTasks, updateTaskStatus }; 