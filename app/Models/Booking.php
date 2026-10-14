<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'bookings';

    protected $fillable = [
        'admin_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'service',
        'service_name',
        'service_price',
        'size',
        'size_name',
        'size_price',
        'addon',
        'addon_name',
        'addon_price',
        'removal',
        'removal_price',
        'selected_date',
        'selected_time',
        'special_requests',
        'total_price',
        'amount_paid',
        'payment_strategy', // Added to support P1.jsx selection
        'payment_method',
        'payment_status',
        'sender_name',
        'receipt_path',
        'receipt_public_id',
        'reference_public_id',
        'terms_agreed',
        'reference_image',
        'provider_chooses',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'terms_agreed' => 'boolean',
            'removal' => 'boolean',
            'provider_chooses' => 'boolean',
            // Cast to float instead of integer to preserve decimal values
            'service_price' => 'float',
            'size_price' => 'float',
            'addon_price' => 'float',
            'removal_price' => 'float',
            'total_price' => 'float',
            'amount_paid' => 'float',
        ];
    }

    public function partner(): BelongsTo
    {
        return $this->belongsTo(Partner::class, 'admin_id', 'admin_id');
    }
}
