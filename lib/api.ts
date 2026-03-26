import { getAccessToken } from "./session";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = await getAccessToken();
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "API request failed");
  }

  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};
