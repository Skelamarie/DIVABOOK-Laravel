<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use MongoDB\Laravel\Eloquent\Model;

/**
 * @property string $admin_id
 * @property string $name
 * @property string $category
 * @property string|null $description
 * @property int|float|numeric-string $rate
 * @property list<string>|null $photos
 * @property list<string>|null $photo_public_ids
 * @property int|null $photo_sequence
 */
class Service extends Model
{
    protected $connection = 'mongodb';

    protected $table = 'services';

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

    /** @return BelongsTo<Partner, $this> */
    public function partner(): BelongsTo
    {
        return $this->belongsTo(Partner::class, 'admin_id', 'admin_id');
    }
}
