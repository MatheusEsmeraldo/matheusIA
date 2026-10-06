# Call CS — Frontend

**Enciclopédia de Calls + Copiloto de IGL para CS2.**
Feito para ficar aberto no segundo monitor ou no celular durante a partida:
**MAPA → SITUAÇÃO → CALL** em 2–3 toques.

> Este repositório contém **somente o frontend**. Todos os dados vêm de **mocks**.
> O backend (API, banco, autenticação) será desenvolvido depois — ver `BACKEND_CONTRACT.md`.

---

## Requisitos

- **Node.js 20 ou superior** (testado com Node 22) — https://nodejs.org
- npm (já vem com o Node)

## Instalação e execução

```bash
# 1. dentro da pasta do projeto
npm install

# 2. modo desenvolvimento (abre em http://localhost:5173)
npm run dev

# 3. build de produção (gera a pasta dist/)
npm run build

# 4. testar o build localmente
npm run preview
```

Outros scripts: `npm run typecheck` (checa tipos) e `npm run format` (Prettier).

### Testar estados de tela (loading / erro / vazio)

Adicione `?mock=` antes do `#` na URL:

| URL | O que mostra |
| --- | --- |
| `http://localhost:5173/?mock=slow#/partida/mirage` | Respostas lentas → skeleton/loading |
| `http://localhost:5173/?mock=error#/partida/mirage` | Toda chamada falha → estado de erro + "Tentar novamente" |
| `http://localhost:5173/?mock=empty#/partida/mirage` | Nenhuma call → estado vazio |

### Variáveis de ambiente

Copie `.env.example` para `.env`:

| Variável | Padrão | Uso |
| --- | --- | --- |
| `VITE_DATA_SOURCE` | `mock` | `mock` = dados locais. `api` = usa o backend real. |
| `VITE_API_BASE_URL` | `http://localhost:3000/api/v1` | URL da API quando `VITE_DATA_SOURCE=api`. |

---

## Telas e fluxos

| Rota | Tela |
| --- | --- |
| `#/` | Entrada: "Sua próxima call em segundos", escolher mapa, ou ir para a Enciclopédia |
| `#/partida/:mapId` | **Modo Partida** (principal). Lado, economia, jogadores, tipo → calls na hora |
| `#/enciclopedia` | Enciclopédia com todos os filtros + busca |
| `#/enciclopedia?fav=1` | Favoritas |
| `...?call=<id>` | Detalhe da call aberto por cima de qualquer tela (o botão voltar fecha) |

**Cenário principal testado:** Mirage → TR → Full Buy → 5 jogadores → a primeira call é
"Split A — 2 rampa, 1 palácio, 2 meio. Smoke jungle e CT. Entramos juntos na flash."

**Atalhos (desktop / segundo monitor, Modo Partida):** `T`/`C` lado · `1`–`4` economia ·
`R` "Me dá uma call" · `F` alterna favoritas · `Esc` fecha o detalhe.

**Mobile:** o lado (muda 1× por partida) fica no topo; economia, jogadores e tipo
ficam no dock inferior, ao alcance do polegar.

---

## Stack

React 19 · TypeScript · Vite 6 · Tailwind CSS 4 · **kit UI TailGrids** (componentes com `class-variance-authority` + `react-aria-components`) · Framer Motion 12 · React Router 7 (HashRouter) · lucide-react · fonte Figtree (local, via @fontsource).

### Kit UI — TailGrids (modo híbrido)

Botões, badges, input, skeleton e os painéis (detalhe, filtros, menu) usam componentes do
[TailGrids](https://github.com/TailGrids/tailgrids) (MIT) em `src/components/core/`.
As cores vêm dos **tokens TailGrids** em `src/index.css`, mapeados para o visual escuro/vidro do Call CS.
Para mudar o visual dos componentes, edite esses tokens. Licença: `THIRD_PARTY_NOTICES.md`.

## Estrutura

```
src/
  types/domain.ts          Entidades (Call, GameMap, Utility, PlayerRole, Filters…)
  config/taxonomy.ts       Rótulos/ordem de lado, economia, categorias, dificuldade…
  config/env.ts            Leitura das variáveis VITE_*
  services/
    contracts.ts           Interfaces CallService / MapService / FavoriteService
    index.ts               ★ PONTO ÚNICO de troca mock ↔ API
    errors.ts              ServiceError (códigos de erro padronizados)
    mock/                  Implementações mock + dados (data/calls.ts, data/maps.ts)
    api/                   Esqueleto HTTP para o backend futuro (não usado com mock)
  storage/                 localStorage isolado (preferências do Modo Partida)
  hooks/                   useAsync, useData (useCalls, useCall, useMaps…), favoritos, prefs
  components/
    layout/                AppShell, Sidebar, MobileMenu
    filters/               SideToggle, EconomyFilter, PlayerFilter, CategoryFilter, MapSelector
    calls/                 CallCard, CallList, CallDetail, TacticalMap, FavoriteButton…
    states/                LoadingState, ErrorState, EmptyState
    core/                  Componentes TailGrids: Button, Badge, Input, Skeleton
    ui/                    SegmentedControl, Overlay (Modal react-aria), IconButton, Toast, Logo
  pages/                   HomePage, MatchPage, EncyclopediaPage
```

Detalhes da arquitetura: `ARCHITECTURE.md`. Contrato da API: `BACKEND_CONTRACT.md`.
