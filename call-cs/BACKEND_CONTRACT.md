# BACKEND CONTRACT — Call CS

Documento para quem vai construir o **backend** (API + banco + autenticação + persistência).
O frontend já está pronto e funciona com mocks. Ele espera exatamente o que está descrito aqui.

> **Fonte da verdade dos tipos:** `src/types/domain.ts`.
> **Interfaces que o backend precisa satisfazer:** `src/services/contracts.ts`.
> **Comportamento de referência (filtros, ordenação, sorteio):** `src/services/mock/mockCallService.ts`.

---

## 1. Visão geral

| Item | Valor |
| --- | --- |
| Estilo | REST + JSON, UTF-8 |
| Base URL | configurável no frontend: `VITE_API_BASE_URL` (padrão `http://localhost:3000/api/v1`) |
| Datas | ISO 8601 em UTC (`2026-09-20T12:00:00Z`) |
| IDs | strings estáveis e legíveis (`mirage-tr-split-a-01`). UUID também funciona. |
| Enums | sempre em MAIÚSCULAS, exatamente como abaixo |
| Idioma do conteúdo | PT-BR |
| Auth | Necessária só para **favoritos** (`/me/...`). Leitura de mapas e calls é pública. O cliente envia `credentials: 'include'` (cookie de sessão). Se preferir `Authorization: Bearer`, ajustar `src/services/api/httpClient.ts`. |
| CORS | Permitir a origem do frontend com `credentials` (não usar `*` junto com cookies). |

### Envelope de resposta

Sucesso:
```json
{ "data": <payload>, "meta": { ... opcional ... } }
```

Erro (qualquer status ≥ 400):
```json
{ "error": { "code": "NOT_FOUND", "message": "Call mirage-tr-xyz não encontrada." } }
```

`DELETE`/`PUT` sem corpo podem responder **204 No Content**.

---

## 2. Enums

| Enum | Valores |
| --- | --- |
| `Side` | `TR`, `CT` |
| `Economy` | `PISTOL`, `ECO`, `FORCE_BUY`, `FULL_BUY` |
| `CallCategory` | `EXECUTE`, `RUSH`, `EXPLODE`, `SPLIT`, `FAKE`, `DEFAULT`, `SETUP`, `CONTACT`, `MAP_CONTROL`, `RETAKE`, `ANTI_RUSH`, `STACK`, `PISTOL`, `INDIVIDUAL` |
| `Difficulty` | `EASY`, `MEDIUM`, `HARD` |
| `Site` | `A`, `B`, `MID`, `ANY` (ANY = variável / decide no round) |
| `PlayerCount` | inteiro `1`–`5` |
| `UtilityType` | `SMOKE`, `FLASH`, `MOLOTOV`, `HE`, `DECOY` |
| `ThrowType` | `NORMAL`, `JUMP_THROW`, `RUN_THROW`, `RUN_JUMP_THROW`, `RIGHT_CLICK` |
| `MapMarkerKind` | `PLAYER`, `SMOKE`, `FLASH`, `MOLOTOV`, `TARGET` |
| `CallSource.type` | `CURATED`, `COMMUNITY`, `USER` |

Os rótulos em português ficam no frontend (`src/config/taxonomy.ts`). A API só trafega os valores.

---

## 3. Entidades

### 3.1 `GameMap`

| Campo | Tipo | Obrig. | Descrição |
| --- | --- | --- | --- |
| `id` | string | ✔ | Ex.: `mirage` |
| `name` | string | ✔ | Ex.: `Mirage` |
| `slug` | string | ✔ | Ex.: `mirage` |
| `image` | string \| null | ✔ | URL do radar/imagem. `null` hoje. |
| `active` | boolean | ✔ | Está no pool ativo? O frontend mostra só ativos na seleção rápida. |
| `order` | number | ✔ | Ordem de exibição (crescente). |
| `layout` | `MapLayout` \| null | ✔ | Bombsites e regiões (callouts) no mapa tático. |
| `radar` | `MapRadar` \| null | ✔ | Radar vetorial (áreas jogáveis) desenhado na identidade Call CS. `null` = sem radar. |

`MapLayout` = `{ "sites": { "A"?: MapPoint, "B"?: MapPoint }, "zones": MapZone[] }`
`MapPoint` = `{ "x": number, "y": number }` — **coordenadas normalizadas 0–100** (x da esquerda p/ direita, y de cima p/ baixo).
`MapZone` = `MapPoint & { "id": string, "label": string }`.

`MapRadar` = `{ "layers": MapRadarLayer[] }` e `MapRadarLayer` = `{ "id": string, "label": string, "path": string }`.
`path` é um **SVG path** no mesmo sistema 0–100 (desenhado com `fill-rule: evenodd`). A primeira camada é a principal;
as demais (ex.: andar inferior da Nuke) aparecem por baixo, tracejadas. Os 7 radares atuais estão em
`src/services/mock/data/radars.ts` — servem de seed. Guardar como texto/JSONB (≈3–6 KB por mapa).

> O pool de mapas muda com o tempo: **nada é fixo no frontend**. Basta o backend devolver a lista.

### 3.2 `Call` (detalhe completo)

| Campo | Tipo | Obrig. | Descrição |
| --- | --- | --- | --- |
| `id` | string | ✔ | |
| `mapId` | string | ✔ | FK → `GameMap.id` |
| `side` | `Side` | ✔ | |
| `economy` | `Economy` | ✔ | |
| `category` | `CallCategory` | ✔ | |
| `playersRequired` | `PlayerCount` | ✔ | Para quantos players a call foi desenhada. |
| `title` | string | ✔ | Curto. Ex.: `Split A` |
| `shortCall` | string | ✔ | **A frase falada no voice.** Ideal ≤ 120 caracteres. É o campo mais importante do produto. |
| `objective` | string | ✔ | 1 frase. |
| `execution` | string[] | ✔ | Passos em ordem, frases curtas. |
| `playerRoles` | `PlayerRole[]` | ✔ | 1 item por player (pode ter < 5). |
| `utilities` | `Utility[]` | ✔ | Pode ser vazio. |
| `fallback` | string \| null | ✔ | "Se der errado". Curto. |
| `difficulty` | `Difficulty` | ✔ | |
| `site` | `Site` | ✔ | Bombsite/área alvo. |
| `regions` | string[] | ✔ | Regiões envolvidas (ex.: `Rampa`, `Meio`). Usado no filtro "Região". |
| `tags` | string[] | ✔ | Minúsculas. |
| `source` | `{ type, name }` | ✔ | Origem do conteúdo. |
| `updatedAt` | string (ISO) | ✔ | |
| `mapPlan` | `MapPlan` \| null | ✔ | Desenho no mapa tático. |
| `favorite` | boolean | — | Opcional. Se o usuário estiver logado, o backend pode hidratar. O frontend hoje usa `/me/favorites/ids`. |

`PlayerRole` = `{ "player": 1-5, "position": string, "responsibility": string }`

`Utility`:

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | string | |
| `name` | string | Ex.: `Smoke CT` |
| `type` | `UtilityType` | |
| `startPosition` | string | De onde lançar |
| `targetPosition` | string | Onde cai |
| `throwType` | `ThrowType` | |
| `instructions` | string | |
| `videoUrl` | string \| null | Vídeo/GIF curto (futuro) |
| `player` | 1-5 \| null | Quem joga |
| `mapPoint` | `MapPoint` \| null | Posição no mapa tático (onde a granada cai) |

`MapPlan` = `{ "markers": MapMarker[], "paths": MapPath[] }`
`MapMarker` = `{ "id", "kind": MapMarkerKind, "x", "y", "label"?, "utilityId"? }` — o frontend desenha `PLAYER` e usa `TARGET` para destacar o bombsite. Utilitárias são desenhadas a partir de `utilities[].mapPoint`.
`MapPath` = `{ "id", "player": 1-5 | null, "points": MapPoint[] }` — linha tracejada com seta no último ponto.

### 3.3 `CallSummary` (listas)

Subconjunto de `Call` usado nos cards:
`id, mapId, side, economy, category, playersRequired, title, shortCall, difficulty, site, tags, updatedAt` (+ `favorite?`).
Devolver o `Call` completo na lista também funciona, mas é desnecessário.

---

## 4. Endpoints

### 4.1 Mapas

| Método | Rota | Resposta `data` | Service |
| --- | --- | --- | --- |
| GET | `/maps` | `GameMap[]` ordenado por `order` | `maps.getMaps()` |
| GET | `/maps/:id` | `GameMap` (404 se não existir) | `maps.getMapById()` |

### 4.2 Calls

| Método | Rota | Resposta `data` | Service |
| --- | --- | --- | --- |
| GET | `/calls` | `CallSummary[]` + `meta` de paginação | `calls.getCalls()` e `calls.getCallsByFilters()` |
| GET | `/calls/:id` | `Call` (404 se não existir) | `calls.getCallById()` |
| GET | `/calls/random` | `Call` ou `null` | `calls.getRandomCall()` — "Me dá uma call" |
| GET | `/calls/:id/utilities` | `Utility[]` | `calls.getUtilitiesByCall()` |
| GET | `/calls/filter-options?mapId=` | `{ "regions": string[], "tags": string[] }` | `calls.getFilterOptions()` |

> ⚠️ Registrar `/calls/random` e `/calls/filter-options` **antes** de `/calls/:id` no roteador.

#### Query params de `/calls` e `/calls/random`

| Param | Tipo | Exemplo | Regra |
| --- | --- | --- | --- |
| `mapId` | string | `mirage` | igualdade |
| `side` | Side | `TR` | igualdade |
| `economy` | Economy | `FULL_BUY` | igualdade |
| `players` | 1-5 | `5` | `playersRequired == players`. Ausente = qualquer quantidade. |
| `category` | lista CSV | `EXECUTE,SPLIT` | `category IN (...)` |
| `site` | Site | `A` | igualdade |
| `region` | string | `Rampa` | `regions` contém o valor |
| `difficulty` | Difficulty | `EASY` | igualdade |
| `tags` | lista CSV | `split,utilitária` | a call precisa ter **todas** |
| `search` | string | `rampa` | busca sem acento/caixa em `title`, `shortCall`, `objective`, `regions`, `tags` |
| `page` | int ≥ 1 | `1` | padrão 1 |
| `pageSize` | int | `50` | padrão 50, máx sugerido 100 |
| `excludeId` | string | — | **só em `/random`**: evita repetir a call atual quando houver outra opção |

Parâmetros ausentes = sem filtro. Valores inválidos → **400** `VALIDATION`.

**Ordenação padrão:** `difficulty` (EASY → HARD), depois `updatedAt` desc.

#### `meta` de paginação

```json
{ "total": 4, "page": 1, "pageSize": 50, "hasMore": false }
```

O frontend hoje carrega só a 1ª página (até 50) — volume suficiente para Modo Partida. Paginação/scroll infinito na Enciclopédia pode vir depois sem quebrar o contrato.

### 4.3 Favoritos (autenticado)

| Método | Rota | Resposta | Service |
| --- | --- | --- | --- |
| GET | `/me/favorites/ids` | `data: string[]` (ordem = ordem em que foram favoritadas) | `favorites.getFavoriteIds()` |
| GET | `/me/favorites?mapId=` | `data: CallSummary[]` (mais recentes primeiro) | `favorites.getFavoriteCalls()` |
| PUT | `/me/favorites/:callId` | 204 | `favorites.addFavorite()` — **idempotente** |
| DELETE | `/me/favorites/:callId` | 204 | `favorites.removeFavorite()` — **idempotente** (204 mesmo se não existia) |

Comportamento esperado:
- O frontend aplica a mudança **na hora (otimista)** e desfaz se a API falhar (mostra toast "Não foi possível salvar a favorita").
- Sem login → responder **401** `UNAUTHORIZED`. (Decisão de produto futura: exigir login para favoritar ou migrar os favoritos do localStorage no primeiro login — os IDs locais ficam em `localStorage["callcs:favorites:v1"]`.)
- Favoritar uma call inexistente → 404.
- No Modo Partida, a aba "Favoritas" mostra as favoritas **do mapa atual e do lado selecionado** (o filtro de lado é aplicado no cliente).

---

## 5. Exemplos de payload

### 5.1 `GET /maps`
```json
{
  "data": [
    {
      "id": "mirage",
      "name": "Mirage",
      "slug": "mirage",
      "image": null,
      "active": true,
      "order": 1,
      "layout": {
        "sites": { "A": { "x": 55, "y": 78 }, "B": { "x": 22, "y": 28 } },
        "zones": [
          { "id": "ramp", "label": "Rampa", "x": 70, "y": 66 },
          { "id": "palace", "label": "Palácio", "x": 76, "y": 77 }
        ]
      },
      "radar": {
        "layers": [
          { "id": "main", "label": "Principal", "path": "M10.3 22.2 L15.1 22.2 L16.4 16.8 ... Z" }
        ]
      }
    }
  ]
}
```

### 5.2 Lista — `GET /calls?mapId=mirage&side=TR&economy=FULL_BUY&players=5`
```json
{
  "data": [
    {
      "id": "mirage-tr-split-a-01",
      "mapId": "mirage",
      "side": "TR",
      "economy": "FULL_BUY",
      "category": "SPLIT",
      "playersRequired": 5,
      "title": "Split A",
      "shortCall": "2 rampa, 1 palácio, 2 meio. Smoke jungle e CT. Entramos juntos na flash.",
      "difficulty": "EASY",
      "site": "A",
      "tags": ["split", "clássica", "utilitária"],
      "updatedAt": "2026-09-20T12:00:00Z"
    },
    {
      "id": "mirage-tr-exec-a-02",
      "mapId": "mirage",
      "side": "TR",
      "economy": "FULL_BUY",
      "category": "EXECUTE",
      "playersRequired": 5,
      "title": "Exec A Clássica",
      "shortCall": "5 rampa. Smoke CT, jungle e escada. Molotov sanduba. Entramos na flash.",
      "difficulty": "MEDIUM",
      "site": "A",
      "tags": ["execute", "clássica", "utilitária"],
      "updatedAt": "2026-09-18T12:00:00Z"
    }
  ],
  "meta": { "total": 4, "page": 1, "pageSize": 50, "hasMore": false }
}
```

### 5.3 Detalhe — `GET /calls/mirage-tr-split-a-01`
```json
{
  "data": {
    "id": "mirage-tr-split-a-01",
    "mapId": "mirage",
    "side": "TR",
    "economy": "FULL_BUY",
    "category": "SPLIT",
    "playersRequired": 5,
    "title": "Split A",
    "shortCall": "2 rampa, 1 palácio, 2 meio. Smoke jungle e CT. Entramos juntos na flash.",
    "objective": "Atacar o bomb A por três lados ao mesmo tempo para dividir a atenção dos CTs.",
    "execution": [
      "Todos tomam posição sem mostrar: rampa, palácio e topo do meio.",
      "Meio joga smoke jungle; rampa joga smoke CT.",
      "Rampa solta a flash por cima. Todo mundo entra no mesmo tempo.",
      "Planta no default e cada um segura um ângulo de retake."
    ],
    "playerRoles": [
      { "player": 1, "position": "Rampa", "responsibility": "Primeiro contato." },
      { "player": 2, "position": "Rampa", "responsibility": "Smoke CT e flash por cima." },
      { "player": 3, "position": "Palácio", "responsibility": "Espera a flash e entra junto." },
      { "player": 4, "position": "Meio", "responsibility": "Smoke jungle." },
      { "player": 5, "position": "Meio", "responsibility": "Entra pelo conector depois da smoke." }
    ],
    "utilities": [
      {
        "id": "mirage-smoke-ct",
        "name": "Smoke CT",
        "type": "SMOKE",
        "startPosition": "Base TR / Rampa",
        "targetPosition": "Entrada CT do bomb A",
        "throwType": "JUMP_THROW",
        "instructions": "Lineup ilustrativo.",
        "videoUrl": null,
        "player": 2,
        "mapPoint": { "x": 24, "y": 72 }
      },
      {
        "id": "mirage-flash-a",
        "name": "Flash A",
        "type": "FLASH",
        "startPosition": "Rampa",
        "targetPosition": "Por cima do bomb A",
        "throwType": "RIGHT_CLICK",
        "instructions": "Lineup ilustrativo.",
        "videoUrl": null,
        "player": 2,
        "mapPoint": { "x": 38, "y": 76 }
      }
    ],
    "fallback": "Se perdermos o meio, aborta o split e agrupa tudo na rampa.",
    "difficulty": "EASY",
    "site": "A",
    "regions": ["Rampa", "Palácio", "Meio"],
    "tags": ["split", "clássica", "utilitária"],
    "source": { "type": "CURATED", "name": "Call CS" },
    "updatedAt": "2026-09-20T12:00:00Z",
    "mapPlan": {
      "markers": [
        { "id": "p1", "kind": "PLAYER", "label": "1", "x": 70, "y": 78 },
        { "id": "target-A", "kind": "TARGET", "label": "A", "x": 34, "y": 80 }
      ],
      "paths": [
        { "id": "path-1", "player": 1, "points": [ { "x": 70, "y": 78 }, { "x": 48, "y": 71 }, { "x": 34, "y": 80 } ] }
      ]
    }
  }
}
```

### 5.4 Sorteio — `GET /calls/random?mapId=mirage&side=TR&economy=FULL_BUY&excludeId=mirage-tr-split-a-01`
```json
{ "data": { "...": "Call completa (mesmo formato do detalhe)" } }
```
Sem nenhuma compatível:
```json
{ "data": null }
```

### 5.5 Opções de filtro — `GET /calls/filter-options?mapId=mirage`
```json
{ "data": { "regions": ["Apê", "Bomb A", "Meio", "Palácio", "Rampa"], "tags": ["clássica", "eco", "split"] } }
```

### 5.6 Favoritos
`GET /me/favorites/ids`
```json
{ "data": ["mirage-tr-split-a-01", "mirage-ct-setup-10"] }
```
`PUT /me/favorites/mirage-tr-split-a-01` → `204 No Content`
`GET /me/favorites?mapId=mirage` → `{ "data": [ CallSummary, ... ] }`

### 5.7 Erros
```json
// 404
{ "error": { "code": "NOT_FOUND", "message": "Call mirage-tr-xyz não encontrada." } }
// 400
{ "error": { "code": "VALIDATION", "message": "economy inválido: FULLBUY" } }
// 401
{ "error": { "code": "UNAUTHORIZED", "message": "Faça login para favoritar." } }
// 500
{ "error": { "code": "SERVER", "message": "Erro interno." } }
```

Códigos que o frontend entende (`src/services/errors.ts`):

| code | HTTP | Mensagem mostrada |
| --- | --- | --- |
| `VALIDATION` | 400/422 | "Algo deu errado ao carregar as calls." |
| `UNAUTHORIZED` | 401 | "Você precisa entrar na sua conta para isso." |
| `FORBIDDEN` | 403 | idem |
| `NOT_FOUND` | 404 | "Essa call não existe mais." |
| `SERVER` | 5xx | "O servidor teve um problema. Tente de novo." |
| `NETWORK` / `TIMEOUT` | — (gerados no cliente) | "Sem conexão com o servidor." |

Se o corpo não tiver `error.code`, o cliente deduz pelo status HTTP.

---

## 6. Loading, erro e vazio (como a UI se comporta)

- **Loading:** skeleton na primeira carga. Ao trocar filtro, a lista anterior fica visível (opacidade 60%) até a resposta chegar. Respostas fora de ordem são descartadas no cliente.
- **Timeout:** 10 s por requisição (`httpClient.ts`). Para o Modo Partida, a meta é **p95 < 300 ms** em `/calls`.
- **Erro:** card com mensagem + "Tentar novamente".
- **Vazio:** lista `[]` com `total: 0` (nunca 404 para lista vazia).
- **Detalhe inexistente:** 404 → mensagem "Essa call não existe mais".

---

## 7. O que hoje é mock e o que substituir

| Hoje (mock) | Arquivo | Substituir por |
| --- | --- | --- |
| Lista de mapas | `src/services/mock/data/maps.ts` | `GET /maps` |
| Radares vetoriais dos 7 mapas | `src/services/mock/data/radars.ts` | campo `radar` de `GET /maps` |
| 18 calls (14 Mirage, 2 Inferno, 2 Dust2) | `src/services/mock/data/calls.ts` | `GET /calls*` |
| Filtro/ordenação/sorteio em memória | `src/services/mock/mockCallService.ts` | Queries no banco |
| Mapas em memória | `src/services/mock/mockMapService.ts` | `/maps` |
| Favoritos no localStorage | `src/services/mock/mockFavoriteService.ts` | `/me/favorites*` por usuário |
| Latência/erro simulados | `src/services/mock/mockRuntime.ts` | — (só dev) |
| Preferências do Modo Partida (mapa, lado, economia, players, tipo) | `src/storage/preferences.ts` | **Pode continuar local.** Opcional sincronizar com o perfil depois. |

### Funções a implementar via API (já esboçadas em `src/services/api/apiServices.ts`)

| Interface | Função | Endpoint |
| --- | --- | --- |
| `MapService` | `getMaps()` | `GET /maps` |
| `MapService` | `getMapById(id)` | `GET /maps/:id` |
| `CallService` | `getCalls(page, pageSize)` | `GET /calls` |
| `CallService` | `getCallsByFilters(filters)` | `GET /calls?…` |
| `CallService` | `getCallById(id)` | `GET /calls/:id` |
| `CallService` | `getRandomCall(filters, excludeId)` | `GET /calls/random?…` |
| `CallService` | `getUtilitiesByCall(id)` | `GET /calls/:id/utilities` |
| `CallService` | `getFilterOptions(mapId)` | `GET /calls/filter-options` |
| `FavoriteService` | `getFavoriteIds()` | `GET /me/favorites/ids` |
| `FavoriteService` | `getFavoriteCalls(mapId)` | `GET /me/favorites` |
| `FavoriteService` | `addFavorite(id)` | `PUT /me/favorites/:id` |
| `FavoriteService` | `removeFavorite(id)` | `DELETE /me/favorites/:id` |

### Ligar a API

```bash
# .env
VITE_DATA_SOURCE=api
VITE_API_BASE_URL=https://sua-api.com/api/v1
```
A troca acontece em **um único arquivo**: `src/services/index.ts`.

---

## 8. Sugestão de modelo de dados (não obrigatório)

```
maps(id PK, name, slug UNIQUE, image, active, "order", layout JSONB, radar JSONB)
calls(id PK, map_id FK, side, economy, category, players_required, title, short_call,
      objective, execution JSONB, player_roles JSONB, fallback, difficulty, site,
      regions TEXT[], tags TEXT[], source_type, source_name, map_plan JSONB,
      published BOOLEAN, created_at, updated_at)
  INDEX (map_id, side, economy, players_required, category)
utilities(id PK, call_id FK, name, type, start_position, target_position, throw_type,
          instructions, video_url, player, map_point JSONB, sort)
users(id PK, ...)            -- autenticação a definir
favorites(user_id FK, call_id FK, created_at, PK(user_id, call_id))
```

Fora do escopo agora (não implementar sem alinhar): painel admin, pagamento/assinatura, social, times.
