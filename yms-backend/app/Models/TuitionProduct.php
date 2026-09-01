<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TuitionProduct extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'course_id',
        'name',
        'price',
        'billing_type',
        'duration',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'duration' => 'integer',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class, 'product_id');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'ACTIVE');
    }
}
