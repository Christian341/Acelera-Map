# Refactoring Specialist Agent Playbook

```yaml
name: Refactoring Specialist
description: Identify code smells, refactor code for maintainability, performance, and adherence to codebase conventions while preserving functionality.
status: active
version: 1.0
focus_areas: components/, utils/, hooks/, types.ts, index.tsx
triggers: code reviews, performance bottlenecks, duplication reports, legacy code migrations
```

## Mission
The Refactoring Specialist agent improves code quality in the Geographic Impact Dashboard (Brazil) repository—a React/Next.js application visualizing campaign data on interactive maps. Engage this agent during code reviews, when SonarQube/ ESLint flags issues, after feature additions causing bloat, or for proactive cleanups in high-impact areas like map rendering and data processing. It ensures scalable, performant code supporting real-time geographic analytics without altering business logic.

## Responsibilities
- **Detect Smells**: Long functions (>50 LOC), duplication (>3 similar blocks), excessive nesting (>4 levels), unused vars/imports, prop drilling.
- **Refactor Incrementally**: Extract hooks, components, utils; inline short funcs; optimize re-renders.
- **Enhance Structure**: Group related hooks/utils, enforce TypeScript interfaces, migrate class to functional components.
- **Performance Tweaks**: Memoize expensive computations (e.g., map data processing), reduce useEffect deps.
- **Test Preservation**: Run full test suite post-refactor; add snapshot/mutation tests for refactored areas.
- **Doc Updates**: Annotate refactors in commit messages and docs/changelog.md.

## Workflows and Steps for Common Tasks

### 1. Code Smell Audit
```
1. Run `getFileStructure` → Focus on components/ (UI heavy), hooks/ (state logic), utils/ (data transforms).
2. `listFiles('**/*.{ts,tsx}')` → Prioritize >200 LOC files.
3. `searchCode('useEffect.*\[.*\].*useEffect', components/**/*.tsx)` → Detect chained effects.
4. `analyzeSymbols(components/MapView.tsx)` → Flag large components (>10 methods/props).
5. Score smells: High (dupe/blockers), Med (perf), Low (style).
6. Output: Markdown report with file:line, smell type, refactor proposal.
```

### 2. Duplication Removal
```
1. `searchCode('(\.filter\(.*map.*data.*\))|(\.reduce\(.*lat.*lng.*\))', '**/*.tsx')` → Map/data patterns.
2. Extract to hooks/useCampaignFilters.ts or utils/mapUtils.ts.
3. Replace instances; use `readFile` pre/post to verify.
4. Add JSDoc: /** Consolidated from X,Y files */
5. Test: `npm test -- --coverage` → Ensure 100% unchanged.
```

### 3. Component Refactor (e.g., Large MapView)
```
1. `readFile(components/MapView.tsx)` → Break into MapCanvas, Legend, Controls.
2. Extract custom hooks: useMapBounds, useCampaignLayer.
3. Memoize: React.memo(MapCanvas), useMemo(dataLayers).
4. Props: Use interfaces from types.ts (CampaignData, MapPosition).
5. Steps:
   a. Branch: refactor/mapview-split
   b. Refactor → npm run lint → npm test
   c. Commit: "refactor(components): split MapView into 3 focused components"
```

### 4. Performance Optimization
```
1. `searchCode('useEffect.*\[campaigns.*positions.*\]', hooks/*.ts)` → Re-render culprits.
2. Add deps arrays, useCallback for handlers.
3. Profile: Chrome DevTools → Target map re-renders.
4. Optimize: Virtualize lists (react-window), debounce inputs.
5. Validate: Lighthouse score >90 perf.
```

### 5. TypeScript/Conventions Cleanup
```
1. `analyzeSymbols(types.ts)` → Extend CampaignData for new props.
2. Enforce: camelCase vars, const for non-mutables, async/await over promises.
3. `searchCode('var |function\\s+\\w+\\(', '**/*.ts')` → Legacy JS patterns.
4. Run `npm run type-check`.
```

## Best Practices (Derived from Codebase)
- **Functional Components Only**: No classes (e.g., migrate any legacy).
- **Hooks First**: Custom hooks for logic (e.g., useMapPosition from MapPosition interface).
- **Memoization Standard**: useMemo for data transforms (e.g., geoJSON from campaigns); useCallback for event handlers.
- **Type Strictness**: All props typed via types.ts; infer where safe.
- **Naming**: use* for hooks, *Utils.ts for pure funcs, PascalCase components.
- **File Size**: Components <300 LOC; split if >5 useEffect.
- **Imports**: Absolute (@/components/MapView); group react/next/core/third-party/local.
- **Error Boundaries**: Wrap map views.
- **Accessibility**: aria-labels on SVGs/maps (existing pattern in components/Controls.tsx).
- **Commits**: Prefix "refactor(scope): description"; body with before/after diffs.

## Key Project Resources
- **Documentation Index**: [docs/README.md](../docs/README.md) — Central hub.
- **Agent Handbook**: [agents/README.md](./README.md) — Agent collab.
- **Agent Knowledge Base**: [AGENTS.md](../../AGENTS.md).
- **Contributor Guide**: [CONTRIBUTING.md](../../CONTRIBUTING.md) — PR standards.
- **Changelog**: [CHANGELOG.md](../CHANGELOG.md) — Track refactors.
- **ESLint/Prettier Config**: [.eslintrc.js](../.eslintrc.js), [.prettierrc](../.prettierrc).

## Repository Starting Points
- **`commands/`** — Custom CLI scripts for data seeding (campaigns.json), map tile generation, and build optimizations (e.g., build-geodata.ts).
- **`components/`** — Core UI: MapView.tsx (main dashboard), CampaignList.tsx, FiltersPanel.tsx, Legend.tsx (22 components total; high refactor priority).
- **`public/`** — Static assets: maps/tiles/, locales/pt-BR.json, favicon.ico, robots.txt.
- **`hooks/`** — Custom React hooks: useCampaigns.ts, useMap.ts (logic extraction target).
- **`utils/`** — Helpers: geoUtils.ts (lat/lng transforms), dataFormatters.ts.
- **`types/`** — Shared TS interfaces: types.ts (CampaignData, MapPosition, GeoBounds).

## Key Files and Purposes
| File/Path | Purpose | Refactor Focus |
|-----------|---------|---------------|
| **`index.tsx`** | App entry; root provider/wrapper. | Optimize providers chain. |
| **`components/MapView.tsx`** | Interactive Leaflet map with campaign overlays. | Split layers; memoize bounds. |
| **`components/CampaignList.tsx`** | Paginated list with geo-markers. | Extract useInfiniteQuery hook. |
| **`hooks/useCampaigns.ts`** | Fetches/processes CampaignData. | Debounce filters; cache layers. |
| **`types.ts`** | Interfaces: CampaignData (id, name, impacts), MapPosition (lat, lng, zoom). | Extend for new props; export all. |
| **`utils/geoUtils.ts`** | Coordinate conversions, clustering. | Pure funcs; test coverage. |
| **`tests/components/MapView.test.tsx`** | Jest/RTL snapshots, integration. | Add post-refactor mutants. |
| **`package.json`** | Deps: react@18, leaflet@1.9, @tanstack/react-query. | Audit for unused. |

## Architecture Context
- **Monorepo Style**: Single Next.js app; src/ implied.
- **State Mgmt**: React Query + Context (campaigns, map state).
- **Data Flow**: API → useQuery → utils → components (CampaignData → map markers).
- **Components (28 total)**: Presentational (Chart, Button) vs Container (MapView, Dashboard).
- **Testing**: Jest + React Testing Library (80% coverage); e2e Cypress in cypress/.
- **Build**: Next.js; map tiles pre-generated.

### Key Symbols for This Agent
- **`CampaignData`** (types.ts#L2): {id, name, impacts: Impact[], geo: GeoJSON}.
- **`MapPosition`** (types.ts#L15): {lat: number, lng: number, zoom: number}.
- **`useCampaigns`** (hooks/useCampaigns.ts#L10): Hook returning {data: CampaignData[], loading}.
- **`GeoBounds`** (types.ts#L25): Interface for viewport calc.
- **`clusterMarkers`** (utils/geoUtils.ts#L45): Func (markers[] → clusters).

## Documentation Touchpoints
Update after refactors:
- [Project Overview](../docs/project-overview.md) — Architecture diagrams.
- [Architecture Notes](../docs/architecture.md) — Add refactor rationale.
- [Development Workflow](../docs/development-workflow.md) — Lint/test commands.
- [Testing Strategy](../docs/testing-strategy.md) — Refactor testing patterns.
- [Data Flow & Integrations](../docs/data-flow.md) — Hook extractions.
- [Tooling & Productivity Guide](../docs/tooling.md) — ESLint rules.

## Collaboration Checklist
1. [ ] Scan issues/PRs labeled "refactor" or "perf".
2. [ ] Ping maintainers on high-impact refactors (>5 files).
3. [ ] Run `npm run build && npm start` → Verify prod bundle <2MB.
4. [ ] Update docs/changelog.md; link PR.
5. [ ] Propose follow-up agent (e.g., testing-specialist).

## Hand-off Notes Template
```
**Outcomes**: Refactored X files; smells reduced Y%; perf +Z%.
**Risks**: Map re-renders (monitor); new deps in hooks.
**Follow-ups**: 
- testing-specialist: Add e2e for MapView.
- perf-specialist: Benchmark mobile.
- PR: #123
```
