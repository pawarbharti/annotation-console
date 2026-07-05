# 📋 Annotation Console

A modern Task Annotation Console built with Next.js, React, Redux Toolkit, Material UI, and TypeScript.

This application displays paginated tasks, supports searching and filtering, provides a detailed task drawer with live markdown summaries, caches data in IndexedDB, and receives real-time updates through WebSockets.

---

## ✨ Features

### ✅ Task Management

- Server-side paginated task list
- Search tasks by title
- Filter by Status
- Filter by Type
- Sortable task table
- Loading & Error states

### ✅ Task Drawer

- View complete task details
- Status & Type chips
- Assignee
- Annotation count
- Updated timestamp
- Metadata (Priority & Note)
- Live streaming markdown summary

### ✅ Markdown Summary

- Streams summary using Server Sent Events (SSE)
- Rendered with React Markdown
- Supports Markdown formatting
- XSS-safe using DOMPurify
- Blocks malicious HTML/script tags

### ✅ Real-Time Updates

- WebSocket connection
- Live status updates
- Live assignee updates
- Live annotation count updates
- Automatic reconnect on disconnect

### ✅ Offline Cache

- IndexedDB caching
- Cached data shown instantly
- Fresh API data replaces cache
- Live/Cached indicator

### ✅ State Management

- Redux Toolkit
- Entity Adapter
- Async Thunks
- Memoized Selectors

---

# 🛠 Tech Stack

- Next.js 16
- React 19
- TypeScript
- Redux Toolkit
- Material UI
- MUI DataGrid
- IndexedDB (idb)
- React Markdown
- DOMPurify
- rehype-raw
- WebSocket
- Server Sent Events (SSE)

---

# 📁 Project Structure

```
app/
components/
    task/
    taskDrawer/
    summary/
hooks/
redux/
    tasks/
services/
types/
utils/
lib/
mock-server/
```

---

# 🚀 Installation

Clone the repository

```bash
git clone <repository-url>
```

Install dependencies

```bash
npm install
```

---

# ⚙ Environment Variables

Create a `.env.local` file.

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=ws://localhost:4000/ws
```

---

# ▶ Start Mock Server

```bash
cd mock-server
npm install
npm run mock
```

Runs on

```
http://localhost:4000
```

---

# ▶ Start Frontend

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

# 🏗 Architecture

The application follows a feature-based architecture.

- API Layer
- Redux Store
- Entity Adapter
- Memoized Selectors
- Reusable Components
- Hooks
- Services
- Utilities

Task data is normalized before entering Redux to keep the UI independent from backend inconsistencies.

---

# 🔄 Data Flow

```
Mock API
     │
     ▼
normalize()
     │
     ▼
Redux Toolkit
     │
     ▼
Selectors
     │
     ▼
Components
```

---

# 📦 Caching

Tasks are cached using IndexedDB.

Flow:

```
Open App
      │
      ▼
Read IndexedDB
      │
      ▼
Show Cached Tasks
      │
      ▼
Fetch Latest Tasks
      │
      ▼
Update Redux
      │
      ▼
Update IndexedDB
```

---

# 🔌 Real-Time Updates

WebSocket events handled

- task.updated
- task.assigned
- annotation.created

Automatic reconnect is implemented when the socket disconnects.

---

# 🔒 Security

Markdown summaries are sanitized using DOMPurify before rendering.

Blocked elements include

- `<script>`
- `<img onerror>`
- Inline JavaScript

This prevents XSS attacks while still allowing Markdown formatting.

---

# 📷 Screenshots

- Task Table
- Filters
- Drawer
- Markdown Summary
- Live Updates

(Add screenshots here if desired.)

---

# 👨‍💻 Author

Developed by **BHARTI PAWAR**

Frontend Developer
