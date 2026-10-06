import { env } from '@/config/env';
import { ServiceError, type ServiceErrorCode } from '../errors';

/**
 * Cliente HTTP mínimo para a API futura (NÃO há backend neste repositório).
 * Formato esperado das respostas: ver BACKEND_CONTRACT.md › "Envelope".
 *   sucesso: { "data": ..., "meta"?: {...} }
 *   erro:    { "error": { "code": "NOT_FOUND", "message": "..." } }
 */

type Query = Record<string, string | number | boolean | string[] | undefined | null>;

function buildUrl(path: string, query?: Query): string {
  const url = new URL(env.apiBaseUrl.replace(/\/$/, '') + path);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null || v === '') continue;
      if (Array.isArray(v)) {
        if (v.length) url.searchParams.set(k, v.join(','));
      } else url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

function codeFromStatus(status: number): ServiceErrorCode {
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 404) return 'NOT_FOUND';
  if (status === 400 || status === 422) return 'VALIDATION';
  if (status >= 500) return 'SERVER';
  return 'UNKNOWN';
}

export interface ApiEnvelope<T, M = unknown> {
  data: T;
  meta?: M;
}

export async function request<T, M = unknown>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  options: { query?: Query; body?: unknown; timeoutMs?: number } = {},
): Promise<ApiEnvelope<T, M>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? 10_000);
  let res: Response;
  try {
    res = await fetch(buildUrl(path, options.query), {
      method,
      headers: { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}) },
      body: options.body ? JSON.stringify(options.body) : undefined,
      // Autenticação futura: cookies de sessão (credentials) ou header Authorization.
      credentials: 'include',
      signal: controller.signal,
    });
  } catch (err) {
    const aborted = err instanceof DOMException && err.name === 'AbortError';
    throw new ServiceError(aborted ? 'TIMEOUT' : 'NETWORK', aborted ? 'Tempo esgotado.' : 'Falha de rede.');
  } finally {
    clearTimeout(timer);
  }

  if (res.status === 204) return { data: undefined as T };

  let payload: unknown = null;
  try {
    payload = await res.json();
  } catch {
    /* corpo vazio ou inválido */
  }

  if (!res.ok) {
    const e = (payload as { error?: { code?: ServiceErrorCode; message?: string } } | null)?.error;
    throw new ServiceError(e?.code ?? codeFromStatus(res.status), e?.message ?? `HTTP ${res.status}`, res.status);
  }
  return payload as ApiEnvelope<T, M>;
}
