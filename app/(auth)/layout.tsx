"use client";

import { useAuth } from "@/providers/auth-context";
import { LoadingScreen } from "@/providers/auth-loader";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, isAuthReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthReady && user) {
      router.push("/");
    }
  }, [user, router, isAuthReady]);

  if (!isAuthReady) {
    return <LoadingScreen />;
  }

  if (user) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
