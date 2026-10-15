<?php

namespace App\Console\Commands;

use App\Services\CloudinaryConfiguration;
use App\Services\CloudinaryService;
use Illuminate\Console\Command;
use Throwable;

class CheckCloudinary extends Command
{
    protected $signature = 'cloudinary:check {--offline : Validate local configuration without calling Cloudinary}';

    protected $description = 'Check Cloudinary credentials, PHP upload support, and API reachability without uploading an image.';

    public function handle(CloudinaryConfiguration $configuration, CloudinaryService $uploads): int
    {
        try {
            $configuration->credentials();
            foreach (['curl', 'fileinfo'] as $extension) {
                if (! extension_loaded($extension)) {
                    $this->error('Missing PHP extension: '.$extension);

                    return self::FAILURE;
                }
            }
            if (! filter_var(ini_get('file_uploads'), FILTER_VALIDATE_BOOLEAN)) {
                $this->error('PHP file_uploads is disabled. Enable it in the PHP settings used by Herd.');

                return self::FAILURE;
            }
            $this->info('Cloudinary configuration is valid. Credentials are hidden.');
            $this->line('PHP configuration file: '.(php_ini_loaded_file() ?: '(none)'));
            $this->line('PHP upload_max_filesize: '.ini_get('upload_max_filesize').'; post_max_size: '.ini_get('post_max_size').'; max_file_uploads: '.ini_get('max_file_uploads'));
            $postSize = ini_get('post_max_size');
            $uploadSize = ini_get('upload_max_filesize');
            if ($postSize === false || $uploadSize === false) {
                $this->error('PHP upload limits could not be inspected. Check your loaded PHP configuration.');

                return self::FAILURE;
            }
            $postLimit = ini_parse_quantity($postSize);
            if (ini_parse_quantity($uploadSize) < 5 * 1024 * 1024 || ($postLimit > 0 && $postLimit < 64 * 1024 * 1024) || (int) ini_get('max_file_uploads') < 10) {
                $this->warn('For the full 5 MB per-image limit and up to 10 sample photos, set upload_max_filesize=5M and post_max_size=64M in the PHP settings used by Herd. CLI and web PHP settings may differ.');
            }
            if ($this->option('offline')) {
                return self::SUCCESS;
            }
            $result = $uploads->checkConnection();
            $this->info('Cloudinary API connection OK. Folder mode: '.$result['folder_mode']);

            return self::SUCCESS;
        } catch (Throwable $exception) {
            $this->error($configuration->redact($exception->getMessage()));
            if (str_starts_with($exception->getMessage(), 'Cloudinary ping succeeded,')) {
                $this->line('Authentication and the ping endpoint worked. Check the settings API response or set CLOUDINARY_FOLDER_MODE to the actual mode shown in your Cloudinary product environment.');
            } else {
                $this->line('Check credentials and network access to the Cloudinary API. For TLS errors, configure PHP cURL CA certificates; keep certificate verification enabled.');
            }

            return self::FAILURE;
        }
    }
}
