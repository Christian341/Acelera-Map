# Bug Fixer Agent Playbook

## Mission
The Bug Fixer Agent is the primary specialist for diagnosing and resolving defects in the Geographic Impact Dashboard application. This React/TypeScript/Vite-based dashboard visualizes campaign data on interactive maps for Brazil's geographic regions. Engage the agent for:
- Bug reports from GitHub issues, user feedback, or Sentry/monitoring alerts.
- Runtime errors in console, build failures, or performance regressions.
- Unexpected UI/data rendering issues, especially map positioning or campaign overlays.
- Regression prevention after feature updates.

The agent ensures fixes are minimal, tested, and documented to maintain dashboard reliability for stakeholders analyzing campaign impacts.

## Responsibilities
- **Triage & Reproduce**: Parse error messages/logs, reproduce in local dev environment.
- **Root Cause Analysis**: Use devtools, logging, and code search to pinpoint issues (e.g., prop mismatches, API failures, map bounds errors).
- **Implement Fixes**: Apply targeted changes with TypeScript safety, preserving existing patterns.
- **Verify & Test**: Run unit/integration tests, manual QA, and regression checks.
- **Document & Prevent**: Add tests, update docs, and log fixes in CHANGELOG.md or issue threads.

## Core Workflows

### 1. Standard Bug Fix Workflow
1. **Setup Environment**:
   - Clone/pull latest: `git pull origin main`.
   - Install deps: `npm ci`.
   - Start dev server: `npm run dev`.
   - Open http://localhost:5173 (Vite default).

2. **Reproduce Bug**:
   - Review bug report/error stack.
   - Use browser devtools (Console, React DevTools, Network tab).
   - For map bugs: Inspect Leaflet/Mapbox layers, bounds, zoom.
   - Mock data if needed: Edit `src/data/mock-campaigns.json` or API responses.

3. **Diagnose**:
   - Search codebase: Use `grep` or IDE for error strings/symbols (e.g., `CampaignData` mismatches).
   - Analyze symbols in affected files (e.g., `analyzeSymbols src/components/MapView.tsx`).
   - Check recent changes: `git log --oneline -10`.

4. **Fix**:
   - Implement in affected file(s).
   - Follow conventions: Functional components, hooks for state/logic, Tailwind for styling.
   - Add error boundaries or fallbacks where missing.

5. **Test**:
   - Unit tests: `npm test` (Vitest + React Testing Library).
   - E2E if available: `npm run test:e2e`.
   - Manual: Test edge cases (empty data, invalid MapPosition, mobile viewport).
   - Lint/Type check: `npm run lint && npm run type-check`.

6. **Commit & PR**:
   - Conventional commit: `fix: resolve map zoom bug in dashboard view`.
   - Branch: `fix/<issue-number>-description`.
   - Update docs if UI/behavior changes.

### 2. Common Bug Types & Fixes
| Bug Type | Symptoms | Focus Files | Steps |
|----------|----------|-------------|-------|
| **UI Rendering** | Components not updating, props mismatch | `src/components/*/*.tsx`, `src/hooks/*` | Trace hooks (useEffect deps), add keys to lists, memoize callbacks. |
| **Map/Geo Issues** | Incorrect positioning, bounds errors | `src/components/Map/*`, `types.ts` (MapPosition) | Validate lat/lng in `CampaignData`, clamp bounds, handle projection (Brazil Mercator?). |
| **Data Fetch/API** | Empty charts, 404s | `src/hooks/useCampaignData.ts`, `src/utils/api.ts` | Add loading/error states, retry logic, mock for offline. |
| **Build/Perf** | Vite errors, slow renders | `vite.config.ts`, `package.json` | Optimize imports (dynamic), tree-shake unused deps. |
| **TypeScript** | Compile errors | `types.ts`, `tsconfig.json` | Extend interfaces, use Discriminated Unions for variants. |

### 3. Emergency Hotfix Workflow (Prod Breaks)
1. Reproduce in staging: `npm run build && npm run preview`.
2. Cherry-pick fix to hotfix branch.
3. Deploy: `npm run deploy` (Vercel/Netlify hook).

## Best Practices (Codebase-Derived)
- **Conventions**:
  - Functional components with TypeScript generics/interfaces.
  - Custom hooks for data/maps (e.g., `useMapBounds`, `useCampaignFilter`).
  - Tailwind CSS: Utility-first, responsive (sm/md/lg breakpoints for dashboard).
  - State: Zustand or Context for global (campaigns, map state).
- **Error Handling**: Use `ErrorBoundary` in `App.tsx`, console.error with context.
- **Testing Patterns**:
  - Vitest: `@testing-library/react`, MSW for API mocks.
  - Test files: `__tests__/Component.test.tsx` or `Component.test.tsx`.
  - Cover: renders, user events (click zoom), async fetches.
  - Example: `expect(screen.getByText('Campaign Impact')).toBeInTheDocument()`.
- **Perf**: React.memo on list items, debounce map events, virtualize long lists.
- **Accessibility**: ARIA labels on maps/charts, keyboard nav for filters.
- **Logging**: Sentry integration—add breadcrumbs for repro.
- **Minimal Changes**: Diff before/after, no refactors unless bug-related.

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)
- CHANGELOG.md: Track fixes/releases.

## Repository Starting Points
- `commands/` — Scripts for data ETL (e.g., process Brazil geoJSON, generate mock campaigns).
- `components/` — Reusable UI: MapView, CampaignCard, ImpactChart, FilterPanel.
- `public/` — Static assets: brazil-geojson.json, favicon, robots.txt.
- `src/` — App source: main.tsx (entry), App.tsx (root layout), hooks/, utils/, types.ts.
- `docs/` — Full guides (architecture, data flow).
- `__tests__/` — Unit/integration tests.

## Key Files & Purposes
| File/Path | Purpose |
|-----------|---------|
| [`src/main.tsx`](src/main.tsx) | Vite/React entry: Renders App to #root. |
| [`src/App.tsx`](src/App.tsx) | Root component: Layout, providers (Theme, QueryClient). |
| [`src/types.ts`](src/types.ts) | Core interfaces: `CampaignData` (id, name, metrics), `MapPosition` (lat, lng, zoom). |
| [`src/components/Map/MapView.tsx`](src/components/Map/MapView.tsx) | Interactive Leaflet map with campaign overlays/markers. |
| [`src/hooks/useCampaignData.ts`](src/hooks/useCampaignData.ts) | Fetches/filters campaign data from API. |
| [`vite.config.ts`](vite.config.ts) | Build config: Plugins (React, TS), aliases, proxy API. |
| [`tsconfig.json`](tsconfig.json) | Strict TS: noImplicitAny, strictNullChecks. |
| [`package.json`](package.json) | Deps: React 18, Leaflet, Chart.js, Tailwind, Vitest, Zod (validation). |
| [`src/utils/api.ts`](src/utils/api.ts) | Axios/fetch wrappers for backend endpoints. |

## Architecture Context
- **Monorepo Style**: Single Vite app, src/ organized by feature (components/Map/, components/Dashboard/).
- **Data Flow**: API → useCampaignData hook → MapView renders markers/clusters → Charts aggregate impacts.
- **Stack**: React 18 (hooks-only), TypeScript 5, Vite 5, Tailwind 3, Leaflet 1.9 (Brazil projections).
- **Components**: 20+ total; pure (display), container (data+logic).
- **Key Symbols**:
  - [`CampaignData`](src/types.ts#L2): `{ id: string; name: string; impacts: ImpactMetrics[]; positions: MapPosition[] }`.
  - [`MapPosition`](src/types.ts#L15): `{ lat: number; lng: number; radius?: number }`.
  - `useMapInstance` hook: Returns Leaflet map ref.

## Documentation Touchpoints
- [Documentation Index](../docs/README.md)
- [Project Overview](../docs/project-overview.md)
- [Architecture Notes](../docs/architecture.md)
- [Development Workflow](../docs/development-workflow.md)
- [Testing Strategy](../docs/testing-strategy.md)
- [Glossary & Domain Concepts](../docs/glossary.md) (e.g., "Município Impact", "Campanha")
- [Data Flow & Integrations](../docs/data-flow.md)
- [Security & Compliance Notes](../docs/security.md) (GDPR for Brazil data)
- [Tooling & Productivity Guide](../docs/tooling.md)

## Collaboration Checklist
1. Confirm assumptions with issue reporters or maintainers (e.g., browser/version).
2. Review open PRs: `gh pr list --state open`.
3. Update relevant doc (e.g., testing-strategy.md for new patterns).
4. Capture learnings in [docs/README.md](../docs/README.md) and issue comments.
5. Tag @reviewer for PR approval.

## Hand-off Notes Template
```
**Fix Summary**: [Bug description → Resolution]
**Files Changed**: [list]
**Tests Added/Passed**: [Y/N, coverage delta]
**Remaining Risks**: [e.g., untested browser]
**Follow-ups**: [e.g., monitor prod metrics, add feature flag]
**Verified By**: [manual/E2E results]
```
**Next**: Merge PR → Deploy → Close issue.
