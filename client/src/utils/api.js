// API helper wrapper for SYMPORA
const BASE_URL = '/api';

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

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (isDownload) {
    if (!response.ok) {
      throw new Error('Download failed');
    }
    return response.blob();
  }

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
};
