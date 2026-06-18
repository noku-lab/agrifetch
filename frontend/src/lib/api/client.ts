import { API_BASE, AUTH_STORAGE_KEY } from "./config";

export class ApiError extends Error {
  status: number;
  body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem(AUTH_STORAGE_KEY);
}

export function setStoredToken(token: string | null): void {
  if (token) {
    localStorage.setItem(AUTH_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
};

export async function apiRequest<T>(
  path: string,
  { body, auth = false, headers, ...init }: RequestOptions = {},
): Promise<T> {
  const requestHeaders = new Headers(headers);

  if (body !== undefined) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getStoredToken();
    if (!token) {
      throw new ApiError("Not authenticated", 401);
    }
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let detail: unknown;
    try {
      detail = await response.json();
    } catch {
      detail = await response.text();
    }
    const message =
      typeof detail === "object" && detail !== null && "detail" in detail
        ? String((detail as { detail: unknown }).detail)
        : `Request failed (${response.status})`;
    throw new ApiError(message, response.status, detail);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
