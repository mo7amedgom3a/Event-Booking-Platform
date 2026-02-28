export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const getHeaders = (isFormData = false) => {
  const headers: Record<string, string> = {};
  if (!isFormData) headers['Content-Type'] = 'application/json';
  return headers;
};

export const fetchWithCredentials = (input: RequestInfo | URL, init?: RequestInit) => {
  return fetch(input, {
    ...init,
    credentials: 'include',
  });
};

export const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || errorData?.detail || `API Error: ${res.statusText}`);
  }
  return res.json();
};
