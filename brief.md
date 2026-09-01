# YAMAHA MUSIC SCHOOL

## Laravel System Specification

**Project:** Yamaha Music School Management System
**Framework:** Laravel
**Architecture:** Laravel + MySQL/PostgreSQL + REST API
**Frontend:** Laravel Blade / Livewire / Vue atau React
**Authentication:** Laravel Breeze/Fortify + Role & Permission
**QR/Barcode:** QR Code / Barcode Scanner
**Timezone:** Asia/Jakarta

---

# 1. SYSTEM OBJECTIVE

Sistem digunakan untuk mengelola operasional Yamaha Music School secara terintegrasi:

* Student Management
* Parent / Guardian Management
* Teacher Management
* Class Management
* Attendance
* Payment & Subscription
* Loyalty Program
* Voucher / Reward
* Leave / Cuti
* Class Transfer
* Dashboard
* Reports
* Notification

Semua data harus saling terhubung.

Contoh:

```text
Student
   ↓
Enrollment
   ↓
Course / Class
   ↓
Teacher
   ↓
Schedule
   ↓
Attendance
   ↓
Payment / Subscription
   ↓
Loyalty Points
   ↓
Reward
```

---

# 2. USER ROLES

## 2.1 Super Admin

Full access terhadap seluruh sistem.

Permission:

* Manage users
* Manage students
* Manage parents
* Manage teachers
* Manage classes
* Manage courses
* Manage rooms
* Manage attendance
* Manage payments
* Manage loyalty
* Manage rewards
* Manage reports
* Manage settings

---

## 2.2 Admin

Operasional sekolah.

Access:

* Student
* Parent
* Teacher
* Class
* Schedule
* Attendance
* Payment
* Loyalty
* Reports

Tidak dapat mengubah system configuration tertentu.

---

## 2.3 Teacher

Access:

* Dashboard
* My Schedule
* My Classes
* Student List
* Attendance
* Student Progress
* Attendance History

Teacher hanya dapat mengakses class yang ditugaskan kepadanya.

---

## 2.4 Student / Parent

Access:

* Profile
* Student Card
* Schedule
* Attendance
* Payment
* Subscription
* Loyalty Points
* Reward
* Voucher
* Leave / Cuti
* Class Transfer Request
* Notifications

---

# 3. AUTHENTICATION

## Login

Fields:

```text
email / phone
password
```

Optional:

```text
Remember Me
Forgot Password
OTP
```

---

# 4. STUDENT MANAGEMENT

## Student Profile

Fields:

```text
student_code
student_number
full_name
nickname
gender
date_of_birth
place_of_birth
photo
phone
email
address
school_name
school_grade
status
join_date
membership_status
```

Status:

```text
ACTIVE
INACTIVE
SUSPENDED
GRADUATED
TRANSFERRED
```

---

# 5. PARENT / GUARDIAN

Satu student dapat memiliki lebih dari satu guardian.

Table:

```text
guardians
```

Fields:

```text
id
name
relationship
phone
email
address
is_primary
```

Relationship:

```text
Father
Mother
Guardian
Other
```

Pivot:

```text
student_guardian
```

---

# 6. STUDENT MEMBERSHIP

Membership menyimpan status keanggotaan student.

Fields:

```text
membership_number
student_id
membership_type
start_date
end_date
status
```

Status:

```text
ACTIVE
EXPIRED
SUSPENDED
CANCELLED
```

---

# 7. COURSE MANAGEMENT

Course merupakan produk pembelajaran.

Contoh:

```text
Piano
Keyboard
Guitar
Drum
Vocal
```

Fields:

```text
id
code
name
description
duration
level
price
status
```

Status:

```text
ACTIVE
INACTIVE
```

---

# 8. LEVEL MANAGEMENT

Contoh:

```text
Beginner
Basic
Intermediate
Advanced
Grade 1
Grade 2
Grade 3
```

Fields:

```text
id
name
code
description
sequence
```

---

# 9. CLASS MANAGEMENT

Class adalah kelompok pembelajaran.

Fields:

```text
id
class_code
course_id
level_id
teacher_id
room_id
capacity
status
start_date
end_date
```

Status:

```text
ACTIVE
INACTIVE
FULL
COMPLETED
```

---

# 10. CLASS ENROLLMENT

Student dapat masuk ke class tertentu.

Table:

```text
class_enrollments
```

Fields:

```text
id
student_id
class_id
enrolled_at
start_date
end_date
status
```

Status:

```text
ACTIVE
TRANSFERRED
COMPLETED
DROPPED
ON_LEAVE
```

Satu student dapat memiliki history class.

Jangan overwrite data lama.

---

# 11. CLASS TRANSFER

Perpindahan kelas harus memiliki history.

Table:

```text
class_transfers
```

Fields:

```text
id
student_id
from_class_id
to_class_id
reason
requested_at
approved_at
approved_by
status
notes
```

Status:

```text
PENDING
APPROVED
REJECTED
CANCELLED
```

Workflow:

```text
Student / Admin
      ↓
Transfer Request
      ↓
Admin Approval
      ↓
Old Enrollment Closed
      ↓
New Enrollment Created
      ↓
History Recorded
```

---

# 12. ROOM MANAGEMENT

Fields:

```text
id
room_code
name
capacity
location
status
```

Sistem harus mencegah:

```text
Room A
09:00 - 10:00
Class X

Room A
09:30 - 10:30
Class Y
```

karena terjadi schedule conflict.

---

# 13. TEACHER MANAGEMENT

Fields:

```text
id
teacher_code
name
email
phone
photo
specialization
join_date
status
```

Status:

```text
ACTIVE
INACTIVE
```

Teacher dapat memiliki banyak class.

---

# 14. CLASS SCHEDULE

Table:

```text
class_schedules
```

Fields:

```text
id
class_id
teacher_id
room_id
day_of_week
start_time
end_time
effective_from
effective_until
status
```

Contoh:

```text
Monday
16:00 - 17:00
Piano Beginner
Room 02
Teacher A
```

System harus melakukan conflict detection:

```text
Teacher conflict
Room conflict
Class conflict
```

---

# 15. ATTENDANCE SYSTEM

Attendance menggunakan QR / Barcode.

## Check-in Flow

```text
Student
   ↓
Scan QR / Barcode
   ↓
Validate Student
   ↓
Validate Active Enrollment
   ↓
Validate Schedule
   ↓
Check duplicate attendance
   ↓
Create Attendance
```

---

# 16. ATTENDANCE TYPES

```text
PRESENT
LATE
ABSENT
EXCUSED
ON_LEAVE
```

---

# 17. ATTENDANCE TABLE

```text
attendances
```

Fields:

```text
id
student_id
class_id
schedule_id
attendance_date
check_in_time
check_out_time
status
method
notes
recorded_by
```

Method:

```text
QR
BARCODE
MANUAL
```

---

# 18. TEACHER ATTENDANCE

Table:

```text
teacher_attendances
```

Fields:

```text
id
teacher_id
date
check_in
check_out
status
method
notes
```

Status:

```text
PRESENT
LATE
ABSENT
LEAVE
```

---

# 19. ATTENDANCE RULES

Contoh configuration:

```text
Late threshold = 10 minutes
```

Jika schedule:

```text
16:00
```

Student check-in:

```text
16:05 → PRESENT
16:15 → LATE
```

Threshold harus configurable dari system settings.

---

# 20. ATTENDANCE HISTORY

Student dapat melihat:

```text
Date
Class
Teacher
Schedule
Check-in
Status
```

Filter:

```text
Month
Class
Status
Teacher
```

---

# 21. ATTENDANCE REPORT

Report:

```text
Total Sessions
Present
Late
Absent
Excused
Leave
Attendance Rate
```

Formula:

```text
Attendance Rate =
(Present + Late) / Total Scheduled Sessions × 100
```

---

# 22. PAYMENT & SUBSCRIPTION

## Course / Tuition

Table:

```text
tuition_products
```

Fields:

```text
id
course_id
name
price
billing_type
duration
status
```

Billing:

```text
MONTHLY
PACKAGE
TERM
ONE_TIME
```

---

# 23. STUDENT SUBSCRIPTION

Table:

```text
subscriptions
```

Fields:

```text
id
student_id
product_id
start_date
end_date
price
status
auto_renew
```

Status:

```text
ACTIVE
EXPIRED
CANCELLED
PENDING
```

---

# 24. PAYMENT

Table:

```text
payments
```

Fields:

```text
id
payment_number
student_id
subscription_id
amount
payment_date
due_date
payment_method
status
reference
notes
```

Payment method:

```text
CASH
BANK_TRANSFER
CREDIT_CARD
DEBIT_CARD
EWALLET
OTHER
```

Status:

```text
PENDING
PAID
PARTIAL
FAILED
CANCELLED
REFUNDED
```

---

# 25. INVOICE

Table:

```text
invoices
```

Fields:

```text
id
invoice_number
student_id
subscription_id
issue_date
due_date
subtotal
discount
tax
total
status
```

Invoice status:

```text
DRAFT
UNPAID
PARTIAL
PAID
OVERDUE
CANCELLED
```

---

# 26. PAYMENT HISTORY

Student / Parent dapat melihat:

```text
Invoice
Amount
Payment Date
Payment Method
Status
Receipt
```

Admin dapat melakukan:

```text
Search
Filter
Export
Print
```

---

# 27. RENEWAL REMINDER

System harus mendeteksi subscription yang akan expired.

Contoh:

```text
30 days before
14 days before
7 days before
3 days before
1 day before
```

Notification dapat dikirim melalui:

```text
In-app notification
Email
WhatsApp (optional integration)
```

---

# 28. LOYALTY PROGRAM

Loyalty menggunakan point ledger.

Jangan hanya menyimpan balance.

Gunakan:

```text
loyalty_transactions
```

---

# 29. POINT EARNING

Contoh rules:

```text
Payment
Attendance
Registration
Referral
Promotion
Event
```

Table:

```text
loyalty_rules
```

Fields:

```text
id
name
event_type
points
conditions
status
```

Contoh:

```text
Payment Rp100.000
= 100 points
```

---

# 30. LOYALTY TRANSACTION

Fields:

```text
id
student_id
type
points
reference_type
reference_id
description
expired_at
created_at
```

Type:

```text
EARN
REDEEM
EXPIRED
ADJUSTMENT
REVERSAL
```

Balance dihitung dari transaction ledger.

```text
Balance =
SUM(EARN)
- SUM(REDEEM)
- SUM(EXPIRED)
+ SUM(ADJUSTMENT)
```

---

# 31. POINT BALANCE

Dashboard Student:

```text
Current Points
Available Points
Expiring Points
Next Expiration
Membership Tier
```

---

# 32. POINT EXPIRATION

Point dapat memiliki expiry date.

Contoh:

```text
Earned:
01 September 2026

Expired:
01 September 2027
```

System harus otomatis menandai point yang expired.

---

# 33. LOYALTY TIER

Contoh:

```text
Bronze
Silver
Gold
Platinum
```

Table:

```text
loyalty_tiers
```

Fields:

```text
id
name
minimum_points
maximum_points
benefits
status
```

Tier dapat digunakan untuk:

```text
Bonus points
Discount
Special reward
Priority service
Voucher
```

---

# 34. REWARD CATALOG

Table:

```text
rewards
```

Fields:

```text
id
code
name
description
image
points_required
stock
start_date
end_date
status
```

Contoh:

```text
Yamaha Merchandise
500 points

Music Accessories
1,000 points

Course Discount
2,000 points
```

---

# 35. POINT REDEMPTION

Flow:

```text
Student
 ↓
Select Reward
 ↓
Check Point Balance
 ↓
Check Stock
 ↓
Redeem
 ↓
Deduct Point
 ↓
Create Redemption
 ↓
Generate Voucher
```

Table:

```text
reward_redemptions
```

Fields:

```text
id
redemption_number
student_id
reward_id
points_used
status
redeemed_at
approved_at
fulfilled_at
```

Status:

```text
PENDING
APPROVED
FULFILLED
REJECTED
CANCELLED
```

---

# 36. VOUCHER

Table:

```text
vouchers
```

Fields:

```text
id
code
reward_id
student_id
discount_type
discount_value
minimum_transaction
valid_from
valid_until
status
used_at
```

Status:

```text
AVAILABLE
USED
EXPIRED
CANCELLED
```

Voucher code harus unique.

---

# 37. LEAVE / CUTI

Student dapat mengajukan cuti.

Table:

```text
student_leaves
```

Fields:

```text
id
student_id
start_date
end_date
reason
notes
status
requested_at
approved_at
approved_by
```

Status:

```text
PENDING
APPROVED
REJECTED
CANCELLED
```

Jika approved:

```text
Attendance
→ ON_LEAVE
```

Student tidak dianggap absent selama periode cuti.

---

# 38. NOTIFICATION SYSTEM

Gunakan Laravel Notification.

Notification types:

```text
Attendance
Payment
Invoice
Subscription
Renewal
Loyalty
Reward
Voucher
Class Transfer
Leave
System
```

Table Laravel standard:

```text
notifications
```

User dapat:

```text
Mark as read
Mark all as read
Delete
```

---

# 39. DASHBOARD ADMIN

Dashboard menampilkan:

## Student

```text
Total Students
Active Students
Inactive Students
New Students
Students on Leave
```

## Attendance

```text
Today's Attendance
Attendance Rate
Late Students
Absent Students
```

## Class

```text
Active Classes
Today's Classes
Available Capacity
Full Classes
```

## Payment

```text
Today's Revenue
Monthly Revenue
Outstanding Payment
Overdue Invoice
```

## Loyalty

```text
Total Points Issued
Points Redeemed
Active Members
Reward Redemption
```

---

# 40. DASHBOARD TEACHER

```text
Today's Classes
Upcoming Classes
Total Students
Attendance Today
Pending Attendance
```

Example:

```text
Today's Schedule

16:00 - Piano Beginner
17:00 - Piano Intermediate
18:00 - Keyboard Basic
```

---

# 41. STUDENT DASHBOARD

```text
Membership Status
Current Class
Teacher
Next Schedule
Attendance Rate
Payment Status
Subscription Expiry
Loyalty Points
Available Rewards
Active Voucher
```

---

# 42. REPORTING

## Student Report

Filter:

```text
Course
Level
Class
Teacher
Status
Join Date
```

Export:

```text
Excel
CSV
PDF
```

---

## Attendance Report

```text
Date
Student
Class
Teacher
Present
Late
Absent
Leave
Attendance Rate
```

---

## Revenue Report

```text
Date
Invoice
Student
Amount
Payment Method
Status
```

---

## Loyalty Report

```text
Student
Points Earned
Points Redeemed
Points Expired
Current Balance
Tier
```

---

# 43. DATABASE STRUCTURE

Recommended core tables:

```text
users

students
guardians
student_guardian
memberships

teachers

courses
levels

rooms
classes
class_enrollments
class_schedules
class_transfers

attendances
teacher_attendances

tuition_products
subscriptions
invoices
payments

loyalty_tiers
loyalty_rules
loyalty_transactions

rewards
reward_redemptions
vouchers

student_leaves

notifications

system_settings

audit_logs
```

---

# 44. IMPORTANT DATABASE RELATIONSHIPS

```text
User
 ├── Student
 └── Teacher

Student
 ├── Guardians
 ├── Membership
 ├── Enrollments
 ├── Attendances
 ├── Subscriptions
 ├── Payments
 ├── Loyalty Transactions
 ├── Reward Redemptions
 ├── Vouchers
 └── Leaves

Course
 ├── Levels
 ├── Classes
 └── Tuition Products

Class
 ├── Teacher
 ├── Room
 ├── Schedule
 ├── Enrollments
 └── Attendance

Reward
 ├── Redemptions
 └── Vouchers
```

---

# 45. LARAVEL MODEL STRUCTURE

Recommended Models:

```text
User
Student
Guardian
Membership

Teacher

Course
Level
Room
ClassModel
ClassEnrollment
ClassSchedule
ClassTransfer

Attendance
TeacherAttendance

TuitionProduct
Subscription
Invoice
Payment

LoyaltyTier
LoyaltyRule
LoyaltyTransaction

Reward
RewardRedemption
Voucher

StudentLeave
SystemSetting
AuditLog
```

> `Class` sebaiknya menggunakan nama model `ClassModel` atau nama lain yang tidak bentrok dengan PHP reserved keyword / penggunaan internal.

---

# 46. LARAVEL MODULE STRUCTURE

Recommended:

```text
app/
├── Models/
├── Http/
│   ├── Controllers/
│   ├── Requests/
│   └── Resources/
├── Services/
│   ├── AttendanceService.php
│   ├── LoyaltyService.php
│   ├── PaymentService.php
│   ├── SubscriptionService.php
│   ├── ClassTransferService.php
│   └── NotificationService.php
├── Notifications/
├── Jobs/
├── Policies/
└── Console/
    └── Commands/
```

---

# 47. SERVICE LAYER

Business logic jangan ditaruh seluruhnya di Controller.

## AttendanceService

Responsibilities:

```text
validateSchedule()
validateStudent()
checkDuplicate()
calculateStatus()
recordAttendance()
```

## LoyaltyService

```text
earnPoints()
redeemPoints()
expirePoints()
calculateBalance()
updateTier()
```

## PaymentService

```text
createInvoice()
recordPayment()
calculateOutstanding()
markOverdue()
```

## SubscriptionService

```text
createSubscription()
renewSubscription()
expireSubscription()
checkRenewal()
```

---

# 48. SCHEDULED JOBS / CRON

Laravel Scheduler digunakan untuk:

```text
Expire loyalty points
Expire subscriptions
Mark overdue invoices
Send renewal reminders
Send attendance notifications
Process pending notifications
```

Contoh:

```text
Every day:
- Check expired subscription
- Check expired points
- Check overdue invoice
- Send renewal reminder
```

---

# 49. API ENDPOINT STRUCTURE

Prefix:

```text
/api/v1
```

## Authentication

```http
POST /login
POST /logout
POST /forgot-password
```

## Students

```http
GET    /students
POST   /students
GET    /students/{id}
PUT    /students/{id}
DELETE /students/{id}
```

## Classes

```http
GET    /classes
POST   /classes
GET    /classes/{id}
PUT    /classes/{id}
DELETE /classes/{id}
```

## Attendance

```http
POST /attendance/check-in
GET  /attendance
GET  /attendance/student/{student}
```

## Payments

```http
GET  /payments
POST /payments
GET  /payments/{id}
```

## Loyalty

```http
GET  /loyalty/balance
GET  /loyalty/transactions
POST /loyalty/redeem
```

## Rewards

```http
GET  /rewards
GET  /rewards/{id}
POST /rewards/{id}/redeem
```

## Leave

```http
POST /leaves
GET  /leaves
PUT  /leaves/{id}/approve
PUT  /leaves/{id}/reject
```

## Class Transfer

```http
POST /class-transfers
GET  /class-transfers
PUT  /class-transfers/{id}/approve
PUT  /class-transfers/{id}/reject
```

---

# 50. QR / BARCODE

Setiap student memiliki identifier unik:

```text
student_code
```

QR dapat berisi:

```text
student_code
```

atau signed token.

Lebih aman menggunakan signed token daripada memasukkan informasi pribadi student secara langsung.

Contoh:

```text
YMS-STU-000123
```

Scanner:

```text
Camera
 ↓
Scan
 ↓
Decode
 ↓
Find Student
 ↓
Validate
 ↓
Attendance
```

---

# 51. ATTENDANCE NOTIFICATION

Jika student berhasil check-in:

```text
Attendance Recorded
Class: Piano Beginner
Time: 16:05
Status: Present
```

Jika terlambat:

```text
Late Attendance
```

Parent dapat menerima notification.

---

# 52. AUDIT LOG

Semua aktivitas penting harus dicatat.

Table:

```text
audit_logs
```

Fields:

```text
id
user_id
action
module
record_type
record_id
old_values
new_values
ip_address
user_agent
created_at
```

Contoh:

```text
Admin approved class transfer
Admin changed student class
Admin recorded payment
Admin adjusted loyalty points
```

---

# 53. SECURITY

Wajib menggunakan:

```text
Laravel Authentication
CSRF Protection
Authorization Policy
Role Permission
Form Request Validation
Rate Limiting
Password Hashing
Signed URL / Token
Audit Log
```

Jangan memperbolehkan:

```text
Teacher melihat data pembayaran seluruh student
Student mengakses student lain
Student mengubah attendance
Student mengubah loyalty balance
```

---

# 54. PERMISSION MATRIX

| Module     | Super Admin |   Admin |        Teacher |         Student |
| ---------- | ----------: | ------: | -------------: | --------------: |
| Students   |        CRUD |    CRUD |           View |             Own |
| Teachers   |        CRUD |    CRUD |            Own |            View |
| Classes    |        CRUD |    CRUD |           View |            View |
| Schedule   |        CRUD |    CRUD |            Own |             Own |
| Attendance |        CRUD |    CRUD | CRUD Own Class |        View Own |
| Payment    |        CRUD |    CRUD |              - |        View Own |
| Loyalty    |        CRUD |    CRUD |              - | View/Redeem Own |
| Reward     |        CRUD |    CRUD |              - |     View/Redeem |
| Leave      |        CRUD | Approve |           View |         Request |
| Transfer   |        CRUD | Approve |           View |         Request |
| Reports    |         All |    Most |      Own Class |             Own |

---

# 55. UI MENU — ADMIN

```text
Dashboard

Student Management
├── Students
├── Guardians
├── Membership
└── Student History

Academic
├── Courses
├── Levels
├── Classes
├── Class Enrollment
├── Schedule
├── Teachers
└── Rooms

Attendance
├── Student Attendance
├── Teacher Attendance
├── Attendance History
└── Attendance Report

Payment
├── Tuition
├── Subscriptions
├── Invoices
├── Payments
└── Payment Report

Loyalty
├── Loyalty Dashboard
├── Transactions
├── Tiers
├── Rules
├── Rewards
├── Redemptions
└── Vouchers

Student Requests
├── Class Transfer
└── Leave / Cuti

Reports
├── Student Report
├── Attendance Report
├── Class Report
├── Revenue Report
└── Loyalty Report

Settings
├── Users
├── Roles & Permissions
├── Notifications
└── System Settings
```

---

# 56. UI MENU — STUDENT / PARENT

```text
Dashboard

My Profile

My Class
├── Current Class
├── Schedule
└── Teacher

Attendance
└── Attendance History

Payment
├── Subscription
├── Invoice
└── Payment History

Loyalty
├── Points
├── Transactions
├── Rewards
└── Vouchers

Request
├── Class Transfer
└── Leave / Cuti

Notifications
```

---

# 57. BUSINESS RULES

## Student

Student hanya dapat memiliki enrollment aktif sesuai aturan sekolah.

## Class

Class tidak boleh melebihi capacity.

## Schedule

Tidak boleh terjadi:

```text
Teacher double booking
Room double booking
Class double booking
```

## Attendance

Tidak boleh ada duplicate attendance pada:

```text
student + schedule + date
```

## Payment

Payment tidak boleh melebihi outstanding amount kecuali overpayment memang diizinkan.

## Loyalty

Point tidak boleh menjadi negatif.

## Reward

Tidak dapat redeem jika:

```text
points < required_points
```

atau:

```text
stock <= 0
```

## Leave

Attendance selama leave approved harus:

```text
ON_LEAVE
```

## Transfer

Transfer harus menyimpan:

```text
old class
new class
reason
approval
timestamp
```

---

# 58. DASHBOARD KPI

Minimum KPI:

```text
Total Students
Active Students
New Students
Students on Leave

Attendance Rate
Present Today
Late Today
Absent Today

Active Classes
Available Class Capacity

Monthly Revenue
Outstanding Payment
Overdue Invoice

Total Loyalty Points
Points Redeemed
Active Loyalty Members

Reward Redemption
```

---

# 59. SEARCH & FILTER

Semua data utama harus mendukung:

```text
Search
Filter
Sort
Pagination
Export
```

Student search:

```text
Student Name
Student Code
Phone
Email
Class
Teacher
Status
```

---

# 60. DATA EXPORT

Report dapat di-export:

```text
Excel
CSV
PDF
```

Gunakan queue untuk export data besar.

---

# 61. DATABASE INDEXING

Index yang wajib:

```text
students.student_code
students.status

attendances.student_id
attendances.class_id
attendances.attendance_date

payments.student_id
payments.status
payments.payment_date

subscriptions.student_id
subscriptions.status
subscriptions.end_date

loyalty_transactions.student_id
loyalty_transactions.type

class_schedules.class_id
class_schedules.teacher_id
class_schedules.room_id
```

Unique index:

```text
student_code
payment_number
invoice_number
redemption_number
voucher.code
```

---

# 62. SOFT DELETE

Gunakan SoftDeletes untuk data yang membutuhkan history:

```text
Student
Teacher
Course
Class
Reward
Voucher
```

Jangan benar-benar menghapus historical transaction.

Transaction:

```text
Attendance
Payment
Invoice
Loyalty Transaction
Audit Log
```

sebaiknya tidak dihapus secara normal.

---

# 63. TRANSACTION SAFETY

Operasi penting wajib menggunakan database transaction.

Contoh redeem:

```php
DB::transaction(function () {

    // validate points

    // validate reward stock

    // create redemption

    // create loyalty transaction

    // decrease stock

});
```

Jika salah satu gagal:

```text
ROLLBACK
```

---

# 64. TESTING

Minimum Laravel test:

## Feature Test

```text
Student CRUD
Class CRUD
Enrollment
Attendance Check-in
Duplicate Attendance
Payment
Invoice
Subscription
Loyalty Earning
Loyalty Redemption
Reward Stock
Voucher
Leave Approval
Class Transfer
Permission
```

## Security Test

Pastikan:

```text
Student A tidak bisa melihat Student B
Teacher A tidak bisa mengubah attendance Teacher/Class lain
Admin permission berjalan
Unauthorized API ditolak
```

---

# 65. DEVELOPMENT PHASE

## Phase 1 — Foundation

```text
Authentication
Users
Roles
Permissions
Database
Student
Guardian
Teacher
Course
Level
```

## Phase 2 — Academic

```text
Class
Room
Schedule
Enrollment
Class Transfer
Leave
```

## Phase 3 — Attendance

```text
QR
Barcode
Student Attendance
Teacher Attendance
History
Report
Notification
```

## Phase 4 — Payment

```text
Tuition
Subscription
Invoice
Payment
Renewal
Payment Report
```

## Phase 5 — Loyalty

```text
Points
Rules
Tier
Reward
Redemption
Voucher
Expiration
```

## Phase 6 — Dashboard & Reporting

```text
Dashboard
Analytics
Reports
Export
Audit Log
```

---

# 66. RECOMMENDED LARAVEL STACK

```text
Laravel
MySQL / PostgreSQL
Laravel Sanctum
Laravel Notifications
Laravel Queue
Laravel Scheduler
Laravel Policies
Laravel Events / Listeners
Laravel Jobs
Laravel Cache
```

Frontend dapat menggunakan:

```text
Laravel Blade + Livewire
```

untuk implementasi cepat.

Jika membutuhkan SPA:

```text
Laravel API
+
Vue / React
```

---

# 67. CORE PRINCIPLE

Sistem harus menggunakan **single source of truth**.

Contoh:

```text
Student
   ↓
Enrollment
   ↓
Class
   ↓
Schedule
   ↓
Attendance
```

Jangan membuat data student/class/attendance duplikat di module lain.

Untuk transaksi:

```text
Payment
→ Invoice
→ Subscription

Loyalty
→ Transaction Ledger
→ Balance
```

Untuk history:

```text
Enrollment History
Transfer History
Attendance History
Payment History
Loyalty History
```

Semua perubahan penting harus dapat ditelusuri.

---

# 68. FINAL SYSTEM FLOW

```text
                    YAMAHA MUSIC SCHOOL
                            │
             ┌──────────────┼──────────────┐
             │              │              │
          STUDENT         TEACHER        ADMIN
             │              │              │
             └──────────────┼──────────────┘
                            │
                       CLASS SYSTEM
                            │
              ┌─────────────┼─────────────┐
              │             │             │
           COURSE        SCHEDULE        ROOM
              │             │
              └──────┬──────┘
                     │
                 ENROLLMENT
                     │
                 ATTENDANCE
                     │
          ┌──────────┴──────────┐
          │                     │
       PAYMENT               LOYALTY
          │                     │
     SUBSCRIPTION           POINTS
          │                     │
       INVOICE              REWARD
          │                     │
       PAYMENT              VOUCHER
          │
       REPORT
          │
       DASHBOARD
```

---

# 69. DEFINITION OF DONE

Project dianggap selesai apabila:

* Semua role dapat login sesuai permission.
* Student dapat terdaftar dan memiliki guardian.
* Student dapat masuk class.
* Class memiliki teacher, room, capacity dan schedule.
* QR/Barcode dapat digunakan untuk attendance.
* Attendance otomatis menentukan Present/Late.
* Teacher dapat melakukan attendance class-nya.
* Payment dan invoice dapat dicatat.
* Subscription memiliki expiry.
* Renewal reminder berjalan otomatis.
* Loyalty point tercatat sebagai transaction ledger.
* Point dapat expired.
* Student dapat redeem reward.
* Voucher otomatis dibuat.
* Student dapat mengajukan cuti.
* Student dapat mengajukan class transfer.
* Admin dapat approve/reject request.
* Dashboard menampilkan KPI.
* Report dapat difilter dan diexport.
* Semua transaksi penting memiliki audit trail.
* Permission/security sudah dites.
* Tidak ada duplicate transaction pada attendance/payment/loyalty.
* Database menggunakan foreign key, index dan constraint yang tepat.

---

# 70. PRIORITY

## P0 — Wajib

```text
Authentication
Student
Teacher
Course
Class
Schedule
Enrollment
Attendance
Payment
Subscription
Dashboard
```

## P1 — Penting

```text
Loyalty
Reward
Voucher
Leave
Class Transfer
Notification
Reports
```

## P2 — Enhancement

```text
WhatsApp Integration
Online Payment Gateway
Advanced Analytics
Automated Marketing
Referral Program
Parent Mobile App
Push Notification
```

**Catatan:** P0 sebaiknya diselesaikan terlebih dahulu sebelum membangun loyalty dan fitur enhancement agar core academic + attendance + payment stabil.
