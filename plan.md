# AgriFetch — Web App Build Plan

> **Tagline:** _Procurement at the Speed of Light._
> A real-time agricultural commodity procurement, marketplace, and logistics-tracking platform.

This plan turns the wireframes in [`design.html`](./design.html) into an actionable, Cursor-friendly build plan. It is split into a **Frontend Architecture** track and a **Backend Engineering** track so each Cursor session has a single, clear concern (presentational UI vs. data/API/real-time).

---

## 0. Tech Stack & Conventions

Driven by [`.cursorrules`](./.cursorrules) and the design constraints.

| Layer | Choice | Rationale |
| --- | --- | --- |
| Frontend framework | **React + Vite + TypeScript** | Clean SPA decoupled from a separate Python backend. Strict TS per rules. |
| Styling | **Tailwind CSS** (utility-first) | Required by rules; design is Tailwind-native (`design.html` ships a `tailwind.config`). |
| UI primitives | **Headless / accessible primitives** (Radix UI / Headless UI) | Composable, accessible-by-default, minimally opinionated. |
| Routing | **React Router** | Multi-view SPA (Landing, Marketplace, Procurement, Logistics). |
| Data fetching | **TanStack Query** | Caching, polling, and real-time invalidation. |
| Realtime client | **Native WebSocket / EventSource (SSE)** | Live ticker + asset positions + telemetry. |
| Backend | **Python + FastAPI** | Async-first (WebSockets/SSE/IoT ingest), per rules ("Prefer Python for backend"). |
| Database | **PostgreSQL** | Per rules. Geometry via PostGIS for route nodes; time-series for telemetry. |
| ORM / migrations | **SQLAlchemy 2.x + Alembic** | Typed models, versioned schema. |
| Validation | **Pydantic v2** | Request/response schemas shared across endpoints. |

**Global conventions**

- Functional React components + hooks only (no class components).
- Strict TypeScript; avoid `any` (document any exception).
- Utility-first Tailwind; no standalone CSS files except `globals.css` for keyframes/global tokens.
- Accessibility first: semantic HTML, keyboard support, visible focus rings, ARIA where needed.
- Backend: type hints everywhere, async route handlers, Pydantic models at boundaries.

---

## 1. Design System Reference (extracted from `design.html`)

These tokens are the single source of truth for `tailwind.config.ts`.

### Color tokens (dark theme, `darkMode: "class"`)

| Token | Value | Usage |
| --- | --- | --- |
| `background` / `surface` | `#111414` | App background |
| `secondary-fixed` | `#b8f600` | Neon lime accent / active state / CTAs |
| `secondary-fixed-dim` | `#a1d800` | Dimmed accent (prices) |
| `primary-container` | `#0d2b23` | Deep emerald container |
| `tertiary-container` | `#062c24` | TopAppBar tint |
| `on-tertiary-container` | `#719589` | Muted labels |
| `surface-container` | `#1d2020` | Cards / nav |
| `surface-container-high` | `#282a2a` | Elevated surfaces |
| `surface-container-low` | `#191c1c` | Recessed surfaces |
| `surface-container-lowest` | `#0c0f0f` | Toggles / insets |
| `surface-variant` | `#323535` | Hover fills |
| `outline` | `#8b928f` | Borders |
| `outline-variant` | `#414845` | Hairline borders (used at 20–30% opacity) |
| `on-surface` | `#e1e3e2` | Primary text |
| `on-surface-variant` | `#c1c8c4` | Secondary text |
| `error` | `#ffb4ab` | Negative trends |
| `on-secondary-fixed` | `#141f00` | Text on lime buttons |

### Typography

- **Sora** — display & headlines (`display-lg` 48px, `headline-lg` 32px, `headline-lg-mobile` 24px).
- **Inter** — body (`body-lg` 18px, `body-md` 16px).
- **JetBrains Mono** — labels/metrics (`label-md` 14px, `label-sm` 12px, uppercase + tracked).
- **Material Symbols Outlined** — icon set.

### Border radius

`DEFAULT 0.125rem`, `lg 0.25rem`, `xl 0.5rem`, `full 0.75rem` (note: `rounded-full` is `0.75rem` here, plus pill shapes via `rounded-full` on nav).

### Spacing scale

`xs 4px`, `base 8px`, `sm 12px`, `md 24px`, `gutter 24px`, `lg 48px`, `xl 80px`, `container-max 1440px`.

### Signature effects (define in `globals.css`)

- `.glass` / `.glass-panel` — `rgba(26,61,52,0.6)` + `backdrop-filter: blur(20px)` + `0.5px` outline border.
- `.neon-glow` — `box-shadow: 0 0 15px rgba(184,246,0,0.4)` (→ `0.6` on hover).
- `.glow-radial` — radial lime gradient backdrop.
- `.route-line` — infinite dashing-path SVG stroke animation (`stroke-dasharray` + `stroke-dashoffset` keyframes).
- Animation utilities: `animate-pulse` (live nodes), `animate-bounce` (scroll chevron, logistics pin), 20s slow `scale` on map imagery.

---

## 2. Screen Inventory (from wireframes)

| Route | Screen | Source region in `design.html` |
| --- | --- | --- |
| `/` | Landing Hub (hero + Core Ecosystem bento + CTA) | Hero, Feature Bento, Dynamic CTA |
| `/marketplace` | Global Commodity Marketplace (filters + bento feed + live ticker) | Marketplace header, filters, listings, ticker |
| `/procurement` | Procurement Hub (stats panel + market trend + data table) | Bento Stats, Market Trend, Data Table |
| `/logistics/:orderId` | Real-Time Logistics Command (split: map + order sidebar) | Map container, transit pipeline, sensors, docs |
| Shared | Navigation shell (TopAppBar, SideNavBar desktop, BottomNavBar mobile) | Headers + nav across screens |

---

# Part 1 — Frontend Development Blueprint

UI components, styling, routing, and client-side micro-interactions. No data persistence logic.

## Phase F1 — Environment & Style Initialization

### Task F1.1 — Project Scaffolding
- **Goal:** Initialize the client framework.
- **Deliverables:**
  - Vite + React + TypeScript project under `/frontend`.
  - Folder structure: `/src/components`, `/src/pages` (or `/src/routes`), `/src/styles`, `/src/hooks`, `/src/lib`, `/src/types`.
  - Tailwind + PostCSS + autoprefixer installed and wired.
  - React Router with the routes from the Screen Inventory.
  - ESLint + Prettier + strict `tsconfig`.
- **Cursor prompt:** _"Initialize a modern frontend project (React + Vite + TypeScript) with Tailwind CSS. Set up `/src/components`, `/src/pages`, `/src/styles`, `/src/hooks`, `/src/lib`, `/src/types`, and configure React Router with routes for `/`, `/marketplace`, `/procurement`, and `/logistics/:orderId`."_

### Task F1.2 — Design Tokens & Global Styles
- **Goal:** Encode the design system.
- **Deliverables:**
  - `tailwind.config.ts` with the full color, font, fontSize, borderRadius, and spacing tokens from Section 1.
  - Google Fonts (Sora, Inter, JetBrains Mono) + Material Symbols loaded.
  - `globals.css` defining `.glass-panel`, `.neon-glow`, `.glow-radial`, and `@keyframes` for the `.route-line` infinite dashing path.
  - `darkMode: "class"` with `<html class="dark">`.
- **Cursor prompt:** _"Configure `tailwind.config.ts` with our color tokens (background `#111414`, secondary-fixed `#b8f600`, primary-container `#0d2b23`, …), fonts (Sora, Inter, JetBrains Mono), spacing, and radii. In `globals.css`, define `.glass-panel`, `.neon-glow`, and the infinite dashing-path keyframes for `.route-line`."_

## Phase F2 — Shared Layout Components

### Task F2.1 — Navigation Shell & Structural Layout
- **Goal:** Application framing shell.
- **Deliverables:**
  - `<DashboardLayout>` wrapping routed pages.
  - `<TopAppBar>`: AgriFetch logo (lime `agriculture` icon), search input frame, notifications, settings, user avatar.
  - `<SideNavBar>` (desktop ≥ md): Dashboard, Marketplace, Procurement, Logistics, Analytics, Settings.
  - `<BottomNavBar>` (mobile): floating, rounded (`rounded-t-full`), Home / Dashboard / Market / Profile.
  - Responsive: sidebar collapses into bottom bar below `md`.
- **Cursor prompt:** _"Build a responsive dashboard layout. Create a persistent TopAppBar (notifications, profile avatar, search input frame) and a desktop SideNavBar. On mobile, collapse the sidebar into a floating rounded BottomNavBar."_

### Task F2.2 — UI Micro-Interactions & State Triggers
- **Goal:** Presentation polish on nav.
- **Deliverables:**
  - Active route → `secondary-fixed` color + subtle `neon-glow`.
  - Side-nav text nodes slide right on pointer proximity/hover.
  - `active:scale-90` press feedback; focus-visible rings for a11y.
- **Cursor prompt:** _"Add nav micro-interactions: active routes show `#b8f600` with a subtle glow; side-nav text slides right on hover. Keep visible keyboard focus states."_

## Phase F3 — Presentation Page Views

> Build each as static components first, fed by typed mock data in `/src/lib/mocks`, matching the API contracts in Part 2. Swap mocks for live queries in Phase F4 / integration.

### Task F3.1 — Marketing & Landing Presentation (`/`)
- **Deliverables:**
  - Dark hero: full-bleed background image layer + gradient fade, logo, headline ("Procurement at the Speed of Light."), dual CTA buttons, absolute bouncing scroll chevron.
  - Core Ecosystem bento grid (12-col): AI-Driven Procurement (col-span-8), Real-Time Tracking (col-span-4), Global Marketplace, Efficiency Metrics with **custom vector circular progress** rings.
  - Dynamic CTA / footer branding band.
- **Cursor prompt:** _"Build the Landing Hub view: dark hero with background image layer, dual action buttons, and a bouncing scroll chevron; below it a Core Ecosystem bento grid with custom SVG circular-progress metrics."_

### Task F3.2 — Commodity Marketplace UI (`/marketplace`)
- **Deliverables:**
  - High-tech search bar frame.
  - Multi-tier filter bar: Product Type, Region, Certification, Price Range (pill buttons) + Reset.
  - Bento listings grid:
    - **Featured asymmetrical card** — Organic Soybeans (Glycine Max): PREMIUM/LIVE BIDS badges, price/ton, available stock, certifications, origin.
    - Standalone vertical cards — Yellow Dent Corn, Durum Wheat (rate, trend chip, origin).
    - Horizontal row card — Arabica Coffee (quality score, unit price, harvest, min order).
  - Live commodity ticker strip + dynamic load indicator.
- **Cursor prompt:** _"Build the Global Commodity Marketplace view: a multi-tier filter bar (Product Type, Region, Certification, Price) + search bar, and a bento grid with an asymmetrical premium Soybeans card, standalone Corn/Wheat cards, and a horizontal Arabica Coffee row."_

### Task F3.3 — Procurement Hub Data Grid (`/procurement`)
- **Deliverables:**
  - Analytical stats panel: Total Spend ($12.4M, +YoY), Active Shipments (142, critical count), Procurement Savings ($842K).
  - Market Trend panel with SVG sparkline + delta chip.
  - Dense data table: Asset Identity (icon + lot #), Status pipeline badges, Procurement Node, Unit Price, Volatility trend, row action menu. Tabs: All Bids / Urgent / Closed.
- **Cursor prompt:** _"Assemble the Procurement Hub view: a stats panel (Total Spend, Active Shipments, Savings) plus a dense table mapping Asset Identity, Status badges, Procurement Node, Unit Price, and Volatility trend."_

### Task F3.4 — Real-Time Logistics Interactive Panel (`/logistics/:orderId`)
- **Deliverables:**
  - Order ID header + "Live GPS Tracking" badge.
  - **Left (map, col-span-2):** dark satellite background, `.route-line` path-tracing SVG, animated bouncing logistics pin, floating HUD overlays (Current Speed, ETA).
  - **Right sidebar:** vertical Transit Pipeline stepper (Procured → Shipped → In Transit → Delivery Pending), Payload Environment grid (Temp, Humidity), Inventory & Intelligence cards (Quantity, Certificate, Logistics Lead, Documentation).
- **Cursor prompt:** _"Build the Real-Time Logistics Command view as a split layout. Left: dark map background with path-tracing SVG, a bouncing pin, and floating HUD overlays (speed, ETA). Right: an order sidebar with a vertical transit timeline, environmental metric blocks, and a customs/document list."_

## Phase F4 — Client-Side Interaction Layer

### Task F4.1 — Dynamic Visual HUD Interactions
- **Deliverables:**
  1. `useMapCursorCoordinates` hook — tracks pointer over the map and prints synthesized lat/long strings into the HUD coordinate box.
  2. Endless CSS marquee for the global commodity ticker.
  3. Card-tilt parallax hover on marketplace bento cards (respect `prefers-reduced-motion`).
  4. GPS "live" pulse toggle for the sensors badge.
- **Cursor prompt:** _"Add client-side behavior: (1) track cursor over the logistics map and render synthesized lat/long into the HUD box; (2) an endless marquee for the commodity ticker; (3) subtle card-tilt parallax on marketplace bento cards; honor `prefers-reduced-motion`."_

---

# Part 2 — Backend Development Blueprint

Data layer, API structure, real-time updates, and integration logic. Python + FastAPI + PostgreSQL under `/backend`.

## Phase B0 — Backend Scaffolding (prerequisite)
- **Deliverables:**
  - FastAPI app (`/backend/app`), `uvicorn`, settings via env, CORS for the frontend origin.
  - SQLAlchemy 2.x engine + session, Alembic migrations, Pydantic v2 schemas.
  - `requirements.txt` (pinned), Dockerfile + `docker-compose.yml` (Postgres + PostGIS + API), `README`.
  - Auth scaffolding (JWT bearer) + `get_current_user` dependency.

## Phase B1 — Core Architecture & Data Models

### Task B1.1 — Database Schema & Entity Modeling
- **Goal:** Tables mirroring the design's domain objects.
- **Deliverables (SQLAlchemy models + Alembic migration + Pydantic schemas):**

  **`CommodityListing`**
  - `id`, `common_name` (e.g., Organic Soybeans), `scientific_name` (Glycine Max), `category` (grain/legume/beverage/input),
    `bulk_price_per_unit`, `unit` (MT/T), `available_stock`, `origin_region`, `grade`, `certifications` (array/JSON: USDA Organic, ISO 22000…),
    `quality_score`, `price_trend_pct`, `min_order`, `harvest_date`, `image_url`, `created_at`.

  **`ShipmentOrder`**
  - `id`, `order_number` (AF-8829-X), `listing_id` (FK), `tracking_number`, `current_speed_kmh`, `eta`,
    `route_geometry` (PostGIS LineString of coordinate nodes), `current_position` (Point),
    `quantity`, `quantity_unit`, `certificate`, `logistics_lead`, `status`, `created_at`.

  **`ShipmentStep`** (timeline)
  - `id`, `shipment_id` (FK), `step_index`, `label` (Procured/Shipped/In Transit/Delivery Pending), `status` (completed/active/pending), `location`, `timestamp`.

  **`PayloadTelemetry`** (time-series)
  - `id`, `shipment_id` (FK), `recorded_at`, `temperature_c`, `humidity_pct`, `gas_safety_status` (volatile O₂ / safe / warning). Index on `(shipment_id, recorded_at)`.

  **`ProcurementSummary`** (per user/org, aggregate)
  - `id`, `user_id` (FK), `total_spend`, `spend_yoy_pct`, `active_shipments`, `critical_shipments`, `procurement_savings`, `savings_vs_target`, `computed_at`.

  **`ShipmentDocument`**
  - `id`, `shipment_id` (FK), `type` (bill_of_lading/phytosanitary/customs_declaration), `file_url`/blob ref, `issued_at`, `access_acl`.

- **Cursor prompt:** _"Design a PostgreSQL schema (SQLAlchemy + Alembic) for CommodityListing, ShipmentOrder, ShipmentStep, PayloadTelemetry, ProcurementSummary, and ShipmentDocument with the fields above; use PostGIS for route geometry and a time-series-friendly index for telemetry."_

## Phase B2 — Secure API Interface Layer

### Task B2.1 — RESTful Commodity & Procurement Endpoints
- **Deliverables:**
  - `GET /api/marketplace` — parse filter flags (`group`/category, `region`, `certifications[]`, `price_min`, `price_max`, search `q`); dynamic SQLAlchemy query; paginated typed response.
  - `GET /api/procurement/summary` — compute Total Spend, savings benchmark vs target, active/critical transit counts for the authenticated org.
  - `GET /api/procurement/listings` — table rows (asset identity, status, node, unit price, volatility) with tab filters (all/urgent/closed).
- **Cursor prompt:** _"Create `GET /api/marketplace` with filter parsing (group, region, certifications, price range) running dynamic queries, and `GET /api/procurement/summary` computing total spend, savings, and transit metrics for the current user."_

### Task B2.2 — Document Retrieval Engine
- **Deliverables:**
  - `GET /api/shipments/{id}/documents` — list available docs for a shipment.
  - `GET /api/shipments/{id}/documents/{type}` — fetch Bill of Lading / Phytosanitary / Customs Declaration.
  - Security checkpoint: verify the requesting user's access keys (ACL) before serving; 403 otherwise; signed/expiring URLs for blobs.
- **Cursor prompt:** _"Build `GET /api/shipments/{id}/documents/{type}` to serve compliance docs (Bill of Lading, Phytosanitary, Customs Declaration) with an access-control check that validates the requesting user can view the record."_

## Phase B3 — Real-Time Telemetry & Data Infrastructure

### Task B3.1 — WebSocket Server for Asset Trajectories & Pricing
- **Deliverables:**
  - `WS /ws/market` — broadcast pricing-index changes to the marketplace ticker across open sessions (pub/sub fan-out).
  - `WS /ws/shipments/{id}` — stream asset location mutations to clients tracking a given shipment (drives map pin + HUD).
  - Connection manager (subscribe/unsubscribe, heartbeat); SSE fallback `GET /api/stream/market`.
- **Cursor prompt:** _"Set up real-time infrastructure: a WebSocket broadcast that pushes pricing-index changes to all marketplace clients, and a per-shipment stream that pushes asset position updates to subscribed clients (with an SSE fallback)."_

### Task B3.2 — IoT Device Telemetry Ingestion Pipeline
- **Deliverables:**
  - `POST /api/telemetry/ingest` — accept IoT payloads (ambient temperature, humidity, volatile O₂/gas status), validate, persist to the `PayloadTelemetry` time-series table.
  - On write, emit event to active `WS /ws/shipments/{id}` subscribers (live sensor card update).
  - Device auth (API key / token), rate limiting, batch-insert support for throughput.
- **Cursor prompt:** _"Build `POST /api/telemetry/ingest` to receive IoT measurements (temperature, humidity, oxygen/gas status), validate and log them chronologically, and push the update to subscribed shipment-tracking clients."_

---

## 3. Cross-Cutting Concerns

- **Auth & authZ:** JWT bearer; single-org data; authenticated-user ACL checks on documents (B2.2) and shipment streams (B3.1).
- **API contract:** OpenAPI auto-generated by FastAPI; generate a typed TS client for the frontend (`/src/lib/api`) to keep types in sync.
- **Accessibility:** semantic landmarks, keyboard nav for tabs/menus, `prefers-reduced-motion` for parallax/marquee/route animations, color-contrast verified against the dark palette.
- **Testing:** Vitest + React Testing Library (frontend); Pytest + httpx (backend); seed fixtures for the four entity sets.
- **Observability:** structured logging, request IDs, health check `GET /healthz`.
- **Seed data:** mirror the wireframe sample data (Soybeans, Corn, Wheat, Coffee; Order AF-8829-X) so the UI looks correct end-to-end.

---

## 4. Confirmed Decisions

- **Tenancy:** **Single-organization.** `ProcurementSummary` aggregates one org's data; document ACL is a simple authenticated-user check (no cross-tenant scoping needed yet).
- **Document storage:** **Hetzner Object Storage** (S3-compatible). `ShipmentDocument.file_url` holds an object key; the backend uses `boto3` (custom S3 endpoint) to serve **signed, expiring URLs** after the ACL check (B2.2). Keeps storage in the same provider/region as the VPS.
- **Realtime transport:** **WebSockets primary + SSE fallback** (confirmed assumption).
- **Repository:** **Private GitHub repo** (2,000 free Actions minutes/month; free GHCR within included storage).
- **Hosting:** **Hetzner Cloud, ARM (CAX11)** — requires `linux/arm64` multi-arch image builds (see Phase D).
- **Domain:** **`agrifetch.co.za`** — Caddy issues/renews HTTPS for it automatically. Suggested layout: `agrifetch.co.za` → frontend, `api.agrifetch.co.za` (or `/api` + `/ws` paths on the apex) → backend.

### Still open (non-blocking)

- Map provider for production — wireframe uses a static satellite image + SVG overlay. Keep stylized for now; integrate a real tiles provider later if needed.

---

# Part 3 — Deployment Blueprint

Single Hetzner Cloud VPS running Docker Compose, with CI/CD on GitHub Actions (free tier) and images in GHCR.

## Target topology (single VPS)

```
Hetzner CAX11 (ARM, 2 vCPU / 4 GB) — Docker Compose
├── caddy        # reverse proxy, automatic HTTPS (Let's Encrypt), WS/SSE upgrade support
├── frontend     # Vite static build (served by Caddy or an nginx container)
├── backend      # FastAPI via gunicorn + uvicorn workers (REST + WS + SSE)
└── postgres     # postgis/postgis image, named volume, nightly pg_dump backups
                 # Documents live in Hetzner Object Storage (S3-compatible), not on the VPS
```

Routing via Caddy for **`agrifetch.co.za`**: `/api/*` and `/ws/*` → `backend`; everything else → static `frontend`. Caddy passes `Upgrade`/`Connection` headers so WebSockets work, and auto-provisions a Let's Encrypt certificate for the domain.

## Phase D — Deployment

### Task D1 — Containerization
- **Deliverables:**
  - `frontend/Dockerfile` (multi-stage: build Vite → serve static).
  - `backend/Dockerfile` (Python slim, gunicorn + uvicorn workers).
  - Root `docker-compose.yml` (caddy, frontend, backend, postgis) + `Caddyfile`.
  - `.env.example` documenting all runtime secrets (DB URL, JWT secret, Hetzner Object Storage access key/secret/bucket/endpoint URL, allowed origins).
  - Named volume for Postgres; **documents stored in Hetzner Object Storage**, not on disk.

### Task D2 — Provision Hetzner VPS (CAX11 / ARM)
- **Deliverables:**
  - CAX11 instance (Ubuntu LTS), SSH-key only, firewall (allow 80/443/22), `fail2ban`.
  - Docker + Docker Compose plugin installed.
  - Dedicated non-root deploy user; DNS **A** (and **AAAA** for IPv6) records for `agrifetch.co.za` pointed at the VPS so Caddy can issue HTTPS. Add a `www` CNAME → apex if desired.

### Task D3 — CI/CD via GitHub Actions (free tier)
- **Deliverables:**
  - `.github/workflows/ci.yml`: lint + typecheck + tests (frontend Vitest, backend Pytest) on PRs.
  - `.github/workflows/deploy.yml` on push to `main`:
    1. `docker buildx` build **`linux/arm64`** images (required for CAX11 ARM) for frontend + backend.
    2. Push to **GHCR** (`ghcr.io/<owner>/agrifetch-*`).
    3. SSH to the VPS (deploy key in GitHub Secrets) → `docker compose pull && docker compose up -d` → prune old images.
  - GitHub Secrets: `SSH_HOST`, `SSH_USER`, `SSH_KEY`, `GHCR_TOKEN`, plus app secrets injected via server-side `.env`.
- **Note:** ARM is the one extra step vs. x86 — multi-arch `buildx` instead of a plain `docker build`. Everything else is identical.

### Task D4 — Operations
- **Deliverables:**
  - Health checks (`GET /healthz`) + Compose `healthcheck` + restart policies.
  - Nightly `pg_dump` uploaded to a Hetzner Object Storage backup bucket; enable bucket versioning/lifecycle for documents.
  - Alembic migrations run on deploy (one-shot container step before `up`).
  - Basic logging/monitoring (container logs; optional uptime check).

> **Cost note:** GitHub Actions + GHCR are free at this scale; the only paid components are the Hetzner CAX11 (~€4/mo) plus Hetzner Object Storage (low monthly base + usage).

---

## 5. Updated Execution Order (Milestones)

1. **M1 – Foundations:** F1.1, F1.2, B0, B1.1 (scaffold + tokens + schema).
2. **M2 – Static UI:** F2.1, F2.2, F3.1–F3.4 against typed mocks.
3. **M3 – Read APIs:** B2.1, B2.2 (S3 signed URLs); wire Marketplace + Procurement + Logistics via TanStack Query.
4. **M4 – Realtime:** B3.1, B3.2; F4.1 HUD/ticker/parallax connected to live streams.
5. **M5 – Hardening:** auth, a11y pass, tests, seed data.
6. **M6 – Deployment:** D1–D4 (containerize → provision CAX11 → GitHub Actions arm64 CI/CD → ops).
