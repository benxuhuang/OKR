/**
 * 目標提醒服務
 * 處理目標提醒邏輯，包括任務檢查和通知觸發
 */

import { sendNotification } from './notificationService';
import { getTodayTasks } from './indexedDB';

let reminderInterval = null;
let backgroundTimer = null;
const REMINDER_CHECK_INTERVAL = 30000; // 30秒檢查一次
const NOTIFICATION_ADVANCE_TIME = 5 * 60 * 1000; // 提前5分鐘提醒

// 啟動提醒服務
export const startReminderService = () => {
  if (reminderInterval) {
    console.log('提醒服務已在運行中');
    return;
  }

  console.log('啟動提醒服務...');
  checkReminders(); // 立即執行一次
  reminderInterval = setInterval(checkReminders, REMINDER_CHECK_INTERVAL);

  // 啟動背景偵測
  startBackgroundDetection();
};

// 停止提醒服務
export const stopReminderService = () => {
  if (reminderInterval) {
    clearInterval(reminderInterval);
    reminderInterval = null;
    console.log('提醒服務已停止');
  }

  // 停止背景偵測
  stopBackgroundDetection();
};

// 檢查提醒
async function checkReminders() {
  try {
    // 取得今日任務
    const todayTasks = await getTodayTasks();
    
    if (!todayTasks || todayTasks.length === 0) {
      console.log('今日沒有任務需要提醒');
      return;
    }

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute; // 轉換為分鐘數
    
    // 篩選出需要提醒的任務
    for (const task of todayTasks) {
      // 跳過已完成的任務
      if (task.status === 'completed') {
        continue;
      }

      // 解析任務時間
      const [taskHour, taskMinute] = task.time.split(':').map(Number);
      const taskTimeInMinutes = taskHour * 60 + taskMinute;
      
      // 計算當前時間與任務時間的差距（以分鐘為單位）
      const timeDifferenceInMinutes = taskTimeInMinutes - currentTime;
      
      // 如果時間差在4-5分鐘之間，則發送提醒
      // 這個範圍確保我們只提醒一次（考慮到30秒的檢查間隔）
      if (timeDifferenceInMinutes > 4 && timeDifferenceInMinutes <= 5) {
        console.log(`需要提醒任務: ${task.title}`);
        sendTaskReminder(task);
      }
    }
  } catch (error) {
    console.error('檢查提醒時發生錯誤:', error);
  }
}

// 發送任務提醒通知
function sendTaskReminder(task) {
  const title = '🕒 目標提醒';
  const options = {
    body: `請記得進行：「${task.title}」`,
    tag: `task-${task.id}`, // 使用唯一標籤避免重複通知
    requireInteraction: true, // 通知會持續顯示直到用戶交互
    onClick: () => {
      // 點擊通知時導航到今日任務頁面
      window.location.href = '/today-tasks';
    }
  };

  sendNotification(title, options);
}

// 啟動背景偵測
function startBackgroundDetection() {
  if (backgroundTimer) {
    return;
  }

  let lastActive = Date.now();
  
  // 設定生命訊號 - 每分鐘更新一次
  backgroundTimer = setInterval(() => {
    // 儲存最後活動時間到localStorage
    localStorage.setItem('okr_last_active', lastActive);
    
    // 檢查用戶是否長時間未活動
    const now = Date.now();
    if (now - lastActive > 10 * 60 * 1000) { // 10分鐘無活動
      console.log('用戶長時間未活動，使用通知喚醒');
      sendNotification('OKR系統提醒', {
        body: '您的OKR系統仍在背景運行中',
        tag: 'background-wake',
        requireInteraction: false
      });
    }
  }, 60000);

  // 用戶活動事件監聽
  const updateActivity = () => {
    lastActive = Date.now();
  };

  window.addEventListener('mousemove', updateActivity);
  window.addEventListener('keydown', updateActivity);
  window.addEventListener('touchstart', updateActivity);
  window.addEventListener('click', updateActivity);
  
  // 處理頁面離開與返回
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      updateActivity();
      console.log('頁面回到前景');
    } else {
      console.log('頁面切換到背景');
    }
  });
}

// 停止背景偵測
function stopBackgroundDetection() {
  if (backgroundTimer) {
    clearInterval(backgroundTimer);
    backgroundTimer = null;
  }
}

// 在卸載前提醒用戶
window.addEventListener('beforeunload', (event) => {
  if (reminderInterval) {
    // 提示用戶關閉頁面將停止提醒服務
    event.preventDefault();
    event.returnValue = '關閉頁面後將無法收到提醒通知。是否確定要離開？';
  }
}); 