import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    AlertTriangle,
    ArrowUpRight,
    Building2,
    CheckCircle2,
    Clock,
    FileText,
    Lock,
    Search,
    ShieldAlert,
    ShieldCheck,
    UserCheck,
    Users,
    Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
    escrowMetrics: {
        totalVolume: number;
        heldAmount: number;
        releasedAmount: number;
        disputedAmount: number;
        refundedAmount: number;
    };
    propertyMetrics: {
        total: number;
        published: number;
        pendingReview: number;
        draft: number;
    };
    userMetrics: {
        total: number;
        tenants: number;
        owners: number;
        agents: number;
        admins: number;
    };
    disputeMetrics: {
        active: number;
        resolved: number;
    };
    kycMetrics: {
        pending: number;
        verified: number;
    };
    recentDisputes: any[];
    pendingProperties: any[];
    recentTransactions: any[];
};

export default function AdminDashboard({
    escrowMetrics,
    propertyMetrics,
    userMetrics,
    disputeMetrics,
    kycMetrics,
    recentDisputes,
    pendingProperties,
    recentTransactions,
}: Props) {
    const formatNaira = (amount: number) => {
        return '₦' + Number(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 0 });
    };

    return (
        <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-8">
            <Head title="Admin Overview" />

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="rounded-md bg-blue-900 px-2 py-0.5 text-xs font-black uppercase tracking-widest text-white">
                            Admin Portal
                        </span>
                        <span className="text-xs font-semibold text-slate-400">Live Escrow & Compliance Engine</span>
                    </div>
                    <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                        Platform Administration
                    </h1>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Real-time escrow volume, active dispute arbitration, property moderation, and identity verifications.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button asChild variant="outline" size="sm" className="rounded-xl border-slate-300">
                        <Link href="/admin/properties">
                            <Building2 className="mr-1.5 h-3.5 w-3.5" />
                            Review Listings ({propertyMetrics.pendingReview})
                        </Link>
                    </Button>
                    <Button asChild size="sm" className="rounded-xl bg-blue-900 text-white hover:bg-blue-800">
                        <Link href="/admin/disputes">
                            <AlertTriangle className="mr-1.5 h-3.5 w-3.5 text-amber-300" />
                            Dispute Center ({disputeMetrics.active})
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Primary KPI Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* 1. Total Escrow Volume */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Total Escrow Vault
                        </span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                            <Lock className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                            {formatNaira(escrowMetrics.totalVolume)}
                        </h3>
                        <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            {formatNaira(escrowMetrics.heldAmount)} currently held in escrow
                        </p>
                    </div>
                </div>

                {/* 2. Active Disputes */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Active Disputes
                        </span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                            {disputeMetrics.active}
                        </h3>
                        <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                            {formatNaira(escrowMetrics.disputedAmount)} in disputed deposits
                        </p>
                    </div>
                </div>

                {/* 3. Properties Queue */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Property Portfolio
                        </span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                            <Building2 className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                            {propertyMetrics.total}
                        </h3>
                        <p className="mt-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                            {propertyMetrics.pendingReview} listings awaiting approval
                        </p>
                    </div>
                </div>

                {/* 4. Platform Users */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Registered Users
                        </span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                            {userMetrics.total}
                        </h3>
                        <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                            {userMetrics.owners} Owners • {userMetrics.agents} Agents • {userMetrics.tenants} Tenants
                        </p>
                    </div>
                </div>
            </div>

            {/* Platform Sub-metrics strip */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
                <div className="border-r border-slate-200 pr-4 dark:border-zinc-700">
                    <p className="text-[11px] font-bold uppercase text-slate-500">Released to Landlords</p>
                    <p className="text-base font-black text-emerald-600 dark:text-emerald-400">{formatNaira(escrowMetrics.releasedAmount)}</p>
                </div>
                <div className="border-r border-slate-200 pr-4 dark:border-zinc-700">
                    <p className="text-[11px] font-bold uppercase text-slate-500">Refunded to Tenants</p>
                    <p className="text-base font-black text-slate-700 dark:text-slate-300">{formatNaira(escrowMetrics.refundedAmount)}</p>
                </div>
                <div className="border-r border-slate-200 pr-4 dark:border-zinc-700">
                    <p className="text-[11px] font-bold uppercase text-slate-500">Pending KYC Submissions</p>
                    <p className="text-base font-black text-amber-600 dark:text-amber-400">{kycMetrics.pending} accounts</p>
                </div>
                <div>
                    <p className="text-[11px] font-bold uppercase text-slate-500">Verified KYC Accounts</p>
                    <p className="text-base font-black text-blue-600 dark:text-blue-400">{kycMetrics.verified} accounts</p>
                </div>
            </div>

            {/* Split Content: Urgent Disputes & Pending Approvals */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* 1. Dispute Tickets Queue */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50">
                                <AlertTriangle className="h-4 w-4" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Active Dispute Tickets</h2>
                        </div>
                        <Link
                            href="/admin/disputes"
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 hover:text-blue-700 dark:text-blue-400"
                        >
                            Open Center <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {recentDisputes.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
                                No active disputes requiring arbitration. All escrows are in good standing!
                            </div>
                        ) : (
                            recentDisputes.map((dispute) => (
                                <div
                                    key={dispute.id}
                                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 transition-colors hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-800/40"
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="rounded bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800 uppercase dark:bg-rose-950 dark:text-rose-300">
                                                {dispute.type.replace('_', ' ')}
                                            </span>
                                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                                                {formatNaira(dispute.amount)}
                                            </span>
                                        </div>
                                        <p className="mt-1 truncate text-xs font-medium text-slate-700 dark:text-slate-300">
                                            {dispute.property_unit?.property?.title || 'Property #' + dispute.property_unit_id}
                                        </p>
                                        <p className="text-[11px] text-slate-400">
                                            Tenant: {dispute.tenant?.name || 'Unknown'} • Ref: {dispute.payment_reference}
                                        </p>
                                    </div>
                                    <Button asChild size="sm" variant="outline" className="ml-3 rounded-lg border-slate-300 text-xs">
                                        <Link href="/admin/disputes">Resolve</Link>
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* 2. Pending Listing Approvals Queue */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50">
                                <Clock className="h-4 w-4" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Pending Property Approvals</h2>
                        </div>
                        <Link
                            href="/admin/properties"
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 hover:text-blue-700 dark:text-blue-400"
                        >
                            All Listings <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {pendingProperties.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
                                No properties pending review.
                            </div>
                        ) : (
                            pendingProperties.map((prop) => (
                                <div
                                    key={prop.id}
                                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 transition-colors hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-800/40"
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase dark:bg-amber-950 dark:text-amber-300">
                                                Awaiting Review
                                            </span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                {prop.city}, {prop.state}
                                            </span>
                                        </div>
                                        <p className="mt-1 truncate text-xs font-bold text-slate-900 dark:text-white">
                                            {prop.title}
                                        </p>
                                        <p className="text-[11px] text-slate-400">
                                            Owner: {prop.user?.name || 'Landlord'} • {prop.type.toUpperCase()}
                                        </p>
                                    </div>
                                    <Button asChild size="sm" className="ml-3 rounded-lg bg-blue-900 text-xs text-white hover:bg-blue-800">
                                        <Link href={`/admin/properties/${prop.id}`}>Review</Link>
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Platform Escrow Activity Audit Trail */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Escrow Transactions</h2>
                        <p className="text-xs text-slate-400">Live platform payments, held caution deposits, and payouts.</p>
                    </div>
                    <Button asChild variant="outline" size="sm" className="rounded-xl border-slate-300 text-xs">
                        <Link href="/admin/transactions">View Full Ledger</Link>
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:border-zinc-800">
                                <th className="pb-3">Reference</th>
                                <th className="pb-3">Property</th>
                                <th className="pb-3">Payer / Tenant</th>
                                <th className="pb-3">Type</th>
                                <th className="pb-3">Amount</th>
                                <th className="pb-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                            {recentTransactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/40">
                                    <td className="py-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                                        {tx.payment_reference || `#TX-${tx.id}`}
                                    </td>
                                    <td className="py-3 text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                                        {tx.property_unit?.property?.title || 'Property Unit #' + tx.property_unit_id}
                                    </td>
                                    <td className="py-3 text-slate-600 dark:text-slate-400">
                                        {tx.tenant?.name || 'User #' + tx.tenant_id}
                                    </td>
                                    <td className="py-3 uppercase text-[10px] font-semibold text-slate-500">
                                        {tx.type.replace('_', ' ')}
                                    </td>
                                    <td className="py-3 font-bold text-slate-900 dark:text-white">
                                        {formatNaira(tx.amount)}
                                    </td>
                                    <td className="py-3">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                                            tx.status === 'held' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                                            tx.status === 'released' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                                            tx.status === 'disputed' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                                            'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-slate-300'
                                        }`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

AdminDashboard.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Admin', href: '/admin/dashboard' },
            { title: 'Overview', href: '/admin/dashboard' },
        ]}
    >
        {page}
    </AppLayout>
);
