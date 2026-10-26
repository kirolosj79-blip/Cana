# Koinonia — Christian Marriage Platform (Phase 1 Prototype)

React + Vite + TypeScript + Tailwind v4 prototype. No backend — everything runs on mock data in-memory / localStorage via Zustand.

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:5173

## Build
```bash
npm run build
```

## Stack
React 19, Vite, TypeScript, Tailwind CSS v4, React Router, Zustand, React Query, React Hook Form + Zod (installed, ready for stricter validation), Framer Motion, Lucide Icons.

## Structure
See `src/features/*` for each domain (auth, registration, matches, profile, requests, payment, notifications, complaints, settings, admin), `src/shared` for the reusable UI kit and layout, `src/store` for Zustand stores, `src/types` for the full data model extracted from the business requirements PDF.

## Migrating to React Native / Expo
Business logic lives in `store/`, `types/`, and `services/mock` — all framework-agnostic. UI in `shared/components/ui` and `features/*/steps|screens` uses Tailwind classes and DOM elements and will need to be re-authored as Native components, but the state management, data shapes, and screen/flow structure carry over directly.
