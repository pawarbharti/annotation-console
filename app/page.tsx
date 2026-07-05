"use client";

import { Box, Typography } from "@mui/material";

import { useTasks } from "@/hooks/useTasks";
import { useTaskWebSocket } from "@/hooks/useTaskWebSocket";
import TaskSearch from "@/components/task/TaskSearch";
import TaskFilters from "@/components/task/TaskFilters";
import TaskTable from "@/components/task/TaskTable";
import { useAppSelector } from "@/redux/hooks";
import { selectAllTasks } from "@/redux/tasks/selectors";
import TaskDrawer from "@/components/taskDrawer/TaskDrawer";
import Chip from "@mui/material/Chip";
import { selectIsCache } from "@/redux/tasks/selectors";

export default function Home() {
  useTasks();
  useTaskWebSocket();
const tasks = useAppSelector(selectAllTasks);
const isCache = useAppSelector(selectIsCache);
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#121212",
        color: "#fff",
        p: 4,
      }}
    >
      {/* Heading */}
      <Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 4,
  }}
>
  <Typography
    variant="h4"
    sx={{
      fontWeight: 700,
    }}
  >
    📋 Annotation Console
  </Typography>

  <Box
  sx={{
    display: "flex",
    gap: 2,
    alignItems: "center",
  }}
>
  <Typography color="gray">
    {tasks.length} Tasks
  </Typography>

  <Chip
    size="small"
    label={isCache ? "Cached Data" : "Live Data"}
    color={isCache ? "warning" : "success"}
  />
</Box>
</Box>

      {/* Toolbar */}
      <Box
  sx={{
    display: "flex",
    gap: 2,
    mb: 3,
    flexWrap: "wrap",
  }}
>
  <Box sx={{ flex: 1, minWidth: 300 }}>
    <TaskSearch />
  </Box>

  <TaskFilters />
</Box>

      {/* Task Table */}
      <TaskTable />
      <TaskDrawer />
    </Box>
  );
}