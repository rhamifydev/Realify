<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PropertyMedia extends Model
{
    protected $fillable = [
        'property_id', 'path', 'type', 'status', 'is_primary'
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
