<?php

namespace App\Models;

use MongoDB\Laravel\Auth\User as Authenticatable;
use MongoDB\Laravel\Eloquent\Relations\HasMany;

class Partner extends Authenticatable
{
    protected $connection = 'mongodb';
    protected $collection = 'partners';

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

    public function services(): HasMany
    {
        return $this->hasMany(Service::class, 'admin_id', 'admin_id');
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'admin_id', 'admin_id');
    }
}