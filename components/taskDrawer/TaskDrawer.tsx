"use client";

import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
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
            p: 3,
            bgcolor: "#1E1E2E",
            color: "#fff",
          },
        },
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
        }}
      >
        Task Details
      </Typography>

      <Divider sx={{ my: 2 }} />

      {!task ? (
        <Typography color="text.secondary">No task selected</Typography>
      ) : (
        <>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              mb: 0.5,
            }}
          >
            {task.title}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            ID: {task.id}
          </Typography>

          <Box sx={{ display: "grid", rowGap: 2 }}>
            {/* Status */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography sx={{ minWidth: 110 }}>
                <strong>Status</strong>
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
            </Box>

            {/* Type */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography sx={{ minWidth: 110 }}>
                <strong>Type</strong>
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
            </Box>

            <Typography>
              <strong>Assignee:</strong> {task.assignee?.name ?? "Unassigned"}
            </Typography>

            <Typography>
              <strong>Annotations:</strong> {task.annotationCount}
            </Typography>

            <Typography>
              <strong>Updated:</strong>{" "}
              {new Intl.DateTimeFormat("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(task.updatedAt))}
            </Typography>

            {task.meta.priority && (
              <Typography>
                <strong>Priority:</strong> {task.meta.priority}
              </Typography>
            )}

            {task.meta.note && (
              <Typography>
                <strong>Note:</strong> {task.meta.note}
              </Typography>
            )}
          </Box>

          <TaskSummary taskId={task.id} />
        </>
      )}
    </Drawer>
  );
}
