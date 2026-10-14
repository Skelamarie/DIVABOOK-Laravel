<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePartnerSession
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->session()->has('admin_id')) {
            return ($request->expectsJson() || $request->is('admin/api/*'))
                ? response()->json(['success' => false, 'error' => 'Unauthorized'], 401)
                : redirect()->route('login');
        }

        return $next($request);
    }
}
