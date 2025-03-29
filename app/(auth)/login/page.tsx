"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ModeToggle } from "@/components/theme-mode-toggle";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useFormField,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import SignInWithGoogleButton from "@/components/auth/sign-in-with-google-button";
// import { loginWithEmailAndPassword } from "@/firebase/authService";

export default function Page() {
  //   const { user, signInWithPopUp } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const formSchema = z.object({
    email: z.string().min(1, "Required").email(),
    password: z.string().min(1, "Required"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-10">
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
          <h2 className="text-3xl font-bold text-center">Welcome to TareaX</h2>
          <p className="text-neutral-500">Sign in to manage your tasks</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <Label htmlFor="current-password">Password</Label>
                  <FormControl>
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in with Email"
              )}
            </Button>
          </form>
        </Form>

        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-sm text-neutral-500">OR</span>
          <Separator className="flex-1" />
        </div>

        <SignInWithGoogleButton loading={isLoading} setLoading={setIsLoading} />

        <p className="text-center text-sm text-neutral-500 dark:text-foreground ">
          Already have an account?{" "}
          <Link href="/register" className=" hover:underline">
            <span className="text-primary dark:text-white font-bold">
              Register
            </span>
          </Link>
        </p>

        <div className="flex justify-end items-center">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
