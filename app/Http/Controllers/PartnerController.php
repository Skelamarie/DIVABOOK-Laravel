<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginPartnerRequest;
use App\Http\Requests\StorePartnerRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Models\Booking;
use App\Models\Partner;
use App\Models\Service;
use App\Services\CloudinaryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Throwable;

class PartnerController extends Controller
{
    public function login(LoginPartnerRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $partner = Partner::where('admin_id', $data['admin_id'])->where('email', $data['email'])->first();
        if (! $partner || ! Hash::check($data['password'], $partner->password)) {
            return back()->withErrors(['auth_failed' => 'Invalid Admin-ID, Email, or Password.'])->withInput($request->only('admin_id', 'email'));
        }

        $request->session()->regenerate();
        $request->session()->put(['admin_id' => $partner->admin_id, 'shop_name' => $partner->shop_name]);

        return to_route('admin.overview');
    }

    public function store(StorePartnerRequest $request): RedirectResponse
    {
        $data = $request->validated();
        do {
            $adminId = 'DB-'.random_int(1000, 9999);
        } while (Partner::where('admin_id', $adminId)->exists());

        $partner = Partner::create([
            ...array_diff_key($data, ['terms' => true]),
            'admin_id' => $adminId,
            'password' => Hash::make($data['password']),
            'branding' => [
                'salon_name' => $data['shop_name'], 'location' => $data['address'],
                'contact_info' => $data['phone'], 'email' => $data['email'],
                'color_primary' => '#064E3B', 'color_secondary' => '#7cbf7f',
                'description' => '', 'credentials' => '', 'facebook' => '',
                'facebook_url' => '', 'instagram' => '', 'instagram_url' => '', 'logo_path' => '',
            ],
        ]);
        $request->session()->regenerate();
        $request->session()->put(['admin_id' => $partner->admin_id, 'shop_name' => $partner->shop_name]);

        return to_route('admin.customization');
    }

    public function update(UpdateProfileRequest $request, CloudinaryService $uploads): RedirectResponse
    {
        $partner = Partner::where('admin_id', $request->session()->get('admin_id'))->firstOrFail();
        $branding = array_merge($partner->branding ?? [], $request->safe()->except(['logo_file']));
        $uploaded = [];
        try {
            if ($request->hasFile('logo_file')) {
                $logo = $uploads->uploadLogo($request->file('logo_file'), $partner->admin_id, ((int) ($branding['logo_sequence'] ?? 0)) + 1);
                $uploaded[] = $logo['public_id'];
                $branding['logo_path'] = $logo['secure_url'];
                $branding['logo_public_id'] = $logo['public_id'];
                $branding['logo_sequence'] = $logo['sequence'];
            }
            $partner->update(['branding' => $branding]);
        } catch (Throwable $exception) {
            $uploads->logFailure($exception, 'partner profile');
            $uploads->cleanup($uploaded);

            return back()->withErrors(['logo_file' => 'We could not save your profile image or changes. Please try again.']);
        }

        return back()->with('success', 'Profile saved.');
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return to_route('login');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $adminId = $request->session()->get('admin_id');
        Partner::where('admin_id', $adminId)->delete();
        Service::where('admin_id', $adminId)->delete();
        Booking::where('admin_id', $adminId)->delete();

        return $this->logout($request);
    }
}
