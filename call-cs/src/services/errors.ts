export type ServiceErrorCode = 'NETWORK' | 'TIMEOUT' | 'NOT_FOUND' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'VALIDATION' | 'SERVER' | 'UNKNOWN';

/** Erro padronizado que a UI entende, venha do mock ou da API. */
export class ServiceError extends Error {
  readonly code: ServiceErrorCode;
  readonly status?: number;

  constructor(code: ServiceErrorCode, message: string, status?: number) {
    super(message);
    this.name = 'ServiceError';
    this.code = code;
    this.status = status;
  }
}

export function toServiceError(err: unknown): ServiceError {
  if (err instanceof ServiceError) return err;
  if (err instanceof Error) return new ServiceError('UNKNOWN', err.message);
  return new ServiceError('UNKNOWN', 'Erro inesperado.');
}

/** Mensagem curta, amigável, para mostrar ao jogador. */
export function friendlyMessage(err: ServiceError): string {
  switch (err.code) {
    case 'NETWORK':
    case 'TIMEOUT':
      return 'Sem conexão com o servidor. Verifique a internet.';
    case 'NOT_FOUND':
      return 'Essa call não existe mais.';
    case 'UNAUTHORIZED':
    case 'FORBIDDEN':
      return 'Você precisa entrar na sua conta para isso.';
    case 'SERVER':
      return 'O servidor teve um problema. Tente de novo.';
    default:
      return 'Algo deu errado ao carregar as calls.';
  }
}
