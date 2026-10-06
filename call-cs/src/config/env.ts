/** Configuração lida das variáveis de ambiente do Vite (ver .env.example). */
export type DataSource = 'mock' | 'api';

export const env = {
  dataSource: (import.meta.env.VITE_DATA_SOURCE === 'api' ? 'api' : 'mock') as DataSource,
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:3000/api/v1',
};
