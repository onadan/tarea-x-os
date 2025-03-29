"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskForm } from "./task-form";
// import { createTask } from "@/services/taskService";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import { Task } from "@/types/task";
import { useAuth } from "@/providers/auth-context";
import { useOnlineStatus } from "@/hooks/use-online-status";

export function AddTaskDrawerDialog() {
  const [open, setOpen] = React.useState(false);
  const { user } = useAuth();

  const isOnline = useOnlineStatus();

  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (task: Omit<Task, "id">) => {
    if (!user) return;
    setIsLoading(true);

    // try {
    //   const createdTask = await createTask(user.uid, {
    //     ...task,
    //     status: 'pending',
    //   });

    //   if (!isOnline) {
    //     // setOpen(false);
    //     // setIsLoading(false);
    //     toast.info("You're offline. Task will sync when you're back online.");
    //   } else {
    //     toast.success("Task created successfully!");
    //   }

    //   setOpen(false);
    // } catch (error) {
    //   toast.error("Failed to create task");
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button variant="outline" size="lg">
          <Plus className="size-4" />
          Add task
        </Button>
      }
      title="Add new task"
      description="Fill out the form below to add a new task."
      showFooter
    >
      <TaskForm onSubmit={handleSubmit} isLoading={isLoading} />
    </Modal>
  );
}
