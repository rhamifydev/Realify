<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\KycService;

class KycController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('kyc/index', [
            'kycProfile' => $request->user()->kycProfile,
        ]);
    }

    public function update(Request $request, KycService $kycService)
    {
        $validated = $request->validate([
            'nin' => ['nullable', 'string'],
            'bvn' => ['nullable', 'string'],
            'id_type' => ['nullable', 'string'],
            'id_document' => ['nullable', 'file', 'max:2048'],
        ]);

        $profile = $request->user()->kycProfile;

        if ($request->has('nin') && $request->filled('nin')) {
            $ninResult = $kycService->verifyNin($request->nin);
            if ($ninResult['status'] === 'success') {
                $profile->nin = $request->nin;
            }
        }

        if ($request->has('bvn') && $request->filled('bvn')) {
            $bvnResult = $kycService->verifyBvn($request->bvn);
            if ($bvnResult['status'] === 'success') {
                $profile->bvn = $request->bvn;
            }
        }

        if ($request->hasFile('id_document')) {
            $path = $request->file('id_document')->store('kyc_documents');
            $profile->id_document_path = $path;
            $profile->id_type = $request->id_type;
        }

        if ($profile->nin || $profile->bvn || $profile->id_document_path) {
            $profile->status = 'pending';
        }

        $profile->save();

        return redirect()->back()->with('success', 'KYC details updated successfully.');
    }
}
