<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class WelcomeController extends Controller
{
    public function index()
    {
        // Get the latest 4 published properties for the "Featured Listings" section
        $featuredListings = Property::with(['units', 'media'])
            ->where('status', 'published')
            ->latest()
            ->take(4)
            ->get()
            ->map(function ($property) {
                // Map the data to the format expected by the frontend
                $firstUnit = $property->units->first();
                $firstImage = $property->media->first();

                // Format the price
                $price = $firstUnit ? $firstUnit->rent_price : 0;
                $formattedPrice = '₦' . number_format($price);
                $period = '/year'; // Assuming yearly rent for now

                if ($property->type === 'sale') {
                    $price = $firstUnit ? $firstUnit->sale_price : 0;
                    $formattedPrice = '₦' . number_format($price);
                    $period = ' outright';
                }

                // Format the units text
                $unitsText = 'SINGLE UNIT';
                if ($property->units->count() > 1) {
                    $unitsText = $property->units->count() . ' UNITS';
                }

                return [
                    'id' => $property->id,
                    'title' => $property->title,
                    'location' => $property->city . ', ' . $property->state,
                    'price' => $formattedPrice,
                    'period' => $period,
                    'units' => $unitsText,
                    'img' => $firstImage ? $firstImage->path : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop', // Fallback image
                    'baths' => $firstUnit ? $firstUnit->bathrooms : 0,
                    'beds' => $firstUnit ? $firstUnit->bedrooms : 0,
                    'category' => $property->category,
                ];
            });

        // Get top places (cities with most properties)
        $topPlacesData = Property::where('status', 'published')
            ->select('city', DB::raw('count(*) as count'))
            ->groupBy('city')
            ->orderByDesc('count')
            ->take(3)
            ->get();

        // Map them, optionally adding default images for known cities
        $cityImages = [
            'Lagos' => 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=1200&auto=format&fit=crop',
            'Abuja' => 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=800&auto=format&fit=crop',
            'Port Harcourt' => 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=800&auto=format&fit=crop',
        ];

        $topPlaces = $topPlacesData->map(function ($place) use ($cityImages) {
            $image = $cityImages[$place->city] ?? 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=800&auto=format&fit=crop';
            return [
                'city' => $place->city,
                'count' => $place->count,
                'img' => $image
            ];
        });

        return Inertia::render('welcome', [
            'featuredListings' => $featuredListings,
            'topPlaces' => $topPlaces
        ]);
    }
}
