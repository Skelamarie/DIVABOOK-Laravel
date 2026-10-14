<?php

namespace Tests\Feature\DivaBook;

use App\Services\CloudinaryService;
use Illuminate\Http\UploadedFile;
use Mockery;
use PHPUnit\Framework\Attributes\PreserveGlobalState;
use PHPUnit\Framework\Attributes\RunInSeparateProcess;
use RuntimeException;
use Tests\TestCase;

class AdminUploadsTest extends TestCase
{
    private function image(string $name = 'photo.png'): UploadedFile
    {
        return UploadedFile::fake()->createWithContent($name, base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII='));
    }

    private function profileData(): array
    {
        return ['salon_name' => 'Salon', 'location' => 'Davao', 'contact_info' => '09123456789',
            'email' => 'salon@example.com', 'color_primary' => '#064E3B', 'color_secondary' => '#7cbf7f'];
    }

    private function serviceData(): array
    {
        return ['service_id' => '507f1f77bcf86cd799439011', 'service_name' => 'Gel Nails', 'category' => 'Nails', 'rate' => '850.50'];
    }

    #[RunInSeparateProcess]
    #[PreserveGlobalState(false)]
    public function test_multipart_profile_logo_is_received_as_a_file_and_saved_to_branding(): void
    {
        $partnerClass = Mockery::mock('alias:App\Models\Partner');
        $partner = Mockery::mock();
        $partner->admin_id = 'DB-1234';
        $partner->branding = ['logo_path' => 'https://example.com/old.png', 'logo_sequence' => 2, 'keep' => 'existing'];
        $query = Mockery::mock();
        $partnerClass->shouldReceive('where')->with('admin_id', 'DB-1234')->andReturn($query);
        $query->shouldReceive('firstOrFail')->andReturn($partner);
        $saved = [];
        $partner->shouldReceive('update')->once()->andReturnUsing(function ($attributes) use (&$saved) {
            $saved = $attributes;

            return true;
        });
        $uploads = Mockery::mock(CloudinaryService::class);
        $uploads->shouldReceive('uploadLogo')->once()->withArgs(fn ($file, $admin, $sequence) => $file instanceof UploadedFile && $file->isValid() && $admin === 'DB-1234' && $sequence === 3)
            ->andReturn(['public_id' => 'PFP/DB-1234/Image_3', 'secure_url' => 'https://res.cloudinary.com/test-cloud/logo.png', 'sequence' => 3]);
        $this->app->instance(CloudinaryService::class, $uploads);
        $this->withSession(['admin_id' => 'DB-1234'])->post('/admin/profile', [...$this->profileData(), 'admin_id' => 'attacker', 'logo_file' => $this->image()])
            ->assertSessionHasNoErrors()->assertRedirect();
        $this->assertSame('https://res.cloudinary.com/test-cloud/logo.png', $saved['branding']['logo_path']);
        $this->assertSame('PFP/DB-1234/Image_3', $saved['branding']['logo_public_id']);
        $this->assertSame('existing', $saved['branding']['keep']);
        $this->assertArrayNotHasKey('logo_file', $saved['branding']);
        $this->assertArrayNotHasKey('admin_id', $saved['branding']);
    }

    #[RunInSeparateProcess]
    #[PreserveGlobalState(false)]
    public function test_edit_service_appends_sample_urls_preserves_saved_photos_and_uses_session_admin(): void
    {
        $serviceClass = Mockery::mock('alias:App\Models\Service');
        $service = Mockery::mock();
        $service->photos = ['https://res.cloudinary.com/test-cloud/old.png'];
        $service->photo_public_ids = ['Samples/DB-1234/Gel_Nails/Image_1'];
        $service->photo_sequence = 1;
        $query = Mockery::mock();
        $serviceClass->shouldReceive('where')->with('_id', '507f1f77bcf86cd799439011')->andReturn($query);
        $query->shouldReceive('where')->with('admin_id', 'DB-1234')->andReturnSelf();
        $query->shouldReceive('firstOrFail')->andReturn($service);
        $saved = [];
        $service->shouldReceive('fill')->once()->andReturnUsing(function ($attributes) use (&$saved, $service) {
            $saved = $attributes;

            return $service;
        });
        $service->shouldReceive('save')->once()->andReturnTrue();
        $uploads = Mockery::mock(CloudinaryService::class);
        $uploads->shouldReceive('uploadSample')->once()->withArgs(fn ($file, $admin, $name, $sequence) => $file instanceof UploadedFile && $file->isValid() && $admin === 'DB-1234' && $name === 'Gel Nails' && $sequence === 2)
            ->andReturn(['public_id' => 'Samples/DB-1234/Gel_Nails/Image_2', 'secure_url' => 'https://res.cloudinary.com/test-cloud/new.png', 'sequence' => 2]);
        $this->app->instance(CloudinaryService::class, $uploads);
        $this->withSession(['admin_id' => 'DB-1234'])->post('/admin/services', [...$this->serviceData(), 'admin_id' => 'attacker', 'photos' => [$this->image()]])
            ->assertSessionHasNoErrors()->assertRedirect();
        $this->assertSame(['https://res.cloudinary.com/test-cloud/old.png', 'https://res.cloudinary.com/test-cloud/new.png'], $saved['photos']);
        $this->assertSame(2, $saved['photo_sequence']);
        $this->assertSame('850.50', $saved['rate']);
    }

    #[RunInSeparateProcess]
    #[PreserveGlobalState(false)]
    public function test_partial_sample_failure_cleans_only_new_uploads_and_does_not_save_service(): void
    {
        $serviceClass = Mockery::mock('alias:App\Models\Service');
        $service = Mockery::mock();
        $service->photos = [];
        $service->photo_public_ids = [];
        $service->photo_sequence = 0;
        $query = Mockery::mock();
        $serviceClass->shouldReceive('where')->andReturn($query);
        $query->shouldReceive('where')->with('admin_id', 'DB-1234')->andReturnSelf();
        $query->shouldReceive('firstOrFail')->andReturn($service);
        $service->shouldNotReceive('fill');
        $service->shouldNotReceive('save');
        $uploads = Mockery::mock(CloudinaryService::class);
        $uploads->shouldReceive('uploadSample')->withArgs(fn ($file, $admin, $name, $sequence) => $sequence === 1)
            ->andReturn(['public_id' => 'Samples/DB-1234/Gel_Nails/Image_1', 'secure_url' => 'https://res.cloudinary.com/test-cloud/one.png', 'sequence' => 1]);
        $uploads->shouldReceive('uploadSample')->withArgs(fn ($file, $admin, $name, $sequence) => $sequence === 2)->andThrow(new RuntimeException('Upload failed'));
        $uploads->shouldReceive('logFailure')->once();
        $uploads->shouldReceive('cleanup')->once()->with(['Samples/DB-1234/Gel_Nails/Image_1']);
        $this->app->instance(CloudinaryService::class, $uploads);
        $this->withSession(['admin_id' => 'DB-1234'])->post('/admin/services', [...$this->serviceData(), 'photos' => [$this->image('one.png'), $this->image('two.png')]])
            ->assertSessionHasErrors('photos.1');
    }

    public function test_file_strings_non_images_and_excess_sample_images_are_rejected_before_upload(): void
    {
        $uploads = Mockery::mock(CloudinaryService::class);
        $uploads->shouldNotReceive('uploadLogo');
        $uploads->shouldNotReceive('uploadSample');
        $this->app->instance(CloudinaryService::class, $uploads);
        $this->withSession(['admin_id' => 'DB-1234'])->post('/admin/profile', [...$this->profileData(), 'logo_file' => 'https://example.com/image.png'])->assertSessionHasErrors('logo_file');
        $this->withSession(['admin_id' => 'DB-1234'])->post('/admin/services', [...$this->serviceData(), 'photos' => [UploadedFile::fake()->create('bad.txt', 1, 'text/plain')]])->assertSessionHasErrors('photos.0');
        $this->withSession(['admin_id' => 'DB-1234'])->post('/admin/services', [...$this->serviceData(), 'photos' => array_fill(0, 11, $this->image())])->assertSessionHasErrors('photos');
    }
}
