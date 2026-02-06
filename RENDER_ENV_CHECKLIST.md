# 🔍 Render Environment Variables Checklist

## ⚠️ CORS Error Fix Checklist

Follow this checklist **EXACTLY** to fix the CORS error.

---

## 📋 Backend Service (`ezports-backend` or `ezsports-backend`)

### Step 1: Go to Backend Service
- [ ] Open Render Dashboard
- [ ] Click on your **backend service** (check the exact name)
- [ ] Click **"Environment"** tab

### Step 2: Check/Set Environment Variables

**Variable 1: MONGODB_URI**
- [ ] **Key:** `MONGODB_URI`
- [ ] **Value:** `mongodb+srv://anandojha901_db_user:Anandkhkushi%402407@ezsports.jcmtpad.mongodb.net/ezports?retryWrites=true&w=majority`
- [ ] ✅ Must include `/ezports` database name
- [ ] ✅ Password must be URL-encoded (`@` = `%40`)

**Variable 2: JWT_SECRET**
- [ ] **Key:** `JWT_SECRET`
- [ ] **Value:** `9608c8d2e7261d7820bd0c0723244073e5ee9d17734e45b1fcfb83fab693f0d2` (or your 32+ char secret)
- [ ] ✅ Must be at least 32 characters

**Variable 3: FRONTEND_URL** ⚠️ **CRITICAL FOR CORS**
- [ ] **Key:** `FRONTEND_URL`
- [ ] **Value:** `https://ezports-frontend.onrender.com` 
- [ ] ⚠️ **MUST MATCH EXACTLY** your frontend URL (check below)
- [ ] ✅ Must start with `https://`
- [ ] ✅ NO trailing slash
- [ ] ✅ Check spelling: `ezports` (not `ezsports`)

**Variable 4: NODE_ENV**
- [ ] **Key:** `NODE_ENV`
- [ ] **Value:** `production`
- [ ] ✅ Should already be set by render.yaml

### Step 3: Get Your Actual Frontend URL
- [ ] Go to **frontend service** in Render
- [ ] Copy the **exact URL** from the service page
- [ ] Example: `https://ezports-frontend.onrender.com` or `https://ezports-frontend-xxxx.onrender.com`
- [ ] ⚠️ **Note the exact spelling and subdomain**

### Step 4: Update FRONTEND_URL
- [ ] Go back to **backend service** → **Environment** tab
- [ ] Find `FRONTEND_URL`
- [ ] Update it to match **EXACTLY** your frontend URL
- [ ] Click **"Save Changes"**

### Step 5: Redeploy Backend
- [ ] Go to **"Manual Deploy"** → **"Deploy latest commit"**
- [ ] Wait for deployment to complete
- [ ] Check logs for: `✅ CORS allowed origins: [ 'https://your-frontend-url.onrender.com' ]`

---

## 📋 Frontend Service (`ezports-frontend`)

### Step 1: Go to Frontend Service
- [ ] Open Render Dashboard
- [ ] Click on your **frontend service**
- [ ] Click **"Environment"** tab

### Step 2: Check/Set Environment Variables

**Variable 1: VITE_API_URL** ⚠️ **CRITICAL**
- [ ] **Key:** `VITE_API_URL`
- [ ] **Value:** `https://ezports-backend.onrender.com/api` (or your actual backend URL)
- [ ] ⚠️ **MUST include `/api` at the end**
- [ ] ✅ Must start with `https://`
- [ ] ✅ Get the exact backend URL from backend service page

**Variable 2: NODE_ENV**
- [ ] **Key:** `NODE_ENV`
- [ ] **Value:** `production`
- [ ] ✅ Should already be set by render.yaml

### Step 3: Get Your Actual Backend URL
- [ ] Go to **backend service** in Render
- [ ] Copy the **exact URL** from the service page
- [ ] Example: `https://ezports-backend.onrender.com` or `https://ezports-backend-xxxx.onrender.com`
- [ ] ⚠️ **Note the exact spelling and subdomain**

### Step 4: Update VITE_API_URL
- [ ] Go back to **frontend service** → **Environment** tab
- [ ] Find `VITE_API_URL`
- [ ] Update it to: `https://your-backend-url.onrender.com/api`
- [ ] ⚠️ **MUST include `/api` suffix**
- [ ] Click **"Save Changes"**

### Step 5: Rebuild Frontend
- [ ] Go to **"Manual Deploy"** → **"Deploy latest commit"**
- [ ] ⚠️ **This will rebuild** (takes 3-7 minutes)
- [ ] Wait for deployment to complete

---

## 🔍 Verification Steps

### Check Backend Logs
1. Go to **backend service** → **"Logs"** tab
2. Look for this line:
   ```
   ✅ CORS allowed origins: [ 'https://ezports-frontend.onrender.com' ]
   ```
3. ✅ Should show your **exact frontend URL**
4. ❌ If it shows wrong URL or "allowing all origins", `FRONTEND_URL` is wrong

### Check Frontend Console
1. Open your frontend URL in browser
2. Open **Developer Tools** (F12)
3. Go to **Console** tab
4. Look for API calls - they should go to your backend URL
5. ❌ If you see CORS errors, `FRONTEND_URL` doesn't match frontend URL

### Test API Connection
1. Visit: `https://your-backend-url.onrender.com/api/health`
2. Should return: `{"status":"OK","message":"EZSports API is running"}`
3. ✅ If this works, backend is running

---

## 🐛 Common Mistakes

### ❌ Wrong FRONTEND_URL
- `https://ezsports-frontend.onrender.com` (with 's') 
- `http://ezports-frontend.onrender.com` (http instead of https)
- `https://ezports-frontend.onrender.com/` (trailing slash)
- `ezports-frontend.onrender.com` (missing https://)

### ✅ Correct FRONTEND_URL
- `https://ezports-frontend.onrender.com` (exact match, no trailing slash)

### ❌ Wrong VITE_API_URL
- `https://ezports-backend.onrender.com` (missing /api)
- `http://ezports-backend.onrender.com/api` (http instead of https)
- `https://ezports-backend.onrender.com/api/` (trailing slash - might work but not ideal)

### ✅ Correct VITE_API_URL
- `https://ezports-backend.onrender.com/api` (with /api, no trailing slash)

---

## 📝 Quick Reference

### Backend Environment Variables
```
MONGODB_URI=mongodb+srv://anandojha901_db_user:Anandkhkushi%402407@ezsports.jcmtpad.mongodb.net/ezports?retryWrites=true&w=majority
JWT_SECRET=9608c8d2e7261d7820bd0c0723244073e5ee9d17734e45b1fcfb83fab693f0d2
FRONTEND_URL=https://ezports-frontend.onrender.com
NODE_ENV=production
```

### Frontend Environment Variables
```
VITE_API_URL=https://ezports-backend.onrender.com/api
NODE_ENV=production
```

---

## ✅ Final Checklist

- [ ] Backend `FRONTEND_URL` matches frontend URL **EXACTLY**
- [ ] Frontend `VITE_API_URL` includes `/api` suffix
- [ ] Both URLs use `https://` (not `http://`)
- [ ] No trailing slashes
- [ ] Backend redeployed after setting `FRONTEND_URL`
- [ ] Frontend rebuilt after setting `VITE_API_URL`
- [ ] Backend logs show correct CORS origins
- [ ] No CORS errors in browser console

---

## 🚨 If Still Not Working

1. **Check service names match:**
   - Backend service name in Render
   - Frontend service name in Render
   - URLs might have different subdomains

2. **Check backend logs:**
   - Look for CORS configuration messages
   - Verify `FRONTEND_URL` is being read correctly

3. **Clear browser cache:**
   - Hard refresh (Ctrl+Shift+R)
   - Or use incognito mode

4. **Verify both services are "Live":**
   - Both should show green "Live" status
   - Not "Building" or "Deploying"

---

**After completing this checklist, CORS errors should be fixed! 🎉**
