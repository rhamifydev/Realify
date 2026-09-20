<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Services\EscrowService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BrowseController extends Controller
{
    /**
     * Display a listing of published properties.
     * Supports geolocation-based sorting when lat/lng are provided.
     */
    public function index(Request $request)
    {
        $query = Property::with(['units', 'media'])->where('status', 'published');

        // Location text search
        if ($request->filled('location')) {
            $query->where(function ($q) use ($request) {
                $q->where('city', 'like', '%' . $request->location . '%')
                  ->orWhere('state', 'like', '%' . $request->location . '%')
                  ->orWhere('address', 'like', '%' . $request->location . '%');
            });
        }

        // Property type filter (rent, sale, sale_or_rent)
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Category filter (residential, commercial)
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // Advanced Search: Bedrooms
        if ($request->filled('bedrooms')) {
            $query->whereHas('units', function ($q) use ($request) {
                if (str_ends_with($request->bedrooms, '+')) {
                    $q->where('bedrooms', '>=', (int) str_replace('+', '', $request->bedrooms));
                } else {
                    $q->where('bedrooms', (int) $request->bedrooms);
                }
            });
        }

        // Advanced Search: Bathrooms
        if ($request->filled('bathrooms')) {
            $query->whereHas('units', function ($q) use ($request) {
                if (str_ends_with($request->bathrooms, '+')) {
                    $q->where('bathrooms', '>=', (int) str_replace('+', '', $request->bathrooms));
                } else {
                    $q->where('bathrooms', (int) $request->bathrooms);
                }
            });
        }

        // Advanced Search: Max Price
        if ($request->filled('max_price')) {
            $query->whereHas('units', function ($q) use ($request) {
                $q->where('rent_price', '<=', (float) $request->max_price)
                  ->orWhere('sale_price', '<=', (float) $request->max_price);
            });
        }

        // Geolocation-based sorting using Haversine formula
        $userLocation = null;
        if ($request->filled('lat') && $request->filled('lng')) {
            $lat = (float) $request->lat;
            $lng = (float) $request->lng;

            // Validate coordinates are within Nigeria's approximate bounding box
            if ($lat >= 4.0 && $lat <= 14.0 && $lng >= 2.5 && $lng <= 15.0) {
                $query->nearby($lat, $lng);
                $userLocation = ['lat' => $lat, 'lng' => $lng];
            } else {
                $query->latest();
            }
        } else {
            $query->latest();
        }

        $properties = $query->paginate(12)->withQueryString();

        return Inertia::render('browse/index', [
            'properties' => $properties,
            'filters' => $request->only(['location', 'type', 'category', 'bedrooms', 'bathrooms', 'max_price']),
            'userLocation' => $userLocation,
        ]);
    }

    /**
     * Display the specified property.
     */
    public function show(Property $property)
    {
        if ($property->status !== 'published') {
            abort(404);
        }

        $property->load(['units', 'media', 'user']);

        return Inertia::render('browse/show', [
            'property' => $property
        ]);
    }

    /**
     * Book an inspection (initiates escrow transaction for the inspection fee).
     */
    public function book(Property $property, Request $request, EscrowService $escrowService)
    {
        if ($property->status !== 'published') {
            abort(404);
        }

        $unitId = $request->input('unit_id');
        $unit = $unitId ? $property->units()->find($unitId) : null;
        if (!$unit) {
            $unit = $property->units()->first();
        }

        if (!$unit) {
            return back()->withErrors(['message' => 'This property has no units available for inspection.']);
        }

        // Using the EscrowService to create an inspection transaction (refundable ₦5,000 fee)
        $transaction = $escrowService->initializeTransaction(
            tenant: $request->user(),
            unit: $unit,
            type: 'inspection_fee',
            amount: 5000.00
        );

        $paymentUrl = $transaction->payment_url ?? route('escrow.index');

        // If local or relative URL (or Paystack key not set in dev), redirect with success message to Escrow hub
        if (!filter_var($paymentUrl, FILTER_VALIDATE_URL) || str_starts_with($paymentUrl, url('/')) || str_contains($paymentUrl, 'localhost') || str_contains($paymentUrl, '127.0.0.1')) {
            return redirect($paymentUrl)->with('success', "Inspection booking initiated for {$property->title}! ₦5,000 deposit held in Escrow.");
        }

        return Inertia::location($paymentUrl);
    }
}

