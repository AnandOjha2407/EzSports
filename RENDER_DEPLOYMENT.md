# 🚀 Complete Render Deployment Guide for EZports

This guide provides **exact step-by-step instructions** to deploy your EZports application on Render.

---

## ✅ Pre-Deployment Checklist

Before starting, ensure:
- [x] Code is pushed to GitHub repository
- [x] MongoDB Atlas account created and cluster ready
- [x] MongoDB connection string available
- [x] JWT secret generated (32+ characters)

---

## 📋 Step-by-Step Deployment Instructions

### Step 1: Prepare Your Repository

1. **Ensure all code is committed and pushed to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for Render deployment"
   git push origin main
   ```

2. **Verify `render.yaml` exists in the root directory** (✅ Already done)

---

### Step 2: Create Render Account & Connect GitHub

1. Go to [https://render.com](https://render.com)
2. Click **"Get Started for Free"** or **"Sign In"**
3. Sign in with your **GitHub account**
4. Authorize Render to access your repositories

---

### Step 3: Deploy Using Blueprint (Recommended)

1. In Render dashboard, click **"New +"** → **"Blueprint"**
2. Connect your GitHub account if not already connected
3. Select your **EZports repository**
4. Render will automatically detect `render.yaml`
5. Click **"Apply"** to create both services

**⚠️ IMPORTANT:** Do NOT click "Apply" yet if you haven't set environment variables! Read Step 4 first.

---

### Step 4: Configure Environment Variables

**CRITICAL:** Set environment variables **BEFORE** the first deployment, especially `VITE_API_URL` for the frontend!

#### 4.1: Backend Environment Variables

1. After creating the blueprint, you'll see two services: `ezports-backend` and `ezports-frontend`
2. Click on **`ezports-backend`** service
3. Go to **"Environment"** tab
4. Click **"Add Environment Variable"** and add:

   ```
   Key: MONGODB_URI
   Value: mongodb+srv://your-username:your-password@cluster.mongodb.net/ezports?retryWrites=true&w=majority
   ```
   *(Replace with your actual MongoDB Atlas connection string)*

   ```
   Key: JWT_SECRET
   Value: [Generate a 32+ character secret]
   ```
   *(Generate using: `openssl rand -hex 32` or use an online generator)*

   ```
   Key: FRONTEND_URL
   Value: https://ezports-frontend.onrender.com
   ```
   *(We'll update this after frontend deploys - use placeholder for now)*

   ```
   Key: NODE_ENV
   Value: production
   ```
   *(This is already in render.yaml, but you can verify)*

#### 4.2: Frontend Environment Variables (CRITICAL!)

1. Click on **`ezports-frontend`** service
2. Go to **"Environment"** tab
3. Click **"Add Environment Variable"** and add:

   ```
   Key: VITE_API_URL
   Value: https://ezports-backend.onrender.com/api
   ```
   **⚠️ CRITICAL:** Set this BEFORE the first build! Vite embeds env vars at build time.
   *(We'll use a placeholder - update after backend deploys)*

   ```
   Key: NODE_ENV
   Value: production
   ```
   *(This is already in render.yaml, but you can verify)*

---

### Step 5: Deploy Backend First

1. Go to **`ezports-backend`** service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. Wait for deployment to complete (2-5 minutes)
4. Check logs to ensure:
   - ✅ "Connected to MongoDB"
   - ✅ "Server is running on http://localhost:XXXX"
   - ✅ No errors

5. **Get your backend URL:**
   - Go to **"Settings"** tab
   - Under **"Custom Domain"** or **"Render URL"**, note your backend URL
   - Example: `https://ezports-backend.onrender.com`

6. **Test backend health:**
   - Visit: `https://your-backend-url.onrender.com/api/health`
   - Should return: `{"status":"OK","message":"EZSports API is running"}`

---

### Step 6: Update Frontend Environment Variable

1. Go to **`ezports-frontend`** service
2. Go to **"Environment"** tab
3. **Update** `VITE_API_URL` with your actual backend URL:
   ```
   Key: VITE_API_URL
   Value: https://ezports-backend.onrender.com/api
   ```
   *(Replace with your actual backend URL from Step 5)*

4. **Save** the environment variable

---

### Step 7: Deploy Frontend

1. Go to **`ezports-frontend`** service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. Wait for deployment to complete (3-7 minutes)
   - Build takes longer due to `npm install && npm run build`
4. Check logs to ensure:
   - ✅ Build completes successfully
   - ✅ "Local: http://localhost:XXXX" appears
   - ✅ No errors

5. **Get your frontend URL:**
   - Go to **"Settings"** tab
   - Under **"Custom Domain"** or **"Render URL"**, note your frontend URL
   - Example: `https://ezports-frontend.onrender.com`

---

### Step 8: Update Backend CORS Configuration

1. Go to **`ezports-backend`** service
2. Go to **"Environment"** tab
3. **Update** `FRONTEND_URL` with your actual frontend URL:
   ```
   Key: FRONTEND_URL
   Value: https://ezports-frontend.onrender.com
   ```
   *(Replace with your actual frontend URL from Step 7)*

4. **Save** the environment variable
5. **Redeploy backend** (Render will auto-redeploy, or manually trigger):
   - Click **"Manual Deploy"** → **"Deploy latest commit"**

---

### Step 9: Verify Deployment

1. **Test Backend:**
   - Visit: `https://your-backend-url.onrender.com/api/health`
   - Should return: `{"status":"OK","message":"EZSports API is running"}`

2. **Test Frontend:**
   - Visit: `https://your-frontend-url.onrender.com`
   - Should load the homepage without errors
   - Open browser console (F12) - check for:
     - ✅ No CORS errors
     - ✅ API calls are working
     - ✅ No 404 errors

3. **Test Full Flow:**
   - [ ] Register a new user
   - [ ] Login with credentials
   - [ ] Browse rooms/events
   - [ ] Create a room (as creator)
   - [ ] Join a room

---

## 🔧 Environment Variables Summary

### Backend (`ezports-backend`)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ezports?retryWrites=true&w=majority
JWT_SECRET=your-32-character-secret-key-here
FRONTEND_URL=https://ezports-frontend.onrender.com
NODE_ENV=production
PORT=10000 (auto-set by Render, don't override)
```

### Frontend (`ezports-frontend`)
```
VITE_API_URL=https://ezports-backend.onrender.com/api
NODE_ENV=production
PORT=10000 (auto-set by Render, don't override)
```

---

## 🐛 Troubleshooting

### Issue: Frontend shows "Backend server is not available"

**Solution:**
1. Check `VITE_API_URL` is set correctly in frontend environment variables
2. Ensure backend URL includes `/api` suffix
3. Verify backend is running (check logs)
4. **Important:** If you set `VITE_API_URL` after the first build, you must rebuild:
   - Go to frontend service → **"Manual Deploy"** → **"Deploy latest commit"**

### Issue: CORS Errors

**Solution:**
1. Check `FRONTEND_URL` in backend environment variables
2. Ensure it matches frontend URL exactly (with `https://`, no trailing slash)
3. Redeploy backend after updating `FRONTEND_URL`

### Issue: Build Fails

**Solution:**
1. Check build logs for specific errors
2. Verify all dependencies are in `package.json`
3. Ensure Node.js version is compatible (Render uses Node 18+ by default)
4. Check for syntax errors in code

### Issue: MongoDB Connection Failed

**Solution:**
1. Verify `MONGODB_URI` is correct
2. Check MongoDB Atlas IP whitelist (add `0.0.0.0/0` for Render)
3. Verify database user credentials
4. Check MongoDB Atlas cluster is running

### Issue: Frontend Build Succeeds but App Doesn't Load

**Solution:**
1. Check browser console for errors
2. Verify `VITE_API_URL` was set BEFORE the build
3. If you changed `VITE_API_URL` after build, rebuild the frontend
4. Check Render logs for runtime errors

---

## 🔄 Automatic Deploys

Render automatically deploys when you push to your GitHub repository's main branch!

**To disable auto-deploy:**
- Go to service → **"Settings"** → **"Auto-Deploy"** → Toggle off

**To trigger manual deploy:**
- Go to service → **"Manual Deploy"** → **"Deploy latest commit"**

---

## 💰 Render Free Tier Limitations

**Free Tier Includes:**
- ✅ 750 hours/month (enough for 24/7 single service)
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Auto-deploy from GitHub

**Free Tier Limitations:**
- ⚠️ Services spin down after 15 minutes of inactivity
- ⚠️ First request after spin-down takes 30-60 seconds (cold start)
- ⚠️ Limited to 512MB RAM per service
- ⚠️ No persistent storage (use MongoDB Atlas for database)

**For Production:**
- Consider upgrading to **Starter** plan ($7/month per service) for:
  - Always-on services (no spin-down)
  - Faster cold starts
  - More resources

---

## ✅ Post-Deployment Checklist

- [ ] Backend health check works (`/api/health`)
- [ ] Frontend loads without errors
- [ ] No CORS errors in browser console
- [ ] User registration works
- [ ] User login works
- [ ] Creating rooms works (as creator)
- [ ] Joining rooms works
- [ ] All API endpoints respond correctly
- [ ] MongoDB connection is stable
- [ ] Environment variables are set correctly

---

## 🎯 Is Render a Good Choice?

### ✅ Advantages:
1. **Free Tier Available** - Great for learning and small projects
2. **Easy Setup** - Blueprint deployment is straightforward
3. **Automatic HTTPS** - SSL certificates included
4. **GitHub Integration** - Auto-deploy on push
5. **Good Documentation** - Clear guides and support
6. **No Credit Card Required** - For free tier

### ⚠️ Considerations:
1. **Cold Starts** - Free tier services spin down after inactivity (15 min)
2. **Build Time** - Can be slower than Railway (3-7 min vs 1-3 min)
3. **Resource Limits** - Free tier has 512MB RAM limit
4. **No Service References** - Unlike Railway, can't reference other services directly

### 🆚 Render vs Railway:

| Feature | Render (Free) | Railway (Free) |
|---------|---------------|----------------|
| Always On | ❌ (spins down) | ✅ (always on) |
| Cold Start | 30-60s | Instant |
| Build Time | 3-7 min | 1-3 min |
| Setup Complexity | Easy | Easy |
| Service References | ❌ | ✅ |
| Free Tier Hours | 750/month | 500 hours |
| Best For | Learning, demos | Production apps |

**Recommendation:**
- **Render:** Good for demos, portfolios, learning projects
- **Railway:** Better for production apps that need always-on services
- **Both:** Excellent choices for full-stack React + Node.js apps

---

## 📞 Need Help?

1. Check Render logs: Service → **"Logs"** tab
2. Check Render documentation: [https://render.com/docs](https://render.com/docs)
3. Render community: [https://community.render.com](https://community.render.com)

---

**🎉 Congratulations! Your EZports app should now be live on Render!**
