DECISIONS.md

# Design Decisions

## State Management

Redux Toolkit was selected for centralized state management because the application contains shared task data used across multiple components.

Redux Entity Adapter was used to normalize tasks by ID, allowing efficient updates from API responses and WebSocket events.

---

## Why Redux Toolkit instead of RTK Query?

RTK Query is excellent for CRUD APIs but this assignment required:

- Streaming summaries
- WebSocket updates
- IndexedDB caching
- Manual normalization

Using async thunks provided better control over these workflows.

---

## Normalization Strategy

Incoming API responses contain inconsistent values.

Normalization is performed before storing data in Redux.

Examples:

- Status
  - done
  - DONE
  - InProgress
  - in_progress

are normalized into consistent enum values.

Task types are normalized similarly.

This ensures filters and UI remain predictable.

---

## Streaming AI Summary

Task summaries are streamed using Server-Sent Events.

The UI appends incoming chunks incrementally instead of waiting for the full response.

When another task is selected, the previous request is cancelled using AbortController to prevent stale updates.

---

## Markdown Rendering

Task summaries are rendered using **React Markdown**.

The application uses the `skipHtml` option provided by `react-markdown` to ignore any raw HTML received from the streaming API. This ensures that embedded HTML elements or scripts are **not rendered**, while still supporting standard Markdown features such as headings, lists, emphasis, and fenced code blocks.

Since the mock API primarily streams Markdown content, ignoring raw HTML provides a simple and secure approach that prevents HTML injection without requiring additional sanitization plugins.

---

## WebSocket Updates

A WebSocket connection listens for task updates.

Incoming events update only the affected entity in Redux instead of refetching the entire task list.

Reconnect logic automatically attempts to restore the connection if it is lost.

---

## Local Cache

Task data is stored in IndexedDB using the idb package.

Application startup:

1. Load cached tasks.
2. Display cached data immediately.
3. Fetch latest data from API.
4. Replace cache.

The UI indicates whether data is currently from Cache or Live API.

---

## Performance

Memoized selectors created using createSelector reduce unnecessary renders.

Redux Entity Adapter enables efficient updates.

Normalized state minimizes object duplication.

---

## Error Handling

The application handles:

- Failed API requests
- Streaming interruptions
- WebSocket disconnects
- Empty search results
- Missing assignees
- Missing metadata

---

## Testing

Jest + React Testing Library are configured for unit and component tests:

- **Normalizer** (`tests/normalize.test.ts`) — status, task type, and complete-task normalization.
- **Selector** (`tests/selectors.test.ts`) — `selectFilteredTasks` search/status/type filtering and sort by updatedAt/title.
- **Component (RTL)** (`tests/TaskTable.test.tsx`) — renders the empty state.
- **Component (RTL)** (`tests/TaskTicker.test.tsx`) — covers the Part 2 fixes: no fetch when nothing is selected, fetch-by-id + de-dupe on repeat selection, and the elapsed-time label advancing with fake timers.

---

## AI Usage

ChatGPT was used as a development assistant for:

- architecture discussions
- TypeScript improvements
- debugging
- documentation

All implementation decisions, integration, testing, and validation were performed manually.

## Search and Filtering

Search and filtering are currently applied to the tasks loaded in the Redux store for the active page.

The mock API exposes server-side pagination (`page` and `pageSize`) but does not provide server-side search or filtering endpoints. To avoid downloading the complete dataset on every request, the application filters only the currently loaded page.

In a production system, search and filtering would typically be implemented on the server (preferred for scalability) or by caching the complete dataset locally if the total number of tasks is reasonably small.


## Handling WebSocket Events for Unloaded Tasks

The mock server can emit WebSocket events for tasks that are not currently loaded because the client uses server-side pagination (the mock deliberately emits events for `t120`–`t136`).

When an event references a task that is **not** in the Redux Entity Adapter store, the `useTaskWebSocket` hook fetches that task's full record once from `/api/tasks/:id` (`getTaskById` thunk) and upserts it, so the live update merges in instead of being dropped. An in-flight `Set` de-dupes concurrent requests for the same id, and the update reducers (`updateTaskStatus` / `updateTaskAssignee`) no-op for ids that aren't loaded yet rather than fabricating a partial entity.

Trade-off: because the store holds one page at a time, a fetched off-page task appears as an extra row until the next page load. This surfaces live activity rather than hiding it; the alternative would be to buffer the event and apply it only when its page loads (no extra rows, but the update isn't visible until you navigate there).

---

## Part 2: Bug Hunt (`buggy/TaskTicker.tsx`)

Fixes for the planted defects. The fixed component lives at `buggy/TaskTicker.tsx` and is covered by `tests/TaskTicker.test.tsx`; a manual harness is at `/ticker-test`.

1. **Stale-closure clock (A).** The interval called `setTick(tick + 1)` with `[]` deps, so it closed over `tick = 0` and set `1` forever; React then bailed out on the repeated value and the "x seconds ago" labels froze. Fixed by storing the current time in state and refreshing it each second (`setNow(Date.now())`), which render reads directly — no captured value, no dead `tick`.

2. **Fetching a null id (B).** The fetch effect ran on mount while `selectedId` was `null`, hitting `/api/tasks/null` (404). Fixed with an early `if (!selectedId) return;` guard.

3. **State mutation + no re-render + duplicates (B).** `setTasks(prev => { prev.push(t); return prev; })` mutated the array and returned the same reference, so React skipped the render; it also appended a duplicate on every selection. Fixed by returning a new array and de-duping by id (`[...prev.filter(x => x.id !== t.id), t]`).

4. **Mutating state during render (C).** `tasks.sort(...)` sorts in place, mutating Redux-independent React state on each render. Fixed by sorting a copy inside `useMemo` (`[...tasks].sort(...)`).

5. **Array index as key.** `key={i}` tied React's identity to list position, so reordering/inserting attached state to the wrong row. Fixed with `key={t.id}` (stable, unique).

6. **Stale-response race / no error handling (B).** Rapid selection changes could let an older response overwrite a newer one, and there was no `res.ok`/`catch` handling. Fixed with a `cancelled` flag in the effect cleanup plus a `res.ok` check and `.catch`.

7. **Messy timestamp not normalized (B) — found, not planted.** The component's `Task` type assumes `updatedAt: number`, but `/api/tasks/:id` returns an ISO string for some tasks. `now - "2024-06-28T..."` is `NaN`, so those rows showed "NaNs ago". Fixed by typing the raw response (`RawTask`) and running `updatedAt` through the app's `normalizeTimestamp` before storing.

**Additional observation (not a planted render bug):** the component only grows its list from clicks and starts empty, so it can never bootstrap itself. I added an optional `initialTasks` prop (defaults to `[]`, so existing usage is unchanged) to make it seedable and testable; in the real app this list would come from the store/props.