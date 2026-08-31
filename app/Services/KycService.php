<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use App\Models\Setting;

class KycService
{
    /**
     * Verify a NIN.
     * 
     * @param string $nin
     * @return array
     */
    public function verifyNin(string $nin): array
    {
        // TODO: The user requested to bypass real API for now.
        // We will mock a successful response.
        
        /* 
        $apiKey = Setting::where('key', 'nin_api_key')->value('value');
        $response = Http::withToken($apiKey)->post('https://api.example.com/verify/nin', [
            'nin' => $nin
        ]);
        
        return $response->json();
        */

        return [
            'status' => 'success',
            'data' => [
                'nin' => $nin,
                'verified' => true
            ]
        ];
    }

    /**
     * Verify a BVN.
     * 
     * @param string $bvn
     * @return array
     */
    public function verifyBvn(string $bvn): array
    {
        // TODO: The user requested to bypass real API for now.
        // We will mock a successful response.
        
        /* 
        $apiKey = Setting::where('key', 'bvn_api_key')->value('value');
        $response = Http::withToken($apiKey)->post('https://api.example.com/verify/bvn', [
            'bvn' => $bvn
        ]);
        
        return $response->json();
        */

        return [
            'status' => 'success',
            'data' => [
                'bvn' => $bvn,
                'verified' => true
            ]
        ];
    }
}
