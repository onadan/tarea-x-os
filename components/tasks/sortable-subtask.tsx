"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Minus } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { SubTask } from "@/types/task";

interface SortableSubtaskProps {
  subtask: SubTask;
  handleSubtaskChange: (id: string, value: string) => void;
  removeSubtask: (id: string) => void;
  index: number;
}

export function SortableSubtask({
  subtask,
  handleSubtaskChange,
  removeSubtask,
  index,
}: SortableSubtaskProps) {
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
        value={subtask.text}
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
