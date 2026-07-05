import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTasks } from "@/services/api";

export const getTasks = createAsyncThunk("tasks/getTasks", fetchTasks);
