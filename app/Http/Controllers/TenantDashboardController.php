<?php

namespace App\Http\Controllers;

use App\Models\InspectionBooking;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TenantDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->hasRole('admin')) {
            return redirect()->route('admin.dashboard');
        }

        // Real upcoming inspections for this tenant
        $upcomingInspections = InspectionBooking::with(['property.media', 'agent'])
            ->where('tenant_id', $user->id)
            ->whereIn('status', ['pending', 'confirmed', 'rescheduled'])
            ->orderBy('inspection_date', 'asc')
            ->orderBy('start_time', 'asc')
            ->take(6)
            ->get();

        $upcomingCount = InspectionBooking::where('tenant_id', $user->id)
            ->whereIn('status', ['pending', 'confirmed', 'rescheduled'])
            ->count();

        // Escrow funds held
        $totalHeldInEscrow = (float) Transaction::where('tenant_id', $user->id)
            ->whereIn('status', ['held', 'pending', 'inspection_paid'])
            ->sum('amount');

        // KYC status
        $kycStatus = $user->kycProfile?->status ?? 'unverified';

        // Unread notifications count
        $unreadCount = $user->unreadNotifications()->count();

        return Inertia::render('tenant/dashboard', [
            'upcomingInspections' => $upcomingInspections,
            'upcomingCount' => $upcomingCount,
            'totalHeldInEscrow' => $totalHeldInEscrow,
            'activeApplicationsCount' => $upcomingCount,
            'kycStatus' => $kycStatus,
            'unreadCount' => $unreadCount,
        ]);
    }
}
