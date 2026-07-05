import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTasks, fetchTask } from "@/services/api";

export const getTasks = createAsyncThunk("tasks/getTasks", fetchTasks);

/**
 * Fetches a single task by id.
 *
 * Used when a WebSocket event references a task that isn't in the store yet
 * (e.g. it lives on a page we haven't loaded). The event payload alone can't
 * build a full Task, so we pull the complete record from /api/tasks/:id.
 */
export const getTaskById = createAsyncThunk(
  "tasks/getTaskById",
  (id: string) => fetchTask(id),
);