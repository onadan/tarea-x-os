"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableSubtask } from "./sortable-subtask"; // Update this import
import { SubTask } from "@/types/task";

interface SubtaskListProps {
  subtasks: SubTask[];
  onChange: (subtasks: SubTask[]) => void;
}

export function SubtaskList({ subtasks, onChange }: SubtaskListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = subtasks.findIndex(
        (subtask) => subtask.id === active.id
      );
      const newIndex = subtasks.findIndex((subtask) => subtask.id === over.id);
      onChange(arrayMove(subtasks, oldIndex, newIndex));
    }
  };

  const handleSubtaskChange = (id: string, value: string) => {
    onChange(
      subtasks.map((subtask) =>
        subtask.id === id ? { ...subtask, name: value } : subtask
      )
    );
  };

  const removeSubtask = (id: string) => {
    onChange(subtasks.filter((subtask) => subtask.id !== id));
  };

  if (subtasks.length === 0) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={subtasks} strategy={verticalListSortingStrategy}>
        <div className="grid gap-2">
          <Label htmlFor="subtasks">Subtasks</Label>
          {subtasks.map((subtask, index) => (
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
  );
}
