<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Transaction;

class DisputeController extends Controller
{
    public function index()
    {
        $disputes = Transaction::with(['propertyUnit.property', 'tenant'])
            ->where('status', 'disputed')
            ->latest()
            ->get();

        return Inertia::render('admin/disputes', [
            'disputes' => $disputes
        ]);
    }

    public function resolve(Request $request, Transaction $transaction)
    {
        $validated = $request->validate([
            'resolution' => 'required|in:released,refunded'
        ]);

        if ($transaction->status !== 'disputed') {
            abort(400, 'Transaction is not currently disputed.');
        }

        $transaction->update(['status' => $validated['resolution']]);

        // Real app: we would process the refund via Paystack or transfer to the agent.

        return redirect()->back()->with('success', 'Dispute resolved successfully.');
    }
}
