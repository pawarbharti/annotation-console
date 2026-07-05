"use client";

import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getTasks } from "@/redux/tasks/taskThunks";
import { getCachedTasks } from "@/lib/db";
import { setCachedTasks } from "@/redux/tasks/taskSlice";
import { setCacheState } from "@/redux/tasks/taskSlice";

export function useTasks() {
  const dispatch = useAppDispatch();

  const page = useAppSelector((state) => state.tasks.page);
  const pageSize = useAppSelector((state) => state.tasks.pageSize);

useEffect(() => {
  async function loadTasks() {
  const cachedTasks = await getCachedTasks();

  if (cachedTasks.length > 0) {
    dispatch(setCachedTasks(cachedTasks));
    dispatch(setCacheState(true));
  }

  await dispatch(
    getTasks({
      page,
      pageSize,
    })
  );

  dispatch(setCacheState(false));
}

  loadTasks();
}, [dispatch, page, pageSize]);
}