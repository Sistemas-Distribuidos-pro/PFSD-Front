import axios from 'axios';
import { emitSessionExpired, sessionStorageService } from './session';

const ORDER_SERVICE_URL = import.meta.env.VITE_ORDER_SERVICE_URL;
const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL;
const CATALOG_SERVICE_URL = import.meta.env.VITE_CATALOG_SERVICE_URL;

const defaultConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const authApi = axios.create({
  baseURL: AUTH_SERVICE_URL,
  ...defaultConfig,
});

const catalogApi = axios.create({
  baseURL: CATALOG_SERVICE_URL,
  ...defaultConfig,
});

const orderApi = axios.create({
  baseURL: ORDER_SERVICE_URL,
  ...defaultConfig,
});

const attachInterceptors = (instance) => {
  instance.interceptors.request.use((config) => {
    const token = sessionStorageService.getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        sessionStorageService.clearSession();
        emitSessionExpired();
      }

      return Promise.reject(error);
    },
  );
};

[authApi, catalogApi, orderApi].forEach(attachInterceptors);

export { authApi, catalogApi, orderApi };
