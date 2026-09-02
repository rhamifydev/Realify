<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CitiesController extends Controller
{
    public function index()
    {
        $cityImages = [
            'Lagos' => '/images/lagos.jpg',
            'Abuja' => '/images/abuja.jpg',
            'Port Harcourt' => '/images/port-harcourt.jpg',
            'Ibadan' => 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=900&auto=format&fit=crop',
            'Benin City' => 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=900&auto=format&fit=crop',
            'Kano' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=900&auto=format&fit=crop',
            'Enugu' => 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=900&auto=format&fit=crop',
            'Calabar' => 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop',
        ];

        $cities = Property::query()
            ->where('status', 'published')
            ->select('city', DB::raw('COUNT(*) as property_count'))
            ->whereNotNull('city')
            ->groupBy('city')
            ->orderBy('city')
            ->get()
            ->map(fn ($city) => [
                'city' => $city->city,
                'count' => (int) $city->property_count,
                'img' => $cityImages[$city->city] ?? 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=900&auto=format&fit=crop',
            ])
            ->values();

        return Inertia::render('cities/index', [
            'cities' => $cities,
        ]);
    }
}
