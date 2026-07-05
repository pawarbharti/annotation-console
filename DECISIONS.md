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

Jest is configured for unit testing.

Normalization utilities are covered with unit tests to verify:

- Status normalization
- Task type normalization
- Complete task normalization

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

The mock server can emit WebSocket events for tasks that are not currently loaded because the client uses server-side pagination.

Updates are applied only to tasks that already exist in the Redux Entity Adapter store. Events for unloaded tasks are ignored and logged. In a production system, these events would typically be buffered until the task is loaded or would trigger a fetch for the missing task.