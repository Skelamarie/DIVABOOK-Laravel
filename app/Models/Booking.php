<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    use HasFactory;

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
        'payment_method',
        'payment_status',
        'sender_name',
        'receipt_path',
        'reference_image',
        'provider_chooses',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'removal' => 'boolean',
            'provider_chooses' => 'boolean',
            'service_price' => 'integer',
            'size_price' => 'integer',
            'addon_price' => 'integer',
            'removal_price' => 'integer',
            'total_price' => 'integer',
            'amount_paid' => 'integer',
        ];
    }

    public function partner(): BelongsTo
    {
        return $this->belongsTo(Partner::class, 'admin_id', 'admin_id');
    }
}