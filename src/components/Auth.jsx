import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';
const GOOGLE_CLIENT_ID = import.meta.env.GOOGLE_CLIENT_ID;
const GSI_INIT_CLIENT_KEY = '__front_seof_gsi_initialized_client_id__';
const GSI_CALLBACK_KEY = '__front_seof_gsi_active_callback__';

const Auth = () => {
  const { loginWithGoogle } = useAuth();
  const googleButtonRef = useRef(null);
  const [googleReady, setGoogleReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCredentialResponse = useCallback(
    async (response) => {
      if (!response?.credential) {
        setError('No se pudo obtener el token de Google. Intenta nuevamente.');
        return;
      }

      setLoading(true);
      setError('');

      try {
        await loginWithGoogle(response.credential);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'No se pudo iniciar sesión. Intenta nuevamente en unos segundos.',
        );
      } finally {
        setLoading(false);
      }
    },
    [loginWithGoogle],
  );

  useEffect(() => {
    globalThis[GSI_CALLBACK_KEY] = handleCredentialResponse;

    if (!GOOGLE_CLIENT_ID) {
      setError('Falta la variable GOOGLE_CLIENT_ID en el entorno del frontend.');
      return;
    }

    const initializeGoogle = () => {
      if (!globalThis.google?.accounts?.id || !googleButtonRef.current) {
        return;
      }

      const alreadyInitializedForClient = globalThis[GSI_INIT_CLIENT_KEY] === GOOGLE_CLIENT_ID;

      if (!alreadyInitializedForClient) {
        globalThis.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            const activeCallback = globalThis[GSI_CALLBACK_KEY];
            if (typeof activeCallback === 'function') {
              activeCallback(response);
            }
          },
        });

        globalThis[GSI_INIT_CLIENT_KEY] = GOOGLE_CLIENT_ID;
      }

      googleButtonRef.current.innerHTML = '';
      globalThis.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        width: 320,
      });

      setGoogleReady(true);
    };

    if (globalThis.google?.accounts?.id) {
      initializeGoogle();
      return;
    }

    const handleGoogleScriptError = () => {
      setGoogleReady(false);
      setError('No se pudo cargar Google Identity Services.');
    };

    const existingScript = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', initializeGoogle);
      existingScript.addEventListener('error', handleGoogleScriptError);

      return () => {
        existingScript.removeEventListener('load', initializeGoogle);
        existingScript.removeEventListener('error', handleGoogleScriptError);
      };
    }

    const script = document.createElement('script');
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    script.onerror = handleGoogleScriptError;
    document.head.appendChild(script);

    return () => {
      if (globalThis[GSI_CALLBACK_KEY] === handleCredentialResponse) {
        delete globalThis[GSI_CALLBACK_KEY];
      }
    };
  }, [handleCredentialResponse]);

  const hostClassName = googleReady ? 'google-button-host' : 'google-button-host is-loading';

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>🛍️ E-Commerce Monolito</h1>
        <h2>Iniciar Sesión</h2>
        <p className="auth-subtitle">Usa tu cuenta de Google para continuar</p>

        {error && <div className="message error">{error}</div>}

        <div className="google-login-wrapper">
          <div ref={googleButtonRef} className={hostClassName} />
          {loading && <p className="auth-loading">Procesando autenticacion...</p>}
          {!loading && !googleReady && !error && (
            <p className="auth-loading">Cargando login de Google...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
