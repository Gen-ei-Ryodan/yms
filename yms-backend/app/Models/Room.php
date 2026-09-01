<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Room extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'room_code',
        'name',
        'capacity',
        'location',
        'status',
    ];

    public function classes()
    {
        return $this->hasMany(ClassModel::class);
    }

    public function schedules()
    {
        return $this->hasMany(ClassSchedule::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'ACTIVE');
    }
}
