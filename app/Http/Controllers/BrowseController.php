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
            'filters' => $request->only(['location', 'type', 'category']),
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

        // We assume we are booking the first unit for simplicity in MVP, 
        // or a specific unit if passed in the request.
        $unit = $property->units()->first();
        if (!$unit) {
            return back()->withErrors(['message' => 'This property has no units available.']);
        }

        // Using the EscrowService to create an inspection transaction
        $transaction = $escrowService->initializeTransaction(
            tenant: $request->user(),
            unit: $unit,
            type: 'rent' // Assuming 'rent' type for inspection flow as per earlier Phase 4
        );

        return Inertia::location($transaction->payment_url);
    }
}

