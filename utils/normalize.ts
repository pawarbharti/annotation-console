import { ApiTask } from "@/types/api";
import { Task, TaskStatus, TaskType } from "@/types/task";
/**
 * Converts backend task types into our internal TaskType enum.
 */
export function normalizeTaskType(type: string): TaskType {
  switch (type?.toLowerCase()) {
    case "image":
      return TaskType.IMAGE;

    case "audio":
      return TaskType.AUDIO;

    case "text":
      return TaskType.TEXT;

    default:
      return TaskType.UNKNOWN;
  }
}

/**
 * Converts inconsistent backend statuses
 * into our normalized TaskStatus enum.
 */
export function normalizeTaskStatus(status: string): TaskStatus {
  const value = status?.toLowerCase().replace(/[\s_]/g, "");

  switch (value) {
    case "todo":
      return TaskStatus.TODO;

    case "inprogress":
      return TaskStatus.IN_PROGRESS;

    case "done":
      return TaskStatus.DONE;

    case "qa":
      return TaskStatus.QA;

    case "blocked":
      return TaskStatus.BLOCKED;

    default:
      return TaskStatus.UNKNOWN;
  }
}

/**
 * Converts ISO strings or epoch values
 * into a Unix timestamp (milliseconds).
 */
export function normalizeTimestamp(
  value: string | number
): number {
  if (typeof value === "number") {
    return value;
  }

  const timestamp = Date.parse(value);

  return Number.isNaN(timestamp) ? Date.now() : timestamp;
}

/**
 * Ensures annotationCount is always a number.
 */
export function normalizeAnnotationCount(
  value: number | string
): number {
  const count = Number(value);

  return Number.isNaN(count) ? 0 : count;
}

/**
 * Converts one ApiTask
 * into our internal Task model.
 */
export function normalizeTask(task: ApiTask): Task {
  return {
    id: task.id,

    title: task.title,

    type: normalizeTaskType(task.type),

    status: normalizeTaskStatus(task.status),

    assignee: task.assignee,

    annotationCount: normalizeAnnotationCount(
      task.annotationCount
    ),

    updatedAt: normalizeTimestamp(task.updatedAt),

    meta: task.meta ?? {},
  };
}

/**
 * Converts a list of ApiTasks
 * into normalized Tasks.
 */
export function normalizeTasks(tasks: ApiTask[]): Task[] {
  return tasks.map(normalizeTask);
}