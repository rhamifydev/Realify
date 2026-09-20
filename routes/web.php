<?php

use Illuminate\Support\Facades\Route;

Route::get('/', [\App\Http\Controllers\WelcomeController::class, 'index'])->name('home');
Route::get('/cities', [\App\Http\Controllers\CitiesController::class, 'index'])->name('cities.index');
Route::get('/types', [\App\Http\Controllers\PropertyTypeController::class, 'index'])->name('types.index');
Route::get('/types/{type}', [\App\Http\Controllers\PropertyTypeController::class, 'show'])->name('types.show');

Route::get('/browse', [\App\Http\Controllers\BrowseController::class, 'index'])->name('browse.index');
Route::get('/browse/{property}', [\App\Http\Controllers\BrowseController::class, 'show'])->name('browse.show');
Route::get('/browse/{property}/availability', [\App\Http\Controllers\InspectionController::class, 'getAvailableSlots'])->name('browse.availability');
Route::post('/browse/{property}/book', [\App\Http\Controllers\BrowseController::class, 'book'])
    ->middleware(['auth', 'verified'])
    ->name('browse.book');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\TenantDashboardController::class, 'index'])->name('dashboard');

    // Tenant Dashboard Routes
    Route::prefix('tenant')->name('tenant.')->group(function () {
        Route::get('dashboard', [\App\Http\Controllers\TenantDashboardController::class, 'index'])->name('dashboard');
        Route::inertia('applications', 'tenant/applications/index')->name('applications');
        Route::get('inspections', [\App\Http\Controllers\InspectionController::class, 'index'])->name('inspections');
        Route::inertia('saved', 'tenant/saved/index')->name('saved');
        Route::inertia('payments', 'tenant/payments/index')->name('payments');
        Route::inertia('disputes', 'tenant/disputes/index')->name('disputes');
    });
    Route::get('/kyc', [\App\Http\Controllers\KycController::class, 'index'])->name('kyc.index');
    Route::post('/kyc', [\App\Http\Controllers\KycController::class, 'update'])->name('kyc.update');

    Route::resource('properties', \App\Http\Controllers\PropertyController::class);
    Route::post('properties/{property}/media', [\App\Http\Controllers\PropertyMediaController::class, 'store'])->name('properties.media.store');
    Route::delete('properties/{property}/media/{media}', [\App\Http\Controllers\PropertyMediaController::class, 'destroy'])->name('properties.media.destroy');
    
    // Property Inspection Availability & Bookings
    Route::get('properties/{property}/availability', [\App\Http\Controllers\InspectionController::class, 'getAvailableSlots'])->name('properties.availability');
    Route::post('properties/{property}/availability', [\App\Http\Controllers\InspectionController::class, 'storeAvailability'])->name('properties.availability.store');
    Route::post('properties/{property}/book-inspection', [\App\Http\Controllers\InspectionController::class, 'book'])->name('properties.book-inspection');
    Route::post('inspections/{booking}/accept', [\App\Http\Controllers\InspectionController::class, 'accept'])->name('inspections.accept');
    Route::post('inspections/{booking}/reschedule', [\App\Http\Controllers\InspectionController::class, 'reschedule'])->name('inspections.reschedule');
    Route::post('notifications/{id}/read', [\App\Http\Controllers\InspectionController::class, 'markNotificationRead'])->name('notifications.read');

    Route::resource('mandates', \App\Http\Controllers\MandateController::class)->only(['index', 'store', 'update']);
    Route::get('/escrow', [\App\Http\Controllers\EscrowController::class, 'index'])->name('escrow.index');
    Route::post('/escrow/{transaction}/confirm', [\App\Http\Controllers\EscrowController::class, 'confirm'])->name('escrow.confirm');
});

Route::middleware(['auth', 'verified', \App\Http\Middleware\EnsureHasRole::class . ':admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index']);

    // Disputes
    Route::get('/disputes', [\App\Http\Controllers\Admin\DisputeController::class, 'index'])->name('disputes.index');
    Route::match(['post', 'put'], '/disputes/{transaction}/resolve', [\App\Http\Controllers\Admin\DisputeController::class, 'resolve'])->name('disputes.resolve');

    // Properties Approvals
    Route::get('/properties', [\App\Http\Controllers\Admin\PropertyApprovalController::class, 'index'])->name('properties.index');
    Route::get('/properties/{property}', [\App\Http\Controllers\Admin\PropertyApprovalController::class, 'show'])->name('properties.show');
    Route::post('/properties/{property}/approve', [\App\Http\Controllers\Admin\PropertyApprovalController::class, 'approve'])->name('properties.approve');
    Route::post('/properties/{property}/reject', [\App\Http\Controllers\Admin\PropertyApprovalController::class, 'reject'])->name('properties.reject');

    // KYC Verification
    Route::get('/kyc', [\App\Http\Controllers\Admin\KycApprovalController::class, 'index'])->name('kyc.index');
    Route::post('/kyc/{profile}/verify', [\App\Http\Controllers\Admin\KycApprovalController::class, 'verify'])->name('kyc.verify');
    Route::post('/kyc/{profile}/reject', [\App\Http\Controllers\Admin\KycApprovalController::class, 'reject'])->name('kyc.reject');

    // Transaction Ledger
    Route::get('/transactions', [\App\Http\Controllers\Admin\TransactionLedgerController::class, 'index'])->name('transactions.index');

    // User Management
    Route::get('/users', [\App\Http\Controllers\Admin\UserManagementController::class, 'index'])->name('users.index');
    Route::post('/users/{user}/role', [\App\Http\Controllers\Admin\UserManagementController::class, 'updateRole'])->name('users.updateRole');
});

Route::post('/webhooks/paystack', [\App\Http\Controllers\WebhookController::class, 'paystack']);

require __DIR__.'/settings.php';
