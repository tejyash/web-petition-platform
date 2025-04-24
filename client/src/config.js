// Production URLs
const isProd = import.meta.env.PROD || false;

// API base URL that changes based on environment
export const API_BASE_URL = isProd 
  ? 'https://your-backend-app.herokuapp.com' // Replace with your actual backend URL when deployed
  : 'http://localhost:5001';

// Utility function to get full API URL
export const apiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`; 