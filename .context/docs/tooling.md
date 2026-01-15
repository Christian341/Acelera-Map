# Tooling & Productivity Guide

This guide covers the essential tools, automation, and setups to streamline development on the Geographic Impact Dashboard (Brazil) project. The codebase is a React + TypeScript application using Vite for fast bundling and hot module replacement (HMR). Focus on efficiency for map-heavy components like `GeographicDashboard` and `MapChart`.

## Required Tooling

| Tool | Version | Purpose | Installation |
|------|---------|---------|--------------|
| **Node.js** | >=18.18.0 | Runtime for Vite, npm scripts, and build tools | [nodejs.org](https://nodejs.org) (LTS recommended) |
| **npm** | >=9.0.0 (ships with Node) | Package management, scripts execution | `npm install -g npm@latest` |
| **Vite** | ^5.0.0 (inferred from modern React/TS setup) | Dev server, bundler, HMR | Included in `package.json`; run `npm install` |
| **TypeScript** | ^5.0.0 | Type safety across `types.ts`, components | Included in `package.json` |

1. Clone repo: `git clone <repo-url>`
2. Install deps: `npm install`
3. Verify: `npm run type-check` (checks `CampaignData`, `MapPosition`, etc.)

**Cross-reference**: See [types.ts](../src/types.ts) for core types like `CampaignData` and `MapPosition`.

## Recommended Automation

### Package Scripts
Run these via `npm run <script>`:

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `vite` | Start dev server at `http://localhost:5173` with HMR |
| `build` | `vite build` | Production bundle (dist/) |
| `preview` | `vite preview` | Local prod preview |
| `lint` | `eslint . --ext ts,tsx` | Lint src/ (imports like `App.tsx`, `GeographicDashboard.tsx`) |
| `format` | `prettier --write .` | Auto-format TSX, MD, JSON |
| `type-check` | `tsc --noEmit` | Validate types (e.g., `MapChartProps`, `DashboardProps`) |
| `test` | (If Jest/Vitest configured) `vitest` | Unit tests for components |

**Local Dev Loop**:
```
npm run dev  # Watch mode, auto-reload on changes to components/MapChart.tsx, etc.
```

### Git Hooks (Husky + lint-staged)
- Pre-commit: Runs `lint`, `format`, `type-check`.
- Install: `npm install` (auto-runs `husky install` if present).
- Edit: `.husky/pre-commit`.

**Shortcuts**:
- Alias in `~/.zshrc` or `~/.bashrc`: `alias gid="cd /path/to/geographic-impact-dashboard && npm run dev"`

## IDE / Editor Setup

### VS Code (Recommended)
Install these extensions (search in Extensions panel):

| Extension | ID | Purpose |
|-----------|----|---------|
| **ESLint** | dbaeumer.vscode-eslint | Real-time linting for `App.tsx`, `constants.ts` |
| **Prettier** | esbenp.prettier-vscode | Auto-format on save |
| **TypeScript Importer** | pmneo.tsimporter | Quick imports (e.g., `CampaignData` from `types.ts`) |
| **ES7+ React/Redux** | bradlc.vscode-tailwindcss | Snippets for TSX components like `GeographicDashboard` |
| **Vite** | antfu.vite | Vite config support, HMR status |
| **Error Lens** | usernamehw.errorlens | Inline TS errors (e.g., `MapPosition` props) |

**Workspace Settings** (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.suggest.autoImports": true,
  "emmet.includeLanguages": { "typescriptreact": "javascriptreact" }
}
```

**Snippets** (via ES7+):
- `rfc`: React Functional Component (use for new props interfaces like `CampaignCardProps`).
- `imr`: Import React.

### Other Editors
- **WebStorm**: Built-in TS/ESLint support; enable "Run eslint --fix on save".

## Productivity Tips

- **Terminal Aliases**:
  ```
  alias gid-dev="npm run dev"
  alias gid-lint="npm run lint && npm run type-check"
  alias gid-build="npm run build && npm run preview"
  ```

- **Container Workflow** (Docker, if `docker-compose.yml` added):
  ```
  docker-compose up  # Dev + hot reload
  ```

- **Map-Specific Tips**:
  - For `MapChart.tsx`: Use browser dev tools Network tab to inspect Leaflet/ map tile loads.
  - Debug `MapPosition`: Console.log in `GeographicDashboard.tsx` during `npm run dev`.

- **Team Dotfiles**: Share VS Code settings via `.vscode/` commit. Link to [shared-config repo](https://github.com/team/shared-vscode) if available.

- **Common Pitfalls**:
  | Issue | Fix |
  |-------|-----|
  | HMR fails on `App.tsx` | Restart `npm run dev` |
  | Type errors in props | Run `npm run type-check`; check `types.ts` exports |
  | Lint on CI fails | `npm run lint -- --fix` locally |

**Usage Example** (New Component):
```
# Scaffold
npx create-vite@latest . --template react-ts  # Or copy from components/CampaignCard.tsx
npm run dev
# Edit, auto-lint/format, commit (hooks run)
```

For questions, reference imports: `App.tsx` (entry), `components/GeographicDashboard.tsx` (main dashboard). Update this doc as tooling evolves!
