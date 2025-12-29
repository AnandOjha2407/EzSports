export const validateEnv = () => {
  const required = ['MONGODB_URI', 'JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.error('Please set these variables in your .env file');
    process.exit(1);
  }
  
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.FRONTEND_URL) {
      console.warn('⚠️  FRONTEND_URL not set in production - CORS may not work correctly');
    }
    
    if (process.env.JWT_SECRET === 'your-secret-key-change-this-in-production' || 
        process.env.JWT_SECRET.length < 32) {
      console.error('❌ JWT_SECRET must be changed in production and be at least 32 characters!');
      console.error('Generate a strong secret: openssl rand -hex 32');
      process.exit(1);
    }
    
    if (!process.env.MONGODB_URI.includes('mongodb+srv://') && 
        !process.env.MONGODB_URI.includes('mongodb://localhost')) {
      console.warn('⚠️  Using non-Atlas MongoDB in production is not recommended');
    }
  }
  
  console.log('✅ Environment variables validated');
};

