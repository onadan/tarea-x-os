import { Timestamp } from "firebase/firestore";

export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  date: Date;
  completed: boolean;
  subtasks: SubTask[];
  createdAt: Timestamp;
  userId?: string;
  order?: number; // Add optional order property
}
