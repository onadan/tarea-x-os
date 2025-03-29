import { auth } from "@/lib/firebase";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

export const signUpWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    return userCredential.user;
  } catch (error: any) {
    switch (error.code) {
      case "auth/email-already-in-use":
        throw new Error("This email is already registered. Please log in.");
      case "auth/invalid-email":
        throw new Error("Invalid email format");
      case "auth/operation-not-allowed":
        throw new Error("Email/password accounts are not enabled");
      case "auth/weak-password":
        throw new Error("Password is too weak");
      default:
        throw new Error("Failed to create account");
    }
  }
};

export const loginWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error: any) {
    switch (error.code) {
      case "auth/invalid-credential":
        throw new Error("Invalid email or password");
      case "auth/user-not-found":
        throw new Error("No account found with this email");
      case "auth/wrong-password":
        throw new Error("Incorrect password");
      case "auth/invalid-email":
        throw new Error("Invalid email format");
      case "auth/user-disabled":
        throw new Error("This account has been disabled");
      case "auth/too-many-requests":
        throw new Error("Too many failed attempts. Please try again later");
      default:
        throw new Error("Failed to sign in");
    }
  }
};

export const loginWithGoogle = async (): Promise<User> => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  return userCredential.user;
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
};

export const authStateListener = (
  callback: (user: User | null) => void
): void => {
  onAuthStateChanged(auth, callback);
};
