import { TaskStatus, TaskType } from "@/types";

export interface TaskFilters {
  status: TaskStatus | "ALL";
  type: TaskType | "ALL";
}

export type SortBy = "updatedAt" | "title";