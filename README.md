# Lost and Found

This project is set up for deployment as either:

- a split deployment with frontend and backend on different hosts
- a single deployment where Express serves the built frontend and `/api`
- a Docker deployment from the repo root

## Structure

- `frontend/` React + Vite client
- `backend/` Express + MongoDB API

## Local setup

Frontend:

1. Copy `frontend/.env.example` to `frontend/.env`
2. Set `VITE_API_URL` only if your API runs on a different origin

Backend:

1. Copy `backend/.env.example` to `backend/.env`
2. Set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and Cloudinary credentials

Run locally:

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

## Production environment variables

Backend:

- `NODE_ENV=production`
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `CLOUD_NAME`
- `API_KEY`
- `API_SECRET`

Frontend:

- `VITE_API_URL`

If frontend and backend are deployed together on the same domain, you can leave `VITE_API_URL` unset and the frontend will use `/api`.

## Recommended deployment flow

### Option 1: Single host

```bash
cd frontend
npm install
npm run build
```

```bash
cd backend
npm install
npm start
```

In production, the backend serves `frontend/dist` and keeps API routes under `/api`.

### Option 2: Split frontend and backend

1. Deploy `backend/` as a Node service
2. Deploy `frontend/` as a static Vite app
3. Set `frontend` `VITE_API_URL` to your backend URL ending in `/api`
4. Set backend `CLIENT_URL` to the deployed frontend origin

### Option 3: Docker

Build and run from the repo root:

```bash
docker build -t lost-and-found .
docker run -p 5000:5000 \
  -e NODE_ENV=production \
  -e PORT=5000 \
  -e CLIENT_URL=http://localhost:5000 \
  -e MONGO_URI=your-mongodb-uri \
  -e JWT_SECRET=your-jwt-secret \
  -e CLOUD_NAME=your-cloudinary-name \
  -e API_KEY=your-cloudinary-key \
  -e API_SECRET=your-cloudinary-secret \
  lost-and-found
```

Open `http://localhost:5000`.

## Render deployment

This repo now includes [render.yaml](/d:/Lost%20and%20Found/render.yaml:1) for a one-service Docker deploy.

Use these steps:

1. Push the project to GitHub
2. Create a new Render Blueprint or Web Service from the repo
3. Set these environment variables in Render:
   `CLIENT_URL=https://your-render-app.onrender.com`
   `MONGO_URI=...`
   `JWT_SECRET=...`
   `CLOUD_NAME=...`
   `API_KEY=...`
   `API_SECRET=...`
4. Deploy and verify `https://your-render-app.onrender.com/api/health`

## Deployment notes

- CORS is restricted by `CLIENT_URL`
- Health check is available at `/api/health`
- Secrets should only live in environment variables
- A real `backend/.env` file exists in this workspace, so keep it out of any public deployment or repo history
