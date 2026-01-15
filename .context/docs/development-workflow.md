# Development Workflow

This document outlines the day-to-day engineering process for the **Geographic Impact Dashboard - Brazil** repository. This is a React-based web application built with Vite, featuring interactive maps, campaign data visualization, and dashboard components for analyzing geographic impacts in Brazil.

## Branching & Releases

We follow a **trunk-based development** model with short-lived feature branches to maintain velocity and minimize merge conflicts:

- **Main branch**: `main` – Always deployable. Production releases are tagged from here (e.g., `v1.2.3`).
- **Feature branches**: `feat/<feature-name>` (e.g., `feat/map-zoom-controls`) – Branched from `main`, merged via PR.
- **Hotfix branches**: `hotfix/<issue>` – For urgent production fixes.
- **Release cadence**: Weekly releases on Mondays, or ad-hoc for hotfixes. Use semantic versioning (SemVer) for tags.
  - Patch: Bug fixes.
  - Minor: New features.
  - Major: Breaking changes.

**Tagging conventions**:
```
git tag -a v1.2.3 -m "Release v1.2.3: Add campaign filtering"
git push origin v1.2.3
```

Automated releases via GitHub Actions deploy to Vercel/Netlify on new tags.

## Local Development

### Prerequisites
- Node.js >= 18
- npm >= 9 (or yarn/pnpm)

### Setup
1. Clone the repo:
   ```
   git clone https://github.com/<org>/geographic-impact-dashboard-brazil.git
   cd geographic-impact-dashboard-brazil
   ```
2. Install dependencies:
   ```
   npm ci  # Preferred for clean installs
   # or npm install
   ```

### Common Commands
| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (localhost:5173). Hot reload enabled. |
| `npm run build` | Build for production (`dist/` folder). |
| `npm run preview` | Preview production build locally. |
| `npm run lint` | Run ESLint (with `--fix` to auto-fix). |
| `npm run format` | Run Prettier. |
| `npm run test` | Run Vitest unit tests (with coverage). |
| `npm run test:ui` | Interactive test UI. |
| `npm run type-check` | Run TypeScript checker. |

**Folder structure**:
```
src/
├── components/     # Reusable UI (e.g., MapChart.tsx, GeographicDashboard.tsx)
├── types.ts        # Shared types (CampaignData, MapPosition)
├── App.tsx         # Root app
└── main.tsx        # Entry point
```

**Environment variables**:
Copy `.env.example` to `.env.local` and fill in API keys (e.g., Mapbox token for maps).

### Debugging Tips
- Use React DevTools and Vite's inspector.
- For map issues, check `components/MapChart.tsx` props: `MapChartProps` expects `CampaignData[]` and `MapPosition`.
- Mock data in `constants.ts` for offline dev.

## Code Review Expectations

All changes require a Pull Request (PR) to `main`. **No direct pushes to `main`.**

### PR Checklist
- [ ] Passes CI (lint, tests, types, build).
- [ ] Updated docs if public API changed (e.g., `CampaignData` in `types.ts`).
- [ ] Added/updated tests for new features.
- [ ] Cross-browser tested (Chrome, Firefox, Safari).
- [ ] Performance: No regressions in bundle size (check via `npm run build`).
- [ ] Accessibility: ARIA labels on maps/charts.

### Review Process
- **Self-review**: Run all checks locally.
- **Peer review**: At least 1 approval from a maintainer.
- **Agent collaboration**: Use AI agents for initial reviews. See [AGENTS.md](../../AGENTS.md) for prompts and tips.
- **Merge**: Squash & merge with descriptive title/body linking issues.

**Example PR Template**:
```
## Changes
- Added zoom controls to MapChart.

## Testing
- Unit tests: 100% coverage.
- Manual: Zoom works on mobile/desktop.

## Related
Closes #42
```

## Onboarding Tasks

Welcome! Start here to get up to speed:

1. **Run the app**: `npm run dev` – Explore the dashboard at http://localhost:5173.
2. **Good first issues**:
   - Label: `good first issue` – [GitHub Issues](https://github.com/<org>/geographic-impact-dashboard-brazil/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22).
   - Examples: Fix minor UI polish, add prop types.
3. **Runbooks**:
   - [Deployment Guide](./deployment.md)
   - [Mapbox Setup](https://docs.mapbox.com/) – Required for `MapPosition`.
4. **Key Files to Review**:
   - `types.ts`: Core types (`CampaignData`, `MapPosition`).
   - `components/GeographicDashboard.tsx`: Main entry.
   - `components/MapChart.tsx`: Core map logic.
5. **Slack/Discord**: #dev-channel for questions.
6. **Complete setup**: Fork → PR your first fix!

For questions, ping `@maintainers` or open a Discussion. Happy coding! 🇧🇷
