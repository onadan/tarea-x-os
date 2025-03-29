"use client";

import * as React from "react";
import { nanoid } from "nanoid";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { SubtaskList } from "./subtask-list";
import type { Task, SubTask } from "@/types/task";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useOnlineStatus } from "@/hooks/use-online-status";

interface TaskFormProps {
  className?: string;
  onSubmit?: (task: Task) => void;
  isLoading?: boolean;
}

export function TaskForm({ className, onSubmit }: TaskFormProps) {
  const [task, setTask] = React.useState<Omit<Task, "id">>({
    title: "",
    date: new Date(),
    subtasks: [],
    completed: false,
  });

  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const addSubtask = () => {
    setTask((prevTask) => ({
      ...prevTask,
      subtasks: [
        ...prevTask.subtasks,
        { id: nanoid(), text: "", completed: false },
      ],
    }));
  };

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const isOnline = useOnlineStatus();

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError(null);
  //   setIsLoading(true);

  //   // Check online status immediately

  //     // Store task in local storage or IndexedDB here
  //     setIsLoading(false);
  //     onSubmit?.(task); // This will trigger modal close
  //     return;
  //   }

  //   try {
  //     await onSubmit?.(task);
  //     setTask({ name: "", date: "", subtasks: [], status: "pending" });
  //     toast.success("Task created successfully!");
  //   } catch (err) {
  //     setError("Failed to create task. Please try again.");
  //     toast.error("Failed to create task");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   if (onSubmit) {
  //     // Create your task object here and pass it to onSubmit
  //     const task: Task = {
  //       // Add your task properties here
  //     };
  //     onSubmit(task);
  //   }
  // };

  return (
    <form onSubmit={() => {}} className={className}>
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {error}
        </div>
      )}

      {!isOnline && (
        <div className="text-sm text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-md">
          You're offline. Tasks will be synced when you're back online.
        </div>
      )}

      <div className="h-full overflow-hidden flex flex-col gap-4">
        <div className="flex-1 h-full w-full overflow-hidden overflow-y-auto pr-2">
          <div className="flex flex-col gap-4 ">
            <div className="grid gap-2">
              <Label htmlFor="task-name">Task name</Label>
              <Input
                type="text"
                id="task-name"
                name="name"
                value={task.title}
                onChange={handleTaskChange}
                placeholder="Task name"
                onClick={() => !isExpanded && setIsExpanded(true)}
              />
            </div>

            <SubtaskList
              subtasks={task.subtasks}
              onChange={(newSubtasks) =>
                setTask((prev) => ({ ...prev, subtasks: newSubtasks }))
              }
            />

            <Button
              onClick={addSubtask}
              variant={"link"}
              type="button"
              className="w-max cursor-pointer select-none"
            >
              <Plus className="size-4" />
              Add Subtask
            </Button>
          </div>

          {isExpanded && (
            <div className="grid gap-2">
              <Label htmlFor="dateAndTime">Date and Time</Label>
              <Input
                id="dateAndTime"
                name="date"
                type="datetime-local"
                value={task.date}
                onChange={handleTaskChange}
                placeholder="Date and Time"
              />
            </div>
          )}
        </div>

        <div className="shrink-0 justify-end flex ">
          <Button
            type="submit"
            disabled={isLoading || (!isOnline && !task.title)}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Add Task"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
