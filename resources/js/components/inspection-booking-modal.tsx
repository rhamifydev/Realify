import { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import {
    Calendar as CalendarIcon,
    Clock,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    X,
    Loader2,
    MapPin,
    Lock,
    Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type SlotItem = {
    availability_id?: number | null;
    start_time: string;
    end_time: string;
    start_time_12h: string;
    end_time_12h: string;
    label: string;
    interval_minutes: number;
    fee_amount: number;
    is_booked: boolean;
    is_available: boolean;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    property: {
        id: number;
        title: string;
        address: string;
        city: string;
        state: string;
        user?: {
            name: string;
            email: string;
        };
    };
    activeUnitId?: number;
};

export default function InspectionBookingModal({ isOpen, onClose, property, activeUnitId }: Props) {
    const { auth } = usePage().props as any;

    // Default to tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDateStr = tomorrow.toISOString().split('T')[0];

    const [selectedDate, setSelectedDate] = useState<string>(defaultDateStr);
    const [selectedInterval, setSelectedInterval] = useState<number>(30); // 30, 45, 60
    const [slots, setSlots] = useState<SlotItem[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<SlotItem | null>(null);
    const [tenantNotes, setTenantNotes] = useState('');
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Generate next 7 selectable days
    const upcomingDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i + 1);
        const ymd = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        const dayNum = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        return { ymd, dayName, dayNum };
    });

    // Fetch available slots whenever date changes
    useEffect(() => {
        if (!isOpen) return;
        setLoadingSlots(true);
        setErrorMsg(null);
        setSelectedSlot(null);

        fetch(`/browse/${property.id}/availability?date=${selectedDate}`)
            .then((res) => res.json())
            .then((data) => {
                setSlots(data.slots || []);
                setLoadingSlots(false);
            })
            .catch(() => {
                setLoadingSlots(false);
                setErrorMsg('Unable to load available slots. Please try again.');
            });
    }, [selectedDate, property.id, isOpen]);

    if (!isOpen) return null;

    // Filter slots by chosen interval (30m, 45m, 1hr)
    const filteredSlots = slots.filter((s) => s.interval_minutes === selectedInterval);

    // Format currency in Naira
    const formatNaira = (amount: number) => {
        return '₦' + Number(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 0 });
    };

    const handleConfirmBooking = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSlot) {
            setErrorMsg('Please select an available inspection time slot.');
            return;
        }

        if (!auth?.user) {
            window.location.href = '/login';
            return;
        }

        setSubmitting(true);
        setErrorMsg(null);

        router.post(
            `/properties/${property.id}/book-inspection`,
            {
                inspection_date: selectedDate,
                start_time: selectedSlot.start_time,
                end_time: selectedSlot.end_time,
                interval_minutes: selectedSlot.interval_minutes,
                fee_amount: selectedSlot.fee_amount,
                property_unit_id: activeUnitId,
                tenant_notes: tenantNotes,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSubmitting(false);
                    onClose();
                },
                onError: (err: any) => {
                    setSubmitting(false);
                    setErrorMsg(err?.message || Object.values(err)[0] as string || 'Booking failed.');
                },
            }
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
            <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-800/40">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-900 text-white shadow-xs">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                                Book Physical Property Inspection
                            </h3>
                            <p className="text-xs text-slate-500 line-clamp-1">
                                {property.title} • {property.city}, {property.state}
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

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
                    {errorMsg && (
                        <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    {/* Step 1: Select Date */}
                    <div>
                        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2.5">
                            <CalendarIcon className="h-3.5 w-3.5 text-blue-900" />
                            1. Choose Inspection Date
                        </label>
                        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                            {upcomingDays.map((day) => {
                                const isSelected = selectedDate === day.ymd;
                                return (
                                    <button
                                        key={day.ymd}
                                        type="button"
                                        onClick={() => setSelectedDate(day.ymd)}
                                        className={`flex flex-col items-center rounded-2xl py-2.5 px-1 border transition-all text-center cursor-pointer ${
                                            isSelected
                                                ? 'bg-blue-900 text-white border-blue-900 shadow-md shadow-blue-900/20'
                                                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-zinc-800 dark:bg-zinc-800 dark:text-slate-200'
                                        }`}
                                    >
                                        <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                                            {day.dayName}
                                        </span>
                                        <span className="text-xs font-black mt-0.5">{day.dayNum}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Step 2: Duration Interval Tabs (30m, 45m, 1hr) with customizable fees */}
                    <div>
                        <div className="flex items-center justify-between mb-2.5">
                            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-blue-900" />
                                2. Select Inspection Duration & Fee
                            </label>
                            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                100% Escrow Protected
                            </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2.5">
                            {[
                                { interval: 30, label: '30 Minutes', desc: 'Standard Walkthrough', defaultFee: 5000 },
                                { interval: 45, label: '45 Minutes', desc: 'Extended Inspection', defaultFee: 7500 },
                                { interval: 60, label: '1 Hour', desc: 'Comprehensive Due Diligence', defaultFee: 10000 },
                            ].map((tab) => {
                                const isSelected = selectedInterval === tab.interval;
                                // Find fee for this interval if configured
                                const matchingSlot = slots.find((s) => s.interval_minutes === tab.interval);
                                const fee = matchingSlot ? matchingSlot.fee_amount : tab.defaultFee;

                                return (
                                    <button
                                        key={tab.interval}
                                        type="button"
                                        onClick={() => {
                                            setSelectedInterval(tab.interval);
                                            setSelectedSlot(null);
                                        }}
                                        className={`flex flex-col items-start rounded-2xl p-3 border text-left transition-all cursor-pointer ${
                                            isSelected
                                                ? 'border-blue-900 bg-blue-50/60 ring-2 ring-blue-900/20 dark:bg-blue-950/40 dark:border-blue-800'
                                                : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-800'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <span className="text-xs font-black text-slate-900 dark:text-white">
                                                {tab.label}
                                            </span>
                                            <span className="text-xs font-black text-blue-900 dark:text-blue-400">
                                                {formatNaira(fee)}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{tab.desc}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Step 3: Available 12-hour Time Slots */}
                    <div>
                        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between mb-2.5">
                            <span>3. Choose Time Slot (12-Hour Schedule)</span>
                            <span className="text-[11px] font-normal lowercase text-slate-500">
                                {filteredSlots.filter((s) => s.is_available).length} available
                            </span>
                        </label>

                        {loadingSlots ? (
                            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                                <Loader2 className="h-6 w-6 animate-spin text-blue-900 mb-2" />
                                <span className="text-xs">Loading available slots...</span>
                            </div>
                        ) : filteredSlots.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400 dark:border-zinc-800">
                                No available slots for this duration on this date. Please try a different date or interval.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 scrollbar-thin">
                                {filteredSlots.map((slot, idx) => {
                                    const isChosen =
                                        selectedSlot?.start_time === slot.start_time &&
                                        selectedSlot?.interval_minutes === slot.interval_minutes;

                                    if (slot.is_booked) {
                                        return (
                                            <div
                                                key={idx}
                                                className="flex flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-center opacity-40 cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-800/40"
                                            >
                                                <span className="text-xs font-bold text-slate-400 line-through">
                                                    {slot.start_time_12h} – {slot.end_time_12h}
                                                </span>
                                                <span className="text-[10px] text-rose-500 font-semibold mt-0.5">Booked</span>
                                            </div>
                                        );
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`flex flex-col items-center justify-center rounded-xl p-2.5 border transition-all text-center cursor-pointer ${
                                                isChosen
                                                    ? 'bg-blue-900 text-white border-blue-900 shadow-md shadow-blue-900/20'
                                                    : 'border-slate-200 bg-white hover:border-blue-900/40 hover:bg-blue-50/40 dark:border-zinc-800 dark:bg-zinc-800 text-slate-800 dark:text-slate-200'
                                            }`}
                                        >
                                            <span className="text-xs font-black tracking-tight">
                                                {slot.start_time_12h} – {slot.end_time_12h}
                                            </span>
                                            <span className={`text-[10px] font-bold mt-0.5 ${isChosen ? 'text-blue-200' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                                Available • {formatNaira(slot.fee_amount)}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Step 4: Optional Notes */}
                    <div>
                        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2 block">
                            4. Note for Property Host / Agent (Optional)
                        </label>
                        <Textarea
                            placeholder="e.g. Coming with my spouse; please let me know if parking is available inside the compound..."
                            value={tenantNotes}
                            onChange={(e) => setTenantNotes(e.target.value)}
                            rows={2}
                            className="rounded-xl text-xs border-slate-200 dark:border-zinc-800"
                        />
                    </div>

                    {/* Escrow Guarantee Pill */}
                    <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3.5 dark:border-emerald-950 dark:bg-emerald-950/30">
                        <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="text-xs text-emerald-900 dark:text-emerald-300">
                            <span className="font-bold">Realify Escrow Protection:</span> Your inspection deposit is held securely in escrow. The host only receives payment once you conclude the physical inspection!
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-slate-100 bg-slate-50/80 p-5 dark:border-zinc-800 dark:bg-zinc-800/40 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Total Deposit</span>
                        <p className="text-base font-black text-slate-900 dark:text-white">
                            {selectedSlot ? formatNaira(selectedSlot.fee_amount) : formatNaira(5000)}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
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
                            type="button"
                            size="sm"
                            disabled={!selectedSlot || submitting}
                            onClick={handleConfirmBooking}
                            className="rounded-xl bg-blue-900 text-xs font-bold text-white hover:bg-blue-800 shadow-md shadow-blue-900/20 cursor-pointer"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                    Securing in Escrow...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                                    Confirm & Secure Slot
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
