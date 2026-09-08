<?php

use App\Models\Booking;
use App\Models\Partner;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ServiceController;

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

        if (!empty($logo) && !filter_var($logo, FILTER_VALIDATE_URL)) {
            $logo = '/' . ltrim($logo, '/');
        }

        return [
            'id'          => (string) $partner->_id,
            'admin_id'    => $partner->admin_id ?? '',
            'name'        => $branding['salon_name'] ?? $partner->shop_name ?? 'Unnamed Service Provider',
            'description' => $branding['description'] ?? $partner->description ?? 'Premium service provider.',
            'logo'        => !empty($logo) ? $logo : null,
        ];
    });

    $catalogCategories = [
        'hair'   => Service::where('category', 'regex', '/hair/i')->exists(),
        'nails'  => Service::where('category', 'regex', '/nail/i')->exists(),
        'makeup' => Service::where('category', 'regex', '/makeup/i')->exists(),
        'spa'    => Service::where('category', 'regex', '/spa/i')->exists(),
    ];

    return Inertia::render('Customer/HomePage', [
        'recommended'       => $partners,
        'catalogCategories' => $catalogCategories,
    ]);
})->name('home');

// Contact Us Page
Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

// General Services Catalog Page
Route::get('/services', function (Request $request) {
    $category = $request->query('category');
    $adminId = $request->query('admin_id');

    $query = Service::query();

    // Filter by category if passed in query string
    if ($category) {
        $query->where('category', 'regex', '/' . preg_quote($category, '/') . '/i');
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
        $rawPhoto = !empty($photosArray) ? $photosArray[0] : ($svc->photo ?? '');

        if (!empty($rawPhoto) && !filter_var($rawPhoto, FILTER_VALIDATE_URL)) {
            $svcPhoto = '/' . ltrim($rawPhoto, '/');
        } else {
            $svcPhoto = !empty($rawPhoto) ? $rawPhoto : '/img/placeholder.png';
        }

        return [
            'id'          => (string) $svc->_id,
            'name'        => $svc->name ?? 'Untitled Service',
            'category'    => $svc->category ?? 'General',
            'rate'        => $svc->rate ?? '0',
            'description' => $svc->description ?? '',
            'photo'       => $svcPhoto,
            'shop_name'   => $shopName,
            'admin_id'    => $svc->admin_id ?? '',
        ];
    });

    return Inertia::render('Customer/GenServices', [
        'services'         => $services,
        'selectedCategory' => $category,
        'selectedAdminId'  => $adminId,
    ]);
})->name('services.index');

// Individual Service / Provider Detail Page
Route::get('/services/{id}', function ($id) {
    $service = Service::where('_id', $id)->firstOrFail();
    $partner = Partner::where('admin_id', $service->admin_id)->first();

    $branding = $partner->branding ?? [];
    $shopName = $branding['salon_name'] ?? $partner->shop_name ?? 'Premier Partner';
    
    $logo = $branding['logo_path'] ?? '';
    if (!empty($logo) && !filter_var($logo, FILTER_VALIDATE_URL)) {
        $logo = '/' . ltrim($logo, '/');
    }

    $photosArray = is_array($service->photos) ? $service->photos : [];
    $rawPhoto = !empty($photosArray) ? $photosArray[0] : ($service->photo ?? '');

    if (!empty($rawPhoto) && !filter_var($rawPhoto, FILTER_VALIDATE_URL)) {
        $svcPhoto = '/' . ltrim($rawPhoto, '/');
    } else {
        $svcPhoto = !empty($rawPhoto) ? $rawPhoto : '/img/placeholder.png';
    }

    return Inertia::render('Customer/ServiceDetail', [
        'service' => [
            'id'          => (string) $service->_id,
            'name'        => $service->name ?? 'Untitled Service',
            'category'    => $service->category ?? 'General',
            'rate'        => $service->rate ?? '0',
            'description' => $service->description ?? '',
            'duration'    => $service->duration ?? '1 hour',
            'photo'       => $svcPhoto,
            'provider'    => [
                'admin_id'    => $partner->admin_id ?? '',
                'shop_name'   => $shopName,
                'description' => $branding['description'] ?? $partner->description ?? '',
                'logo'        => !empty($logo) ? $logo : null,
                'address'     => $branding['location'] ?? $partner->address ?? '',
                'phone'       => $branding['contact_info'] ?? $partner->phone ?? '',
                'email'       => $branding['email'] ?? $partner->email ?? '',
            ],
        ],
    ]);
})->name('services.show');

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

Route::post('/login', function (Request $request) {
    $request->validate([
        'admin_id' => ['required', 'string'],
        'email'    => ['required', 'email'],
        'password' => ['required', 'string'],
    ]);

    $partner = Partner::where('admin_id', $request->admin_id)
        ->where('email', $request->email)
        ->first();

    if ($partner && Hash::check($request->password, $partner->password)) {
        session()->regenerate();
        session([
            'admin_id'  => $partner->admin_id,
            'shop_name' => $partner->shop_name,
        ]);
        return redirect()->route('admin.overview');
    }

    return back()->withErrors([
        'auth_failed' => 'Invalid Admin-ID, Email, or Password.',
    ]);
});

// Registration Page (Redirects to overview if logged in)
Route::get('/register', function () {
    if (session()->has('admin_id')) {
        return redirect()->route('admin.overview');
    }
    return Inertia::render('Admin/Registration');
})->name('register');

Route::post('/register', function (Request $request) {
    $request->validate([
        'name'      => ['required', 'string', 'max:255'],
        'shop_name' => ['required', 'string', 'max:255'],
        'email'     => ['required', 'string', 'regex:/^.+@.+\..+$/'],
        'password'  => ['required', 'string', 'min:6'],
        'phone'     => ['required', 'regex:/^[0-9]{11}$/'],
        'address'   => ['required', 'string'],
    ], [
        'name.required'      => 'Full name is required.',
        'shop_name.required' => 'Business name is required.',
        'email.required'     => 'Business email is required.',
        'email.regex'        => 'Email must contain "@" and a valid domain (e.g. name@domain.com).',
        'password.required'  => 'Password is required.',
        'password.min'       => 'Password must be at least 6 characters.',
        'phone.required'     => 'Phone number is required.',
        'phone.regex'        => 'Phone number must be exactly 11 digits (e.g. 09123456789).',
        'address.required'   => 'Business address is required.',
    ]);

    if (!$request->terms) {
        return back()->withErrors(['terms' => 'You must agree to the Partner Terms & Privacy Policy.']);
    }

    $existing = Partner::where('email', $request->email)->first();
    if ($existing) {
        return back()->withErrors(['email' => 'This email is already registered. Please log in or use another email.']);
    }

    try {
        $adminId = 'DB-' . rand(1000, 9999);

        $defaultBranding = [
            'salon_name'      => $request->shop_name,
            'location'        => $request->address,
            'contact_info'    => $request->phone,
            'email'           => $request->email,
            'color_primary'   => '#064E3B',
            'color_secondary' => '#7cbf7f',
            'description'     => '',
            'credentials'     => '',
            'facebook'        => '',
            'facebook_url'    => '',
            'instagram'       => '',
            'instagram_url'   => '',
            'logo_path'       => '',
        ];

        $partner = Partner::create([
            'admin_id'  => $adminId,
            'name'      => $request->name,
            'shop_name' => $request->shop_name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'phone'     => $request->phone,
            'address'   => $request->address,
            'branding'  => $defaultBranding,
        ]);

        session()->regenerate();
        session([
            'admin_id'  => $partner->admin_id ?? $adminId,
            'shop_name' => $partner->shop_name ?? $request->shop_name,
        ]);

        // Takes new registrations to customization immediately
        return redirect()->route('admin.customization');
    } catch (\Throwable $e) {
        return back()->withErrors(['general' => 'Database error: ' . $e->getMessage()]);
    }
});

Route::post('/logout', function () {
    session()->invalidate();
    session()->regenerateToken();
    return redirect()->route('login');
})->name('logout');

/*
|--------------------------------------------------------------------------
| 3. Admin Dashboard & Management Routes
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->group(function () {

    // Overview
    Route::get('/overview', function () {
        if (!session()->has('admin_id')) {
            return redirect()->route('login');
        }

        $adminId = session('admin_id');
        $partner = Partner::where('admin_id', $adminId)->first();
        $todayFormatted = Carbon::now('Asia/Manila')->format('F j, Y');

        $totalBookings = Booking::where('admin_id', $adminId)->count();
        $pendingApprovals = Booking::where('admin_id', $adminId)->where('status', 'pending')->count();
        $todayAppointments = Booking::where('admin_id', $adminId)
            ->where('selected_date', $todayFormatted)
            ->where('status', '!=', 'declined')
            ->count();
        $cancelledToday = Booking::where('admin_id', $adminId)
            ->where('selected_date', $todayFormatted)
            ->whereIn('status', ['declined', 'cancelled'])
            ->count();

        return Inertia::render('Admin/Overview', [
            'partner' => $partner,
            'stats'   => [
                'totalBookings'     => $totalBookings,
                'pendingApprovals'  => $pendingApprovals,
                'todayAppointments' => $todayAppointments,
                'cancelledToday'    => $cancelledToday,
            ],
        ]);
    })->name('admin.overview');

    // Live Stats API
    Route::get('/api/overview-stats', function () {
        $adminId = session('admin_id');
        if (!$adminId) {
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
                    'id'      => (string) $b->_id,
                    'name'    => trim(($b->first_name ?? '') . ' ' . ($b->last_name ?? '')),
                    'service' => $b->service_name ?? 'Service',
                    'date'    => $b->selected_date,
                    'time'    => $b->selected_time ?? 'N/A',
                ];
            }

            if ($date->format('Y-m-d') === $todayDate) {
                if (in_array($status, ['declined', 'cancelled'])) {
                    $cancelledToday++;
                } else {
                    $todayCount++;
                    $todayAppts[] = [
                        'id'      => (string) $b->_id,
                        'name'    => trim(($b->first_name ?? '') . ' ' . ($b->last_name ?? '')),
                        'service' => $b->service_name ?? 'Service',
                        'time'    => $b->selected_time ?? 'N/A',
                        'status'  => $status,
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
            'success'                 => true,
            'totalBookings'           => count($bookings),
            'weekly'                  => [
                'count'  => $weeklyTotal,
                'labels' => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                'data'   => $weeklyDays,
            ],
            'pendingApprovals'        => $pendingCount,
            'cancelledToday'          => $cancelledToday,
            'todayAppointments'       => [
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
        if (!session()->has('admin_id')) {
            return redirect()->route('login');
        }

        $adminId = session('admin_id');
        $partner = Partner::where('admin_id', $adminId)->first();
        $bookings = Booking::where('admin_id', $adminId)->get();

        $calendarAppts = [];
        $pendingRequests = [];

        foreach ($bookings as $doc) {
            $dateKey = Carbon::parse($doc->selected_date)->format('Y-n-j');
            $status = strtolower($doc->status ?? 'pending');

            if ($status === 'pending') {
                $pendingRequests[] = $doc;
            }

            $calendarAppts[$dateKey][] = [
                'id'      => (string) $doc->_id,
                'title'   => $doc->service_name ?? 'Service',
                'time'    => $doc->selected_time ?? '',
                'date'    => $doc->selected_date ?? '',
                'status'  => $status,
                'name'    => trim(($doc->first_name ?? '') . ' ' . ($doc->last_name ?? '')),
                'email'   => $doc->email ?? '',
                'request' => $doc->special_requests ?? '',
                'method'  => $doc->payment_method ?? 'N/A',
                'paid'    => number_format((float) ($doc->amount_paid ?? 0), 2),
            ];
        }

        return Inertia::render('Admin/Bookings', [
            'partner'         => $partner,
            'appointments'    => $calendarAppts,
            'pendingRequests' => $pendingRequests,
        ]);
    })->name('admin.bookings');

    Route::post('/bookings/{id}/status', function (Request $request, $id) {
        $adminId = session('admin_id');
        $request->validate(['status' => 'required|string']);

        $booking = Booking::where('_id', $id)->where('admin_id', $adminId)->firstOrFail();
        $booking->update(['status' => $request->status]);

        return back();
    })->name('admin.bookings.status');

    Route::get('/bookings/{id}', function ($id) {
        if (!session()->has('admin_id')) {
            return redirect()->route('login');
        }

        $adminId = session('admin_id');
        $partner = Partner::where('admin_id', $adminId)->first();
        $booking = Booking::where('_id', $id)->where('admin_id', $adminId)->firstOrFail();

        return Inertia::render('Admin/ViewDetail', [
            'partner' => $partner,
            'booking' => $booking,
        ]);
    })->name('admin.bookings.detail');

    // Customization
    Route::get('/customization', function () {
        if (!session()->has('admin_id')) {
            return redirect()->route('login');
        }

        $adminId = session('admin_id');
        $partner = Partner::where('admin_id', $adminId)->first();
        $services = Service::where('admin_id', $adminId)->get();

        return Inertia::render('Admin/Customization', [
            'partner'  => $partner,
            'services' => $services,
        ]);
    })->name('admin.customization');

    Route::post('/profile', function (Request $request) {
        $adminId = session('admin_id');
        $partner = Partner::where('admin_id', $adminId)->firstOrFail();

        $branding = array_merge($partner->branding ?? [], [
            'salon_name'      => $request->salon_name,
            'description'     => $request->description,
            'credentials'     => $request->credentials,
            'location'        => $request->location,
            'contact_info'    => $request->contact_info,
            'email'           => $request->email,
            'facebook'        => $request->facebook,
            'facebook_url'    => $request->facebook_url,
            'instagram'       => $request->instagram,
            'instagram_url'   => $request->instagram_url,
            'color_primary'   => $request->color_primary ?? '#064E3B',
            'color_secondary' => $request->color_secondary ?? '#7cbf7f',
        ]);

        $partner->update(['branding' => $branding]);
        return back();
    })->name('admin.profile.update');

    Route::post('/services', function (Request $request) {
        $adminId = session('admin_id');

        if ($request->service_id) {
            $service = Service::where('_id', $request->service_id)
                ->where('admin_id', $adminId)
                ->firstOrFail();

            $service->update([
                'name'        => $request->service_name,
                'category'    => $request->category,
                'rate'        => $request->rate,
                'description' => $request->description,
            ]);
        } else {
            Service::create([
                'admin_id'    => $adminId,
                'name'        => $request->service_name,
                'category'    => $request->category,
                'rate'        => $request->rate,
                'description' => $request->description,
                'photos'      => [],
            ]);
        }

        return back();
    })->name('admin.services.save');

    Route::delete('/services/{id}', function ($id) {
        $adminId = session('admin_id');
        Service::where('_id', $id)->where('admin_id', $adminId)->delete();
        return back();
    })->name('admin.services.destroy');
});