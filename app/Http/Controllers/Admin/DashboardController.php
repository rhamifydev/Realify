<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KycProfile;
use App\Models\Property;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $escrowMetrics = [
            'totalVolume' => (float) Transaction::sum('amount'),
            'heldAmount' => (float) Transaction::where('status', 'held')->sum('amount'),
            'releasedAmount' => (float) Transaction::where('status', 'released')->sum('amount'),
            'disputedAmount' => (float) Transaction::where('status', 'disputed')->sum('amount'),
            'refundedAmount' => (float) Transaction::where('status', 'refunded')->sum('amount'),
        ];

        $propertyMetrics = [
            'total' => Property::count(),
            'published' => Property::where('status', 'published')->count(),
            'pendingReview' => Property::where('status', 'pending_review')->count(),
            'draft' => Property::where('status', 'draft')->count(),
        ];

        $userMetrics = [
            'total' => User::count(),
            'tenants' => User::where('role', 'tenant')->count(),
            'owners' => User::where('role', 'owner')->count(),
            'agents' => User::where('role', 'agent')->count(),
            'admins' => User::where('role', 'admin')->count(),
        ];

        $disputeMetrics = [
            'active' => Transaction::where('status', 'disputed')->count(),
            'resolved' => Transaction::whereIn('status', ['released', 'refunded'])->count(),
        ];

        $kycMetrics = [
            'pending' => KycProfile::where('status', 'pending')->count(),
            'verified' => KycProfile::where('status', 'verified')->count(),
        ];

        $recentDisputes = Transaction::with(['propertyUnit.property.user', 'tenant'])
            ->where('status', 'disputed')
            ->latest()
            ->take(5)
            ->get();

        $pendingProperties = Property::with('user')
            ->where('status', 'pending_review')
            ->latest()
            ->take(5)
            ->get();

        $recentTransactions = Transaction::with(['propertyUnit.property', 'tenant'])
            ->latest()
            ->take(6)
            ->get();

        return Inertia::render('admin/dashboard', [
            'escrowMetrics' => $escrowMetrics,
            'propertyMetrics' => $propertyMetrics,
            'userMetrics' => $userMetrics,
            'disputeMetrics' => $disputeMetrics,
            'kycMetrics' => $kycMetrics,
            'recentDisputes' => $recentDisputes,
            'pendingProperties' => $pendingProperties,
            'recentTransactions' => $recentTransactions,
        ]);
    }
}
