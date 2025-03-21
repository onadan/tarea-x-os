"use client";

import { ModeToggle } from "@/components/theme-mode-toggle";
import { Button } from "@/components/ui/button";
import {
  DotIcon,
  LucideMenu,
  MenuSquare,
  MoreVertical,
  Plus,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { useAuth } from "../context/auth-context";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddTaskDrawerDialog } from "@/components/tasks/add-task-modal";

export default function Home() {
  const { user, signInWithPopUp } = useAuth();

  const today = format(new Date(), "EEEE, d MMMM, yyyy");
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
        <div className="px-5 flex flex-col gap-2 md:gap-4 mt-10">
          <h1 className="text-lg md:text-xl text-neutral-400 font-medium ">
            {today}
          </h1>
          {/* <h1 className=" text-2xl text-neutral-400 font-bold ">
            hello, chef!
          </h1> */}

          <h1 className="text-2xl lg:text-6xl font-outfit font-semibold ">
            What are you doing today?
          </h1>

          <div className="flex items-center mt-4 gap-4  w-full ">
            {/* <div className="flex flex-1 w-full items-center relative">
              <div className="absolute left-4 top-4.5">
                <Sparkles className="size-4 text-primary" />
              </div>

              <input
                type="text"
                className="h-12 pl-10  shrink-0 font-semibold w-full border-2 rounded-3xl px-3 border-primary shadow"
                placeholder="Ask AI: I want to bake a cake"
              />
            </div> */}

            <Button variant={"outline"} className="my-0 shrink-0">
              <Sparkles className="size-4 animate-pulse" />
              AI Suggestion
            </Button>

            <AddTaskDrawerDialog />
          </div>

          <div></div>
        </div>
      </main>

      <section className="px-5">
        <div className="container mx-auto mt-10 bg-white dark:bg-neutral-900 min-h-[200px] rounded-2xl p-4 flex flex-col gap-4">
          <h3 className="font-semibold text-2xl">Your Tasks</h3>

          <TaskTable />
        </div>
      </section>
    </>
  );
}

const TaskTable = () => {
  return (
    <Table>
      <TableCaption>A list of your recent tasks.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="">Task name</TableHead>
          <TableHead>Day</TableHead>
          <TableHead>Time</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">
            <MoreVertical className="size-4 cursor-pointer text-neutral-600" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
