<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePartnerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $partnerId = $this->route('partner')?->id ?? $this->user()?->id;

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'shop_name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'unique:partners,email,' . $partnerId],
            'phone' => ['sometimes', 'required', 'string'],
            'address' => ['sometimes', 'required', 'string'],
            'biz_type' => ['nullable', 'string'],
            'capacity' => ['nullable', 'integer'],
            'branding' => ['nullable', 'array'],
        ];
    }
}