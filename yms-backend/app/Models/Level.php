<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Level extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'sequence',
    ];

    public function classes()
    {
        return $this->hasMany(ClassModel::class);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sequence');
    }
}
