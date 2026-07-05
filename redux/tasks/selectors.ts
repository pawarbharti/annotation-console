import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { taskAdapter } from "./taskAdapter";

const adapterSelectors = taskAdapter.getSelectors<RootState>(
  (state) => state.tasks,
);

export const {
  selectAll: selectAllTasks,
  selectById: selectTaskById,
  selectEntities: selectTaskEntities,
  selectIds: selectTaskIds,
} = adapterSelectors;

export const selectLoading = (state: RootState) => state.tasks.loading;

export const selectError = (state: RootState) => state.tasks.error;

export const selectSearch = (state: RootState) => state.tasks.search;

export const selectFilters = (state: RootState) => state.tasks.filters;

export const selectPage = (state: RootState) => state.tasks.page;

export const selectSelectedTaskId = (state: RootState) =>
  state.tasks.selectedTaskId;

export const selectIsCache = (state: RootState) =>
  state.tasks.isCache;

export const selectSortBy = (state: RootState) =>
  state.tasks.sortBy;

export const selectFilteredTasks = createSelector(
  [
    selectAllTasks,
    selectSearch,
    selectFilters,
    selectSortBy,
  ],
  (tasks, search, filters, sortBy) => {
    const filtered = tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        filters.status === "ALL" ||
        task.status === filters.status;

      const matchesType =
        filters.type === "ALL" ||
        task.type === filters.type;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);

        case "updatedAt":
        default:
          return b.updatedAt - a.updatedAt;
      }
    });
  },
);