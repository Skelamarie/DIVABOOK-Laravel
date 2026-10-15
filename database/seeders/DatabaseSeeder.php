<?php

namespace Database\Seeders;

use App\Models\Partner;
use App\Models\Service;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create sample partner (Belleza)
        $partner = Partner::updateOrCreate(
            ['admin_id' => 'DB-BEL-001'],
            [
                'name' => 'Belleza Admin',
                'shop_name' => 'Belleza Nails & Spa',
                'email' => 'belleza@divabook.test',
                'password' => Hash::make('password123'),
                'phone' => '09171234567',
                'address' => 'MTS, Matina, Davao City',
                'biz_type' => 'Nail Salon',
                'capacity' => 5,
                'branding' => [
                    'salon_name' => 'Belleza Nails & Beauty',
                    'description' => 'Specialized nail artistry, BIAB overlays, and relaxing manicure treatments.',
                    'color_primary' => '#064E3B',
                    'color_secondary' => '#F43F5E',
                    'location' => 'MTS, Davao City, Philippines',
                ],
            ]
        );

        // 2. Create sample services
        $services = [
            [
                'admin_id' => $partner->admin_id,
                'name' => 'Soft BIAB Overlay',
                'category' => 'Nails',
                'description' => 'Builder in a bottle strengthening layer with gel color finish.',
                'rate' => '1200',
                'photos' => ['https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=500&q=80'],
            ],
            [
                'admin_id' => $partner->admin_id,
                'name' => 'Classic Gel Manicure',
                'category' => 'Nails',
                'description' => 'Cuticle care, nail shaping, and long-lasting UV gel polish.',
                'rate' => '650',
                'photos' => ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&q=80'],
            ],
            [
                'admin_id' => $partner->admin_id,
                'name' => 'Full Soft Gel Extensions with Nail Art',
                'category' => 'Nails',
                'description' => 'Full set tip extension with custom hand-painted nail design.',
                'rate' => '1800',
                'photos' => ['https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=500&q=80'],
            ],
            [
                'admin_id' => $partner->admin_id,
                'name' => 'Express Gel Removal & Treatment',
                'category' => 'Care',
                'description' => 'Safe removal of old gel polish followed by deep keratin nail hydration.',
                'rate' => '350',
                'photos' => ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80'],
            ],
        ];

        foreach ($services as $service) {
            Service::updateOrCreate(
                ['admin_id' => $service['admin_id'], 'name' => $service['name']],
                $service
            );
        }
    }
}
