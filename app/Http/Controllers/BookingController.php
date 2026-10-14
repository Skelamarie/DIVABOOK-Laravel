<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingRequest;
use App\Models\Booking;
use App\Models\Partner;
use App\Models\Service;
use App\Services\CloudinaryService;
use App\Support\BookingPricing;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class BookingController extends Controller
{
    public function create(Request $request): Response
    {
        $service = $request->filled('service_id') ? Service::findOrFail($request->query('service_id')) : Service::firstOrFail();
        $partner = Partner::where('admin_id', $service->admin_id)->firstOrFail();

        return Inertia::render('Customer/BookingStep1', [
            'bookingOptions' => ['services' => BookingPricing::SERVICES, 'sizes' => BookingPricing::SIZES, 'addons' => BookingPricing::ADDONS, 'removal' => BookingPricing::REMOVAL],
            'selectedService' => $service, 'partner' => $partner,
            'occupiedSlotsMap' => self::occupiedSlots($service->admin_id),
        ]);
    }

    public static function occupiedSlots(string $adminId): array
    {
        return Booking::where('admin_id', $adminId)->whereIn('status', ['approved', 'confirmed'])
            ->get()->groupBy(fn ($booking) => Carbon::parse($booking->selected_date)->format('Y-m-d'))
            ->map(fn ($bookings) => $bookings->pluck('selected_time')->unique()->values()->all())->all();
    }

    public function store(StoreBookingRequest $request, CloudinaryService $uploads): RedirectResponse
    {
        $data = $request->validated();
        $service = Service::findOrFail($data['service_id']);
        $prices = BookingPricing::calculate($service, $data);
        $uploaded = [];
        $failureField = 'receipt_file';
        try {
            $receipt = $uploads->uploadReceipt($request->file('receipt_file'), $service->admin_id, $data['sender_name'], $data['first_name'], $data['last_name']);
            $uploaded[] = $receipt['public_id'];
            $reference = null;
            if (! $data['provider_chooses'] && $request->hasFile('reference_image')) {
                $failureField = 'reference_image';
                $reference = $uploads->uploadInspiration($request->file('reference_image'), $service->admin_id, $data['last_name']);
                $uploaded[] = $reference['public_id'];
            }
            $failureField = 'booking';
            $booking = Booking::create([
                ...array_diff_key($data, ['service_id' => true, 'receipt_file' => true, 'reference_image' => true]),
                ...$prices,
                'admin_id' => $service->admin_id,
                'amount_paid' => $data['payment_strategy'] === 'full' ? $prices['total_price'] : min(450, $prices['total_price']),
                'receipt_path' => $receipt['secure_url'], 'receipt_public_id' => $receipt['public_id'],
                'reference_image' => $reference['secure_url'] ?? null, 'reference_public_id' => $reference['public_id'] ?? null,
                'status' => 'pending', 'payment_status' => 'pending',
            ]);
        } catch (Throwable $exception) {
            $uploads->logFailure($exception, 'booking '.$failureField);
            $uploads->cleanup($uploaded);

            return back()->withErrors([$failureField => $failureField === 'booking'
                ? 'We could not save your booking. Please try again.'
                : 'We could not upload this image. Please try again.']);
        }

        return to_route('bookings.success', ['booking' => $booking->id]);
    }

    public function update(UpdateBookingRequest $request, string $id): RedirectResponse
    {
        Booking::where('_id', $id)->where('admin_id', $request->session()->get('admin_id'))->firstOrFail()->update($request->validated());

        return back();
    }

    public function showSuccess(Booking $booking): Response
    {
        return Inertia::render('Customer/BookingSuccess', ['booking' => $booking]);
    }
}
