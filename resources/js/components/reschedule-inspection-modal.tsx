import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Calendar as CalendarIcon,
    Clock,
    AlertCircle,
    X,
    Loader2,
    CalendarCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    booking: {
        id: number;
        property: {
            title: string;
        };
        tenant: {
            name: string;
            email: string;
        };
        inspection_date: string;
        formatted_date: string;
        start_time_12h: string;
        end_time_12h: string;
        interval_minutes: number;
    } | null;
};

export default function RescheduleInspectionModal({ isOpen, onClose, booking }: Props) {
    if (!isOpen || !booking) return null;

    // Tomorrow as default
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDate = tomorrow.toISOString().split('T')[0];

    const [newDate, setNewDate] = useState(defaultDate);
    const [startTime12h, setStartTime12h] = useState('11:00 AM');
    const [endTime12h, setEndTime12h] = useState('11:45 AM');
    const [reason, setReason] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Predefined 12-hour slots for quick selection
    const quick12hSlots = [
        { start: '10:00 AM', end: '10:45 AM' },
        { start: '11:30 AM', end: '12:15 PM' },
        { start: '02:00 PM', end: '02:45 PM' },
        { start: '03:30 PM', end: '04:15 PM' },
        { start: '05:00 PM', end: '05:45 PM' },
    ];

    const handleRescheduleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason.trim()) {
            setErrorMsg('Please specify the reason for rescheduling to inform the tenant.');
            return;
        }

        setSubmitting(true);
        setErrorMsg(null);

        router.post(
            `/inspections/${booking.id}/reschedule`,
            {
                inspection_date: newDate,
                start_time: startTime12h,
                end_time: endTime12h,
                agent_notes: reason,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSubmitting(false);
                    onClose();
                },
                onError: (err: any) => {
                    setSubmitting(false);
                    setErrorMsg(err?.message || Object.values(err)[0] as string || 'Reschedule failed.');
                },
            }
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
            <div className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-800/40">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                                Reschedule Inspection
                            </h3>
                            <p className="text-xs text-slate-500 line-clamp-1">
                                Tenant: {booking.tenant.name} • {booking.property.title}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleRescheduleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin">
                    {errorMsg && (
                        <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    {/* Current time display */}
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5 text-xs dark:border-zinc-800 dark:bg-zinc-800/40">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Currently Scheduled For:</span>
                        <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                            {booking.formatted_date} at {booking.start_time_12h} – {booking.end_time_12h}
                        </p>
                    </div>

                    {/* New Date */}
                    <div>
                        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5 block">
                            New Inspection Date
                        </label>
                        <Input
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            className="rounded-xl text-xs border-slate-200 dark:border-zinc-800"
                            required
                        />
                    </div>

                    {/* Quick 12-hour presets */}
                    <div>
                        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5 block">
                            Quick 12-Hour Slots
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                            {quick12hSlots.map((slot, idx) => {
                                const isSelected = startTime12h === slot.start && endTime12h === slot.end;
                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => {
                                            setStartTime12h(slot.start);
                                            setEndTime12h(slot.end);
                                        }}
                                        className={`rounded-xl py-2 px-2 text-xs font-bold border transition-all text-center cursor-pointer ${
                                            isSelected
                                                ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-800 dark:text-slate-300'
                                        }`}
                                    >
                                        {slot.start} – {slot.end}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Custom 12-hour input */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1 block">
                                Start Time (e.g. 02:30 PM)
                            </label>
                            <Input
                                type="text"
                                placeholder="02:30 PM"
                                value={startTime12h}
                                onChange={(e) => setStartTime12h(e.target.value)}
                                className="rounded-xl text-xs border-slate-200 dark:border-zinc-800"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1 block">
                                End Time (e.g. 03:15 PM)
                            </label>
                            <Input
                                type="text"
                                placeholder="03:15 PM"
                                value={endTime12h}
                                onChange={(e) => setEndTime12h(e.target.value)}
                                className="rounded-xl text-xs border-slate-200 dark:border-zinc-800"
                                required
                            />
                        </div>
                    </div>

                    {/* Reason / Notes for tenant */}
                    <div>
                        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5 block">
                            Reason for Rescheduling (Sent to Tenant)
                        </label>
                        <Textarea
                            placeholder="e.g. The building caretaker is only available in the afternoon; proposing 02:30 PM instead."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                            className="rounded-xl text-xs border-slate-200 dark:border-zinc-800"
                            required
                        />
                        <p className="text-[11px] text-slate-400 mt-1">
                            An automated email and in-app website notification will be sent directly to {booking.tenant.name}.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onClose}
                            className="rounded-xl border-slate-200 text-xs"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={submitting}
                            className="rounded-xl bg-amber-600 text-xs font-bold text-white hover:bg-amber-700 shadow-sm cursor-pointer"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                    Rescheduling...
                                </>
                            ) : (
                                <>
                                    <CalendarCheck className="mr-1.5 h-3.5 w-3.5" />
                                    Send Reschedule & Notify Tenant
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
