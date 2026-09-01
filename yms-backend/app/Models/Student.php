<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'student_code',
        'student_number',
        'full_name',
        'nickname',
        'gender',
        'date_of_birth',
        'place_of_birth',
        'photo',
        'phone',
        'email',
        'address',
        'school_name',
        'school_grade',
        'status',
        'join_date',
        'membership_status',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'join_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function guardians()
    {
        return $this->belongsToMany(Guardian::class, 'student_guardian');
    }

    public function membership()
    {
        return $this->hasOne(Membership::class);
    }

    public function enrollments()
    {
        return $this->hasMany(ClassEnrollment::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function loyaltyTransactions()
    {
        return $this->hasMany(LoyaltyTransaction::class);
    }

    public function rewardRedemptions()
    {
        return $this->hasMany(RewardRedemption::class);
    }

    public function vouchers()
    {
        return $this->hasMany(Voucher::class);
    }

    public function leaves()
    {
        return $this->hasMany(StudentLeave::class);
    }

    public function classTransfers()
    {
        return $this->hasMany(ClassTransfer::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'ACTIVE');
    }

    public function getLoyaltyBalanceAttribute(): int
    {
        $transactions = $this->loyaltyTransactions;
        $balance = 0;

        foreach ($transactions as $transaction) {
            match ($transaction->type) {
                'EARN', 'ADJUSTMENT' => $balance += $transaction->points,
                'REDEEM', 'EXPIRED' => $balance -= $transaction->points,
                'REVERSAL' => $balance += $transaction->points,
            };
        }

        return max(0, $balance);
    }

    public function generateStudentCode(): string
    {
        $lastStudent = static::orderBy('id', 'desc')->first();
        $number = $lastStudent ? intval(substr($lastStudent->student_code, 4)) + 1 : 1;
        return 'YMS-' . str_pad($number, 5, '0', STR_PAD_LEFT);
    }
}
