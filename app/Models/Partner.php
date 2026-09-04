<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Partner extends Authenticatable
{
    use HasFactory;

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