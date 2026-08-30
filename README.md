# Tracklyt

A small, working product analytics MVP: companies sign up, create projects,
send user events to those projects via an API, and view aggregated
analytics (totals, activity over time, event breakdown, a funnel, and a
recent-events feed) in a React dashboard.

```
User Action → Event API → MongoDB → Analytics Queries → React Dashboard
```

## Project structure

```
tracklyt/
  backend/    Node.js + Express + MongoDB (Mongoose) + JWT auth
  frontend/   React + Vite + Tailwind CSS + Recharts
```

## Prerequisites

- Node.js 18+
- A MongoDB connection string (local MongoDB, or a free MongoDB Atlas cluster)

## 1. Backend setup

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```
MONGODB_URI=mongodb://127.0.0.1:27017/tracklyt   # or your Atlas URI
JWT_SECRET=some-long-random-string
PORT=8080
CLIENT_ORIGIN=http://localhost:5173
```

Install and run:

```bash
npm install
npm run dev      # nodemon, auto-restarts on change
# or
npm start        # plain node
```

The API starts on `http://localhost:8080`. `GET /health` returns `{"status":"ok"}`
once MongoDB is connected.

## 2. Frontend setup

```bash
cd frontend
cp .env.example .env
```

Edit `.env` if your backend isn't on the default port:

```
VITE_API_URL=http://localhost:8080
```

Install and run:

```bash
npm install
npm run dev
```

The app starts on `http://localhost:5173`.

## 3. Try the full flow

1. Open `http://localhost:5173`, you'll land on `/login`.
2. Click "Sign up", create a company account.
3. Log in.
4. Click "+ Create Project", give it a name and platform.
5. Open the project — you'll see an empty dashboard, since there's no data yet.
6. Click "Generate Demo Events" (top right of the project page). This is a
   dev-only helper that sends real events through the actual `POST /events`
   API — it does not fake any chart data directly.
7. The summary cards, activity chart, event breakdown, funnel, and recent
   events table all populate from real MongoDB data.

You can also send events from any HTTP client:

```bash
curl -X POST http://localhost:8080/events \
  -H "Authorization: Bearer <your JWT>" \
  -H "Content-Type: application/json" \
  -d '{"projectId":"<project id>","userId":"user_001","eventName":"signup","page":"/signup"}'
```

## API overview

| Method | Path                              | Auth | Description                          |
|--------|------------------------------------|------|---------------------------------------|
| POST   | /auth/signup                      | No   | Create a company account              |
| POST   | /auth/login                       | No   | Log in, returns a JWT                 |
| POST   | /projects                         | Yes  | Create a project                      |
| GET    | /projects                         | Yes  | List the company's projects           |
| POST   | /events                           | Yes  | Record an event                       |
| GET    | /events/:projectId                | Yes  | Recent events for a project           |
| GET    | /analytics/summary/:projectId     | Yes  | Total/unique/active user counts       |
| GET    | /analytics/events/:projectId      | Yes  | Event counts grouped by name          |
| GET    | /analytics/funnel/:projectId      | Yes  | signup → login → dashboard funnel     |
| GET    | /analytics/activity/:projectId    | Yes  | Daily event counts                    |

All authenticated routes take `Authorization: Bearer <token>`. Every
project/event/analytics request is scoped to `req.user.companyId` from the
JWT — a company can never read or write another company's data.

## Notes on the funnel

The funnel endpoint counts a user in a later step only if they also appear
in every earlier step (signup → login → dashboard), not just independent
per-step counts. This isn't a strict chronological/session funnel — it
doesn't check event ordering or timing — but it's a meaningful, easy-to-
understand improvement over counting each step in isolation.

## Deployment

- Backend and frontend are fully separable; deploy them independently
  (e.g. backend on Render/Railway/Fly, frontend on Vercel/Netlify).
- Set `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_ORIGIN` on the backend host.
- Set `VITE_API_URL` to your deployed backend URL on the frontend host, then
  rebuild the frontend (Vite env vars are baked in at build time).
- No secrets are hardcoded anywhere in the codebase; both `.env` files are
  gitignored.
