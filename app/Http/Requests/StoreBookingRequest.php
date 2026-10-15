<?php

namespace App\Http\Requests;

use App\Models\Service;
use App\Support\BookingPricing;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        // Multipart requests encode booleans as 0/1; normalize only valid values.
        foreach (['removal', 'provider_chooses', 'terms_agreed'] as $field) {
            if ($this->has($field)) {
                $value = filter_var($this->input($field), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
                if ($value !== null) {
                    $this->merge([$field => $value]);
                }
            }
        }
        if (is_string($this->input('phone'))) {
            $phone = preg_replace('/[\s()-]/', '', $this->input('phone'));
            if (preg_match('/^9[0-9]{9}$/', $phone)) {
                $phone = '0'.$phone;
            }
            if (preg_match('/^\+639[0-9]{9}$/', $phone)) {
                $phone = '0'.substr($phone, 3);
            }
            $this->merge(['phone' => $phone]);
        }
    }

    /** @return array<string, list<mixed>> */
    public function rules(): array
    {
        return [
            'service_id' => ['bail', 'required', 'string', 'regex:/^[a-fA-F0-9]{24}$/', Rule::exists(Service::class, '_id')],
            'service' => ['required', Rule::in(['catalog', ...array_keys(BookingPricing::SERVICES)])],
            'size' => ['required', Rule::in(array_keys(BookingPricing::SIZES))],
            'addon' => ['required', Rule::in(array_keys(BookingPricing::ADDONS))],
            'removal' => ['required', 'boolean'],
            'provider_chooses' => ['required', 'boolean'],
            'reference_image' => ['nullable', 'required_if:provider_chooses,false', 'image', 'mimes:jpeg,png,jpg', 'max:5120'],
            'selected_date' => ['required', 'date_format:Y-m-d', 'after_or_equal:'.now('Asia/Manila')->toDateString()],
            'selected_time' => ['required', Rule::in(['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM'])],
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'regex:/^09[0-9]{9}$/'],
            'special_requests' => ['nullable', 'string', 'max:5000'],
            'terms_agreed' => ['required', 'accepted'],
            'payment_strategy' => ['required', Rule::in(['downpayment', 'full'])],
            'payment_method' => ['required', Rule::in(['gcash', 'paymaya', 'shopeepay'])],
            'sender_name' => ['required', 'string', 'max:255'],
            'receipt_file' => ['required', 'image', 'mimes:jpeg,png,jpg', 'max:5120'],
        ];
    }

    /** @return list<\Closure(Validator): void> */
    public function after(): array
    {
        return [function (Validator $validator): void {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }
            $service = Service::find($this->input('service_id'));
            if ($this->input('service') !== 'catalog' && ! str_contains(strtolower($service->category ?? ''), 'nail')) {
                $validator->errors()->add('service', 'Choose the listed treatment for this service.');
            }
            $slot = Carbon::createFromFormat('Y-m-d h:i A', $this->input('selected_date').' '.$this->input('selected_time'), 'Asia/Manila');
            if ($slot->isPast()) {
                $validator->errors()->add('selected_time', 'Please choose a future appointment time.');
            }
        }];
    }

    public function messages(): array
    {
        return [
            'phone.regex' => 'Enter a Philippine mobile number, e.g. 09123456789 or +639123456789.',
            'terms_agreed.accepted' => 'Please agree to the booking terms and conditions.',
            'reference_image.required_if' => 'Upload a reference image or let the provider choose the design.',
        ];
    }
}
