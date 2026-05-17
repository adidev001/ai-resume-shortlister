# 🚀 Deployment Guide — AI Candidate Shortlisting System

> **Frontend** → Vercel · **Backend** → Render · **Database** → MongoDB Atlas

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Pre-Deployment Code Changes](#2-pre-deployment-code-changes)
3. [Deploy Backend on Render](#3-deploy-backend-on-render)
4. [Deploy Frontend on Vercel](#4-deploy-frontend-on-vercel)
5. [Post-Deployment Verification](#5-post-deployment-verification)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Prerequisites

Before deploying, make sure you have:

- ✅ A **GitHub** account with the project pushed to a repository
- ✅ A **MongoDB Atlas** cluster (cloud-hosted, not localhost)
- ✅ A **Groq** API key
- ✅ A **Vercel** account — [Sign up free](https://vercel.com/signup)
- ✅ A **Render** account — [Sign up free](https://render.com/register)

### Push Code to GitHub

If you haven't already pushed your project:

```bash
git init
git add .
git commit -m "Initial commit – AI Candidate Shortlister"
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main
git push -u origin main
```

---

## 2. Pre-Deployment Code Changes

### 2.1 — Update the Frontend API Base URL

The frontend currently has a hardcoded `localhost` API URL. Update it to read from an environment variable so it works in production.

**File:** `client/src/services/api.js`

Change line 7 from:

```js
baseURL: 'http://localhost:5000/api',
```

To:

```js
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
```

This lets Vercel inject the production backend URL at build time while keeping `localhost` as the dev fallback.

---

### 2.2 — Update the Backend CORS Config

The server currently reads `CLIENT_URL` for CORS. No code change is needed — but you **must** set this env variable on Render to your Vercel domain (see Section 3).

**File:** `server/index.js` — already correct:

```js
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
```

---

### 2.3 — Fix the dotenv Path for Render

The server currently loads `.env` from the **parent** directory (`join(__dirname, '..', '.env')`). On Render, environment variables are injected directly into the process, so this works fine. However, if Render only deploys the `server/` folder, the relative path won't matter since `process.env` is already populated.

**No code change needed** — Render injects env vars directly into `process.env`.

---

### 2.4 — Commit Your Changes

```bash
git add client/src/services/api.js
git commit -m "feat: use env variable for API base URL"
git push origin main
```

---

## 3. Deploy Backend on Render

### Step 1 — Create a New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your **GitHub repository**
4. Configure the service:

| Setting            | Value                           |
| ------------------ | ------------------------------- |
| **Name**           | `candidate-shortlister-api`     |
| **Region**         | Choose closest to your users    |
| **Branch**         | `main`                          |
| **Root Directory** | `server`                        |
| **Runtime**        | `Node`                          |
| **Build Command**  | `npm install`                   |
| **Start Command**  | `npm start`                     |
| **Instance Type**  | `Free`                          |

### Step 2 — Set Environment Variables

In the Render service dashboard, go to **"Environment"** and add:

| Key                    | Value                                                        |
| ---------------------- | ------------------------------------------------------------ |
| `PORT`                 | `10000` _(Render uses port 10000 by default)_                |
| `MONGO_URI`            | `mongodb+srv://<user>:<password>@cluster.mongodb.net/candidate-shortlister` |
| `GROQ_API_KEY`         | `gsk_your_actual_key`                                        |
| `GROQ_MODEL`           | `llama-3.3-70b-versatile`                                    |
| `CLIENT_URL`           | `https://your-app-name.vercel.app` _(update after Vercel deploy)_ |
| `NODE_ENV`             | `production`                                                 |

> ⚠️ **Important:** Use your actual MongoDB Atlas connection string (not localhost). Whitelist `0.0.0.0/0` in Atlas Network Access to allow Render to connect.

### Step 3 — Deploy

Click **"Create Web Service"**. Render will:

1. Clone your repo
2. Run `npm install` inside the `server/` directory
3. Start the server with `node index.js`

Your backend will be live at:

```
https://candidate-shortlister-api.onrender.com
```

### Step 4 — Verify Backend

Test the health endpoint in your browser or with curl:

```bash
curl https://candidate-shortlister-api.onrender.com/api/health
```

Expected response:

```json
{ "status": "ok", "timestamp": "2026-05-17T..." }
```

---

## 4. Deploy Frontend on Vercel

### Step 1 — Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New…"** → **"Project"**
3. Import your **GitHub repository**

### Step 2 — Configure Build Settings

| Setting                | Value          |
| ---------------------- | -------------- |
| **Framework Preset**   | `Vite`         |
| **Root Directory**     | `client`       |
| **Build Command**      | `npm run build`|
| **Output Directory**   | `dist`         |
| **Install Command**    | `npm install`  |

### Step 3 — Set Environment Variables

In the Vercel project settings, add:

| Key              | Value                                                    |
| ---------------- | -------------------------------------------------------- |
| `VITE_API_URL`   | `https://candidate-shortlister-api.onrender.com/api`     |

> ⚠️ **Important:** The URL must include `/api` at the end and must **NOT** have a trailing slash.

### Step 4 — Deploy

Click **"Deploy"**. Vercel will:

1. Install dependencies in `client/`
2. Run `npm run build` (Vite builds to `dist/`)
3. Serve the static files on their CDN

Your frontend will be live at:

```
https://your-app-name.vercel.app
```

### Step 5 — Update Render's CLIENT_URL

Now that you have the Vercel URL, go back to **Render** → your service → **Environment** and update:

```
CLIENT_URL = https://your-app-name.vercel.app
```

Click **"Save Changes"** — Render will auto-redeploy.

---

## 5. Post-Deployment Verification

### ✅ Checklist

| # | Check                                           | How to Verify                                            |
|---|--------------------------------------------------|----------------------------------------------------------|
| 1 | Backend health endpoint                         | Visit `https://<render-url>/api/health`                  |
| 2 | MongoDB connection                              | Check Render logs for `✅ MongoDB connected`             |
| 3 | Frontend loads                                  | Visit `https://<vercel-url>`                             |
| 4 | Frontend connects to backend                    | Open browser DevTools → Network tab, check API calls     |
| 5 | Candidates CRUD                                 | Add/view/edit/delete a candidate                         |
| 6 | Rule-based matching                             | Run a match from the UI                                  |
| 7 | AI shortlisting                                 | Test AI-powered shortlisting (requires valid API key)    |
| 8 | CORS is working                                 | No CORS errors in browser console                        |

---

## 6. Troubleshooting

### ❌ CORS Error in Browser Console

**Cause:** `CLIENT_URL` on Render doesn't match your Vercel domain.

**Fix:** Update the `CLIENT_URL` env var on Render to exactly match your Vercel URL (including `https://`, no trailing slash).

---

### ❌ Frontend Shows "Network Error"

**Cause:** `VITE_API_URL` is wrong or backend is sleeping.

**Fix:**
1. Verify `VITE_API_URL` in Vercel matches the Render URL + `/api`
2. Render free-tier services spin down after 15 min of inactivity. The first request may take ~30s to cold-start. Wait and retry.

---

### ❌ MongoDB Connection Fails on Render

**Cause:** Atlas IP whitelist is too restrictive.

**Fix:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/) → **Network Access**
2. Click **"Add IP Address"** → **"Allow Access from Anywhere"** (`0.0.0.0/0`)
3. Redeploy on Render

---

### ❌ Build Fails on Vercel

**Cause:** Missing dependencies or wrong root directory.

**Fix:**
1. Ensure **Root Directory** is set to `client` in Vercel
2. Check build logs for the specific error
3. Make sure `package.json` in `client/` has all dependencies listed

---

### ❌ Environment Variables Not Working in Frontend

**Cause:** Vite requires env vars to be prefixed with `VITE_`.

**Fix:**
- The variable **must** be named `VITE_API_URL` (not `API_URL`)
- After changing env vars on Vercel, you must **redeploy** (env vars are baked in at build time)

---

### ❌ Render Free Tier — Slow Cold Starts

Render's free tier spins down services after ~15 minutes of inactivity. First requests can take 30–60 seconds.

**Workarounds:**
- Use an external cron service (e.g., [cron-job.org](https://cron-job.org)) to ping your `/api/health` endpoint every 14 minutes
- Upgrade to Render's paid tier ($7/month) for always-on instances

---

## Quick Reference — Environment Variables Summary

### Render (Backend)

```env
PORT=10000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/candidate-shortlister
GROQ_API_KEY=gsk_your_actual_key
GROQ_MODEL=llama-3.3-70b-versatile
CLIENT_URL=https://your-app-name.vercel.app
NODE_ENV=production
```

### Vercel (Frontend)

```env
VITE_API_URL=https://candidate-shortlister-api.onrender.com/api
```

---

## Architecture Diagram

```
┌─────────────────┐         ┌──────────────────┐        ┌───────────────┐
│                 │  HTTPS  │                  │  TCP   │               │
│   Vercel CDN    │────────▶│  Render Server   │───────▶│ MongoDB Atlas │
│   (React App)   │  API    │  (Express API)   │        │  (Cloud DB)   │
│                 │ Calls   │                  │        │               │
└─────────────────┘         └──────────────────┘        └───────────────┘
   your-app.vercel.app        your-api.onrender.com       cluster.mongodb.net
```

---

**🎉 You're deployed!** Your AI Candidate Shortlisting System is now live on the web.
