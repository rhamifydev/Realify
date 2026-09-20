<?php

namespace App\Notifications;

use App\Models\InspectionBooking;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InspectionRescheduledNotification extends Notification
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
        $agent = $this->booking->agent;
        $newDate = $this->booking->formatted_date;
        $newTime12h = $this->booking->time_slot_label;

        return (new MailMessage)
            ->subject("Inspection Rescheduled: {$property->title}")
            ->greeting("Hello {$notifiable->name},")
            ->line("The property agent ({$agent->name}) has updated the scheduled time for your property inspection.")
            ->line("**Property:** {$property->title}")
            ->line("**New Date:** {$newDate}")
            ->line("**New Time Slot:** {$newTime12h}")
            ->when($this->booking->agent_notes, function ($message) {
                return $message->line("**Reason / Agent Message:** " . $this->booking->agent_notes);
            })
            ->action('View Inspection Details', url('/tenant/inspections'))
            ->line('Your ₦5,000 inspection deposit remains securely held in Escrow.');
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'booking_id' => $this->booking->id,
            'property_id' => $this->booking->property_id,
            'property_title' => $this->booking->property->title,
            'agent_name' => $this->booking->agent->name,
            'inspection_date' => $this->booking->formatted_date,
            'time_slot' => $this->booking->time_slot_label,
            'agent_notes' => $this->booking->agent_notes,
            'title' => 'Inspection Rescheduled',
            'message' => "Your inspection for {$this->booking->property->title} was rescheduled to {$this->booking->formatted_date} at {$this->booking->start_time_12h}.",
            'action_url' => '/tenant/inspections',
        ];
    }
}
