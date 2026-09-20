<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class PropertyAvailability extends Model
{
    protected $fillable = [
        'property_id',
        'day_of_week',
        'specific_date',
        'start_time',
        'end_time',
        'interval_minutes',
        'fee_amount',
        'is_active',
    ];

    protected $casts = [
        'interval_minutes' => 'integer',
        'fee_amount' => 'decimal:2',
        'is_active' => 'boolean',
        'specific_date' => 'date',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Generate discrete time slots in 12-hour format for a given date.
     * e.g. 09:00 AM - 09:45 AM with duration 45 mins.
     *
     * @param Carbon $date
     * @param array $bookedTimes Array of booked start times ['09:00:00', ...]
     * @return array
     */
    public function generateSlots(Carbon $date, array $bookedTimes = []): array
    {
        $slots = [];
        $startTime = Carbon::parse($date->format('Y-m-d') . ' ' . $this->start_time);
        $endTime = Carbon::parse($date->format('Y-m-d') . ' ' . $this->end_time);
        $interval = $this->interval_minutes ?: 30;

        while ($startTime->copy()->addMinutes($interval)->lte($endTime)) {
            $slotEnd = $startTime->copy()->addMinutes($interval);
            $startFormatted = $startTime->format('H:i:s');
            $isBooked = in_array($startFormatted, $bookedTimes);

            $slots[] = [
                'availability_id' => $this->id,
                'start_time' => $startTime->format('H:i:s'),
                'end_time' => $slotEnd->format('H:i:s'),
                // 12-hour AM/PM formats as requested by the user
                'start_time_12h' => $startTime->format('g:i A'),
                'end_time_12h' => $slotEnd->format('g:i A'),
                'label' => $startTime->format('g:i A') . ' – ' . $slotEnd->format('g:i A'),
                'interval_minutes' => $interval,
                'fee_amount' => (float) $this->fee_amount,
                'is_booked' => $isBooked,
                'is_available' => !$isBooked,
            ];

            $startTime->addMinutes($interval);
        }

        return $slots;
    }
}
