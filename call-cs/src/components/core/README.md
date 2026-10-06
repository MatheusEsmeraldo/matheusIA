# components/core — componentes TailGrids

Componentes adaptados do kit **TailGrids** (https://github.com/TailGrids/tailgrids, licença MIT).
Seguem a API original (`cva` + `react-aria-components`), com duas adaptações para o Call CS:

- Cores vêm dos tokens TailGrids definidos em `src/index.css` (bloco "TOKENS TAILGRIDS"),
  mapeados para a identidade escura/vidro do Call CS.
- Ícones: `lucide-react` em vez de `@tailgrids/icons`.

Para adicionar outro componente do kit: copie de `apps/docs/src/registry/core/<nome>.tsx`
no repositório TailGrids, troque `@/utils/cn` por `@/lib/cn` e confira os tokens usados.
