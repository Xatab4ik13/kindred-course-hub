/**
 * HTTP-клиент админ-панели. Базовый адрес API берётся из VITE_API_URL,
 * по умолчанию — /api (nginx проксирует на бекенд из папки server/).
 */
const BASE = (import.meta.env['VITE_API_URL'] as string | undefined) ?? "/api";

const TOKEN_KEY = "chinar.admin.token";

export const getToken = () => (typeof window === "undefined" ? null : window.localStorage.getItem(TOKEN_KEY));
export const setToken = (token: string | null) => {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
};

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  const body = text ? (JSON.parse(text) as unknown) : null;
  if (!res.ok) {
    const message = (body as { error?: string } | null)?.error ?? `Ошибка запроса (${res.status})`;
    throw new ApiError(res.status, message);
  }
  return body as T;
}
