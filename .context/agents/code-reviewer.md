# Code Reviewer Agent Playbook

## Mission
The Code Reviewer agent ensures high-quality code merges by reviewing pull requests (PRs), identifying issues early, and enforcing project standards. Engage this agent on every PR submission, code refactor, or feature addition to maintain codebase integrity in this React/TypeScript dashboard application focused on visualizing geographic campaign impacts in Brazil.

## Responsibilities
- Validate code against TypeScript types and interfaces (e.g., `CampaignData`, `MapPosition`)
- Check for bugs, performance issues, security vulnerabilities, and accessibility compliance
- Enforce React best practices, component reusability, and prop drilling minimization
- Verify adherence to styling conventions, file organization, and naming standards
- Suggest optimizations for map rendering, data fetching, and UI responsiveness
- Review tests coverage for modified files
- Provide actionable, line-specific feedback with code snippets

## Key Focus Areas
Review **all** changes, prioritizing these high-impact zones:
- **Core Components Directory** (`components/`): Houses reusable UI elements like maps, cards, footers, and dashboards. 80% of changes occur here.
- **Types & Interfaces** (`types.ts`): Central type definitions; ensure no type regressions.
- **Entry Points** (`index.tsx`, `GeographicDashboard.tsx`): App bootstrap and main views.
- **Data & Config Files**: Any mock data, API mocks, or env configs for campaign impacts.
- **Tests**: Ensure changes include or update corresponding `.test.tsx` files.
- **Public Assets** (`public/`): Static files like map tiles, icons, or Brazil geo-data.

| Area | Purpose | Review Priority |
|------|---------|-----------------|
| `components/` | React components for maps, cards, dashboards | High |
| `types.ts` | Shared TypeScript interfaces (e.g., `CampaignData`, `MapPosition`) | High |
| `index.tsx` | App root and routing setup | Medium |
| `public/` | Static assets (images, geojson for Brazil regions) | Low |
| Tests (`.test.tsx`) | Unit/integration tests for components | High |

## Repository Structure Overview
```
.
├── components/          # Reusable React components (MapChart, ImpactFooter, etc.)
├── public/              # Static assets (Brazil maps, icons, index.html)
├── types.ts             # Global TypeScript types/interfaces
├── index.tsx            # App entry point
├── docs/                # Project documentation (architecture, workflow)
└── AGENTS.md            # Agent-specific knowledge base
```
- **commands/**: CLI scripts or build commands (review for shell best practices if present).
- **components/**: Primary UI layer; props-driven, functional components with hooks.
- **public/**: Served statically; review for CORS/security on geo-data files.

## Key Files and Purposes
| File | Purpose | Key Symbols/Props | Review Checklist |
|------|---------|-------------------|------------------|
| `types.ts` | Defines core data models | `CampaignData` (campaign metrics), `MapPosition` (lat/lng/zoom) | Type safety, extensibility |
| `components/MapChart.tsx` | Interactive map visualization | `MapChartProps` (data, position, callbacks) | Performance (memoization), leaflet/react-map-gl usage |
| `components/ImpactFooter.tsx` | Footer with impact stats | `ImpactFooterProps` (totals, trends) | Accessibility (ARIA), responsive design |
| `components/GeographicDashboard.tsx` | Main dashboard aggregator | `DashboardProps` (campaigns, filters) | State management, error boundaries |
| `components/CampaignCard.tsx` | Individual campaign summary cards | `CampaignCardProps` (data, actions) | Reusability, hover states |
| `index.tsx` | Root renderer | N/A | StrictMode, error handling, providers |

## Code Patterns and Conventions
Derived from codebase analysis:
- **TypeScript**: Strict mode; all props/interfaces explicitly typed (e.g., `interface MapChartProps { data: CampaignData[]; position: MapPosition; }`).
- **React**: Functional components with hooks (`useEffect`, `useMemo` for map data); no class components.
- **Styling**: CSS modules or Tailwind; consistent classNames like `map-chart-container`.
- **Naming**: PascalCase components, camelCase functions/props; descriptive (e.g., `handleMapClick`).
- **Hooks Pattern**: Custom hooks for data fetching (e.g., `useCampaignData`); memoize expensive computations.
- **Error Handling**: Try-catch in effects; fallback UIs for maps/data.
- **Performance**: `React.memo` on list items; virtualized lists for campaigns; throttled map events.
- **Accessibility**: ARIA labels on interactive elements; keyboard nav for maps/cards.
- **Imports**: Absolute paths or aliases (e.g., `@/components/`); grouped (React, then deps, then local).

**Anti-Patterns to Flag**:
- Prop drilling >2 levels (suggest Context).
- Unmemoized callbacks to children.
- Inline styles overriding CSS modules.
- Missing `key` in maps/arrays.

## Specific Workflows and Steps

### 1. Initial PR Scan (5-10 mins)
1. Clone PR branch; run `npm install && npm test && npm build`.
2. Use `analyzeSymbols` on changed files to check new types/functions.
3. `searchCode` for regex like `console\.log` (remove in prod), `any` types.
4. Verify `listFiles('**/*.test.tsx')` coverage for changes.

### 2. Component Review Workflow
```
For each changed component (e.g., MapChart.tsx):
├── Props: Match interface? Default props? Optional chaining?
├── Render: Conditional rendering? Keys in lists?
├── Hooks: Dependencies correct? Cleanup in useEffect?
├── Callbacks: Stable refs (useCallback)?
├── Styles: Responsive? Theme vars?
└── Tests: Snapshot + interaction?
```
- Example Feedback: "Line 45: Memoize `onMapClick` with `useCallback` to prevent re-renders: `const onMapClick = useCallback((pos: MapPosition) => {...}, []);`"

### 3. Type & Data Review
1. `readFile('types.ts')`; diff for breaks.
2. Ensure `CampaignData` usage validates metrics (e.g., `impactScore: number`).
3. Flag mutable state mutations (use Immer or immutable updates).

### 4. Performance/Security Audit
- Maps: Check `useMemo` for geo-data; limit markers (<1000).
- Security: No `dangerouslySetInnerHTML`; sanitize user data.
- Bundle: Run `npm run analyze` if available; flag large deps.

### 5. Testing Review
- Expect 80% coverage on changes.
- Pattern: `render(<MapChart {...props} />); fireEvent.click(map); expect(...).toBe(...)`.
- Suggest: Missing edge cases (empty data, error states).

### 6. Final Approval Checklist
- [ ] Types compile without errors.
- [ ] Lints pass (`eslint . --fix`).
- [ ] Tests pass; coverage >80%.
- [ ] Docs updated if API changes.
- [ ] No new deps without justification.
- **Approve/Reject** with summary comment.

## Best Practices from Codebase
- **Readability**: Max 80 chars/line; JSDoc on public props/interfaces.
- **Maintainability**: Single responsibility (e.g., MapChart only renders map).
- **Scalability**: Paginate campaigns; lazy-load map libraries.
- **Brazil-Specific**: UTF-8 accents; region codes (e.g., UF abbreviations); timezone-aware dates.
- **Constructive Feedback**: "Great use of useMemo! Suggestion: Add loading spinner for data fetch."

## Key Project Resources
- [docs/README.md](../docs/README.md) — Doc index
- [AGENTS.md](../../AGENTS.md) — Agent KB
- [CONTRIBUTING.md](../../CONTRIBUTING.md) — Style guide, PR template
- ESLint/Prettier configs in root.

## Documentation Touchpoints
Update on major reviews:
- [Architecture Notes](../docs/architecture.md)
- [Testing Strategy](../docs/testing-strategy.md)
- [Development Workflow](../docs/development-workflow.md)

## Collaboration Checklist
1. Ping maintainers on Brazil-data specifics (e.g., geojson accuracy).
2. Check open PRs for conflicts.
3. Reference issues in feedback.
4. Update [AGENTS.md] with new patterns.

## Hand-off Notes
- **Outcomes**: PR approved with X changes requested.
- **Risks**: Map perf on mobile; untested edge cases.
- **Follow-ups**: Add e2e tests for dashboard; monitor prod metrics post-merge.
