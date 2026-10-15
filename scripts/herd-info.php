<?php

// This helper prints versions and configuration-presence booleans only.
// It never prints environment credentials or writes files.
if (in_array('--environment', $argv, true)) {
    require __DIR__.'/../vendor/autoload.php';
    $file = __DIR__.'/../.env';
    try {
        $values = is_file($file) ? Dotenv\Dotenv::parse(file_get_contents($file)) : [];
    } catch (Throwable) {
        echo json_encode(['error' => 'Could not parse .env. Check its quoting without sharing credentials.']);
        exit(1);
    }
    echo json_encode(['hasKey' => ! empty($values['APP_KEY']),
        'hasMongoUri' => ! empty($values['MONGODB_URI']),
        'hasCloudinary' => ! empty($values['CLOUDINARY_URL']) || (! empty($values['CLOUDINARY_CLOUD_NAME']) && ! empty($values['CLOUDINARY_API_KEY']) && ! empty($values['CLOUDINARY_API_SECRET']))]);
    exit;
}

$extensions = [];
foreach (['curl', 'fileinfo', 'mbstring', 'openssl', 'pdo_sqlite', 'dom', 'xml', 'xmlwriter'] as $name) {
    $extensions[$name] = extension_loaded($name);
}
echo json_encode(['phpVersion' => PHP_VERSION, 'phpVersionId' => PHP_VERSION_ID,
    'mongoVersion' => phpversion('mongodb') ?: null, 'extensions' => $extensions,
    'fileUploads' => filter_var(ini_get('file_uploads'), FILTER_VALIDATE_BOOLEAN),
    'uploadLimit' => ini_parse_quantity(ini_get('upload_max_filesize') ?: '0'),
    'postLimit' => ini_parse_quantity(ini_get('post_max_size') ?: '0'),
    'maxFiles' => (int) ini_get('max_file_uploads')]);
