"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, List } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserTasks, deleteTask, updateTask as updateTaskService } from "@/services/taskService";
import { useAuth } from "@/providers/auth-context";
import { toast } from "sonner";
import { onSnapshot, query, collection, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

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

export function Tasks() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      
      setTasks(fetchedTasks.sort((a, b) => (a.order || 0) - (b.order || 0)));
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      await updateTaskService(updatedTask.id, updatedTask);
      setTasks(
        tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      toast.success("Task updated successfully");
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleDragEnd = async (event: any) => {
    setActiveId(null);
    const { active, over } = event;

    if (active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        const orderedItems = newItems.map((item, index) => ({
          ...item,
          order: index,
        }));

        // Update task orders in the database
        orderedItems.forEach(async (task) => {
          try {
            await updateTaskService(task.id, { order: task.order });
          } catch (error) {
            console.error("Failed to update task order:", error);
          }
        });

        return orderedItems;
      });
    }
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

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading tasks...</div>;
  }

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
              <span>List</span>
            </TabsTrigger>
            <TabsTrigger value="grid" className="flex items-center gap-2">
              <Grid className="h-4 w-4" />
              <span>Grid</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        
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
