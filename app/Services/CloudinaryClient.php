<?php

namespace App\Services;

use Cloudinary\Api;
use Cloudinary\Uploader;

class CloudinaryClient
{
    /**
     * @param  array<string, mixed>  $options
     * @return array<string, mixed>
     */
    public function upload(string $filePath, array $options): array
    {
        // The installed 1.20 SDK omits newer dynamic-folder parameters from
        // build_upload_params; explicitly include them in the signed payload.
        $parameters = Uploader::build_upload_params($options);
        foreach (['asset_folder', 'display_name'] as $key) {
            if (isset($options[$key])) {
                $parameters[$key] = $options[$key];
            }
        }

        return Uploader::call_api('upload', $parameters, $options, $filePath);
    }

    /**
     * @param  array<string, mixed>  $options
     */
    public function destroy(string $publicId, array $options): void
    {
        Uploader::destroy($publicId, $options);
    }

    /**
     * @param  array<string, mixed>  $options
     * @return array<string, mixed>
     */
    public function ping(array $options): array
    {
        return (new Api)->ping($options)->getArrayCopy();
    }

    /**
     * @param  array<string, mixed>  $options
     * @return array<string, mixed>
     */
    public function settings(array $options): array
    {
        // SDK 1.20 uses http_build_query directly: a PHP boolean becomes
        // settings=1. Send the literal API boolean so settings are included.
        return (new Api)->call_api('get', ['config'], ['settings' => 'true'], $options)->getArrayCopy();
    }
}
