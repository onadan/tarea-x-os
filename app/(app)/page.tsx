"use client";

import { TaskForm } from "@/components/tasks/task-form";
import { Tasks } from "@/components/tasks/tasks";
import { Button } from "@/components/ui/button";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { useAuth } from "@/providers/auth-context";
import { format } from "date-fns";
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  const { user } = useAuth();
  const today = format(new Date(), "EEEE, d MMMM, yyyy");
  const isOnline = useOnlineStatus();

  return (
    <>
      <div className="mt-5">
        <h1 className="text-base md:text-base text-neutral-700 dark:text-neutral-400 font-medium ">
          {today}
        </h1>

        <h1 className="text-2xl md:text-3xl text-neutral-900 dark:text-neutral-100 font-bold mt-2">
          Hello, {user?.displayName}
        </h1>
      </div>

      <div className="flex gap-4 w-full mt-10 ">
        <div className="w-[320px] max-h-[calc(100vh-300px)] h-full overflow-hidden shrink-0 hidden md:flex flex-col gap-4">
          {/* <AddTaskForm onAddTask={() => {}} /> */}

          <div className="flex items-center gap-4">
            <Button
              // onClick={openAIModal}
              variant={"outline"}
              className="font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Sparkles className="size-4" />
              AI Suggestions
            </Button>

            <div className="flex items-center">
              <span
                className={`h-3 w-3 rounded-full mr-2 ${
                  isOnline ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
              <span className="text-sm">{isOnline ? "Online" : "Offline"}</span>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Add New Task</CardTitle>
            </CardHeader>
            <CardContent className="w-full h-full overflow-hidden overflow-y-auto">
              <TaskForm  />
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          <Tasks />
        </div>
      </div>
    </>
  );
}
