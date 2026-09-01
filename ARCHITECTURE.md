# Architecture

## Repository layout

```text
brief.md
yms-backend/   Laravel REST API
yms-frontend/  Next.js App Router dashboard
```

## Backend

- `app/Models`: Eloquent models and relationships.
- `app/Http/Controllers/Api`: JSON API controllers.
- `database/migrations`: relational schema, foreign keys, indexes, and soft deletes.
- `routes/api.php`: versioned API under `/api/v1`.
- Sanctum bearer tokens protect authenticated endpoints.

## Frontend

- `src/app`: role-aware dashboard and module pages.
- `src/components`: shared layout, statistics, and right-side `SlidePanel` UI.
- `src/components/ui`: reusable Tailwind/Radix primitives.
- Axios uses `NEXT_PUBLIC_API_URL` (default `http://localhost:8000/api/v1`).
