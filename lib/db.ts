import { openDB } from "idb";
import { Task } from "@/types";

const DB_NAME = "annotation-console";
const STORE_NAME = "tasks";

let dbPromise: ReturnType<typeof openDB> | null = null;

async function getDB() {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB is only available in the browser");
  }

  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, {
            keyPath: "id",
          });
        }
      },
    });
  }

  return dbPromise;
}

export async function saveTasks(tasks: Task[]) {
  const db = await getDB();

  const tx = db.transaction(STORE_NAME, "readwrite");

  for (const task of tasks) {
    tx.store.put(task);
  }

  await tx.done;
}

export async function getCachedTasks(): Promise<Task[]> {
  const db = await getDB();

  return db.getAll(STORE_NAME);
}

export async function clearCache() {
  const db = await getDB();

  await db.clear(STORE_NAME);
}
