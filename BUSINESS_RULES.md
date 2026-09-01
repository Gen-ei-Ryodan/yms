# Business Rules

- A class cannot exceed capacity.
- Teacher, room, and class schedules cannot overlap on the same day.
- Attendance is unique per student, schedule, and date.
- Attendance status is `PRESENT` or `LATE` according to the configurable late threshold.
- Approved leave maps attendance to `ON_LEAVE`.
- Class transfer approval closes the old enrollment and creates a new active enrollment while preserving history.
- Loyalty is ledger-based; redemption requires sufficient points and available stock and runs transactionally.
- Voucher codes are unique and expire according to their validity dates.
- Payment and invoice mutations are audited.
