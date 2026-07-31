// Utility functions for API calls with cache-busting
export const addCacheBuster = (url) => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
};

// Axios interceptor to add cache-busting to all requests
export const setupAxiosCacheBusting = (axiosInstance) => {
  axiosInstance.interceptors.request.use((config) => {
    // Add cache-busting parameter to all GET requests
    if (config.method === 'get') {
      const separator = config.url.includes('?') ? '&' : '?';
      config.url = `${config.url}${separator}t=${Date.now()}`;
    }
    return config;
  });
};

// Fetch wrapper with cache-busting
export const fetchWithCacheBusting = async (url, options = {}) => {
  const cacheBustedUrl = addCacheBuster(url);
  return fetch(cacheBustedUrl, {
    ...options,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      ...options.headers,
    },
  });
};
