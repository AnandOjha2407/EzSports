# 🔍 Fix "ezsports" vs "ezports" Spelling Issue

## ❌ Problem
Frontend is trying to access: `https://ezsports-backend.onrender.com` (with 's')
But it should be: `https://ezports-backend.onrender.com` (without 's')

## ✅ Code Check Results
**Good news:** No hardcoded URLs found in code! All URLs use environment variables.

## 📋 Places to Check in Render Dashboard

### 1. Frontend Service Environment Variables
**Location:** Render → `ezports-frontend` → Environment tab

**Check this variable:**
- **Key:** `VITE_API_URL`
- **Current (WRONG):** `https://ezsports-backend.onrender.com/api` ❌
- **Should be:** `https://ezports-backend.onrender.com/api` ✅

**Fix:**
1. Go to `ezports-frontend` service
2. Click "Environment" tab
3. Find `VITE_API_URL`
4. Change from `ezsports-backend` to `ezports-backend`
5. Click "Save Changes"
6. **IMPORTANT:** Redeploy frontend (this rebuilds with new URL)

### 2. Backend Service Environment Variables
**Location:** Render → `ezports-backend` → Environment tab

**Check this variable:**
- **Key:** `FRONTEND_URL`
- **Should be:** `https://ezports-frontend.onrender.com` (no 's')

**Fix:**
1. Go to `ezports-backend` service
2. Click "Environment" tab
3. Find `FRONTEND_URL`
4. Make sure it's `https://ezports-frontend.onrender.com` (not `ezsports-frontend`)
5. Click "Save Changes"
6. Redeploy backend

### 3. Service Names in Render
**Check service names:**
- Backend service name should be: `ezports-backend` (not `ezsports-backend`)
- Frontend service name should be: `ezports-frontend` (not `ezsports-frontend`)

**If service names are wrong:**
- You can't rename services in Render
- You'll need to use the actual service URLs in environment variables
- Get the exact URLs from each service's page

---

## 🔍 How to Find Your Actual URLs

### Get Backend URL:
1. Go to Render Dashboard
2. Click on your **backend service**
3. Look at the top of the page - you'll see:
   ```
   Available at your primary URL https://xxxxx.onrender.com
   ```
4. Copy this **exact URL**

### Get Frontend URL:
1. Go to Render Dashboard
2. Click on your **frontend service**
3. Look at the top of the page - you'll see:
   ```
   Available at your primary URL https://xxxxx.onrender.com
   ```
4. Copy this **exact URL**

---

## ✅ Step-by-Step Fix

### Step 1: Get Actual URLs
- [ ] Backend URL: `https://________________.onrender.com`
- [ ] Frontend URL: `https://________________.onrender.com`

### Step 2: Fix Frontend Environment Variable
- [ ] Go to `ezports-frontend` → Environment tab
- [ ] Find `VITE_API_URL`
- [ ] Update to: `https://YOUR-BACKEND-URL.onrender.com/api`
- [ ] Make sure it's `ezports-backend` NOT `ezsports-backend`
- [ ] Click "Save Changes"
- [ ] Go to "Manual Deploy" → "Deploy latest commit"
- [ ] Wait for rebuild (3-7 minutes)

### Step 3: Fix Backend Environment Variable
- [ ] Go to `ezports-backend` → Environment tab
- [ ] Find `FRONTEND_URL`
- [ ] Update to: `https://YOUR-FRONTEND-URL.onrender.com`
- [ ] Make sure it's `ezports-frontend` NOT `ezsports-frontend`
- [ ] Click "Save Changes"
- [ ] Go to "Manual Deploy" → "Deploy latest commit"
- [ ] Wait for deployment

### Step 4: Verify
- [ ] Check backend logs - should show: `✅ CORS allowed origins: [ 'https://ezports-frontend.onrender.com' ]`
- [ ] Open frontend in browser
- [ ] Check browser console - API calls should go to `ezports-backend` (not `ezsports-backend`)
- [ ] No more CORS errors

---

## 📝 Code Files Checked (All Correct ✅)

These files use environment variables correctly - no changes needed:

1. ✅ `src/services/api.js` - Uses `import.meta.env.VITE_API_URL`
2. ✅ `src/services/storage.js` - Uses `import.meta.env.VITE_API_URL`
3. ✅ `backend/server.js` - Uses `process.env.FRONTEND_URL`
4. ✅ `render.yaml` - Service names are correct: `ezports-backend`, `ezports-frontend`
5. ✅ `vite.config.js` - Allowed hosts are correct

**No code changes needed!** The issue is only in Render environment variables.

---

## 🎯 Quick Fix Summary

**The Problem:**
- `VITE_API_URL` in frontend is set to `https://ezsports-backend.onrender.com/api` ❌

**The Solution:**
- Change it to `https://ezports-backend.onrender.com/api` ✅
- Rebuild frontend
- Update backend `FRONTEND_URL` if needed
- Redeploy both

---

## ⚠️ Important Notes

1. **Frontend must be rebuilt** after changing `VITE_API_URL` (Vite embeds env vars at build time)
2. **Check actual service URLs** - they might have different subdomains (e.g., `ezports-backend-xxxx.onrender.com`)
3. **Use exact URLs** from Render dashboard, not guessed URLs
4. **Spelling matters** - `ezports` vs `ezsports` are different!

---

**After fixing environment variables in Render, the CORS errors should be resolved! 🎉**
