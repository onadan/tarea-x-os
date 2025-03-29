"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task, SubTask } from "@/types/task";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Calendar,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";

// Update the TaskItemProps interface to include isDragging
interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onUpdate: (task: Task) => void;
  viewMode?: "list" | "grid";
  isDragging?: boolean;
}

// Update the function signature to include isDragging with default value
export function TaskItem({
  task,
  onDelete,
  onUpdate,
  viewMode = "list",
  isDragging = false,
}: TaskItemProps) {
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [newSubtaskText, setNewSubtaskText] = useState("");
  const [showSubtasks, setShowSubtasks] = useState(true);

  // Update the useSortable hook to include a transition
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSorting,
  } = useSortable({ id: task.id });

  // Enhance the style with better transitions and visual feedback
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSorting ? 0.6 : 1,
    zIndex: isDragging ? 999 : "auto",
    position: "relative" as const,
  };

  const handleToggleComplete = () => {
    onUpdate({
      ...task,
      completed: !task.completed,
    });
  };

  const handleToggleSubtaskComplete = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.map((subtask) =>
      subtask.id === subtaskId
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    );

    onUpdate({
      ...task,
      subtasks: updatedSubtasks,
    });
  };

  const handleAddSubtask = () => {
    if (newSubtaskText.trim() === "") return;

    const newSubtask: SubTask = {
      id: Date.now().toString(),
      text: newSubtaskText,
      completed: false,
    };

    onUpdate({
      ...task,
      subtasks: [...task.subtasks, newSubtask],
    });

    setNewSubtaskText("");
    setIsAddingSubtask(false);
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.filter(
      (subtask) => subtask.id !== subtaskId
    );

    onUpdate({
      ...task,
      subtasks: updatedSubtasks,
    });
  };

  if (viewMode === "grid") {
    return (
      <Card
        ref={setNodeRef}
        style={style}
        className={`h-full flex flex-col border-t-4 border-t-blue-500 transition-shadow ${
          isDragging ? "shadow-lg" : ""
        } ${isSorting ? "opacity-60" : ""}`}
      >
        <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
          <div className="flex items-start space-x-3">
            <div {...attributes} {...listeners} className="cursor-grab mt-1">
              <GripVertical className="h-5 w-5 text-gray-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={handleToggleComplete}
                  id={`task-${task.id}`}
                />
                <label
                  htmlFor={`task-${task.id}`}
                  className={`font-medium ${
                    task.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {task.title}
                </label>
              </div>
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(task.date)}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id)}
            className="h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </CardHeader>

        <CardContent className="p-4 pt-2 flex-grow">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Subtasks</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSubtasks(!showSubtasks)}
              className="h-6 w-6 p-0"
            >
              {showSubtasks ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {showSubtasks && (
            <>
              {task.subtasks.length > 0 ? (
                <div className="space-y-2">
                  {task.subtasks.map((subtask) => (
                    <div
                      key={subtask.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={subtask.completed}
                          onCheckedChange={() =>
                            handleToggleSubtaskComplete(subtask.id)
                          }
                          id={`subtask-${subtask.id}`}
                        />
                        <label
                          htmlFor={`subtask-${subtask.id}`}
                          className={`text-sm ${
                            subtask.completed
                              ? "line-through text-gray-500"
                              : ""
                          }`}
                        >
                          {subtask.text}
                        </label>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSubtask(subtask.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No subtasks yet</p>
              )}
            </>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0">
          {isAddingSubtask ? (
            <div className="w-full flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Enter subtask..."
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                className="text-sm"
              />
              <Button size="sm" onClick={handleAddSubtask}>
                Add
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAddingSubtask(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-500 w-full"
              onClick={() => setIsAddingSubtask(true)}
            >
              <PlusCircle className="h-4 w-4 mr-1" /> Add Subtask
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  // List view (original)
  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`border-l-4 border-l-blue-500 transition-shadow ${
        isDragging ? "shadow-lg" : ""
      } ${isSorting ? "opacity-60" : ""}`}
    >
      <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
        <div className="flex items-center space-x-3">
          <div {...attributes} {...listeners} className="cursor-grab">
            <GripVertical className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={task.completed}
              onCheckedChange={handleToggleComplete}
              id={`task-${task.id}`}
            />
            <label
              htmlFor={`task-${task.id}`}
              className={`font-medium ${
                task.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {task.title}
            </label>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{formatDate(task.date)}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSubtasks(!showSubtasks)}
          >
            {showSubtasks ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(task.id)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </CardHeader>

      {showSubtasks && (
        <CardContent className="p-4 pt-2">
          {task.subtasks.length > 0 && (
            <div className="ml-8 space-y-2 mt-2">
              {task.subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={subtask.completed}
                      onCheckedChange={() =>
                        handleToggleSubtaskComplete(subtask.id)
                      }
                      id={`subtask-${subtask.id}`}
                    />
                    <label
                      htmlFor={`subtask-${subtask.id}`}
                      className={`text-sm ${
                        subtask.completed ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {subtask.text}
                    </label>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSubtask(subtask.id)}
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {isAddingSubtask ? (
            <div className="ml-8 mt-3 flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Enter subtask..."
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                className="text-sm"
              />
              <Button size="sm" onClick={handleAddSubtask}>
                Add
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAddingSubtask(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="ml-8 mt-2 text-blue-500"
              onClick={() => setIsAddingSubtask(true)}
            >
              <PlusCircle className="h-4 w-4 mr-1" /> Add Subtask
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
}
