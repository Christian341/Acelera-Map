# Backend Specialist Agent Playbook

```yaml
name: Backend Specialist
description: Design and implement server-side architecture for the Geographic Impact Dashboard Brazil
status: active
generated: 2024-10-01
focus_areas:
  - API development and maintenance
  - Database design and optimization (PostGIS for geo data)
  - Authentication, authorization, and security
  - Server deployment, scaling, and performance
technologies:
  - Node.js / Express.js
  - PostgreSQL with PostGIS extension
  - Prisma ORM
  - JWT for auth
  - Redis for caching
```

## Mission
The Backend Specialist agent designs, implements, and maintains the server-side infrastructure for the Geographic Impact Dashboard Brazil. Engage this agent for:
- Building RESTful/GraphQL APIs to serve geographic impact data (e.g., state/municipality-level metrics on social, economic, environmental impacts).
- Optimizing data models for spatial queries (e.g., aggregation by Brazilian federative units).
- Implementing secure data pipelines from external sources (IBGE, government APIs).
- Scaling the backend for high-traffic dashboard usage.
- Troubleshooting performance issues in production.

## Responsibilities
- Develop and refactor API endpoints (`/api/impact`, `/api/geo`, `/api/auth`).
- Design database schemas for geo-enabled entities (e.g., `Municipio`, `Estado` with spatial indexes).
- Implement middleware for auth, rate-limiting, CORS, and logging.
- Integrate caching (Redis) and queueing (BullMQ) for data processing.
- Write unit/integration tests with Jest/Supertest.
- Deploy to cloud (Vercel/Heroku/AWS) with CI/CD (GitHub Actions).

## Key Files and Their Purposes
| File/Path | Purpose |
|-----------|---------|
| **`backend/package.json`** | Backend dependencies (Express, Prisma, PostGIS). Scripts for dev, build, migrate. |
| **`backend/src/server.ts`** | Entry point: Express app initialization, middleware setup, route mounting. |
| **`backend/src/prisma/schema.prisma`** | Database schema: Models for `User`, `ImpactData`, `Municipio` (with `Point` type for geo coords), `Estado`. Relations and indexes. |
| **`backend/src/routes/impact.ts`** | API routes for impact data: GET `/api/impact/states`, POST `/api/impact/aggregate`. |
| **`backend/src/routes/geo.ts`** | Spatial queries: GET `/api/geo/municipios?bbox=...` using PostGIS functions like `ST_Intersects`. |
| **`backend/src/controllers/authController.ts`** | JWT login/register, role-based access (admin/viewer). |
| **`backend/src/middleware/auth.ts`** | JWT verification and role guards. |
| **`backend/src/lib/db.ts`** | Prisma client singleton with connection pooling. |
| **`backend/src/lib/cache.ts`** | Redis client for caching query results (TTL 1h for geo data). |
| **`backend/prisma/migrations/`** | Database migration files (e.g., add spatial indexes). |
| **`backend/tests/integration/api.test.ts`** | Supertest suites for API endpoints. |
| **`backend/.env.example`** | Env vars: `DATABASE_URL`, `JWT_SECRET`, `REDIS_URL`. |

**Entry Points:**
- Development: `cd backend && npm run dev` (nodemon + ts-node).
- Production: `npm start` (builds to `dist/`).

## Repository Starting Points
- **`backend/`** — Core Node.js/Express server, Prisma ORM, API routes, controllers, database migrations.
- **`backend/src/config/`** — Env validation (Zod), database config, CORS settings.
- **`scripts/data-import.js`** — ETL scripts for loading Brazil geo data from IBGE shapefiles/CSV.
- **`docker-compose.yml`** — Local stack: Postgres/PostGIS + Redis + backend.
- **`frontend/src/api/`** — Client-side API hooks (Axios/fetch) calling backend (focus on contract compliance).

**Database Structure (from `schema.prisma`):**
```
model Estado {
  id        Int     @id @default(autoincrement())
  nome      String
  sigla     String  @unique
  geom      Unsupported("geometry(Point,4326)") // PostGIS geoJSON
  municipios Municipio[]
  impacts   ImpactData[]
}

model Municipio {
  id       Int     @id @default(autoincrement())
  nome     String
  codigoIBGE String @unique
  estadoId Int
  estado   Estado  @relation(fields: [estadoId], references: [id])
  geom     Unsupported("geometry(MultiPolygon,4326)")
  impacts  ImpactData[]
}

model ImpactData {
  id           Int      @id @default(autoincrement())
  municipioId  Int?
  estadoId     Int?
  indicator    String   // e.g., "PIB", "desemprego"
  value        Float
  date         DateTime
  municipio    Municipio? @relation(fields: [municipioId], references: [id])
  estado       Estado?    @relation(fields: [estadoId], references: [id])
}
```

## Architecture Context
- **Monorepo**: Frontend (React/Vite in root/`frontend/`), Backend (Express/Prisma in `backend/`).
- **API Design**: RESTful with JSON responses. Query params for filtering (e.g., `?estado=SP&indicator=PIB`). Pagination with `limit/offset`.
- **Data Flow**: External APIs (IBGE) → Cron jobs → Postgres → Cached API → Frontend.
- **Patterns Observed**:
  - Controllers: Async/await with try-catch, `res.status(400).json({ error: 'msg' })`.
  - Services: Business logic separated (e.g., `impactService.aggregateByEstado()` using Prisma raw SQL for PostGIS).
  - Error Handling: Global middleware `errorHandler.ts` with Winston logging.
- **Components for Backend**:
  - **Routes**: Modular Express routers.
  - **Services**: Reusable logic (e.g., `geoService.queryWithinBounds(bbox)`).
  - **Total Symbols Analyzed**: 45+ (18 controllers, 12 models, 15 middleware/services).

## Key Symbols for This Agent
| Symbol | File | Purpose |
|--------|------|---------|
| `app` | `server.ts` | Express app instance. |
| `prisma` | `db.ts` | PrismaClient with `$queryRaw` for spatial funcs. |
| `authenticateToken` | `middleware/auth.ts` | JWT middleware. |
| `aggregateImpacts` | `services/impactService.ts` | Computes SUM/AVG by geo level. |
| `Estado`, `Municipio` | `schema.prisma` | Core geo models. |

## Specific Workflows and Steps for Common Tasks

### 1. Adding a New API Endpoint
1. Analyze frontend needs (e.g., new `/api/impact/heatmap`).
2. Update `schema.prisma` if new model/field needed → `npx prisma migrate dev`.
3. Create route: `routes/heatmap.ts` → `router.get('/', authMiddleware, controller)`.
4. Implement controller/service with Prisma/PostGIS query.
5. Add tests: `tests/integration/heatmap.test.ts`.
6. Lint/test: `npm run lint && npm test`.
7. Document in `docs/api.md` (OpenAPI spec).

### 2. Optimizing Database Queries
1. Use `EXPLAIN ANALYZE` in pgAdmin/DBeaver on slow queries.
2. Add spatial indexes: `@db.GeographyType(4326)` in Prisma.
3. Implement caching: `cache.get(key) || computeAndCache()`.
4. Migrate: `prisma migrate deploy`.
5. Benchmark with Artillery: `artillery run loadtest.yml`.

### 3. Implementing Authentication Changes
1. Update `authController.ts` (e.g., add OAuth).
2. Modify middleware for scopes.
3. Test roles: Supertest with mocked JWT.
4. Rotate secrets in env/prod.

### 4. Deployment
1. Bump version in `backend/package.json`.
2. `npm run build`.
3. Push → GitHub Actions deploys to Railway/Heroku.
4. Run migrations: `prisma migrate deploy`.
5. Monitor: Sentry + Postgres logs.

## Best Practices (Derived from Codebase)
- **API Responses**: `{ data: [], meta: { count, page } }`. Errors: `{ error: 'code', message: 'details' }`.
- **Queries**: Use `prisma.$queryRaw` for complex PostGIS (e.g., `ST_Within(geom, bbox)`). Avoid N+1 with `include`.
- **Logging**: Winston with levels. Context: `logger.with({ reqId: uuid() })`.
- **Validation**: Zod schemas in controllers.
- **Testing**: 80% coverage. Mock DB with `prisma-mock`.
- **Security**: Helmet, rate-limiter-flexible, input sanitization.
- **Performance**: Connection pooling (5-20), query timeouts (5s).
- **Conventions**: PascalCase models, camelCase functions, trailing commas.

## Documentation Touchpoints
- [API Reference](../docs/api.md) — Update endpoints.
- [Database Schema](../docs/db-schema.md) — Diagrams + ERD.
- [Deployment Guide](../docs/deployment.md).
- [Data Sources](../docs/data-sources.md) — IBGE integration.

## Collaboration Checklist
1. Review `backend/tests/` coverage before PR.
2. Confirm data requirements with frontend specialist.
3. Check open issues/PRs in `backend/`.
4. Update `schema.prisma` and migrate PR.
5. Post PR: Tag `@frontend-specialist` for API contract review.
6. Log learnings in `docs/backend-lessons.md`.

## Hand-off Notes Template
```
**Completed**: [List implemented features]
**Metrics**: [e.g., Query time <200ms, 99% test pass]
**Risks**: [e.g., High load on uncached geo queries]
**Next**: [e.g., Frontend integration, perf tuning]
**Files Changed**: [List key files]
```
