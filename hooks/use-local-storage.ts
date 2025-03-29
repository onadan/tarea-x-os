"use client"

import { useState, useCallback } from "react"

export function useLocalStorage() {
  const [isReady, setIsReady] = useState(false)

  // Initialize IndexedDB
  const initDB = useCallback(async () => {
    if (typeof window === "undefined") return null

    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("TaskManagerDB", 1)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains("keyValueStore")) {
          db.createObjectStore("keyValueStore")
        }
      }

      request.onsuccess = (event) => {
        setIsReady(true)
        resolve((event.target as IDBOpenDBRequest).result)
      }

      request.onerror = (event) => {
        console.error("IndexedDB error:", event)
        reject("IndexedDB error")
      }
    })
  }, [])

  // Get item from IndexedDB
  const getItem = useCallback(
    async (key: string): Promise<string | null> => {
      try {
        const db = await initDB()
        if (!db) return null

        return new Promise((resolve, reject) => {
          const transaction = db.transaction("keyValueStore", "readonly")
          const store = transaction.objectStore("keyValueStore")
          const request = store.get(key)

          request.onsuccess = () => {
            resolve(request.result)
          }

          request.onerror = () => {
            reject(request.error)
          }
        })
      } catch (error) {
        console.error("Error getting item from IndexedDB:", error)
        return null
      }
    },
    [initDB],
  )

  // Set item in IndexedDB
  const setItem = useCallback(
    async (key: string, value: string): Promise<boolean> => {
      try {
        const db = await initDB()
        if (!db) return false

        return new Promise((resolve, reject) => {
          const transaction = db.transaction("keyValueStore", "readwrite")
          const store = transaction.objectStore("keyValueStore")
          const request = store.put(value, key)

          request.onsuccess = () => {
            resolve(true)
          }

          request.onerror = () => {
            reject(request.error)
          }
        })
      } catch (error) {
        console.error("Error setting item in IndexedDB:", error)
        return false
      }
    },
    [initDB],
  )

  // Remove item from IndexedDB
  const removeItem = useCallback(
    async (key: string): Promise<boolean> => {
      try {
        const db = await initDB()
        if (!db) return false

        return new Promise((resolve, reject) => {
          const transaction = db.transaction("keyValueStore", "readwrite")
          const store = transaction.objectStore("keyValueStore")
          const request = store.delete(key)

          request.onsuccess = () => {
            resolve(true)
          }

          request.onerror = () => {
            reject(request.error)
          }
        })
      } catch (error) {
        console.error("Error removing item from IndexedDB:", error)
        return false
      }
    },
    [initDB],
  )

  return { getItem, setItem, removeItem, isReady }
}

