<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    protected $fillable = [
        'user_id', 'title', 'description', 'address', 'state',
        'city', 'latitude', 'longitude', 'type', 'category',
        'structure_type', 'status', 'current_stage',
        'title_type', 'land_size', 'ownership_document_path'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function units()
    {
        return $this->hasMany(PropertyUnit::class);
    }

    public function media()
    {
        return $this->hasMany(PropertyMedia::class);
    }

    public function availabilities()
    {
        return $this->hasMany(PropertyAvailability::class);
    }

    public function inspectionBookings()
    {
        return $this->hasMany(InspectionBooking::class);
    }

    /**
     * Scope to order properties by distance from a given coordinate.
     * Uses the Haversine formula to compute distance in kilometers.
     */
    public function scopeNearby(Builder $query, float $lat, float $lng): Builder
    {
        return $query
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->selectRaw('*, (
                6371 * acos(
                    cos(radians(?)) *
                    cos(radians(latitude)) *
                    cos(radians(longitude) - radians(?)) +
                    sin(radians(?)) *
                    sin(radians(latitude))
                )
            ) AS distance', [$lat, $lng, $lat])
            ->orderBy('distance');
    }
}
