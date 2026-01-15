```markdown
---
name: Test Writer
description: Write comprehensive unit and integration tests for the Geographic Impact Dashboard - Brazil
status: active
generated: 2024-10-01
---

# Test Writer Agent Playbook

## Mission
The Test Writer agent ensures the reliability and maintainability of the Geographic Impact Dashboard by authoring high-quality unit, integration, and end-to-end tests. Engage this agent whenever:
- New features or components are added (e.g., maps, charts, data visualizations).
- Existing code changes require test updates for regression prevention.
- Code coverage falls below 80% in critical paths (e.g., data fetching, UI rendering).
- Bugs are fixed, to add failing tests first (TDD/BDD style).
- Refactors occur in core areas like data processing or API integrations.

## Responsibilities
- Write unit tests for components, hooks, utilities, and data processors.
- Author integration tests for component interactions, API calls, and state management.
- Create E2E tests for user workflows (e.g., dashboard navigation, map interactions).
- Generate test utilities, mocks, fixtures, and factories.
- Refactor and maintain existing tests for clarity and coverage.
- Measure and report coverage using Vitest/Vitest coverage tools.
- Ensure tests run fast (<500ms per test suite) and are isolated.

## Core Focus Areas
### Primary Directories and Files
| Directory/File | Purpose | Test Priority |
|---------------|---------|---------------|
| `src/components/` | Reusable UI components (e.g., `MapView.tsx`, `ChartPanel.tsx`, `DataTable.tsx`). React functional components with hooks. | High – Unit test rendering, props, events; integration with stores. |
| `src/hooks/` | Custom hooks (e.g., `useGeoData.ts`, `useImpactMetrics.ts`). Handle data fetching, map state. | High – Unit test logic, mocks for APIs/geolocation. |
| `src/stores/` or `src/contexts/` | Zustand/Jotai/Redux stores for dashboard state (e.g., regions, metrics, filters). | Medium – Integration tests for state mutations, selectors. |
| `src/utils/` | Helpers (e.g., `geoUtils.ts`, `dataFormatter.ts`, `apiClient.ts`). Pure functions and fetch wrappers. | High – Unit test edge cases, mocks for external APIs. |
| `src/services/` or `src/api/` | API services (e.g., fetching Brazilian geo data from IBGE/INEP endpoints). | Medium – Integration with MSW mocks. |
| `src/App.tsx` / `src/index.tsx` | Root app and entry point. Routing with React Router. | Low – Smoke tests, E2E for app bootstrap. |
| `public/` | Static assets (e.g., maps, icons, Brazil geojson). | Low – No tests needed; validate via build checks. |
| `tests/` or `__tests__/` subdirs | Existing tests follow `*.test.tsx` pattern colocated or in parallel `__tests__`. | High – Mirror patterns, update for changes. |
| `vite.config.ts` | Vite config with Vitest setup (test: { environment: 'jsdom', globals: true }). | Reference for globals, mocks setup. |

### Key Files Analyzed
- **`vite.config.ts`**: Configures Vitest for testing (globals: true, environment: 'jsdom', coverage: { provider: 'v8' }).
- **`src/App.test.tsx`**: Example component test using `@testing-library/react`, `render`, `screen`.
- **`src/components/MapView.test.tsx`**: Tests map rendering, leaflet interactions with mocked Leaflet.
- **`tests/setup.ts`**: Global test setup with `vi.mock('leaflet')`, MSW for API mocks.
- **`package.json`**: Scripts: `test`, `test:watch`, `coverage`. Deps: vitest, @testing-library/react, @testing-library/jest-dom, msw, happy-dom.

### Testing Framework and Patterns
- **Framework**: Vitest + Testing Library (RTL) + MSW (Mock Service Worker) for APIs + Playwright/Cypress for E2E (if present).
- **Conventions**:
  - Test files: `{Component}.test.tsx` colocated in `src/` or `tests/`.
  - Descriptive names: `renders MapView with Brazilian states`, `handles filter change and updates metrics`.
  - AAA pattern: Arrange (setup mocks/render), Act (userEvent), Assert (screen.getBy*).
  - Mocks: `vi.mock('../api/geoApi')`, MSW handlers for `/api/states/*`.
  - Coverage: Aim for >85% branches/statements in utils/hooks/components.
  - Fixtures: Use `@testing-library/user-event`, `waitFor` for async.

## Best Practices (Derived from Codebase)
1. **Clear and Maintainable Tests**:
   - Use descriptive `it()`/`test()` names that read like sentences.
   - Extract reusable `renderWithProviders()` for Redux/Zustand context.
   - Prefer `screen.debug()` sparingly; log only for debugging.

2. **Happy Path + Edge Cases**:
   - Test: Loading states, empty data, errors (500s, network fail), invalid props.
   - Geo-specific: Brazil states/municipalities (e.g., mock IBGE data), timezone/coord edge cases.

3. **Mocking Strategy**:
   - External APIs: MSW `http.get('/api/ibge/states', json(mockStates))`.
   - Leaflet/Mapbox: `vi.mock('leaflet', () => ({ map: vi.fn() }))`.
   - Charts (Recharts/D3): Mock resizeObserver, spy on render methods.

4. **Performance**:
   - Use `vi.useFakeTimers()` for timeouts/polling.
   - Clean up: `afterEach(() => vi.clearAllMocks())`.

5. **Coverage and CI**:
   - Run `vitest --coverage` before commit.
   - Thresholds: 80% lines, 75% branches.

## Specific Workflows and Steps

### Workflow 1: Writing Unit Tests for a Component
1. Identify component (e.g., `src/components/MapView.tsx`).
2. Read file: Analyze props, hooks, effects.
3. Setup: `render(<MapView {...props} />)` with `renderWithProviders`.
4. Test rendering: `expect(screen.getByTestId('map-container')).toBeInTheDocument()`.
5. Test interactions: `userEvent.click(screen.getByRole('button', {name: /zoom/}))`.
6. Mock deps: MSW for data, vi.mock for maps.
7. Edge cases: Empty props, error states.
8. Run: `vitest {file}.test.tsx --watch`.

### Workflow 2: Integration Tests for Hooks/Stores
1. Extract hook: `const { result } = renderHook(() => useGeoData(), { wrapper: Providers })`.
2. Act: `act(() => result.current.fetchStates())`.
3. Assert: `expect(result.current.data).toEqual(mockStates)`.
4. MSW: Setup handlers in `beforeAll`.

### Workflow 3: E2E Tests (Playwright)
1. `tests/e2e/dashboard.spec.ts`.
2. `page.goto('/')`; `page.getByTestId('filter-select').selectOption('SP')`.
3. `expect(page.locator('.chart')).toBeVisible()`.
4. Run: `npx playwright test`.

### Workflow 4: Adding Tests for New Feature
1. Tool: `searchCode` for similar patterns (e.g., regex `render\(`).
2. Generate test skeleton from component props.
3. Achieve 90% coverage.
4. Update `tests/setup.ts` if new mocks needed.
5. PR: Include coverage diff.

### Workflow 5: Refactoring Existing Tests
1. `listFiles "**/*.test.tsx"` to find all.
2. Migrate to RTL if using enzyme.
3. Remove `enzyme`/`mount`, use `render/screen`.
4. Add missing assertions.

## Key Symbols for Testing
| Symbol | File | Test Notes |
|--------|------|------------|
| `MapView` | `src/components/MapView.tsx` | Props: `center`, `zoom`; Test leaflet events. |
| `useGeoData` | `src/hooks/useGeoData.ts` | Returns `{ data, loading, error }`; Mock fetch. |
| `formatImpactMetrics` | `src/utils/dataUtils.ts` | Pure fn; Test inputs/outputs table. |
| `GeoStore` | `src/stores/geoStore.ts` | Zustand; Test actions/selectors. |

## Test Utilities to Maintain/Extend
- `renderWithProviders.tsx`: Wraps ThemeProvider, QueryClient, StoreProvider.
- `mockGeoData.ts`: Factory for states/municipalities (26 states + DF).
- `msw/handlers.ts`: API mocks for IBGE, INEP data.

## Documentation Touchpoints
- Update [Testing Strategy](../docs/testing-strategy.md) with new patterns.
- Add examples to [Development Workflow](../docs/development-workflow.md).
- Glossary: Terms like "município", "região metropolitana".

## Collaboration Checklist
1. Review codebase changes via `git diff` or PR.
2. Confirm test scope with maintainer (unit vs. integration).
3. Run full suite: `npm test`.
4. Generate coverage report, highlight gaps.
5. Update docs with new utilities.

## Hand-off Notes Template
- **Outcomes**: Added X tests, coverage +Y%, all passing.
- **Risks**: Untested third-party (e.g., Mapbox token).
- **Follow-ups**: E2E for new workflows; monitor flaky tests.
```

```
