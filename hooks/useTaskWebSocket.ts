"use client";

import { useEffect } from "react";

import { connectWebSocket } from "@/services/websocket";
import { useAppDispatch } from "@/redux/hooks";

import {
  updateTaskStatus,
  updateTaskAssignee,
  incrementAnnotation,
} from "@/redux/tasks/taskSlice";

export function useTaskWebSocket() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const socket = connectWebSocket((event) => {
      switch (event.kind) {
        case "task.updated":
          dispatch(updateTaskStatus(event.payload));
          break;

        case "task.assigned":
          dispatch(updateTaskAssignee(event.payload));
          break;

        case "annotation.created":
          dispatch(incrementAnnotation(event.payload.taskId));
          break;

        default:
          console.warn("Unknown event", event);
      }
    });

    return () => {
      socket.close();
    };
  }, [dispatch]);
}