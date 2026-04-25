# AGENTS.md

## Commands

- `npm run dev` - Run both client and server concurrently
- `npm run server` - Run server only (nodemon on port 5000)
- `npm run client` - Run client only (Vite on port 5173)
- `npm run seed` - Seed database via `GET /api/seed` endpoint
- `npm run lint` - Run ESLint on client (from `client/` dir)
- `npm run install-all` - Install root + server + client deps

## Architecture

- **Server** (Express/MongoDB): API at `/api/*`, routes in `server/routes/`, models in `server/models/`
- **Client** (React/Vite): Proxies `/api` and `/uploads` to `http://localhost:5000`
- **Database**: Requires `MONGO_URI` in `server/.env`

## Key Files

- `server/index.js` - Express entry, CORS origins, all route mounts
- `server/config/db.js` - MongoDB connection via Mongoose
- `client/vite.config.js` - Vite proxy configuration

## Setup

1. Ensure MongoDB is running locally (default: `mongodb://localhost:27017/nesh`)
2. Visit `http://localhost:5000/api/seed` or use `npm run seed` to populate initial data

## Seed Credentials

- Admin: `admin@neshedu.com` / `admin123`
- Instructor: `instructor@neshedu.com` / `instructor123`
- Student: `student@neshedu.com` / `student123`

## Notes

- Client CORS allows `localhost:5173`, `localhost:3000`, and production domains
- Static uploads served from `server/uploads` at `/uploads`
- Server uses nodemon for auto-reload on changes
- Client uses ES modules (`"type": "module"`), server uses CommonJS