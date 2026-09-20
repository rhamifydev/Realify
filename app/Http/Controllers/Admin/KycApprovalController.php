<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KycProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KycApprovalController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status', 'pending');

        $query = KycProfile::with('user')->latest();

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $profiles = $query->paginate(15)->withQueryString();

        $counts = [
            'all' => KycProfile::count(),
            'pending' => KycProfile::where('status', 'pending')->count(),
            'verified' => KycProfile::where('status', 'verified')->count(),
            'rejected' => KycProfile::where('status', 'rejected')->count(),
        ];

        return Inertia::render('admin/kyc', [
            'profiles' => $profiles,
            'currentStatus' => $status,
            'counts' => $counts,
        ]);
    }

    public function verify(KycProfile $profile)
    {
        $profile->update([
            'status' => 'verified',
        ]);

        $userName = $profile->user ? $profile->user->name : 'User';
        return redirect()->back()->with('success', "KYC profile for {$userName} approved and marked verified.");
    }

    public function reject(Request $request, KycProfile $profile)
    {
        $profile->update([
            'status' => 'rejected',
        ]);

        $userName = $profile->user ? $profile->user->name : 'User';
        return redirect()->back()->with('warning', "KYC profile for {$userName} rejected.");
    }
}
