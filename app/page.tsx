"use client";

import { ModeToggle } from "@/components/theme-mode-toggle";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { useAuth } from "../context/auth-context";

const today = format(new Date(), "EEEE, d MMMM, yyyy");

export default function Home() {
  const { user, signInWithPopUp } = useAuth();

  return (
    <>
      {/* Header */}
      <div className="flex h-20  mx-auto container px-3 items-center justify-between">
        <div className="flex gap-2 items-center">
          <div className="relative aspect-square w-12">
            <Image
              src="/logo.png"
              alt="TareaX logo"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <h1 className="text-2xl font-semibold font-outfit ">TareaX</h1>
        </div>

        <div className="flex gap-4 items-center">
          {!user ? (
            <Button variant={"outline"} onClick={signInWithPopUp}>
              Log In / Sign Up
            </Button>
          ) : (
            <p className="font-semibold">Hello, {user?.displayName}</p>
          )}

          <ModeToggle />
        </div>
      </div>

      <main className="container mx-auto">
        <div className="px-5 flex flex-col gap-4 mt-10">
          <h1 className=" text-xl text-neutral-400 font-medium ">{today}</h1>
          {/* <h1 className=" text-2xl text-neutral-400 font-bold ">
            hello, chef!
          </h1> */}

          <h1 className=" text-6xl font-outfit font-semibold ">
            What are you doing today?
          </h1>

          <div className="flex items-center mt-4 gap-4  w-full  justify-center">
            <div className="flex flex-1 w-full items-center relative">
              <div className="absolute left-4 top-4.5">
                <Sparkles className="size-4 text-primary" />
              </div>

              <input
                type="text"
                className="h-12 pl-10  shrink-0 font-semibold w-full border-2 rounded-3xl px-3 border-primary shadow"
                placeholder="Ask AI: I want to bake a cake"
              />
            </div>

            {/* <Button size={"lg"} className="my-0 shrink-0">
              <Plus className="size-4" />
              Add task
            </Button> */}
          </div>

          <div></div>
        </div>
      </main>
    </>
  );
}
