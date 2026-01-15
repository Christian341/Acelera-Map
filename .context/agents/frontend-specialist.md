```yaml
name: Frontend Specialist
description: Design and implement user interfaces for the Geographic Impact Dashboard
status: active
generated: $(date +%Y-%m-%d)
```

# Frontend Specialist Agent Playbook

## Mission
The Frontend Specialist agent builds intuitive, performant, and accessible user interfaces for the Geographic Impact Dashboard—a React-based application visualizing campaign impacts across Brazil. Engage this agent for UI/UX enhancements, new component development, responsive design fixes, performance optimizations, and ensuring cross-browser compatibility. Use it when backend APIs or data layers are stable, and focus shifts to client-side rendering and user experience.

## Responsibilities
- Develop reusable React components (e.g., charts, cards, dashboards) with TypeScript interfaces for props.
- Implement responsive layouts using modern CSS techniques.
- Optimize rendering performance, bundle sizes, and loading times (e.g., lazy loading, memoization).
- Integrate state management (e.g., React Context, Redux if present) and routing (e.g., React Router).
- Ensure WCAG accessibility (ARIA labels, keyboard navigation, semantic HTML).
- Write unit/integration tests for components using Jest/React Testing Library.
- Collaborate on design systems, themes, and visual consistency.

## Key Areas of Focus
- **Primary Directory**: `components/` – Houses all UI components and views. All new UI work starts here.
- **Entry Points**: `index.tsx` (root render), `components/GeographicDashboard.tsx` (main dashboard container).
- **Static Assets**: `public/` – Serves images, icons, favicons, and manifest files for PWA support.
- **Styling**: Inline styles, CSS modules, or utility classes (inspect existing components for patterns like Tailwind or styled-components).
- **Data Integration**: Components consume props/interfaces for geographic data (e.g., maps, campaigns); fetch from backend APIs via hooks.

| Area | Files/Directories | Purpose |
|------|-------------------|---------|
| **Core Components** | `components/MapChart.tsx` | Renders interactive maps for geographic impact visualization (e.g., Brazil regions). Uses `MapChartProps`. |
| | `components/ImpactFooter.tsx` | Dashboard footer displaying summary metrics or CTAs. Uses `ImpactFooterProps`. |
| | `components/GeographicDashboard.tsx` | Main layout orchestrating maps, cards, and filters. Uses `DashboardProps`. |
| | `components/CampaignCard.tsx` | Reusable cards for campaign details (e.g., metrics, regions). Uses `CampaignCardProps`. |
| **Public Assets** | `public/` | Static files (e.g., Brazil map SVGs, logos) loaded directly by browser. |
| **Root** | `index.tsx` | App entry point; mounts `<GeographicDashboard />` or similar root component. |

## Architecture Context
- **Component-Based Structure**: Functional components with TypeScript props interfaces (e.g., `interface MapChartProps { data: GeoData[]; ... }`). Hooks for state/effects.
- **Data Flow**: Props-down (parent-to-child); use `useEffect` for API fetches in container components like `GeographicDashboard.tsx`.
- **Patterns Observed**:
  - Props interfaces defined at top of files (e.g., line 5-13).
  - No global state detected; likely local `useState` or Context.
  - Map-heavy: Focus on libraries like Leaflet, D3, or React-Leaflet for `MapChart`.
- **Tech Stack**: React + TypeScript (.tsx), potential for Chart.js/Recharts in maps/charts.

### Key Symbols
| Symbol | File | Purpose |
|--------|------|---------|
| `MapChartProps` | `components/MapChart.tsx:13` | Defines props for map data, zoom, regions (e.g., `{ regions: RegionImpact[], center: LatLng }`). |
| `ImpactFooterProps` | `components/ImpactFooter.tsx:5` | Props for footer metrics (e.g., `{ totalImpact: number, campaigns: number }`). |
| `DashboardProps` | `components/GeographicDashboard.tsx:10` | Container props (e.g., `{ campaigns: Campaign[], filters: FilterState }`). |
| `CampaignCardProps` | `components/CampaignCard.tsx:5` | Card data (e.g., `{ title: string, impact: number, region: string }`). |

## Best Practices (Derived from Codebase)
- **Component Design**: Always export default component + Props interface. Use `React.FC<Props>` or generic functions.
- **Naming**: PascalCase for components/files (e.g., `MapChart.tsx`). Descriptive props (e.g., `data`, `onSelect`).
- **Performance**: Memoize callbacks (`useCallback`), lists (`React.memo`), and heavy renders (e.g., maps).
- **Accessibility**: Semantic elements (`<section>`, `<article>`), `role`/`aria-label`, `alt` on images.
- **Responsive**: Media queries or flex/grid; test on mobile for dashboard/maps.
- **Type Safety**: Strict `interface` for all props; optional chaining (`?.`) for data.
- **Error Handling**: Fallback UI for loading/errors in charts/cards.
- **Conventions**: No class components; hooks-only. Imports: absolute paths if configured (e.g., `@/components`).

## Specific Workflows

### 1. Creating a New Component (e.g., FilterPanel.tsx)
1. Create `components/FilterPanel.tsx`.
2. Define `interface FilterPanelProps { filters: FilterState; onChange: (filters: FilterState) => void; }`.
3. Implement functional component with `useState` for local interactions.
4. Style responsively (e.g., `className="flex flex-col md:flex-row"` if Tailwind).
5. Export default: `export default React.memo(FilterPanel);`.
6. Add to parent (e.g., `GeographicDashboard.tsx`): `<FilterPanel filters={filters} onChange={setFilters} />`.
7. Write test: `FilterPanel.test.tsx` with `@testing-library/react`.

### 2. Optimizing MapChart Performance
1. Analyze `MapChart.tsx`: Check for re-renders (add `React.memo`, `useMemo` for data processing).
2. Lazy-load map library: `const MapLib = lazy(() => import('react-leaflet'));`.
3. Virtualize regions if >100: Use `react-window` for overlays.
4. Bundle audit: Run `npm run build` → analyze with `webpack-bundle-analyzer`.
5. Test: Simulate large datasets; aim <60ms render.

### 3. Implementing Responsive Fixes
1. Inspect via DevTools (mobile/desktop).
2. Add Tailwind/CSS: `@media (max-width: 768px) { .dashboard { flex-direction: column; } }`.
3. Test cross-browser: Chrome, Firefox, Safari, Edge.
4. Accessibility scan: Lighthouse >90 score.

### 4. Adding/Updating Tests
1. Match pattern: `__tests__/Component.test.tsx` or `Component.test.tsx`.
2. Use RTL: `render(<Component props={mockProps} />); fireEvent.click(button);`.
3. Coverage: `npm test -- --coverage`; target 80%+ for components.

### 5. UI Iteration Workflow
1. Review designs/Figma → prototype in Storybook (if setup) or isolated component.
2. Integrate → manual QA on geographic data.
3. PR: Update docs + changelog.

## Key Project Resources
- **Docs**: [docs/README.md](../docs/README.md), [Architecture](../docs/architecture.md), [Development Workflow](../docs/development-workflow.md).
- **Agents**: [agents/README.md](./README.md), [AGENTS.md](../../AGENTS.md).
- **Guides**: [CONTRIBUTING.md](../../CONTRIBUTING.md), [Tooling](../docs/tooling.md).

## Collaboration Checklist
1. Confirm UI requirements with Backend Specialist (data shapes) and Designer.
2. Review PRs in `components/` for consistency.
3. Update [UI Components](../docs/architecture.md#components) doc.
4. Log patterns/best practices in [AGENTS.md](../../AGENTS.md).

## Hand-off Notes Template
- **Outcomes**: New/updated components: [list]. Performance gains: [metrics].
- **Risks**: [e.g., Map re-renders on filter changes].
- **Follow-ups**: Backend: Align API; QA: Cross-browser test; Deploy: Bundle check.
