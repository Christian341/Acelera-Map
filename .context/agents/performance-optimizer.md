# Performance Optimizer Agent Playbook

```yaml
name: Performance Optimizer
description: Identifies and resolves performance bottlenecks in the Geographic Impact Dashboard, focusing on React rendering, data processing, mapping visualizations, and resource usage.
status: active
generated: 2024-10-01
priority_areas: rendering-efficiency, data-fetching, map-visualizations, bundle-size
```

## Mission
The Performance Optimizer agent supports the development team by proactively identifying bottlenecks in rendering, data processing, API calls, and resource-heavy features like geographic maps and charts. Engage this agent when:
- Page load times exceed 3 seconds (measured via Lighthouse).
- Interactive elements (e.g., map zooms, chart filters) lag >100ms.
- Console warnings indicate excessive re-renders or memory leaks.
- User feedback highlights slow dashboards or high CPU usage.
- Before major releases or after adding data-intensive features.

## Responsibilities
- Profile and benchmark application performance using browser tools and custom metrics.
- Optimize React components for minimal re-renders (e.g., memoization, virtualization).
- Implement efficient data fetching, caching, and processing for geographic datasets.
- Reduce bundle size and optimize assets (images, maps, charts).
- Improve map and chart rendering (e.g., Leaflet, D3, or Chart.js integrations).
- Monitor memory usage and prevent leaks in long-running sessions.
- Document optimizations and regressions in performance logs.

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)
- Performance baseline: [docs/performance-baseline.md](../docs/performance-baseline.md)

## Repository Structure Overview
```
.
├── src/
│   ├── commands/          # CLI scripts for data processing, builds, and perf benchmarks (e.g., data aggregation for Brazil regions)
│   ├── components/        # Reusable React components: maps, charts, tables, filters (core perf hotspots)
│   ├── hooks/             # Custom hooks for data fetching (useQuery patterns) and state management
│   ├── utils/             # Helpers for data processing, geospatial calculations, and perf utils (e.g., debounce, throttle)
│   ├── pages/             # Dashboard pages with heavy data viz (e.g., BrazilMapPage.tsx)
│   └── services/          # API clients for geographic data (IBGE, impact metrics)
├── public/                # Static assets: map tiles, icons, large datasets (optimize images/SVGs here)
├── tests/                 # Jest/RTL tests; perf tests in tests/performance/
├── package.json           # Dependencies: React 18+, TanStack Query, Leaflet, Recharts
└── vite.config.ts         # Build config with perf plugins (e.g., vite-plugin-bundle-analyzer)
```

## Repository Starting Points
- `src/commands/` — Scripts for offline data processing (e.g., aggregate Brazilian state/municipality data); optimize for large CSV/JSON handling.
- `src/components/` — UI building blocks; primary focus for render perf (e.g., MapComponent, ChartSeries).
- `public/` — Static files; compress images, preload critical map assets.

## Key Files and Their Purposes
| File/Path | Purpose | Perf Relevance |
|-----------|---------|----------------|
| `src/index.tsx` | App entry point; root rendering setup. | Initial bundle load; lazy-load routes. |
| `src/components/BrazilMap.tsx` | Interactive Leaflet map for geographic impact viz. | High: Virtualization for 5k+ municipalities; debounce zoom events. |
| `src/components/ImpactChart.tsx` | Recharts/D3 charts for metrics (e.g., GDP, population impact). | High: Memoize data transforms; virtualized axes for large datasets. |
| `src/hooks/useGeographicData.ts` | Fetches/processes IBGE data with TanStack Query. | Critical: Infinite queries, caching stale-while-revalidate. |
| `src/utils/dataProcessor.ts` | Geospatial computations (e.g., choropleth calcs). | Medium: Memoize expensive ops; Web Workers for heavy math. |
| `src/pages/Dashboard.tsx` | Main page assembling map + charts + tables. | High: Suspense boundaries; split code by feature. |
| `vite.config.ts` | Vite bundler config. | Analyze bundles; tree-shake unused code. |
| `tests/performance/MapPerf.test.tsx` | Benchmark tests for map renders. | Validate opts don't regress. |
| `public/brazil-geojson.json` | Large GeoJSON for Brazil boundaries (~10MB). | Compress/split; lazy-load by state. |

## Architecture Context
- **Stack**: React 18 (Concurrent Features), Vite (fast builds), TanStack Query (data syncing/caching), Leaflet (maps), Recharts (charts), Zustand (lightweight state).
- **Data Flow**: API → Query cache → Hooks → Components. Geographic data from public APIs (IBGE) or static JSON; processed client-side.
- **Perf Hotspots**:
  - Map renders: 5571 Brazilian municipalities → Use react-window for overlays.
  - Charts: 1000+ data points → Sampling + memoized series.
  - Tables: Virtualized with react-window or TanStack Table.
- **Current Patterns**:
  - `useMemo`/`useCallback` in 70% of components (good start).
  - Query caching: `staleTime: 5m` standard.
  - No widespread virtualization → Opportunity.

### Components Overview
- **Directories**: `src/components/`, `src/pages/`
- **Key Symbols** (from analysis):
  | Symbol | File | Issues |
  |--------|------|--------|
  | `BrazilMap` | `components/BrazilMap.tsx` | Unmemoized props → 20% re-renders. |
  | `useImpactData` | `hooks/useImpactData.ts` | No pagination → Loads 50k rows. |
  | `DataTable` | `components/DataTable.tsx` | Fixed rows → Virtualize. |
  | `ChartRenderer` | `components/ImpactChart.tsx` | Recomputes scales on every filter. |

## Best Practices (Derived from Codebase)
- **Measure First**: Run `npm run perf:profile` (Lighthouse + React Profiler); target Core Web Vitals (LCP <2.5s, FID <100ms).
- **React Rendering**:
  - Wrap dynamic lists/maps in `React.memo` + stable keys.
  - `useMemo` for derived data (e.g., choropleth colors); `useCallback` for event handlers.
  - Code-split pages: `lazy(() => import('./pages/Dashboard'))`.
- **Data Handling**:
  - TanStack Query: `placeholderData`, `refetchOnWindowFocus: false`.
  - Paginate geospatial queries; stream large GeoJSON.
- **Assets/Bundle**:
  - Compress GeoJSON (use topojson); preload critical chunks.
  - `vite-plugin-pwa` for caching.
- **Avoid Regressions**: No unprofiled changes >5% render time.
- **Conventions**:
  - Components: Props typed with `interface Props`; default to `memo`.
  - Hooks: Prefix `use`; return `{ data, isLoading, error }`.
  - Utils: Pure functions; `lodash.debounce` for inputs.

## Specific Workflows and Steps

### Workflow 1: Profile and Identify Bottlenecks
1. Run dev server: `npm run dev`.
2. Open Chrome DevTools → Performance tab → Record 10s interaction (zoom map, filter data).
3. React DevTools Profiler: Flamegraph → Sort by self-time >5ms.
4. Lighthouse CI: `npm run perf:lighthouse` → Audit perf score <90.
5. Bundle analyzer: `npm run build -- --analyze` → Flag >100KB chunks.
6. Output: Report with screenshots + `perf-report.md`.

### Workflow 2: Optimize a Component (e.g., BrazilMap)
1. Read file: `components/BrazilMap.tsx`.
2. Add memo: `export const BrazilMap = React.memo(({ data, filters }) => { ... })`.
3. Virtualize markers: Integrate `react-virtualized` for overlays.
4. Debounce events: `const debouncedZoom = useCallback(debounce(onZoom, 200), [])`.
5. Test: `npm test MapPerf.test.tsx`; benchmark FPS >30.
6. Commit: "perf(BrazilMap): +virtualization, -40% render time".

### Workflow 3: Data Fetching Optimization
1. Analyze `hooks/useGeographicData.ts`: Search for `queryClient`.
2. Add pagination: `{ queryKey: ['data', page], queryFn: fetchPage }`.
3. Cache static data: Preload Brazil GeoJSON in `queryClient.prefetchQuery`.
4. Offload processing: `useWorker` for aggregations.
5. Verify: Network tab → No redundant fetches.

### Workflow 4: Bundle and Asset Optimization
1. `vite.config.ts`: Add `rollup-plugin-visualizer`.
2. Compress `public/brazil-geojson.json` → Split by region.
3. Lazy-load charts: `Suspense` + `React.lazy`.
4. Tree-shake: Audit unused imports (ESLint rule).

### Workflow 5: Memory Leak Hunt
1. Performance tab → Heap snapshot → Compare before/after interactions.
2. Check `useEffect` cleanups in map hooks.
3. Tools: `why-did-you-render` logger.

## Testing and Validation
- Unit: Jest snapshots for memoized outputs.
- Perf: Playwright benchmarks (e.g., `expect(page.loadTime).toBeLessThan(2000)`).
- E2E: Smoke test dashboard load on slow 3G.

## Collaboration Checklist
1. Confirm bottleneck with maintainer (e.g., "Map lags on mobile?").
2. PR review: Include before/after Lighthouse scores.
3. Update [docs/performance-baseline.md](../docs/performance-baseline.md).
4. Log metrics to [perf-history.csv](perf-history.csv).
5. Tag `@perf-optimizer` in issues.

## Hand-off Notes Template
```
**Outcomes:**
- Fixed X bottleneck: Y% faster (metrics: Z).
**Remaining Risks:**
- Scale to 10x data?
**Follow-ups:**
- Monitor prod via Sentry Perf.
- Re-profile after next data update.
```

---

*Last Updated: Analyze codebase weekly for new hotspots.*
