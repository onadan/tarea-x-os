"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GripVertical, Minus, Plus } from "lucide-react";

import { nanoid } from "nanoid";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Textarea } from "../ui/textarea";

export function AddTaskDrawerDialog() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size={"lg"}>
            <Plus className="size-4" />
            Add task
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add new task</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new task.
            </DialogDescription>
          </DialogHeader>
          <AddTaskForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size={"lg"}>
          <Plus className="size-4" />
          Add task
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add new task</DrawerTitle>
          <DrawerDescription>
            Fill out the form below to add a new task.
          </DrawerDescription>
        </DrawerHeader>
        <AddTaskForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

interface Subtask {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  date: string;
  subtasks: Subtask[];
}

function AddTaskForm({ className }: React.ComponentProps<"form">) {
  const [task, setTask] = React.useState<Task>({
    id: nanoid(),
    name: "",
    date: "",
    subtasks: [],
  });

  const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const addSubtask = () => {
    setTask((prevTask) => ({
      ...prevTask,
      subtasks: [...prevTask.subtasks, { id: nanoid(), name: "" }],
    }));
  };

  const handleSubtaskChange = (id: string, value: string) => {
    setTask((prevTask) => ({
      ...prevTask,
      subtasks: prevTask.subtasks.map((subtask) =>
        subtask.id === id ? { ...subtask, name: value } : subtask
      ),
    }));
  };

  const removeSubtask = (id: string) => {
    setTask((prevTask) => ({
      ...prevTask,
      subtasks: prevTask.subtasks.filter((subtask) => subtask.id !== id),
    }));
  };

  const addTask = () => {};

  // Sensors for drag interaction
  const sensors = useSensors(
    useSensor(PointerSensor), // Mouse and touch drag
    useSensor(KeyboardSensor) // Keyboard drag
  );

  // Handle reordering of subtasks
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setTask((prevTask) => {
        const oldIndex = prevTask.subtasks.findIndex(
          (subtask) => subtask.id === active.id
        );
        const newIndex = prevTask.subtasks.findIndex(
          (subtask) => subtask.id === over.id
        );
        return {
          ...prevTask,
          subtasks: arrayMove(prevTask.subtasks, oldIndex, newIndex),
        };
      });
    }
  };

  return (
    <form
      className={cn(
        "grid items-start gap-4 max-h-[70vh] overflow-y-auto pr-2",
        className
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="grid gap-2">
          <Label htmlFor="task-name">Task name</Label>
          <Input type="text" id="task-name" placeholder="Task name" />
        </div>

        {task?.subtasks.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={task.subtasks}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid gap-2">
                <Label htmlFor="subtasks">Subtasks</Label>

                {task.subtasks.map((subtask, index) => (
                  <SortableSubtask
                    key={subtask.id}
                    index={index}
                    subtask={subtask}
                    handleSubtaskChange={handleSubtaskChange}
                    removeSubtask={removeSubtask}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

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

      <div className="grid gap-2">
        <Label htmlFor="dateAndTime">Date and Time</Label>
        <Input id="dateAndTime" placeholder="Date and Time" />
      </div>

      <Button type="submit">Add Task</Button>
    </form>
  );
}

function SortableSubtask({
  subtask,
  handleSubtaskChange,
  removeSubtask,
  index,
}: {
  subtask: { id: string; name: string };
  handleSubtaskChange: (id: string, value: string) => void;
  removeSubtask: (id: string) => void;
  index: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: subtask.id });

  return (
    <div
      ref={setNodeRef}
      className="flex gap-2 items-center"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {/* Only the GripVertical button is draggable */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="shrink-0 cursor-grab select-none"
      >
        <GripVertical className="size-4" />
      </button>

      <Textarea
        minLength={1}
        placeholder={`Subtask ${index + 1}`}
        className="flex-1 border p-2 rounded resize-none min-h-10"
        value={subtask.name}
        onChange={(e) => handleSubtaskChange(subtask.id, e.target.value)}
      />

      <button
        type="button"
        onClick={() => removeSubtask(subtask.id)}
        className="cursor-pointer select-none"
      >
        <Minus size={16} />
      </button>
    </div>
  );
}
