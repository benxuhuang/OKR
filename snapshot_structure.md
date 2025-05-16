## 專案目錄結構

```text
├── .vscode
│   └── extensions.json
├── Documents
│   ├── Issues.md
│   ├── Prototype
│   │   ├── goals_management.html
│   │   ├── today_tasks.html
│   │   └── weekly_stats.html
│   ├── Snapshots
│   │   ├── Snapshot_v1.0.0.json
│   │   ├── Snapshot_v1.1.0.json
│   │   ├── Snapshot_v1.2.0.json
│   │   ├── Snapshot_v1.3.0.json
│   │   ├── Snapshot_v1.4.0.json
│   │   ├── Snapshot_v1.4.1.json
│   │   ├── Snapshot_v1.5.0.json
│   │   ├── Snapshot_v1.5.1.json
│   │   ├── Snapshot_v1.6.0.json
│   │   ├── Snapshot_v1.7.0.json
│   │   ├── Snapshot_v1.8.0.json
│   │   └── Snapshot_v1.8.1.json
│   ├── Spec.md
│   ├── TaskGenerationLogicRules.md
│   └── Todo.md
├── README.md
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── public
│   ├── 404.html
│   ├── sw.js
│   └── vite.svg
├── snapshot_structure.js
├── src
│   ├── App.vue
│   ├── components
│   │   ├── GoalForm.vue
│   │   ├── GoalList.vue
│   │   └── TodayTasks.vue
│   ├── index.css
│   ├── main.js
│   ├── router
│   │   └── index.js
│   ├── services
│   │   ├── indexedDB.js
│   │   ├── notificationService.js
│   │   ├── progressService.js
│   │   ├── reminderService.js
│   │   ├── taskService.js
│   │   └── weeklyStatsService.js
│   ├── stores
│   │   ├── notificationStore.js
│   │   └── themeStore.js
│   ├── style.css
│   └── views
│       ├── GoalManagement.vue
│       ├── MonthlyStats.vue
│       ├── Settings.vue
│       ├── TodayTasks.vue
│       └── WeeklyStats.vue
├── tailwind.config.js
└── vite.config.js
```

## 函式清單

### snapshot_structure.js
- **foo(...)**
- **useXxx(...)**

### src\services\indexedDB.js
- **resetDatabase()** - 刪除現有資料庫
- **initDB()** - 初始化資料庫
- **addGoal(goal)** - 目標相關操作
- **getAllGoals()**
- **updateGoal(goal)**
- **deleteGoal(id)**
- **getTodayTasks()** - 任務相關操作
- **updateTaskStatus(taskId, status)**
- **exportData()** - 匯出資料
- **importData(file)** - 匯入資料

### src\services\notificationService.js
- **isNotificationSupported()** - 檢查瀏覽器是否支援通知功能
- **isServiceWorkerSupported()** - 檢查瀏覽器是否支援Service Worker
- **registerServiceWorker()** - 註冊Service Worker
- **requestNotificationPermission()** - 請求通知權限
- **getNotificationPermission()** - 獲取當前通知權限狀態
- **sendNotification(title, options = {})** - 發送桌面通知

### src\services\progressService.js
- **getDailyProgress(goalId)**
- **getWeeklyProgress(goalId)**
- **getMonthlyProgress(goalId)**
- **getGoalProgress(goal)**

### src\services\reminderService.js
- **startReminderService()** - 啟動提醒服務
- **stopReminderService()** - 停止提醒服務

### src\services\weeklyStatsService.js
- **formatDate(date)**
- **getConsecutiveDays()**
- **getGoalCategoryRatio()**

### src\views\WeeklyStats.vue
- **label(context)**

## 依賴清單

## okr-system

### devDependencies
```json
{
  "@vitejs/plugin-vue": "^4.2.3",
  "autoprefixer": "^10.4.14",
  "eslint": "^8.45.0",
  "eslint-plugin-vue": "^9.15.1",
  "postcss": "^8.4.27",
  "tailwindcss": "^3.3.3",
  "vite": "^4.4.6"
}
```

### dependencies
```json
{
  "@fortawesome/fontawesome-svg-core": "^6.4.0",
  "@fortawesome/free-solid-svg-icons": "^6.4.0",
  "@fortawesome/vue-fontawesome": "^3.0.3",
  "chart.js": "^4.4.9",
  "idb": "^8.0.3",
  "pinia": "^3.0.2",
  "vue": "^3.3.4",
  "vue-router": "^4.2.4"
}
```

