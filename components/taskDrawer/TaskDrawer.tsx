"use client";

import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";

import TaskSummary from "@/components/summary/TaskSummary";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { closeDrawer } from "@/redux/tasks/taskSlice";
import { selectSelectedTaskId, selectTaskById } from "@/redux/tasks/selectors";

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
          <Typography color="text.secondary">No task selected</Typography>
        ) : (
          <>
            {/* Title */}
            <div className="mb-6">
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {task.title}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                ID: {task.id}
              </Typography>
            </div>

            {/* Details */}
            <div className="space-y-5">
              {/* Status */}
              <div className="flex items-center justify-between">
                <Typography sx={{ fontWeight: 600 }}>Status</Typography>

                {(() => {
                  const statusStyles: Record<
                    string,
                    { bg: string; color: string; border: string }
                  > = {
                    TODO: {
                      bg: "#4c1d95",
                      color: "#e9d5ff",
                      border: "#8b5cf6",
                    },
                    IN_PROGRESS: {
                      bg: "#0c4a6e",
                      color: "#7dd3fc",
                      border: "#0ea5e9",
                    },
                    DONE: {
                      bg: "#14532d",
                      color: "#86efac",
                      border: "#22c55e",
                    },
                    QA: {
                      bg: "#7c2d12",
                      color: "#fdba74",
                      border: "#f97316",
                    },
                    BLOCKED: {
                      bg: "#7f1d1d",
                      color: "#fca5a5",
                      border: "#ef4444",
                    },
                    UNKNOWN: {
                      bg: "#374151",
                      color: "#d1d5db",
                      border: "#6b7280",
                    },
                  };

                  const style =
                    statusStyles[task.status] ?? statusStyles.UNKNOWN;

                  return (
                    <Chip
                      label={task.status.replace("_", " ")}
                      size="small"
                      sx={{
                        bgcolor: style.bg,
                        color: style.color,
                        border: `1px solid ${style.border}`,
                        fontWeight: 600,
                      }}
                    />
                  );
                })()}
              </div>

              {/* Type */}
              <div className="flex items-center justify-between">
                <Typography sx={{ fontWeight: 600 }}>Type</Typography>

                {(() => {
                  const typeStyles: Record<
                    string,
                    { bg: string; color: string; border: string }
                  > = {
                    IMAGE: {
                      bg: "#0f3d2e",
                      color: "#34d399",
                      border: "#10b981",
                    },
                    TEXT: {
                      bg: "#1e3a8a",
                      color: "#93c5fd",
                      border: "#3b82f6",
                    },
                    AUDIO: {
                      bg: "#4c1d95",
                      color: "#c4b5fd",
                      border: "#8b5cf6",
                    },
                    UNKNOWN: {
                      bg: "#374151",
                      color: "#d1d5db",
                      border: "#6b7280",
                    },
                  };

                  const typeLabels: Record<string, string> = {
                    IMAGE: "🖼 Image",
                    TEXT: "📄 Text",
                    AUDIO: "🎧 Audio",
                    UNKNOWN: "❓ Unknown",
                  };

                  const style = typeStyles[task.type] ?? typeStyles.UNKNOWN;

                  return (
                    <Chip
                      label={typeLabels[task.type] ?? "❓ Unknown"}
                      size="small"
                      sx={{
                        bgcolor: style.bg,
                        color: style.color,
                        border: `1px solid ${style.border}`,
                        fontWeight: 600,
                        minWidth: 110,
                        "& .MuiChip-label": {
                          px: 1.5,
                        },
                      }}
                    />
                  );
                })()}
              </div>

              <div className="flex justify-between">
                <Typography sx={{ fontWeight: 600 }}>Assignee</Typography>

                <Typography>{task.assignee?.name ?? "Unassigned"}</Typography>
              </div>

              <div className="flex justify-between">
                <Typography sx={{ fontWeight: 600 }}>Annotations</Typography>

                <Typography>{task.annotationCount}</Typography>
              </div>

              <div className="flex justify-between">
                <Typography sx={{ fontWeight: 600 }}>Updated</Typography>

                <Typography align="right">
                  {new Intl.DateTimeFormat("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(task.updatedAt))}
                </Typography>
              </div>

              {task.meta.priority && (
                <div className="flex justify-between">
                  <Typography sx={{ fontWeight: 600 }}>Priority</Typography>

                  <Typography>{task.meta.priority}</Typography>
                </div>
              )}

              {task.meta.note && (
                <div className="flex justify-between">
                  <Typography sx={{ fontWeight: 600 }}>Note</Typography>

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
