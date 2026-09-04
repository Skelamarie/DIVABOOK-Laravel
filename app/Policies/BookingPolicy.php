<?php

namespace App\Policies;

use App\Models\Partner;
use App\Models\Booking;

class BookingPolicy
{
    public function viewAny(?Partner $user): bool { return true; }
    public function view(Partner $user, Booking $booking): bool { return $user->admin_id === $booking->admin_id; }
    public function create(?Partner $user): bool { return true; }
    public function update(Partner $user, Booking $booking): bool { return $user->admin_id === $booking->admin_id; }
    public function delete(Partner $user, Booking $booking): bool { return $user->admin_id === $booking->admin_id; }
}