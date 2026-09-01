<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'description',
        'duration',
        'level',
        'price',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'duration' => 'integer',
    ];

    public function classes()
    {
        return $this->hasMany(ClassModel::class);
    }

    public function tuitionProducts()
    {
        return $this->hasMany(TuitionProduct::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'ACTIVE');
    }
}
