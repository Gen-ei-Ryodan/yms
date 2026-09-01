# Changelog

## 2026-09-01

- Added Laravel 13 API foundation and relational schema for YMS.
- Added Sanctum authentication, role field, audit logging, CRUD/workflow endpoints, dashboard KPI endpoints, and reports.
- Added Next.js dashboard pages with responsive navigation and right-side create/edit/show panels.
- Fixed Tailwind CSS: migrated globals.css from v3 directives to v4 `@import "tailwindcss"` + `@theme` blocks.
- Added comprehensive DatabaseSeeder with 8 user accounts (admin, teacher, student, parent), 4 courses, 4 levels, 3 rooms, 2 classes, schedules, enrollments, memberships, tuition products, subscriptions, invoices, payments, loyalty tiers/rules/transactions, rewards, redemptions, vouchers, and system settings.
- Published Sanctum `personal_access_tokens` migration (required for `createToken()`).
- All demo accounts use password: `password`.
