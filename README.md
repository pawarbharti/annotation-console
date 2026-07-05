# Annotation Activity Console

A frontend take-home assignment built using **Next.js**, **TypeScript**, **Redux Toolkit**, and **Material UI**.

The application displays annotation tasks, supports real-time task updates using WebSocket, streams AI-generated summaries safely, and caches task data locally using IndexedDB.

---

## Features

- Task list with pagination
- Search tasks
- Filter by status
- Filter by type
- Sort tasks by latest update
- Task details drawer
- AI-generated streaming summary
- Safe Markdown rendering with XSS protection
- Live task updates via WebSocket
- Automatic WebSocket reconnect
- IndexedDB cache with Cached/Live indicator
- Redux Toolkit Entity Adapter
- Jest unit tests

---

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Redux Toolkit
- Material UI
- React Markdown
- IndexedDB (idb)
- Jest
- React Testing Library

---

## Project Structure

```
app/
components/
hooks/
redux/
services/
styles/
tests/
types/
utils/
```

---

## Installation

Clone the repository

```bash
git clone <repository-url>
cd annotation-console
```

Install dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env.local` file.

Example:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=ws://localhost:4000/ws
```

---

## Start Mock Server

```bash
cd mock-server
npm install
npm run mock
```

Server runs on

```
http://localhost:4000
```

---

## Start Application

```bash
npm run dev
```

Application runs at

```
http://localhost:3000
```

---

## Run Tests

```bash
npm test
```

---

## Lint

```bash
npm run lint
```

---

## Production Build

```bash
npm run build
```

---

## Design Decisions

Please refer to **DECISIONS.md** for architectural decisions, trade-offs, normalization strategy, caching, streaming, and WebSocket implementation details.

---

## Notes

- API data is normalized before entering Redux.
- WebSocket events update Redux state in real time.
- AI summaries are streamed incrementally.
- Markdown is sanitized before rendering.
- Task list is cached locally using IndexedDB.