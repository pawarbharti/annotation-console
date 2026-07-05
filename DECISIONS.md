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

Summaries are rendered using:

- react-markdown
- remark-gfm

Raw HTML is sanitized before rendering using DOMPurify to prevent XSS attacks.

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