import { openDB, deleteDB } from 'idb';

const DB_NAME = 'okr_system';
const DB_VERSION = 2;
const GOAL_STORE = 'goals';
const TASK_STORE = 'tasks';

// 英文星期對照表
const WEEKDAY_MAP = {
  'Sunday': 0,
  'Monday': 1,
  'Tuesday': 2,
  'Wednesday': 3,
  'Thursday': 4,
  'Friday': 5,
  'Saturday': 6
};

// 所有星期
const ALL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// 刪除現有資料庫
export const resetDatabase = async () => {
  console.log('重設資料庫...');
  try {
    await deleteDB(DB_NAME);
    console.log('資料庫已重設');
    window.location.reload();
  } catch (error) {
    console.error('重設資料庫失敗:', error);
    throw new Error('重設資料庫時發生錯誤');
  }
};

// 初始化資料庫
export const initDB = async () => {
  console.log('初始化資料庫...');
  try {
    const db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        console.log(`資料庫升級: ${oldVersion} -> ${newVersion}`);
        
        // 如果是新建資料庫，oldVersion 會是 0
        if (oldVersion < 1) {
          // 建立目標資料表
          if (!db.objectStoreNames.contains(GOAL_STORE)) {
            console.log('建立目標資料表...');
            const goalStore = db.createObjectStore(GOAL_STORE, { keyPath: 'id' });
            goalStore.createIndex('title', 'title', { unique: false });
            goalStore.createIndex('frequencyType', 'frequencyType', { unique: false });
            goalStore.createIndex('createdAt', 'createdAt', { unique: false });
          }
          
          // 建立任務資料表
          if (!db.objectStoreNames.contains(TASK_STORE)) {
            console.log('建立任務資料表...');
            const taskStore = db.createObjectStore(TASK_STORE, { keyPath: 'id', autoIncrement: true });
            taskStore.createIndex('date', 'date');
            taskStore.createIndex('goalId', 'goalId');
            taskStore.createIndex('status', 'status');
          }
        }
      }
    });

    console.log('資料庫初始化成功');
    return db;
  } catch (error) {
    console.error('資料庫初始化失敗:', error);
    throw error;
  }
};

// 目標相關操作
export const addGoal = async (goal) => {
  console.log('新增目標:', goal);
  if (!goal || typeof goal !== 'object') {
    throw new Error('無效的目標資料');
  }

  // 如果是每日目標，自動填入所有星期
  const daysOfWeek = goal.frequencyType === 'day' ? ALL_DAYS : 
    (Array.isArray(goal.daysOfWeek) ? [...goal.daysOfWeek] : []);

  const safeGoal = {
    ...goal,
    daysOfWeek,
    createdAt: goal.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    const db = await initDB();
    const result = await db.add(GOAL_STORE, safeGoal);
    console.log('目標新增成功:', result);
    return result;
  } catch (error) {
    console.error('新增目標失敗:', error);
    throw error;
  }
};

export const getAllGoals = async () => {
  console.log('獲取所有目標...');
  try {
    const db = await initDB();
    const goals = await db.getAll(GOAL_STORE);
    console.log('獲取目標成功:', goals);
    return goals;
  } catch (error) {
    console.error('獲取目標失敗:', error);
    throw error;
  }
};

export const updateGoal = async (goal) => {
  console.log('更新目標:', goal);
  try {
    // 如果是每日目標，確保包含所有星期
    if (goal.frequencyType === 'day') {
      goal.daysOfWeek = ALL_DAYS;
    }
    
    const db = await initDB();
    const result = await db.put(GOAL_STORE, goal);
    console.log('目標更新成功:', result);
    return result;
  } catch (error) {
    console.error('更新目標失敗:', error);
    throw error;
  }
};

export const deleteGoal = async (id) => {
  const db = await initDB();
  return db.delete(GOAL_STORE, id);
};

// 任務相關操作
export const getTodayTasks = async () => {
  console.log('獲取今日任務...');
  try {
    const db = await initDB();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayStr = today.toLocaleDateString('zh-TW', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }).replace(/\//g, '-');
    
    console.log('今日日期:', todayStr);
    
    // 獲取所有目標
    const goals = await getAllGoals();
    console.log('所有目標:', goals);

    // 獲取今日已存在的任務
    const existingTasks = await db.getAllFromIndex(TASK_STORE, 'date', todayStr);
    console.log('已存在的今日任務:', existingTasks);

    // 將現有任務按 goalId 分組，確保每個目標只有一個任務
    const tasksByGoalId = {};
    existingTasks.forEach(task => {
      // 如果這個目標ID還沒有任務，或者當前任務更新時間更新，則使用這個任務
      if (!tasksByGoalId[task.goalId] || 
          new Date(task.updatedAt) > new Date(tasksByGoalId[task.goalId].updatedAt)) {
        tasksByGoalId[task.goalId] = task;
      }
    });

    // 檢查每個目標是否需要生成任務
    const newTasks = [];
    const date = new Date(todayStr);
    const dayOfWeek = date.getDay();
    const todayName = ALL_DAYS[dayOfWeek];
    console.log('當前星期:', todayName);

    for (const goal of goals) {
      console.log('檢查目標:', goal.title);
      
      // 檢查是否已經存在此目標的任務
      if (!tasksByGoalId[goal.id]) {
        console.log('目標尚未生成今日任務');
        
        // 如果是每日目標或今天是執行日，則檢查是否應該生成任務
        if (goal.frequencyType === 'day' || goal.daysOfWeek.includes(todayName)) {
          console.log('今天是執行日或為每日目標');
          const shouldGenerate = await shouldGenerateTaskForGoal(goal, date);
          if (shouldGenerate) {
            console.log('將生成任務');
            newTasks.push({
              goalId: goal.id,
              title: goal.title,
              date: todayStr,
              time: goal.time,
              status: 'pending',
              frequencyType: goal.frequencyType,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          }
        } else {
          console.log('今天不是執行日');
        }
      } else {
        console.log('目標已有今日任務');
      }
    }

    // 如果有新任務需要生成
    if (newTasks.length > 0) {
      console.log('新增新任務:', newTasks);
      const tx = db.transaction(TASK_STORE, 'readwrite');
      await Promise.all(newTasks.map(task => tx.store.add(task)));
      await tx.done;
    }

    // 返回所有今日任務（包含已整理的現有任務和新生成的）
    return [...Object.values(tasksByGoalId), ...newTasks];
  } catch (error) {
    console.error('獲取今日任務失敗:', error);
    throw error;
  }
};

export const updateTaskStatus = async (taskId, status) => {
  try {
    const db = await initDB();
    const tx = db.transaction(TASK_STORE, 'readwrite');
    const task = await tx.store.get(taskId);
    
    if (!task) {
      throw new Error('找不到指定的任務');
    }
    
    task.status = status;
    task.updatedAt = new Date().toISOString();
    await tx.store.put(task);
    await tx.done;
    
    return task;
  } catch (error) {
    console.error('更新任務狀態失敗:', error);
    throw new Error('更新任務狀態時發生錯誤');
  }
};

// 內部輔助函數
async function shouldGenerateTaskForGoal(goal, date) {
  console.log('檢查是否應生成任務:', goal.title);
  try {
    const db = await initDB();
    
    // 每日任務總是生成
    if (goal.frequencyType === 'day') {
      console.log('每日目標，直接生成');
      return true;
    }

    // 檢查週期內是否已達到執行次數
    const startDate = new Date(date);
    let endDate = new Date(date);
    const dateStr = date.toLocaleDateString('zh-TW', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }).replace(/\//g, '-');

    switch (goal.frequencyType) {
      case 'weekly':
        startDate.setDate(date.getDate() - date.getDay()); // 設為本週日
        endDate.setDate(startDate.getDate() + 6);
        break;
      case 'monthly':
        startDate.setDate(1);
        endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        break;
      default:
        console.warn('未知的頻率類型:', goal.frequencyType);
        return false;
    }

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

    console.log('檢查時間範圍:', startStr, '至', endStr);

    // 獲取該目標在週期內的所有任務
    const periodTasks = await db.getAllFromIndex(TASK_STORE, 'goalId', goal.id);
    const tasksInPeriod = periodTasks.filter(task => 
      task.date >= startStr && task.date <= endStr
    );

    // 檢查同一天是否已經有任務（避免重複生成）
    const hasTaskToday = periodTasks.some(task => task.date === dateStr);
    if (hasTaskToday) {
      console.log(`目標 ${goal.title} 今天已有任務`);
      return false;
    }

    // 計算已完成的任務數和已生成的任務數
    const completedCount = tasksInPeriod.filter(task => task.status === 'completed').length;
    const generatedCount = tasksInPeriod.length;

    console.log(`目標 ${goal.title} 在當前週期內:`);
    console.log(`- 已完成次數: ${completedCount}`);
    console.log(`- 已生成次數: ${generatedCount}`);
    console.log(`- 週期目標次數: ${goal.timesPerPeriod}`);

    // 如果已完成次數未達標，且已生成次數未達目標次數，則生成新任務
    const shouldGenerate = completedCount < goal.timesPerPeriod && generatedCount < goal.timesPerPeriod;
    console.log(`是否生成新任務: ${shouldGenerate}`);
    return shouldGenerate;
  } catch (error) {
    console.error('檢查是否應生成任務時發生錯誤:', error);
    throw error;
  }
}

// 匯出資料
export const exportData = async () => {
  console.log('匯出資料...');
  try {
    const db = await initDB();
    const goals = await db.getAll(GOAL_STORE);
    const tasks = await db.getAll(TASK_STORE);
    
    const data = {
      goals,
      tasks,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `okr-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('資料匯出成功');
    return true;
  } catch (error) {
    console.error('匯出資料失敗:', error);
    throw new Error('匯出資料時發生錯誤');
  }
};

// 匯入資料
export const importData = async (file) => {
  console.log('匯入資料...');
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    const db = await initDB();
    
    // 使用交易來確保資料一致性
    const tx = db.transaction([GOAL_STORE, TASK_STORE], 'readwrite');
    
    // 清空現有資料
    await tx.objectStore(GOAL_STORE).clear();
    await tx.objectStore(TASK_STORE).clear();
    
    // 匯入新資料
    if (data.goals?.length) {
      for (const goal of data.goals) {
        await tx.objectStore(GOAL_STORE).add(goal);
      }
    }
    
    // 處理任務並去重
    if (data.tasks?.length) {
      // 將任務按日期和目標ID分組，只保留最新的版本
      const taskMap = {};
      
      for (const task of data.tasks) {
        const key = `${task.date}_${task.goalId}`;
        
        if (!taskMap[key] || new Date(task.updatedAt) > new Date(taskMap[key].updatedAt)) {
          taskMap[key] = task;
        }
      }
      
      // 只匯入去重後的任務
      for (const key in taskMap) {
        await tx.objectStore(TASK_STORE).add(taskMap[key]);
      }
      
      console.log(`匯入 ${Object.keys(taskMap).length} 筆任務（原始數據: ${data.tasks.length} 筆）`);
    }
    
    await tx.done;
    console.log('資料匯入成功');
    return true;
  } catch (error) {
    console.error('匯入資料失敗:', error);
    throw new Error('匯入資料時發生錯誤');
  }
}; 