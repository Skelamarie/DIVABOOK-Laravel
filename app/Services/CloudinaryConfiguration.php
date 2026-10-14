<?php

namespace App\Services;

use RuntimeException;

class CloudinaryConfiguration
{
    public function credentials(): array
    {
        $configuration = config('cloudinary', []);
        $credentials = [];
        foreach (['cloud_name', 'api_key', 'api_secret'] as $key) {
            $credentials[$key] = trim((string) ($configuration[$key] ?? ''));
        }
        if (! empty($configuration['url'])) {
            $url = parse_url(trim($configuration['url']));
            if ($url === false || ($url['scheme'] ?? '') !== 'cloudinary') {
                throw new RuntimeException('CLOUDINARY_URL must use cloudinary://API_KEY:API_SECRET@CLOUD_NAME.');
            }
            $fromUrl = ['cloud_name' => $url['host'] ?? '', 'api_key' => rawurldecode($url['user'] ?? ''), 'api_secret' => rawurldecode($url['pass'] ?? '')];
            foreach ($fromUrl as $key => $value) {
                if ($value === '') {
                    throw new RuntimeException('CLOUDINARY_URL is incomplete.');
                }
                if ($credentials[$key] !== '' && ! hash_equals($credentials[$key], $value)) {
                    throw new RuntimeException('CLOUDINARY_URL and the separate Cloudinary credential fields disagree. Use matching credentials from one product environment.');
                }
                $credentials[$key] = $value;
            }
        }
        foreach ($credentials as $key => $value) {
            if ($value === '') {
                throw new RuntimeException('Missing Cloudinary configuration: '.strtoupper('CLOUDINARY_'.$key).'.');
            }
        }
        if (! preg_match('/^[a-zA-Z0-9_-]+$/', $credentials['cloud_name']) || ! ctype_digit($credentials['api_key'])) {
            throw new RuntimeException('Cloudinary cloud name or API key has an invalid format.');
        }
        $prefix = rtrim((string) ($configuration['upload_prefix'] ?? 'https://api.cloudinary.com'), '/');
        if (! in_array($prefix, ['https://api.cloudinary.com', 'https://api-eu.cloudinary.com', 'https://api-ap.cloudinary.com'], true)) {
            throw new RuntimeException('CLOUDINARY_UPLOAD_PREFIX must be a Cloudinary HTTPS API endpoint.');
        }
        if (! in_array($configuration['folder_mode'] ?? 'auto', ['auto', 'fixed', 'dynamic'], true)) {
            throw new RuntimeException('CLOUDINARY_FOLDER_MODE must be auto, fixed, or dynamic.');
        }

        return [...$credentials, 'secure' => true, 'signature_algorithm' => 'sha256', 'upload_prefix' => $prefix,
            'timeout' => max(1, (int) ($configuration['timeout'] ?? 60)),
            'connection_timeout' => max(1, (int) ($configuration['connection_timeout'] ?? 10))];
    }

    public function redact(string $message): string
    {
        $configuration = config('cloudinary', []);
        $secrets = array_filter([$configuration['api_key'] ?? '', $configuration['api_secret'] ?? '', $configuration['url'] ?? '']);
        if (! empty($configuration['url'])) {
            $parts = parse_url($configuration['url']);
            if (is_array($parts)) {
                $secrets = [...$secrets, ...array_filter([$parts['user'] ?? '', $parts['pass'] ?? '', rawurldecode($parts['user'] ?? ''), rawurldecode($parts['pass'] ?? '')])];
            }
        }

        $secrets = array_values(array_unique($secrets));
        usort($secrets, fn (string $a, string $b) => strlen($b) <=> strlen($a));

        return str_replace($secrets, '[redacted]', $message);
    }
}
