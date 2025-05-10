// IndexedDB 服務
const DB_NAME = 'okr_system';
const DB_VERSION = 1;
const STORE_NAME = 'goals';

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Database error:', event.target.error);
      reject('無法開啟資料庫');
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        // 建立索引
        store.createIndex('title', 'title', { unique: false });
        store.createIndex('frequencyType', 'frequencyType', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
  });
};

export const addGoal = (goal) => {
  return new Promise((resolve, reject) => {
    if (!goal || typeof goal !== 'object') {
      reject('無效的目標資料');
      return;
    }

    // 確保資料可以被序列化
    const safeGoal = {
      ...goal,
      daysOfWeek: Array.isArray(goal.daysOfWeek) ? [...goal.daysOfWeek] : [],
      createdAt: goal.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const request = indexedDB.open(DB_NAME);
    
    request.onerror = (event) => {
      console.error('Database error:', event.target.error);
      reject('開啟資料庫失敗');
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const addRequest = store.add(safeGoal);
      
      addRequest.onsuccess = () => {
        resolve(addRequest.result);
      };
      
      addRequest.onerror = (event) => {
        console.error('Add request error:', event.target.error);
        reject('新增目標失敗');
      };

      transaction.oncomplete = () => {
        db.close();
      };
    };
  });
};

export const getAllGoals = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result);
      };
      
      getAllRequest.onerror = () => {
        reject('取得目標列表失敗');
      };
    };
  });
};

export const updateGoal = (goal) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const putRequest = store.put(goal);
      
      putRequest.onsuccess = () => {
        resolve(putRequest.result);
      };
      
      putRequest.onerror = () => {
        reject('更新目標失敗');
      };
    };
  });
};

export const deleteGoal = (id) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => {
        resolve();
      };
      
      deleteRequest.onerror = () => {
        reject('刪除目標失敗');
      };
    };
  });
}; 