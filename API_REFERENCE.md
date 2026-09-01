# API Reference

Base URL: `/api/v1`

Authentication: `POST /login`, `POST /logout`, `GET /me`.

The API exposes CRUD resources for `students`, `guardians`, `teachers`, `courses`, `levels`, `rooms`, `classes`, `enrollments`, `schedules`, `tuition-products`, `subscriptions`, `invoices`, `payments`, `rewards`, `redemptions`, and `vouchers`.

Workflow endpoints include:

- `POST /attendance/check-in`
- `PUT /transfers/{id}/approve|reject|cancel`
- `PUT /leaves/{id}/approve|reject|cancel`
- `PUT /subscriptions/{id}/renew`
- `PUT /invoices/{id}/mark-overdue`
- `GET /loyalty/balance`, `GET /loyalty/transactions`, `POST /loyalty/earn`, `POST /loyalty/redeem`
- `PUT /redemptions/{id}/approve|fulfill|reject|cancel`
- `GET /reports/students|attendance|revenue|loyalty|classes`
- `GET /dashboard/admin|teacher|student`
