<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'admin_id' => ['required', 'string', 'exists:partners,admin_id'],
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'rate' => ['required', 'string'],
            'photos' => ['nullable', 'array'],
        ];
    }
}