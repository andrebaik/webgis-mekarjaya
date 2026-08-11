# WebGIS Mekarjaya — Frontend

React 19 + Vite 8 + TypeScript + Tailwind CSS v4 (via `@tailwindcss/vite`) application for the WebGIS Desa Mekarjaya project.

## Scripts

| Command            | Description                                  |
| ------------------ | -------------------------------------------- |
| `npm run dev`      | Start the Vite dev server (`http://localhost:5173`) |
| `npm run build`    | Type-check (`tsc -b`) then build (`vite build`) |
| `npm run lint`     | Run Oxlint (`.oxlintrc.json`)                |
| `npm run preview`  | Preview the production build                 |

## Stack Notes

- **Data fetching:** TanStack Query hooks in `src/hooks/` talking to the Express API via `src/services/api.ts` (Axios).
- **Maps:** Leaflet + `react-leaflet` v5 + `react-leaflet-cluster`.
- **Styling:** Tailwind v4 with design tokens declared in `src/index.css` via `@theme` (no JS config file). Dark mode via a `.dark` class on `<html>`.
- **i18n:** `i18next` with a single `id` (Indonesian) locale in `src/lib/i18n.ts`, kept as the central string catalog.
- **UI primitives:** shadcn/ui components in `src/components/ui/`.

## Backend dependency

The app expects the Express backend from the repository root (`backend/`) to be running on `http://localhost:5000`. Override with `VITE_API_URL` if needed.
