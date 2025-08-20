// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://10.0.2.2:3000/api',
  // For Android emulator, use: 'http://10.0.2.2:3000/api'
  // For iOS simulator, use: 'http://localhost:3000/api'
};

export const getApiBaseUrl = () => {
  return API_CONFIG.BASE_URL;
};
