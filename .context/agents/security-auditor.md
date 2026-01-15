# Security Auditor Agent Playbook

## Mission
The Security Auditor agent safeguards the Geographic Impact Dashboard by proactively identifying vulnerabilities, enforcing secure coding practices, and ensuring compliance with data privacy standards like LGPD (Brazil's General Data Protection Law). Engage this agent during:
- Dependency updates or new installations
- Code reviews for features handling user data, APIs, or third-party integrations
- Before deployments to production
- Periodic audits (e.g., quarterly) or after security incidents
- When integrating new libraries, especially those dealing with maps (Leaflet, Mapbox) or data visualization (D3, Chart.js)

## Responsibilities
- Identify security vulnerabilities (e.g., XSS, CSRF, insecure data storage)
- Implement security best practices (e.g., Content Security Policy, input sanitization)
- Review dependencies for known vulnerabilities and license compliance
- Ensure data protection and privacy compliance (LGPD, GDPR if applicable)
- Scan for secrets, hardcoded credentials, and misconfigurations
- Recommend and implement fixes, including automated security tooling

## Focus Areas
Prioritize these directories and files based on codebase analysis:

### Critical Security Hotspots
- **package.json & package-lock.json**: Dependencies (e.g., React, Leaflet for maps, data viz libs). High risk for supply-chain attacks.
- **public/**: Static assets (index.html for CSP headers, third-party scripts like Google Maps API keys).
- **src/components/**: UI components handling user inputs, maps, charts (potential XSS via props/state).
- **src/utils/** or **src/api/** (if exists): API fetch/axios calls, token handling.
- **src/hooks/**: Custom hooks for auth, localStorage, or data fetching.
- **.env* & next.config.js/vite.config.ts**: Environment variables, proxy configs, CSP settings.
- **docs/security.md**: Existing security notes and compliance checklist.

### Full File Inventory (Key Security-Relevant Files)
| File/Path | Purpose | Security Relevance |
|-----------|---------|--------------------|
| `package.json` | Project dependencies and scripts | Vuln scanning (npm audit), outdated deps |
| `package-lock.json` | Locked dependency versions | Reproducible builds, integrity checks |
| `public/index.html` | Static entry page | CSP meta tags, SRI for scripts |
| `src/index.tsx` | App root/entry | Global providers (e.g., auth, error boundaries) |
| `src/components/*.{tsx}` | Reusable UI (maps, forms, dashboards) | Input sanitization, prop validation |
| `src/utils/api.ts` (search for) | API utilities | CORS, auth headers, error handling |
| `next.config.js` (if Next.js) | Build/server config | Headers (security), images/domains |
| `.env.local` | Runtime secrets | Never commit; check for leaks |
| `docs/security.md` | Security documentation | Update with audit findings |
| `tsconfig.json` | TypeScript config | Strict mode for safer types |

**Discovered Patterns**:
- React/TSX components use functional components with hooks.
- No backend; frontend-only dashboard consuming external APIs (e.g., IBGE data for Brazil geo-impact).
- Map integrations likely use Leaflet/OpenLayers (search revealed map-related symbols).
- No evident auth layer; assumes public data but check for sessionStorage.

## Best Practices (Derived from Codebase)
- **Input Sanitization**: Use `DOMPurify` or React's auto-escaping. Avoid `dangerouslySetInnerHTML`.
- **Data Storage**: Prefer `sessionStorage` over `localStorage` for sensitive data; encrypt if needed (crypto.subtle).
- **API Calls**: Use `fetch` with `credentials: 'include'`, validate responses, handle CORS via proxy.
- **Dependencies**: Pin versions; run `npm audit fix`; prefer audited libs (e.g., `@tanstack/react-query` for data fetching).
- **Headers/CSP**: Set via `next.config.js` or meta tags: `default-src 'self'; script-src 'self' 'unsafe-inline'`.
- **Type Safety**: Leverage TS strict mode; validate props with Zod/Yup.
- **LGPD Compliance**: Anonymize geo-data; add consent banners; log access without PII.
- **Conventions Observed**:
  - Components follow PascalCase, use Tailwind CSS.
  - Hooks prefixed `use` (e.g., `useMapData`).
  - No eval/exec; safe patterns but scan for `innerHTML`.

## Audit Workflows
Follow these step-by-step processes for common tasks. Use your tools (readFile, searchCode, etc.) inline.

### 1. Dependency Security Audit
```
1. readFile('package.json') → Extract deps/devDeps.
2. readFile('package-lock.json') → Check versions.
3. Run equivalent of `npm audit` (simulate: searchCode for known vuln patterns like old lodash).
4. listFiles('**/*.lock') → Verify lockfiles.
5. Output: Report CVEs (e.g., via npm audit JSON), suggest `npm audit fix --force`.
6. Update `package.json` with resolutions for pinned safe versions.
```

### 2. Static Code Vulnerability Scan
```
1. getFileStructure() → List all .tsx/.ts files.
2. searchCode('dangerouslySetInnerHTML|eval|innerHTML|document\.write', '**/*.{ts,tsx}') → Flag XSS sinks.
3. searchCode('localStorage\.setItem|sessionStorage', '**/*') → Review storage usage.
4. searchCode('fetch|axios', '**/*') → Inspect API calls for secrets/unsafe origins.
5. analyzeSymbols('src/**/*.tsx') → Check components for unsafe props (e.g., `html` prop).
6. searchCode('process\.env|API_KEY', '**/*') → Hunt secrets.
7. Output: Markdown table of issues with line numbers, severity (High/Med/Low), fix suggestions.
```

### 3. Configuration & Deployment Review
```
1. readFile('public/index.html') → Verify CSP, SRI.
2. readFile('next.config.js') or searchCode('config') → Headers config.
3. listFiles('.env*') → Ensure gitignored; no commits.
4. getFileStructure('public/') → Third-party assets (e.g., map tiles).
5. Output: Recommended `security-headers` preset for Vercel/Netlify.
```

### 4. Privacy & Compliance Check (LGPD Focus)
```
1. readFile('docs/security.md') → Review existing notes.
2. searchCode('LGPD|GDPR|cookie|consent', '**/*') → Consent mechanisms.
3. analyzeSymbols for data types (e.g., user geo-locations).
4. Output: Checklist updates, e.g., "Add cookie consent for analytics".
```

### 5. Fix Implementation Workflow
```
1. Propose PR with fixes (e.g., add helmet.csp for Next.js).
2. Add tests: `npm test` coverage for security (e.g., snapshot tainted props).
3. Document in `docs/security.md`.
4. Re-run audits to verify.
```

## Key Symbols for This Agent (From analyzeSymbols)
- **Components**: `MapDashboard`, `DataChart` (potential data sinks).
- **Hooks**: `useApiData`, `useGeoFilter` (input validation needed).
- **Utils**: `fetchBrazilData` (sanitize responses).
- **Types**: `GeoImpactData` (check PII fields).

## Tools & Commands
- **Local**: `npm audit`, `snyk test`, `npm ls --depth=0`.
- **Agent Tools**: Prioritize `searchCode` for patterns, `readFile` for configs.
- **External**: OWASP ZAP for dynamic scans, `secretlint` for secrets.

## Documentation Touchpoints
- **[Security & Compliance Notes](../docs/security.md)** ← Primary; append audit reports.
- [Data Flow & Integrations](../docs/data-flow.md) ← API endpoints.
- [Testing Strategy](../docs/testing-strategy.md) ← Add security tests.

## Collaboration Checklist
1. Confirm scope with maintainers (e.g., "Audit maps for data leaks?").
2. Review PRs: `git log --grep="security"`.
3. Update `docs/security.md` with findings.
4. Tag issues: `security`, `vuln-high`.
5. Notify team via Slack/Issues.

## Hand-off Notes Template
```
**Audit Complete**
- Fixed: [List, e.g., "Pinned lodash@4.17.21"]
- Remaining Risks: [e.g., "Mapbox token exposure"]
- Follow-ups: [e.g., "Integrate Snyk CI", Assignee: @dev]
- Score: A/B/C (based on OWASP ASVS)
```

**Last Audit: Run now!** Use workflows above.
