<?php

namespace Tests\Feature\DivaBook;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Inertia\Testing\AssertableInertia;
use Mockery;
use PHPUnit\Framework\Attributes\PreserveGlobalState;
use PHPUnit\Framework\Attributes\RunInSeparateProcess;
use RuntimeException;
use Tests\TestCase;

class MergeCompatibilityTest extends TestCase
{
    public function test_contact_validation_and_guest_account_delete_do_not_reach_the_database(): void
    {
        $this->postJson('/contact', ['type' => 'unknown'])->assertUnprocessable()
            ->assertJsonValidationErrors(['fullname', 'email', 'type', 'message']);
        $this->postJson('/admin/delete-account', [])->assertUnauthorized();
    }

    #[RunInSeparateProcess]
    #[PreserveGlobalState(false)]
    public function test_contact_form_saves_only_validated_fields_and_confirms_receipt(): void
    {
        $inquiry = Mockery::mock('alias:App\Models\Inquiry');
        $data = ['fullname' => 'Ana Cruz', 'email' => 'ana@example.com', 'type' => 'General Support', 'message' => 'Please help with my booking.'];
        $inquiry->shouldReceive('create')->once()->with($data)->andReturn((object) $data);
        $this->post('/contact', [...$data, 'admin_id' => 'untrusted'])->assertRedirect('/contact')
            ->assertSessionHas('success', 'Your inquiry has been received.');
    }

    #[RunInSeparateProcess]
    #[PreserveGlobalState(false)]
    public function test_failed_contact_save_returns_an_error_instead_of_a_success_notice(): void
    {
        $inquiry = Mockery::mock('alias:App\Models\Inquiry');
        $inquiry->shouldReceive('create')->once()->andThrow(new RuntimeException('Database unavailable'));
        $this->from('/contact')->post('/contact', ['fullname' => 'Ana Cruz', 'email' => 'ana@example.com', 'type' => 'General Support', 'message' => 'Help'])
            ->assertRedirect('/contact')->assertSessionHasErrors('message')->assertSessionMissing('success');
    }

    #[RunInSeparateProcess]
    #[PreserveGlobalState(false)]
    public function test_account_deletion_uses_session_admin_for_all_three_collections_and_logs_out(): void
    {
        foreach (['Partner', 'Service', 'Booking'] as $name) {
            $model = Mockery::mock('alias:App\\Models\\'.$name);
            $query = Mockery::mock();
            $model->shouldReceive('where')->once()->with('admin_id', 'DB-1234')->andReturn($query);
            $query->shouldReceive('delete')->once()->andReturn(1);
        }
        $this->withSession(['admin_id' => 'DB-1234', 'shop_name' => 'Salon'])
            ->post('/admin/delete-account', ['admin_id' => 'another-admin'])->assertRedirect('/login')
            ->assertSessionMissing('admin_id')->assertSessionMissing('shop_name');
    }

    #[RunInSeparateProcess]
    #[PreserveGlobalState(false)]
    public function test_booking_details_use_the_requested_id_and_session_admin_and_return_string_ids(): void
    {
        $partner = Mockery::mock('alias:App\Models\Partner');
        $partnerQuery = Mockery::mock();
        $partner->shouldReceive('where')->with('admin_id', 'DB-1234')->andReturn($partnerQuery);
        $partnerQuery->shouldReceive('first')->andReturn(null);
        $bookingModel = Mockery::mock('alias:App\Models\Booking');
        $query = Mockery::mock();
        $bookingModel->shouldReceive('where')->once()->with('_id', '507f1f77bcf86cd799439011')->andReturn($query);
        $query->shouldReceive('where')->once()->with('admin_id', 'DB-1234')->andReturnSelf();
        $record = Mockery::mock();
        $record->_id = new \MongoDB\BSON\ObjectId('507f1f77bcf86cd799439011');
        $record->shouldReceive('toArray')->andReturn(['first_name' => 'Ana']);
        $query->shouldReceive('firstOrFail')->once()->andReturn($record);
        $this->withSession(['admin_id' => 'DB-1234'])->get('/admin/bookings/507f1f77bcf86cd799439011')
            ->assertOk()->assertInertia(fn (AssertableInertia $page) => $page->component('Admin/ViewDetails')
                ->where('booking.id', '507f1f77bcf86cd799439011')->where('booking._id', '507f1f77bcf86cd799439011'));
    }

    #[RunInSeparateProcess]
    #[PreserveGlobalState(false)]
    public function test_missing_or_other_admin_booking_returns_404_without_an_unrelated_fallback(): void
    {
        $partner = Mockery::mock('alias:App\Models\Partner');
        $partnerQuery = Mockery::mock();
        $partner->shouldReceive('where')->with('admin_id', 'DB-1234')->andReturn($partnerQuery);
        $partnerQuery->shouldReceive('first')->andReturn(null);
        $booking = Mockery::mock('alias:App\Models\Booking');
        $query = Mockery::mock();
        $booking->shouldReceive('where')->once()->with('_id', '507f1f77bcf86cd799439011')->andReturn($query);
        $query->shouldReceive('where')->once()->with('admin_id', 'DB-1234')->andReturnSelf();
        $query->shouldReceive('firstOrFail')->once()->andThrow(new ModelNotFoundException);
        $this->withSession(['admin_id' => 'DB-1234'])->get('/admin/bookings/507f1f77bcf86cd799439011')->assertNotFound();
    }
}
