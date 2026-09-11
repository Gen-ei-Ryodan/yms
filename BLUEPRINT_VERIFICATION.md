# VERIFIKASI BLUEPRINT - YAMAHA MUSIC SCHOOL (TOMS)
# ═══════════════════════════════════════════════════

## R. ALUR UTAMA SISTEM ✅

### Flow Pendaftaran → Operasional
```
Pendaftaran Siswa        ✅ POST /students + /memberships
    ↓
Data Siswa              ✅ Student model (status, membership_status)
    ↓
Program & Level         ✅ Course + Level models
    ↓
Penempatan Kelas        ✅ ClassEnrollment (student_id, class_id, status)
    ↓
Jadwal                  ✅ ClassSchedule (class_id, day_of_week, start_time, end_time)
    ↓
┌───────────────────────────────┐
│                               │
↓                               ↓
ABSENSI                 ✅ PEMBAYARAN
Attendance              │ Invoice + Payment + Subscription
(present/late/absent)   │
↓                       ↓
RIWAYAT                LOYALTY POINT
AuditLog                LoyaltyTransaction (earn/redeem/adjust)
│                       │
│                       ↓
│                 REWARD / VOUCHER
│                   Reward + Voucher + RewardRedemption
│
↓
PROGRESS BELAJAR ← GURU
StudentProgress + LearningNote (teacher_id → auto-set)
│
↓
DASHBOARD ADMIN
├── Dashboard Siswa    ✅ /dashboard/student (kelas, progress, loyalty)
├── Dashboard Guru     ✅ /dashboard/teacher (jadwal, kelas, murid, honor)
├── Dashboard Operasional ✅ /dashboard/admin (6 section stats)
└── Laporan             ✅ /reports/* (students, attendance, revenue, loyalty, classes)
```

### Flow Aktivitas Siswa ✅
```
Siswa
↓
Dashboard Siswa
├── Lihat Kelas Aktif         ✅ /my-class
├── Lihat Jadwal              ✅ /my-class/schedule
├── Lihat Absensi             ✅ /attendance + /student/attendance-history
├── Lihat Progress            ✅ /progress
├── Lihat Pembayaran          ✅ /my-payments + /my-transactions
├── Lihat Loyalty             ✅ /loyalty
├── Ajukan Cuti / Libur       ✅ /requests (leave tab) → POST /leaves
└── Ajukan Pindah Kelas       ✅ /requests (transfer tab) → POST /transfers
              ↓
        Approval Admin        ✅ /approvals → POST /approvals/approve-leaves
              ↓                        → POST /approvals/approve-transfers
        Data Sistem Berubah   ✅ Student status + Enrollment auto-update
```

### Flow Aktivitas Guru ✅
```
Guru
↓
Dashboard Guru
├── Lihat Jadwal              ✅ /my-schedule (day tabs filter)
├── Lihat Kelas               ✅ /my-classes
├── Lihat Murid               ✅ /teacher/my-students (grouped by class)
├── Lihat Absensi             ✅ /teacher/student-attendance (✓/X/C/L indicators)
├── Update Progress           ✅ /student-progress (lesson checklist + notes)
├── Berikan Catatan           ✅ /learning-notes
└── Lihat Rekap Honor         ✅ /salary (auto-calculation breakdown)
              ↓
        Data masuk ke sistem  ✅ All writes go to shared DB
              ↓
          Admin Review        ✅ /salary-rules (Master Honor) + /teacher-salaries
```

---

## S. SUMMARY STRUKTUR PROGRAM ✅

### User Roles
| Role | Fokus Utama | Dashboard |
|------|-------------|-----------|
| Admin | Mengelola seluruh operasional TOMS | ✅ /dashboard/admin (6 sections) |
| Siswa | Aktivitas pribadi, kelas, absensi, pembayaran, loyalty | ✅ /dashboard/student (greeting + info card + progress) |
| Guru | Aktivitas mengajar, murid, jadwal, progress, honor | ✅ /dashboard/teacher (jadwal + kelas + stats) |

### Core Database Entities ✅

| Entity | Table | Model | Status |
|--------|-------|-------|--------|
| Users | users | User | ✅ |
| Siswa | students | Student | ✅ |
| Orang Tua / Wali | guardians + student_guardian | Guardian | ✅ |
| Guru | teachers | Teacher | ✅ |
| Program | courses | Course | ✅ |
| Level | levels | Level | ✅ |
| Kelas | classes | ClassModel | ✅ |
| Jadwal | class_schedules | ClassSchedule | ✅ |
| Penempatan Siswa | class_enrollments | ClassEnrollment | ✅ |
| Absensi | attendances | Attendance | ✅ |
| Pengajuan Cuti | student_leaves | StudentLeave | ✅ |
| Pengajuan Pindah | class_transfers | ClassTransfer | ✅ |
| Produk | tuition_products | TuitionProduct | ✅ |
| Transaksi Pembayaran | invoices + payments + subscriptions | Invoice, Payment, Subscription | ✅ |
| Transaksi Pembelian | payments (type=PURCHASE) | Payment | ✅ |
| Loyalty Point | loyalty_transactions | LoyaltyTransaction | ✅ |
| Reward | rewards | Reward | ✅ |
| Redemption Reward | reward_redemptions | RewardRedemption | ✅ |
| Progress Siswa | student_progress | StudentProgress | ✅ |
| Catatan Guru | learning_notes | LearningNote | ✅ |
| Honor Guru | teacher_salaries + salary_rules | TeacherSalary, SalaryRule | ✅ |
| Riwayat Siswa | audit_logs | AuditLog | ✅ |

### Additional Entities
| Entity | Table | Model | Status |
|--------|-------|-------|--------|
| Membership | memberships | Membership | ✅ |
| Room | rooms | Room | ✅ |
| Voucher | vouchers | Voucher | ✅ |
| Loyalty Tier | loyalty_tiers | LoyaltyTier | ✅ |
| Loyalty Rule | loyalty_rules | LoyaltyRule | ✅ |
| System Settings | system_settings | SystemSetting | ✅ |
| Teacher Attendance | teacher_attendances | TeacherAttendance | ✅ |

### API Endpoints Summary
| Module | Endpoints | Status |
|--------|-----------|--------|
| Auth | login, register, logout, me | ✅ |
| Students | CRUD + search | ✅ |
| Teachers | CRUD | ✅ |
| Classes | CRUD + enrollments | ✅ |
| Schedules | CRUD | ✅ |
| Attendance | CRUD + bulk | ✅ |
| Leaves | CRUD + approve/reject | ✅ |
| Transfers | CRUD + approve | ✅ |
| Invoices | CRUD | ✅ |
| Payments | CRUD | ✅ |
| Subscriptions | CRUD | ✅ |
| Loyalty | balance, earn, redeem, adjust, transactions | ✅ |
| Rewards | CRUD + approve/fulfill/reject | ✅ |
| Vouchers | CRUD | ✅ |
| Student Progress | CRUD + by-student | ✅ |
| Learning Notes | CRUD | ✅ |
| Teacher Salaries | CRUD + my-salary | ✅ |
| Salary Rules | CRUD + calculate | ✅ |
| Approvals | unified (leaves + transfers + redemptions) | ✅ |
| Reports | students, attendance, revenue, loyalty, classes, purchases, teachers | ✅ |
| Dashboard | admin, teacher, student | ✅ |
| Audit Log | index | ✅ |

### Frontend Pages Summary
| Module | Pages | Status |
|--------|-------|--------|
| Admin Dashboard | /dashboard (6 sections) | ✅ |
| Admin Menu | students/*, attendance, approvals, schedule-changes, transactions, reports/*, teachers/*, salary-rules | ✅ |
| Student Dashboard | /dashboard (greeting + info + progress + shortcuts) | ✅ |
| Student Menu | /profile, /my-class/*, /attendance, /requests, /my-payments, /my-transactions, /my-purchases, /my-invoices, /loyalty, /rewards, /my-redemptions | ✅ |
| Teacher Dashboard | /dashboard (greeting + jadwal + kelas + stats) | ✅ |
| Teacher Menu | /my-schedule, /my-classes, /teacher/my-students, /teacher/student-attendance, /student-progress, /learning-notes, /class-summary, /salary | ✅ |

### Git History (fix/bugs branch)
| Commit | Blueprint | Description |
|--------|-----------|-------------|
| b877675 | A | User structure & dashboards |
| 56cc93e | B | Admin dashboard |
| b6bacd6 | C | Admin menu |
| 91ceac2 | D & E | Student dashboard + menu |
| 80d3487 | F & G | Progress detail + approve cuti |
| 080d72d | H, I & J | Pindah kelas + guru dashboard + menu |
| c2cfd47 | K, L, M & N | Jadwal guru + daftar murid + absensi + progress |
| 9508e6b | O, P & Q | Salary system + integrasi |
| (new) | R & S | Final verification |
