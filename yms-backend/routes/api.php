<?php

use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\ClassController;
use App\Http\Controllers\Api\ClassEnrollmentController;
use App\Http\Controllers\Api\ClassScheduleController;
use App\Http\Controllers\Api\ClassTransferController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\GuardianController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\LevelController;
use App\Http\Controllers\Api\LoyaltyController;
use App\Http\Controllers\Api\LoyaltyRuleController;
use App\Http\Controllers\Api\LoyaltyTierController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\RewardController;
use App\Http\Controllers\Api\RewardRedemptionController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\StudentLeaveController;
use App\Http\Controllers\Api\TeacherAttendanceController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\TuitionProductController;
use App\Http\Controllers\Api\VoucherController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SubscriptionController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // Authentication
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
    Route::put('/profile', [AuthController::class, 'updateProfile'])->middleware('auth:sanctum');

    // Students
    Route::apiResource('students', StudentController::class)->middleware('auth:sanctum');

    // Guardians
    Route::apiResource('guardians', GuardianController::class)->middleware('auth:sanctum');
    Route::post('/guardians/{guardian}/attach-student', [GuardianController::class, 'attachStudent'])->middleware('auth:sanctum');
    Route::delete('/guardians/{guardian}/detach-student/{student}', [GuardianController::class, 'detachStudent'])->middleware('auth:sanctum');

    // Teachers
    Route::apiResource('teachers', TeacherController::class)->middleware('auth:sanctum');

    // Courses
    Route::apiResource('courses', CourseController::class)->middleware('auth:sanctum');

    // Levels
    Route::apiResource('levels', LevelController::class)->middleware('auth:sanctum');

    // Rooms
    Route::apiResource('rooms', RoomController::class)->middleware('auth:sanctum');

    // Classes
    Route::apiResource('classes', ClassController::class)->middleware('auth:sanctum');

    // Class Enrollments
    Route::apiResource('enrollments', ClassEnrollmentController::class)->middleware('auth:sanctum');
    Route::post('/enrollments/{id}/drop', [ClassEnrollmentController::class, 'drop'])->middleware('auth:sanctum');

    // Class Schedules
    Route::apiResource('schedules', ClassScheduleController::class)->middleware('auth:sanctum');
    Route::get('/schedules/today', [ClassScheduleController::class, 'today'])->middleware('auth:sanctum');

    // Class Transfers
    Route::apiResource('transfers', ClassTransferController::class)->middleware('auth:sanctum');
    Route::put('/transfers/{id}/approve', [ClassTransferController::class, 'approve'])->middleware('auth:sanctum');
    Route::put('/transfers/{id}/reject', [ClassTransferController::class, 'reject'])->middleware('auth:sanctum');
    Route::put('/transfers/{id}/cancel', [ClassTransferController::class, 'cancel'])->middleware('auth:sanctum');

    // Attendance
    Route::post('/attendance/check-in', [AttendanceController::class, 'checkIn'])->middleware('auth:sanctum');
    Route::apiResource('attendance', AttendanceController::class)->middleware('auth:sanctum');
    Route::get('/attendance/student/{student}', [AttendanceController::class, 'studentHistory'])->middleware('auth:sanctum');

    // Teacher Attendance
    Route::post('/teacher-attendance/check-in', [TeacherAttendanceController::class, 'checkIn'])->middleware('auth:sanctum');
    Route::apiResource('teacher-attendance', TeacherAttendanceController::class)->middleware('auth:sanctum');

    // Tuition Products
    Route::apiResource('tuition-products', TuitionProductController::class)->middleware('auth:sanctum');

    // Subscriptions
    Route::apiResource('subscriptions', SubscriptionController::class)->middleware('auth:sanctum');
    Route::put('/subscriptions/{id}/renew', [SubscriptionController::class, 'renew'])->middleware('auth:sanctum');
    Route::get('/subscriptions/expiring', [SubscriptionController::class, 'expiringSoon'])->middleware('auth:sanctum');

    // Invoices
    Route::apiResource('invoices', InvoiceController::class)->middleware('auth:sanctum');
    Route::put('/invoices/{id}/mark-overdue', [InvoiceController::class, 'markOverdue'])->middleware('auth:sanctum');

    // Payments
    Route::apiResource('payments', PaymentController::class)->middleware('auth:sanctum');
    Route::get('/payments/outstanding', [PaymentController::class, 'outstanding'])->middleware('auth:sanctum');

    // Loyalty
    Route::get('/loyalty/balance', [LoyaltyController::class, 'balance'])->middleware('auth:sanctum');
    Route::get('/loyalty/transactions', [LoyaltyController::class, 'transactions'])->middleware('auth:sanctum');
    Route::post('/loyalty/earn', [LoyaltyController::class, 'earn'])->middleware('auth:sanctum');
    Route::post('/loyalty/redeem', [LoyaltyController::class, 'redeem'])->middleware('auth:sanctum');
    Route::post('/loyalty/adjust', [LoyaltyController::class, 'adjust'])->middleware('auth:sanctum');

    // Loyalty Rules
    Route::apiResource('loyalty-rules', LoyaltyRuleController::class)->middleware('auth:sanctum');

    // Loyalty Tiers
    Route::apiResource('loyalty-tiers', LoyaltyTierController::class)->middleware('auth:sanctum');

    // Rewards
    Route::apiResource('rewards', RewardController::class)->middleware('auth:sanctum');

    // Reward Redemptions
    Route::apiResource('redemptions', RewardRedemptionController::class)->middleware('auth:sanctum');
    Route::put('/redemptions/{id}/approve', [RewardRedemptionController::class, 'approve'])->middleware('auth:sanctum');
    Route::put('/redemptions/{id}/fulfill', [RewardRedemptionController::class, 'fulfill'])->middleware('auth:sanctum');
    Route::put('/redemptions/{id}/reject', [RewardRedemptionController::class, 'reject'])->middleware('auth:sanctum');
    Route::put('/redemptions/{id}/cancel', [RewardRedemptionController::class, 'cancel'])->middleware('auth:sanctum');

    // Vouchers
    Route::apiResource('vouchers', VoucherController::class)->middleware('auth:sanctum');
    Route::get('/vouchers/validate/{code}', [VoucherController::class, 'validate'])->middleware('auth:sanctum');
    Route::put('/vouchers/{id}/use', [VoucherController::class, 'use'])->middleware('auth:sanctum');

    // Student Leaves
    Route::apiResource('leaves', StudentLeaveController::class)->middleware('auth:sanctum');
    Route::put('/leaves/{id}/approve', [StudentLeaveController::class, 'approve'])->middleware('auth:sanctum');
    Route::put('/leaves/{id}/reject', [StudentLeaveController::class, 'reject'])->middleware('auth:sanctum');
    Route::put('/leaves/{id}/cancel', [StudentLeaveController::class, 'cancel'])->middleware('auth:sanctum');

    // Settings
    Route::get('/settings', [SettingController::class, 'index'])->middleware('auth:sanctum');
    Route::put('/settings', [SettingController::class, 'update'])->middleware('auth:sanctum');
    Route::get('/settings/group/{group}', [SettingController::class, 'getGroup'])->middleware('auth:sanctum');

    // Dashboard
    Route::get('/dashboard/admin', [DashboardController::class, 'admin'])->middleware('auth:sanctum');
    Route::get('/dashboard/teacher', [DashboardController::class, 'teacher'])->middleware('auth:sanctum');
    Route::get('/dashboard/student', [DashboardController::class, 'student'])->middleware('auth:sanctum');

    // Reports
    Route::get('/reports/students', [ReportController::class, 'studentReport'])->middleware('auth:sanctum');
    Route::get('/reports/attendance', [ReportController::class, 'attendanceReport'])->middleware('auth:sanctum');
    Route::get('/reports/revenue', [ReportController::class, 'revenueReport'])->middleware('auth:sanctum');
    Route::get('/reports/loyalty', [ReportController::class, 'loyaltyReport'])->middleware('auth:sanctum');
    Route::get('/reports/classes', [ReportController::class, 'classReport'])->middleware('auth:sanctum');
});