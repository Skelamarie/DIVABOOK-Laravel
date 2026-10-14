<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PartnerController;
use App\Http\Controllers\ServiceController;
use App\Http\Middleware\EnsurePartnerSession;
use App\Models\Booking;
use App\Models\Partner;
use App\Models\Service;
use App\Support\BookingPricing;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia; // Added BookingController

/*
|--------------------------------------------------------------------------
| 1. Customer Public Routes
|--------------------------------------------------------------------------
*/

// Home Page
Route::get('/', function () {
    $partners = Partner::take(3)->get()->map(function ($partner) {
        $branding = $partner->branding ?? [];
        $logo = $branding['logo_path'] ?? '';

        if (! empty($logo) && ! filter_var($logo, FILTER_VALIDATE_URL)) {
            $logo = '/'.ltrim($logo, '/');
        }

        return [
            'id' => (string) $partner->_id,
            'admin_id' => $partner->admin_id ?? '',
            'name' => $branding['salon_name'] ?? $partner->shop_name ?? 'Unnamed Service Provider',
            'description' => $branding['description'] ?? $partner->description ?? 'Premium service provider.',
            'logo' => ! empty($logo) ? $logo : null,
        ];
    });

    $catalogCategories = [
        'hair' => Service::where('category', 'regex', '/hair/i')->exists(),
        'nails' => Service::where('category', 'regex', '/nail/i')->exists(),
        'makeup' => Service::where('category', 'regex', '/makeup/i')->exists(),
        'spa' => Service::where('category', 'regex', '/spa/i')->exists(),
    ];

    return Inertia::render('Customer/HomePage', [
        'recommended' => $partners,
        'catalogCategories' => $catalogCategories,
    ]);
})->name('home');

// Contact Us Page
Route::get('/contact', function () {
    return Inertia::render('Customer/Contact');
})->name('contact');

Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:10,1')->name('contact.send');

// General Services Catalog Page
Route::get('/services', function (Request $request) {
    $category = $request->query('category');
    $adminId = $request->query('admin_id');

    $query = Service::query();

    // Filter by category if passed in query string
    if ($category) {
        $query->where('category', 'regex', '/'.preg_quote($category, '/').'/i');
    }

    // Filter by partner / admin_id if passed in query string
    if ($adminId) {
        $query->where('admin_id', $adminId);
    }

    $services = $query->get()->map(function ($svc) {
        $partner = Partner::where('admin_id', $svc->admin_id)->first();

        $branding = $partner->branding ?? [];
        $shopName = $branding['salon_name'] ?? $partner->shop_name ?? 'Premier Partner';

        $photosArray = is_array($svc->photos) ? $svc->photos : [];
        $rawPhoto = ! empty($photosArray) ? $photosArray[0] : ($svc->photo ?? '');

        if (! empty($rawPhoto) && ! filter_var($rawPhoto, FILTER_VALIDATE_URL)) {
            $svcPhoto = '/'.ltrim($rawPhoto, '/');
        } else {
            $svcPhoto = ! empty($rawPhoto) ? $rawPhoto : '/img/placeholder.png';
        }

        return [
            'id' => (string) $svc->_id,
            'name' => $svc->name ?? 'Untitled Service',
            'category' => $svc->category ?? 'General',
            'rate' => $svc->rate ?? '0',
            'description' => $svc->description ?? '',
            'photo' => $svcPhoto,
            'photos' => array_map(fn ($photo) => filter_var($photo, FILTER_VALIDATE_URL) ? $photo : '/'.ltrim($photo, '/'), $photosArray),
            'shop_name' => $shopName,
            'admin_id' => $svc->admin_id ?? '',
        ];
    });

    return Inertia::render('Customer/GenServices', [
        'services' => $services,
        'selectedCategory' => $category,
        'selectedAdminId' => $adminId,
    ]);
})->name('services.index');

// Individual Service / Provider Detail Page
Route::get('/services/{id}', function ($id) {
    $service = Service::where('_id', $id)->firstOrFail();
    $partner = Partner::where('admin_id', $service->admin_id)->first();

    $branding = $partner->branding ?? [];
    $shopName = $branding['salon_name'] ?? $partner->shop_name ?? 'Premier Partner';

    $logo = $branding['logo_path'] ?? '';
    if (! empty($logo) && ! filter_var($logo, FILTER_VALIDATE_URL)) {
        $logo = '/'.ltrim($logo, '/');
    }

    $photosArray = is_array($service->photos) ? $service->photos : [];
    $rawPhoto = ! empty($photosArray) ? $photosArray[0] : ($service->photo ?? '');

    if (! empty($rawPhoto) && ! filter_var($rawPhoto, FILTER_VALIDATE_URL)) {
        $svcPhoto = '/'.ltrim($rawPhoto, '/');
    } else {
        $svcPhoto = ! empty($rawPhoto) ? $rawPhoto : '/img/placeholder.png';
    }

    return Inertia::render('Customer/ServiceDetail', [
        'bookingOptions' => ['services' => BookingPricing::SERVICES, 'sizes' => BookingPricing::SIZES, 'addons' => BookingPricing::ADDONS, 'removal' => BookingPricing::REMOVAL],
        'occupiedSlotsMap' => BookingController::occupiedSlots($service->admin_id),
        'service' => [
            'id' => (string) $service->_id,
            'name' => $service->name ?? 'Untitled Service',
            'category' => $service->category ?? 'General',
            'rate' => $service->rate ?? '0',
            'description' => $service->description ?? '',
            'duration' => $service->duration ?? '1 hour',
            'photo' => $svcPhoto,
            'provider' => [
                'admin_id' => $partner->admin_id ?? '',
                'shop_name' => $shopName,
                'description' => $branding['description'] ?? $partner->description ?? '',
                'logo' => ! empty($logo) ? $logo : null,
                'payment_qr' => $branding['payment_qr'] ?? [],
                'color_primary' => $branding['color_primary'] ?? '#064E3B',
                'color_secondary' => $branding['color_secondary'] ?? '#7cbf7f',
                'address' => $branding['location'] ?? $partner->address ?? '',
                'phone' => $branding['contact_info'] ?? $partner->phone ?? '',
                'email' => $branding['email'] ?? $partner->email ?? '',
            ],
        ],
    ]);
})->name('services.show');

/*
|--------------------------------------------------------------------------
| Booking Flow Routes
|--------------------------------------------------------------------------
*/
// Step 1: B1.jsx (Select Service & Addons)
Route::get('/booking/step-1', [BookingController::class, 'create'])->name('bookings.create');

// Legacy step URLs return to the unified wizard; customer data stays in React state.
Route::redirect('/booking/step-2', '/booking/step-1')->name('bookings.step2');

// Checkout is step 3 of the same wizard.
Route::redirect('/booking/checkout', '/booking/step-1')->name('bookings.checkout');

// Submit Booking to MongoDB
Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store');

// Success Page
Route::get('/bookings/success/{booking}', [BookingController::class, 'showSuccess'])->name('bookings.success');

/*
|--------------------------------------------------------------------------
| 2. Partner Authentication Routes
|--------------------------------------------------------------------------
*/

// Login Page (Redirects to overview if logged in)
Route::get('/login', function () {
    if (session()->has('admin_id')) {
        return redirect()->route('admin.overview');
    }

    return Inertia::render('Admin/Login');
})->name('login');

Route::post('/login', [PartnerController::class, 'login'])->middleware('throttle:login')->name('login.store');

// Registration Page (Redirects to overview if logged in)
Route::get('/register', function () {
    if (session()->has('admin_id')) {
        return redirect()->route('admin.overview');
    }

    return Inertia::render('Admin/Registration');
})->name('register');

Route::post('/register', [PartnerController::class, 'store'])->name('register.store');

Route::post('/logout', [PartnerController::class, 'logout'])->name('logout');

/*
|--------------------------------------------------------------------------
| 3. Admin Dashboard & Management Routes
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->middleware(EnsurePartnerSession::class)->group(function () {

    // Overview
    Route::get('/overview', function () {
        if (! session()->has('admin_id')) {
            return redirect()->route('login');
        }

        $adminId = session('admin_id');
        $partner = Partner::where('admin_id', $adminId)->first();
        $today = Carbon::now('Asia/Manila');
        $todayFormats = [$today->format('Y-m-d'), $today->format('F j, Y'), $today->format('M j, Y')];

        $totalBookings = Booking::where('admin_id', $adminId)->count();
        $pendingApprovals = Booking::where('admin_id', $adminId)->where('status', 'pending')->count();
        $todayAppointments = Booking::where('admin_id', $adminId)
            ->whereIn('selected_date', $todayFormats)
            ->where('status', '!=', 'declined')
            ->count();
        $cancelledToday = Booking::where('admin_id', $adminId)
            ->whereIn('selected_date', $todayFormats)
            ->whereIn('status', ['declined', 'cancelled'])
            ->count();

        return Inertia::render('Admin/Overview', [
            'partner' => $partner,
            'stats' => [
                'totalBookings' => $totalBookings,
                'pendingApprovals' => $pendingApprovals,
                'todayAppointments' => $todayAppointments,
                'cancelledToday' => $cancelledToday,
            ],
        ]);
    })->name('admin.overview');

    // Live Stats API
    Route::get('/api/overview-stats', function () {
        $adminId = session('admin_id');
        if (! $adminId) {
            return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);
        }

        $now = Carbon::now('Asia/Manila');
        $todayDate = $now->format('Y-m-d');
        $bookings = Booking::where('admin_id', $adminId)->get();

        $weekStart = (clone $now)->startOfWeek();
        $weekEnd = (clone $now)->endOfWeek();
        $weeklyDays = array_fill(0, 7, 0);
        $weeklyTotal = 0;

        $pendingReqs = [];
        $todayAppts = [];
        $pendingCount = 0;
        $cancelledToday = 0;
        $todayCount = 0;

        foreach ($bookings as $b) {
            $status = strtolower($b->status ?? 'pending');
            $date = Carbon::parse($b->selected_date);

            if ($status === 'pending') {
                $pendingCount++;
                $pendingReqs[] = [
                    'id' => (string) $b->_id,
                    'name' => trim(($b->first_name ?? '').' '.($b->last_name ?? '')),
                    'service' => $b->service_name ?? 'Service',
                    'date' => $b->selected_date,
                    'time' => $b->selected_time ?? 'N/A',
                ];
            }

            if ($date->format('Y-m-d') === $todayDate) {
                if (in_array($status, ['declined', 'cancelled'])) {
                    $cancelledToday++;
                } else {
                    $todayCount++;
                    $todayAppts[] = [
                        'id' => (string) $b->_id,
                        'name' => trim(($b->first_name ?? '').' '.($b->last_name ?? '')),
                        'service' => $b->service_name ?? 'Service',
                        'time' => $b->selected_time ?? 'N/A',
                        'status' => $status,
                    ];
                }
            }

            if ($date->between($weekStart, $weekEnd)) {
                $dayIndex = ($date->dayOfWeekIso - 1);
                $weeklyDays[$dayIndex]++;
                $weeklyTotal++;
            }
        }

        return response()->json([
            'success' => true,
            'totalBookings' => count($bookings),
            'weekly' => [
                'count' => $weeklyTotal,
                'labels' => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                'data' => $weeklyDays,
            ],
            'pendingApprovals' => $pendingCount,
            'cancelledToday' => $cancelledToday,
            'todayAppointments' => [
                'count' => $todayCount,
                'items' => $todayAppts,
            ],
            'pendingServiceApprovals' => [
                'count' => $pendingCount,
                'items' => $pendingReqs,
            ],
        ]);
    });

    // Bookings Calendar
    Route::get('/bookings', function () {
        if (! session()->has('admin_id')) {
            return redirect()->route('login');
        }

        $adminId = session('admin_id');
        $partner = Partner::where('admin_id', $adminId)->first();
        $bookings = Booking::where('admin_id', $adminId)->get();

        $calendarAppts = [];
        $pendingRequests = [];

        foreach ($bookings as $doc) {
            try {
                $dateKey = Carbon::parse($doc->selected_date)->format('Y-n-j');
            } catch (\Throwable $exception) {
                // An invalid legacy date must not prevent other bookings displaying.
                $dateKey = 'unscheduled';
            }
            $docId = (string) ($doc->_id ?? $doc->id);
            $status = strtolower($doc->status ?? 'pending');

            if ($status === 'pending') {
                $item = $doc->toArray();
                $item['id'] = $docId;
                $item['_id'] = $docId;
                $pendingRequests[] = $item;
            }

            $calendarAppts[$dateKey][] = [
                'id' => $docId,
                'title' => $doc->service_name ?? 'Service',
                'time' => $doc->selected_time ?? '',
                'date' => $doc->selected_date ?? '',
                'status' => $status,
                'name' => trim(($doc->first_name ?? '').' '.($doc->last_name ?? '')),
                'email' => $doc->email ?? '',
                'request' => $doc->special_requests ?? '',
                'method' => $doc->payment_method ?? ($doc->payment_strategy ?? 'N/A'),
                'paid' => number_format((float) ($doc->amount_paid ?? 0), 2),
            ];
        }

        return Inertia::render('Admin/Bookings', [
            'partner' => $partner,
            'appointments' => $calendarAppts,
            'pendingRequests' => $pendingRequests,
        ]);
    })->name('admin.bookings');

    Route::post('/bookings/{id}/status', [BookingController::class, 'update'])->name('admin.bookings.status');

    Route::get('/bookings/{id}', function ($id) {
        if (! session()->has('admin_id')) {
            return redirect()->route('login');
        }

        $adminId = session('admin_id');
        $partner = Partner::where('admin_id', $adminId)->first();
        $booking = Booking::where('_id', $id)->where('admin_id', $adminId)->firstOrFail();
        $bookingData = $booking->toArray();
        $bookingData['id'] = (string) ($booking->_id ?? $booking->id);
        $bookingData['_id'] = $bookingData['id'];

        return Inertia::render('Admin/ViewDetails', [
            'partner' => $partner,
            'booking' => $bookingData,
        ]);
    })->name('admin.bookings.detail');

    Route::get('/clients', function () {
        $clients = Booking::where('admin_id', session('admin_id'))->get()
            ->groupBy(fn ($booking) => strtolower($booking->email ?? ''))
            ->map(fn ($bookings) => [
                'name' => trim($bookings->last()->first_name.' '.$bookings->last()->last_name),
                'email' => $bookings->last()->email, 'phone' => $bookings->last()->phone,
                'bookings_count' => $bookings->count(),
            ])->values();

        return Inertia::render('Admin/Clients', ['clients' => $clients]);
    })->name('admin.clients');

    Route::get('/services', function () {
        $partner = Partner::where('admin_id', session('admin_id'))->firstOrFail();

        return Inertia::render('Admin/Customization', [
            'partner' => $partner, 'services' => Service::where('admin_id', session('admin_id'))->get(),
            'initialTab' => 'services',
        ]);
    })->name('admin.services');

    // Customization
    Route::get('/customization', function () {
        if (! session()->has('admin_id')) {
            return redirect()->route('login');
        }

        $adminId = session('admin_id');
        $partner = Partner::where('admin_id', $adminId)->first();
        $services = Service::where('admin_id', $adminId)->get();

        return Inertia::render('Admin/Customization', [
            'partner' => $partner,
            'services' => $services,
        ]);
    })->name('admin.customization');

    Route::post('/delete-account', [PartnerController::class, 'destroy'])->name('admin.account.destroy');

    Route::post('/profile', [PartnerController::class, 'update'])->name('admin.profile.update');

    Route::post('/services', [ServiceController::class, 'store'])->name('admin.services.save');

    Route::delete('/services/{id}', [ServiceController::class, 'destroy'])->name('admin.services.destroy');
});
// Keep the starter-kit settings routes available for its existing components.
Route::redirect('/dashboard', '/admin/overview')->name('dashboard');
require __DIR__.'/settings.php';
