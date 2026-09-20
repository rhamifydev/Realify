import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    AlertTriangle,
    CheckCircle2,
    Clock,
    Home,
    RotateCcw,
    Scale,
    ShieldAlert,
    User,
    Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type Dispute = {
    id: number;
    amount: number;
    type: string;
    status: string;
    payment_reference: string;
    created_at: string;
    property_unit_id: number;
    tenant_id: number;
    tenant?: {
        id: number;
        name: string;
        email: string;
    };
    property_unit?: {
        id: number;
        property?: {
            id: number;
            title: string;
            address: string;
            city: string;
            user?: {
                id: number;
                name: string;
                email: string;
            };
        };
    };
};

type Props = {
    disputes: {
        data: Dispute[];
        links: any[];
        total: number;
    };
    currentStatus: string;
    counts: {
        disputed: number;
        released: number;
        refunded: number;
        all: number;
    };
};

export default function DisputesIndex({ disputes, currentStatus, counts }: Props) {
    const [resolvingId, setResolvingId] = useState<number | null>(null);
    const [resolutionNotes, setResolutionNotes] = useState<Record<number, string>>({});

    const formatNaira = (amount: number) => {
        return '₦' + Number(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 0 });
    };

    const handleResolve = (disputeId: number, resolution: 'released' | 'refunded') => {
        const confirmMsg =
            resolution === 'released'
                ? 'Are you sure you want to release these escrow funds to the Property Owner?'
                : 'Are you sure you want to process a full refund back to the Tenant?';

        if (!confirm(confirmMsg)) return;

        setResolvingId(disputeId);
        router.post(
            `/admin/disputes/${disputeId}/resolve`,
            {
                resolution,
                notes: resolutionNotes[disputeId] || '',
            },
            {
                preserveScroll: true,
                onFinish: () => setResolvingId(null),
            }
        );
    };

    const tabs = [
        { key: 'disputed', label: 'Active Disputes', count: counts.disputed, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' },
        { key: 'released', label: 'Released to Owners', count: counts.released, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
        { key: 'refunded', label: 'Refunded to Tenants', count: counts.refunded, color: 'text-slate-600 bg-slate-100 dark:bg-zinc-800' },
        { key: 'all', label: 'All Cases', count: counts.all, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40' },
    ];

    return (
        <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-8">
            <Head title="Dispute Resolution Center" />

            {/* Header */}
            <div>
                <div className="flex items-center gap-2">
                    <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-xs font-black uppercase tracking-widest text-amber-600 border border-amber-500/20">
                        Arbitration Portal
                    </span>
                    <span className="text-xs font-semibold text-slate-400">Escrow Guarantee Engine</span>
                </div>
                <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    Escrow Dispute Resolution
                </h1>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Arbitrate property inspection defects, rent refund claims, and release funds securely.
                </p>
            </div>

            {/* Status Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4 dark:border-zinc-800">
                {tabs.map((tab) => {
                    const isActive = currentStatus === tab.key;
                    return (
                        <Link
                            key={tab.key}
                            href={`/admin/disputes?status=${tab.key}`}
                            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                                isActive
                                    ? 'bg-blue-900 text-white shadow-md shadow-blue-900/15'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-300'
                            }`}
                        >
                            <span>{tab.label}</span>
                            <span className={`rounded-full px-2 py-0.2 text-[10px] font-extrabold ${isActive ? 'bg-white/20 text-white' : tab.color}`}>
                                {tab.count}
                            </span>
                        </Link>
                    );
                })}
            </div>

            {/* Disputes List */}
            <div className="space-y-4">
                {disputes.data.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">No Disputes in this View</h3>
                        <p className="mt-1 text-xs text-slate-400">All escrow transactions in this filter category have been resolved or are in good standing.</p>
                    </div>
                ) : (
                    disputes.data.map((dispute) => {
                        const property = dispute.property_unit?.property;
                        const landlord = property?.user;
                        const tenant = dispute.tenant;
                        const isResolving = resolvingId === dispute.id;

                        return (
                            <div
                                key={dispute.id}
                                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all dark:border-zinc-800 dark:bg-zinc-900"
                            >
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    {/* Left: Case details */}
                                    <div className="space-y-3 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="rounded-md bg-blue-900 px-2 py-0.5 text-xs font-mono font-bold text-white">
                                                Case #{dispute.id}
                                            </span>
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                                {dispute.type.replace('_', ' ')}
                                            </span>
                                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${
                                                dispute.status === 'disputed'
                                                    ? 'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950 dark:text-amber-300'
                                                    : dispute.status === 'released'
                                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                                                    : 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-zinc-800 dark:text-slate-300'
                                            }`}>
                                                {dispute.status}
                                            </span>
                                            <span className="text-xs text-slate-400 font-mono">
                                                Ref: {dispute.payment_reference}
                                            </span>
                                        </div>

                                        {/* Amount Banner */}
                                        <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2 border border-slate-100 dark:bg-zinc-800/60 dark:border-zinc-700">
                                            <span className="text-xs text-slate-500">Disputed Escrow Deposit:</span>
                                            <span className="text-xl font-black text-slate-900 dark:text-white">
                                                {formatNaira(dispute.amount)}
                                            </span>
                                        </div>

                                        {/* Parties involved */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                            {/* Property & Landlord */}
                                            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/30">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                                                    <Home className="h-3.5 w-3.5 text-blue-600" />
                                                    <span>Property & Landlord</span>
                                                </div>
                                                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                                    {property?.title || 'Unknown Property'}
                                                </p>
                                                <p className="text-[11px] text-slate-500 truncate">
                                                    {property?.address}, {property?.city}
                                                </p>
                                                <p className="text-[11px] text-slate-400 mt-1">
                                                    Owner: {landlord?.name || 'N/A'} ({landlord?.email || 'N/A'})
                                                </p>
                                            </div>

                                            {/* Tenant */}
                                            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/30">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                                                    <User className="h-3.5 w-3.5 text-emerald-600" />
                                                    <span>Tenant Claimant</span>
                                                </div>
                                                <p className="text-xs font-bold text-slate-900 dark:text-white">
                                                    {tenant?.name || 'Unknown Tenant'}
                                                </p>
                                                <p className="text-[11px] text-slate-500 truncate">
                                                    {tenant?.email || 'N/A'}
                                                </p>
                                                <p className="text-[10px] text-emerald-600 font-semibold mt-1">
                                                    ✓ Verified Identity via Escrow System
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Actions */}
                                    {dispute.status === 'disputed' && (
                                        <div className="lg:w-80 rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 space-y-3 dark:border-amber-900/40 dark:bg-amber-950/20">
                                            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
                                                <Scale className="h-4 w-4 text-amber-600" />
                                                <span>Administrative Ruling</span>
                                            </div>

                                            <div>
                                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                                    Arbitration Notes (Optional)
                                                </label>
                                                <textarea
                                                    rows={2}
                                                    placeholder="Specify reason for ruling..."
                                                    value={resolutionNotes[dispute.id] || ''}
                                                    onChange={(e) =>
                                                        setResolutionNotes({
                                                            ...resolutionNotes,
                                                            [dispute.id]: e.target.value,
                                                        })
                                                    }
                                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs focus:border-blue-700 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 pt-1">
                                                <Button
                                                    size="sm"
                                                    disabled={isResolving}
                                                    onClick={() => handleResolve(dispute.id, 'refunded')}
                                                    className="w-full rounded-xl bg-rose-700 text-xs font-bold text-white hover:bg-rose-800 cursor-pointer"
                                                >
                                                    <RotateCcw className="mr-1 h-3.5 w-3.5" />
                                                    Refund Tenant
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    disabled={isResolving}
                                                    onClick={() => handleResolve(dispute.id, 'released')}
                                                    className="w-full rounded-xl bg-emerald-700 text-xs font-bold text-white hover:bg-emerald-800 cursor-pointer"
                                                >
                                                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                                                    Release Owner
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {dispute.status !== 'disputed' && (
                                        <div className="rounded-xl bg-slate-50 p-4 text-center dark:bg-zinc-800/60 lg:w-48">
                                            <CheckCircle2 className="mx-auto h-5 w-5 text-emerald-600" />
                                            <p className="mt-1 text-xs font-bold text-slate-700 dark:text-slate-300">Case Concluded</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">Dispute resolved as {dispute.status}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pagination */}
            {disputes.links && disputes.links.length > 3 && (
                <div className="flex items-center justify-center gap-1 pt-4">
                    {disputes.links.map((link: any, idx: number) => (
                        <Link
                            key={idx}
                            href={link.url || '#'}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                link.active
                                    ? 'bg-blue-900 text-white'
                                    : link.url
                                    ? 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800'
                                    : 'cursor-not-allowed opacity-40'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

DisputesIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Admin', href: '/admin/dashboard' },
            { title: 'Disputes', href: '/admin/disputes' },
        ]}
    >
        {page}
    </AppLayout>
);
