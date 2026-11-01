// API helper wrapper for SYMPORA
// Resolves the API base URL:
// 1. If VITE_API_URL or VITE_BACKEND_URL is set in environment (e.g. "https://symposiumfsd.onrender.com"), use it.
// 2. Otherwise default to '/api' (handled by Vite proxy locally or Vercel rewrites in production).
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL;
  if (!envUrl) return '/api';
  const clean = envUrl.trim().replace(/\/$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

const BASE_URL = getBaseUrl();

export const api = async (endpoint, { method = 'GET', body, headers = {}, isDownload = false } = {}) => {
  const token = localStorage.getItem('sympora_token');

  const config = {
    method,
    headers: {
      ...headers,
    },
  };

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  if (body && !(body instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
    config.body = JSON.stringify(body);
  } else if (body instanceof FormData) {
    config.body = body;
  }

  const url = `${BASE_URL}${endpoint}`;
  let response;

  try {
    response = await fetch(url, config);
  } catch (networkErr) {
    console.error('Network/fetch error connecting to:', url, networkErr);
    throw new Error(
      'Unable to connect to backend server. If Render backend was sleeping, please wait 30 seconds and try again.'
    );
  }

  if (isDownload) {
    if (!response.ok) {
      throw new Error('Download failed');
    }
    return response.blob();
  }

  // Safely parse JSON or text response to avoid "Unexpected end of JSON input" on 405/502/503 errors
  let data;
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch (parseError) {
      data = { message: 'Invalid JSON response from server' };
    }
  } else {
    try {
      const text = await response.text();
      data = { message: text || `Server returned status ${response.status}` };
    } catch (textError) {
      data = { message: `Request failed with status ${response.status}` };
    }
  }

  if (!response.ok) {
    const errorMsg =
      (data && data.message) ||
      (response.status === 405
        ? '405 Method Not Allowed: Check API URL and Vercel rewrite configuration.'
        : `Request failed with status ${response.status}`);
    throw new Error(errorMsg);
  }

  return data;
};
