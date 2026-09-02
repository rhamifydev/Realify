<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PropertyTypeController extends Controller
{
    private array $typeImages = [
        'residential' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=900&auto=format&fit=crop',
        'commercial' => 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=900&auto=format&fit=crop',
        'industrial' => 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?q=80&w=900&auto=format&fit=crop',
        'apartment' => 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=900&auto=format&fit=crop',
        'building-code' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=900&auto=format&fit=crop',
    ];

    private array $typeNames = [
        'residential' => 'Residential',
        'commercial' => 'Commercial',
        'industrial' => 'Industrial',
        'apartment' => 'Apartment',
        'building-code' => 'Building Code',
    ];

    public function index()
    {
        $types = Property::query()
            ->where('status', 'published')
            ->select('category', DB::raw('COUNT(*) as property_count'))
            ->whereNotNull('category')
            ->groupBy('category')
            ->orderBy('category')
            ->get()
            ->map(fn ($type) => [
                'slug' => $type->category,
                'name' => $this->typeNames[$type->category] ?? ucfirst(str_replace('_', ' ', $type->category)),
                'count' => (int) $type->property_count,
                'img' => $this->typeImages[$type->category] ?? $this->typeImages['residential'],
            ])
            ->values();

        return Inertia::render('types/index', ['types' => $types]);
    }

    public function show(string $type)
    {
        abort_unless(isset($this->typeNames[$type]), 404);

        $properties = Property::query()
            ->with(['units', 'media'])
            ->where('status', 'published')
            ->where('category', $type)
            ->latest()
            ->get()
            ->map(function (Property $property) {
                $unit = $property->units->first();
                $media = $property->media->first();

                return [
                    'id' => $property->id,
                    'title' => $property->title,
                    'location' => trim($property->city . ', ' . $property->state, ', '),
                    'price' => $unit?->rent_price ?? $unit?->sale_price ?? 0,
                    'img' => $media?->path ?? $this->typeImages[$property->category] ?? $this->typeImages['residential'],
                    'beds' => $unit?->bedrooms ?? 0,
                    'baths' => $unit?->bathrooms ?? 0,
                    'type' => $property->type,
                ];
            })
            ->values();

        return Inertia::render('types/show', [
            'type' => [
                'slug' => $type,
                'name' => $this->typeNames[$type],
                'img' => $this->typeImages[$type],
            ],
            'properties' => $properties,
        ]);
    }
}
