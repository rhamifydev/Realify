import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Clock,
    Calendar,
    Plus,
    Trash2,
    CheckCircle2,
    Save,
    Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type ScheduleRow = {
    day_of_week: string;
    start_time: string; // 12-hour string like "09:00 AM"
    end_time: string;   // 12-hour string like "05:00 PM"
    interval_minutes: number; // 30, 45, 60
    fee_amount: number; // customized amount per interval
    is_active: boolean;
};

type Props = {
    propertyId: number;
    initialSchedules?: any[];
};

export default function PropertyAvailabilityManager({ propertyId, initialSchedules = [] }: Props) {
    const days = [
        { key: 'monday', label: 'Mon' },
        { key: 'tuesday', label: 'Tue' },
        { key: 'wednesday', label: 'Wed' },
        { key: 'thursday', label: 'Thu' },
        { key: 'friday', label: 'Fri' },
        { key: 'saturday', label: 'Sat' },
        { key: 'sunday', label: 'Sun' },
    ];

    const defaultRows: ScheduleRow[] = initialSchedules.length > 0
        ? initialSchedules.map((s) => ({
              day_of_week: s.day_of_week || 'saturday',
              start_time: s.start_time ? formatTo12h(s.start_time) : '10:00 AM',
              end_time: s.end_time ? formatTo12h(s.end_time) : '04:00 PM',
              interval_minutes: s.interval_minutes || 30,
              fee_amount: Number(s.fee_amount || 5000),
              is_active: s.is_active !== undefined ? Boolean(s.is_active) : true,
          }))
        : [
              { day_of_week: 'saturday', start_time: '10:00 AM', end_time: '04:00 PM', interval_minutes: 30, fee_amount: 5000, is_active: true },
              { day_of_week: 'saturday', start_time: '10:00 AM', end_time: '04:00 PM', interval_minutes: 45, fee_amount: 7500, is_active: true },
              { day_of_week: 'saturday', start_time: '10:00 AM', end_time: '04:00 PM', interval_minutes: 60, fee_amount: 10000, is_active: true },
              { day_of_week: 'wednesday', start_time: '01:00 PM', end_time: '05:00 PM', interval_minutes: 30, fee_amount: 5000, is_active: true },
          ];

    function formatTo12h(timeStr: string) {
        if (!timeStr) return '10:00 AM';
        if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;
        const [h, m] = timeStr.split(':');
        let hours = parseInt(h, 10);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${String(hours).padStart(2, '0')}:${m} ${ampm}`;
    }

    const [rows, setRows] = useState<ScheduleRow[]>(defaultRows);
    const [saving, setSaving] = useState(false);

    const handleAddRow = () => {
        setRows([
            ...rows,
            {
                day_of_week: 'saturday',
                start_time: '10:00 AM',
                end_time: '03:00 PM',
                interval_minutes: 45,
                fee_amount: 7500,
                is_active: true,
            },
        ]);
    };

    const handleRemoveRow = (index: number) => {
        setRows(rows.filter((_, i) => i !== index));
    };

    const handleUpdateRow = (index: number, field: keyof ScheduleRow, value: any) => {
        const updated = [...rows];
        updated[index] = { ...updated[index], [field]: value };
        setRows(updated);
    };

    const handleSaveSchedule = () => {
        setSaving(true);
        router.post(
            `/properties/${propertyId}/availability`,
            { schedules: rows },
            {
                preserveScroll: true,
                onFinish: () => setSaving(false),
            }
        );
    };

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-900 text-white shadow-xs">
                        <Clock className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                            Inspection Availability & Slot Fees
                        </h3>
                        <p className="text-xs text-slate-500">
                            Configure available days, 12-hour time windows, interval durations, and custom fees.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleAddRow}
                        className="rounded-xl border-slate-200 text-xs"
                    >
                        <Plus className="mr-1 h-3.5 w-3.5" />
                        Add Window
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        disabled={saving}
                        onClick={handleSaveSchedule}
                        className="rounded-xl bg-blue-900 text-xs font-bold text-white hover:bg-blue-800 shadow-xs cursor-pointer"
                    >
                        <Save className="mr-1.5 h-3.5 w-3.5" />
                        {saving ? 'Saving...' : 'Save Schedule'}
                    </Button>
                </div>
            </div>

            {/* Configured Rows Table */}
            <div className="space-y-3">
                {rows.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400 dark:border-zinc-800">
                        No custom schedule configured. Default standard windows will be offered to tenants. Click "Add Window" to define custom slots.
                    </div>
                ) : (
                    rows.map((row, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-all hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-800/40"
                        >
                            {/* Day Selection */}
                            <div className="sm:w-36">
                                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Day of Week</label>
                                <select
                                    value={row.day_of_week}
                                    onChange={(e) => handleUpdateRow(idx, 'day_of_week', e.target.value)}
                                    className="h-9 w-full rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-200"
                                >
                                    {days.map((d) => (
                                        <option key={d.key} value={d.key}>
                                            {d.label} (Every {d.key.charAt(0).toUpperCase() + d.key.slice(1)})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* 12-hour Start & End Times */}
                            <div className="grid grid-cols-2 gap-2 sm:w-56">
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Start (12-Hour)</label>
                                    <Input
                                        type="text"
                                        placeholder="09:00 AM"
                                        value={row.start_time}
                                        onChange={(e) => handleUpdateRow(idx, 'start_time', e.target.value)}
                                        className="h-9 rounded-xl text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">End (12-Hour)</label>
                                    <Input
                                        type="text"
                                        placeholder="05:00 PM"
                                        value={row.end_time}
                                        onChange={(e) => handleUpdateRow(idx, 'end_time', e.target.value)}
                                        className="h-9 rounded-xl text-xs"
                                    />
                                </div>
                            </div>

                            {/* Interval duration */}
                            <div className="sm:w-36">
                                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Interval Slot</label>
                                <select
                                    value={row.interval_minutes}
                                    onChange={(e) => handleUpdateRow(idx, 'interval_minutes', parseInt(e.target.value, 10))}
                                    className="h-9 w-full rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-200"
                                >
                                    <option value={30}>30 Minutes</option>
                                    <option value={45}>45 Minutes</option>
                                    <option value={60}>1 Hour</option>
                                </select>
                            </div>

                            {/* Fee amount for this interval */}
                            <div className="sm:w-36">
                                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Fee Amount (₦)</label>
                                <Input
                                    type="number"
                                    step="500"
                                    value={row.fee_amount}
                                    onChange={(e) => handleUpdateRow(idx, 'fee_amount', parseFloat(e.target.value) || 0)}
                                    className="h-9 rounded-xl text-xs font-bold"
                                />
                            </div>

                            {/* Delete Button */}
                            <div className="flex items-end justify-end pt-1">
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleRemoveRow(idx)}
                                    className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
