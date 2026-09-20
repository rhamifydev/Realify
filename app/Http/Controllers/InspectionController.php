<?php

namespace App\Http\Controllers;

use App\Models\InspectionBooking;
use App\Models\Property;
use App\Models\PropertyAvailability;
use App\Models\User;
use App\Notifications\InspectionConfirmedNotification;
use App\Notifications\InspectionRescheduledNotification;
use App\Notifications\NewInspectionBookingNotification;
use App\Services\EscrowService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InspectionController extends Controller
{
    /**
     * Display inspections for the authenticated user.
     * Shows tenant visits, agent requests, or platform overview for admins.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $isAgentOrOwner = $user->hasRole('agent') || $user->hasRole('owner') || $user->hasRole('admin') || $user->properties()->exists();

        // 1. Tenant's own bookings
        $tenantBookings = InspectionBooking::with(['property.media', 'propertyUnit', 'agent', 'transaction'])
            ->where('tenant_id', $user->id)
            ->latest()
            ->get();

        // 2. Incoming requests for properties owned or managed by this user
        $agentBookings = [];
        if ($isAgentOrOwner) {
            $query = InspectionBooking::with(['property.media', 'propertyUnit', 'tenant', 'transaction']);
            if (!$user->hasRole('admin')) {
                $query->where('agent_id', $user->id);
            }
            $agentBookings = $query->latest()->get();
        }

        // Global unread notifications for this user
        $unreadNotifications = $user->unreadNotifications()->take(10)->get();

        return Inertia::render('tenant/inspections/index', [
            'tenantBookings' => $tenantBookings,
            'agentBookings' => $agentBookings,
            'isAgentOrOwner' => $isAgentOrOwner,
            'notifications' => $unreadNotifications,
        ]);
    }

    /**
     * Get available inspection slots for a given property and date.
     * Respects the property manager's configured intervals and fee amounts.
     * Formats all times in 12-hour AM/PM.
     */
    public function getAvailableSlots(Property $property, Request $request)
    {
        $dateString = $request->query('date', now()->addDay()->format('Y-m-d'));
        $targetDate = Carbon::parse($dateString);
        $dayOfWeek = strtolower($targetDate->format('l')); // monday, tuesday, etc.

        // Look for custom availability configured by the property manager
        $availabilities = PropertyAvailability::where('property_id', $property->id)
            ->where('is_active', true)
            ->where(function ($q) use ($dayOfWeek, $targetDate) {
                $q->where('day_of_week', $dayOfWeek)
                  ->orWhere('specific_date', $targetDate->format('Y-m-d'));
            })
            ->get();

        // Already booked start times on this date (not cancelled)
        $bookedTimes = InspectionBooking::where('property_id', $property->id)
            ->where('inspection_date', $targetDate->format('Y-m-d'))
            ->whereIn('status', ['pending', 'confirmed', 'rescheduled'])
            ->pluck('start_time')
            ->map(fn($t) => Carbon::parse($t)->format('H:i:s'))
            ->toArray();

        $allSlots = [];

        if ($availabilities->isNotEmpty()) {
            foreach ($availabilities as $availability) {
                $slots = $availability->generateSlots($targetDate, $bookedTimes);
                $allSlots = array_merge($allSlots, $slots);
            }
        } else {
            // Default smart availability if the agent hasn't configured custom hours yet
            // Provides 30m, 45m, and 60m options with different fee tiers (12h format)
            $defaultIntervals = [
                ['interval' => 30, 'fee' => 5000.00, 'label' => 'Standard (30 mins)'],
                ['interval' => 45, 'fee' => 7500.00, 'label' => 'Extended (45 mins)'],
                ['interval' => 60, 'fee' => 10000.00, 'label' => 'Deep Dive (1 Hour)'],
            ];

            // Morning and Afternoon windows
            $windows = [
                ['start' => '10:00:00', 'end' => '13:00:00'],
                ['start' => '14:00:00', 'end' => '17:00:00'],
            ];

            foreach ($windows as $window) {
                foreach ($defaultIntervals as $tier) {
                    $start = Carbon::parse($targetDate->format('Y-m-d') . ' ' . $window['start']);
                    $end = Carbon::parse($targetDate->format('Y-m-d') . ' ' . $window['end']);
                    $interval = $tier['interval'];

                    while ($start->copy()->addMinutes($interval)->lte($end)) {
                        $slotEnd = $start->copy()->addMinutes($interval);
                        $startFmt = $start->format('H:i:s');
                        $isBooked = in_array($startFmt, $bookedTimes);

                        $allSlots[] = [
                            'availability_id' => null,
                            'start_time' => $startFmt,
                            'end_time' => $slotEnd->format('H:i:s'),
                            'start_time_12h' => $start->format('g:i A'),
                            'end_time_12h' => $slotEnd->format('g:i A'),
                            'label' => $start->format('g:i A') . ' – ' . $slotEnd->format('g:i A'),
                            'interval_minutes' => $interval,
                            'fee_amount' => $tier['fee'],
                            'is_booked' => $isBooked,
                            'is_available' => !$isBooked,
                        ];

                        $start->addMinutes($interval);
                    }
                }
            }
        }

        // Sort slots chronologically and by interval
        usort($allSlots, function ($a, $b) {
            return strcmp($a['start_time'], $b['start_time']) ?: ($a['interval_minutes'] <=> $b['interval_minutes']);
        });

        return response()->json([
            'date' => $targetDate->format('Y-m-d'),
            'date_formatted' => $targetDate->format('l, F j, Y'),
            'slots' => $allSlots,
        ]);
    }

    /**
     * Save/update property availability schedule.
     * Supports different intervals (30m, 45m, 1hr) and customizable fees per interval.
     */
    public function storeAvailability(Property $property, Request $request)
    {
        $user = $request->user();
        if ($property->user_id !== $user->id && !$user->hasRole('admin')) {
            abort(403);
        }

        $validated = $request->validate([
            'schedules' => 'required|array|min:1',
            'schedules.*.day_of_week' => 'nullable|string|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
            'schedules.*.specific_date' => 'nullable|date',
            'schedules.*.start_time' => 'required|string',
            'schedules.*.end_time' => 'required|string',
            'schedules.*.interval_minutes' => 'required|integer|in:30,45,60',
            'schedules.*.fee_amount' => 'required|numeric|min:0',
            'schedules.*.is_active' => 'boolean',
        ]);

        // Replace existing weekly configurations
        PropertyAvailability::where('property_id', $property->id)->delete();

        foreach ($validated['schedules'] as $item) {
            // Convert any 12-hour formatted time string to H:i:s
            $startTime = Carbon::parse($item['start_time'])->format('H:i:s');
            $endTime = Carbon::parse($item['end_time'])->format('H:i:s');

            PropertyAvailability::create([
                'property_id' => $property->id,
                'day_of_week' => $item['day_of_week'] ?? null,
                'specific_date' => $item['specific_date'] ?? null,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'interval_minutes' => $item['interval_minutes'],
                'fee_amount' => $item['fee_amount'],
                'is_active' => $item['is_active'] ?? true,
            ]);
        }

        return redirect()->back()->with('success', 'Inspection availability schedule saved successfully.');
    }

    /**
     * Tenant books an inspection slot with Escrow deposit.
     * Fires emails and in-app website notifications to Property Agent and Admin.
     */
    public function book(Property $property, Request $request, EscrowService $escrowService)
    {
        if ($property->status !== 'published') {
            abort(404, 'Property is not published for viewing.');
        }

        $validated = $request->validate([
            'inspection_date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|string',
            'end_time' => 'required|string',
            'interval_minutes' => 'required|integer|in:30,45,60',
            'fee_amount' => 'required|numeric|min:0',
            'property_unit_id' => 'nullable|exists:property_units,id',
            'tenant_notes' => 'nullable|string|max:500',
        ]);

        $tenant = $request->user();
        $agent = $property->user; // person in charge of property

        // Convert times to H:i:s
        $startTime = Carbon::parse($validated['start_time'])->format('H:i:s');
        $endTime = Carbon::parse($validated['end_time'])->format('H:i:s');

        // Check if slot is already taken
        $conflict = InspectionBooking::where('property_id', $property->id)
            ->where('inspection_date', $validated['inspection_date'])
            ->where('start_time', $startTime)
            ->whereIn('status', ['pending', 'confirmed', 'rescheduled'])
            ->exists();

        if ($conflict) {
            return back()->withErrors(['message' => 'This time slot was just booked by another tenant. Please pick another available slot.']);
        }

        // 1. Initialize Escrow Transaction for the inspection fee
        $unitId = $validated['property_unit_id'] ?? null;
        $unit = $unitId 
            ? $property->units()->find($unitId) 
            : $property->units()->first();

        if (!$unit) {
            $unit = $property->units()->firstOrCreate(['status' => 'available'], [
                'title' => 'Standard Unit',
                'rent_price' => 0,
            ]);
        }

        $transaction = $escrowService->initializeTransaction(
            tenant: $tenant,
            unit: $unit,
            type: 'inspection_fee',
            amount: (float) $validated['fee_amount']
        );

        // 2. Create InspectionBooking record
        $booking = InspectionBooking::create([
            'property_id' => $property->id,
            'property_unit_id' => $unit?->id,
            'tenant_id' => $tenant->id,
            'agent_id' => $agent ? $agent->id : $tenant->id,
            'transaction_id' => $transaction->id ?? null,
            'inspection_date' => $validated['inspection_date'],
            'start_time' => $startTime,
            'end_time' => $endTime,
            'interval_minutes' => $validated['interval_minutes'],
            'fee_amount' => $validated['fee_amount'],
            'status' => 'pending',
            'tenant_notes' => $validated['tenant_notes'] ?? null,
        ]);

        // 3. Send Website Notifications & Emails
        // A) To the Property Agent
        if ($agent && $agent->id !== $tenant->id) {
            $agent->notify(new NewInspectionBookingNotification($booking));
        }

        // B) To Admins
        $admins = User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            if (!$agent || $admin->id !== $agent->id) {
                $admin->notify(new NewInspectionBookingNotification($booking));
            }
        }

        $paymentUrl = $transaction->payment_url ?? route('tenant.inspections');

        if (!filter_var($paymentUrl, FILTER_VALIDATE_URL) || str_starts_with($paymentUrl, url('/')) || str_contains($paymentUrl, 'localhost') || str_contains($paymentUrl, '127.0.0.1')) {
            return redirect()->route('tenant.inspections')->with('success', "Inspection booked for {$booking->formatted_date} at {$booking->start_time_12h}! Your escrow deposit is securely held.");
        }

        return Inertia::location($paymentUrl);
    }

    /**
     * Agent / Owner accepts the inspection.
     * Updates status to 'confirmed' and sends email & website notification to tenant.
     */
    public function accept(InspectionBooking $booking, Request $request)
    {
        $user = $request->user();
        if ($booking->agent_id !== $user->id && !$user->hasRole('admin')) {
            abort(403);
        }

        $booking->update([
            'status' => 'confirmed',
        ]);

        // Notify tenant via email and website notification
        $booking->tenant->notify(new InspectionConfirmedNotification($booking));

        return redirect()->back()->with('success', "Inspection for {$booking->property->title} confirmed. The tenant has been notified.");
    }

    /**
     * Agent / Owner reschedules the inspection to a new time.
     * Updates status to 'rescheduled' and sends email & website notification to tenant.
     */
    public function reschedule(InspectionBooking $booking, Request $request)
    {
        $user = $request->user();
        if ($booking->agent_id !== $user->id && !$user->hasRole('admin')) {
            abort(403);
        }

        $validated = $request->validate([
            'inspection_date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|string',
            'end_time' => 'required|string',
            'agent_notes' => 'required|string|max:500',
        ]);

        $startTime = Carbon::parse($validated['start_time'])->format('H:i:s');
        $endTime = Carbon::parse($validated['end_time'])->format('H:i:s');

        $booking->update([
            'inspection_date' => $validated['inspection_date'],
            'start_time' => $startTime,
            'end_time' => $endTime,
            'status' => 'rescheduled',
            'agent_notes' => $validated['agent_notes'],
            'rescheduled_at' => now(),
        ]);

        // Notify tenant via email and website notification with the updated time
        $booking->tenant->notify(new InspectionRescheduledNotification($booking));

        return redirect()->back()->with('warning', "Inspection rescheduled to {$booking->formatted_date} at {$booking->start_time_12h}. The tenant has been notified via email.");
    }

    /**
     * Mark a website notification as read.
     */
    public function markNotificationRead(Request $request, string $id)
    {
        if ($id === 'all') {
            $request->user()->unreadNotifications->markAsRead();
            return redirect()->back();
        }

        $notification = $request->user()->notifications()->where('id', $id)->first();
        if ($notification) {
            $notification->markAsRead();
        }

        return redirect()->back();
    }
}
