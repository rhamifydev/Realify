<?php

use Illuminate\Support\Facades\Route;

Route::get('/', [\App\Http\Controllers\WelcomeController::class, 'index'])->name('home');
Route::get('/cities', [\App\Http\Controllers\CitiesController::class, 'index'])->name('cities.index');
Route::get('/types', [\App\Http\Controllers\PropertyTypeController::class, 'index'])->name('types.index');
Route::get('/types/{type}', [\App\Http\Controllers\PropertyTypeController::class, 'show'])->name('types.show');

Route::get('/browse', [\App\Http\Controllers\BrowseController::class, 'index'])->name('browse.index');
Route::get('/browse/{property}', [\App\Http\Controllers\BrowseController::class, 'show'])->name('browse.show');
Route::post('/browse/{property}/book', [\App\Http\Controllers\BrowseController::class, 'book'])
    ->middleware(['auth', 'verified'])
    ->name('browse.book');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'tenant/dashboard')->name('dashboard');

    // Tenant Dashboard Routes
    Route::prefix('tenant')->name('tenant.')->group(function () {
        Route::inertia('dashboard', 'tenant/dashboard')->name('dashboard');
        Route::inertia('applications', 'tenant/applications/index')->name('applications');
        Route::inertia('inspections', 'tenant/inspections/index')->name('inspections');
        Route::inertia('saved', 'tenant/saved/index')->name('saved');
        Route::inertia('payments', 'tenant/payments/index')->name('payments');
        Route::inertia('disputes', 'tenant/disputes/index')->name('disputes');
    });
    Route::get('/kyc', [\App\Http\Controllers\KycController::class, 'index'])->name('kyc.index');
    Route::post('/kyc', [\App\Http\Controllers\KycController::class, 'update'])->name('kyc.update');

    Route::resource('properties', \App\Http\Controllers\PropertyController::class);
    Route::post('properties/{property}/media', [\App\Http\Controllers\PropertyMediaController::class, 'store'])->name('properties.media.store');
    Route::delete('properties/{property}/media/{media}', [\App\Http\Controllers\PropertyMediaController::class, 'destroy'])->name('properties.media.destroy');

    Route::resource('mandates', \App\Http\Controllers\MandateController::class)->only(['index', 'store', 'update']);
    Route::get('/escrow', [\App\Http\Controllers\EscrowController::class, 'index'])->name('escrow.index');
    Route::post('/escrow/{transaction}/confirm', [\App\Http\Controllers\EscrowController::class, 'confirm'])->name('escrow.confirm');
});

Route::middleware(['auth', 'verified', \App\Http\Middleware\EnsureHasRole::class . ':admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/disputes', [\App\Http\Controllers\Admin\DisputeController::class, 'index'])->name('disputes.index');
    Route::post('/disputes/{transaction}/resolve', [\App\Http\Controllers\Admin\DisputeController::class, 'resolve'])->name('disputes.resolve');
});

Route::post('/webhooks/paystack', [\App\Http\Controllers\WebhookController::class, 'paystack']);

require __DIR__.'/settings.php';
