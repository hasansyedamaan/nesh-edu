# AGENTS.md

## Commands

- `npm run dev` - Run both client (Vite :5173) and server (Express :5000)
- `npm run server` / `npm run client` - Run individually
- `npm run seed` - Seeds DB via `node server/utils/seed.js`
- `npm run lint` - ESLint on client only (no root/linter for server)
- `npm run install-all` - Install deps for root + server + client

## Architecture

Monorepo: root scripts orchestrate `server/` (CommonJS) and `client/` (ES modules).

- **Server**: Express API at `/api/*`, routes in `server/routes/`, models in `server/models/`
- **Client**: React 19 + Vite 8, proxies `/api` and `/uploads` to `localhost:5000`
- **Database**: MongoDB via Mongoose, requires `MONGO_URI` in `server/.env`

## Key Files

- `server/index.js` - Entry point, CORS config, route mounts, seed endpoint
- `server/config/db.js` - MongoDB connection
- `client/vite.config.js` - Proxy config

## Setup

1. MongoDB running (default: `mongodb://localhost:27017/nesh`)
2. Create `server/.env` with `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRE`
3. `npm run seed` or visit `http://localhost:5000/api/seed`

## Seed Credentials

- Admin: `admin@neshedu.com` / `admin123`
- Instructor: `instructor@neshedu.com` / `instructor123`
- Student: `student@neshedu.com` / `student123`

## Notes

- No test framework configured; no `npm test` command exists
- Server CORS allows: `localhost:5173`, `localhost:3000`, `neshedu.com`, `nesh-edu.onrender.com`
- Static uploads served from `server/uploads` at `/uploads` endpoint
- Client lint from `client/` dir; server has no lint config