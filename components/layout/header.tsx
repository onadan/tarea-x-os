"use client";

import { ModeToggle } from "@/components/theme-mode-toggle";
import { useAuth } from "@/providers/auth-context";
import { User, User2 } from "lucide-react";

import Image from "next/image";
import SignOutModal from "../auth/sign-out-modal";

export function Header() {
  const { user } = useAuth();

  const avatar = user?.photoURL;
  return (
    <header className="h-20">
      <div className="container mx-auto flex items-center justify-between h-full px-5">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" height="36" width="36" alt="" />

          <h1 className="font-semibold text-xl">TareaX</h1>
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />

          <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-100 text-neutral-300 dark:text-neutral-500 dark:bg-neutral-700 flex justify-center items-center border">
            {avatar ? (
              <img src={avatar || ""} alt="" className="" />
            ) : (
              <User2 className="size-6" />
            )}
          </div>

          <SignOutModal />
        </div>
      </div>
    </header>
  );
}
