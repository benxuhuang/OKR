import { openDB } from 'idb';

const dbName = 'okrDB';
const dbVersion = 1;

export async function initDB() {
  const db = await openDB(dbName, dbVersion, {
    upgrade(db) {
      // Create a store of objects
      const objectiveStore = db.createObjectStore('objectives', {
        keyPath: 'id',
        autoIncrement: true,
      });
      objectiveStore.createIndex('date', 'date');
      
      const keyResultStore = db.createObjectStore('keyResults', {
        keyPath: 'id',
        autoIncrement: true,
      });
      keyResultStore.createIndex('objectiveId', 'objectiveId');
    },
  });
  return db;
}

export async function addObjective(objective) {
  const db = await initDB();
  return db.add('objectives', objective);
}

export async function getObjectives() {
  const db = await initDB();
  return db.getAll('objectives');
}

export async function addKeyResult(keyResult) {
  const db = await initDB();
  return db.add('keyResults', keyResult);
}

export async function getKeyResults(objectiveId) {
  const db = await initDB();
  const tx = db.transaction('keyResults', 'readonly');
  const index = tx.store.index('objectiveId');
  return index.getAll(objectiveId);
} 