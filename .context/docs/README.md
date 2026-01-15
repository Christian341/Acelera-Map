# Geographic Impact Dashboard - Brazil

## 🚀 Project Overview

The **Geographic Impact Dashboard** is a React-based web application designed to visualize campaign performance across geographic regions in Brazil. It features interactive maps, campaign cards, and impact metrics, enabling stakeholders to analyze reach, engagement, and outcomes by location (e.g., states, cities).

Key features:
- Interactive map with zoom/pan controls and region highlighting
- Campaign data visualization (e.g., impressions, clicks, conversions)
- Responsive dashboard layout for desktop and mobile
- TypeScript for type safety and maintainability

Built with:
- **Vite** (fast dev server & bundling)
- **React 18** + **TypeScript**
- **Custom components** (no heavy UI libraries for lightweight bundle)

Live demo: [TBD - Deploy via Vercel/Netlify](https://github.com/your-org/geographic-impact-dashboard-brazil)

## 📋 Quick Start

### Prerequisites
- Node.js >= 18
- Yarn or npm

### Setup & Run
```bash
# Clone & install
git clone <repo-url>
cd geographic-impact-dashboard-brazil
npm install  # or yarn install

# Development server (localhost:5173)
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint & format
npm run lint
npm run format
```

**Hot reload** enabled. Edits to components auto-refresh.

## 🏗️ Project Structure

```
.
├── public/              # Static assets (images, favicon)
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── GeographicDashboard.tsx  # Main dashboard container
│   │   ├── MapChart.tsx             # Interactive map (core viz)
│   │   ├── CampaignCard.tsx         # Campaign metrics cards
│   │   └── ImpactFooter.tsx         # Summary footer
│   ├── App.tsx         # Root app (imports dashboard)
│   ├── constants.ts    # App-wide constants (e.g., map bounds, colors)
│   ├── index.tsx       # Entry point (ReactDOM.render)
│   └── types.ts        # Shared types (CampaignData, MapPosition)
├── docs/               # Developer documentation
├── package.json        # Dependencies & scripts
├── tsconfig.json       # TypeScript config
├── vite.config.ts      # Vite config (plugins, aliases)
└── README.md           # This file (root overview)
```

### Core Components & Props
| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `GeographicDashboard` | Orchestrates map, cards, & layout | `DashboardProps` (campaigns: `CampaignData[]`) |
| `MapChart` | Renders Brazil map with data overlays | `MapChartProps` (data: `CampaignData[]`, position: `MapPosition`) |
| `CampaignCard` | Displays single campaign metrics | `CampaignCardProps` (data: `CampaignData`) |
| `ImpactFooter` | Aggregated totals & CTA | `ImpactFooterProps` (totals: object) |

**Public Types** (from `types.ts`):
```typescript
export interface CampaignData {
  id: string;
  name: string;
  region: string;  // e.g., "São Paulo"
  impressions: number;
  clicks: number;
  conversions: number;
  // ...more fields
}

export interface MapPosition {
  lat: number;
  lng: number;
  zoom: number;
}
```

## 🔧 Development Workflow
See [docs/development-workflow.md](./development-workflow.md) for:
- Branching (`main`, `feature/*`, `release/*`)
- Commit conventions (Conventional Commits)
- PR process & CI/CD (GitHub Actions)

## 🧪 Testing
- Unit tests: React Testing Library + Vitest
- No E2E (lightweight; add Playwright if needed)
```bash
npm test -- --coverage  # Run with coverage
```

## 📊 Data Flow
1. **Mock Data**: `CampaignData[]` loaded in `App.tsx` (replace with API in prod)
2. **Map Rendering**: Passed to `MapChart` → SVG/Leaflet-like rendering with Brazil geo-data
3. **Interactions**: Click regions → Filter cards → Update footer totals
4. **Props Drilling**: Minimal; consider Context API for scaling

Diagram: See [docs/data-flow.md](./data-flow.md)

## 🔗 Dependencies & Imports
- **Most Imported**: `App.tsx` (entry), `GeographicDashboard.tsx` (5+ imports)
- **External**: React, TypeScript, Vite plugins
- No heavy deps (e.g., no Chart.js; custom map for perf)

Run `npm ls` for full tree.

## 🛠️ Customization
- **Map Data**: Edit geoJSON in `constants.ts` or load dynamically
- **Themes**: CSS variables in `index.css`
- **API Integration**: Swap mock data in `App.tsx`:
  ```tsx
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  useEffect(() => {
    fetch('/api/campaigns').then(res => res.json()).then(setCampaigns);
  }, []);
  ```

## 📚 Full Documentation
| Guide | Description |
|-------|-------------|
| [Project Overview](./project-overview.md) | High-level goals, roadmap, stakeholders |
| [Architecture](./architecture.md) | Components, data flow, scalability notes |
| [Development Workflow](./development-workflow.md) | Git, CI, releases |
| [Testing Strategy](./testing-strategy.md) | Unit/E2E coverage, best practices |
| [Glossary](./glossary.md) | `CampaignData`, regions, metrics defs |
| [Data Flow](./data-flow.md) | Diagrams & integration points |
| [Security](./security.md) | Auth, data privacy (GDPR/LGPD) |
| [Tooling](./tooling.md) | VS Code extensions, scripts, debugging |

## 🤝 Contributing
1. Fork & branch: `git checkout -b feature/map-zoom`
2. Commit: `git commit -m "feat(map): add zoom controls"`
3. PR to `main` with tests

Issues: [GitHub Issues](https://github.com/your-org/geographic-impact-dashboard-brazil/issues)

## 📄 License
MIT - See [LICENSE](LICENSE) (add if missing).

---

*Last updated: YYYY-MM-DD* | *Questions? @maintainers*
