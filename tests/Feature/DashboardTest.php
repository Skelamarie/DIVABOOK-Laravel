<?php

namespace Tests\Feature;

use Tests\TestCase;

class DashboardTest extends TestCase
{
    public function test_guests_are_redirected_to_the_partner_login_page(): void
    {
        $this->get(route('dashboard'))->assertRedirect(route('login'));
    }

    public function test_signed_in_partners_are_redirected_to_the_admin_overview(): void
    {
        $this->withSession(['admin_id' => 'DB-1234', 'shop_name' => 'Salon'])
            ->get(route('dashboard'))->assertRedirect(route('admin.overview'));
    }
}
