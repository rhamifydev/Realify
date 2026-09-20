<?php

namespace App\Notifications;

use App\Models\InspectionBooking;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InspectionConfirmedNotification extends Notification
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
        $date = $this->booking->formatted_date;
        $time12h = $this->booking->time_slot_label;

        return (new MailMessage)
            ->subject("Inspection Confirmed: {$property->title}")
            ->greeting("Hello {$notifiable->name},")
            ->line("Good news! The property agent ({$agent->name}) has confirmed your physical inspection appointment.")
            ->line("**Property:** {$property->title}")
            ->line("**Confirmed Date:** {$date}")
            ->line("**Confirmed Time Slot:** {$time12h}")
            ->line("**Address:** {$property->address}, {$property->city}, {$property->state}")
            ->line("**Host Contact:** {$agent->name} ({$agent->email})")
            ->action('View My Inspection Pass', url('/tenant/inspections'))
            ->line('Your inspection deposit is protected in Escrow until the inspection is concluded.');
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
            'title' => 'Inspection Confirmed! 🎉',
            'message' => "Your inspection for {$this->booking->property->title} is confirmed for {$this->booking->formatted_date} at {$this->booking->start_time_12h}.",
            'action_url' => '/tenant/inspections',
        ];
    }
}
