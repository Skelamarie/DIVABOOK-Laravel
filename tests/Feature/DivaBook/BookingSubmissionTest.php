<?php

namespace Tests\Feature\DivaBook;

use App\Http\Controllers\BookingController;
use App\Http\Requests\StoreBookingRequest;
use App\Models\Service;
use App\Services\CloudinaryService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Stringable;
use Mockery;
use PHPUnit\Framework\Attributes\PreserveGlobalState;
use PHPUnit\Framework\Attributes\RunInSeparateProcess;
use Tests\TestCase;

class BookingSubmissionTest extends TestCase
{
    #[RunInSeparateProcess]
    #[PreserveGlobalState(false)]
    public function test_submission_preserves_customer_fields_and_cloudinary_urls_and_uses_provider_from_service(): void
    {
        $serviceMock = Mockery::mock('alias:App\Models\Service');
        $service = new Service;
        $service->name = 'Nails';
        $service->rate = '850.50';
        $service->admin_id = 'DB-1234';
        $serviceMock->shouldReceive('findOrFail')->once()->with('507f1f77bcf86cd799439011')->andReturn($service);
        $bookingMock = Mockery::mock('alias:App\Models\Booking');
        $saved = null;
        $bookingMock->shouldReceive('create')->once()->withArgs(function ($attributes) use (&$saved) {
            $saved = $attributes;

            return true;
        })->andReturn((object) ['id' => '507f1f77bcf86cd799439012']);

        $file = UploadedFile::fake()->create('receipt.png', 1, 'image/png');
        $request = Mockery::mock(StoreBookingRequest::class);
        $request->shouldReceive('string')->with('service_id')->andReturn(new Stringable('507f1f77bcf86cd799439011'));
        $request->shouldReceive('validated')->andReturn([
            'service_id' => '507f1f77bcf86cd799439011', 'service' => 'catalog', 'size' => 'standard',
            'addon' => 'basic', 'removal' => true, 'provider_chooses' => false,
            'first_name' => 'Ana', 'last_name' => 'Cruz', 'email' => 'ana@example.com', 'phone' => '09123456789',
            'special_requests' => 'Sensitive skin', 'terms_agreed' => true,
            'selected_date' => '2027-01-01', 'selected_time' => '09:00 AM',
            'payment_strategy' => 'full', 'payment_method' => 'gcash', 'sender_name' => 'Ana Cruz',
        ]);
        $request->shouldReceive('file')->with('receipt_file')->andReturn($file);
        $request->shouldReceive('file')->with('reference_image')->andReturn($file);
        $request->shouldReceive('hasFile')->with('reference_image')->andReturn(true);
        $uploads = Mockery::mock(CloudinaryService::class);
        $uploads->shouldReceive('uploadReceipt')->once()->with($file, 'DB-1234', 'Ana Cruz', 'Ana', 'Cruz')->andReturn([
            'public_id' => 'receipt-id', 'secure_url' => 'https://res.cloudinary.com/demo/receipt.png',
        ]);
        $uploads->shouldReceive('uploadInspiration')->once()->with($file, 'DB-1234', 'Cruz')->andReturn([
            'public_id' => 'reference-id', 'secure_url' => 'https://res.cloudinary.com/demo/reference.png',
        ]);
        $response = (new BookingController)->store($request, $uploads);
        $this->assertStringEndsWith('/bookings/success/507f1f77bcf86cd799439012', $response->getTargetUrl());
        $this->assertSame('DB-1234', $saved['admin_id']);
        $this->assertSame('Ana', $saved['first_name']);
        $this->assertSame('Sensitive skin', $saved['special_requests']);
        $this->assertFalse($saved['provider_chooses']);
        $this->assertTrue($saved['terms_agreed']);
        $this->assertSame(1200.5, $saved['total_price']);
        $this->assertSame(1200.5, $saved['amount_paid']);
        $this->assertSame('https://res.cloudinary.com/demo/receipt.png', $saved['receipt_path']);
        $this->assertSame('https://res.cloudinary.com/demo/reference.png', $saved['reference_image']);
    }
}
