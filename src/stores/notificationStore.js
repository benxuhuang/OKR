import { defineStore } from 'pinia';
import { 
  getNotificationPermission, 
  requestNotificationPermission, 
  isNotificationSupported 
} from '../services/notificationService';
import { startReminderService, stopReminderService } from '../services/reminderService';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    permissionStatus: 'default', // 'granted', 'denied', 'default', 'unsupported'
    notificationsEnabled: false,
    backgroundMonitorEnabled: false
  }),

  getters: {
    isPermissionGranted: (state) => state.permissionStatus === 'granted',
    isPermissionDenied: (state) => state.permissionStatus === 'denied',
    isPermissionDefault: (state) => state.permissionStatus === 'default',
    isSupported: (state) => state.permissionStatus !== 'unsupported',
  },

  actions: {
    // 初始化通知設定
    async initNotificationSettings() {
      // 檢查瀏覽器支援
      if (!isNotificationSupported()) {
        this.permissionStatus = 'unsupported';
        this.notificationsEnabled = false;
        this.backgroundMonitorEnabled = false;
        return;
      }

      // 檢查本地存儲中的設定
      const savedSettings = JSON.parse(localStorage.getItem('okr_notification_settings') || '{}');
      
      // 獲取當前權限狀態
      this.permissionStatus = getNotificationPermission();
      
      // 如果權限已授權，則根據用戶設定啟用或禁用通知
      if (this.permissionStatus === 'granted') {
        this.notificationsEnabled = savedSettings.notificationsEnabled !== false;
        this.backgroundMonitorEnabled = savedSettings.backgroundMonitorEnabled !== false;
        
        // 自動啟動提醒服務（如果已啟用）
        if (this.notificationsEnabled) {
          startReminderService();
        }
      } else {
        this.notificationsEnabled = false;
        this.backgroundMonitorEnabled = false;
      }

      // 存儲設定
      this.saveSettings();
    },

    // 請求通知權限
    async requestPermission() {
      const granted = await requestNotificationPermission();
      this.permissionStatus = getNotificationPermission();
      
      if (granted) {
        this.notificationsEnabled = true;
        this.backgroundMonitorEnabled = true;
        this.saveSettings();
        startReminderService();
      }
      
      return granted;
    },

    // 切換通知功能
    toggleNotifications(value) {
      // 如果權限未獲授權，則請求權限
      if (this.permissionStatus !== 'granted') {
        return this.requestPermission();
      }

      // 更新狀態
      this.notificationsEnabled = value !== undefined ? value : !this.notificationsEnabled;
      
      // 根據啟用狀態啟動或停止提醒服務
      if (this.notificationsEnabled) {
        startReminderService();
      } else {
        stopReminderService();
      }
      
      // 存儲設定
      this.saveSettings();
    },

    // 切換背景監控功能
    toggleBackgroundMonitor(value) {
      this.backgroundMonitorEnabled = value !== undefined ? value : !this.backgroundMonitorEnabled;
      
      // 存儲設定
      this.saveSettings();
      
      // 如果禁用背景監控但啟用了通知，需要重啟提醒服務以應用新設定
      if (this.notificationsEnabled) {
        stopReminderService();
        startReminderService();
      }
    },

    // 保存設定到本地存儲
    saveSettings() {
      const settings = {
        notificationsEnabled: this.notificationsEnabled,
        backgroundMonitorEnabled: this.backgroundMonitorEnabled
      };
      
      localStorage.setItem('okr_notification_settings', JSON.stringify(settings));
    }
  }
}); 