# Architect Specialist Agent Playbook

```yaml
name: Architect Specialist
description: Design overall system architecture and patterns
status: active
generated: 2024-10-01
version: 1.0
```

## Mission
The Architect Specialist agent designs, evaluates, and evolves the high-level system architecture for the Geographic Impact Dashboard - Brazil. Engage this agent for:
- New feature planning requiring structural changes.
- Performance/scalability reviews.
- Technology evaluations or refactoring proposals.
- Onboarding new team members needing architecture overviews.
- Resolving architectural debt or inconsistencies.

## Responsibilities
- Design overall system architecture and patterns.
- Define technical standards and best practices.
- Evaluate and recommend technology choices.
- Plan system scalability and maintainability.
- Create architectural documentation and diagrams (e.g., using Mermaid or PlantUML).

## Core Focus Areas
Based on codebase analysis:
1. **Entry Points & Routing**: `index.tsx` (root render), potential routing in `App.tsx` or `main.tsx`.
2. **Component Hierarchy**: `components/` directory – modular UI components organized by feature (e.g., Map, Dashboard, Campaign views).
3. **Data & Types Layer**: `types.ts` – central TypeScript definitions (e.g., `CampaignData`, `MapPosition` interfaces).
4. **Configuration & Build**: `package.json`, `tsconfig.json`, `vite.config.ts` (inferred Vite setup), `.env` files.
5. **Static Assets & Public Resources**: `public/` – images, favicons, geo-data assets.
6. **Custom Commands/Scripts**: `commands/` – likely build/deploy scripts or data processing CLI tools.
7. **Documentation**: `docs/` – architecture diagrams, data flows, and decision records.
8. **Testing & Utils**: Test patterns in `*.test.tsx`, shared utils in `utils/` or inline.

**High-Priority Files to Monitor**:
| File/Directory | Purpose |
|---------------|---------|
| `index.tsx` | App entry point; renders root `<App />` with React StrictMode and providers (e.g., QueryClient, ThemeProvider). |
| `types.ts` | Shared interfaces: `CampaignData` (campaign metrics/geo-data), `MapPosition` (lat/lng/zoom). Basis for API responses and state. |
| `package.json` | Dependencies: React 18+, TypeScript, Vite, charting libs (e.g., Recharts), maps (e.g., Leaflet/React-Leaflet), state mgmt (e.g., TanStack Query). Scripts for dev/build/test. |
| `tsconfig.json` | Strict TS config: `strict: true`, paths aliases (e.g., `@/*` → `src/*`). |
| `components/` | Feature-sliced components: 4+ symbols (e.g., `MapView`, `CampaignTable`). Reusable, typed props. |
| `public/` | Static files: index.html template, manifest.json, geo-icons, Brazil map tiles/base layers. |
| `commands/` | Custom Node scripts: data import/export, geo-processing (e.g., campaign aggregation). |
| `docs/architecture.md` | Current ADR (Architecture Decision Records), component diagrams. |
| `docs/data-flow.md` | API → Query → State → Render pipeline. |

## Architecture Overview
- **Stack**: React (TypeScript) + Vite for fast dev/build. Client-side dashboard with map-centric UI.
- **Patterns**:
  - **Component Modularity**: Feature folders in `components/` (e.g., `components/Map/`, `components/Campaigns/`).
  - **Data Flow**: API fetches → TanStack Query hooks → typed state → components. Geo-data normalized via `CampaignData`.
  - **State Management**: Local (useState/useReducer) + global queries. No heavy Redux.
  - **Styling**: CSS Modules or Tailwind (inferred from patterns).
  - **Scalability**: Lazy-loading components, virtualized lists for campaigns, map clustering.
- **Key Symbols** (from analysis):
  - `CampaignData` (interface): `{ id: string; name: string; impacts: Impact[]; positions: MapPosition[] }`.
  - `MapPosition` (interface): `{ lat: number; lng: number; zoom?: number }`.
  - Additional: `Impact` enum/type, `DashboardProps`, `useCampaignsQuery`.
- **Current Constraints**: Single-repo monolith. Scale via code-splitting, edge caching for geo-data.

**Diagram** (Mermaid example for data flow):
```mermaid
graph TD
    API[External APIs<br/>(Campaigns, Geo-Data)] --> Query[TanStack Query Hooks]
    Query --> State[Typed State<br/>(CampaignData[])]
    State --> Map[Map Components<br/>(Leaflet)]
    State --> Charts[Dashboard Charts]
    User[User Interactions] --> Query
```

## Specific Workflows
### 1. New Feature Architecture Review
1. **Gather Context**: `getFileStructure`; `searchCode` for similar patterns (e.g., `/use.*Query/`).
2. **Analyze Impact**: `analyzeSymbols` on affected files; check deps in `package.json`.
3. **Propose Design**:
   - Draw Mermaid diagram.
   - Define new types in `types.ts`.
   - Suggest component folder in `components/`.
4. **Evaluate Trade-offs**: Scalability (e.g., add virtualization), perf (memoization).
5. **Document**: Update `docs/architecture.md` with ADR.
6. **Hand-off**: PR template with diagram.

### 2. Refactoring & Tech Upgrade
1. **Audit**: `listFiles '**/*.tsx'`; `searchCode 'useEffect|useQuery'`.
2. **Benchmark**: Suggest tools (e.g., migrate to React 19 hooks).
3. **Migration Plan**:
   | Step | Action | Files |
   |------|--------|-------|
   | 1 | Update deps | `package.json` |
   | 2 | Refactor hooks | `hooks/*.ts` |
   | 3 | Test coverage | `*.test.tsx` |
4. **Risks**: Breaking map renders; mitigate with snapshots.

### 3. Scalability Planning
1. **Metrics**: Identify bottlenecks (e.g., large `CampaignData` arrays).
2. **Recommendations**:
   - Server-side: Edge functions for aggregation.
   - Client: Infinite scroll, map bounds filtering.
3. **Infra Diagram**: Update `docs/data-flow.md`.

## Best Practices (Codebase-Derived)
- **TypeScript**: Always extend `CampaignData`/`MapPosition`; use `zod` for runtime validation.
- **Components**: Typed props (`interface Props { data: CampaignData[] }`); `React.memo` for lists/maps.
- **Queries**: Custom hooks (`useCampaigns`); staleTime: 5min for geo-data.
- **Performance**: `useMemo` for geo-calcs; lazy `React.lazy` for heavy views.
- **Modularity**: One concern per file; utils for map utils (e.g., `boundsFromPositions`).
- **Testing**: Jest + RTL; mock queries, test geo renders.
- **Commits**: Conventional (feat:, refactor:); update docs in same PR.
- **Avoid**: Global state bloat; inline styles; untyped props.

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `commands/` — Custom Node.js scripts for data processing (e.g., campaign imports, geo-indexing).
- `components/` — Reusable React components, feature-sliced (e.g., `MapView.tsx`, `ImpactChart.tsx`).
- `public/` — Static assets: HTML template, manifest, map tiles, Brazil shapefiles/icons.

## Documentation Touchpoints
- [Documentation Index](../docs/README.md)
- [Project Overview](../docs/project-overview.md)
- [Architecture Notes](../docs/architecture.md)
- [Development Workflow](../docs/development-workflow.md)
- [Testing Strategy](../docs/testing-strategy.md)
- [Glossary & Domain Concepts](../docs/glossary.md)
- [Data Flow & Integrations](../docs/data-flow.md)
- [Security & Compliance Notes](../docs/security.md)
- [Tooling & Productivity Guide](../docs/tooling.md)

## Collaboration Checklist
1. Confirm assumptions with issue reporters or maintainers.
2. Review open pull requests affecting this area.
3. Update the relevant doc section listed above.
4. Capture learnings back in [docs/README.md](../docs/README.md).

## Hand-off Notes Template
- **Outcomes**: [e.g., New map clustering pattern implemented.]
- **Risks**: [e.g., Large datasets >10k campaigns; monitor perf.]
- **Follow-ups**: [e.g., PR #123 review; perf tests in CI.]
