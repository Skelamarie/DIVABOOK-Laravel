<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Service;
use App\Models\Partner;
use App\Http\Requests\StoreBookingRequest;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function create(Request $request): Response
    {
        $serviceId = $request->query('service_id');
        $service = Service::find($serviceId) ?? Service::first();
        $partner = Partner::where('admin_id', $service->admin_id ?? 'DB-BEL-001')->first();

        return Inertia::render('Customer/BookingStep1', [
            'selectedService' => $service,
            'partner' => $partner,
        ]);
    }

    public function store(StoreBookingRequest $request): RedirectResponse
    {
        $booking = Booking::create($request->validated());

        return redirect()->route('bookings.success', ['booking' => $booking->id]);
    }

    public function showSuccess(Booking $booking): Response
    {
        return Inertia::render('Customer/BookingSuccess', [
            'booking' => $booking,
        ]);
    }
}