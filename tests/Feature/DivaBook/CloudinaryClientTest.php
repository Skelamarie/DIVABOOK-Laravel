<?php

namespace Tests\Feature\DivaBook;

use App\Services\CloudinaryClient;
use Mockery;
use PHPUnit\Framework\Attributes\PreserveGlobalState;
use PHPUnit\Framework\Attributes\RunInSeparateProcess;
use Tests\TestCase;

class CloudinaryClientTest extends TestCase
{
    #[RunInSeparateProcess]
    #[PreserveGlobalState(false)]
    public function test_settings_request_encodes_the_api_boolean_as_true_instead_of_one(): void
    {
        $sdk = Mockery::mock('overload:Cloudinary\\Api');
        $sdk->shouldReceive('call_api')->once()->withArgs(function ($method, $uri, $parameters, $options) {
            $this->assertSame('get', $method);
            $this->assertSame(['config'], $uri);
            $this->assertSame('settings=true', http_build_query($parameters));
            $this->assertSame('test-cloud', $options['cloud_name']);

            return true;
        })->andReturn(new \ArrayObject(['settings' => ['folder_mode' => 'dynamic']]));
        $result = (new CloudinaryClient)->settings(['cloud_name' => 'test-cloud']);
        $this->assertSame('dynamic', $result['settings']['folder_mode']);
    }

    #[RunInSeparateProcess]
    #[PreserveGlobalState(false)]
    public function test_legacy_sdk_signs_dynamic_folder_parameters_instead_of_silently_dropping_them(): void
    {
        $sdk = Mockery::mock('alias:Cloudinary\Uploader');
        $sdk->shouldReceive('build_upload_params')->once()->andReturn(['timestamp' => 123, 'public_id' => 'PFP/DB-1234/Image_1', 'overwrite' => '0']);
        $sdk->shouldReceive('call_api')->once()->withArgs(function ($action, $parameters, $options, $filePath) {
            $this->assertSame('upload', $action);
            $this->assertSame('/tmp/logo.png', $filePath);
            $this->assertSame('PFP/DB-1234', $parameters['asset_folder']);
            $this->assertSame('Image_1', $parameters['display_name']);
            $this->assertSame('sha256', $options['signature_algorithm']);

            return true;
        })->andReturn(['public_id' => 'PFP/DB-1234/Image_1', 'secure_url' => 'https://res.cloudinary.com/test-cloud/logo.png']);
        $result = (new CloudinaryClient)->upload('/tmp/logo.png', [
            'public_id' => 'PFP/DB-1234/Image_1', 'asset_folder' => 'PFP/DB-1234',
            'display_name' => 'Image_1', 'signature_algorithm' => 'sha256',
        ]);
        $this->assertSame('PFP/DB-1234/Image_1', $result['public_id']);
    }
}
