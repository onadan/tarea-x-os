import { db } from "./firebaseConfig";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

interface UserData {
  uid: string;
  name: string;
  email: string;
  createdAt: number;
}

// 🔹 Create or Update User Data
export const saveUserData = async (user: UserData): Promise<void> => {
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, user, { merge: true }); // Merge to avoid overwriting existing fields
};

// 🔹 Get User Data
export const getUserData = async (uid: string): Promise<UserData | null> => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? (userSnap.data() as UserData) : null;
};

// 🔹 Update User Data
export const updateUserData = async (
  uid: string,
  updatedData: Partial<UserData>
): Promise<void> => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, updatedData);
};

// 🔹 Delete User Data
export const deleteUserData = async (uid: string): Promise<void> => {
  const userRef = doc(db, "users", uid);
  await deleteDoc(userRef);
};
