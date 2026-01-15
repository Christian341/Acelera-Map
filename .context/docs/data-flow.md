# Data Flow & Integrations

This document outlines the data flow in the **Geographic Impact Dashboard - Brazil** application, a React-based frontend visualizing campaign impacts on a Brazilian map. Data is **static and mock-based**, sourced from `constants.ts` and typed via `types.ts`. There are **no external APIs, services, or async fetches**—all data is predefined for demonstration. Flow occurs purely through React props drilling from `App.tsx` downward.

## Module Dependencies

Visual map of import/export relationships (key files only):

```
App.tsx ← index.tsx
App.tsx → constants.ts, types.ts, components/GeographicDashboard.tsx
GeographicDashboard.tsx → types.ts, components/MapChart.tsx, components/CampaignCard.tsx, components/ImpactFooter.tsx
MapChart.tsx → constants.ts, types.ts
```

- **constants.ts**: Exports static data (e.g., mock `CampaignData` arrays, map configurations).
- **types.ts**: Defines core types like `CampaignData` (campaign metrics: id, name, impact stats) and `MapPosition` (lat/lng for map markers).
- **App.tsx**: Entry point; imports and passes root data to `GeographicDashboard`.
- No cycles or complex state management (e.g., no Redux/Context beyond props).

## Service Layer

- **None detected**. No service classes, API clients, or HTTP utilities (e.g., Axios/Fetch absent).
- Data is synchronous and embedded, ideal for prototyping. For production, extend with a service layer (e.g., `services/api.ts`).

## High-level Flow

Data originates in `constants.ts`, flows via props through the component tree, and renders as interactive UI. Mermaid diagram:

```mermaid
graph TD
    A[constants.ts<br/>Mock CampaignData[]] --> B[App.tsx<br/>Root Render]
    B --> C[GeographicDashboard.tsx<br/>DashboardProps]
    C --> D[MapChart.tsx<br/>MapChartProps + MapPosition[]]
    C --> E[CampaignCard.tsx<br/>CampaignCardProps]
    C --> F[ImpactFooter.tsx<br/>ImpactFooterProps]
    D --> G[Interactive Map<br/>Markers, Zoom, Clicks]
    E --> H[Campaign List<br/>Cards with Metrics]
    F --> I[Summary Stats<br/>Totals, KPIs]
```

1. **Input**: Static `CampaignData[]` from constants (e.g., `{ id: string, name: string, impact: number, position: MapPosition }`).
2. **Processing**: Prop transformation/filtering in `GeographicDashboard.tsx` (e.g., filter by active campaigns).
3. **Output**: Visuals in `MapChart` (Leaflet/D3 map), cards, and footer.

**Example Data Shape** (from `types.ts`):
```typescript
interface CampaignData {
  id: string;
  name: string;
  impact: number; // e.g., users reached
  position: MapPosition;
}

interface MapPosition {
  lat: number;
  lng: number;
}
```

## Internal Movement

- **Props Drilling**: Primary mechanism. `App.tsx` passes `CampaignData[]` as `DashboardProps` to `GeographicDashboard.tsx`.
  - `GeographicDashboard` slices data:
    - `MapChartProps`: `positions: MapPosition[]` for markers.
    - `CampaignCardProps`: Individual `CampaignData` for cards.
    - `ImpactFooterProps`: Aggregated stats (e.g., `totalImpact: sum(campaigns.impact)`).
- **State**: Local React state for UI interactions (e.g., map zoom in `MapChart.tsx`, selected campaign in `GeographicDashboard.tsx`).
- **No Shared State**: No Context API, Redux, or global stores. Events are callback props (e.g., `onCampaignSelect: (id: string) => void`).
- **Collaboration Patterns**:
  | Module | Role | Inputs | Outputs |
  |--------|------|--------|---------|
  | `App.tsx` | Orchestrator | Static data | Props to Dashboard |
  | `GeographicDashboard.tsx` | Composer | `CampaignData[]` | Sub-component props |
  | `MapChart.tsx` | Visualizer | `MapPosition[]` | Map events (zoom, click) |
  | `CampaignCard.tsx` | Detail View | Single `CampaignData` | Click callbacks |

**Usage Example** (in `GeographicDashboard.tsx`):
```tsx
const Dashboard: React.FC<DashboardProps> = ({ campaigns }) => {
  const positions = campaigns.map(c => c.position); // Data transform
  return (
    <>
      <MapChart positions={positions} onMarkerClick={handleSelect} />
      {campaigns.map(campaign => (
        <CampaignCard key={campaign.id} data={campaign} />
      ))}
    </>
  );
};
```

## External Integrations

- **None**. 
  - No API calls, WebSockets, or third-party services.
  - Map rendering likely uses browser APIs (e.g., Leaflet via CDN or bundled lib—check `MapChart.tsx`).
  - Future: Add `fetch` in a service for real backend (e.g., `/api/campaigns` with JWT auth, retry via exponential backoff).

## Observability & Failure Modes

- **Metrics/Traces**: None built-in. Use React DevTools or browser console for prop inspection.
- **Logging**: Implicit via `console.log` (search codebase: none explicit). Add Sentry/Vercel Analytics.
- **Failure Modes**:
  | Failure | Impact | Handling |
  |---------|--------|----------|
  | Invalid `MapPosition` (e.g., NaN lat) | Map fails to render | Local try-catch in `MapChart`; fallback empty map. No error boundaries detected. |
  | Empty `CampaignData[]` | Blank UI | Conditional rendering in `GeographicDashboard` (e.g., "No data"). |
  | Prop type mismatch | Runtime errors | TypeScript catches at build; add `ErrorBoundary` wrapper in `App.tsx`. |
- **Resilience**: Static data = zero runtime failures. For dynamic data:
  - Retry: N/A.
  - Dead-letter: N/A.
  - Backoff: Implement in future fetch wrappers.

**Recommendations**:
- Add React Query/SWR for caching if integrating APIs.
- Embed data diagrams in `public/` for static hosting.
- Monitor via browser Performance tab for render bottlenecks.

---

*status: filled*  
*generated: 2024-10-01*  
*next: Review for API integration in backlog.*
