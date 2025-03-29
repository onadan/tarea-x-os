"use client";

import { useAuth } from "@/providers/auth-context";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

export function AuthLoader({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isAuthReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthReady && !user) {
      router.push("/login");
      return;
    }
  }, [user, router, isAuthReady]);

  if (!isAuthReady) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
