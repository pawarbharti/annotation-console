
"use client";

import { useEffect, useRef } from "react";

import { connectWebSocket } from "@/services/websocket";
import { useAppDispatch, useAppStore } from "@/redux/hooks";

import {
  updateTaskStatus,
  updateTaskAssignee,
  incrementAnnotation,
} from "@/redux/tasks/taskSlice";
import { getTaskById } from "@/redux/tasks/taskThunks";

export function useTaskWebSocket() {
  const dispatch = useAppDispatch();
  const store = useAppStore();

  // Ids we're already fetching, so repeated events for the same unloaded task
  // don't fire duplicate requests.
  const inFlight = useRef<Set<string>>(new Set());

  useEffect(() => {
    // If an event references a task that isn't in the store yet, fetch its
    // full record once. Otherwise the update reducers below no-op and the
    // live event is lost.
    const ensureLoaded = (id: string) => {
      const exists = Boolean(store.getState().tasks.entities[id]);
      if (exists || inFlight.current.has(id)) return;

      inFlight.current.add(id);
      dispatch(getTaskById(id)).finally(() => {
        inFlight.current.delete(id);
      });
    };

    const socket = connectWebSocket((event) => {
      switch (event.kind) {
        case "task.updated":
          ensureLoaded(event.payload.id);
          dispatch(updateTaskStatus(event.payload));
          break;

        case "task.assigned":
          ensureLoaded(event.payload.id);
          dispatch(updateTaskAssignee(event.payload));
          break;

        case "annotation.created":
          ensureLoaded(event.payload.taskId);
          dispatch(incrementAnnotation(event.payload.taskId));
          break;

        default:
          console.warn("Unknown event", event);
      }
    });

    return () => {
      socket.close();
    };
  }, [dispatch, store]);
}