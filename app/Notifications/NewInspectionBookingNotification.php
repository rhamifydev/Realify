<?php

namespace App\Notifications;

use App\Models\InspectionBooking;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewInspectionBookingNotification extends Notification
{
    use Queueable;

    public function __construct(public InspectionBooking $booking)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $property = $this->booking->property;
        $tenant = $this->booking->tenant;
        $date = $this->booking->formatted_date;
        $time12h = $this->booking->time_slot_label;
        $amount = '₦' . number_format($this->booking->fee_amount, 2);

        return (new MailMessage)
            ->subject("New Inspection Booking: {$property->title}")
            ->greeting("Hello {$notifiable->name},")
            ->line("A new inspection visit has been booked by {$tenant->name}.")
            ->line("**Property:** {$property->title}")
            ->line("**Address:** {$property->address}, {$property->city}")
            ->line("**Date:** {$date}")
            ->line("**Scheduled Time:** {$time12h}")
            ->line("**Inspection Escrow Deposit:** {$amount} (Held in Escrow)")
            ->when($this->booking->tenant_notes, function ($message) {
                return $message->line("**Tenant Note:** " . $this->booking->tenant_notes);
            })
            ->action('Review & Manage Inspection', url('/tenant/inspections'))
            ->line('Please accept the inspection or reschedule if the proposed time is inconvenient.');
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'booking_id' => $this->booking->id,
            'property_id' => $this->booking->property_id,
            'property_title' => $this->booking->property->title,
            'tenant_name' => $this->booking->tenant->name,
            'tenant_email' => $this->booking->tenant->email,
            'inspection_date' => $this->booking->formatted_date,
            'time_slot' => $this->booking->time_slot_label,
            'fee_amount' => $this->booking->fee_amount,
            'title' => 'New Inspection Request',
            'message' => "{$this->booking->tenant->name} requested an inspection for {$this->booking->property->title} on {$this->booking->formatted_date} at {$this->booking->start_time_12h}.",
            'action_url' => '/tenant/inspections',
        ];
    }
}
