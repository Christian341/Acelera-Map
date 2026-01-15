# Testing Strategy

This document outlines the testing approach for the Geographic Impact Dashboard (Brazil), ensuring code quality, reliability, and maintainability across React components like `GeographicDashboard`, `MapChart`, `CampaignCard`, and `ImpactFooter`. The strategy emphasizes unit and integration testing with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) and Vitest (preferred for Vite-based projects), with plans for E2E tests.

## Test Types

### Unit Tests
- **Framework**: Vitest (`vitest`) with [Vite](https://vitejs.dev/guide/) integration and [jsdom](https://github.com/jsdom/jsdom) for DOM simulation.
- **Coverage**: Individual functions, hooks, utilities, and pure components.
- **File Naming**: Colocated with source files, e.g., `MapChart.test.tsx` alongside `MapChart.tsx`.
- **Examples**:
  - Test `CampaignData` type validation or utility functions from `types.ts`.
  - Mock map libraries (e.g., Leaflet) for `MapChart` rendering.

  ```tsx
  // components/MapChart.test.tsx
  import { render, screen } from '@testing-library/react';
  import { MapChart } from './MapChart';
  import { MapPosition } from '../../types';

  test('renders map with default position', () => {
    const defaultPos: MapPosition = { lat: -14.235, lng: -51.925 };
    render(<MapChart data={[]} position={defaultPos} />);
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });
  ```

### Integration Tests
- **Scenarios**: Component interactions, e.g., `GeographicDashboard` passing `CampaignData` to `MapChart` and `CampaignCard`.
- **Tooling**: `@testing-library/react` for user-centric testing; MSW (`msw`) for API mocking (e.g., campaign data fetches).
- **File Naming**: `*.integration.test.tsx`.
- **Dependencies**: Mock `App.tsx` context providers.

  ```tsx
  // components/GeographicDashboard.integration.test.tsx
  import { render } from '@testing-library/react';
  import { GeographicDashboard } from './GeographicDashboard';
  import { CampaignData } from '../../types';

  test('displays campaigns on dashboard', async () => {
    const mockData: CampaignData[] = [{ id: 1, name: 'Test Campaign', impacts: [] }];
    const { findByText } = render(<GeographicDashboard data={mockData} />);
    expect(await findByText('Test Campaign')).toBeInTheDocument();
  });
  ```

### End-to-End (E2E) Tests
- **Framework**: Playwright (planned; not implemented yet).
- **Scenarios**: Full user flows like dashboard loading, map panning, campaign filtering.
- **Environments**: Headless Chrome; CI/CD via GitHub Actions.
- **Harnesses**: Vite dev server; smoke tests on `index.tsx` entry.

## Running Tests

- **All Tests**: `npm run test` (runs Vitest in `src/` with `--reporter=verbose`).
- **Watch Mode** (local dev): `npm run test:watch` or `npm run test -- --watch`.
- **Coverage**: `npm run test:coverage` (generates HTML report in `coverage/`; targets 80%+).
- **Specific File/Group**: `npm run test components/MapChart.test.tsx`.
- **Update Snapshots**: `npm run test -- --update-snapshots`.

From `package.json` scripts:
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Quality Gates

- **Coverage Thresholds**:
  | Target | Minimum |
  |--------|---------|
  | Statements | 80% |
  | Branches | 75% |
  | Functions | 85% |
  | Lines | 80% |

- **Linting/Formatting**: Pre-commit hooks via Husky + lint-staged.
  - `npm run lint` (ESLint + Prettier).
  - `npm run format` (Prettier fix).
- **CI/CD**: GitHub Actions workflow enforces tests + coverage + linting before merge.
- **TypeScript**: Strict mode; `tsc --noEmit` in CI.

## Troubleshooting

- **Flaky Tests**:
  - Map rendering (`MapChart`): Mock Leaflet/Deck.gl async loads with `vi.mock('leaflet')`.
  - Async data fetches: Use `waitFor` from Testing Library.
- **Long-Running Tests**: Parallelize with `vitest --threads`; isolate heavy map tests.
- **Environment Quirks**:
  - jsdom lacks geospatial APIs: Polyfill `window.URL.createObjectURL`.
  - Coverage ignores `node_modules/` and `docs/`.
- **Common Fixes**:
  ```bash
  # Clear cache
  npm run test -- --clearCache
  # Debug with Vitest inspector
  npm run test -- --inspect-brk
  ```

For component-specific examples, see colocated `*.test.tsx` files. Update this doc as testing evolves (e.g., add E2E). Cross-reference: [types.ts](../types.ts), [components/GeographicDashboard.tsx](../components/GeographicDashboard.tsx).
