import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { authService } from '../services/api';
import { AUTH_EVENTS, sessionStorageService } from '../services/session';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const clearSession = useCallback(() => {
    sessionStorageService.clearSession();
    setUser(null);
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const loginWithGoogle = useCallback(async (idToken) => {
    const response = await authService.exchangeGoogleToken(idToken);
    const { data } = response.data;

    sessionStorageService.setAccessToken(data.accessToken);
    sessionStorageService.setUser(data.user);
    setUser(data.user);

    return data.user;
  }, []);

  const refreshSession = useCallback(async () => {
    const token = sessionStorageService.getAccessToken();

    if (!token) {
      clearSession();
      setIsAuthLoading(false);
      return;
    }

    try {
      const response = await authService.getCurrentUser();
      const currentUser = response.data?.data?.user || response.data?.data || sessionStorageService.getUser();
      if (currentUser) {
        sessionStorageService.setUser(currentUser);
      }
      setUser(currentUser || null);
    } catch {
      clearSession();
    } finally {
      setIsAuthLoading(false);
    }
  }, [clearSession]);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    const handleSessionExpired = () => {
      clearSession();
    };

    globalThis.addEventListener(AUTH_EVENTS.SESSION_EXPIRED, handleSessionExpired);
    return () => {
      globalThis.removeEventListener(AUTH_EVENTS.SESSION_EXPIRED, handleSessionExpired);
    };
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAuthLoading,
      loginWithGoogle,
      logout,
      refreshSession,
    }),
    [isAuthLoading, loginWithGoogle, logout, refreshSession, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
