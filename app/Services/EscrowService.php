<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\PropertyUnit;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class EscrowService
{
    /**
     * Initialize an escrow transaction for inspection booking or upfront deposit payments.
     */
    public function initializeTransaction(User $tenant, PropertyUnit $unit, string $type = 'inspection_fee', ?float $amount = null)
    {
        if ($amount === null) {
            $amount = match ($type) {
                'inspection_fee' => 5000.00,
                'caution_deposit' => (float) ($unit->caution_deposit ?: 100000.00),
                'rent' => (float) ($unit->rent_price ?: 500000.00),
                default => 5000.00,
            };
        }

        $paymentResult = $this->initiatePayment($unit, $tenant, $type, $amount);

        // Fetch transaction record created during initiation
        $transaction = Transaction::where('tenant_id', $tenant->id)
            ->where('property_unit_id', $unit->id)
            ->latest()
            ->first();

        $paymentUrl = $paymentResult['data']['authorization_url'] 
            ?? ($paymentResult['authorization_url'] ?? route('escrow.index'));

        if ($transaction) {
            $transaction->payment_url = $paymentUrl;
            return $transaction;
        }

        return (object) [
            'payment_url' => $paymentUrl,
            'status' => 'pending_payment',
        ];
    }

    /**
     * Initiate a payment into Escrow (e.g., inspection fee) via Paystack.
     */
    public function initiatePayment(PropertyUnit $unit, User $tenant, string $type, float $amount)
    {
        // 1. Create Transaction in 'pending_payment' state
        $reference = 'PAY-' . uniqid() . '-' . time();
        
        $transaction = Transaction::create([
            'property_unit_id' => $unit->id,
            'tenant_id' => $tenant->id,
            'amount' => $amount,
            'type' => $type,
            'status' => 'pending_payment',
            'payment_reference' => $reference,
        ]);

        // 2. Initialize Paystack Transaction
        $url = config('services.paystack.payment_url') . '/transaction/initialize';
        $secretKey = config('services.paystack.secret_key');

        if (!$secretKey) {
            // For MVP bypass if no key is set, auto-mark as held
            $transaction->update(['status' => 'held']);
            return ['status' => true, 'data' => ['authorization_url' => route('escrow.index')]];
        }

        $response = Http::withToken($secretKey)->post($url, [
            'amount' => $amount * 100, // Paystack uses kobo
            'email' => $tenant->email,
            'reference' => $reference,
            'callback_url' => route('escrow.index'),
            'metadata' => [
                'transaction_id' => $transaction->id,
                'type' => $type
            ]
        ]);

        if ($response->successful()) {
            return $response->json();
        }

        Log::error('Paystack initialization failed', ['response' => $response->body()]);
        return ['status' => false, 'message' => 'Payment gateway error'];
    }

    /**
     * Confirm an inspection or title verification and mark funds for release.
     */
    public function confirmInspection(Transaction $transaction): bool
    {
        // Allow both inspection_fee and title_verification_fee to be confirmed easily
        if ($transaction->status !== 'held' || !in_array($transaction->type, ['inspection_fee', 'title_verification_fee', 'offer_deposit'])) {
            return false;
        }

        if ($transaction->type === 'offer_deposit') {
            // For offer deposits, we move to pending_transfer which means funds are held 
            // while the legal documents are drafted.
            $transaction->update(['status' => 'pending_transfer']);
            return true;
        }

        $transaction->update(['status' => 'pending_release']);
        return true;
    }

    /**
     * Release funds from escrow to the appropriate parties based on mandates.
     */
    public function releaseFunds(Transaction $transaction): bool
    {
        if ($transaction->status !== 'pending_release' && $transaction->status !== 'disputed') {
            return false;
        }

        // Real app: calculate splits based on AgentMandate and transfer out via API.
        
        $transaction->update(['status' => 'released']);
        return true;
    }
}
