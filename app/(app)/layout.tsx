"use client";

import { Header } from "@/components/layout/header";
import { ProtectRoute } from "@/components/protected-route";
import { OnlineStatus } from "@/components/status/online-status";
import { AuthLoader } from "@/providers/auth-loader";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthLoader>
      <ProtectRoute>
        <div className="absolute -top-20 left-0 -z-10 h-[200px] w-full">
          <div className="absolute inset-0 bg-gradient-to-br from-[#dbeafe]/50 via-[#93c5fd]/40 to-[#f9fafb] dark:from-transparent dark:via-[#475569]/20 dark:to-[#0f172a]/40 blur-3xl"></div>
        </div>
        <Header />

        <div className="mx-auto container px-5">{children}</div>

        {/* <OnlineStatus /> */}
      </ProtectRoute>
    </AuthLoader>
  );
}
