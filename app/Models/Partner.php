<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use MongoDB\Laravel\Auth\User as Authenticatable;

/**
 * @property string $admin_id
 * @property string $name
 * @property string $shop_name
 * @property string $email
 * @property string $password
 * @property array<string, mixed>|null $branding
 */
class Partner extends Authenticatable
{
    protected $connection = 'mongodb';

    protected $table = 'partners';

    protected $fillable = [
        'admin_id',
        'name',
        'shop_name',
        'email',
        'password',
        'phone',
        'address',
        'biz_type',
        'capacity',
        'branding',
    ];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'branding' => 'array',
            'password' => 'hashed',
        ];
    }

    /** @return HasMany<Service, $this> */
    public function services(): HasMany
    {
        return $this->hasMany(Service::class, 'admin_id', 'admin_id');
    }

    /** @return HasMany<Booking, $this> */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'admin_id', 'admin_id');
    }
}
