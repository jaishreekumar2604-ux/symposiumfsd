// API helper wrapper for SYMPORA
// Resolves the API base URL:
// 1. If VITE_API_URL is set in environment, use it.
// 2. If running locally (localhost / 127.0.0.1), use '/api' (Vite proxy).
// 3. In production (e.g. Vercel), default directly to live Render backend: 'https://symposiumfsd.onrender.com/api'
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL;
  if (envUrl) {
    const clean = envUrl.trim().replace(/\/$/, '');
    return clean.endsWith('/api') ? clean : `${clean}/api`;
  }

  // Local development check
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    return '/api';
  }

  // Production fallback directly to Render backend URL
  return 'https://symposiumfsd.onrender.com/api';
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
      'Unable to connect to backend server. If Render backend was sleeping (free tier), please wait 30 seconds and try again.'
    );
  }

  if (isDownload) {
    if (!response.ok) {
      throw new Error('Download failed');
    }
    return response.blob();
  }

  // Safely read response text first to completely prevent "Unexpected end of JSON input"
  let data;
  try {
    const rawText = await response.text();
    if (!rawText || rawText.trim() === '') {
      data = {
        message: response.ok
          ? 'Success'
          : `Server returned HTTP ${response.status}. The backend might still be starting up on Render. Please retry in a few seconds.`
      };
    } else {
      try {
        data = JSON.parse(rawText);
      } catch (jsonParseErr) {
        data = { message: rawText };
      }
    }
  } catch (readErr) {
    data = {
      message: `Failed to read server response (HTTP ${response.status}). Please retry in a few seconds.`
    };
  }

  if (!response.ok) {
    const errorMsg =
      (data && data.message) ||
      (response.status === 405
        ? '405 Method Not Allowed: The request was sent to a static host. Please refresh the page.'
        : `Request failed with status ${response.status}`);
    throw new Error(errorMsg);
  }

  return data;
};
