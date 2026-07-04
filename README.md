# 📋 Annotation Console

A modern task management dashboard built with **Next.js**, **TypeScript**, **Redux Toolkit**, and **Material UI**.

This application displays annotation tasks, supports searching, filtering, sorting, task details, streaming summaries via Server-Sent Events (SSE), and live updates using WebSockets.

---

## Features

- 📋 Task List with MUI DataGrid
- 🔍 Search tasks by title
- 🎯 Filter by Status
- 🏷️ Filter by Type
- ↕️ Client-side sorting
- 📄 Task Details Drawer
- 📡 Live task updates using WebSockets
- 📝 Streaming Markdown Summary (SSE)
- 🔒 Markdown sanitization using DOMPurify
- ⚡ Redux Toolkit + Entity Adapter
- 🌙 Dark Theme using Material UI
- ⏳ Loading and Error States
- 📱 Responsive UI

---

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Redux Toolkit
- Redux Entity Adapter
- Material UI (MUI)
- MUI DataGrid
- React Markdown
- DOMPurify
- WebSocket
- Server-Sent Events (SSE)

---

## Folder Structure

```
app/
components/
hooks/
redux/
services/
styles/
types/
utils/
mock-server/
public/
```

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd annotation-console
```

Install dependencies:

```bash
npm install
```

---

## Running the Application

### Start the Next.js application

```bash
npm run dev
```

Runs on:

```
http://localhost:3000
```

---

### Start the Mock Server

Open another terminal:

```bash
cd mock-server
npm install
npm run mock
```

Runs on:

```
http://localhost:4000
```

WebSocket endpoint:

```
ws://localhost:4000/ws
```

---

## Architecture

The application follows a feature-based architecture.

- **Redux Toolkit** manages application state.
- **Entity Adapter** stores normalized task data.
- **Selectors** provide derived state.
- **Hooks** encapsulate API fetching and WebSocket subscriptions.
- **Services** manage REST APIs and WebSocket communication.
- **Components** are reusable and modular.

---

## Key Features Implemented

- Server-side pagination
- Search
- Status filtering
- Type filtering
- Sorting
- Task Details Drawer
- Markdown rendering
- XSS protection using DOMPurify
- Streaming task summaries (SSE)
- Live task updates (WebSocket)
- Dark mode UI

---

## Design Decisions

- Used Redux Entity Adapter for efficient CRUD operations.
- Normalized inconsistent backend data before storing it.
- Used MUI DataGrid for performance and built-in table functionality.
- Sanitized streamed markdown before rendering to prevent XSS attacks.
- Updated only affected entities on WebSocket events for better performance.

---

## Future Improvements

- Unit & Integration Tests
- Infinite Scrolling
- Server-side Search & Filtering
- Authentication
- Virtualized Drawer Content

---

## Screenshots

> Add screenshots here before submitting.

Example:

```
public/screenshots/dashboard.png
public/screenshots/drawer.png
```

---

## Author

**BHARTI PAWAR**