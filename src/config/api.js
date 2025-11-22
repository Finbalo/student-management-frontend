// API configuration
const config = {
  development: {
    apiBaseURL: 'http://localhost:3000/api',
  },
  production: {
    apiBaseURL: 'https://student-management-backend-7izx.onrender.com',
  },
}

// Determine current environment
const isDevelopment =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
const currentConfig = isDevelopment ? config.development : config.production

export const API_BASE_URL = currentConfig.apiBaseURL
