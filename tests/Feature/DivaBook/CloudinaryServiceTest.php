<?php

namespace Tests\Feature\DivaBook;

use App\Services\CloudinaryClient;
use App\Services\CloudinaryConfiguration;
use App\Services\CloudinaryService;
use Illuminate\Http\UploadedFile;
use Mockery;
use RuntimeException;
use Tests\TestCase;

class CloudinaryServiceTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['cloudinary' => ['cloud_name' => 'test-cloud', 'api_key' => '123456', 'api_secret' => 'test-secret', 'folder_mode' => 'fixed']]);
    }

    private function image(): UploadedFile
    {
        return UploadedFile::fake()->createWithContent('test.png', base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII='));
    }

    private function service(CloudinaryClient $client): CloudinaryService
    {
        return new CloudinaryService(new CloudinaryConfiguration, $client);
    }

    public function test_receipt_uses_sender_name_and_trusted_admin_folder(): void
    {
        $client = Mockery::mock(CloudinaryClient::class);
        $client->shouldReceive('upload')->once()->withArgs(function ($path, $options) {
            $this->assertTrue(is_readable($path));
            $this->assertSame('Receipts/DB-1234', $options['folder']);
            $this->assertSame('Ana_Cruz', $options['public_id']);
            $this->assertFalse($options['overwrite']);
            $this->assertSame('sha256', $options['signature_algorithm']);

            return true;
        })->andReturn(['public_id' => 'Receipts/DB-1234/Ana_Cruz', 'secure_url' => 'https://res.cloudinary.com/test-cloud/receipt.png']);
        $result = $this->service($client)->uploadReceipt($this->image(), 'DB-1234', 'Ana Cruz', 'Different', 'Name');
        $this->assertSame('Receipts/DB-1234/Ana_Cruz', $result['public_id']);
    }

    public function test_receipt_falls_back_to_customer_name_when_sender_is_empty(): void
    {
        $client = Mockery::mock(CloudinaryClient::class);
        $client->shouldReceive('upload')->withArgs(fn ($path, $options) => $options['public_id'] === 'Ana_Cruz')->andReturn(['public_id' => 'Receipts/DB-1234/Ana_Cruz', 'secure_url' => 'https://res.cloudinary.com/test-cloud/receipt.png']);
        $this->assertSame('Receipts/DB-1234/Ana_Cruz', $this->service($client)->uploadReceipt($this->image(), 'DB-1234', '', 'Ana', 'Cruz')['public_id']);
    }

    public function test_duplicate_receipt_gets_a_unique_name_instead_of_returning_existing_customer_proof(): void
    {
        $client = Mockery::mock(CloudinaryClient::class);
        $calls = 0;
        $client->shouldReceive('upload')->twice()->andReturnUsing(function ($path, $options) use (&$calls) {
            $this->assertFalse($options['overwrite']);
            if ($calls++ === 0) {
                return ['existing' => true, 'public_id' => 'Receipts/DB-1234/Ana_Cruz'];
            }
            $this->assertMatchesRegularExpression('/^Ana_Cruz_\d{8}_\d{6}_\d{6}_[A-Z0-9]{6}$/', $options['public_id']);

            return ['public_id' => $options['folder'].'/'.$options['public_id'], 'secure_url' => 'https://res.cloudinary.com/test-cloud/new-proof.png'];
        });
        $result = $this->service($client)->uploadReceipt($this->image(), 'DB-1234', 'Ana Cruz', 'Ana', 'Cruz');
        $this->assertSame('https://res.cloudinary.com/test-cloud/new-proof.png', $result['secure_url']);
    }

    public function test_inspiration_uses_last_name_and_does_not_accept_path_separators(): void
    {
        $client = Mockery::mock(CloudinaryClient::class);
        $client->shouldReceive('upload')->withArgs(function ($path, $options) {
            $this->assertSame('Inspo/DB-1234', $options['folder']);
            $this->assertSame('Nunez_admin', $options['public_id']);

            return true;
        })->andReturn(['public_id' => 'Inspo/DB-1234/Nunez_admin', 'secure_url' => 'https://res.cloudinary.com/test-cloud/design.png']);
        $this->service($client)->uploadInspiration($this->image(), 'DB-1234', 'Nuñez / ../ admin');
    }

    public function test_sample_images_retry_collisions_with_the_next_sequential_name(): void
    {
        $client = Mockery::mock(CloudinaryClient::class);
        $calls = 0;
        $client->shouldReceive('upload')->twice()->andReturnUsing(function ($path, $options) use (&$calls) {
            $this->assertSame('Samples/DB-1234/Gel_Nails', $options['folder']);
            if ($calls++ === 0) {
                $this->assertSame('Image_3', $options['public_id']);

                return ['existing' => true];
            }
            $this->assertSame('Image_4', $options['public_id']);

            return ['public_id' => 'Samples/DB-1234/Gel_Nails/Image_4', 'secure_url' => 'https://res.cloudinary.com/test-cloud/sample.png'];
        });
        $result = $this->service($client)->uploadSample($this->image(), 'DB-1234', 'Gel Nails', 3);
        $this->assertSame(4, $result['sequence']);
    }

    public function test_dynamic_folder_mode_sets_both_media_library_location_and_full_public_id(): void
    {
        config(['cloudinary.folder_mode' => 'dynamic']);
        $client = Mockery::mock(CloudinaryClient::class);
        $client->shouldReceive('upload')->once()->withArgs(function ($path, $options) {
            $this->assertArrayNotHasKey('folder', $options);
            $this->assertSame('PFP/DB-1234', $options['asset_folder']);
            $this->assertSame('PFP/DB-1234/Image_2', $options['public_id']);
            $this->assertSame('Image_2', $options['display_name']);

            return true;
        })->andReturn(['public_id' => 'PFP/DB-1234/Image_2', 'secure_url' => 'https://res.cloudinary.com/test-cloud/logo.png']);
        $this->assertSame(2, $this->service($client)->uploadLogo($this->image(), 'DB-1234', 2)['sequence']);
    }

    public function test_auto_folder_mode_is_detected_once_and_cached(): void
    {
        config(['cloudinary.folder_mode' => 'auto']);
        $client = Mockery::mock(CloudinaryClient::class);
        $client->shouldReceive('settings')->once()->andReturn(['settings' => ['folder_mode' => 'dynamic']]);
        $service = $this->service($client);
        $this->assertSame('dynamic', $service->folderMode());
        $this->assertSame('dynamic', $service->folderMode());
    }

    public function test_invalid_admin_id_is_rejected_before_any_api_request(): void
    {
        $client = Mockery::mock(CloudinaryClient::class);
        $client->shouldNotReceive('upload');
        $this->expectException(RuntimeException::class);
        $this->service($client)->uploadLogo($this->image(), '../../another-admin');
    }

    public function test_connection_diagnostic_distinguishes_successful_ping_from_missing_folder_settings(): void
    {
        config(['cloudinary.folder_mode' => 'auto']);
        $client = Mockery::mock(CloudinaryClient::class);
        $client->shouldReceive('ping')->once()->andReturn(['status' => 'ok']);
        $client->shouldReceive('settings')->once()->andReturn(['cloud_name' => 'test-cloud']);
        $this->app->instance(CloudinaryService::class, $this->service($client));
        $this->artisan('cloudinary:check')
            ->expectsOutputToContain('Cloudinary ping succeeded, but folder-mode detection failed:')
            ->expectsOutputToContain('Authentication and the ping endpoint worked.')
            ->assertFailed();
    }

    public function test_invalid_uploaded_file_is_rejected_before_any_api_request(): void
    {
        $client = Mockery::mock(CloudinaryClient::class);
        $client->shouldNotReceive('upload');
        $file = new UploadedFile($this->image()->getPathname(), 'failed.png', 'image/png', UPLOAD_ERR_INI_SIZE, true);
        $this->expectException(RuntimeException::class);
        $this->service($client)->uploadLogo($file, 'DB-1234');
    }

    public function test_url_configuration_supports_percent_encoded_credentials_and_redacts_them(): void
    {
        config(['cloudinary' => ['url' => 'cloudinary://123456:a%2Bb%3Ac@test-cloud', 'folder_mode' => 'fixed']]);
        $configuration = new CloudinaryConfiguration;
        $this->assertSame('a+b:c', $configuration->credentials()['api_secret']);
        $this->assertSame('Error [redacted] [redacted]', $configuration->redact('Error 123456 a+b:c'));
        $this->assertSame('[redacted] [redacted]', $configuration->redact('cloudinary://123456:a%2Bb%3Ac@test-cloud a%2Bb%3Ac'));
    }

    public function test_conflicting_url_and_separate_credentials_fail_without_disclosing_secrets(): void
    {
        config(['cloudinary.url' => 'cloudinary://123456:different-secret@test-cloud']);
        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('disagree');
        (new CloudinaryConfiguration)->credentials();
    }

    public function test_offline_diagnostic_can_validate_configuration_without_calling_cloudinary(): void
    {
        $this->artisan('cloudinary:check --offline')->assertSuccessful();
    }
}
