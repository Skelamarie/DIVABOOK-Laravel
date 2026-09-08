<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Service;
use App\Models\Partner;
// use App\Http\Requests\StoreBookingRequest; // Optional: Can be removed if using inline validation below
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

    public function store(Request $request): RedirectResponse
    {
        // 1. Validate the incoming camelCase payload from React
        $validated = $request->validate([
            'serviceName'      => 'required|string',
            'servicePrice'     => 'required|numeric',
            'addonName'        => 'nullable|string',
            'addonPrice'       => 'nullable|numeric',
            'sizePrice'        => 'nullable|numeric',
            'removalPrice'     => 'nullable|numeric',
            'selected_date'    => 'required|string',
            'selected_time'    => 'required|string',
            'paymentStrategy'  => 'required|string|in:downpayment,full',
            'paymentMethod'    => 'required|string|in:gcash,paymaya,shopeepay',
            'amountPaid'       => 'required|numeric',
            'senderName'       => 'required|string',
            'receiptFile'      => 'required|image|mimes:jpeg,png,jpg|max:5120', // 5MB limit

            // Expected user fields from Step 1/Step 2
            'first_name'       => 'nullable|string',
            'last_name'        => 'nullable|string',
            'email'            => 'nullable|email',
            'phone'            => 'nullable|string',
            'admin_id'         => 'nullable|string',
            'special_requests' => 'nullable|string',
        ]);

        // 2. Handle the Receipt Upload (stored locally under storage/app/public/receipts)
        $receiptPath = null;
        if ($request->hasFile('receiptFile')) {
            $receiptPath = $request->file('receiptFile')->store('receipts', 'public');
        }

        // 3. Calculate Total Price
        $totalPrice = $validated['servicePrice']
                    + ($validated['sizePrice'] ?? 0)
                    + ($validated['addonPrice'] ?? 0)
                    + ($validated['removalPrice'] ?? 0);

        // 4. Map React's camelCase to MongoDB Model's snake_case
        $booking = Booking::create([
            'admin_id'         => $validated['admin_id'] ?? 'DB-BEL-001',
            'first_name'       => $validated['first_name'] ?? null,
            'last_name'        => $validated['last_name'] ?? null,
            'email'            => $validated['email'] ?? null,
            'phone'            => $validated['phone'] ?? null,
            'special_requests' => $validated['special_requests'] ?? null,

            'service_name'     => $validated['serviceName'],
            'service_price'    => $validated['servicePrice'],
            'size_price'       => $validated['sizePrice'] ?? 0,
            'addon_name'       => $validated['addonName'] ?? null,
            'addon_price'      => $validated['addonPrice'] ?? 0,
            'removal'          => ($validated['removalPrice'] ?? 0) > 0,
            'removal_price'    => $validated['removalPrice'] ?? 0,

            'selected_date'    => $validated['selected_date'],
            'selected_time'    => $validated['selected_time'],

            'total_price'      => $totalPrice,
            'amount_paid'      => $validated['amountPaid'],
            'payment_strategy' => $validated['paymentStrategy'],
            'payment_method'   => $validated['paymentMethod'],
            'sender_name'      => $validated['senderName'],
            'receipt_path'     => $receiptPath,

            'status'           => 'pending',
            'payment_status'   => 'pending',
        ]);

        // 5. Redirect to Success Page
        return redirect()->route('bookings.success', ['booking' => $booking->id]);
    }

    public function showSuccess(Booking $booking): Response
    {
        return Inertia::render('Customer/BookingSuccess', [
            'booking' => $booking,
        ]);
    }
}