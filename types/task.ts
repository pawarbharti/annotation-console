// types/task.ts

/**
 * Supported task types after normalization.
 * Any unknown type from the backend will be converted to UNKNOWN.
 */
export enum TaskType {
  IMAGE = "IMAGE",
  AUDIO = "AUDIO",
  TEXT = "TEXT",
  UNKNOWN = "UNKNOWN",
}

/**
 * Normalized task status used throughout the application.
 * Backend values like "InProgress" or "in_progress"
 * will all become IN_PROGRESS.
 */
export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  QA = "QA",
  DONE = "DONE",
  BLOCKED = "BLOCKED",
  UNKNOWN = "UNKNOWN",
}

/**
 * User assigned to a task.
 * A task may also be unassigned (null).
 */
export interface Assignee {
  id: string;
  name: string;
}

/**
 * Optional metadata returned by the backend.
 * More fields can be added later without changing the Task model.
 */
export interface TaskMeta {
  priority?: string;
  note?: string;
}

/**
 * Clean internal Task model used across the application.
 * Components and Redux should ONLY work with this model,
 * never with the raw API response.
 */
export interface Task {
  id: string;
  title: string;

  type: TaskType;
  status: TaskStatus;

  assignee: Assignee | null;

  annotationCount: number;

  /**
   * Stored as Unix timestamp (milliseconds)
   * for easy sorting and comparisons.
   */
  updatedAt: number;

  meta: TaskMeta;
}