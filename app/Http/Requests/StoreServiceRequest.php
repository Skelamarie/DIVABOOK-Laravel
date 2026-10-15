<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->session()->has('admin_id');
    }

    /** @return array<string, list<mixed>> */
    public function rules(): array
    {
        return [
            'service_id' => ['nullable', 'string', 'regex:/^[a-fA-F0-9]{24}$/'],
            'photos' => ['nullable', 'array', 'max:10'],
            'photos.*' => ['required', 'image', 'mimes:jpeg,png,jpg', 'max:5120'],
            'service_name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'rate' => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
