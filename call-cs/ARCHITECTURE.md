# Arquitetura do Frontend — Call CS

## Princípio

```
UI (pages / components)
   ↓  props
Hooks (useCalls, useCall, useMaps, useFavorites, useMatchPrefs…)
   ↓
services  ←  src/services/index.ts escolhe a implementação
   ↓
mock (src/services/mock)   |   api (src/services/api)   ← futuro
```

- **Nenhum componente importa mock.** `CallCard` recebe um `CallSummary` por props.
  Quem busca dados são os hooks em `src/hooks/useData.ts`, que chamam `services.*`.
- **Troca mock → API** = `VITE_DATA_SOURCE=api` (e implementar o backend). Nada na UI muda.

## Camadas

| Camada | Arquivos | Responsabilidade |
| --- | --- | --- |
| Tipos | `src/types/domain.ts` | Fonte da verdade das entidades. Espelhadas no `BACKEND_CONTRACT.md`. |
| Taxonomia | `src/config/taxonomy.ts` | Rótulos em PT-BR e ordem de exibição. Os **valores** (`FULL_BUY`, `EXECUTE`…) são os da API. |
| Services | `src/services/contracts.ts` | Interfaces. Todas as funções retornam `Promise` e rejeitam com `ServiceError`. |
| Mock | `src/services/mock/*` | Dados + filtro local + latência simulada (`?mock=slow|error|empty`). |
| API | `src/services/api/*` | Cliente `fetch` + implementações HTTP prontas para os endpoints do contrato. |
| Storage local | `src/storage/*` | localStorage isolado: preferências do Modo Partida e (no mock) favoritas. |
| Hooks | `src/hooks/*` | Estado assíncrono (`useAsync`: loading/error/success, mantém dado anterior ao refiltrar, ignora respostas atrasadas), favoritos globais otimistas, preferências, atalhos. |
| UI | `src/components/*`, `src/pages/*` | Apresentação e interação. |

## Estados de tela

Toda lista/detalhe passa por `useAsync` e renderiza:

- **Loading** → `LoadingState` (skeleton no formato do card). Em refiltragem o dado antigo fica com opacidade reduzida (sem piscar).
- **Error** → `ErrorState` com mensagem amigável (`friendlyMessage`) + "Tentar novamente" (`reload`).
- **Empty** → `EmptyState` com sugestões de filtro (ex.: "Qualquer nº de players").
- **Success** → `CallList`.

## Kit UI (TailGrids, modo híbrido)

- `src/components/core/` — `Button`, `Badge`, `Input`, `Skeleton` adaptados do TailGrids (MIT). API original: `cva` + `react-aria-components` (botões usam `onPress`).
- `src/index.css` › bloco **TOKENS TAILGRIDS** — mesmos nomes de token do kit (`--color-button-primary-background`, `--color-badge-*`, `--color-input-*`…), com valores do visual Call CS.
- `Overlay` segue o padrão Sheet/Modal do TailGrids (`ModalOverlay` + `Modal` + `Dialog`): foco preso, Esc/clique fora fecham, scroll travado.
- `cn()` = `clsx` + `tailwind-merge` (padrão TailGrids).
- Controles muito específicos do produto (segmentado TR/CT, economia, chips, abas de mapa, card de call) continuam próprios, usando os mesmos tokens.

## Componentes principais

| Componente | Onde | Nota |
| --- | --- | --- |
| `AppShell`, `Sidebar`, `MobileMenu` | layout | Moldura de vidro + trilho de ícones (md+). Mobile: tela cheia + menu. |
| `SegmentedControl` | ui | Base de TR/CT, economia e jogadores. Pílula animada (Framer `layoutId`). |
| `SideToggle`, `EconomyFilter`, `PlayerFilter`, `CategoryFilter` | filters | Uma interação por troca. |
| `MapGrid`, `MapTabs` | filters | Mapas vêm de `services.maps.getMaps()` — pool não é fixo no código. |
| `CallCard` / `CallList` | calls | Call em destaque; metadados discretos; favoritar/copiar. |
| `CallDetail` | calls | Overlay: call + "se der errado" + objetivo + players + execução \| utilitárias + mapa. |
| `TacticalMap` | calls | SVG esquemático (coordenadas 0–100). Recebe radar real depois via `GameMap.image`. |
| `RandomCallButton` + `useRandomCall` | calls/hooks | "Me dá uma call" (sorteio ≥450 ms de microinteração). |
| `FavoriteButton` + `FavoritesProvider` | calls/hooks | Otimista com rollback. |

## Responsividade

- **Mobile (< 768px):** header com menu, mapa e TR/CT; lista; **dock inferior fixo** com tipo, jogadores e economia (economia na linha mais baixa = mais perto do polegar). Detalhe abre como folha de baixo para cima.
- **Tablet (768–1023px):** moldura + trilho; filtros numa faixa acima da lista.
- **Desktop (≥ 1024px):** coluna fixa de filtros à esquerda, lista em 1–2 colunas, atalhos de teclado. Detalhe em painel central com duas colunas.

## Onde conectar a API

1. Implementar os endpoints do `BACKEND_CONTRACT.md`.
2. `.env` → `VITE_DATA_SOURCE=api` e `VITE_API_BASE_URL=...`.
3. Conferir/ajustar `src/services/api/apiServices.ts` e `httpClient.ts` (autenticação, headers).
4. Os mocks podem continuar para desenvolvimento offline.
