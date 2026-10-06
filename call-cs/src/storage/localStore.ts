/**
 * Wrapper seguro para localStorage (pode falhar em aba anônima / storage bloqueado).
 * PERSISTÊNCIA LOCAL TEMPORÁRIA — será substituída pelo backend onde fizer sentido.
 */
const PREFIX = 'callcs:';

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* ignora: storage indisponível */
  }
}
