// services/api.ts

import { TasksApiResponse } from "@/types";
import { normalizeTasks } from "@/utils/normalize";
import { API_BASE_URL } from "@/utils/constants";

export interface FetchTasksParams {
  page: number;
  pageSize: number;
}

export async function fetchTasks({
  page,
  pageSize,
}: FetchTasksParams) {
  const response = await fetch(
    `${API_BASE_URL}/api/tasks?page=${page}&pageSize=${pageSize}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  const data: TasksApiResponse = await response.json();

  return {
    ...data,
    items: normalizeTasks(data.items),
  };
}