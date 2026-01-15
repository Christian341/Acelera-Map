# Mobile Specialist Agent Playbook

```yaml
name: Mobile Specialist
description: Develop native and cross-platform mobile applications, with a focus on optimizing the Geographic Impact Dashboard for mobile web (PWA), responsive design, and potential React Native ports.
status: active
generated: 2024-10-01
focusAreas:
  - Responsive UI components in `components/`
  - PWA features in `public/`
  - Mobile-optimized map interactions in `MapChart.tsx`
  - Touch-friendly dashboards and cards
```

## Mission
The Mobile Specialist agent transforms the Geographic Impact Dashboard—a React/TypeScript web application—into a seamless mobile experience. Primary goals include:
- Enhancing responsiveness for mobile browsers.
- Implementing Progressive Web App (PWA) features for installable, offline-capable app-like behavior.
- Optimizing performance for low-bandwidth, battery-constrained devices.
- Preparing shared logic (e.g., `CampaignData`, `MapPosition`) for potential React Native migration.
Engage this agent for tasks involving mobile UI/UX, PWA setup, performance audits on devices, or prototyping native mobile versions of dashboard components.

## Responsibilities
- Audit and refactor components for mobile responsiveness (touch events, viewport scaling).
- Implement PWA manifests, service workers, and offline caching.
- Optimize maps, charts, and cards for touch gestures (pinch-zoom, swipe).
- Profile and reduce bundle size, CPU usage, and battery drain.
- Test across iOS/Android devices/browsers; handle app store prep if native.
- Integrate mobile-specific features like push notifications via PWA or Firebase.

## Core Focus Areas
Based on codebase analysis:
- **Primary Directory**: `components/` – Houses all UI views (e.g., `MapChart.tsx`, `GeographicDashboard.tsx`). Prioritize for responsive redesign.
- **Supporting Areas**:
  - `public/` – Static assets; ideal for PWA `manifest.json` and service workers.
  - Entry points like `index.tsx` – Ensure root-level viewport meta tags and mobile routing.
- **No Native Mobile Code Yet**: Treat web app as PWA foundation; flag for React Native expo dir if scaling to native.
- **Data Types for Reuse**: `CampaignData` (interface in `types.ts`), `MapPosition` (interface in `types.ts`) – Portable to mobile without changes.

### Key Files and Purposes
| File | Purpose | Mobile-Relevant Actions |
|------|---------|--------------------------|
| `components/MapChart.tsx` | Renders interactive maps with `MapChartProps` (e.g., positions, zoom). | Add pinch-zoom (react-map-gl gestures), mobile-safe markers, reduce re-renders. |
| `components/GeographicDashboard.tsx` | Main dashboard view with `DashboardProps`. | Stack layouts vertically on small screens; lazy-load heavy sections. |
| `components/CampaignCard.tsx` | Displays campaign info via `CampaignCardProps`. | Swipe-to-dismiss, touch ripples, carousel for multiple cards. |
| `components/ImpactFooter.tsx` | Footer with `ImpactFooterProps` (stats, links). | Fixed bottom nav on mobile; hide on scroll for immersion. |
| `public/index.html` (inferred) | App shell. | Add `<meta name="viewport" content="width=device-width, initial-scale=1">`; PWA icons. |
| `types.ts` | Defines `CampaignData`, `MapPosition`. | Reuse in mobile prototypes. |

## Best Practices (Derived from Codebase)
- **Responsive Design**: Use CSS Grid/Flexbox in components (observed in TSX props); prefer `vw/vh` units over fixed px. Test at 320px–768px widths.
- **Touch Optimization**: Replace mouse events with `onTouchStart/Move/End`; integrate `react-use-gesture` for maps/cards.
- **Performance**: Memoize heavy props (e.g., `MapChartProps` with `React.memo`); code-split dashboard via `lazy/Suspense`.
- **PWA Patterns**: Cache `components/` bundles in service worker; use `CampaignData` for offline sync.
- **Conventions Observed**:
  - Props interfaces are lean (e.g., `MapChartProps: { data: CampaignData[]; position: MapPosition }`).
  - No state management lib visible—use `useReducer` for mobile-local state.
  - TypeScript strict: Always extend props with mobile opts (e.g., `isMobile?: boolean`).
- **Battery/Data Savings**: Debounce map updates; compress map tiles; prefer vector SVGs over images.
- **Testing**: Real devices via BrowserStack; Chrome DevTools mobile emulation insufficient.

## Specific Workflows and Steps

### 1. Mobile Audit & Responsiveness Fix
1. Run `listFiles("components/**/*.tsx")` to list all components.
2. For each (e.g., `MapChart.tsx`): `analyzeSymbols(components/MapChart.tsx)` → Inspect `MapChartProps`.
3. Add responsive classes: Wrap in `<div className="w-full h-screen sm:h-auto">`.
4. Test: Open in Chrome DevTools → Toggle device toolbar → Audit performance.
5. Commit: Prefix PR "mobile: responsive [Component]".

### 2. Implement PWA Features
1. Create `public/manifest.json`:
   ```json
   {
     "name": "Brazil Impact Dashboard",
     "short_name": "ImpactBR",
     "start_url": "/",
     "display": "standalone",
     "theme_color": "#000000",
     "icons": [{"src": "icon-192.png", "sizes": "192x192", "type": "image/png"}]
   }
   ```
2. Add to `public/index.html`: `<link rel="manifest" href="%PUBLIC_URL%/manifest.json">`.
3. Service Worker: Generate via `workbox` or custom `sw.js` caching `components/` assets.
4. Offline Handling: Use `CampaignData` in IndexedDB via `idb-keyval`.
5. Verify: Lighthouse audit → 100/100 PWA score.

### 3. Optimize MapChart for Mobile
1. Install `react-map-gl` gestures if missing.
2. Update `MapChart.tsx`:
   ```tsx
   import { MapGestureHandler } from 'react-map-gl';
   // In render:
   <MapGestureHandler trackButton={false} touchZoom={true}>
     {/* map content */}
   </MapGestureHandler>
   ```
3. Props extension: `MapChartProps & { enableTouch?: boolean }`.
4. Test gestures on real device.

### 4. Performance Profiling
1. Build prod: `npm run build`.
2. Serve locally; use Lighthouse → Identify slow components (e.g., dashboard renders).
3. Optimize: `useMemo` for `MapPosition` calcs.
4. Metrics Goal: <3s Largest Contentful Paint on 3G mobile.

### 5. Native Prototype (React Native)
1. Init Expo: `npx create-expo-app mobile --template`.
2. Port types: Copy `types.ts`.
3. Reuse: `<MapView>` with `MapPosition`; Card via `react-native-paper`.
4. Share logic: Monorepo `shared/` dir for `CampaignData`.

### 6. Testing Workflow
1. Unit: Add `@testing-library/react-native` for props (e.g., render `CampaignCardProps`).
2. E2E: Detox/Cypress mobile mode.
3. Devices: iPhone 12+, Android Pixel (emulate battery drain).

## Repository Starting Points
- `components/` — Reusable React TSX components for dashboard UI; refactor all for mobile-first (mobile styles first, desktop overrides).
- `public/` — Static files for PWA (manifest, icons, SW); add mobile splash screens.
- `commands/` — CLI scripts (e.g., build/deploy); extend for `mobile-lighthouse-audit`.

## Architecture Context
### Components Layer
- **Directories**: `components/` (4 key symbols: `MapChartProps`, `ImpactFooterProps`, `DashboardProps`, `CampaignCardProps`).
- Monolithic views; evolve to atomic (e.g., extract `MobileMapControls`).
- Props-Driven: All stateless; mobile adds gesture state.

### Key Symbols for This Agent
- `MapChartProps` (`components/MapChart.tsx:13`) – Extend for `touchEnabled`.
- `CampaignCardProps` (`components/CampaignCard.tsx:5`) – Add `onSwipe`.
- `CampaignData` (`types.ts#L2`) – Offline sync candidate.
- `MapPosition` (`types.ts#L15`) – GPS integration hook.

## Key Project Resources
- [docs/README.md](../docs/README.md)
- [AGENTS.md](../../AGENTS.md)
- [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Documentation Touchpoints
Update these post-task:
- [docs/development-workflow.md](../docs/development-workflow.md) – Add mobile testing steps.
- [docs/architecture.md](../docs/architecture.md) – PWA diagram.
- [docs/testing-strategy.md](../docs/testing-strategy.md) – Device matrix.
- [docs/tooling.md](../docs/tooling.md) – Lighthouse/Expo CLI.

## Collaboration Checklist
1. Confirm mobile requirements (PWA vs. native) with maintainers.
2. Scan PRs: `git log --grep="mobile\|responsive"`.
3. Update docs: Link new mobile guide.
4. Log learnings: Mobile map perf bottlenecks.

## Hand-off Notes Template
```
**Outcomes**: [e.g., PWA live, 95% Lighthouse score].
**Risks**: [e.g., Map zoom jank on old Android].
**Follow-ups**: [e.g., Native prototype sprint; assign to Frontend].
**Artifacts**: [PR #XX, manifest.json].
```
