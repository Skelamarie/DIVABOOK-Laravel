<?php

use App\Http\Controllers\PartnerController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\BookingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Customer/HomePage');
})->name('home');

Route::get('/services', [ServiceController::class, 'index'])->name('services.index');
Route::get('/booking/create', [BookingController::class, 'create'])->name('bookings.create');
Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store');
Route::get('/booking/success/{booking}', [BookingController::class, 'showSuccess'])->name('bookings.success');

// Authentication & Starter Routes
if (file_exists(__DIR__.'/settings.php')) {
    require __DIR__.'/settings.php';
}
if (file_exists(__DIR__.'/auth.php')) {
    require __DIR__.'/auth.php';
}