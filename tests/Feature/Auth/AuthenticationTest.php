<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Mockery;
use PHPUnit\Framework\Attributes\PreserveGlobalState;
use PHPUnit\Framework\Attributes\RunInSeparateProcess;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered(): void
    {
        $this->get(route('login'))->assertOk();
    }

    #[RunInSeparateProcess]
    #[PreserveGlobalState(false)]
    public function test_partners_can_authenticate_with_admin_id_email_and_password(): void
    {
        $this->mockPartner((object) ['admin_id' => 'DB-1234', 'shop_name' => 'Salon', 'password' => Hash::make('password')]);
        $this->post(route('login.store'), $this->credentials())
            ->assertRedirect(route('admin.overview'))
            ->assertSessionHas('admin_id', 'DB-1234')->assertSessionHas('shop_name', 'Salon');
    }

    #[RunInSeparateProcess]
    #[PreserveGlobalState(false)]
    public function test_an_unmatched_admin_id_email_pair_cannot_create_a_partner_session(): void
    {
        $this->mockPartner(null);
        $this->post(route('login.store'), $this->credentials())->assertSessionHasErrors('auth_failed')
            ->assertSessionMissing('admin_id')->assertSessionHasInput('admin_id', 'DB-1234');
        $this->assertNull(session()->getOldInput('password'));
    }

    #[RunInSeparateProcess]
    #[PreserveGlobalState(false)]
    public function test_partners_cannot_authenticate_with_an_invalid_password(): void
    {
        $this->mockPartner((object) ['admin_id' => 'DB-1234', 'shop_name' => 'Salon', 'password' => Hash::make('correct-password')]);
        $this->post(route('login.store'), $this->credentials())->assertSessionHasErrors('auth_failed')->assertSessionMissing('admin_id');
    }

    public function test_logout_clears_partner_and_starter_user_sessions(): void
    {
        $this->actingAs(User::factory()->create())->withSession(['admin_id' => 'DB-1234', 'shop_name' => 'Salon'])
            ->post(route('logout'))->assertRedirect(route('login'))->assertSessionMissing('admin_id')->assertSessionMissing('shop_name');
        $this->assertGuest();
    }

    public function test_login_attempts_are_rate_limited_before_database_access(): void
    {
        $data = ['email' => 'throttle@example.com', 'password' => 'wrong-password'];
        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->postJson(route('login.store'), $data)->assertUnprocessable()->assertJsonValidationErrors('admin_id');
        }
        $this->postJson(route('login.store'), $data)->assertTooManyRequests();
    }

    /** @return array<string, string> */
    private function credentials(): array
    {
        return ['admin_id' => 'DB-1234', 'email' => 'salon@example.com', 'password' => 'password'];
    }

    private function mockPartner(?object $partner): void
    {
        $model = Mockery::mock('alias:App\Models\Partner');
        $query = Mockery::mock();
        $model->shouldReceive('where')->once()->with('admin_id', 'DB-1234')->andReturn($query);
        $query->shouldReceive('where')->once()->with('email', 'salon@example.com')->andReturnSelf();
        $query->shouldReceive('first')->once()->andReturn($partner);
    }
}
