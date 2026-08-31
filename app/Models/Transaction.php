<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'property_unit_id', 'tenant_id', 'amount', 'type', 'status', 'payment_reference'
    ];

    public function propertyUnit()
    {
        return $this->belongsTo(PropertyUnit::class);
    }

    public function tenant()
    {
        return $this->belongsTo(User::class, 'tenant_id');
    }
}
