// Environment configuration for server
require('dotenv').config();

module.exports = {
  // Node environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Server port
  PORT: process.env.PORT || 5001,
  
  // Database configuration
  DB: {
    HOST: process.env.DB_HOST || 'localhost',
    USER: process.env.DB_USER || 'root',
    PASSWORD: process.env.DB_PASSWORD || '12345678',
    NAME: process.env.DB_NAME || 'cw2db',
  },
  
  // CORS configuration
  CORS: {
    ORIGINS: [
      'http://localhost:5173',
      process.env.FRONTEND_URL || 'https://yourusername.github.io', // Replace with your GitHub username
    ],
  },
  
  // Session configuration
  SESSION: {
    SECRET: process.env.SESSION_SECRET || 'randomSecret',
    COOKIE: {
      SECURE: process.env.NODE_ENV === 'production',
      SAME_SITE: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
  },
}; 