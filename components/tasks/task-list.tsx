"use client";

import type { Task } from "@/types/task";
import { TaskItem } from "./task-item";

interface TaskListProps {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onUpdateTask: (task: Task) => void;
}

export function TaskList({ tasks, onDeleteTask, onUpdateTask }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-center py-10 bg-gray-50 dark:bg-neutral-900 rounded-lg">
        <p className="text-gray-500">
          No tasks yet. Add a task to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onDelete={onDeleteTask}
          onUpdate={onUpdateTask}
        />
      ))}
    </div>
  );
}
