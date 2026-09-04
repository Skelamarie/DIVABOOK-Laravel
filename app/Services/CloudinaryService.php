<?php

namespace App\Services;

use Cloudinary\Configuration\Configuration;
use Cloudinary\Api\Upload\UploadApi;

class CloudinaryService
{
    public function __construct()
    {
        Configuration::instance([
            'cloud' => [
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                'api_key'    => env('CLOUDINARY_API_KEY'),
                'api_secret' => env('CLOUDINARY_API_SECRET'),
            ],
            'url' => [
                'secure' => true,
            ],
        ]);
    }

    public function uploadImage($filePath, string $folder = 'divabook'): string
    {
        $uploadApi = new UploadApi();
        $response = $uploadApi->upload($filePath, [
            'folder' => $folder,
        ]);

        return $response['secure_url'];
    }
}