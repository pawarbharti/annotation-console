"use client";

import { useTasks } from "@/hooks/useTasks";
import { useTaskWebSocket } from "@/hooks/useTaskWebSocket";

import TaskSearch from "@/components/task/TaskSearch";
import TaskFilters from "@/components/task/TaskFilters";
import TaskTable from "@/components/task/TaskTable";
import TaskDrawer from "@/components/taskDrawer/TaskDrawer";

import { useAppSelector } from "@/redux/hooks";
import { selectAllTasks } from "@/redux/tasks/selectors";

export default function Home() {
  useTasks();
  useTaskWebSocket();

  const tasks = useAppSelector(selectAllTasks);
  const isCache = useAppSelector((state) => state.tasks.isCache);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 pt-2 pb-1">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Annotation Console
            </h1>

            <p className="mt-0 text-sm text-gray-400">
              Manage annotation tasks in real-time
            </p>
          </div>

          <div className="mb-2 flex flex-wrap gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                isCache
                  ? "bg-yellow-500/20 text-yellow-300"
                  : "bg-green-500/20 text-green-300"
              }`}
            >
              {isCache ? "Cached Data" : "Live Data"}
            </span>

            <span className="text-sm text-gray-400">
              {tasks.length} Tasks
            </span>

          </div>

        </div>

        {/* Toolbar */}

        <div className="mb-3 flex flex-wrap items-end gap-3">

          <div className="min-w-[320px] flex-1">
            <TaskSearch />
          </div>

          <TaskFilters />

        </div>

        <TaskTable />

        <TaskDrawer />

      </div>
    </main>
  );
}