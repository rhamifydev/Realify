<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionLedgerController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status', 'all');
        $type = $request->query('type', 'all');
        $search = $request->query('search', '');

        $query = Transaction::with(['propertyUnit.property.user', 'tenant'])->latest();

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        if ($type !== 'all') {
            $query->where('type', $type);
        }

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('payment_reference', 'like', "%{$search}%")
                  ->orWhereHas('tenant', function ($tq) use ($search) {
                      $tq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  })
                  ->orWhereHas('propertyUnit.property', function ($pq) use ($search) {
                      $pq->where('title', 'like', "%{$search}%");
                  });
            });
        }

        $transactions = $query->paginate(15)->withQueryString();

        $summary = [
            'totalVolume' => (float) Transaction::sum('amount'),
            'heldAmount' => (float) Transaction::where('status', 'held')->sum('amount'),
            'releasedAmount' => (float) Transaction::where('status', 'released')->sum('amount'),
            'disputedAmount' => (float) Transaction::where('status', 'disputed')->sum('amount'),
            'refundedAmount' => (float) Transaction::where('status', 'refunded')->sum('amount'),
            'count' => Transaction::count(),
        ];

        return Inertia::render('admin/transactions', [
            'transactions' => $transactions,
            'summary' => $summary,
            'filters' => [
                'status' => $status,
                'type' => $type,
                'search' => $search,
            ],
        ]);
    }
}
