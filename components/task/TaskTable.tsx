"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Alert, Box } from "@mui/material";
import { useAppDispatch } from "@/redux/hooks";
import { setSelectedTask } from "@/redux/tasks/taskSlice";
import { setPage } from "@/redux/tasks/taskSlice";
import { useAppSelector } from "@/redux/hooks";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import {
  selectFilteredTasks,
  selectLoading,
  selectError,
} from "@/redux/tasks/selectors";

const columns: GridColDef[] = [
  {
    field: "title",
    headerName: "Title",
    flex: 2,
  },
  {
    field: "type",
    headerName: "Type",
    flex: 1,
    renderCell: (params) => {
      const typeStyles: Record<
        string,
        {
          bg: string;
          color: string;
          border: string;
        }
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

      const style = typeStyles[params.value] ?? typeStyles.UNKNOWN;

      return (
        <Chip
          label={params.value}
          size="small"
          sx={{
            bgcolor: style.bg,
            color: style.color,
            border: `1px solid ${style.border}`,
            fontWeight: 600,
            minWidth: 74,
            "& .MuiChip-label": {
              px: 1.5,
            },
          }}
        />
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    renderCell: (params) => {
      const statusStyles: Record<
        string,
        {
          bg: string;
          color: string;
          border: string;
        }
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

      const style = statusStyles[params.value] ?? statusStyles.UNKNOWN;

      return (
        <Chip
          label={params.value.replace("_", " ")}
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
    },
  },
  {
    field: "assignee",
    headerName: "Assignee",
    flex: 1.5,
    valueGetter: (_value, row) => row.assignee?.name ?? "Unassigned",
  },
  {
    field: "updatedAt",
    headerName: "Updated",
    flex: 1.5,
    valueFormatter: (value) => {
      return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(value));
    },
  },
];

export default function TaskTable() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectFilteredTasks);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const page = useAppSelector((state) => state.tasks.page);
  const pageSize = useAppSelector((state) => state.tasks.pageSize);
  const total = useAppSelector((state) => state.tasks.total);
  if (!loading && tasks.length === 0) {
    return (
      <Alert
        severity="info"
        sx={{
          mt: 3,
        }}
      >
        No tasks found. Try changing your search or filters.
      </Alert>
    );
  }
  // Loading
  if (loading) {
    return (
      <Box sx={{ mt: 3 }}>
        {[...Array(8)].map((_, index) => (
          <Skeleton
            key={index}
            variant="rounded"
            height={52}
            sx={{
              mb: 1,
              borderRadius: 2,
            }}
          />
        ))}
      </Box>
    );
  }

  // Error
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 3 }}>
        {error}
      </Alert>
    );
  }

  // Empty State
  if (tasks.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 3 }}>
        No tasks found. Try changing your search or filters.
      </Alert>
    );
  }

  return (
    <div className="mt-3 h-[590px] w-full overflow-hidden rounded-xl">
      <DataGrid
        rows={tasks}
        columnHeaderHeight={44}
        rowHeight={45}
        columns={columns}
        getRowId={(row) => row.id}
        pageSizeOptions={[10, 20, 50]}
        disableRowSelectionOnClick
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 20,
              page: 0,
            },
          },
        }}
        onRowClick={(params) => {
          dispatch(setSelectedTask(params.row.id));
        }}
        paginationMode="server"

        rowCount={total}

        paginationModel={{
          page: page - 1,
          pageSize,
        }}

        onPaginationModelChange={(model) => {
          dispatch(setPage(model.page + 1));
        }}
        sx={{
          border: "none",
          borderRadius: 3,
          backgroundColor: "#1E1E2E",
          color: "#fff",

          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#374151 !important", // Tailwind gray-700
            color: "#ffffff !important",
            fontWeight: "bold",
            fontSize: 15,
          },

          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#374151 !important",
            color: "#ffffff !important",
          },

          "& .MuiDataGrid-columnHeaderTitle": {
            color: "#ffffff !important",
            fontWeight: 700,
          },

          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #374151",
          },

          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "#374151",
            color: "#fff",
          },

          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#2d3748",
            cursor: "pointer",
          },
        }}
      />
    </div>
  );
}
