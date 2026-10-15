<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, list<mixed>> */
    public function rules(): array
    {
        return [
            'fullname' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255'],
            'type' => ['required', Rule::in(['General Support', 'Partnership Interest'])],
            'message' => ['required', 'string', 'max:5000'],
        ];
    }
}
