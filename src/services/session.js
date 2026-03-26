const ACCESS_TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

export const sessionStorageService = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),

  setAccessToken: (token) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  getUser: () => {
    const rawUser = localStorage.getItem(USER_KEY);
    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser);
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },

  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearSession: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

export const AUTH_EVENTS = {
  SESSION_EXPIRED: 'auth:session-expired',
};

export const emitSessionExpired = () => {
  globalThis.dispatchEvent(new CustomEvent(AUTH_EVENTS.SESSION_EXPIRED));
};
