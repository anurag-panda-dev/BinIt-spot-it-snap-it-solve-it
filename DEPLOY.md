# 🚀 Binit Deployment Guide

This guide explains how to deploy both the **FastAPI Backend** and the **Next.js Frontend** for free for hackathon presentations and production demonstrations.

---

## 📋 Recommended Deployment Architecture

| Tier | Provider | Purpose | Free Tier Specs |
|---|---|---|---|
| **Backend API** | [Render.com](https://render.com) or [Railway.app](https://railway.app) | FastAPI, Async SQLAlchemy, SQLite, OSRM Routing | 100% Free Web Service, HTTPS, Auto-deploy on Git push |
| **Frontend Web** | [Vercel](https://vercel.com) | Next.js 14 App Router, MapLibre GL, Tailwind CSS | 100% Free Next.js hosting, Global Edge CDN |

---

## ⚙️ Part 1: Deploy Backend (FastAPI on Render)

### 1. Push code to GitHub
Ensure all recent changes in your repository are pushed to GitHub:
```bash
git add .
git commit -m "feat: prepare project for deployment"
git push origin main
```

### 2. Create Web Service on Render
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** → **Web Service**.
2. Connect your GitHub repository.
3. Configure the following build settings:

| Setting | Value |
|---|---|
| **Name** | `binit-api` (or your preferred name) |
| **Region** | Select closest region (e.g. Singapore, Frankfurt, Oregon) |
| **Root Directory** | `apps/api` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | **Free** |

### 3. Configure Backend Environment Variables
In the Render Web Service settings, add the following environment variables:

| Environment Variable | Recommended Value | Description |
|---|---|---|
| `ENVIRONMENT` | `production` | Set runtime environment |
| `DEBUG` | `false` | Disable debug mode in production |
| `SECRET_KEY` | `generate-a-random-32-char-secret-string` | JWT signing secret |
| `DATABASE_URL` | `sqlite+aiosqlite:///./.data/binit.db` | Local async SQLite database |
| `STORAGE_PROVIDER` | `local` | Image storage provider |
| `STORAGE_LOCAL_DIR` | `./.data/uploads` | Local directory for report uploads |
| `AI_CLASSIFIER_PROVIDER` | `mock` | Instant mock AI classification |
| `AI_CONFIDENCE_THRESHOLD` | `0.70` | Threshold for human triage fallback |
| `ROUTING_PROVIDER` | `osrm` | OSRM routing engine |
| `ROUTING_BASE_URL` | `https://router.project-osrm.org` | Public OSRM API endpoint |
| `SEED_ON_START` | `true` | **Important**: Automatically seeds demo personas & reports on boot |
| `BACKEND_CORS_ORIGINS` | `["*"]` | Allows your Vercel frontend to query the API |

4. Click **Deploy Web Service**.
5. Once deployment completes, copy your live API URL (e.g., `https://binit-api.onrender.com`).

---

## 🌐 Part 2: Deploy Frontend (Next.js on Vercel)

### 1. Import Repository into Vercel
1. Go to the [Vercel Dashboard](https://vercel.com) and click **Add New...** → **Project**.
2. Select your GitHub repository.

### 2. Configure Project Settings
- **Framework Preset**: `Next.js`
- **Root Directory**: Click *Edit* and choose **`apps/web`**

### 3. Add Frontend Environment Variables
In the **Environment Variables** section on Vercel, configure:

| Key | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `https://binit-api.onrender.com/api/v1` | **Replace with your Render API URL + `/api/v1`** |
| `NEXT_PUBLIC_MAP_STYLE_URL` | `https://tiles.openfreemap.org/styles/liberty` | Free OpenFreeMap vector tile style |
| `NEXT_PUBLIC_DEFAULT_MAP_LAT` | `22.5726` | Kolkata center latitude |
| `NEXT_PUBLIC_DEFAULT_MAP_LON` | `88.3639` | Kolkata center longitude |
| `NEXT_PUBLIC_DEFAULT_MAP_ZOOM` | `12.5` | Default zoom level |
| `NEXT_PUBLIC_PANCHAYAT_MAP_LAT` | `22.6105` | Rajarhat GP latitude |
| `NEXT_PUBLIC_PANCHAYAT_MAP_LON` | `88.5122` | Rajarhat GP longitude |
| `NEXT_PUBLIC_PANCHAYAT_MAP_ZOOM` | `13.5` | Panchayat zoom level |

4. Click **Deploy**. Vercel will build and assign you a free production domain (e.g., `https://binit-site.vercel.app`).

---

## 🧪 Part 3: Verification & Demo Checklist

After deploying:

1. **Verify Backend Health & Swagger Docs**:
   - Open `https://<your-backend-url>/health` → should return `{"status": "ok"}`
   - Open `https://<your-backend-url>/docs` → should load interactive API documentation.
2. **Verify Frontend UI & Map**:
   - Open `https://<your-frontend-url>/` → verify landing page, interactive showcase, and Civic Copilot.
   - Click **Explore Live Demo** or **Sign In** → select any demo persona (Citizen, Operator, Worker, Admin).
3. **Verify Reporting & Map Layers**:
   - As **Citizen**: Submit a report with a waste photo; confirm instant AI classification and status update.
   - As **Operator**: Open the live map and bounds view; inspect high-severity hotspots.
   - As **Worker**: View assigned collection tasks and OSRM turn-by-turn route navigation.
   - As **Admin**: View MTTR metrics and ward benchmarks.

---

## 💡 Hackathon Demo Tips

- **Free Tier Cold Starts**: Render's free tier spins down web services after 15 minutes of inactivity. **Open your backend URL 1–2 minutes before your presentation** to wake up the server.
- **Pre-seeded Personas**: With `SEED_ON_START=true`, all 4 roles and realistic geo-tagged reports for Kolkata and Rajarhat GP are ready immediately with 1-click login.
