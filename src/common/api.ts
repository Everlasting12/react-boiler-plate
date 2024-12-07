import axios from 'axios';
import Cookies from 'js-cookie';
import { useLoginStore } from '../store/useLoginStore';

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  // baseURL: process.env.REACT_APP_KAAM_PORTAL_HOST,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to include the Authorization header
API.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  useLoginStore.getState().setLoading(true);
  return config;
});

// Add interceptors for handling response and error
API.interceptors.response.use(
  (response) => {
    useLoginStore.getState().setLoading(false);
    return response;
  },
  (error) => {
    useLoginStore.getState().setLoading(false);
    throw error;
  },
);

export default API;
