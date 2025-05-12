// Service Worker for OKR Application
const CACHE_NAME = 'okr-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico'
];

// 安裝階段：快取核心資源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 激活階段：清理舊的快取
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});

// 攔截請求並提供快取回應
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// 處理推送通知
self.addEventListener('push', event => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
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
    data: data.data || {},
    requireInteraction: data.requireInteraction || true,
    actions: data.actions || []
  };

  event.waitUntil(
    self.registration.showNotification(data.title || '目標提醒', options)
  );
});

// 處理通知點擊事件
self.addEventListener('notificationclick', event => {
  event.notification.close();

  // 打開或聚焦到特定頁面
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.matchAll({
        type: 'window'
      }).then(clientList => {
        // 檢查是否已有打開的窗口
        for (let client of clientList) {
          if (client.url === event.notification.data.url && 'focus' in client) {
            return client.focus();
          }
        }
        // 如果沒有打開的窗口，打開一個新窗口
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url);
        }
      })
    );
  } else {
    // 默認行為：打開或聚焦到主頁
    event.waitUntil(
      clients.matchAll({
        type: 'window'
      }).then(clientList => {
        for (let client of clientList) {
          if ('focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
}); 