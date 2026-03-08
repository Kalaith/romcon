import axios from 'axios';

type TokenProvider = () => string | null | Promise<string | null>;

let tokenProvider: TokenProvider | null = null;

export function setTokenProvider(provider: TokenProvider | null): void {
  tokenProvider = provider;
}

export function buildApiUrl(baseUrl: string, version: string, endpoint: string): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const cleanVersion = version.replace(/^\/+|\/+$/g, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  if (cleanVersion === '') {
    return `${cleanBase}${cleanEndpoint}`;
  }

  if (cleanBase.endsWith(`/api/${cleanVersion}`)) {
    return `${cleanBase}${cleanEndpoint}`;
  }

  if (cleanBase.endsWith('/api')) {
    return `${cleanBase}/${cleanVersion}${cleanEndpoint}`;
  }

  return `${cleanBase}${cleanEndpoint}`;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1/romcon/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  if (!tokenProvider) {
    return config;
  }

  try {
    const token = await tokenProvider();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // Ignore token provider failures.
  }

  return config;
});

export default api;
