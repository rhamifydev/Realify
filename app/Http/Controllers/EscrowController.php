<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Transaction;
use App\Services\EscrowService;

class EscrowController extends Controller
{
    protected $escrowService;

    public function __construct(EscrowService $escrowService)
    {
        $this->escrowService = $escrowService;
    }

    public function index(Request $request)
    {
        $transactions = Transaction::with(['propertyUnit.property', 'tenant'])
            ->where('tenant_id', $request->user()->id)
            // If they are owner/agent, we would also query properties they own/manage.
            ->latest()
            ->get();

        return Inertia::render('escrow/index', [
            'transactions' => $transactions
        ]);
    }

    public function confirm(Request $request, Transaction $transaction)
    {
        // In a real app, both Tenant and Owner/Agent need to independently confirm.
        // For MVP, we simulate a single confirmation.
        
        $success = $this->escrowService->confirmInspection($transaction);

        if ($success) {
            return redirect()->back()->with('success', 'Inspection confirmed. Funds pending release.');
        }

        return redirect()->back()->withErrors(['msg' => 'Failed to confirm inspection. Invalid transaction state.']);
    }
}
