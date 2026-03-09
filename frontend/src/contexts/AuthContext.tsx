import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { buildApiUrl as buildApiEndpointUrl, setTokenProvider } from '../api/client';

interface User {
  id: string;
  email: string;
  display_name: string;
  username: string;
  role: string;
  is_verified?: boolean;
  is_guest?: boolean;
  auth_type?: 'frontpage' | 'guest';
}

type AuthMode = 'frontpage' | 'guest' | null;

interface FrontpageStoredUser {
  id?: number | string;
  username?: string;
  display_name?: string;
  role?: string;
  email?: string;
}

interface GuestStoredSession {
  token: string;
  user: User;
}

interface AuthApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

interface GuestSessionPayload {
  token: string;
  user: User;
}

interface LinkGuestPayload {
  guest_user_id: string;
  linked_to_user_id: string;
  moved_rows_by_table: Record<string, number>;
  total_moved_rows: number;
}

interface LinkGuestRequestProfile {
  id?: string;
  email?: string;
  username?: string;
  display_name?: string;
  role?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
  authMode: AuthMode;
  canLinkGuestToFrontpage: boolean;
  refreshUserInfo: () => Promise<void>;
  loginWithRedirect: () => void;
  continueAsGuest: () => Promise<void>;
  getLinkAccountUrl: () => string;
  linkGuestToFrontpage: () => Promise<void>;
  logout: () => void;
  getAccessToken: () => Promise<string>;
}

const FRONTPAGE_AUTH_STORAGE_KEY = 'auth-storage';
const GUEST_AUTH_STORAGE_KEY = 'romcon-guest-session';
const AUTH_MODE_STORAGE_KEY = 'romcon-auth-mode';

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  error: null,
  authMode: null,
  canLinkGuestToFrontpage: false,
  refreshUserInfo: async () => undefined,
  loginWithRedirect: () => undefined,
  continueAsGuest: async () => undefined,
  getLinkAccountUrl: () => '/signup',
  linkGuestToFrontpage: async () => undefined,
  logout: () => undefined,
  getAccessToken: async () => {
    throw new Error('Not authenticated');
  },
});

export const useAuth = (): AuthContextType => useContext(AuthContext);

const readFrontpageToken = (): string | null => {
  const authStorage = localStorage.getItem(FRONTPAGE_AUTH_STORAGE_KEY);
  if (!authStorage) {
    return null;
  }

  try {
    const parsed = JSON.parse(authStorage) as { state?: { token?: string | null } };
    const token = parsed?.state?.token;
    return typeof token === 'string' && token.trim() !== '' ? token : null;
  } catch {
    return null;
  }
};

const readFrontpageUser = (): FrontpageStoredUser | null => {
  const authStorage = localStorage.getItem(FRONTPAGE_AUTH_STORAGE_KEY);
  if (!authStorage) {
    return null;
  }

  try {
    const parsed = JSON.parse(authStorage) as { state?: { user?: FrontpageStoredUser | null } };
    return parsed?.state?.user ?? null;
  } catch {
    return null;
  }
};

const readGuestSession = (): GuestStoredSession | null => {
  const raw = localStorage.getItem(GUEST_AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as GuestStoredSession;
    if (!parsed?.token || !parsed?.user?.id) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

const saveGuestSession = (session: GuestStoredSession): void => {
  localStorage.setItem(GUEST_AUTH_STORAGE_KEY, JSON.stringify(session));
};

const clearGuestSession = (): void => {
  localStorage.removeItem(GUEST_AUTH_STORAGE_KEY);
};

const readPreferredAuthMode = (): AuthMode => {
  const raw = localStorage.getItem(AUTH_MODE_STORAGE_KEY);
  return raw === 'frontpage' || raw === 'guest' ? raw : null;
};

const savePreferredAuthMode = (mode: AuthMode): void => {
  if (mode === null) {
    localStorage.removeItem(AUTH_MODE_STORAGE_KEY);
    return;
  }

  localStorage.setItem(AUTH_MODE_STORAGE_KEY, mode);
};

const withRedirectParam = (basePath: string): string => {
  const fallback = `${basePath}`;

  try {
    const redirectUrl = window.location.href;
    const url = new URL(basePath, window.location.origin);
    url.searchParams.set('redirect', redirectUrl);
    return url.toString();
  } catch {
    return fallback;
  }
};

const appendQueryParam = (urlValue: string, key: string, value: string): string => {
  try {
    const url = new URL(urlValue, window.location.origin);
    url.searchParams.set(key, value);
    return url.toString();
  } catch {
    return urlValue;
  }
};

const getFrontpageLoginUrl = (): string => {
  const configured = import.meta.env.VITE_WEBHATCHERY_LOGIN_URL || '/login';
  return withRedirectParam(configured);
};

const getFrontpageSignupUrl = (): string => {
  const configured = import.meta.env.VITE_WEBHATCHERY_SIGNUP_URL || '/signup';
  return withRedirectParam(configured);
};

const buildApiUrl = (path: string): string => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1';
  const version = import.meta.env.VITE_API_VERSION || '';
  return buildApiEndpointUrl(baseUrl, version, path);
};

const readGuestUserIdFromUrl = (): string | null => {
  try {
    const url = new URL(window.location.href);
    const value = (url.searchParams.get('guest_user_id') || '').trim();
    return value !== '' ? value : null;
  } catch {
    return null;
  }
};

const removeGuestUserIdFromUrl = (): void => {
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete('guest_user_id');
    window.history.replaceState({}, '', url.toString());
  } catch {
    // Ignore URL cleanup failures.
  }
};

const getStoredAuth = (): { token: string | null; mode: AuthMode; guestUser: User | null } => {
  const preferredMode = readPreferredAuthMode();
  const frontpageToken = readFrontpageToken();
  const guest = readGuestSession();

  if (preferredMode === 'guest' && guest?.token) {
    return { token: guest.token, mode: 'guest', guestUser: guest.user };
  }

  if (preferredMode === 'frontpage' && frontpageToken) {
    return { token: frontpageToken, mode: 'frontpage', guestUser: null };
  }

  if (guest?.token) {
    return { token: guest.token, mode: 'guest', guestUser: guest.user };
  }

  if (frontpageToken) {
    return { token: frontpageToken, mode: 'frontpage', guestUser: null };
  }

  return { token: null, mode: null, guestUser: null };
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasAttemptedGuestLinkRef = useRef(false);

  const syncTokenFromStorage = useCallback(() => {
    const next = getStoredAuth();
    setToken(next.token);
    setAuthMode(next.mode);
    if (next.mode === 'guest') {
      setUser(next.guestUser);
    }
  }, []);

  const loginWithRedirect = useCallback(() => {
    setError(null);

    const existingToken = readFrontpageToken();
    if (existingToken) {
      savePreferredAuthMode('frontpage');
      setToken(existingToken);
      setAuthMode('frontpage');
      setUser(null);
      return;
    }

    savePreferredAuthMode('frontpage');
    window.location.href = getFrontpageLoginUrl();
  }, []);

  const getLinkAccountUrl = useCallback(() => {
    const baseUrl = getFrontpageSignupUrl();
    if (user?.is_guest && user.id) {
      return appendQueryParam(baseUrl, 'guest_user_id', user.id);
    }

    return baseUrl;
  }, [user]);

  const linkGuestToFrontpage = useCallback(async (): Promise<void> => {
    const guestSession = readGuestSession();
    const frontpageToken = readFrontpageToken();
    const frontpageUser = readFrontpageUser();

    if (!guestSession?.user?.id || !guestSession.user.is_guest) {
      throw new Error('No guest session is available to link.');
    }

    if (!frontpageToken) {
      throw new Error('No WebHatchery session is available to link.');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(buildApiUrl('/auth/link-guest'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${frontpageToken}`,
        },
        body: JSON.stringify({
          guest_user_id: guestSession.user.id,
          frontpage_user: {
            id: frontpageUser?.id != null ? String(frontpageUser.id) : undefined,
            email: frontpageUser?.email,
            username: frontpageUser?.username,
            display_name: frontpageUser?.display_name,
            role: frontpageUser?.role,
          } satisfies LinkGuestRequestProfile,
        }),
      });

      const raw = await response.text();
      const result = raw ? (JSON.parse(raw) as AuthApiResponse<LinkGuestPayload>) : null;
      if (!response.ok || !result?.success || !result.data) {
        throw new Error(result?.message || result?.error || `Failed to link guest data (${response.status})`);
      }

      clearGuestSession();
      savePreferredAuthMode('frontpage');
      setToken(frontpageToken);
      setAuthMode('frontpage');
      setUser({
        id: String(frontpageUser?.id ?? ''),
        email: frontpageUser?.email ?? '',
        display_name: frontpageUser?.display_name || frontpageUser?.username || 'WebHatchery User',
        username: frontpageUser?.username ?? '',
        role: frontpageUser?.role ?? 'user',
        is_verified: true,
        is_guest: false,
        auth_type: 'frontpage',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to link guest account data');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const continueAsGuest = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const existingSession = readGuestSession();
      if (existingSession?.token && existingSession?.user) {
        savePreferredAuthMode('guest');
        setToken(existingSession.token);
        setAuthMode('guest');
        setUser(existingSession.user);
        return;
      }

      const response = await fetch(buildApiUrl('/auth/guest-session'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const raw = await response.text();
      const result = raw ? (JSON.parse(raw) as AuthApiResponse<GuestSessionPayload>) : null;

      if (!response.ok || !result?.success || !result.data?.token || !result.data?.user) {
        throw new Error(result?.message || result?.error || `Failed to create guest session (${response.status})`);
      }

      const guestSession: GuestStoredSession = {
        token: result.data.token,
        user: {
          ...result.data.user,
          is_guest: true,
          auth_type: 'guest',
        },
      };

      saveGuestSession(guestSession);
      savePreferredAuthMode('guest');
      setToken(guestSession.token);
      setAuthMode('guest');
      setUser(guestSession.user);
    } catch (err) {
      clearGuestSession();
      savePreferredAuthMode(null);
      setToken(null);
      setAuthMode(null);
      setUser(null);
      setError(err instanceof Error ? err.message : 'Failed to create guest session');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    if (authMode === 'guest') {
      clearGuestSession();
      savePreferredAuthMode(null);
      setToken(null);
      setAuthMode(null);
      setUser(null);
      setError(null);
      return;
    }

    window.location.href = getFrontpageLoginUrl();
  }, [authMode]);

  const getAccessToken = useCallback(async (): Promise<string> => {
    if (!token) {
      throw new Error('Not authenticated');
    }

    return token;
  }, [token]);

  useEffect(() => {
    setTokenProvider(async () => token);
  }, [token]);

  const refreshUserInfo = useCallback(async (): Promise<void> => {
    if (!token) {
      setUser(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(buildApiUrl('/auth/current-user'), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const raw = await response.text();
      const result = raw ? (JSON.parse(raw) as AuthApiResponse<User>) : null;

      if (!response.ok || !result?.success || !result.data) {
        const authError = new Error(result?.message || result?.error || `Authentication check failed (${response.status})`) as Error & {
          status?: number;
        };
        authError.status = response.status;
        throw authError;
      }

      const isGuest = Boolean(result.data.is_guest || authMode === 'guest');
      const frontpageUser = authMode === 'frontpage' ? readFrontpageUser() : null;

      setUser({
        ...result.data,
        username: authMode === 'frontpage' ? (frontpageUser?.username || result.data.username) : result.data.username,
        display_name:
          authMode === 'frontpage'
            ? (frontpageUser?.display_name || frontpageUser?.username || result.data.display_name)
            : result.data.display_name,
        email: authMode === 'frontpage' ? (frontpageUser?.email || result.data.email) : result.data.email,
        role: authMode === 'frontpage' ? (frontpageUser?.role || result.data.role) : result.data.role,
        is_guest: isGuest,
        auth_type: isGuest ? 'guest' : 'frontpage',
      });
      savePreferredAuthMode(isGuest ? 'guest' : 'frontpage');
    } catch (err) {
      const status = typeof (err as { status?: unknown })?.status === 'number'
        ? ((err as { status?: number }).status as number)
        : null;
      const isAuthFailure = status === 401 || status === 403;

      if (isAuthFailure) {
        if (authMode === 'guest') {
          clearGuestSession();
        }
        savePreferredAuthMode(null);
        setToken(null);
        setAuthMode(null);
      }

      setUser(null);
      setError(err instanceof Error ? err.message : 'Failed to validate session');
    } finally {
      setIsLoading(false);
    }
  }, [authMode, token]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === FRONTPAGE_AUTH_STORAGE_KEY || event.key === GUEST_AUTH_STORAGE_KEY) {
        syncTokenFromStorage();
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [syncTokenFromStorage]);

  useEffect(() => {
    syncTokenFromStorage();
  }, [syncTokenFromStorage]);

  useEffect(() => {
    void refreshUserInfo();
  }, [refreshUserInfo]);

  useEffect(() => {
    const guestUserId = readGuestUserIdFromUrl();
    if (!guestUserId || hasAttemptedGuestLinkRef.current) {
      return;
    }

    if (authMode !== 'frontpage' || !token || !user || user.is_guest) {
      return;
    }

    hasAttemptedGuestLinkRef.current = true;

    if (user.role === 'admin') {
      setError('Guest accounts cannot be linked to admin accounts.');
      removeGuestUserIdFromUrl();
      return;
    }

    (async () => {
      try {
        const response = await fetch(buildApiUrl('/auth/link-guest'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            guest_user_id: guestUserId,
            frontpage_user: {
              id: readFrontpageUser()?.id != null ? String(readFrontpageUser()?.id) : undefined,
              email: readFrontpageUser()?.email,
              username: readFrontpageUser()?.username,
              display_name: readFrontpageUser()?.display_name,
              role: readFrontpageUser()?.role,
            } satisfies LinkGuestRequestProfile,
          }),
        });

        const raw = await response.text();
        const result = raw ? (JSON.parse(raw) as AuthApiResponse<LinkGuestPayload>) : null;
        if (!response.ok || !result?.success || !result.data) {
          throw new Error(result?.message || result?.error || `Failed to link guest data (${response.status})`);
        }

        clearGuestSession();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to link guest account data');
      } finally {
        removeGuestUserIdFromUrl();
      }
    })();
  }, [authMode, token, user]);

  const value = useMemo<AuthContextType>(
    () => ({
      isAuthenticated: Boolean(token && user),
      isLoading,
      user,
      error,
      authMode,
      canLinkGuestToFrontpage: Boolean(import.meta.env.PROD && user?.is_guest && readFrontpageToken()),
      refreshUserInfo,
      loginWithRedirect,
      continueAsGuest,
      getLinkAccountUrl,
      linkGuestToFrontpage,
      logout,
      getAccessToken,
    }),
    [authMode, continueAsGuest, error, getAccessToken, getLinkAccountUrl, isLoading, linkGuestToFrontpage, loginWithRedirect, logout, refreshUserInfo, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
