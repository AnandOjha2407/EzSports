import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import roomRoutes from './routes/rooms.js';
import streamRoutes from './routes/streams.js';
import eventRoutes from './routes/events.js';
import { validateEnv } from './utils/validateEnv.js';

dotenv.config();
validateEnv();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
const corsOptions = {
  origin: (() => {
    if (process.env.NODE_ENV === 'production') {
      // In production, use FRONTEND_URL if set and valid
      if (process.env.FRONTEND_URL) {
        const frontendUrl = process.env.FRONTEND_URL.trim();
        
        // Check if it's an invalid/unresolved Railway service reference or default URL
        if (frontendUrl === 'https://railway.com' || 
            frontendUrl === 'http://railway.com' ||
            frontendUrl === 'railway.com' ||
            frontendUrl.includes('${{') || // Railway service reference not resolved
            (!frontendUrl.startsWith('http://') && !frontendUrl.startsWith('https://'))) {
          console.warn('⚠️  FRONTEND_URL is invalid or unresolved:', frontendUrl);
          console.warn('⚠️  Allowing all origins for CORS (please set FRONTEND_URL to your actual frontend URL)');
          return true; // Allow all if invalid to prevent CORS errors
        }
        
        // Split by comma for multiple origins
        const origins = frontendUrl.split(',').map(url => url.trim()).filter(url => {
          if (!url) return false;
          // Filter out invalid Railway default URLs
          if (url === 'https://railway.com' || url === 'http://railway.com') return false;
          if (!url.startsWith('http://') && !url.startsWith('https://')) return false;
          return true;
        });
        
        if (origins.length > 0) {
          console.log('✅ CORS allowed origins:', origins);
          return origins;
        }
      }
      console.warn('⚠️  FRONTEND_URL not set - allowing all origins for CORS');
      return true; // Allow all origins if FRONTEND_URL not set or invalid
    }
    // Development origins
    return ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];
  })(),
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Rate Limiting - More lenient for development, stricter for production
const isDevelopment = process.env.NODE_ENV === 'development';

// Rate Limiting - More lenient for read-only GET endpoints
const readOnlyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 1000 : 500, // Much higher limit for development, higher for production
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip OPTIONS requests (CORS preflight)
    if (req.method === 'OPTIONS') return true;
    // Skip rate limiting in development if needed (optional - commented out for safety)
    // return isDevelopment;
    return false;
  },
});

// General rate limiter for write operations (POST, PUT, DELETE) and other routes
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 500 : 200, // Higher limit for development, reasonable for production
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip OPTIONS requests (CORS preflight)
    if (req.method === 'OPTIONS') return true;
    // Skip rate limiting in development if needed (optional - commented out for safety)
    // return isDevelopment;
    return false;
  },
});

// Apply more lenient rate limiting to GET requests on read-only endpoints
// These are applied before the general limiter, so they take precedence
app.use('/api/rooms', (req, res, next) => {
  if (req.method === 'GET') {
    return readOnlyLimiter(req, res, next);
  }
  return writeLimiter(req, res, next);
});
app.use('/api/streams', (req, res, next) => {
  if (req.method === 'GET') {
    return readOnlyLimiter(req, res, next);
  }
  return writeLimiter(req, res, next);
});
app.use('/api/events', (req, res, next) => {
  if (req.method === 'GET') {
    return readOnlyLimiter(req, res, next);
  }
  return writeLimiter(req, res, next);
});

// Apply general rate limiter to all other API routes (users, health, etc.)
// Skip routes that already have specific limiters
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 500 : 200, // Higher limit for development
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip OPTIONS requests (CORS preflight)
    if (req.method === 'OPTIONS') return true;
    // Skip if route already has a specific limiter
    const path = req.path;
    return path.startsWith('/api/rooms') || 
           path.startsWith('/api/streams') || 
           path.startsWith('/api/events') ||
           path.startsWith('/api/auth');
  },
});
app.use('/api/', generalLimiter);

// Stricter limit for auth routes (but still reasonable for development)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 50 : 10, // More lenient in development
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true,
  skip: (req) => {
    // Skip OPTIONS requests (CORS preflight)
    return req.method === 'OPTIONS';
  },
});

app.use('/api/auth', authLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ezports')
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/streams', streamRoutes);
app.use('/api/events', eventRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'EZSports API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.path 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(isDevelopment && { 
      error: err,
      stack: err.stack 
    }),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

