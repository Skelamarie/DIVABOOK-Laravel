<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Partner;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

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
}