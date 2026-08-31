<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PropertyUnit extends Model
{
    protected $fillable = [
        'property_id', 'title', 'bedrooms', 'bathrooms', 
        'rent_price', 'sale_price', 'caution_deposit', 'agency_fee', 
        'status', 'status_updated_at', 'updated_by'
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
