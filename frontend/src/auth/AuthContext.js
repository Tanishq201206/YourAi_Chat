import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { status, logout as apiLogout } from '../api/auth';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState({ authenticated: false, username: null, roles: [] });
  const refresh = useCallback(async () => {
    try {
      const data = await status();
      setAuth({
        authenticated: !!data?.authenticated,
        username: data?.username || null,
        roles: data?.roles || [],
      });
    } catch {
      setAuth({ authenticated: false, username: null, roles: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const doLogout = async () => {
    try { await apiLogout(); } catch {}
    await refresh();
  };

  return (
    <AuthCtx.Provider value={{ ...auth, loading, refresh, logout: doLogout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
