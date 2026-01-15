# Geographic Impact Dashboard - Brazil

## Project Summary

This project is a **React-based web dashboard** designed to visualize the geographic impact of marketing or social campaigns across Brazil. It aggregates and displays campaign performance data on interactive maps, highlighting reach, engagement, and impact metrics by region (states, cities). Key features include dynamic map charting, campaign cards for detailed breakdowns, and a responsive layout for stakeholders to monitor real-world outcomes.

**Who benefits?**
- **Marketing teams**: Track campaign ROI by geography.
- **Data analysts**: Explore spatial patterns in user engagement.
- **Executives**: High-level dashboards for decision-making.
- **Developers**: Extensible TypeScript codebase for custom visualizations.

## Quick Facts

- **Root path**: `C:\Users\Administradorr\Documents\códigos\geographic-impact-dashboard---brazil`
- **Primary languages detected**:
  - .md (23 files) — Extensive documentation.
  - .tsx (6 files) — React components.
  - .ts (3 files) — Types and utilities.
  - .json (4 files) — Configs and metadata.
  - .html (1 file) — Entry HTML.
- **Size**: Compact monorepo (~40 files total), focused on frontend.
- **License**: Not specified (check `README.md`).

## Entry Points

- [`index.tsx`](index.tsx) — Renders the root `App` component into the DOM.
- [`App.tsx`](App.tsx) — Central orchestrator, mounting the `GeographicDashboard`.

## Key Exports

**Interfaces (Public API):**
- [`CampaignData`](types.ts#L2) — Core data shape for campaigns: `{ id: string; name: string; metrics: { reach: number; engagement: number }; regions: string[] }`.
- [`MapPosition`](types.ts#L15) — Map viewport: `{ lat: number; lng: number; zoom: number }`.

**Components (Usage Examples):**
```tsx
// Example: GeographicDashboard (main entry)
<GeographicDashboard campaigns={campaignsData} initialPosition={defaultMapPosition} />

// Example: MapChart (interactive map)
<MapChart data={campaignData} position={mapPosition} />
```

## File Structure & Code Organization

```
.
├── App.tsx                          # Root app component, wires dashboard.
├── ARCHITECTURE.md                  # High-level system design and patterns.
├── BACKLOG.md                       # Feature backlog and user stories.
├── commands/                        # NPM scripts and CLI utilities (e.g., build, deploy).
├── components/                      # Reusable React components:
│   ├── GeographicDashboard.tsx      # Main dashboard layout (imported by 4 files).
│   ├── MapChart.tsx                 # Interactive Brazil map with overlays.
│   ├── ImpactFooter.tsx             # Metrics summary footer.
│   └── CampaignCard.tsx             # Individual campaign details.
├── constants.ts                     # App-wide values (e.g., map defaults, API endpoints).
├── index.html                       # Vite HTML template (entry point).
├── index.tsx                        # DOM renderer and app bootstrap.
├── metadata.json                    # Build/deploy metadata (e.g., version, env).
├── package.json                     # Dependencies and scripts.
├── package-lock.json                # Locked dependency tree.
├── PRD.md                           # Product Requirements Document.
├── PROJECT_DETAILS.md               # Implementation notes and decisions.
├── public/                          # Static assets (e.g., icons, Brazil map tiles).
├── README.md                        # Quickstart and contributor guide.
├── tsconfig.json                    # TypeScript compiler options.
├── types.ts                         # Shared interfaces (CampaignData, MapPosition).
└── vite.config.ts                   # Vite bundler config (dev server, plugins).
```

**Patterns & Conventions**:
- **Component naming**: PascalCase, props-driven (e.g., `DashboardProps`).
- **Data flow**: Top-down props; mock data in components for dev.
- **Styling**: Inline CSS or Tailwind (inferred from .tsx files).
- **Cross-references**: All components import from `types.ts`; `App.tsx` composes everything.

## Technology Stack Summary

- **Runtime**: Browser (static SPA).
- **Languages**: TypeScript + JSX/TSX.
- **Build Tooling**: Vite (fast HMR, ES modules).
- **Linting/Formatting**: ESLint + Prettier (via `package.json` scripts).
- **Bundle Size**: Minimal (~6 TSX files).

## Core Framework Stack

**Frontend Layer**:
- **React 18+**: Hooks-based components (`useState`, `useEffect` for map interactions).
- **Architectural Patterns**:
  - Functional components with TypeScript props.
  - Composition over inheritance (e.g., `App` → `GeographicDashboard` → `MapChart`).
  - No state management lib (local state suffices for demo).

**No Backend/Data Layer**: Mock data; extend with API fetches.

## UI & Interaction Libraries

- **Custom Components**: Tailored for maps and cards.
- **Mapping**: Likely Leaflet/D3 (in `MapChart.tsx`); Brazil-focused GeoJSON.
- **Theming**: CSS variables for dark/light mode.
- **Accessibility**: Semantic HTML, ARIA labels on charts (TODO: Audit).
- **Responsive**: Mobile-first via media queries.

**Example Map Integration** (in `MapChart.tsx`):
```tsx
interface MapChartProps {
  data: CampaignData[];
  position: MapPosition;
}
```

## Development Tools Overview

- **CLIs**: `npm run dev` (Vite dev server), `npm run build` (production bundle).
- **Editor**: VS Code recommended (TS extensions).
- **Debugging**: React DevTools + browser console.
- See [Tooling & Productivity Guide](./tooling.md) for VS Code settings, extensions.

## Getting Started Checklist

1. **Clone & Install**: `git clone <repo> && cd geographic-impact-dashboard---brazil && npm install`.
2. **Run Dev Server**: `npm run dev` — Opens at `http://localhost:5173`.
3. **Build for Prod**: `npm run build` — Outputs to `dist/`.
4. **Review Docs**: [Development Workflow](./development-workflow.md), [ARCHITECTURE.md](./ARCHITECTURE.md).
5. **Test Data**: Edit `constants.ts` for mock campaigns.

## Next Steps

- **Product Positioning**: MVP for Brazilian campaign analytics; scale to real-time data via API.
- **Key Stakeholders**: Marketing leads, data team.
- **External Links**:
  - [PRD.md](./PRD.md) — Full specs.
  - [BACKLOG.md](./BACKLOG.md) — Prioritized features (e.g., filters, exports).
- **Contribute**: Add API integration, unit tests (`jest` ready in `package.json`).

**Status**: Filled (2024). Questions? Open an issue or ping in `#dev-chat`.
