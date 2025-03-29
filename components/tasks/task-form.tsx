"use client";

import * as React from "react";
import { nanoid } from "nanoid";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { SubtaskList } from "./subtask-list";
import type { Task } from "@/types/task";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/providers/auth-context";
import { createTask } from "@/services/taskService";
import { useOnlineStatus } from "@/hooks/use-online-status";

const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  date: z.date(),
  completed: z.boolean().default(false),
  subtasks: z.array(z.object({
    id: z.string(),
    text: z.string(),
    completed: z.boolean()
  })).default([]),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps extends React.ComponentProps<"div"> {
  className?: string;
  onSuccess?: () => void;
}

export function TaskForm({  onSuccess }: TaskFormProps) {
  const { user } = useAuth();
  const isOnline = useOnlineStatus();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      date: new Date(),
      completed: false,
      subtasks: [],
    }
  });

  const subtasks = form.watch("subtasks");

  const addSubtask = () => {
    const currentSubtasks = form.getValues("subtasks") || [];
    form.setValue("subtasks", [
      ...currentSubtasks, 
      { id: nanoid(), text: "", completed: false }
    ], { shouldValidate: true });
  };

  const onSubmit = async (data: TaskFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await createTask(user.uid, data);
      toast.success("Task created successfully!");
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error(!isOnline 
        ? "You're offline. Task will sync when you're back online." 
        : "Failed to create task"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("grid items-start gap-4 overflow-hidden h-full w-full")}>
      {!isOnline && (
        <div className="text-sm text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-md">
          You're offline. Tasks will be synced when you're back online.
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <Label>Task title</Label>
                <FormControl>
                  <Input placeholder="Enter task title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <SubtaskList
            subtasks={subtasks || []}
            onChange={(newSubtasks) => form.setValue("subtasks", newSubtasks, { shouldValidate: true })}
          />

          <Button
            onClick={(e) => {
              e.preventDefault();
              addSubtask();
            }}
            variant="link"
            type="button"
            className="w-max"
          >
            <Plus className="size-4" />
            Add Subtask
          </Button>

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <Label>Date</Label>
                <FormControl>
                  <Input 
                    type="datetime-local" 
                    {...field} 
                    value={field.value ? field.value.toISOString().slice(0, 16) : ''}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Add Task"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
