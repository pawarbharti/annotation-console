"use client";

import { useEffect, useMemo, useState } from "react";

import { normalizeTimestamp } from "@/utils/normalize";

type Task = { id: string; title: string; status: string; updatedAt: number };

// Raw shape from /api/tasks/:id — the mock sends updatedAt as either an epoch
// number or an ISO string, so it must be normalized before we do time math.
type RawTask = {
 id: string;
 title: string;
 status: string;
 updatedAt: string | number;
};

interface TaskTickerProps {
 apiBase: string;
 // Optional seed. The component only grows its list from clicks, so it can't
 // bootstrap an empty list on its own; this lets a page/test provide starting
 // rows. Defaults to [], so existing `<TaskTicker apiBase=... />` is unchanged.
 initialTasks?: Task[];
}

export function TaskTicker({ apiBase, initialTasks = [] }: TaskTickerProps) {
 const [tasks, setTasks] = useState<Task[]>(initialTasks);
 const [selectedId, setSelectedId] = useState<string | null>(null);

 // (A) Running clock that drives the "x seconds ago" labels.
 //
 // BUG 1 (stale closure) + the "tick" smell: the original kept a `tick`
 // counter and did `setTick(tick + 1)` inside an interval with `[]` deps, so
 // it closed over `tick = 0` and set 1 forever — after the first tick React
 // saw the same value and bailed out, freezing the clock. `tick` was also
 // never read in render. FIX: store the current time in state and refresh it
 // each second; render reads `now`, so labels update and there's no stale
 // closure. (Lazy initializer keeps the first value out of the render path.)
 const [now, setNow] = useState(() => Date.now());

 useEffect(() => {
 const id = setInterval(() => setNow(Date.now()), 1000);
 return () => clearInterval(id);
 }, []);

 // (B) Load the selected task whenever the selection changes.
 useEffect(() => {
 // BUG 2 (fetching a null id): with no guard the effect ran on mount when
 // `selectedId` was null and hit `/api/tasks/null` (a 404). FIX: bail out
 // until something is actually selected.
 if (!selectedId) return;

 // BUG 5 (stale-response race): if the selection changes before a request
 // resolves, an older response could overwrite the newer one. FIX: ignore
 // a response whose effect has already been cleaned up.
 let cancelled = false;

 fetch(`${apiBase}/api/tasks/${selectedId}`)
 .then((r) => {
 if (!r.ok) throw new Error(`Failed to load task ${selectedId}`);
 return r.json();
 })
 .then((raw: RawTask) => {
 if (cancelled) return;

 // BUG 7 (messy timestamp): the API sends updatedAt as an ISO string
 // for some tasks, but the component does `now - updatedAt`, which
 // yields NaN ("NaNs ago") for strings. FIX: normalize to epoch ms.
 const task: Task = {
 id: raw.id,
 title: raw.title,
 status: raw.status,
 updatedAt: normalizeTimestamp(raw.updatedAt),
 };

 // BUG 3 (state mutation + no re-render + duplicates): the original
 // `prev.push(task); return prev;` mutated the existing array and
 // returned the SAME reference, so React never re-rendered, and every
 // selection appended a duplicate. FIX: return a new array and de-dupe
 // by id (upsert).
 setTasks((prev) => [...prev.filter((x) => x.id !== task.id), task]);
 })
 .catch((err) => {
 if (!cancelled) console.error(err);
 });

 return () => {
 cancelled = true;
 };
 }, [apiBase, selectedId]);

 // (C) Newest first.
 //
 // BUG 4 (mutating state during render): `Array.prototype.sort` sorts in
 // place, so the original `tasks.sort(...)` mutated React state on every
 // render. FIX: sort a copy, memoized so it only recomputes when tasks change.
 const sorted = useMemo(
 () => [...tasks].sort((a, b) => b.updatedAt - a.updatedAt),
 [tasks],
 );

 return (
 <ul>
 {sorted.map((t) => (
 // BUG 6 (index as key): `key={i}` tied React's identity to list
 // position, so reordering/inserting mismatched state to the wrong row.
 // FIX: use the stable, unique task id.
 <li key={t.id} onClick={() => setSelectedId(t.id)}>
 {t.title} — {t.status} (updated{" "}
 {Math.floor((now - t.updatedAt) / 1000)}s ago)
 </li>
 ))}
 </ul>
 );
}