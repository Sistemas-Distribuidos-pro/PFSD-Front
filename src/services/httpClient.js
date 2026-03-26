import axios from 'axios';
import { emitSessionExpired, sessionStorageService } from './session';

const ORDER_API_URL = import.meta.env.ORDER_API_URL;
const AUTH_API_URL = import.meta.env.AUTH_API_URL;
const CATALOG_API_URL = import.meta.env.CATALOG_API_URL;

const defaultConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const authApi = axios.create({
  baseURL: AUTH_API_URL,
  ...defaultConfig,
});

const catalogApi = axios.create({
  baseURL: CATALOG_API_URL,
  ...defaultConfig,
});

const orderApi = axios.create({
  baseURL: ORDER_API_URL,
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
    }
  );
};

[authApi, catalogApi, orderApi].forEach(attachInterceptors);

export { authApi, catalogApi, orderApi };
