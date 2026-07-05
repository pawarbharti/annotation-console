import { createEntityAdapter } from "@reduxjs/toolkit";
import { Task } from "@/types";

export const taskAdapter = createEntityAdapter<Task>({
  sortComparer: (a, b) => b.updatedAt - a.updatedAt,
});
