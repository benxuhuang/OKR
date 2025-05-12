// Service Worker for OKR Application
const CACHE_NAME = 'okr-app-v2'; // 升級版本號
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico'
];

// 監聽跳過等待消息，用於強制激活
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 安裝階段：快取核心資源
self.addEventListener('install', event => {
  console.log('[Service Worker] 安裝中...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] 開啟快取並添加資源');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // 強制跳過等待階段，立即激活
        console.log('[Service Worker] 跳過等待階段');
        return self.skipWaiting();
      })
  );
});

// 激活階段：清理舊的快取
self.addEventListener('activate', event => {
  console.log('[Service Worker] 激活中...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('[Service Worker] 刪除舊快取:', name);
            return caches.delete(name);
          })
      );
    })
    .then(() => {
      // 立即控制所有頁面
      console.log('[Service Worker] 接管現有頁面');
      return self.clients.claim();
    })
  );
});

// 攔截請求並提供快取回應
self.addEventListener('fetch', event => {
  // 只處理GET請求
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果找到快取中的回應，則返回該回應
        if (response) {
          console.log('[Service Worker] 從快取返回:', event.request.url);
          return response;
        }

        // 如果沒有在快取中找到，則從網絡獲取
        console.log('[Service Worker] 從網絡獲取:', event.request.url);
        return fetch(event.request).then(
          response => {
            // 檢查是否獲得了有效的回應
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 複製回應以在快取中存儲副本
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                console.log('[Service Worker] 將網絡回應快取:', event.request.url);
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
      .catch(error => {
        console.error('[Service Worker] 獲取資源時發生錯誤:', error);
        // 可以在這裡提供一個回退頁面或默認內容
      })
  );
});

// 處理推送通知
self.addEventListener('push', event => {
  console.log('[Service Worker] 收到推送事件');
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
      console.log('[Service Worker] 推送數據:', data);
    } catch (e) {
      console.log('[Service Worker] 無法解析JSON，使用文本:', event.data.text());
      data = {
        title: '目標提醒',
        body: event.data.text()
      };
    }
  }

  const options = {
    body: data.body || '有新的目標需要關注',
    icon: data.icon || '/favicon.ico',
    badge: data.badge || '/favicon.ico',
    data: data.data || { url: '/' },
    requireInteraction: data.requireInteraction || true,
    vibrate: data.vibrate || [200, 100, 200], // 震動模式 (對Android裝置)
    actions: data.actions || [],
    tag: data.tag || 'okr-notification-' + Date.now(), // 唯一標籤
    renotify: true // 即使具有相同標籤，也強制重新通知用戶
  };

  console.log('[Service Worker] 顯示通知:', data.title || '目標提醒');
  event.waitUntil(
    self.registration.showNotification(data.title || '目標提醒', options)
      .then(() => {
        console.log('[Service Worker] 通知已顯示');
      })
      .catch(error => {
        console.error('[Service Worker] 顯示通知時出錯:', error);
      })
  );
});

// 處理通知點擊事件
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] 通知被點擊', event.notification.tag);
  event.notification.close();

  // 打開或聚焦到特定頁面
  const urlToOpen = (event.notification.data && event.notification.data.url) 
    ? event.notification.data.url 
    : '/';

  event.waitUntil(
    clients.matchAll({
      type: 'window'
    }).then(clientList => {
      console.log('[Service Worker] 客戶端列表:', clientList.length);
      
      // 檢查是否已有打開的窗口
      for (let client of clientList) {
        console.log('[Service Worker] 檢查客戶端:', client.url);
        if (client.url === urlToOpen && 'focus' in client) {
          console.log('[Service Worker] 聚焦現有窗口');
          return client.focus();
        }
      }
      
      // 如果沒有打開的窗口，打開一個新窗口
      if (clients.openWindow) {
        console.log('[Service Worker] 打開新窗口:', urlToOpen);
        return clients.openWindow(urlToOpen);
      }
    })
  );
}); 