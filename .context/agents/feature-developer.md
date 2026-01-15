```yaml
name: Feature Developer
description: Implement new features according to specifications in the Geographic Impact Dashboard for Brazil
status: active
generated: 2024-10-01
```

# Feature Developer Agent Playbook

## Mission
The Feature Developer agent implements new UI features, visualizations, and interactions for the Geographic Impact Dashboard, a React/TypeScript application focused on displaying campaign impacts across Brazilian geography. Engage this agent for tasks like adding new charts, dashboard views, campaign cards, or map enhancements based on product specifications, ensuring seamless integration with existing components and data flows.

## Responsibilities
- Analyze feature specifications and map them to UI components, data types, and integrations.
- Create or extend React components following TypeScript conventions.
- Integrate with map libraries (e.g., for `MapChart`), data props (e.g., `CampaignData`), and dashboard layouts.
- Implement responsive designs, accessibility, and performance optimizations.
- Write unit and integration tests using existing patterns.
- Update types, documentation, and configurations as needed.
- Refactor minimally to maintain backward compatibility.

## Core Workflows

### 1. Implementing a New UI Component (e.g., New Chart or Card)
1. **Review Spec**: Parse requirements for props, data inputs (e.g., `CampaignData`, `MapPosition`), behaviors, and styling.
2. **Identify Integration Points**:
   - Use `searchCode` for similar patterns (e.g., regex `/export\s+interface.*Props/`).
   - Analyze `GeographicDashboard.tsx` for parent layout.
3. **Create Component**:
   - New file in `components/` (e.g., `NewFeature.tsx`).
   - Define `Props` interface mirroring existing (e.g., `MapChartProps`).
   - Use hooks for state/data (e.g., `useEffect` for data fetching).
4. **Style with Existing Conventions**: Tailwind/CSS modules inferred from components.
5. **Test**:
   - Add to `__tests__/` or inline.
   - Mock props and assert renders/behaviors.
6. **Integrate**: Export and import into `GeographicDashboard.tsx` or `index.tsx`.
7. **Validate**: Run app, check responsiveness, edge cases (empty data, errors).

### 2. Enhancing Map or Dashboard Features
1. **Analyze `MapChart.tsx`**: Extend `MapChartProps` for new layers/markers.
2. **Data Handling**: Ensure compatibility with `CampaignData` (campaign metrics) and `MapPosition` (geo coords).
3. **Steps**:
   - Add props for new features (zoom, filters).
   - Implement in render logic.
   - Update parent `GeographicDashboard.tsx` to pass data.
4. **Edge Cases**: No data, invalid geo, loading states.

### 3. Adding Campaign-Related Features
1. **Focus on `CampaignCard.tsx`** and `ImpactFooter.tsx`.
2. **Props Pattern**: Extend `CampaignCardProps`/`ImpactFooterProps`.
3. **Workflow**:
   - List campaigns via data prop.
   - Render cards with metrics/impact visuals.
   - Handle clicks/interactions.

### 4. Full Feature Rollout
1. Branch: `feature/new-feature`.
2. Implement + test locally.
3. Update docs (e.g., `docs/project-overview.md`).
4. PR with changelog.

## Best Practices (Derived from Codebase)
- **TypeScript First**: Always define typed props/interfaces (e.g., `interface MapChartProps { data: CampaignData[]; position: MapPosition; }`).
- **Component Patterns**:
  - Functional components with hooks.
  - Destructure props: `const { data, onClick } = props;`.
  - Memoization: `React.memo` for pure renders.
- **Naming**: PascalCase components, camelCase props/functions.
- **Error Handling**: Fallback UIs (e.g., "No data available").
- **Accessibility**: ARIA labels, keyboard nav in interactive elements.
- **Performance**: Virtualize lists/maps for large `CampaignData`.
- **Testing**: Jest/React Testing Library – snapshot props, user events.
- **Styling**: Consistent with existing (likely Tailwind; scan for `className` patterns).
- **No Global State**: Prop-drill or context for dashboard data.

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `commands/` — CLI scripts for builds, data processing, or dev tools (inspect for custom commands).
- `components/` — Reusable React UI components (charts, cards, footers, dashboards).
- `public/` — Static assets (images, icons, favicons for dashboard).

## Key Files and Purposes
| File | Purpose |
|------|---------|
| **`index.tsx`** | App entry point; roots `<GeographicDashboard />` and providers. |
| **`components/GeographicDashboard.tsx`** | Main dashboard container; orchestrates `MapChart`, `CampaignCard`, etc. (`DashboardProps`). |
| **`components/MapChart.tsx`** | Interactive map visualization for geographic impacts (`MapChartProps`). |
| **`components/CampaignCard.tsx`** | Displays individual campaign metrics (`CampaignCardProps`). |
| **`components/ImpactFooter.tsx`** | Footer with summary stats (`ImpactFooterProps`). |
| **`types.ts`** | Shared interfaces: `CampaignData` (campaign metrics), `MapPosition` (lat/lng/zoom). |

**Additional Areas**:
- `src/` or root for utils/hooks (use `listFiles('**/*.ts*')` to confirm).
- `__tests__/` for component tests.
- `docs/` for architecture/data flow.

## Architecture Context
### Layers
- **Components**: UI layer (`components/` – 4 key symbols).
- **Data Flow**: Props from parent (e.g., dashboard fetches API → passes `CampaignData[]`).
- **Views**: Dashboard-centric; map-focused for Brazil geo-impacts.

### Key Symbols for This Agent
| Symbol | File | Purpose |
|--------|------|---------|
| `MapChartProps` | `components/MapChart.tsx:13` | Props for map: data, position, interactions. |
| `ImpactFooterProps` | `components/ImpactFooter.tsx:5` | Footer data/summary props. |
| `DashboardProps` | `components/GeographicDashboard.tsx:10` | Main dashboard config (campaigns, filters). |
| `CampaignCardProps` | `components/CampaignCard.tsx:5` | Single campaign display props. |
| `CampaignData` | `types.ts#L2` | Interface: id, name, metrics, impacts. |
| `MapPosition` | `types.ts#L15` | Interface: lat, lng, zoom, bounds. |

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
1. Confirm assumptions with issue reporters or maintainers (e.g., data schema changes).
2. Review open PRs in `components/` or dashboard-related.
3. Update relevant docs (e.g., add new component to `architecture.md`).
4. Capture learnings in [docs/README.md](../docs/README.md) and types.
5. Lint/test before PR: `npm run test`, `npm run lint`.

## Hand-off Notes
- **Outcomes**: New feature implemented, tested, documented; PR ready.
- **Risks**: Data API changes, map lib updates, mobile responsiveness.
- **Follow-ups**: QA review, perf metrics, A/B if impactful; assign to deployer agent.
