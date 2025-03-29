"use client";

import { useAuth } from "@/providers/auth-context";
import { LoadingScreen } from "@/providers/auth-loader";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ProtectRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthReady && !user) {
      router.push("/login");
    }
  }, [user, router, isAuthReady]);

  if (!isAuthReady) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
