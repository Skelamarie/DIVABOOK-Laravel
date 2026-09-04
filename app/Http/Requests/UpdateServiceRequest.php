<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'category' => ['sometimes', 'required', 'string'],
            'description' => ['nullable', 'string'],
            'rate' => ['sometimes', 'required', 'string'],
            'photos' => ['nullable', 'array'],
        ];
    }
}