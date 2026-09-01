<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Student;
use App\Models\Guardian;
use App\Models\Membership;
use App\Models\Teacher;
use App\Models\Course;
use App\Models\Level;
use App\Models\Room;
use App\Models\ClassModel;
use App\Models\ClassEnrollment;
use App\Models\ClassSchedule;
use App\Models\TuitionProduct;
use App\Models\Subscription;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\LoyaltyTier;
use App\Models\LoyaltyRule;
use App\Models\LoyaltyTransaction;
use App\Models\Reward;
use App\Models\RewardRedemption;
use App\Models\Voucher;
use App\Models\SystemSetting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $password = Hash::make('password');
        $now = now();
        $today = $now->toDateString();

        // ── System Settings ──
        SystemSetting::updateOrCreate(['key' => 'late_threshold_minutes'], [
            'value' => '10',
            'type' => 'integer',
            'description' => 'Minutes after scheduled start to mark attendance as LATE',
        ]);

        // ── Users ──
        $superAdmin = User::updateOrCreate(['email' => 'superadmin@yms.com'], [
            'name' => 'Super Admin',
            'password' => $password,
            'phone' => '081234567890',
            'role' => 'super_admin',
            'is_active' => true,
            'email_verified_at' => $now,
        ]);

        $admin = User::updateOrCreate(['email' => 'admin@yms.com'], [
            'name' => 'Admin YMS',
            'password' => $password,
            'phone' => '081234567891',
            'role' => 'admin',
            'is_active' => true,
            'email_verified_at' => $now,
        ]);

        $teacherUser1 = User::updateOrCreate(['email' => 'teacher1@yms.com'], [
            'name' => 'Budi Santoso',
            'password' => $password,
            'phone' => '081234567892',
            'role' => 'teacher',
            'is_active' => true,
            'email_verified_at' => $now,
        ]);

        $teacherUser2 = User::updateOrCreate(['email' => 'teacher2@yms.com'], [
            'name' => 'Sari Dewi',
            'password' => $password,
            'phone' => '081234567893',
            'role' => 'teacher',
            'is_active' => true,
            'email_verified_at' => $now,
        ]);

        $studentUser1 = User::updateOrCreate(['email' => 'student1@yms.com'], [
            'name' => 'Andi Wijaya',
            'password' => $password,
            'phone' => '081234567894',
            'role' => 'student',
            'is_active' => true,
            'email_verified_at' => $now,
        ]);

        $studentUser2 = User::updateOrCreate(['email' => 'student2@yms.com'], [
            'name' => 'Maya Putri',
            'password' => $password,
            'phone' => '081234567895',
            'role' => 'student',
            'is_active' => true,
            'email_verified_at' => $now,
        ]);

        $studentUser3 = User::updateOrCreate(['email' => 'student3@yms.com'], [
            'name' => 'Rizky Pratama',
            'password' => $password,
            'phone' => '081234567896',
            'role' => 'student',
            'is_active' => true,
            'email_verified_at' => $now,
        ]);

        $parentUser = User::updateOrCreate(['email' => 'parent@yms.com'], [
            'name' => 'Wijaya Lim',
            'password' => $password,
            'phone' => '081234567897',
            'role' => 'parent',
            'is_active' => true,
            'email_verified_at' => $now,
        ]);

        // ── Teachers ──
        $teacher1 = Teacher::updateOrCreate(['teacher_code' => 'TCH-001'], [
            'user_id' => $teacherUser1->id,
            'name' => 'Budi Santoso',
            'email' => 'teacher1@yms.com',
            'phone' => '081234567892',
            'specialization' => 'Piano',
            'join_date' => '2024-01-15',
            'status' => 'ACTIVE',
        ]);

        $teacher2 = Teacher::updateOrCreate(['teacher_code' => 'TCH-002'], [
            'user_id' => $teacherUser2->id,
            'name' => 'Sari Dewi',
            'email' => 'teacher2@yms.com',
            'phone' => '081234567893',
            'specialization' => 'Guitar',
            'join_date' => '2024-06-01',
            'status' => 'ACTIVE',
        ]);

        // ── Courses ──
        $piano = Course::updateOrCreate(['code' => 'CRS-PIANO'], [
            'name' => 'Piano',
            'description' => 'Kursus Piano untuk pemula hingga lanjutan',
            'duration' => 60,
            'level' => 'Beginner',
            'price' => 500000,
            'status' => 'ACTIVE',
        ]);

        $keyboard = Course::updateOrCreate(['code' => 'CRS-KB'], [
            'name' => 'Keyboard',
            'description' => 'Kursus Keyboard elektronik',
            'duration' => 60,
            'level' => 'Beginner',
            'price' => 450000,
            'status' => 'ACTIVE',
        ]);

        $guitar = Course::updateOrCreate(['code' => 'CRS-GTR'], [
            'name' => 'Guitar',
            'description' => 'Kursus Gitar akustik dan elektrik',
            'duration' => 60,
            'level' => 'Beginner',
            'price' => 450000,
            'status' => 'ACTIVE',
        ]);

        $drum = Course::updateOrCreate(['code' => 'CRS-DRM'], [
            'name' => 'Drum',
            'description' => 'Kursus Drum dan perkusi',
            'duration' => 60,
            'level' => 'Beginner',
            'price' => 500000,
            'status' => 'ACTIVE',
        ]);

        // ── Levels ──
        $beginner = Level::updateOrCreate(['code' => 'LVL-01'], [
            'name' => 'Beginner',
            'description' => 'Tingkat pemula',
            'sequence' => 1,
        ]);

        $basic = Level::updateOrCreate(['code' => 'LVL-02'], [
            'name' => 'Basic',
            'description' => 'Tingkat dasar',
            'sequence' => 2,
        ]);

        $intermediate = Level::updateOrCreate(['code' => 'LVL-03'], [
            'name' => 'Intermediate',
            'description' => 'Tingkat menengah',
            'sequence' => 3,
        ]);

        $advanced = Level::updateOrCreate(['code' => 'LVL-04'], [
            'name' => 'Advanced',
            'description' => 'Tingkat lanjutan',
            'sequence' => 4,
        ]);

        // ── Rooms ──
        $room1 = Room::updateOrCreate(['room_code' => 'RM-A1'], [
            'name' => 'Studio A',
            'capacity' => 10,
            'location' => 'Lantai 1',
            'status' => 'ACTIVE',
        ]);

        $room2 = Room::updateOrCreate(['room_code' => 'RM-B2'], [
            'name' => 'Studio B',
            'capacity' => 8,
            'location' => 'Lantai 1',
            'status' => 'ACTIVE',
        ]);

        $room3 = Room::updateOrCreate(['room_code' => 'RM-C3'], [
            'name' => 'Hall C',
            'capacity' => 20,
            'location' => 'Lantai 2',
            'status' => 'ACTIVE',
        ]);

        // ── Classes ──
        $class1 = ClassModel::updateOrCreate(['class_code' => 'CLS-PN-001'], [
            'course_id' => $piano->id,
            'level_id' => $beginner->id,
            'teacher_id' => $teacher1->id,
            'room_id' => $room1->id,
            'capacity' => 8,
            'status' => 'ACTIVE',
            'start_date' => '2026-01-10',
            'end_date' => '2026-06-30',
        ]);

        $class2 = ClassModel::updateOrCreate(['class_code' => 'CLS-GT-001'], [
            'course_id' => $guitar->id,
            'level_id' => $basic->id,
            'teacher_id' => $teacher2->id,
            'room_id' => $room2->id,
            'capacity' => 6,
            'status' => 'ACTIVE',
            'start_date' => '2026-01-10',
            'end_date' => '2026-06-30',
        ]);

        // ── Class Schedules ──
        ClassSchedule::updateOrCreate(
            ['class_id' => $class1->id, 'day_of_week' => 'Monday', 'start_time' => '14:00'],
            [
                'teacher_id' => $teacher1->id,
                'room_id' => $room1->id,
                'end_time' => '15:00',
                'effective_from' => '2026-01-10',
                'effective_until' => '2026-06-30',
                'status' => 'ACTIVE',
            ]
        );

        ClassSchedule::updateOrCreate(
            ['class_id' => $class1->id, 'day_of_week' => 'Wednesday', 'start_time' => '14:00'],
            [
                'teacher_id' => $teacher1->id,
                'room_id' => $room1->id,
                'end_time' => '15:00',
                'effective_from' => '2026-01-10',
                'effective_until' => '2026-06-30',
                'status' => 'ACTIVE',
            ]
        );

        ClassSchedule::updateOrCreate(
            ['class_id' => $class2->id, 'day_of_week' => 'Tuesday', 'start_time' => '10:00'],
            [
                'teacher_id' => $teacher2->id,
                'room_id' => $room2->id,
                'end_time' => '11:00',
                'effective_from' => '2026-01-10',
                'effective_until' => '2026-06-30',
                'status' => 'ACTIVE',
            ]
        );

        ClassSchedule::updateOrCreate(
            ['class_id' => $class2->id, 'day_of_week' => 'Thursday', 'start_time' => '10:00'],
            [
                'teacher_id' => $teacher2->id,
                'room_id' => $room2->id,
                'end_time' => '11:00',
                'effective_from' => '2026-01-10',
                'effective_until' => '2026-06-30',
                'status' => 'ACTIVE',
            ]
        );

        // ── Students ──
        $student1 = Student::updateOrCreate(['student_code' => 'STU-001'], [
            'user_id' => $studentUser1->id,
            'student_number' => '2026001',
            'full_name' => 'Andi Wijaya',
            'nickname' => 'Andi',
            'gender' => 'male',
            'date_of_birth' => '2015-03-15',
            'place_of_birth' => 'Surabaya',
            'phone' => '081234567894',
            'email' => 'student1@yms.com',
            'address' => 'Jl. Pemuda No. 123, Surabaya',
            'school_name' => 'SDN Sukomanunggal',
            'school_grade' => 'Kelas 4',
            'status' => 'ACTIVE',
            'join_date' => '2026-01-10',
            'membership_status' => 'ACTIVE',
        ]);

        $student2 = Student::updateOrCreate(['student_code' => 'STU-002'], [
            'user_id' => $studentUser2->id,
            'student_number' => '2026002',
            'full_name' => 'Maya Putri',
            'nickname' => 'Maya',
            'gender' => 'female',
            'date_of_birth' => '2014-07-22',
            'place_of_birth' => 'Surabaya',
            'phone' => '081234567895',
            'email' => 'student2@yms.com',
            'address' => 'Jl. Raya Darmo No. 45, Surabaya',
            'school_name' => 'SDN Ketintang',
            'school_grade' => 'Kelas 5',
            'status' => 'ACTIVE',
            'join_date' => '2026-02-01',
            'membership_status' => 'ACTIVE',
        ]);

        $student3 = Student::updateOrCreate(['student_code' => 'STU-003'], [
            'user_id' => $studentUser3->id,
            'student_number' => '2026003',
            'full_name' => 'Rizky Pratama',
            'nickname' => 'Rizky',
            'gender' => 'male',
            'date_of_birth' => '2013-11-08',
            'place_of_birth' => 'Surabaya',
            'phone' => '081234567896',
            'email' => 'student3@yms.com',
            'address' => 'Jl. Soekarno-Hatta No. 78, Surabaya',
            'school_name' => 'SMPN 5 Surabaya',
            'school_grade' => 'Kelas 7',
            'status' => 'ACTIVE',
            'join_date' => '2026-01-10',
            'membership_status' => 'ACTIVE',
        ]);

        // ── Guardians ──
        $guardian1 = Guardian::updateOrCreate(
            ['name' => 'Wijaya Lim', 'phone' => '081234567897'],
            [
                'relationship' => 'Father',
                'email' => 'parent@yms.com',
                'address' => 'Jl. Pemuda No. 123, Surabaya',
                'is_primary' => true,
            ]
        );

        $guardian2 = Guardian::updateOrCreate(
            ['name' => 'Linda Sari', 'phone' => '081234567898'],
            [
                'relationship' => 'Mother',
                'email' => 'linda@example.com',
                'address' => 'Jl. Raya Darmo No. 45, Surabaya',
                'is_primary' => false,
            ]
        );

        // Attach guardians to students
        $student1->guardians()->syncWithoutDetaching([$guardian1->id]);
        $student2->guardians()->syncWithoutDetaching([$guardian2->id]);

        // ── Memberships ──
        Membership::updateOrCreate(['membership_number' => 'MEM-2026-001'], [
            'student_id' => $student1->id,
            'membership_type' => 'PREMIUM',
            'start_date' => '2026-01-10',
            'end_date' => '2026-12-31',
            'status' => 'ACTIVE',
        ]);

        Membership::updateOrCreate(['membership_number' => 'MEM-2026-002'], [
            'student_id' => $student2->id,
            'membership_type' => 'BASIC',
            'start_date' => '2026-02-01',
            'end_date' => '2027-01-31',
            'status' => 'ACTIVE',
        ]);

        Membership::updateOrCreate(['membership_number' => 'MEM-2026-003'], [
            'student_id' => $student3->id,
            'membership_type' => 'BASIC',
            'start_date' => '2026-01-10',
            'end_date' => '2026-12-31',
            'status' => 'ACTIVE',
        ]);

        // ── Class Enrollments ──
        ClassEnrollment::updateOrCreate(
            ['student_id' => $student1->id, 'class_id' => $class1->id],
            [
                'enrolled_at' => $now,
                'start_date' => '2026-01-10',
                'end_date' => '2026-06-30',
                'status' => 'ACTIVE',
            ]
        );

        ClassEnrollment::updateOrCreate(
            ['student_id' => $student2->id, 'class_id' => $class2->id],
            [
                'enrolled_at' => $now,
                'start_date' => '2026-02-01',
                'end_date' => '2026-06-30',
                'status' => 'ACTIVE',
            ]
        );

        ClassEnrollment::updateOrCreate(
            ['student_id' => $student3->id, 'class_id' => $class1->id],
            [
                'enrolled_at' => $now,
                'start_date' => '2026-01-10',
                'end_date' => '2026-06-30',
                'status' => 'ACTIVE',
            ]
        );

        // ── Tuition Products ──
        $tpPiano = TuitionProduct::updateOrCreate(
            ['name' => 'Piano Monthly'],
            [
                'course_id' => $piano->id,
                'price' => 500000,
                'billing_type' => 'MONTHLY',
                'duration' => 30,
                'status' => 'ACTIVE',
            ]
        );

        $tpGuitar = TuitionProduct::updateOrCreate(
            ['name' => 'Guitar Monthly'],
            [
                'course_id' => $guitar->id,
                'price' => 450000,
                'billing_type' => 'MONTHLY',
                'duration' => 30,
                'status' => 'ACTIVE',
            ]
        );

        // ── Subscriptions ──
        $sub1 = Subscription::updateOrCreate(
            ['student_id' => $student1->id, 'product_id' => $tpPiano->id],
            [
                'start_date' => '2026-01-10',
                'end_date' => '2026-07-10',
                'price' => 500000,
                'status' => 'ACTIVE',
                'auto_renew' => true,
            ]
        );

        $sub2 = Subscription::updateOrCreate(
            ['student_id' => $student2->id, 'product_id' => $tpGuitar->id],
            [
                'start_date' => '2026-02-01',
                'end_date' => '2026-08-01',
                'price' => 450000,
                'status' => 'ACTIVE',
                'auto_renew' => false,
            ]
        );

        // ── Invoices ──
        $inv1 = Invoice::updateOrCreate(['invoice_number' => 'INV-2026-001'], [
            'student_id' => $student1->id,
            'subscription_id' => $sub1->id,
            'issue_date' => '2026-01-10',
            'due_date' => '2026-01-17',
            'subtotal' => 500000,
            'discount' => 0,
            'tax' => 50000,
            'total' => 550000,
            'status' => 'PAID',
        ]);

        $inv2 = Invoice::updateOrCreate(['invoice_number' => 'INV-2026-002'], [
            'student_id' => $student2->id,
            'subscription_id' => $sub2->id,
            'issue_date' => '2026-02-01',
            'due_date' => '2026-02-08',
            'subtotal' => 450000,
            'discount' => 0,
            'tax' => 45000,
            'total' => 495000,
            'status' => 'PAID',
        ]);

        // ── Payments ──
        Payment::updateOrCreate(['payment_number' => 'PAY-2026-001'], [
            'student_id' => $student1->id,
            'subscription_id' => $sub1->id,
            'invoice_id' => $inv1->id,
            'amount' => 550000,
            'payment_date' => '2026-01-12',
            'payment_method' => 'BANK_TRANSFER',
            'status' => 'PAID',
            'reference' => 'TRF-20260112-001',
            'notes' => 'Pembayaran bulanan Januari',
        ]);

        Payment::updateOrCreate(['payment_number' => 'PAY-2026-002'], [
            'student_id' => $student2->id,
            'subscription_id' => $sub2->id,
            'invoice_id' => $inv2->id,
            'amount' => 495000,
            'payment_date' => '2026-02-03',
            'payment_method' => 'CASH',
            'status' => 'PAID',
            'reference' => null,
            'notes' => 'Pembayaran bulanan Februari',
        ]);

        // ── Loyalty Tiers ──
        $bronze = LoyaltyTier::updateOrCreate(['name' => 'Bronze'], [
            'minimum_points' => 0,
            'maximum_points' => 499,
            'benefits' => 'Diskon 5% untuk pembelian merchandise',
            'status' => 'ACTIVE',
        ]);

        $silver = LoyaltyTier::updateOrCreate(['name' => 'Silver'], [
            'minimum_points' => 500,
            'maximum_points' => 1499,
            'benefits' => 'Diskon 10%, free 1 lesson makeup',
            'status' => 'ACTIVE',
        ]);

        $gold = LoyaltyTier::updateOrCreate(['name' => 'Gold'], [
            'minimum_points' => 1500,
            'maximum_points' => 4999,
            'benefits' => 'Diskon 15%, free 2 lesson makeup, priority booking',
            'status' => 'ACTIVE',
        ]);

        // ── Loyalty Rules ──
        LoyaltyRule::updateOrCreate(['name' => 'Attendance Points'], [
            'event_type' => 'ATTENDANCE',
            'points' => 10,
            'conditions' => json_encode(['status' => 'PRESENT']),
            'status' => 'ACTIVE',
        ]);

        LoyaltyRule::updateOrCreate(['name' => 'Payment Points'], [
            'event_type' => 'PAYMENT',
            'points' => 50,
            'conditions' => json_encode(['minimum_amount' => 100000]),
            'status' => 'ACTIVE',
        ]);

        LoyaltyRule::updateOrCreate(['name' => 'Referral Bonus'], [
            'event_type' => 'REFERRAL',
            'points' => 200,
            'conditions' => null,
            'status' => 'ACTIVE',
        ]);

        // ── Loyalty Transactions ──
        LoyaltyTransaction::updateOrCreate(
            ['student_id' => $student1->id, 'type' => 'EARN', 'description' => 'Enrollment bonus'],
            [
                'points' => 200,
                'expired_at' => $now->copy()->addYear(),
            ]
        );

        LoyaltyTransaction::updateOrCreate(
            ['student_id' => $student1->id, 'type' => 'EARN', 'description' => 'Payment Jan 2026'],
            [
                'points' => 50,
                'expired_at' => $now->copy()->addYear(),
            ]
        );

        LoyaltyTransaction::updateOrCreate(
            ['student_id' => $student2->id, 'type' => 'EARN', 'description' => 'Enrollment bonus'],
            [
                'points' => 200,
                'expired_at' => $now->copy()->addYear(),
            ]
        );

        // ── Rewards ──
        $reward1 = Reward::updateOrCreate(['code' => 'RWD-001'], [
            'name' => 'Free Merchandise T-Shirt',
            'description' => 'Yamaha Music School exclusive T-Shirt',
            'points_required' => 300,
            'stock' => 50,
            'start_date' => '2026-01-01',
            'end_date' => '2026-12-31',
            'status' => 'ACTIVE',
        ]);

        $reward2 = Reward::updateOrCreate(['code' => 'RWD-002'], [
            'name' => 'Free Lesson Makeup',
            'description' => 'Satu kali lesson makeup gratis',
            'points_required' => 500,
            'stock' => 100,
            'start_date' => '2026-01-01',
            'end_date' => '2026-12-31',
            'status' => 'ACTIVE',
        ]);

        // ── Reward Redemption ──
        RewardRedemption::updateOrCreate(['redemption_number' => 'RDM-2026-001'], [
            'student_id' => $student1->id,
            'reward_id' => $reward1->id,
            'points_used' => 300,
            'status' => 'APPROVED',
            'redeemed_at' => $now->subDays(5),
            'approved_at' => $now->subDays(4),
        ]);

        // ── Vouchers ──
        Voucher::updateOrCreate(['code' => 'VCH-WELCOME10'], [
            'reward_id' => $reward2->id,
            'student_id' => $student2->id,
            'discount_type' => 'PERCENTAGE',
            'discount_value' => 10,
            'minimum_transaction' => 100000,
            'valid_from' => '2026-01-01',
            'valid_until' => '2026-12-31',
            'status' => 'AVAILABLE',
        ]);

        $this->command->info('✅ Seed complete!');
        $this->command->info('');
        $this->command->info('Login credentials (password: password):');
        $this->command->info('  Super Admin : superadmin@yms.com');
        $this->command->info('  Admin       : admin@yms.com');
        $this->command->info('  Teacher 1   : teacher1@yms.com');
        $this->command->info('  Teacher 2   : teacher2@yms.com');
        $this->command->info('  Student 1   : student1@yms.com');
        $this->command->info('  Student 2   : student2@yms.com');
        $this->command->info('  Student 3   : student3@yms.com');
        $this->command->info('  Parent      : parent@yms.com');
    }
}
