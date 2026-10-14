<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RuntimeException;
use Throwable;

class CloudinaryService
{
    public function __construct(private CloudinaryConfiguration $configuration, private CloudinaryClient $client) {}

    public function uploadReceipt(UploadedFile $file, string $adminId, string $senderName, string $firstName, string $lastName): array
    {
        $name = trim($senderName) !== '' ? $senderName : trim($firstName.' '.$lastName);

        return $this->uploadNamed($file, 'Receipts/'.$this->adminSegment($adminId), $this->segment($name, 'Customer'));
    }

    public function uploadInspiration(UploadedFile $file, string $adminId, string $lastName): array
    {
        return $this->uploadNamed($file, 'Inspo/'.$this->adminSegment($adminId), $this->segment($lastName, 'Customer'));
    }

    public function uploadSample(UploadedFile $file, string $adminId, string $serviceName, int $nextSequence = 1): array
    {
        return $this->uploadNamed($file, 'Samples/'.$this->adminSegment($adminId).'/'.$this->segment($serviceName, 'Service'), null, $nextSequence);
    }

    public function uploadLogo(UploadedFile $file, string $adminId, int $nextSequence = 1): array
    {
        return $this->uploadNamed($file, 'PFP/'.$this->adminSegment($adminId), null, $nextSequence);
    }

    public function folderMode(): string
    {
        $options = $this->configuration->credentials();
        $mode = config('cloudinary.folder_mode', 'auto');
        if ($mode !== 'auto') {
            return $mode;
        }

        return Cache::remember('cloudinary-folder-mode-'.hash('sha256', $options['cloud_name'].'|'.$options['api_key']), 3600, function () use ($options) {
            $settings = $this->client->settings($options);
            $mode = $settings['settings']['folder_mode'] ?? $settings['folder_mode'] ?? null;
            if (! in_array($mode, ['fixed', 'dynamic'], true)) {
                throw new RuntimeException('Could not detect Cloudinary folder mode. Set CLOUDINARY_FOLDER_MODE to fixed or dynamic to match your product environment.');
            }

            return $mode;
        });
    }

    public function checkConnection(): array
    {
        $options = $this->configuration->credentials();
        $response = $this->client->ping($options);
        if (($response['status'] ?? null) !== 'ok') {
            throw new RuntimeException('Cloudinary ping did not return an OK status.');
        }

        try {
            return ['status' => 'ok', 'folder_mode' => $this->folderMode()];
        } catch (Throwable $exception) {
            throw new RuntimeException('Cloudinary ping succeeded, but folder-mode detection failed: '.$exception->getMessage(), 0, $exception);
        }
    }

    public function cleanup(array $publicIds): void
    {
        foreach ($publicIds as $publicId) {
            try {
                $this->client->destroy($publicId, [...$this->configuration->credentials(), 'resource_type' => 'image', 'invalidate' => true]);
            } catch (Throwable $exception) {
                $this->logFailure($exception, 'cleanup');
            }
        }
    }

    public function logFailure(Throwable $exception, string $context): void
    {
        Log::error('DivaBook image operation failed.', ['operation' => $context,
            'reason' => $this->configuration->redact($exception->getMessage()), 'exception' => get_class($exception)]);
    }

    private function uploadNamed(UploadedFile $file, string $folder, ?string $baseName, int $nextSequence = 1): array
    {
        if (! $file->isValid() || ! $file->getRealPath() || ! is_readable($file->getRealPath())) {
            throw new RuntimeException('No readable uploaded file was received. Check multipart encoding and PHP upload limits.');
        }
        if ($file->getSize() > 5 * 1024 * 1024) {
            throw new RuntimeException('Image must not exceed 5 MB.');
        }
        $credentials = $this->configuration->credentials();
        $mode = $this->folderMode();
        $sequence = max(1, $nextSequence);
        for ($attempt = 0; $attempt < 100; $attempt++) {
            $name = $baseName === null ? 'Image_'.$sequence : ($attempt === 0 ? $baseName : $baseName.'_'.now()->format('Ymd_His_u').'_'.substr((string) Str::ulid(), -6));
            $fullId = $folder.'/'.$name;
            $options = [...$credentials, 'resource_type' => 'image', 'overwrite' => false, 'unique_filename' => false, 'use_filename' => false, 'allowed_formats' => ['jpg', 'jpeg', 'png']];
            if ($mode === 'dynamic') {
                $options += ['asset_folder' => $folder, 'public_id' => $fullId, 'display_name' => $name];
            } else {
                $options += ['folder' => $folder, 'public_id' => $name];
            }
            $response = $this->client->upload($file->getRealPath(), $options);
            if (! empty($response['existing'])) {
                $sequence++;

                continue;
            }
            if (($response['public_id'] ?? '') !== $fullId || ! str_starts_with($response['secure_url'] ?? '', 'https://')) {
                throw new RuntimeException('Cloudinary returned an unexpected image identifier or delivery URL.');
            }

            return [...$response, 'sequence' => $sequence];
        }

        throw new RuntimeException('Could not allocate an unused image name. Please try again.');
    }

    private function segment(string $value, string $fallback): string
    {
        $value = preg_replace('/[^A-Za-z0-9_-]+/', '_', Str::ascii(trim($value)));

        return substr(trim($value, '_-') ?: $fallback, 0, 80);
    }

    private function adminSegment(string $adminId): string
    {
        if (! preg_match('/^[A-Za-z0-9_-]{1,100}$/', $adminId)) {
            throw new RuntimeException('The store has an invalid admin ID.');
        }

        return $adminId;
    }
}
