/**
 * 瀏覽器通知服務
 * 處理通知權限管理與推播功能
 */

// 檢查瀏覽器是否支援通知功能
export const isNotificationSupported = () => {
  return 'Notification' in window;
};

// 請求通知權限
export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) {
    console.error('此瀏覽器不支援通知功能');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    console.log('通知權限狀態:', permission);
    return permission === 'granted';
  } catch (error) {
    console.error('請求通知權限時發生錯誤:', error);
    return false;
  }
};

// 獲取當前通知權限狀態
export const getNotificationPermission = () => {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }
  return Notification.permission;
};

// 發送桌面通知
export const sendNotification = (title, options = {}) => {
  if (!isNotificationSupported()) {
    console.error('此瀏覽器不支援通知功能');
    return null;
  }

  if (Notification.permission !== 'granted') {
    console.warn('沒有通知權限，無法發送通知');
    return null;
  }

  try {
    // 設定預設選項
    const defaultOptions = {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      silent: false,
    };

    // 合併用戶選項和預設選項
    const notificationOptions = { ...defaultOptions, ...options };
    
    // 建立並發送通知
    const notification = new Notification(title, notificationOptions);
    
    // 設定點擊事件
    notification.onclick = () => {
      window.focus();
      notification.close();
      if (options.onClick) {
        options.onClick();
      }
    };

    return notification;
  } catch (error) {
    console.error('發送通知時發生錯誤:', error);
    return null;
  }
}; 