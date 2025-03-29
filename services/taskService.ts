import { db } from "@/lib/firebase";
import { Task } from "@/types/task";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { nanoid } from "nanoid";

export const createTask = async (
  userId: string,
  task: Omit<Task, "id" | "createdAt">
) => {
  const tasksRef = collection(db, "tasks");
  const clientTimestamp = new Date().toISOString();

  // Set a shorter timeout for offline operations
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("timeout")), 2000);
  });

  const newTask = {
    ...task,
    userId,
    createdAt: serverTimestamp(),
    clientTimestamp,
    completed: false,
    syncStatus: navigator.onLine ? "synced" : "pending",
  };

  try {
    const docRef: any = await Promise.race([
      addDoc(tasksRef, newTask),
      timeoutPromise,
    ]).catch(() => {
      return {
        id: `temp_${nanoid()}`,
      };
    });

    const taskWithId = {
      id: docRef.id,
      ...newTask,
      createdAt: clientTimestamp,
    };

    return taskWithId;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const checkAndSyncTasks = async (userId: string) => {
  if (!navigator.onLine) return;

  const tasksRef = collection(db, "tasks");
  const q = query(
    tasksRef,
    where("userId", "==", userId),
    where("syncStatus", "==", "pending")
  );

  try {
    const snapshot = await getDocs(q);
    const syncPromises = snapshot.docs.map((doc) =>
      updateDoc(doc.ref, {
        syncStatus: "synced",
        lastSynced: serverTimestamp(),
      })
    );
    await Promise.all(syncPromises);
  } catch (error) {
    console.error("Error syncing tasks:", error);
    throw error;
  }
};

export const getUserTasks = async (userId: string) => {
  const tasksRef = collection(db, "tasks");
  const q = query(tasksRef, where("userId", "==", userId));

  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,       
        createdAt: data.createdAt || data.clientTimestamp,
      };
    }) as Task[];
  } catch (error) {
    if (!navigator.onLine) {      
      const cachedSnapshot = await getDocs(q);
      return cachedSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
    }
    throw error;
  }
};

export const updateTask = async (taskId: string, updates: Partial<Task>) => {
  const taskRef = doc(db, "tasks", taskId);
  const updatedData = {
    ...updates,
    lastModified: serverTimestamp(),
    syncStatus: navigator.onLine ? "synced" : "pending",
  };

  await updateDoc(taskRef, updatedData);
  return updatedData;
};

export const deleteTask = async (taskId: string) => {
  const taskRef = doc(db, "tasks", taskId);

  try {
    await deleteDoc(taskRef);
    return true;
  } catch (error) {
    if (!navigator.onLine) {
      // Mark for deletion when back online
      await updateDoc(taskRef, {
        syncStatus: "pending-deletion",
        lastModified: serverTimestamp(),
      });
      return true;
    }
    throw error;
  }
};


export const syncPendingTasks = async (userId: string) => {
  if (!navigator.onLine) return;

  const tasksRef = collection(db, "tasks");
  const pendingQuery = query(
    tasksRef,
    where("userId", "==", userId),
    where("syncStatus", "in", ["pending", "pending-deletion"])
  );

  const pendingTasks = await getDocs(pendingQuery);

  const syncPromises = pendingTasks.docs.map(async (doc) => {
    const task = doc.data();
    if (task.syncStatus === "pending-deletion") {
      return deleteDoc(doc.ref);
    }
    return updateDoc(doc.ref, { syncStatus: "synced" });
  });

  await Promise.all(syncPromises);
};
