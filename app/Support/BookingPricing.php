<?php

namespace App\Support;

use App\Models\Service;

class BookingPricing
{
    public const SERVICES = [
        'soft-gel' => ['name' => 'Soft Gel Extension', 'price' => 850],
        'gel-overlay' => ['name' => 'Gel Overlay', 'price' => 550],
        'hard-biab' => ['name' => 'Hard BIAB', 'price' => 750],
        'soft-biab' => ['name' => 'Soft BIAB', 'price' => 650],
    ];

    public const SIZES = ['standard' => 0, 'xl' => 200];

    public const ADDONS = ['none' => 0, 'basic' => 200, 'moderate' => 500, 'heavy' => 1000];

    public const REMOVAL = 150;

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, string|int|float|null>
     */
    public static function calculate(Service $service, array $data): array
    {
        $base = self::SERVICES[$data['service']] ?? ['name' => $service->name, 'price' => (float) $service->rate];
        $sizePrice = self::SIZES[$data['size']];
        $addonPrice = self::ADDONS[$data['addon']];
        $removalPrice = ! empty($data['removal']) ? self::REMOVAL : 0;

        return [
            'service_name' => $base['name'],
            'service_price' => $base['price'],
            'size_name' => $data['size'] === 'xl' ? 'I - XXL' : 'Standard',
            'size_price' => $sizePrice,
            'addon_name' => $data['addon'] === 'none' ? null : ucfirst($data['addon']).' Design',
            'addon_price' => $addonPrice,
            'removal_price' => $removalPrice,
            'total_price' => round($base['price'] + $sizePrice + $addonPrice + $removalPrice, 2),
        ];
    }
}
