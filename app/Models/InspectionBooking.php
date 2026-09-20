<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class InspectionBooking extends Model
{
    protected $fillable = [
        'property_id',
        'property_unit_id',
        'tenant_id',
        'agent_id',
        'transaction_id',
        'inspection_date',
        'start_time',
        'end_time',
        'interval_minutes',
        'fee_amount',
        'status',
        'tenant_notes',
        'agent_notes',
        'rescheduled_at',
    ];

    protected $casts = [
        'inspection_date' => 'date',
        'interval_minutes' => 'integer',
        'fee_amount' => 'decimal:2',
        'rescheduled_at' => 'datetime',
    ];

    protected $appends = [
        'start_time_12h',
        'end_time_12h',
        'time_slot_label',
        'formatted_date',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function propertyUnit()
    {
        return $this->belongsTo(PropertyUnit::class);
    }

    public function tenant()
    {
        return $this->belongsTo(User::class, 'tenant_id');
    }

    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    public function getStartTime12hAttribute(): string
    {
        return !empty($this->start_time) ? Carbon::parse($this->start_time)->format('g:i A') : '';
    }

    public function getEndTime12hAttribute(): string
    {
        return !empty($this->end_time) ? Carbon::parse($this->end_time)->format('g:i A') : '';
    }

    public function getTimeSlotLabelAttribute(): string
    {
        if (empty($this->start_time) || empty($this->end_time)) {
            return '';
        }
        $interval = $this->interval_minutes ? " ({$this->interval_minutes}m)" : '';
        return $this->start_time_12h . ' – ' . $this->end_time_12h . $interval;
    }

    public function getFormattedDateAttribute(): string
    {
        return !empty($this->inspection_date) ? Carbon::parse($this->inspection_date)->format('D, M j, Y') : '';
    }
}
