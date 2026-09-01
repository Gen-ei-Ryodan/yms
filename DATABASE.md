# Database

The schema follows the single-source-of-truth flow:

`students -> class_enrollments -> classes -> class_schedules -> attendances`

Financial records flow through `subscriptions -> invoices -> payments`. Loyalty balances are derived from `loyalty_transactions`, never stored as a mutable balance. Historical entities use soft deletes where appropriate; attendance, payment, invoice, loyalty, and audit records are transactional history.

Development currently uses SQLite. Production can use MySQL or PostgreSQL through Laravel's standard connection configuration.
