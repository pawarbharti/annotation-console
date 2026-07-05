"use client";

import { TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setSearch } from "@/redux/tasks/taskSlice";
import { selectSearch } from "@/redux/tasks/selectors";

export default function TaskSearch() {
  const dispatch = useAppDispatch();
  const search = useAppSelector(selectSearch);

  return (
    <div className="w-full">
    <TextField
  fullWidth
  size="small"
  placeholder="Search Tasks..."
  value={search}
  onChange={(e) => dispatch(setSearch(e.target.value))}
  sx={{
    "& .MuiOutlinedInput-root": {
      color: "#fff",
      height: 42,

      "& fieldset": {
        borderColor: "#555",
      },

      "&:hover fieldset": {
        borderColor: "#90caf9",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#1976d2",
      },
    },

    "& input::placeholder": {
      color: "#888",
      opacity: 1,
    },
  }}
/>
    </div>
  );
}
