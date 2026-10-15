<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->session()->has('admin_id');
    }

    /** @return array<string, list<mixed>> */
    public function rules(): array
    {
        return ['status' => ['required', Rule::in(['pending', 'approved', 'confirmed', 'completed', 'declined', 'cancelled'])]];
    }
}
