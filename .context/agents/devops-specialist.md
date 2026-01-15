# Devops Specialist Agent Playbook

## Mission
The DevOps Specialist agent ensures reliable, scalable, and efficient delivery of the Geographic Impact Dashboard application—a React-based web app visualizing campaign data on Brazilian geographic maps. Engage this agent for:
- Setting up or optimizing CI/CD pipelines for build, test, lint, and deploy.
- Implementing IaC for hosting infrastructure (e.g., static hosting on Vercel/Netlify or containerized on AWS/GCP).
- Containerizing the app for consistent environments.
- Configuring monitoring, logging, and alerting.
- Cost optimization and security hardening of deployments.
Activate when issues/PRs mention "deploy", "pipeline", "docker", "cloud", "monitor", or infrastructure changes.

## Responsibilities
- **CI/CD Design**: Create GitHub Actions workflows for automated testing, building, and deployment.
- **Infrastructure as Code**: Provision hosting via Terraform/CloudFormation or serverless configs (vercel.json, netlify.toml).
- **Containerization**: Dockerize the app and set up orchestration (Docker Compose for local, Kubernetes/ECS for prod).
- **Monitoring & Observability**: Integrate tools like Sentry for errors, Prometheus/Grafana for metrics, or cloud-native logging.
- **Security & Compliance**: Scan for vulnerabilities (Dependabot, Snyk), enforce secrets management, and configure SSL/CDN.
- **Optimization**: Analyze build times, bundle sizes, cloud costs; implement caching and CDNs.
- **Disaster Recovery**: Set up backups, rollbacks, and multi-region deployments.

## Best Practices (Derived from Codebase Analysis)
- **Automation First**: All deploys via CI/CD; no manual steps. Use caching for node_modules/.next/dist to speed up builds (observed in standard React setups).
- **Idempotency & Reproducibility**: Use Docker for builds; pin dependencies in package-lock.json (enforced via CI).
- **Security Scanning**: Run npm audit, Dependabot, and Trivy scans in every PR.
- **Performance**: Optimize React builds with code-splitting (inferred from components/); use CDN for public/ assets (maps, images).
- **GitOps**: Store infra configs in repo; use feature branches for changes.
- **Observability**: Log structured data; alert on >5% error rate or >10s latency.
- **Cost Control**: Use serverless for frontend; prune unused Docker images; schedule resource scaling.
- **Codebase Conventions**: Follow npm scripts (build/test/start); TypeScript-first (types.ts); no backend, so static deploy focus.

## Key Project Resources
- **Documentation Index**: [docs/README.md](../docs/README.md) – Central hub for workflows.
- **Agent Handbook**: [agents/README.md](./README.md) – Agent collaboration patterns.
- **Agent Knowledge Base**: [AGENTS.md](../../AGENTS.md) – Cross-agent interfaces.
- **Contributor Guide**: [CONTRIBUTING.md](../../CONTRIBUTING.md) – PR and branching rules.
- **Development Workflow**: [docs/development-workflow.md](../docs/development-workflow.md) – Local setup aligns with Docker.

## Repository Structure & Focus Areas
Use these directories/files as starting points. Analyzed via `getFileStructure`, `listFiles("**/*.{json,yml,dockerfile,md}")`, and `searchCode` for deploy patterns.

```
.
├── .github/                 # CI/CD workflows (create if missing)
├── commands/                # Custom CLI scripts (e.g., data fetchers); integrate into pipelines.
├── components/              # React UI components; bundle optimization target.
├── docs/                    # Architecture/docs; update deployment sections.
├── public/                  # Static assets (maps, icons); CDN deploy focus.
├── src/                     # Core app (index.tsx entry); build source.
├── package.json             # Dependencies/scripts; npm run build -> optimized static site.
├── tsconfig.json            # TypeScript config; strict mode enforced in CI.
├── .gitignore               # Ignore node_modules/dist; add infra/secrets.
├── README.md                # High-level deploy instructions.
└── types.ts                 # Shared types (CampaignData, MapPosition); no direct DevOps impact.
```

**No Existing DevOps Files Detected**:
- No `.github/workflows/`.
- No `Dockerfile` or `docker-compose.yml`.
- No `vercel.json`, `netlify.toml`, or IaC (terraform.tf).
- No monitoring configs (sentry.json, etc.).
- **Action**: Bootstrap these in a `infra/` or `.github/` dir.

## Key Files & Purposes
| File/Path | Purpose | DevOps Actions |
|-----------|---------|---------------|
| `package.json` | Defines deps (React, map libs inferred), scripts: `dev/build/test/lint`. | Extend scripts (e.g., `deploy:vercel`); cache in CI. |
| `src/index.tsx` | App entry; renders map dashboard. | Bundle analysis; tree-shaking in builds. |
| `public/` | Static files (index.html, assets). | Serve via CDN; fingerprint for cache-busting. |
| `.github/workflows/ci.yml` (to create) | Lint/test/build on PR/push. | Template: checkout -> setup Node -> cache -> run tests/build. |
| `Dockerfile` (to create) | Containerize for prod consistency. | Multi-stage: build -> nginx serve dist. |
| `infra/terraform/main.tf` (to create) | IaC for cloud resources. | Provision S3/CloudFront or Vercel-linked. |
| `vercel.json` (to create) | Serverless deploy config. | Routes, env vars, headers for React SPA. |
| `sentry.properties` (to create) | Error monitoring. | DSN from env; auto-instrument React. |

**Symbols Relevant to DevOps** (via `analyzeSymbols`): None direct; focus on build outputs from `types.ts` interfaces.

## Specific Workflows & Steps

### 1. Set Up CI/CD Pipeline (GitHub Actions)
```
1. Create `.github/workflows/ci-cd.yml`.
2. Triggers: push/PR to main/feature/*.
3. Jobs:
   a. lint: npm ci && npm run lint.
   b. test: npm ci && npm test --coverage.
   c. build: npm run build; analyze bundle (e.g., webpack-bundle-analyzer).
   d. deploy: On main merge → vercel deploy or docker push.
4. Use matrix for Node 18/20.
5. Secrets: VERCEL_TOKEN, AWS_CREDS.
6. PR: Test in branch → approve → merge → auto-deploy.
```

**Template Snippet** (searchCode for similar: none found):
```yaml
name: CI/CD
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
```

### 2. Containerize & Local Dev (Docker)
```
1. Create `Dockerfile`:
   FROM node:20-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=prod
   COPY . .
   RUN npm run build
   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
2. `docker-compose.yml`: services for app + mock API if needed.
3. Build/test: docker build -t dashboard .
4. Push: to GHCR/DockerHub on CI.
```

### 3. Deploy to Production (Vercel/Serverless Priority)
```
1. Connect repo to Vercel dashboard.
2. Add `vercel.json`:
   { "builds": [{ "src": "package.json", "use": "@vercel/static-build" }], "routes": [...] }
3. CI/CD: vercel --prod --token $TOKEN.
4. Alt: AWS S3 + CloudFront via Terraform.
5. Rollback: Git revert + redeploy.
```

### 4. Monitoring & Alerting Setup
```
1. Add Sentry: npm i @sentry/react; init in index.tsx.
2. GitHub Actions: deploy:sentry-release.
3. CloudWatch/Prometheus: For container metrics.
4. Alerts: >500ms load time → Slack/Teams.
5. Logs: Structured JSON; aggregate in ELK or cloud logs.
```

### 5. IaC with Terraform (Advanced)
```
1. mkdir infra/terraform
2. Init: provider "aws" {} → s3_bucket + cloudfront_distribution.
3. Apply: terraform plan/apply in CI (on main).
4. State: Remote backend (S3).
```

### 6. Optimization Workflow
```
1. Analyze: `npm run analyze` (add script with webpack-bundle-analyzer).
2. Compress public/ assets.
3. CI cache: actions/cache@v3 for .next/cache.
4. Cost: Vercel dashboard; prune branches.
```

## Documentation Touchpoints
Update these after changes:
- [Deployment Guide](../docs/development-workflow.md#deployment)
- [Infrastructure](../docs/architecture.md#infra)
- [Monitoring](../docs/security.md)
- Index all in [docs/README.md](../docs/README.md)

## Collaboration Checklist
1. [ ] Review `package.json` scripts/deps for changes.
2. [ ] Check open PRs in `.github/` or `infra/`.
3. [ ] Test pipeline locally (act tool).
4. [ ] Update docs with new workflows.
5. [ ] Confirm with maintainers: Deploy target? (Vercel/AWS?)
6. [ ] Capture metrics: Build time <2min, deploy <1min.

## Hand-off Notes Template
**Outcomes**: [e.g., CI/CD live, deploys to Vercel in 90s.]
**Risks**: [e.g., No backend scaling; monitor traffic spikes.]
**Follow-ups**: [e.g., Add e2e tests; Kubernetes POC if traffic >10k users/day.]
**Metrics**: Build success 100%, Cost $X/month.
