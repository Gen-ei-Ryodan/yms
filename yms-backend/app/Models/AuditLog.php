<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'action',
        'module',
        'record_type',
        'record_id',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function record()
    {
        return $this->morphTo();
    }

    public static function log(string $action, string $module, Model $record = null, array $oldValues = [], array $newValues = []): static
    {
        return static::create([
            'user_id' => auth()->id(),
            'action' => $action,
            'module' => $module,
            'record_type' => $record ? get_class($record) : null,
            'record_id' => $record?->id,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
