<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use App\Models\Inquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Throwable;

class ContactController extends Controller
{
    public function store(StoreContactRequest $request): RedirectResponse
    {
        try {
            Inquiry::create($request->validated());
        } catch (Throwable $exception) {
            Log::error('Could not save contact inquiry.', ['exception' => get_class($exception)]);

            return back()->withErrors(['message' => 'We could not save your inquiry. Please try again.']);
        }

        return to_route('contact')->with('success', 'Your inquiry has been received.');
    }
}
