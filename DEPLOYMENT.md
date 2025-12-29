# 🚀 Deployment Guide - Deploy Frontend + Backend Together

Complete guide to deploy both frontend and backend from the same repository.

## 📋 Prerequisites

- GitHub account
- Railway account (free tier available) or Render account
- MongoDB Atlas connection string (already configured)

---

## 🚂 Option 1: Railway (Recommended)

### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Create Railway Project

1. Go to https://railway.app and sign in with GitHub
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your EZports repository

### Step 3: Add Backend Service

1. Click **"+ New"** → **"GitHub Repo"** → Select your repository
2. **Configure Service:**
   - **Name:** `ezports-backend` (or any name)
   - Go to **"Settings"** tab
   - **Root Directory:** `backend`
   - **Start Command:** `npm start`

3. **Add Environment Variables** (Variables tab):
   ```
   PORT=3000
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://anandojha901_db_user:Anandkhkushi%402407@ezsports.jcmtpad.mongodb.net/ezports?retryWrites=true&w=majority
   JWT_SECRET=9608c8d2e7261d7820bd0c0723244073e5ee9d17734e45b1fcfb83fab693f0d2
   FRONTEND_URL=${{ezports-frontend.RAILWAY_PUBLIC_DOMAIN}}
   ```

4. **Generate Public Domain:**
   - Settings → Domains → Generate Domain
   - Note the domain (e.g., `ezports-backend.railway.app`)

### Step 4: Add Frontend Service

1. Click **"+ New"** → **"GitHub Repo"** → Select your repository
2. **Configure Service:**
   - **Name:** `ezports-frontend`
   - **Root Directory:** `.` (root directory)
   - **Start Command:** `npm start`

3. **Add Environment Variables:**
   ```
   NODE_ENV=production
   VITE_API_URL=${{ezports-backend.RAILWAY_PUBLIC_DOMAIN}}/api
   PORT=4173
   ```
   
   **Note about Railway warning:** Railway may warn about using `RAILWAY_PUBLIC_DOMAIN` and egress fees. For frontend applications, you MUST use the public domain because:
   - The frontend runs in users' browsers (outside Railway's network)
   - Browsers cannot access private domains (`RAILWAY_PRIVATE_DOMAIN`)
   - The API URL is embedded at build time into the JavaScript bundle
   - Egress fees only apply to server-to-server communication, not browser requests

4. **Generate Public Domain:**
   - Settings → Domains → Generate Domain
   - Note the domain (e.g., `ezports-frontend.railway.app`)

### Step 5: Update Backend CORS

1. Go to backend service → Variables tab
2. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=${{ezports-frontend.RAILWAY_PUBLIC_DOMAIN}}
   ```
   (Replace `ezports-frontend` with your actual frontend service name)

### Step 6: Verify Deployment

- **Backend Health:** `https://your-backend.railway.app/api/health`
- **Frontend:** Visit your frontend domain
- **Test:** Register → Login → Create Room

---

## 🌐 Option 2: Render

1. Go to https://render.com and sign in with GitHub
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will auto-detect `render.yaml`
5. **Set Environment Variables** in Render dashboard:

   **Backend Service (ezports-backend):**
   - Go to backend service → Environment tab
   - Add these variables:
     ```
     MONGODB_URI=mongodb+srv://anandojha901_db_user:Anandkhkushi%402407@ezsports.jcmtpad.mongodb.net/ezports?retryWrites=true&w=majority
     JWT_SECRET=9608c8d2e7261d7820bd0c0723244073e5ee9d17734e45b1fcfb83fab693f0d2
     FRONTEND_URL=https://ezports-frontend.onrender.com
     ```
     (Update FRONTEND_URL after frontend deploys with actual URL)

   **Frontend Service (ezports-frontend):**
   - Go to frontend service → Environment tab
   - Add this variable (IMPORTANT: Set this BEFORE building):
     ```
     VITE_API_URL=https://ezports-backend.onrender.com/api
     ```
     (Update with actual backend URL after backend deploys)
     - **Note:** Vite environment variables are embedded at build time. If you set this after building, you need to rebuild/redeploy the frontend.

6. Click **"Apply"** to deploy both services!

---

## 🔧 Environment Variables Reference

### Backend Service

```
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb+srv://anandojha901_db_user:Anandkhkushi%402407@ezsports.jcmtpad.mongodb.net/ezports?retryWrites=true&w=majority
JWT_SECRET=9608c8d2e7261d7820bd0c0723244073e5ee9d17734e45b1fcfb83fab693f0d2
FRONTEND_URL=<your-frontend-url>
```

### Frontend Service

```
NODE_ENV=production
VITE_API_URL=<your-backend-url>/api
PORT=4173
```

**Note:** Railway supports service references: `${{service-name.RAILWAY_PUBLIC_DOMAIN}}`

---

## ✅ Post-Deployment Checklist

- [ ] Backend health check works
- [ ] Frontend loads without errors
- [ ] Frontend connects to backend (check browser console)
- [ ] User registration works
- [ ] User login works
- [ ] Creating rooms works (as creator)
- [ ] No CORS errors

---

## 🐛 Troubleshooting

**CORS Errors:**
- Ensure `FRONTEND_URL` matches frontend domain exactly (with https://)
- No trailing slashes

**Frontend can't reach backend:**
- Verify `VITE_API_URL` is set correctly
- Check backend service is running (green status)
- Ensure URL includes `/api` suffix

**Build Failures:**
- Check service logs in dashboard
- Verify all environment variables are set
- Ensure root directories are correct

---

## 🔄 Automatic Deploys

Both Railway and Render automatically deploy when you push to GitHub!

---

## 💰 Free Tiers

- **Railway:** $5 free credit/month, 500 hours usage
- **Render:** Free tier available with some limitations

Both provide automatic HTTPS and public domains!

