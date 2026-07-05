"use client";

import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";

import TaskSummary from "@/components/summary/TaskSummary";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { closeDrawer } from "@/redux/tasks/taskSlice";
import {
  selectSelectedTaskId,
  selectTaskById,
} from "@/redux/tasks/selectors";

export default function TaskDrawer() {
  const dispatch = useAppDispatch();

  const selectedTaskId = useAppSelector(selectSelectedTaskId);

  const task = useAppSelector((state) =>
    selectedTaskId ? selectTaskById(state, selectedTaskId) : null,
  );

  return (
    <Drawer
      anchor="right"
      open={!!selectedTaskId}
      onClose={() => dispatch(closeDrawer())}
      slotProps={{
        paper: {
          sx: {
            width: 500,
            bgcolor: "#1E1E2E",
            color: "#fff",
          },
        },
      }}
    >
      <div className="flex h-full flex-col p-6">
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Task Details
        </Typography>

        <Divider sx={{ my: 2 }} />

        {!task ? (
          <Typography color="text.secondary">
            No task selected
          </Typography>
        ) : (
          <>
            {/* Title */}
            <div className="mb-6">
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold" }}
              >
                {task.title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                ID: {task.id}
              </Typography>
            </div>

            {/* Details */}
            <div className="space-y-5">
              {/* Status */}
              <div className="flex items-center justify-between">
                <Typography sx={{ fontWeight: 600 }}>
                  Status
                </Typography>

                <Chip
                  label={task.status.replace("_", " ")}
                  color={
                    task.status === "DONE"
                      ? "success"
                      : task.status === "BLOCKED"
                        ? "error"
                        : task.status === "QA"
                          ? "warning"
                          : task.status === "IN_PROGRESS"
                            ? "info"
                            : "default"
                  }
                  size="small"
                />
              </div>

              {/* Type */}
              <div className="flex items-center justify-between">
                <Typography sx={{ fontWeight: 600 }}>
                  Type
                </Typography>

                <Chip
                  label={
                    task.type === "IMAGE"
                      ? "🖼 Image"
                      : task.type === "TEXT"
                        ? "📄 Text"
                        : task.type === "AUDIO"
                          ? "🎧 Audio"
                          : "❓ Unknown"
                  }
                  variant="outlined"
                  size="small"
                />
              </div>

              <div className="flex justify-between">
                <Typography sx={{ fontWeight: 600 }}>
                  Assignee
                </Typography>

                <Typography>
                  {task.assignee?.name ?? "Unassigned"}
                </Typography>
              </div>

              <div className="flex justify-between">
                <Typography sx={{ fontWeight: 600 }}>
                  Annotations
                </Typography>

                <Typography>
                  {task.annotationCount}
                </Typography>
              </div>

              <div className="flex justify-between">
                <Typography sx={{ fontWeight: 600 }}>
                  Updated
                </Typography>

                <Typography align="right">
                  {new Intl.DateTimeFormat("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(task.updatedAt))}
                </Typography>
              </div>

              {task.meta.priority && (
                <div className="flex justify-between">
                  <Typography sx={{ fontWeight: 600 }}>
                    Priority
                  </Typography>

                  <Typography>
                    {task.meta.priority}
                  </Typography>
                </div>
              )}

              {task.meta.note && (
                <div className="flex justify-between">
                  <Typography sx={{ fontWeight: 600 }}>
                    Note
                  </Typography>

                  <Typography className="max-w-[220px] text-right">
                    {task.meta.note}
                  </Typography>
                </div>
              )}
            </div>

            <Divider sx={{ my: 3 }} />

            <TaskSummary taskId={task.id} />
          </>
        )}
      </div>
    </Drawer>
  );
}