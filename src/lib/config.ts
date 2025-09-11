// Environment configuration
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname.includes('lovable.dev');
const isProduction = window.location.hostname === 'choptym.com';

export const config = {
  // Environment detection
  isDevelopment,
  isProduction,
  
  // Supabase configuration
  supabase: {
    url: "https://qiupqrmtxwtgipbwcvoo.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpdXBxcm10eHd0Z2lwYndjdm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MDkzNzYsImV4cCI6MjA3Mjk4NTM3Nn0.8tU8HKF2hW4uXxoUIbnDeG0LVVJHU7Z1ESxvWgSY5N0"
  },
  
  // App URLs
  app: {
    baseUrl: isProduction ? 'https://choptym.com' : window.location.origin,
    redirectUrl: isProduction ? 'https://choptym.com/' : `${window.location.origin}/`
  },
  
  // API endpoints
  api: {
    baseUrl: isProduction ? 'https://choptym.com' : window.location.origin
  }
};