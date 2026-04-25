# AGENTS.md

## Commands

- `npm run dev` - Run both client and server (concurrently)
- `npm run server` - Run server only (nodemon on port 5000)
- `npm run client` - Run client only (Vite on port 5173)
- `npm run seed` - Seed database with initial data

## Architecture

- **Server** (Express/MongoDB): API at `/api/*` routes, MongoDB via Mongoose
- **Client** (React/Vite): Proxies `/api` requests to `http://localhost:5000`
- **Database**: Requires `MONGO_URI` in `server/.env`

## Key Files

- `server/index.js` - Express entry, middleware, routes
- `server/config/db.js` - MongoDB connection
- `client/vite.config.js` - Vite config with proxy setup

## Notes

- Client CORS allows `localhost:5173` and `localhost:3000`
- Static uploads served from `server/uploads` at `/uploads`
- Server uses nodemon for auto-reload on changes