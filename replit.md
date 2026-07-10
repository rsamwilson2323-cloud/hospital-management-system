# Hospital Management System

A full-stack web application for managing hospital operations — patients, doctors, appointments, billing, medical records, pharmacy inventory, and lab reports.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, served at `/api`)
- `pnpm --filter @workspace/hms run dev` — run the HMS frontend (served at `/`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + shadcn/ui + Recharts + wouter
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for all API contracts)
- `lib/db/src/schema/` — Drizzle DB schemas (patients, doctors, appointments, medical-records, bills, medicines, lab-reports)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/hms/src/` — React frontend (pages, components)
- `lib/api-client-react/src/generated/` — Generated React Query hooks (do not edit)
- `lib/api-zod/src/generated/` — Generated Zod schemas for server validation (do not edit)

## Architecture decisions

- OpenAPI-first: all API contracts defined in `openapi.yaml`, Orval generates both client hooks and server Zod schemas
- Body schema names are entity-shaped (e.g. `PatientInput`, `PatientUpdate`) not operation-shaped to avoid TS2308 Orval collision
- Dashboard endpoints use raw SQL via `drizzle-orm/sql` for aggregation queries (revenue trends, appointment trends, doctor workload)
- Enrichment pattern: appointment/bill/lab report routes join patient/doctor names in-process after DB fetch
- Decimal columns (amount, price) are stored as PostgreSQL `decimal` and converted to `Number` in response serializers

## Product

- **Dashboard** — Live stats (patients, doctors, today's appointments, revenue), revenue bar chart, appointment trends line chart, doctor workload table, recent activity feed
- **Patients** — Full CRUD with search and blood group filter; patient detail page with linked records
- **Doctors** — Full CRUD with search and specialization filter; doctor profile with appointment history
- **Appointments** — Book, reschedule, cancel appointments; status tracking (scheduled/completed/cancelled)
- **Medical Records (EMR)** — Diagnosis, prescriptions, treatment notes per patient
- **Billing** — Bill creation, payment recording, revenue tracking
- **Pharmacy** — Medicine inventory with low-stock and expiry warnings
- **Lab Reports** — Test request and result tracking
- **Reports** — Analytics page with Recharts visualizations

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After any OpenAPI spec change, always run codegen before writing route or frontend code
- Run `pnpm run typecheck:libs` after touching any `lib/*` package before checking artifact typechecks
- Decimal columns from Drizzle are returned as strings — always `Number(value)` when serializing in route responses
- The `lowStock` query param from the frontend is a string "true"/"false" — handle both boolean and string in the route

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
