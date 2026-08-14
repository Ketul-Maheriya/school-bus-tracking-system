# School Bus Tracking System

This project contains a Node.js/Express backend and a React/Vite frontend for a school transport management application.

## Project structure

- `server.js` — Express server entry point
- `router/` — API routes
- `controller/` — request handlers
- `model/` — MongoDB data models
- `db/` — database connection logic
- `authentication/` — JWT/auth middleware
- `vite-project/` — frontend application

## Prerequisites

- Node.js 18+
- MongoDB running locally on `mongodb://localhost:27017/institute`

## Backend setup

1. In the project root, install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and update the values:
   ```bash
   copy .env.example .env
   ```
3. Start the API server:
   ```bash
   node server.js
   ```

The backend runs on `http://localhost:3000`.

## Frontend setup

1. Go into the frontend folder:
   ```bash
   cd vite-project
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

The frontend runs on the Vite port, usually `http://localhost:5173`.

## GitHub upload checklist

- Keep `.env` local and do not commit secrets
- Commit only source files, not `node_modules`
- Keep `package-lock.json` if you want reproducible installs
- Add this repository to GitHub and push the branch

## Deployment

This app is prepared for hosting on separate services:

- Backend: Render, Railway, or any Node.js host
- Frontend: Vercel or Netlify
- Database: MongoDB Atlas

Environment variables required for production:

- Backend: `PORT`, `MONGO_URI`, `JWT`, `FRONTEND_URL`
- Frontend: `VITE_API_URL`

## Notes

The backend expects a MongoDB instance available locally. If you prefer a cloud database, set `MONGO_URI` in `.env` to your connection string.
