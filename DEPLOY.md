# Deployment Guide - Quantum Tasks

Quantum Tasks is a full-stack application with a React/Vite frontend and an Express/SQLite backend.

## Prerequisites

- Node.js 22 or higher
- npm or yarn

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
NODE_ENV=production
JWT_SECRET=your_secure_random_string
```

## Deployment Steps

### 1. Build the Application

Run the build script to compile the frontend:

```bash
npm run build
```

This will generate a `dist` folder containing the static assets.

### 2. Start the Server

Once built, you can start the production server:

```bash
npm start
```

The server will serve the static files from `dist` and handle the API requests.

## Platform Specifics

### Railway.app / Render.com

1. **Build Command:** `npm run build`
2. **Start Command:** `npm start`
3. **Environment Variables:** Add `JWT_SECRET` and `NODE_ENV=production` in the platform's dashboard.
4. **Persistent Volume:** Since this app uses SQLite, you MUST mount a persistent volume at the root or specify a path for the database file (defaulting to `./database.sqlite`) to ensure data persists across deployments.

## Security Considerations

- The app uses `helmet` for CSP and security headers.
- Rate limiting is applied to authentication routes to prevent brute-force attacks.
- Ensure your `JWT_SECRET` is strong and kept private.
