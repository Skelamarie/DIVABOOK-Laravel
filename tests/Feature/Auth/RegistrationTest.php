<?php

namespace Tests\Feature\Auth;

use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\PresenceVerifierInterface;
use Mockery;
use PHPUnit\Framework\Attributes\PreserveGlobalState;
use PHPUnit\Framework\Attributes\RunInSeparateProcess;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    public function test_registration_screen_can_be_rendered(): void
    {
        $this->get(route('register'))->assertOk();
    }

    #[RunInSeparateProcess]
    #[PreserveGlobalState(false)]
    public function test_new_partners_can_register_and_get_their_admin_session(): void
    {
        $presence = Mockery::mock(PresenceVerifierInterface::class);
        $presence->shouldReceive('getCount')->once()->andReturn(0);
        app('validator')->setPresenceVerifier($presence);
        $model = Mockery::mock('alias:App\Models\Partner');
        $query = Mockery::mock();
        $model->shouldReceive('where')->withArgs(fn ($field, $id) => $field === 'admin_id' && preg_match('/^DB-\d{4}$/', $id))->andReturn($query);
        $query->shouldReceive('exists')->once()->andReturnFalse();
        $adminId = null;
        $model->shouldReceive('create')->once()->andReturnUsing(function ($data) use (&$adminId) {
            $adminId = $data['admin_id'];
            $this->assertTrue(Hash::check('password', $data['password']));
            $this->assertSame('Test Salon', $data['branding']['salon_name']);
            $this->assertArrayNotHasKey('terms', $data);

            return (object) $data;
        });
        $response = $this->post(route('register.store'), ['name' => 'Test Partner', 'shop_name' => 'Test Salon',
            'email' => 'test@example.com', 'password' => 'password', 'phone' => '09123456789', 'address' => 'Davao', 'terms' => true]);
        $response->assertRedirect(route('admin.customization'))->assertSessionHas('admin_id', $adminId)->assertSessionHas('shop_name', 'Test Salon');
    }
}
