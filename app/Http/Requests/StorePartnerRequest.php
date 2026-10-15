<?php

namespace App\Http\Requests;

use App\Models\Partner;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePartnerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, list<mixed>> */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'shop_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique(Partner::class, 'email')],
            'password' => ['required', 'string', 'min:6'],
            'phone' => ['required', 'string', 'regex:/^[0-9]{11}$/'],
            'address' => ['required', 'string', 'max:1000'],
            'terms' => ['required', 'accepted'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Full name is required.',
            'shop_name.required' => 'Business name is required.',
            'email.unique' => 'This email is already registered. Please log in or use another email.',
            'phone.regex' => 'Phone number must be exactly 11 digits (e.g. 09123456789).',
            'terms.accepted' => 'You must agree to the Partner Terms & Privacy Policy.',
            'terms.required' => 'You must agree to the Partner Terms & Privacy Policy.',
        ];
    }
}
