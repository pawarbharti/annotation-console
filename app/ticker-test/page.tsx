"use client";

import { useState } from "react";
import { TaskTicker } from "@/buggy/TaskTicker";
import { API_BASE_URL } from "@/utils/constants";

/**
 * Throwaway page to exercise the fixed buggy/TaskTicker component in the
 * browser. Visit /ticker-test with the mock server running.
 *
 * Seeded with a few real task ids so you can click a row (it refetches that
 * task from /api/tasks/:id) and watch the "x seconds ago" labels tick.
 */
export default function TickerTestPage() {
 // Lazy init so Date.now() runs once, off the render path.
 const [seed] = useState(() => {
 const now = Date.now();
 return [
 { id: "t1", title: "Task 1", status: "in_progress", updatedAt: now - 5_000 },
 { id: "t2", title: "Task 2", status: "done", updatedAt: now - 20_000 },
 { id: "t3", title: "Task 3", status: "QA", updatedAt: now - 90_000 },
 ];
 });

 return (
 <main style={{ padding: 24, fontFamily: "sans-serif" }}>
 <h1>TaskTicker (Part 2) — manual check</h1>
 <p style={{ color: "#666" }}>
 Click a row to refetch it from the mock. Watch the “s ago” labels tick
 up every second. Open DevTools → Network to confirm there is no request
 to <code>/api/tasks/null</code>.
 </p>
 <TaskTicker apiBase={API_BASE_URL} initialTasks={seed} />
 </main>
 );
}