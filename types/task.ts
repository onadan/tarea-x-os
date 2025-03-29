import { ISOStringFormat } from "date-fns";

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
  order?: number; // Add optional order property
}
