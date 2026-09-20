import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { EscrowStepper } from '@/components/escrow-stepper';
import {
    Home,
    ShieldCheck,
    Wallet,
    ChevronRight,
    AlertTriangle,
    Calendar,
    Clock,
    CheckCircle2,
    CalendarClock,
    MapPin,
    Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type BookingItem = {
    id: number;
    property_id: number;
    inspection_date: string;
    formatted_date: string;
    start_time_12h: string;
    end_time_12h: string;
    interval_minutes: number;
    fee_amount: number;
    status: 'pending' | 'confirmed' | 'rescheduled' | 'cancelled' | 'completed';
    agent_notes?: string | null;
    property: {
        id: number;
        title: string;
        address: string;
        city: string;
        state: string;
        media?: any[];
    };
    agent?: {
        id: number;
        name: string;
        email: string;
    };
};

type Props = {
    upcomingInspections?: BookingItem[];
    upcomingCount?: number;
    totalHeldInEscrow?: number;
    activeApplicationsCount?: number;
    kycStatus?: string;
    unreadCount?: number;
};

export default function TenantDashboard({
    upcomingInspections = [],
    upcomingCount = 0,
    totalHeldInEscrow = 0,
    activeApplicationsCount = 0,
    kycStatus = 'unverified',
    unreadCount = 0,
}: Props) {
    const { auth } = usePage().props as any;
    const user = auth?.user;

    const formatNaira = (amount: number) => {
        return '₦' + Number(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 0 });
    };

    const isKycVerified = kycStatus === 'verified';

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
            <Head title="Tenant Dashboard" />

            {/* Welcome Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                        Welcome back, {user?.name || 'Tenant'}! 👋
                    </h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm">
                        Here is what's happening with your property viewings, escrow deposits, and rental requests.
                    </p>
                </div>
            </div>

            {/* KYC Banner if not verified */}
            {!isKycVerified && (
                <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 dark:border-amber-900/50 dark:bg-amber-950/20">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-amber-900 dark:text-amber-300">Complete Your KYC Verification</h4>
                            <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                                Verify your identity with BVN or NIN to streamline escrow approval and access accompanied viewings.
                            </p>
                        </div>
                    </div>
                    <Link href="/kyc" className="shrink-0">
                        <Button className="bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-xs">
                            Verify Now
                        </Button>
                    </Link>
                </div>
            )}

            {/* Quick Status Widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Held in Escrow</p>
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white">
                            {formatNaira(totalHeldInEscrow)}
                        </h4>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <Wallet className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Active Bookings</p>
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white">
                            {activeApplicationsCount}
                        </h4>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/50 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Upcoming Inspections</p>
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white">
                            {upcomingCount}
                        </h4>
                    </div>
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Home className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Escrow Stepper */}
            <EscrowStepper currentStage={upcomingCount > 0 ? "inspection_paid" : "uninitiated"} amountHeld={formatNaira(totalHeldInEscrow)} />

            {/* Upcoming Inspections & Quick Actions Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upcoming Inspections (2 Cols) */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-zinc-800 shadow-xs space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">Upcoming Inspections</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Real-time scheduled viewings and host appointment updates</p>
                        </div>
                        <Link href="/tenant/inspections" className="text-xs font-bold text-blue-900 dark:text-blue-400 hover:underline flex items-center gap-1">
                            View All ({upcomingCount}) <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    
                    {upcomingInspections.length === 0 ? (
                        <div className="text-center py-10 border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl p-6">
                            <Calendar className="mx-auto h-8 w-8 text-slate-300 dark:text-zinc-700" />
                            <p className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-300">No Upcoming Inspections</p>
                            <p className="text-xs text-slate-400 mt-1">Book a verified slot on any listing to attend an inspection.</p>
                            <Button asChild size="sm" className="mt-4 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs">
                                <Link href="/browse">Browse Listings</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {upcomingInspections.map((booking) => {
                                const media = booking.property?.media?.[0];
                                const imgUrl = media?.file_path
                                    ? `/storage/${media.file_path}`
                                    : media?.path
                                    ? (media.path.startsWith('http') ? media.path : `/storage/${media.path}`)
                                    : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=300&auto=format&fit=crop';

                                return (
                                    <div
                                        key={booking.id}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-100 dark:border-zinc-800 rounded-2xl hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={imgUrl}
                                                alt={booking.property?.title || 'Property'}
                                                className="w-16 h-16 rounded-xl object-cover shrink-0"
                                            />
                                            <div className="space-y-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${
                                                        booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                                                        booking.status === 'rescheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                                                        'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                                    }`}>
                                                        {booking.status === 'confirmed' && <CheckCircle2 className="w-2.5 h-2.5" />}
                                                        {booking.status === 'rescheduled' && <CalendarClock className="w-2.5 h-2.5" />}
                                                        {booking.status === 'pending' && <Clock className="w-2.5 h-2.5" />}
                                                        {booking.status}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400">
                                                        Slot #{booking.id}
                                                    </span>
                                                </div>

                                                <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                                                    <Link href={`/browse/${booking.property_id}`} className="hover:text-blue-900 transition-colors">
                                                        {booking.property?.title}
                                                    </Link>
                                                </h4>

                                                <div className="flex items-center gap-1 text-xs font-semibold text-blue-900 dark:text-blue-400">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span>{booking.formatted_date} at {booking.start_time_12h} – {booking.end_time_12h}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="shrink-0 flex items-center gap-2">
                                            <Button asChild variant="outline" size="sm" className="rounded-xl text-xs h-8">
                                                <Link href="/tenant/inspections">Details</Link>
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Right: Quick Links & Protection */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-zinc-800 shadow-xs space-y-4">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">Escrow Assurance</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Your inspection deposits and rental payments are secured by smart escrow vaults. Funds are only transferred after in-person inspection and mutual signoff.
                        </p>
                        <div className="pt-2">
                            <Button asChild variant="outline" className="w-full rounded-xl text-xs font-bold">
                                <Link href="/escrow">View Escrow Ledger</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="bg-blue-900 text-white p-6 md:p-8 rounded-[2rem] shadow-md space-y-3">
                        <h3 className="text-lg font-black">Need a New Viewing?</h3>
                        <p className="text-xs text-blue-200 leading-relaxed">
                            Discover newly added properties with instant 12-hour inspection scheduling.
                        </p>
                        <Button asChild className="w-full bg-white text-blue-950 hover:bg-blue-50 rounded-xl text-xs font-black mt-2">
                            <Link href="/browse">Explore Properties</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

TenantDashboard.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Overview', href: '/dashboard' },
        ]}
    >
        {page}
    </AppLayout>
);