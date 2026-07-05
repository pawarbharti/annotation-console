// types/api.ts

/**
 * Raw assignee object returned by the backend.
 * Can also be null.
 */
export interface ApiAssignee {
  id: string;
  name: string;
}

/**
 * Raw metadata returned by the backend.
 * This object is free-form, but we currently know these fields.
 */
export interface ApiTaskMeta {
  priority?: string;
  note?: string;
}

/**
 * Raw task returned by the backend.
 *
 * IMPORTANT:
 * This interface intentionally reflects the backend response,
 * even when the values are inconsistent.
 */
export interface ApiTask {
  id: string;

  title: string;

  // Backend may send:
  // "image", "audio", "text", "video"
  type: string;

  // Backend sends inconsistent values:
  // "todo"
  // "done"
  // "InProgress"
  // "QA"
  // "BLOCKED"
  status: string;

  assignee: ApiAssignee | null;

  // Backend sometimes sends "12"
  // sometimes 12
  annotationCount: number | string;

  // Backend sometimes sends ISO string
  // sometimes Epoch milliseconds
  updatedAt: string | number;

  meta: ApiTaskMeta;
}

/**
 * Response returned from
 * GET /api/tasks
 */
export interface TasksApiResponse {
  page: number;
  pageSize: number;
  total: number;
  items: ApiTask[];
}
