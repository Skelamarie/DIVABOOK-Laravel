<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'admin_id' => ['required', 'string', 'exists:partners,admin_id'],
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email'],
            'phone' => ['required', 'string'],
            'service' => ['required', 'string'],
            'service_name' => ['required', 'string'],
            'service_price' => ['required', 'integer', 'min:0'],
            'size' => ['nullable', 'string'],
            'size_name' => ['nullable', 'string'],
            'size_price' => ['nullable', 'integer'],
            'addon' => ['nullable', 'string'],
            'addon_name' => ['nullable', 'string'],
            'addon_price' => ['nullable', 'integer'],
            'removal' => ['nullable', 'boolean'],
            'removal_price' => ['nullable', 'integer'],
            'selected_date' => ['required', 'string'],
            'selected_time' => ['required', 'string'],
            'special_requests' => ['nullable', 'string'],
            'total_price' => ['required', 'integer', 'min:0'],
            'amount_paid' => ['nullable', 'integer'],
            'payment_method' => ['nullable', 'string'],
            'sender_name' => ['nullable', 'string'],
            'receipt_path' => ['nullable', 'string'],
            'reference_image' => ['nullable', 'string'],
            'provider_chooses' => ['nullable', 'boolean'],
        ];
    }
}