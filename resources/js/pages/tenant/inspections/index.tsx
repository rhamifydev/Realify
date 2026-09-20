import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    Calendar as CalendarIcon,
    Clock,
    CheckCircle2,
    AlertCircle,
    XCircle,
    Building2,
    MapPin,
    User,
    CalendarCheck,
    CalendarClock,
    Phone,
    Mail,
    ShieldCheck,
    ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import RescheduleInspectionModal from '@/components/reschedule-inspection-modal';

type BookingItem = {
    id: number;
    property_id: number;
    property_unit_id?: number | null;
    tenant_id: number;
    agent_id: number;
    inspection_date: string;
    formatted_date: string;
    start_time: string;
    end_time: string;
    start_time_12h: string;
    end_time_12h: string;
    time_slot_label: string;
    interval_minutes: number;
    fee_amount: number;
    status: 'pending' | 'confirmed' | 'rescheduled' | 'cancelled' | 'completed';
    tenant_notes?: string | null;
    agent_notes?: string | null;
    rescheduled_at?: string | null;
    property: {
        id: number;
        title: string;
        address: string;
        city: string;
        state: string;
        media?: any[];
    };
    tenant: {
        id: number;
        name: string;
        email: string;
    };
    agent: {
        id: number;
        name: string;
        email: string;
    };
    transaction?: {
        id: number;
        payment_reference: string;
        status: string;
    };
};

type Props = {
    tenantBookings: BookingItem[];
    agentBookings: BookingItem[];
    isAgentOrOwner: boolean;
    notifications: any[];
};

export default function InspectionsIndex({
    tenantBookings = [],
    agentBookings = [],
    isAgentOrOwner = false,
    notifications = [],
}: Props) {
    const [activeTab, setActiveTab] = useState<'tenant' | 'agent'>(
        isAgentOrOwner && agentBookings.length > 0 && tenantBookings.length === 0 ? 'agent' : 'tenant'
    );
    const [reschedulingBooking, setReschedulingBooking] = useState<BookingItem | null>(null);
    const [actioningId, setActioningId] = useState<number | null>(null);

    const formatNaira = (amount: number) => {
        return '₦' + Number(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 0 });
    };

    const handleAccept = (booking: BookingItem) => {
        if (!confirm(`Confirm inspection with ${booking.tenant.name} on ${booking.formatted_date} at ${booking.start_time_12h}?`)) {
            return;
        }

        setActioningId(booking.id);
        router.post(
            `/inspections/${booking.id}/accept`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setActioningId(null),
            }
        );
    };

    const currentList = activeTab === 'tenant' ? tenantBookings : agentBookings;

    return (
        <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-8">
            <Head title="Inspection Visits & Schedules" />

            {/* Header */}
            <div>
                <div className="flex items-center gap-2">
                    <span className="rounded-md bg-blue-900 px-2 py-0.5 text-xs font-black uppercase tracking-widest text-white">
                        Inspection Hub
                    </span>
                    <span className="text-xs font-semibold text-slate-400">12-Hour Escrow Verified Schedule</span>
                </div>
                <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    Property Inspections & Viewings
                </h1>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Track your upcoming visits, manage arrival times, and coordinate with property hosts under Escrow protection.
                </p>
            </div>


            {/* Switch Tabs: Tenant Visits vs Host Requests */}
            {isAgentOrOwner && (
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3 dark:border-zinc-800">
                    <button
                        onClick={() => setActiveTab('tenant')}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                            activeTab === 'tenant'
                                ? 'bg-blue-900 text-white shadow-sm'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-300'
                        }`}
                    >
                        <span>My Booked Visits</span>
                        <span className={`rounded-full px-2 py-0.2 text-[10px] font-extrabold ${activeTab === 'tenant' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
                            {tenantBookings.length}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('agent')}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                            activeTab === 'agent'
                                ? 'bg-blue-900 text-white shadow-sm'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-300'
                        }`}
                    >
                        <span>Host / Agent Requests</span>
                        <span className={`rounded-full px-2 py-0.2 text-[10px] font-extrabold ${activeTab === 'agent' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'}`}>
                            {agentBookings.length}
                        </span>
                    </button>
                </div>
            )}

            {/* Inspections Grid */}
            <div className="space-y-4">
                {currentList.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
                        <CalendarIcon className="mx-auto h-10 w-10 text-slate-300 dark:text-zinc-700" />
                        <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                            {activeTab === 'tenant' ? 'No Booked Inspections Yet' : 'No Incoming Inspection Requests'}
                        </h3>
                        <p className="mt-1 text-xs text-slate-400">
                            {activeTab === 'tenant'
                                ? 'Browse verified properties and schedule an accompanied viewing with Escrow protection.'
                                : 'Inspection appointments requested by prospective tenants will appear here.'}
                        </p>
                        {activeTab === 'tenant' && (
                            <Button asChild size="sm" className="mt-5 rounded-xl bg-blue-900 text-xs font-bold text-white hover:bg-blue-800">
                                <Link href="/browse">Explore Properties</Link>
                            </Button>
                        )}
                    </div>
                ) : (
                    currentList.map((booking) => {
                        const isActioning = actioningId === booking.id;
                        const media = booking.property?.media?.[0];
                        const imgUrl = media?.file_path
                            ? `/storage/${media.file_path}`
                            : media?.path
                            ? (media.path.startsWith('http') ? media.path : `/storage/${media.path}`)
                            : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop';

                        return (
                            <div
                                key={booking.id}
                                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                        {/* Property Info & Photo */}
                                        <div className="flex gap-4">
                                            <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-2xl bg-slate-100 dark:bg-zinc-800">
                                                <img src={imgUrl} alt={booking.property.title} className="h-full w-full object-cover" />
                                                <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-xs">
                                                    {booking.interval_minutes}m Slot
                                                </span>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {/* Booking Reference */}
                                                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold text-slate-700 dark:bg-zinc-800 dark:text-slate-300">
                                                        Slot #{booking.id}
                                                    </span>

                                                    {/* Status Badge */}
                                                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                                                        booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                                                        booking.status === 'rescheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                                                        booking.status === 'completed' ? 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-slate-300' :
                                                        'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                                    }`}>
                                                        {booking.status === 'confirmed' && <CheckCircle2 className="h-3 w-3" />}
                                                        {booking.status === 'rescheduled' && <CalendarClock className="h-3 w-3" />}
                                                        {booking.status === 'pending' && <Clock className="h-3 w-3" />}
                                                        {booking.status.replace('_', ' ')}
                                                    </span>

                                                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                                        Deposit: {formatNaira(booking.fee_amount)} (Held in Escrow)
                                                    </span>
                                                </div>

                                                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                                                    <Link
                                                        href={`/browse/${booking.property_id}`}
                                                        className="hover:text-blue-900 dark:hover:text-blue-400 transition-colors"
                                                    >
                                                        {booking.property.title}
                                                    </Link>
                                                </h3>

                                                <p className="flex items-center gap-1 text-xs text-slate-500">
                                                    <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                                    {booking.property.address}, {booking.property.city}, {booking.property.state}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Scheduled 12-Hour Slot Badge */}
                                        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 sm:text-right dark:border-zinc-800 dark:bg-zinc-800/40">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                Appointment Time (12-Hour)
                                            </span>
                                            <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                                                {booking.start_time_12h} – {booking.end_time_12h}
                                            </p>
                                            <p className="text-xs font-semibold text-blue-900 dark:text-blue-400">
                                                {booking.formatted_date}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Rescheduled Alert Banner (if host updated time) */}
                                    {booking.status === 'rescheduled' && (
                                        <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50/80 p-4 dark:border-blue-900/60 dark:bg-blue-950/30 flex items-start gap-3">
                                            <CalendarClock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                            <div className="text-xs text-blue-900 dark:text-blue-300">
                                                <span className="font-extrabold block">Time Slot Rescheduled by Host:</span>
                                                <p className="mt-0.5 font-semibold text-blue-800 dark:text-blue-200">
                                                    New proposed time: <strong>{booking.formatted_date} at {booking.start_time_12h} – {booking.end_time_12h}</strong>.
                                                </p>
                                                {booking.agent_notes && (
                                                    <p className="mt-1 italic text-slate-600 dark:text-slate-400">
                                                        "{booking.agent_notes}"
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Notes / Participants */}
                                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 border-t border-slate-100 pt-3 dark:border-zinc-800 text-xs">
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                            <User className="h-3.5 w-3.5 text-slate-400" />
                                            <span>
                                                {activeTab === 'tenant' ? (
                                                    <>Host / Agent: <strong>{booking.agent?.name || 'Assigned Agent'}</strong> ({booking.agent?.email})</>
                                                ) : (
                                                    <>Tenant: <strong>{booking.tenant?.name || 'Tenant'}</strong> ({booking.tenant?.email})</>
                                                )}
                                            </span>
                                        </div>

                                        {booking.tenant_notes && (
                                            <div className="text-slate-500 italic truncate">
                                                Tenant Note: "{booking.tenant_notes}"
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Bar */}
                                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-zinc-800">
                                        <div className="flex items-center gap-2">
                                            <Button asChild size="sm" variant="ghost" className="text-xs text-slate-600 dark:text-slate-400">
                                                <Link href={`/browse/${booking.property_id}`}>
                                                    <ExternalLink className="mr-1 h-3.5 w-3.5" />
                                                    View Property
                                                </Link>
                                            </Button>

                                            <Button asChild size="sm" variant="ghost" className="text-xs text-emerald-700 dark:text-emerald-400">
                                                <Link href="/escrow">
                                                    <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                                                    Escrow Deposit
                                                </Link>
                                            </Button>
                                        </div>

                                        {/* Host / Agent Ruling Actions */}
                                        {activeTab === 'agent' && (
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={isActioning}
                                                    onClick={() => setReschedulingBooking(booking)}
                                                    className="rounded-xl border-amber-300 text-xs font-bold text-amber-700 hover:bg-amber-50 dark:border-amber-900 dark:text-amber-400 cursor-pointer"
                                                >
                                                    <CalendarClock className="mr-1 h-3.5 w-3.5" />
                                                    Reschedule Time
                                                </Button>

                                                {booking.status !== 'confirmed' && (
                                                    <Button
                                                        size="sm"
                                                        disabled={isActioning}
                                                        onClick={() => handleAccept(booking)}
                                                        className="rounded-xl bg-emerald-700 text-xs font-bold text-white hover:bg-emerald-800 shadow-xs cursor-pointer"
                                                    >
                                                        <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                                                        Accept Visit
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Reschedule Modal */}
            <RescheduleInspectionModal
                isOpen={!!reschedulingBooking}
                booking={reschedulingBooking}
                onClose={() => setReschedulingBooking(null)}
            />
        </div>
    );
}

InspectionsIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Inspection Visits', href: '/tenant/inspections' },
        ]}
    >
        {page}
    </AppLayout>
);
