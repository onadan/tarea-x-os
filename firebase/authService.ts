import { auth } from "./firebaseConfig";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// Sign-Up
export const signUpWithEmailandPassword = async (
  email: string,
  password: string
): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

// Login
export const loginWithEmailandPassword = async (
  email: string,
  password: string
): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

// Logout
export const logout = async (): Promise<void> => {
  await signOut(auth);
};

// Track Auth State
export const authStateListener = (
  callback: (user: User | null) => void
): void => {
  onAuthStateChanged(auth, callback);
};
