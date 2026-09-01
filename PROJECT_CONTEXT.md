# YMS Project Context

Yamaha Music School Management System terdiri dari API Laravel dan dashboard Next.js.

## Current scope

- Laravel 13 API dengan Sanctum, SQLite untuk development, dan Spatie Permission.
- Domain inti: students, guardians, teachers, courses, levels, rooms, classes, schedules, enrollments, attendance, payments, subscriptions, loyalty, rewards, vouchers, leaves, transfers, reports, dan audit logs.
- Next.js App Router dashboard dengan role-aware navigation.
- Create, edit, dan detail view pada modul dashboard menggunakan right-side slide panel.

## Development commands

```bash
cd yms-backend && php artisan migrate && php artisan test
cd ../yms-frontend && npm run build
```

Timezone bisnis: `Asia/Jakarta`.
