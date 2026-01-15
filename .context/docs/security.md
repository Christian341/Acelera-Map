# Security & Compliance Notes

**Status**: Filled  
**Last Updated**: 2023-10-01  
**Scope**: This documentation covers the Geographic Impact Dashboard for Brazil, a client-side React application focused on visualizing `CampaignData` and `MapPosition` on interactive maps. No backend services or server-side rendering are present in the codebase.

The project is a static frontend dashboard with no authentication, user sessions, or persistent data storage. Security focuses on client-side best practices, dependency management, and deployment configurations. Data is sourced externally (e.g., public APIs or static files) and visualized without modification.

## Authentication & Authorization

- **Identity Providers**: None implemented. The dashboard is public-facing and does not require user login.
- **Token Formats**: No tokens used (e.g., JWT, OAuth). All interactions are client-side.
- **Session Strategies**: Stateless. No cookies, localStorage, or sessionStorage for auth purposes.
- **Role/Permission Models**: N/A. All users have read-only access to visualizations.
- **Recommendations**:
  - If integrating with a backend API, use OAuth 2.0 with PKCE for SPA flows.
  - Example (future integration with Auth0):
    ```tsx
    import { Auth0Provider } from '@auth0/auth0-react';
    <Auth0Provider domain="dev-xxx.us.auth0.com" clientId="xxx" redirectUri={window.location.origin}>
      <GeographicDashboard />
    </Auth0Provider>
    ```

**Cross-reference**: No auth-related symbols in `types.ts`, `App.tsx`, or components (`GeographicDashboard.tsx`, `MapChart.tsx`).

## Secrets & Sensitive Data

- **Storage Locations**: No secrets in the codebase. Environment variables (if any) are managed via deployment platforms (e.g., Vercel, Netlify).
- **Rotation Cadence**: N/A.
- **Encryption Practices**: 
  - Client-side data is not encrypted at rest.
  - Use HTTPS for deployment to encrypt in-transit data.
- **Data Classifications**:
  | Data Type       | Classification | Handling Notes |
  |-----------------|----------------|---------------|
  | `CampaignData` | Public        | Aggregated geographic impact metrics; no PII. |
  | `MapPosition`  | Public        | Lat/lng coordinates for Brazil regions. |
  | API Keys (if used) | Restricted | Store in `.env` (gitignored); never commit. |

- **Scanning Results**: No API keys, passwords, or secrets found via code search (e.g., regex for `key=`, `password`, `secret`).
- **Best Practices**:
  - Add `.env.example` for devs.
  - Use `dotenv` for local dev: `npm i dotenv`.
  - Scan with `git-secrets` or `truffleHog`.

**Cross-reference**: Check `package.json` for deps like `axios` (for API calls); none expose secrets.

## Compliance & Policies

- **Applicable Standards**:
  | Standard | Relevance | Evidence |
  |----------|-----------|----------|
  | LGPD (Brazil's GDPR) | Geographic data on Brazil; ensure no PII processing. | Client-side only; no data collection. |
  | GDPR    | If EU users view dashboard. | No tracking/cookies by default. |
  | SOC 2   | N/A (no services). | - |
  | Accessibility (WCAG 2.1) | Map charts (`MapChart.tsx`). | Add ARIA labels to `<MapPosition>` overlays. |

- **Internal Policies**: Follow React best practices (e.g., no `dangerouslySetInnerHTML` without sanitization).
- **Evidence Requirements**:
  - Dependency audits: Run `npm audit` weekly.
  - Bundle analysis: No vulnerable deps in key files (`App.tsx`, `components/GeographicDashboard.tsx`).
  - Add to CI: `npm audit --audit-level high`.

**Cross-reference**: `constants.ts` for any hardcoded data (public only).

## Incident Response

- **On-Call Contacts**: Project lead (TBD); use GitHub Issues for reports.
- **Escalation Steps**:
  1. Report via GitHub Issue (label: `security`).
  2. Triage: Reproduce in dev env.
  3. Patch: Hotfix branch, test in `components/*` usage.
  4. Disclose: Dependabot alerts for deps.
- **Tooling**:
  | Tool          | Purpose                  |
  |---------------|--------------------------|
  | npm audit    | Dependency vulnerabilities |
  | Snyk          | SCA scans                |
  | Lighthouse   | Client-side perf/security |
  | Sentry       | Error monitoring (future)|

- **Detection**: Monitor console errors in prod; add error boundaries in `App.tsx`.
  ```tsx
  // Example ErrorBoundary in App.tsx
  class ErrorBoundary extends React.Component {
    componentDidCatch(error: Error) {
      // Log to Sentry
      console.error('Security incident:', error);
    }
  }
  ```

**Related Files**: 
- [types.ts](types.ts) – Core data models.
- [components/GeographicDashboard.tsx](components/GeographicDashboard.tsx) – Main entry point.
- [package.json](package.json) – Dependencies for audit.

For deployment, enforce CSP headers and HTTPS. Run `npm audit` before releases.
