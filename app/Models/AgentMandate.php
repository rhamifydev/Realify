<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AgentMandate extends Model
{
    protected $fillable = [
        'property_id', 'owner_id', 'agent_id', 'owner_split', 'agent_split', 'status'
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }
}
