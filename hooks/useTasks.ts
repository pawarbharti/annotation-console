"use client";

import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getTasks } from "@/redux/tasks/taskThunks";

export function useTasks() {
  const dispatch = useAppDispatch();

  const page = useAppSelector((state) => state.tasks.page);
  const pageSize = useAppSelector((state) => state.tasks.pageSize);

  useEffect(() => {
    dispatch(
      getTasks({
        page,
        pageSize,
      })
    );
  }, [dispatch, page, pageSize]);
}