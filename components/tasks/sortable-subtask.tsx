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

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const element = e.target;
    // Reset height to auto to properly calculate new height
    element.style.height = 'auto';
    // Set new height based on scrollHeight
    element.style.height = `${element.scrollHeight}px`;
    handleSubtaskChange(subtask.id, e.target.value);
  };

  return (
    <div
      ref={setNodeRef}
      className="flex gap-2 items-start w-full overflow-hidden "
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="shrink-0 cursor-grab select-none mt-2"
      >
        <GripVertical className="size-4" />
      </button>

      <Textarea
        minLength={1}
        placeholder={`Subtask ${index + 1}`}
        className="border p-2 rounded resize-none flex-1 w-full min-h-[40px]"
        value={subtask.text}
        onChange={handleInput}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
          }
        }}
      />

      <button
        type="button"
        onClick={() => removeSubtask(subtask.id)}
        className="cursor-pointer select-none mt-2"
      >
        <Minus size={16} />
      </button>
    </div>
  );
}
