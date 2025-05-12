/**
 * 瀏覽器通知服務
 * 處理通知權限管理與推播功能
 */

// 檢查瀏覽器是否支援通知功能
export const isNotificationSupported = () => {
  return 'Notification' in window;
};

// 檢查瀏覽器是否支援Service Worker
export const isServiceWorkerSupported = () => {
  return 'serviceWorker' in navigator;
};

// 註冊Service Worker
export const registerServiceWorker = async () => {
  if (!isServiceWorkerSupported()) {
    console.error('此瀏覽器不支援Service Worker');
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker 註冊成功:', registration.scope);
    return true;
  } catch (error) {
    console.error('Service Worker 註冊失敗:', error);
    return false;
  }
};

// 請求通知權限
export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) {
    console.error('此瀏覽器不支援通知功能');
    return false;
  }

  try {
    // 先註冊 Service Worker (特別是行動裝置需要)
    if (isServiceWorkerSupported()) {
      await registerServiceWorker();
    }
    
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
    
    // 使用 Service Worker 發送通知 (優先，特別是行動裝置)
    if (isServiceWorkerSupported() && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, notificationOptions);
      });
      return true;
    } else {
      // 回退到標準 Notification API (桌面瀏覽器)
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
    }
  } catch (error) {
    console.error('發送通知時發生錯誤:', error);
    return null;
  }
}; 