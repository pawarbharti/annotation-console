"use client";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setStatusFilter,
  setTypeFilter,
  setSortBy,
} from "@/redux/tasks/taskSlice";
import { SortBy } from "@/redux/tasks/taskTypes"; 
import { selectFilters } from "@/redux/tasks/selectors";
import { TaskStatus, TaskType } from "@/types";

export default function TaskFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const sortBy = useAppSelector((state) => state.tasks.sortBy);
  return (
    <Stack direction="row" spacing={2}>
      <FormControl
        size="small"
        sx={{
          minWidth: 180,
          "& .MuiOutlinedInput-root": {
            color: "#fff",
            height: 42,
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#555",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#90caf9",
          },
          "& .MuiSvgIcon-root": {
            color: "#fff",
          },
        }}
      >
        <InputLabel sx={{ color: "#bbb" }}>Status</InputLabel>

        <Select
          label="Status"
          value={filters.status}
          onChange={(e) =>
            dispatch(setStatusFilter(e.target.value as TaskStatus | "ALL"))
          }
        >
          <MenuItem value="ALL">All</MenuItem>
          <MenuItem value="TODO">Todo</MenuItem>
          <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
          <MenuItem value="DONE">Done</MenuItem>
          <MenuItem value="QA">QA</MenuItem>
          <MenuItem value="BLOCKED">Blocked</MenuItem>
        </Select>
      </FormControl>
<FormControl
  size="small"
  sx={{
    minWidth: 180,
    "& .MuiOutlinedInput-root": {
      color: "#fff",
      height: 42,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#555",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#90caf9",
    },
    "& .MuiSvgIcon-root": {
      color: "#fff",
    },
  }}
>
  <InputLabel sx={{ color: "#bbb" }}>Sort By</InputLabel>

  <Select
    label="Sort By"
    value={sortBy}
    onChange={(e) =>
      dispatch(setSortBy(e.target.value as SortBy))
    }
  >
    <MenuItem value="updatedAt">
      Updated (Newest)
    </MenuItem>

    <MenuItem value="title">
      Title (A-Z)
    </MenuItem>
  </Select>
</FormControl>
      <FormControl
        size="small"
        sx={{
          minWidth: 180,
          "& .MuiOutlinedInput-root": {
            color: "#fff",
            height: 42,
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#555",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#90caf9",
          },
          "& .MuiSvgIcon-root": {
            color: "#fff",
          },
        }}
      >
        <InputLabel sx={{ color: "#bbb" }}>Type</InputLabel>

        <Select
          label="Type"
          value={filters.type}
          onChange={(e) =>
            dispatch(setTypeFilter(e.target.value as TaskType | "ALL"))
          }
        >
          <MenuItem value="ALL">All</MenuItem>
          <MenuItem value="IMAGE">Image</MenuItem>
          <MenuItem value="TEXT">Text</MenuItem>
          <MenuItem value="AUDIO">Audio</MenuItem>
          <MenuItem value="VIDEO">Video</MenuItem>
          <MenuItem value="UNKNOWN">Unknown</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}
