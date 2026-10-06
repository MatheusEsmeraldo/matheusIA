# LEIA PRIMEIRO — Handoff para o backend

Olá! Este projeto é o **frontend completo** do Call CS, feito com dados mockados.
Sua tarefa (GPT / próximo desenvolvedor) é construir o **backend** sem precisar redesenhar a interface.

## Ordem de leitura

1. **`BACKEND_CONTRACT.md`** — entidades, endpoints, filtros, payloads, erros, favoritos. É o documento principal.
2. **`src/types/domain.ts`** — tipos TypeScript (fonte da verdade).
3. **`src/services/contracts.ts`** — interfaces que a API precisa satisfazer.
4. **`src/services/mock/mockCallService.ts`** — comportamento de referência (filtros, ordenação, sorteio).
5. **`src/services/mock/data/calls.ts`** e **`maps.ts`** — dados de exemplo (servem de seed do banco).
6. **`src/services/api/`** — cliente HTTP já esboçado, pronto para apontar para a API.
7. `ARCHITECTURE.md` e `README.md` — visão geral e como rodar.

## Status

| Área | Status |
| --- | --- |
| UX / UI desktop, tablet, mobile | ✅ pronto |
| Modo Partida, Enciclopédia, detalhe, favoritos, "Me dá uma call" | ✅ pronto (mock) |
| Estados loading / erro / vazio | ✅ pronto (testáveis com `?mock=slow|error|empty`) |
| Backend, banco, auth, API real | ❌ **a fazer** |

## O que NÃO mudar sem alinhar com o produto

- O núcleo é **encontrar e transmitir uma call rápido**. Velocidade > funcionalidades.
- `shortCall` é o campo mais importante: frase curta e falável.
- Não adicionar login obrigatório para ver calls.

## Para ligar o backend

```bash
cp .env.example .env
# edite: VITE_DATA_SOURCE=api  e  VITE_API_BASE_URL=<sua API>
npm install && npm run dev
```
