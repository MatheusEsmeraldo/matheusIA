import { ServiceError } from '../errors';

/**
 * Simulação de rede para os mocks. Permite testar estados da UI pela URL:
 *   ?mock=slow   → respostas lentas (loading/skeleton)
 *   ?mock=error  → todas as chamadas falham (estado de erro)
 *   ?mock=empty  → listas vazias (estado vazio)
 * Ex.: http://localhost:5173/?mock=error#/partida/mirage
 */
export type MockMode = 'normal' | 'slow' | 'error' | 'empty';

export function mockMode(): MockMode {
  if (typeof window === 'undefined') return 'normal';
  const m = new URLSearchParams(window.location.search).get('mock');
  return m === 'slow' || m === 'error' || m === 'empty' ? m : 'normal';
}

export async function simulateNetwork(): Promise<void> {
  const mode = mockMode();
  const ms = mode === 'slow' ? 1600 : 90 + Math.random() * 110;
  await new Promise((r) => setTimeout(r, ms));
  if (mode === 'error') throw new ServiceError('NETWORK', 'Falha simulada (?mock=error).');
}
