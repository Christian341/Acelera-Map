# Glossary & Domain Concepts

Project-specific terminology, acronyms, domain entities, and user personas for the **Geographic Impact Dashboard - Brazil**. This dashboard visualizes campaign performance across Brazilian geography (states, municipalities), using interactive maps, cards, and metrics.

## Type Definitions

- **CampaignData** (interface) — [`CampaignData`](types.ts#L2)  
  Represents core campaign metrics and geographic data. Includes properties like `id`, `name`, `impactMetrics` (e.g., reach, engagement), and `locations` (array of regions or coordinates). Used throughout components like `GeographicDashboard.tsx` and `CampaignCard.tsx` for rendering campaign summaries.

  ```typescript
  interface CampaignData {
    id: string;
    name: string;
    locations: Array<{ state: string; municipality?: string; metrics: Record<string, number> }>;
    // ... additional props like dates, totalImpact
  }
  ```

- **MapPosition** (interface) — [`MapPosition`](types.ts#L15)  
  Defines viewport state for map rendering. Includes `center` (lat/lng), `zoom`, and optional `bounds`. Powers `MapChart.tsx` for Brazil-focused interactions (e.g., panning to states like São Paulo or Rio de Janeiro).

  ```typescript
  interface MapPosition {
    center: { lat: number; lng: number };
    zoom: number;
    bounds?: { ne: { lat: number; lng: number }; sw: { lat: number; lng: number } };
  }
  ```

## Enumerations

- *No enums detected.*

## Core Terms

- **Campaign**: A targeted initiative (e.g., marketing, social impact) tracked by metrics like reach, conversions, or impressions. Data is aggregated geographically for Brazil. Surfaces in `CampaignData`, `CampaignCard.tsx`, and `GeographicDashboard.tsx`. Example usage: Filter dashboard by active campaigns.

- **Geographic Impact**: Metrics overlaid on maps showing performance by Brazilian administrative divisions (UF - states, municipalities). Visualized via heatmaps or choropleths in `MapChart.tsx`. Key for regional analysis (e.g., Northeast vs. Southeast performance).

- **Dashboard**: Central UI (`GeographicDashboard.tsx`) aggregating campaigns, maps (`MapChart.tsx`), cards (`CampaignCard.tsx`), and summaries (`ImpactFooter.tsx`). Responsive for desktop/mobile, Brazil-centric (default bounds: lat -14 to -34, lng -74 to -34).

- **Impact Metrics**: Quantifiable KPIs (e.g., `reach`, `engagementRate`, `conversions`). Stored in `CampaignData.locations[].metrics`. Aggregated in footers for totals.

## Acronyms & Abbreviations

| Acronym | Expansion | Context |
|---------|-----------|---------|
| **UF** | *Unidade Federativa* | Brazilian states (e.g., SP for São Paulo). Used in location data; see `constants.ts` for lists. |
| **IBGE** | *Instituto Brasileiro de Geografia e Estatística* | Official source for Brazilian geo-data (municipalities, boundaries). Map layers in `MapChart.tsx` likely reference IBGE GeoJSON. |
| **KPI** | *Key Performance Indicator* | Campaign metrics like reach or ROI. |

## Personas / Actors

- **Campaign Manager**  
  *Goals*: Monitor real-time geographic performance, compare campaigns, drill into underperforming regions.  
  *Workflows*: Load dashboard → Select campaign → Zoom map to state → View cards/footers.  
  *Pain Points Addressed*: Manual Excel aggregation; now interactive with Brazil-specific maps.

- **Regional Analyst**  
  *Goals*: Identify hotspots (e.g., high engagement in RJ municipalities).  
  *Workflows*: Filter by metrics → Export data → Overlay custom layers.  
  *Pain Points Addressed*: Lack of visual geo-insights; supports localization (PT-BR labels).

- **Executive Stakeholder**  
  *Goals*: High-level overviews (national totals).  
  *Workflows*: Glance at `ImpactFooter.tsx` and dashboard summary.  
  *Pain Points Addressed*: Static reports; live, shareable dashboard.

## Domain Rules & Invariants

- **Geographic Scope**: Exclusively Brazil (bounds locked to national territory). Locations must reference valid IBGE codes/states (e.g., "SP", "RJ"). Invalid coords trigger defaults in `MapChart.tsx`.
- **Data Validation**: `CampaignData` requires non-empty `locations`; metrics ≥ 0. Enforced in props (`DashboardProps`, `CampaignCardProps`).
- **Localization**: Portuguese-BR (pt-BR) for labels/dates. Map tooltips show "Alcance" (reach), "Engajamento" (engagement).
- **Performance Invariants**: Map renders ≤ 5,000 polygons (municipalities); aggregates for larger zooms. Responsive: Mobile stacks cards vertically.
- **Compliance**: Anonymized data (no PII); GDPR-like for Brazil's LGPD. Timestamps in UTC, displayed in Brasília timezone.

---

*Status*: filled  
*Generated*: 2024-10-04  
*Related Files*: [`types.ts`](types.ts), [`components/GeographicDashboard.tsx`](components/GeographicDashboard.tsx), [`components/MapChart.tsx`](components/MapChart.tsx), [`constants.ts`](constants.ts)
