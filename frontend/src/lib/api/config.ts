/** API / WebSocket base URLs. Empty string = same origin (Caddy or Vite proxy). */
export const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";

export const WS_BASE =
  (import.meta.env.VITE_WS_BASE_URL as string | undefined) ??
  `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}`;

export const DEMO_EMAIL =
  (import.meta.env.VITE_DEMO_EMAIL as string | undefined) ?? "demo@agrifetch.co.za";

export const DEMO_PASSWORD =
  (import.meta.env.VITE_DEMO_PASSWORD as string | undefined) ?? "demo12345";

export const AUTH_STORAGE_KEY = "agrifetch_access_token";
