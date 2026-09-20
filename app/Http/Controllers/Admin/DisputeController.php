<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DisputeController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status', 'disputed');

        $query = Transaction::with(['propertyUnit.property.user', 'tenant'])->latest();

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $disputes = $query->paginate(15)->withQueryString();

        $counts = [
            'disputed' => Transaction::where('status', 'disputed')->count(),
            'released' => Transaction::where('status', 'released')->count(),
            'refunded' => Transaction::where('status', 'refunded')->count(),
            'all' => Transaction::whereIn('status', ['disputed', 'released', 'refunded'])->count(),
        ];

        return Inertia::render('admin/disputes', [
            'disputes' => $disputes,
            'currentStatus' => $status,
            'counts' => $counts,
        ]);
    }

    public function resolve(Request $request, Transaction $transaction)
    {
        $validated = $request->validate([
            'resolution' => 'required|in:released,refunded',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($transaction->status !== 'disputed') {
            return redirect()->back()->withErrors([
                'msg' => 'Transaction is not currently in disputed status.',
            ]);
        }

        $transaction->update([
            'status' => $validated['resolution'],
        ]);

        $message = $validated['resolution'] === 'released'
            ? 'Dispute resolved: ₦' . number_format($transaction->amount, 2) . ' released to property owner.'
            : 'Dispute resolved: ₦' . number_format($transaction->amount, 2) . ' refunded back to tenant.';

        return redirect()->back()->with('success', $message);
    }
}
