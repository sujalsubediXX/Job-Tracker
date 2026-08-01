import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export interface ApiErrorBody {
  error: {
    message: string;
    details?: { fieldErrors?: Record<string, string[]>; formErrors?: string[] };
  };
}

export const extractApiErrorMessage = (error: unknown, fallback = 'Something went wrong'): string => {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data as ApiErrorBody | undefined;
    if (body?.error?.message) return body.error.message;
    if (error.message) return error.message;
  }
  return fallback;
};