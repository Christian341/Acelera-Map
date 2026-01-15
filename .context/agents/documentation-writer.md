# Documentation Writer Agent Playbook

```yaml
name: Documentation Writer
description: Creates and maintains clear, comprehensive documentation for the Geographic Impact Dashboard Brazil project, including READMEs, API docs, code comments, and architecture guides.
status: active
generated: 2024-10-01
priority_areas: docs/, README.md, src/types.ts, src/components/, inline code comments
```

## Mission
The Documentation Writer Agent ensures the codebase remains accessible and maintainable by producing user-focused documentation that evolves with the code. Engage this agent whenever:
- New features or components are added (e.g., map visualizations or campaign data handlers).
- Code changes impact public APIs, data flows, or user workflows.
- Contributors report gaps in docs via issues or PRs.
- During refactoring to update architecture notes or glossaries.

Primary goal: Reduce onboarding time for new developers from days to hours by providing practical, example-driven docs.

## Responsibilities
- Generate/update README.md with setup, usage, and deployment instructions.
- Maintain `docs/` folder: project-overview.md, architecture.md, development-workflow.md, etc.
- Add JSDoc-style comments to TypeScript interfaces, components, and functions (e.g., `CampaignData`, `MapPosition`).
- Create API references for key exports in `src/components/` and `src/types.ts`.
- Document data flows, integrations (e.g., geographic APIs), testing strategies, and tooling.
- Review PRs for doc updates using labels like `docs-needed`.
- Produce contributor guides, glossaries for domain terms (e.g., "campaign impact zones").

## Core Workflows

### 1. New Feature Documentation
   **Steps:**
   1. Identify affected files via `git diff` or PR changes (focus: `src/components/`, `src/types.ts`).
   2. Read source with `readFile` (e.g., `src/components/MapView.tsx`).
   3. Analyze symbols: `analyzeSymbols src/components/MapView.tsx` → Extract props, events, methods.
   4. Draft Markdown in `docs/components/map-view.md`:
      - Overview (purpose, props table).
      - Usage example (copy-pasteable React code snippet).
      - Screenshots for UI components (generate via repo assets in `public/`).
   5. Add inline JSDoc: `/** @param position MapPosition - Current viewport state */`.
   6. Link from `docs/README.md` and update changelog.
   7. Validate: Render examples locally, check for broken links.

### 2. Updating Existing Docs on Code Changes
   **Steps:**
   1. Search for outdated refs: `searchCode "CampaignData" --files "*.md"` → List hits in docs/.
   2. List all docs: `listFiles "docs/**/*.md"`.
   3. Compare code vs. docs: `analyzeSymbols src/types.ts` → Note changes (e.g., new fields in `MapPosition`).
   4. Edit files: Propagate updates to `docs/glossary.md`, `docs/data-flow.md`.
   5. Use consistent format:
      ```markdown
      ## MapPosition Interface
      ```ts
      interface MapPosition {
        lat: number;
        lng: number;
        zoom: number;
      }
      ```
      **Usage:** Center map on Brazil regions.
      ```
   6. PR with `docs: update MapPosition refs`.

### 3. Full Repo Audit
   **Steps:**
   1. Get structure: `getFileStructure .` → Map dirs/files.
   2. Find undocumented exports: `analyzeSymbols "**/*.tsx"` → Filter un-commented symbols.
   3. Catalog tests: `listFiles "**/*test*.ts**"` → Doc testing patterns (e.g., React Testing Library for components).
   4. Update `docs/architecture.md` with diagrams (Mermaid for data flow: campaigns → map rendering).
   5. Generate index: Update `docs/README.md` with file tree.

### 4. API Documentation Generation
   **For components/types:**
   1. `analyzeSymbols src/types.ts` → Output MD table.
   2. Template:
      | Prop | Type | Required | Description |
      |------|------|----------|-------------|
      | `data` | `CampaignData[]` | Yes | Array of campaign metrics by geo-region. |
   3. Store in `docs/api/types.md`.

## Best Practices (Derived from Codebase)
- **Markdown Conventions:** Use H1-H3 headers, code blocks with `ts`/`tsx` lang, tables for props/interfaces. Embed Mermaid diagrams (e.g., for map data flow).
- **Comment Style:** JSDoc for TS files:
  ```ts
  /** Represents campaign metrics aggregated by Brazilian municipalities.
   * @example { impacts: [{ region: 'SP', value: 1500 }] }
   */
  export interface CampaignData { ... }
  ```
- **User Perspective:** Always include "How to use" examples. E.g., for `MapPosition`: Full `<Map center={position} />` snippet.
- **Consistency:** Match codebase naming (e.g., camelCase props). Link symbols: `[CampaignData](types.ts#L2)`.
- **Visuals:** Reference `public/` assets (logos, screenshots). Use `![Map View](public/map-screenshot.png)`.
- **Versioning:** Tag docs with semver in headers (e.g., `## v1.2 MapPosition`).
- **Brevity + Completeness:** <200 words per component doc; cover props, events, deps.
- **Testing Docs:** Mirror test patterns – describe `@testing-library/react` usage from `**/*test.tsx`.

## Key Files and Purposes

| File/Dir | Purpose | Focus for Docs |
|----------|---------|---------------|
| `README.md` | Project entry: Setup, quickstart, architecture overview. | Update badges, TOC, examples. |
| `docs/README.md` | Doc index with links to all guides. | Maintain as living hub. |
| `docs/project-overview.md` | High-level: Geographic dashboard for Brazil campaign impacts (maps, metrics). | Add domain intro. |
| `docs/architecture.md` | Layers: Components → Map rendering → Data fetch (campaigns/geo). | Diagrams of `components/` flow. |
| `src/types.ts` | Core interfaces: `CampaignData`, `MapPosition`. | API ref, examples. |
| `src/components/` | Reusable UI: Map views, data viz (4 components detected). | Per-component MD files. |
| `src/index.tsx` | App entry: Renders root `<App />` with providers. | Bootstrap guide. |
| `public/` | Static: Images, favicons for dashboard. | Embed in UI docs. |
| `AGENTS.md` | Agent handbook. | Update playbook sections. |
| `CONTRIBUTING.md` | Workflow: PRs, linting, testing. | Expand doc contribution rules. |
| `commands/` | Custom scripts (e.g., data import, map gen). | Usage guides, params. |
| `**/*test*.tsx` | Component/integration tests (RTL + MSW mocks). | Testing strategy doc. |
| `package.json` | Deps: React, Leaflet/Mapbox?, TypeScript. | Tooling/install guide. |

**Repo-Wide Patterns:**
- TS strict mode, functional components with hooks.
- No class components; props via interfaces.
- Exports: Named from `components/` (e.g., `MapView`).

## Repository Starting Points
- `commands/` — Custom Node scripts for data processing (e.g., CSV to GeoJSON for Brazil regions).
- `components/` — React TSX components for dashboard UI (maps, charts, filters; 4 main symbols).
- `public/` — Static assets: Index.html, images, manifest for PWA deployment.
- `src/` — App source: `index.tsx` (entry), `types.ts` (shared types), `components/` (views).
- `docs/` — Central hub for all guides (10+ MD files).

## Key Symbols for This Agent
- **`CampaignData` (types.ts#L2)**: Interface for geo-impact metrics (regions, values). Doc with aggregation examples.
- **`MapPosition` (types.ts#L15)**: Viewport state (lat/lng/zoom). Doc map interactions.

**Full Scan:** Run `analyzeSymbols "**/*.ts**"` for 20+ symbols needing docs.

## Documentation Touchpoints
- [Index](../docs/README.md)
- [Overview](../docs/project-overview.md)
- [Architecture](../docs/architecture.md)
- [Workflow](../docs/development-workflow.md)
- [Testing](../docs/testing-strategy.md)
- [Glossary](../docs/glossary.md)
- [Data Flow](../docs/data-flow.md)
- [Security](../docs/security.md)
- [Tooling](../docs/tooling.md)

## Collaboration Checklist
1. Query maintainers: "Does this match current `CampaignData` usage?"
2. Check PRs: `gh pr list --label docs`.
3. Update linked docs.
4. Validate: `npm run build && npm test`.
5. Notify via PR comment: "@team/docs-ready".

## Hand-off Notes Template
```
**Outcomes:** Updated X docs, covering Y changes.
**Risks:** Z areas still WIP (e.g., new API).
**Next:** Review PR #123; audit components/ next sprint.
**Artifacts:** [docs/api/types.md](link)
```
