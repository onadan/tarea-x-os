"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { ModeToggle } from "@/components/theme-mode-toggle";
import SignInWithGoogleButton from "@/components/auth/sign-in-with-google-button";

export default function Page() {
  // const { user, signInWithPopUp } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full p-6 space-y-8 bg-white dark:bg-neutral-900 rounded-2xl shadow-lg">
        <div className="flex flex-col items-center gap-4">
          <div className="relative aspect-square w-16">
            <Image
              src="/logo.png"
              alt="TareaX logo"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <h2 className="text-3xl font-bold text-center">Create an Account</h2>
          <p className="text-neutral-500">
            Sign up to start managing your tasks
          </p>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              //   onChange={handlePasswordChange}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={errors.password ? "border-red-500" : ""}
            />
            <Progress value={passwordStrength} className="h-1" />
            <p className="text-xs text-neutral-500">
              Password strength:{" "}
              {passwordStrength === 100
                ? "Strong"
                : passwordStrength >= 50
                ? "Medium"
                : "Weak"}
            </p>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={errors.confirmPassword ? "border-red-500" : ""}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>

        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-sm text-neutral-500">OR</span>
          <Separator className="flex-1" />
        </div>

        <SignInWithGoogleButton loading={isLoading} setLoading={setIsLoading} />

        <p className="text-center text-sm text-neutral-500">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>

        <div className="flex justify-end items-center">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
