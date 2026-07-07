# RailBite Web

## Overview

`railbite-web` is the customer-facing frontend for RailBite, a railway food-ordering platform.
Passengers search their train/PNR, browse restaurants available at their delivery station,
place an order, pay online (or COD where enabled), and track delivery to their coach/seat.

Built as a React 18 + TypeScript single-page application on Vite, using TanStack Query for
server state, Zustand for client state (auth/cart/UI), React Hook Form + Zod for forms, and
Tailwind CSS for styling. See the RailBite TRD (Section 1–8) for full architectural rationale.

## Prerequisites

- Node.js 18.17+ (or 20.x LTS)
- npm 9+
- A running instance of `railbite-api` (or a reachable API base URL)

## Getting Started

1. `npm install`
2. Copy `.env.local` and adjust `VITE_API_BASE_URL` / `VITE_RAZORPAY_KEY_ID` if needed.
3. `npm run dev`
4. Open `http://localhost:5173`
5. Run `npm run typecheck` and `npm run lint` before committing.

## Environment Variables

All frontend environment variables must be prefixed with `VITE_` to be exposed to client code
(Section 24.3). Defined in `.env.local` (dev) and `.env.production` (prod, real values injected
via CI/CD secrets):

| Variable                | Description                                             |
| ------------------------ | -------------------------------------------------------- |
| `VITE_API_BASE_URL`      | Base URL of the `railbite-api` backend, including `/api/v1` |
| `VITE_RAZORPAY_KEY_ID`   | Razorpay publishable Key ID (never the Key Secret)        |

## Available Scripts

| Script                | Purpose                                          |
| --------------------- | ------------------------------------------------- |
| `npm run dev`         | Start Vite dev server with HMR                    |
| `npm run build`       | Type-check then produce a production build        |
| `npm run preview`     | Preview the production build locally               |
| `npm run typecheck`   | Run `tsc --noEmit`                                 |
| `npm run lint`        | Run ESLint (zero warnings allowed)                 |
| `npm run lint:fix`    | Run ESLint with `--fix`                            |
| `npm run format`      | Format source with Prettier                        |
| `npm test`            | Run unit tests with Vitest                         |

## Folder Structure

```
src/
├── assets/       # Images, fonts, icons (imported, not public/)
├── components/   # Shared UI: ui/ (atomic), layout/ (shell), feedback/ (toast, empty state, error boundary)
├── config/       # Typed env wrapper + app-wide constants
├── features/     # Vertical-slice feature modules (auth, restaurants, cart, checkout, ...)
├── hooks/        # Global shared hooks (useDebounce, usePagination, ...)
├── lib/          # Third-party config: axios instance, TanStack Query client, Razorpay loader
├── providers/    # React context providers (Auth, Toast)
├── routes/       # Route path constants + router configuration + guards
├── store/        # Zustand stores (auth, cart, ui)
├── types/        # Global TypeScript types (API envelope, domain models)
├── utils/        # Pure utility functions (formatters, error parsing, query builder, cn, debounce)
├── App.tsx       # Root component; provider tree
└── main.tsx      # Vite entry point
```

## API Documentation

The backend exposes Swagger UI at `/api/docs` on non-production environments. See the
`railbite-api` repository README for local setup.

## Testing

Unit tests run via Vitest + React Testing Library, co-located with source files
(`*.test.ts` / `*.test.tsx`). Run with `npm test`.

## Deployment

Built as static assets (`npm run build` → `dist/`) and deployed to Cloudflare Pages,
auto-deployed from CI on merge to `develop` (dev), `staging`, and `main` (production).

## Contributing

See `CONTRIBUTING.md` (workflow, branch naming, commit conventions) — Conventional Commits
format is required for all commit messages (Section 23.2).
