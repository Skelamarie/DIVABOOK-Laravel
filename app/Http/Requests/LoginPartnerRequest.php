<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginPartnerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'admin_id' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255'],
            'password' => ['required', 'string'],
        ];
    }
}
