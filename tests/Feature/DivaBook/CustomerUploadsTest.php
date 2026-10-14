<?php

namespace Tests\Feature\DivaBook;

use App\Models\Service;
use App\Services\CloudinaryClient;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\PresenceVerifierInterface;
use Mockery;
use PHPUnit\Framework\Attributes\PreserveGlobalState;
use PHPUnit\Framework\Attributes\RunInSeparateProcess;
use Tests\TestCase;

class CustomerUploadsTest extends TestCase
{
    #[RunInSeparateProcess]
    #[PreserveGlobalState(false)]
    public function test_multipart_customer_images_reach_the_upload_service_and_save_in_the_selected_store_folders(): void
    {
        config(['cloudinary' => ['cloud_name' => 'test-cloud', 'api_key' => '123456', 'api_secret' => 'test-secret', 'folder_mode' => 'fixed']]);
        $serviceClass = Mockery::mock('alias:App\Models\Service');
        $service = new Service;
        $service->admin_id = 'DB-1234';
        $service->name = 'Gel Nails';
        $service->rate = '850.50';
        $service->category = 'Nails';
        $serviceClass->shouldReceive('find')->andReturn($service);
        $serviceClass->shouldReceive('findOrFail')->andReturn($service);
        $presence = Mockery::mock(PresenceVerifierInterface::class);
        $presence->shouldReceive('getCount')->andReturn(1);
        $this->app['validator']->setPresenceVerifier($presence);

        $client = Mockery::mock(CloudinaryClient::class);
        $client->shouldReceive('upload')->twice()->andReturnUsing(function ($filePath, $options) {
            $this->assertFileExists($filePath);
            $this->assertSame('image/png', mime_content_type($filePath));
            $this->assertContains($options['folder'], ['Receipts/DB-1234', 'Inspo/DB-1234']);
            $expectedName = $options['folder'] === 'Receipts/DB-1234' ? 'Ana_Cruz' : 'Cruz';
            $this->assertSame($expectedName, $options['public_id']);

            return ['public_id' => $options['folder'].'/'.$options['public_id'], 'secure_url' => 'https://res.cloudinary.com/test-cloud/image/upload/'.$options['folder'].'/'.$options['public_id'].'.png'];
        });
        $this->app->instance(CloudinaryClient::class, $client);
        $saved = [];
        $bookingClass = Mockery::mock('alias:App\Models\Booking');
        $bookingClass->shouldReceive('create')->once()->andReturnUsing(function ($attributes) use (&$saved) {
            $saved = $attributes;

            return (object) ['id' => '507f1f77bcf86cd799439012'];
        });
        $imageData = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=');
        $this->post('/bookings', [
            'service_id' => '507f1f77bcf86cd799439011', 'admin_id' => 'ATTACKER',
            'service' => 'catalog', 'size' => 'standard', 'addon' => 'none',
            'removal' => '0', 'provider_chooses' => '0', 'terms_agreed' => '1',
            'selected_date' => now('Asia/Manila')->addDay()->format('Y-m-d'), 'selected_time' => '09:00 AM',
            'first_name' => 'Ana', 'last_name' => 'Cruz', 'email' => 'ana@example.com', 'phone' => '+639123456789',
            'payment_strategy' => 'downpayment', 'payment_method' => 'gcash', 'sender_name' => 'Ana Cruz',
            'receipt_file' => UploadedFile::fake()->createWithContent('receipt.png', $imageData),
            'reference_image' => UploadedFile::fake()->createWithContent('design.png', $imageData),
        ])->assertSessionHasNoErrors()->assertRedirect('/bookings/success/507f1f77bcf86cd799439012');
        $this->assertSame('DB-1234', $saved['admin_id']);
        $this->assertSame('Receipts/DB-1234/Ana_Cruz', $saved['receipt_public_id']);
        $this->assertSame('Inspo/DB-1234/Cruz', $saved['reference_public_id']);
        $this->assertStringStartsWith('https://', $saved['receipt_path']);
        $this->assertStringStartsWith('https://', $saved['reference_image']);
        $this->assertFalse($saved['provider_chooses']);
        $this->assertTrue($saved['terms_agreed']);
    }
}
