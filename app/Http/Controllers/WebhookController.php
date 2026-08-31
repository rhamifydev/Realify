<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    public function paystack(Request $request)
    {
        // Only allow POST requests
        if (!$request->isMethod('post')) {
            abort(405);
        }

        // Validate signature
        $secretKey = config('services.paystack.secret_key');
        if ($secretKey) {
            $signature = $request->header('x-paystack-signature');
            $payload = $request->getContent();
            
            if ($signature !== hash_hmac('sha512', $payload, $secretKey)) {
                Log::warning('Invalid Paystack Webhook Signature');
                abort(401, 'Invalid signature');
            }
        }

        $event = $request->input('event');
        $data = $request->input('data');

        if ($event === 'charge.success') {
            $reference = $data['reference'];
            
            $transaction = Transaction::where('payment_reference', $reference)->first();
            
            if ($transaction && $transaction->status === 'pending_payment') {
                $transaction->update(['status' => 'held']);
                Log::info("Transaction {$reference} updated to held.");
            }
        }

        return response()->json(['status' => 'success']);
    }
}
