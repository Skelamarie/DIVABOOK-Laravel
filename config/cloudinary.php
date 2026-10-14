<?php

return [
    'url' => env('CLOUDINARY_URL'),
    'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
    'api_key' => env('CLOUDINARY_API_KEY'),
    'api_secret' => env('CLOUDINARY_API_SECRET'),
    // auto detects and caches the product environment's folder mode.
    'folder_mode' => env('CLOUDINARY_FOLDER_MODE', 'auto'),
    'timeout' => (int) env('CLOUDINARY_TIMEOUT', 60),
    'connection_timeout' => (int) env('CLOUDINARY_CONNECTION_TIMEOUT', 10),
    'upload_prefix' => env('CLOUDINARY_UPLOAD_PREFIX', 'https://api.cloudinary.com'),
];
