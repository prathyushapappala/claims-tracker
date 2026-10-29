# Insurance Claims Tracker

A small full-stack app: React + TypeScript (Vite) frontend and Node + Express + TypeScript backend. Claims are stored in `server/data/claims.json`.

## Run

```bash
# Terminal 1: API on http://localhost:4000
cd server && npm install && npm run dev

# Terminal 2: UI on http://localhost:5173
cd client && npm install && npm run dev
```

## API

| Method | Path                     | Body                                                          |
| ------ | ------------------------ | ------------------------------------------------------------- |
| GET    | /api/claims?status=      | optional filter: Submitted, Approved or Rejected              |
| GET    | /api/claims/:id          |                                                               |
| POST   | /api/claims              | policyNumber, claimantName, type, amount, description         |
| PATCH  | /api/claims/:id/status   | { status: "Approved" \| "Rejected" \| "Submitted" }            |
| DELETE | /api/claims/:id          |                                                               |
