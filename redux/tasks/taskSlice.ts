import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { taskAdapter } from "./taskAdapter";
import { TaskFilters, SortBy } from "./taskTypes";
import { getTasks } from "./taskThunks";
import { normalizeTaskStatus } from "@/utils/normalize";
import { Task } from "@/types/task";
import { saveTasks } from "@/lib/db";
interface TaskState {
  loading: boolean;
  error: string | null;

  page: number;
  pageSize: number;
  total: number;

  selectedTaskId: string | null;

  search: string;

  filters: TaskFilters;

  sortBy: SortBy;
  isCache: boolean;
}

const initialState = taskAdapter.getInitialState<TaskState>({
  loading: false,
  error: null,

  page: 1,
  pageSize: 20,
  total: 0,

  selectedTaskId: null,

  search: "",

  filters: {
    status: "ALL",
    type: "ALL",
  },

  sortBy: "updatedAt",
  isCache: false,
});

const taskSlice = createSlice({
  name: "tasks",

  initialState,

  reducers: {
    setSelectedTask(state, action: PayloadAction<string | null>) {
      state.selectedTaskId = action.payload;
    },

    closeDrawer(state) {
      state.selectedTaskId = null;
    },

    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },

    setStatusFilter(state, action: PayloadAction<TaskFilters["status"]>) {
      state.filters.status = action.payload;
    },

    setTypeFilter(state, action: PayloadAction<TaskFilters["type"]>) {
      state.filters.type = action.payload;
    },

    setSortBy(state, action: PayloadAction<SortBy>) {
      state.sortBy = action.payload;
    },

    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setCachedTasks(state, action: PayloadAction<Task[]>) {
      taskAdapter.setAll(state, action.payload);
    },
    setCacheState(state, action: PayloadAction<boolean>) {
      state.isCache = action.payload;
    },
  updateTaskStatus(
  state,
  action: PayloadAction<{
    id: string;
    status: string;
    updatedAt: number;
  }>
) {
  const task = state.entities[action.payload.id];

  if (!task) {
    console.warn(
      `Received update for unloaded task: ${action.payload.id}`
    );
    return;
  }

  taskAdapter.updateOne(state, {
    id: action.payload.id,
    changes: {
      status: normalizeTaskStatus(action.payload.status),
      updatedAt: action.payload.updatedAt,
    },
  });
},

    updateTaskAssignee(
  state,
  action: PayloadAction<{
    id: string;
    assignee: {
      id: string;
      name: string;
    } | null;
  }>
) {
  const task = state.entities[action.payload.id];

  if (!task) {
    console.warn(
      `Received assignee update for unloaded task: ${action.payload.id}`
    );
    return;
  }

  taskAdapter.updateOne(state, {
    id: action.payload.id,
    changes: {
      assignee: action.payload.assignee,
    },
  });
},

    incrementAnnotation(state, action: PayloadAction<string>) {
      const task = state.entities[action.payload];

      if (!task) return;

      task.annotationCount += 1;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(getTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getTasks.fulfilled, (state, action) => {
        state.loading = false;

        taskAdapter.setAll(state, action.payload.items);
        void saveTasks(action.payload.items);

        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
        state.total = action.payload.total;
      })

      .addCase(getTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong";
      });
  },
});

export const {
  setSelectedTask,
  setSearch,
  setStatusFilter,
  setTypeFilter,
  setSortBy,
  setPage,
  closeDrawer,
  updateTaskStatus,
  updateTaskAssignee,
  incrementAnnotation,
  setCachedTasks,
  setCacheState,
} = taskSlice.actions;

export default taskSlice.reducer;
