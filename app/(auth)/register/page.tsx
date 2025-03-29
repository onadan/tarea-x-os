"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { ModeToggle } from "@/components/theme-mode-toggle";
import SignInWithGoogleButton from "@/components/auth/sign-in-with-google-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signUpWithEmailAndPassword } from "@/services/authService";

// Add this import at the top with other imports
import { Alert, AlertDescription } from "@/components/ui/alert";

const calculatePasswordStrength = (password: string): number => {
  let score = 0;

  // Length check
  if (password.length >= 8) score += 25;

  // Uppercase check
  if (/[A-Z]/.test(password)) score += 25;

  // Lowercase check
  if (/[a-z]/.test(password)) score += 25;

  // Numbers and special characters check
  if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) score += 25;

  return score;
};

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState<string | null>(null);  // Add this line

  const formSchema = z
    .object({
      email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await signUpWithEmailAndPassword(
        values.email,
        values.password
      );

      if (response) {
        toast.success("Account created successfully");
        router.push("/login");
      }
    } catch (error: any) {
      setError(error.message || "Failed to create account. Please try again.");
      toast.error(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full p-6 space-y-8 bg-white dark:bg-neutral-900 rounded-2xl shadow-lg">
        <div className="flex flex-col items-center gap-4">
          {/* Logo and title */}
          <div className="relative aspect-square w-16">
            <Image
              src="/logo.png"
              alt="TareaX logo"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <h2 className="text-3xl font-bold text-center">Welcome to TareaX</h2>
          
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="mb-4 bg-red-500/10 border-none">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="email">Email</Label>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="password">Password</Label>
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setPasswordStrength(
                          calculatePasswordStrength(e.target.value)
                        );
                      }}
                    />
                  </FormControl>
                  <Progress
                    value={passwordStrength}
                    className={`h-1 ${
                      passwordStrength === 100
                        ? "bg-green-500"
                        : passwordStrength >= 50
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  />
                  <p className="text-xs text-neutral-500">
                    Password strength:{" "}
                    {passwordStrength === 100
                      ? "Strong"
                      : passwordStrength >= 50
                      ? "Medium"
                      : "Weak"}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <FormControl>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
        </Form>

        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-sm text-neutral-500">OR</span>
          <Separator className="flex-1" />
        </div>

        <SignInWithGoogleButton />

        <p className="text-center text-sm text-neutral-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-semibold"
          >
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
