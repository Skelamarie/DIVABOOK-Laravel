<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['sometimes', 'required', 'in:Pending,Confirmed,Completed,Cancelled'],
            'payment_status' => ['sometimes', 'required', 'string'],
            'amount_paid' => ['sometimes', 'integer'],
            'selected_date' => ['sometimes', 'string'],
            'selected_time' => ['sometimes', 'string'],
        ];
    }
}