<?php

namespace Tests\Feature\DivaBook;

use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\StorePartnerRequest;
use App\Models\Service;
use App\Support\BookingPricing;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\PresenceVerifierInterface;
use Mockery;
use ReflectionMethod;
use Tests\TestCase;

class RequestsTest extends TestCase
{
    private function bookingPayload(): array
    {
        return [
            'service_id' => '507f1f77bcf86cd799439011', 'service' => 'catalog', 'size' => 'standard', 'addon' => 'none',
            'removal' => '0', 'provider_chooses' => '1', 'selected_date' => now('Asia/Manila')->addDay()->format('Y-m-d'),
            'selected_time' => '09:00 AM', 'first_name' => 'Ana', 'last_name' => 'Cruz', 'email' => 'ana@example.com',
            'phone' => '+639123456789', 'special_requests' => 'Sensitive skin', 'terms_agreed' => '1',
            'payment_strategy' => 'downpayment', 'payment_method' => 'gcash', 'sender_name' => 'Ana Cruz',
        ];
    }

    private function validatorFor(array $payload, array $files = []): array
    {
        $request = StoreBookingRequest::create('/bookings', 'POST', $payload, [], $files);
        $request->setContainer($this->app);
        (new ReflectionMethod($request, 'prepareForValidation'))->invoke($request);
        $presence = Mockery::mock(PresenceVerifierInterface::class);
        $presence->shouldReceive('getCount')->andReturn(1);
        $this->app['validator']->setPresenceVerifier($presence);

        return [$request, $this->app['validator']->make($request->all(), $request->rules(), $request->messages())];
    }

    private function receipt(): UploadedFile
    {
        return UploadedFile::fake()->createWithContent('receipt.png', base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII='));
    }

    public function test_multipart_booleans_and_phone_are_normalized_without_losing_customer_fields(): void
    {
        [$request, $validator] = $this->validatorFor($this->bookingPayload(), ['receipt_file' => $this->receipt()]);
        $this->assertTrue($validator->passes(), json_encode($validator->errors()->all()));
        $this->assertSame(false, $request->input('removal'));
        $this->assertSame(true, $request->input('provider_chooses'));
        $this->assertSame('09123456789', $validator->validated()['phone']);
        $this->assertSame('Ana', $validator->validated()['first_name']);
        $this->assertSame('Sensitive skin', $validator->validated()['special_requests']);
    }

    public function test_booking_requires_contact_details_consent_and_image_payment_proof(): void
    {
        $payload = $this->bookingPayload();
        unset($payload['first_name'], $payload['last_name'], $payload['email'], $payload['phone']);
        $payload['terms_agreed'] = '0';
        [, $validator] = $this->validatorFor($payload);
        $this->assertFalse($validator->passes());
        foreach (['first_name', 'last_name', 'email', 'phone', 'terms_agreed', 'receipt_file'] as $field) {
            $this->assertTrue($validator->errors()->has($field), $field);
        }
    }

    public function test_customer_design_requires_a_reference_image_and_invalid_boolean_is_rejected(): void
    {
        $payload = [...$this->bookingPayload(), 'provider_chooses' => '0', 'removal' => 'garbage'];
        [, $validator] = $this->validatorFor($payload, ['receipt_file' => $this->receipt()]);
        $this->assertFalse($validator->passes());
        $this->assertTrue($validator->errors()->has('reference_image'));
        $this->assertTrue($validator->errors()->has('removal'));
    }

    public function test_past_dates_unknown_slots_and_non_image_receipts_are_rejected(): void
    {
        $payload = [...$this->bookingPayload(), 'selected_date' => '2000-01-01', 'selected_time' => '03:00 AM'];
        [, $validator] = $this->validatorFor($payload, ['receipt_file' => UploadedFile::fake()->create('receipt.txt', 10, 'text/plain')]);
        $this->assertFalse($validator->passes());
        foreach (['selected_date', 'selected_time', 'receipt_file'] as $field) {
            $this->assertTrue($validator->errors()->has($field));
        }
    }

    public function test_registration_rejects_duplicate_email_and_missing_consent(): void
    {
        $request = new StorePartnerRequest;
        $presence = Mockery::mock(PresenceVerifierInterface::class);
        $presence->shouldReceive('getCount')->andReturn(1);
        $this->app['validator']->setPresenceVerifier($presence);
        $validator = $this->app['validator']->make([
            'name' => 'Ana Cruz', 'shop_name' => 'Salon', 'email' => 'ana@example.com',
            'password' => 'secret123', 'phone' => '09123456789', 'address' => 'Davao', 'terms' => false,
        ], $request->rules());
        $this->assertFalse($validator->passes());
        $this->assertTrue($validator->errors()->has('email'));
        $this->assertTrue($validator->errors()->has('terms'));
    }

    public function test_total_uses_catalog_rate_and_preserves_decimals(): void
    {
        $service = new Service(['name' => 'Haircut', 'rate' => '250.75']);
        $prices = BookingPricing::calculate($service, ['service' => 'catalog', 'size' => 'standard', 'addon' => 'none', 'removal' => false, 'total_price' => 1]);
        $this->assertSame(250.75, $prices['total_price']);
        $this->assertSame('Haircut', $prices['service_name']);
    }

    public function test_guest_cannot_access_admin_pages_or_mutations(): void
    {
        foreach (['/admin/overview', '/admin/bookings', '/admin/clients', '/admin/services', '/admin/customization'] as $uri) {
            $this->get($uri)->assertRedirect('/login');
        }
        $this->postJson('/admin/services', [])->assertUnauthorized();
        $this->postJson('/admin/profile', [])->assertUnauthorized();
        $this->postJson('/admin/bookings/507f1f77bcf86cd799439011/status', ['status' => 'approved'])->assertUnauthorized();
        $this->deleteJson('/admin/services/507f1f77bcf86cd799439011')->assertUnauthorized();
    }

    public function test_controller_form_requests_reject_invalid_submissions_before_database_queries(): void
    {
        $this->postJson('/login', [])->assertUnprocessable()->assertJsonValidationErrors(['admin_id', 'email', 'password']);
        $this->postJson('/bookings', [])->assertUnprocessable()->assertJsonValidationErrors(['service_id', 'first_name', 'terms_agreed', 'receipt_file']);
        $this->withSession(['admin_id' => 'DB-1234'])->postJson('/admin/bookings/507f1f77bcf86cd799439011/status', ['status' => 'invented'])->assertUnprocessable()->assertJsonValidationErrors('status');
        $this->withSession(['admin_id' => 'DB-1234'])->postJson('/admin/services', [])->assertUnprocessable()->assertJsonValidationErrors(['service_name', 'rate']);
        $this->withSession(['admin_id' => 'DB-1234'])->postJson('/admin/profile', ['color_primary' => 'bad'])->assertUnprocessable()->assertJsonValidationErrors('color_primary');
    }

    public function test_logout_clears_the_partner_session(): void
    {
        $this->withSession(['admin_id' => 'DB-1234', 'shop_name' => 'Test Salon'])
            ->post('/logout')->assertRedirect('/login')->assertSessionMissing('admin_id')->assertSessionMissing('shop_name');
    }
}
