"use client";

import { createContext, useContext, useEffect, useState } from "react";

import {
  onAuthStateChanged,
  signInWithPopup,
  User,
  GoogleAuthProvider,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

import { toast } from "sonner";

const provider = new GoogleAuthProvider();

interface AuthContextType {
  user: User | null;
  isAuthReady: boolean;
  signInWithPopUp: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const signInWithPopUp = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (_error) {
      toast.error("Error signing in");
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (_error) {
      toast.error("Error signing out:");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthReady, signInWithPopUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
