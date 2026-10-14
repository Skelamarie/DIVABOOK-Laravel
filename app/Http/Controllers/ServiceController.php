<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceRequest;
use App\Models\Partner;
use App\Models\Service;
use App\Services\CloudinaryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class ServiceController extends Controller
{
    public function index(Request $request): Response
    {
        $adminId = $request->query('admin_id', 'DB-BEL-001');
        $partner = Partner::where('admin_id', $adminId)->first();
        $services = Service::where('admin_id', $adminId)->get();

        return Inertia::render('Customer/ServiceList', [
            'services' => $services,
            'partner' => $partner,
        ]);
    }

    public function store(StoreServiceRequest $request, CloudinaryService $uploads): RedirectResponse
    {
        $data = $request->validated();
        $adminId = $request->session()->get('admin_id');
        $service = ! empty($data['service_id'])
            ? Service::where('_id', $data['service_id'])->where('admin_id', $adminId)->firstOrFail()
            : new Service(['admin_id' => $adminId]);
        $photos = $service->photos ?? [];
        $publicIds = $service->photo_public_ids ?? [];
        $sequence = max((int) ($service->photo_sequence ?? 0), count($photos));
        $uploaded = [];
        $failureField = 'photos';
        try {
            foreach ($request->file('photos', []) as $index => $file) {
                $failureField = 'photos.'.$index;
                $photo = $uploads->uploadSample($file, $adminId, $data['service_name'], $sequence + 1);
                $uploaded[] = $photo['public_id'];
                $photos[] = $photo['secure_url'];
                $publicIds[] = $photo['public_id'];
                $sequence = $photo['sequence'];
            }
            $failureField = 'photos';
            $service->fill([
                'name' => $data['service_name'], 'category' => $data['category'],
                'rate' => (string) $data['rate'], 'description' => $data['description'] ?? '',
                'photos' => $photos, 'photo_public_ids' => $publicIds, 'photo_sequence' => $sequence,
            ])->save();
        } catch (Throwable $exception) {
            $uploads->logFailure($exception, 'service samples');
            $uploads->cleanup($uploaded);

            return back()->withErrors([$failureField => 'We could not save the service or its sample images. Please try again.']);
        }

        return back()->with('success', 'Service saved.');
    }

    public function destroy(Request $request, string $id): RedirectResponse
    {
        Service::where('_id', $id)->where('admin_id', $request->session()->get('admin_id'))->firstOrFail()->delete();

        return back();
    }
}
