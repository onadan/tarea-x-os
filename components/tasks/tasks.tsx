"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, List } from "lucide-react";
import { useState } from "react";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSwappingStrategy,
} from "@dnd-kit/sortable";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { TaskList } from "./task-list";
import { TaskGrid } from "./task-grid";
import { TaskItem } from "./task-item";
import { Task } from "@/types/task";
import { AddTaskDrawerDialog } from "./add-task-modal";

export function Tasks() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Only start dragging after moving 8px
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    setActiveId(null);
    const { active, over } = event;

    if (active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Add order property to each task based on its position
        const orderedItems = newItems.map((item, index) => ({
          ...item,
          order: index,
        }));

        return orderedItems;
      });
    }
  };

  return (
    <div className="flex gap-4 flex-col">
      <div className="flex justify-between items-center">
        <Tabs
          defaultValue={viewMode}
          onValueChange={(value) => setViewMode(value as "list" | "grid")}
          className="w-max backdrop-opacity-80"
        >
          <TabsList>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              {/* <span>List</span> */}
            </TabsTrigger>
            <TabsTrigger value="grid" className="flex items-center gap-2">
              <Grid className="h-4 w-4" />
              {/* <span>Grid</span> */}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="md:hidden">
          <AddTaskDrawerDialog />
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement]}
      >
        <SortableContext
          items={tasks.map((task) => task?.id as string)}
          strategy={
            viewMode === "list"
              ? verticalListSortingStrategy
              : rectSwappingStrategy
          }
        >
          {viewMode === "list" ? (
            <TaskList
              tasks={tasks}
              onDeleteTask={handleDeleteTask}
              onUpdateTask={handleUpdateTask}
            />
          ) : (
            <TaskGrid
              tasks={tasks}
              onDeleteTask={handleDeleteTask}
              onUpdateTask={handleUpdateTask}
            />
          )}
        </SortableContext>

        {/* Add DragOverlay for better visual feedback */}
        <DragOverlay adjustScale={true}>
          {activeId ? (
            <TaskItem
              task={tasks.find((task) => task.id === activeId)!}
              onDelete={handleDeleteTask}
              onUpdate={handleUpdateTask}
              viewMode={viewMode}
              isDragging={true}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
