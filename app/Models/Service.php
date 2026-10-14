<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Eloquent\Relations\BelongsTo;

class Service extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'services';

    protected $fillable = [
        'admin_id',
        'name',
        'category',
        'description',
        'rate',
        'photos',
        'photo_public_ids',
        'photo_sequence',
    ];

    protected function casts(): array
    {
        return [
            'photos' => 'array',
            'photo_public_ids' => 'array',
            'photo_sequence' => 'integer',
        ];
    }

    public function partner(): BelongsTo
    {
        return $this->belongsTo(Partner::class, 'admin_id', 'admin_id');
    }
}
