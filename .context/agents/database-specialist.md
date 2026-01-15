# Database Specialist Agent Playbook

## Mission
The Database Specialist agent ensures robust, scalable data storage and retrieval for the Geographic Impact Dashboard, a React-based web application visualizing geographic impact data across Brazil (e.g., municipal-level metrics from IBGE or similar sources). Engage this agent for:
- Initial schema design when adding persistent data storage (currently frontend-heavy with static/public data).
- Query optimization as data volumes grow (e.g., geo-spatial queries for maps).
- Migration planning for schema evolutions.
- Performance tuning for dashboard load times.
- Data integrity checks during feature development involving user data or cached analytics.

The project currently lacks a dedicated backend database (no Prisma, Sequelize, or SQL files detected; data likely sourced from public APIs/JSON/CSV). Focus on recommending and implementing a Postgres/PostGIS setup for geo-data handling.

## Responsibilities
- Design relational schemas optimized for geographic data (e.g., municipalities, states, impact metrics).
- Create EF/Prisma/Knex migrations for schema changes.
- Implement indexes (e.g., GIST for spatial queries) and query optimizations.
- Ensure ACID compliance, foreign key constraints, and data validation.
- Set up connection pooling, backups (pg_dump), and monitoring (e.g., EXPLAIN ANALYZE).
- Integrate with frontend via API layer (e.g., Next.js API routes or separate Express server).

## Workflows and Steps for Common Tasks

### 1. Schema Design and Initial Setup
   1. Review data sources: Inspect `public/data/` or API endpoints (e.g., IBGE GeoJSON).
   2. Model entities: Municipalities (id, name, state_id, geom::geometry), Metrics (id, municipality_id, impact_score, date).
   3. Use PostGIS extensions for spatial types (POINT, POLYGON).
   4. Generate Prisma schema: `npx prisma init`; define models with `@db.Geography(geom, 4326)`.
   5. Create initial migration: `npx prisma migrate dev --name init`.
   6. Seed data: Write `prisma/seed.ts` for initial Brazil geo-data import.

### 2. Migration Creation and Deployment
   1. Plan change: Document in `docs/database-changes.md` (create if missing).
   2. Write migration SQL: Use reversible operations (e.g., ADD COLUMN with DEFAULT).
   3. Test locally: `npx prisma migrate deploy`.
   4. Rollback strategy: Include DOWN SQL; test `prisma migrate resolve --rolled-back`.
   5. Deploy: Update `.env` DATABASE_URL; run in CI/CD.

### 3. Query Optimization
   1. Identify slow queries: Add logging in API routes; use `EXPLAIN (ANALYZE, BUFFERS)`.
   2. Benchmark: Time before/after with `pg_stat_statements`.
   3. Add indexes: `CREATE INDEX CONCURRENTLY idx_muni_geom ON municipalities USING GIST(geom);`.
   4. Rewrite queries: Favor JOINs over subqueries; use spatial functions (ST_Intersects).
   5. Update Prisma client: `npx prisma generate`.

### 4. Data Integrity and Backup
   1. Add constraints: CHECK, UNIQUE, FKs in schema.
   2. Transactions: Wrap multi-ops in Prisma `$transaction`.
   3. Backups: Script `pg_dump -Fc > backup-$(date).dump`; cron job.
   4. Recovery: `pg_restore`; test point-in-time recovery.

### 5. Monitoring and Maintenance
   1. Vacuum/analyze: `VACUUM ANALYZE VERBOSE;`.
   2. Alert on bloat/index usage via `pg_stat_user_indexes`.

## Best Practices (Derived from Codebase)
- **Conventions**: Follow TypeScript strict mode; use Prisma for ORM (aligns with modern JS stack, no existing ORM but recommended).
- **Geo-Specific**: Always use SRID 4326; validate geometries with ST_IsValid.
- **Performance**: Paginate queries (`take`, `skip`); cache aggregates with materialized views.
- **Security**: Use prepared statements (Prisma handles); row-level security for multi-tenant if needed.
- **Testing**: Write integration tests in `tests/database.test.ts` using `prisma.$connect()` and test DB.
- **Version Control**: Commit migrations to repo; never edit applied migrations.
- **Environment**: `.env` with `DATABASE_URL="postgresql://..."`; shadow DB for migrations.

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)
- **New: Database Guide**: [docs/database.md](docs/database.md) (create/propose)

## Repository Starting Points
- `commands/` — CLI scripts for data processing/seeding (e.g., import CSV to DB).
- `components/` — UI components consuming data; focus on data-fetching hooks (e.g., useQuery for dashboard metrics).
- `public/` — Static assets including geo-data JSON/CSV (e.g., brazil-municipalities.geojson); migrate to DB.
- `src/` or `app/` — Core app logic; add `lib/db.ts` for Prisma client.
- `prisma/` — ORM schema/migrations (to be added).

## Key Files
**Database-Focused (Current/New):**
- [`prisma/schema.prisma`](prisma/schema.prisma) — Core schema definition (create).
- [`prisma/migrations/`](prisma/migrations/) — Versioned schema changes.
- [`lib/db.ts`](lib/db.ts) — Prisma client singleton.
- [`scripts/seed.ts`](scripts/seed.ts) — Data seeding script.

**Related Entry Points:**
- [`index.tsx`](index.tsx) — App root; integrate DB queries via API.
- [`package.json`](package.json) — Add deps: `@prisma/client`, `prisma`, `pg`, `@types/pg`.
- [`public/data/*.json`](public/data/) — Initial data sources for import.

**Configuration:**
- [`.env.example`](.env.example) — Add DATABASE_URL.
- [`next.config.js`](next.config.js) or `vite.config.ts` — Env vars for DB.

## Architecture Context
- **Current**: Frontend-only (React/Vite/TS); data via static files/APIs. No backend DB.
- **Proposed**: Add Prisma + Postgres/PostGIS; API layer in `/api/routes` for queries.
- **Data Flow**: Public data → DB seed → API endpoints → React queries (TanStack Query/SWR).

### Components Impacting DB
- Map/Dashboard components: High-volume spatial queries (e.g., filter by bounding box).
- **Directories**: `components/`
- **Symbols**: Data hooks (e.g., `useMunicipalities`, `useImpactData`).

## Key Symbols for This Agent
- **Prisma Models** (to define): `Municipality`, `State`, `ImpactMetric`, `GeoBoundary`.
- **Queries**: `prisma.municipality.findMany({ where: { geom: { _stIntersects: bbox } } })`.
- **No existing DB symbols**; agent introduces them.

## Documentation Touchpoints
- [Documentation Index](../docs/README.md)
- [Project Overview](../docs/project-overview.md)
- [Architecture Notes](../docs/architecture.md) — Add DB section.
- [Development Workflow](../docs/development-workflow.md) — DB setup steps.
- [Testing Strategy](../docs/testing-strategy.md) — DB test patterns.
- [Glossary & Domain Concepts](../docs/glossary.md) — Define geo terms.
- [Data Flow & Integrations](../docs/data-flow.md) — Update for DB.
- [Security & Compliance Notes](../docs/security.md) — DB auth.
- [Tooling & Productivity Guide](../docs/tooling.md) — Prisma Studio.

**Propose New**: [docs/database.md](../docs/database.md) — Schema diagrams (mermaid), ERD.

## Collaboration Checklist
1. Confirm data requirements with frontend devs (e.g., query shapes).
2. Review PRs in `components/` for data-fetch changes.
3. Benchmark with real data volumes (e.g., 5k+ Brazilian municipalities).
4. Update docs/data-flow.md and create database.md.
5. Share Prisma Studio link for schema exploration.
6. Capture learnings in [docs/README.md](../docs/README.md).

## Hand-off Notes Template
**Outcomes**: Schema deployed (version X), migrations applied, queries <100ms at scale.  
**Risks**: Data migration from public/ incomplete; spatial index bloat.  
**Follow-ups**: 
- Integrate with API routes.
- Add tests for top 5 queries.
- Monitor prod queries post-deploy.
- Assignee: @frontend-lead.
