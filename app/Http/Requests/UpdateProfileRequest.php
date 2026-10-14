<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->session()->has('admin_id');
    }

    public function rules(): array
    {
        return [
            'logo_file' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:5120'],
            'salon_name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'credentials' => ['nullable', 'string', 'max:5000'],
            'location' => ['required', 'string', 'max:1000'],
            'contact_info' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255'],
            'facebook' => ['nullable', 'string', 'max:255'],
            'facebook_url' => ['nullable', 'url:http,https', 'max:2048'],
            'instagram' => ['nullable', 'string', 'max:255'],
            'instagram_url' => ['nullable', 'url:http,https', 'max:2048'],
            'color_primary' => ['required', 'regex:/^#[a-fA-F0-9]{6}$/'],
            'color_secondary' => ['required', 'regex:/^#[a-fA-F0-9]{6}$/'],
        ];
    }
}
