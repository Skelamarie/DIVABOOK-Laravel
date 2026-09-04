<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePartnerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'admin_id' => ['required', 'string', 'unique:partners,admin_id'],
            'name' => ['required', 'string', 'max:255'],
            'shop_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:partners,email'],
            'password' => ['required', 'string', 'min:8'],
            'phone' => ['required', 'string'],
            'address' => ['required', 'string'],
            'biz_type' => ['nullable', 'string'],
            'capacity' => ['nullable', 'integer'],
            'branding' => ['nullable', 'array'],
        ];
    }
}