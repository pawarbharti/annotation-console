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
    return (
      <Chip
        label={params.value}
        variant="outlined"
        size="small"
      />
    );
  },
},
  {
  field: "status",
  headerName: "Status",
  flex: 1,
  renderCell: (params) => {
    const colorMap: Record<
      string,
      "success" | "warning" | "error" | "info" | "default"
    > = {
      DONE: "success",
      QA: "warning",
      BLOCKED: "error",
      IN_PROGRESS: "info",
      TODO: "default",
      UNKNOWN: "default",
    };

    return (
      <Chip
        label={params.value}
        color={colorMap[params.value] ?? "default"}
        size="small"
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

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        mt: 3,
        height: 600,
        width: "100%",
      }}
    >
      <DataGrid
  rows={tasks}
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
      backgroundColor: "#2A2A40",
      color: "#fff",
      fontWeight: "bold",
      fontSize: 15,
    },

    "& .MuiDataGrid-cell": {
      borderBottom: "1px solid #333",
    },

    "& .MuiDataGrid-row:hover": {
      backgroundColor: "#292940",
      cursor: "pointer",
    },

    "& .MuiDataGrid-footerContainer": {
      backgroundColor: "#2A2A40",
    },
  }}
/>
    </Box>
  );
}