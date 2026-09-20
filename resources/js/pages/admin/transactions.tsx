import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    ArrowDownLeft,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    CreditCard,
    Filter,
    Lock,
    Search,
    ShieldAlert,
    Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type TransactionItem = {
    id: number;
    property_unit_id: number;
    tenant_id: number;
    amount: number;
    type: string;
    status: string;
    payment_reference?: string;
    created_at: string;
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
            user?: {
                id: number;
                name: string;
                email: string;
            };
        };
    };
};

type Props = {
    transactions: {
        data: TransactionItem[];
        links: any[];
        total: number;
    };
    summary: {
        totalVolume: number;
        heldAmount: number;
        releasedAmount: number;
        disputedAmount: number;
        refundedAmount: number;
        count: number;
    };
    filters: {
        status: string;
        type: string;
        search: string;
    };
};

export default function AdminTransactions({ transactions, summary, filters }: Props) {
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [typeFilter, setTypeFilter] = useState(filters.type || 'all');
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const formatNaira = (amount: number) => {
        return '₦' + Number(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 0 });
    };

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/transactions',
            {
                status: statusFilter,
                type: typeFilter,
                search: searchQuery,
            },
            { preserveState: true }
        );
    };

    return (
        <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-8">
            <Head title="Escrow Transactions Ledger" />

            {/* Header */}
            <div>
                <div className="flex items-center gap-2">
                    <span className="rounded-md bg-emerald-900 px-2 py-0.5 text-xs font-black uppercase tracking-widest text-white">
                        Financial Audit
                    </span>
                    <span className="text-xs font-semibold text-slate-400">Bank-Grade Escrow Ledger</span>
                </div>
                <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    Escrow Transactions Ledger
                </h1>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Comprehensive platform financial records, caution deposit vaults, and payout disbursements.
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Cumulative Volume</span>
                    <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white">{formatNaira(summary.totalVolume)}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">{summary.count} Total Transactions</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Locked in Vault</span>
                    <h3 className="mt-1 text-xl font-black text-amber-600 dark:text-amber-400">{formatNaira(summary.heldAmount)}</h3>
                    <p className="text-[11px] text-amber-600 font-medium mt-0.5">Pending inspection / sign-off</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Released to Landlords</span>
                    <h3 className="mt-1 text-xl font-black text-emerald-600 dark:text-emerald-400">{formatNaira(summary.releasedAmount)}</h3>
                    <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Disbursed on key handover</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Refunded / Disputed</span>
                    <h3 className="mt-1 text-xl font-black text-slate-700 dark:text-slate-300">{formatNaira(summary.refundedAmount + summary.disputedAmount)}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">{formatNaira(summary.disputedAmount)} currently disputed</p>
                </div>
            </div>

            {/* Filter controls */}
            <form onSubmit={handleFilterSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-200"
                    >
                        <option value="all">All Statuses</option>
                        <option value="held">Held in Escrow</option>
                        <option value="pending_release">Pending Release</option>
                        <option value="released">Released to Owner</option>
                        <option value="disputed">Disputed</option>
                        <option value="refunded">Refunded to Tenant</option>
                    </select>

                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-200"
                    >
                        <option value="all">All Types</option>
                        <option value="rent">Rent Deposit</option>
                        <option value="caution_deposit">Caution Deposit</option>
                        <option value="inspection_fee">Inspection Fee</option>
                        <option value="sale">Property Sale</option>
                    </select>
                </div>

                <div className="flex items-center gap-2 sm:w-80">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Search reference, tenant, property..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-9 rounded-xl pl-9 text-xs border-slate-200 dark:border-zinc-700"
                        />
                    </div>
                    <Button type="submit" size="sm" variant="secondary" className="rounded-xl text-xs">
                        Filter
                    </Button>
                </div>
            </form>

            {/* Transactions Table */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:border-zinc-800">
                                <th className="pb-3">Reference / Date</th>
                                <th className="pb-3">Property</th>
                                <th className="pb-3">Tenant (Payer)</th>
                                <th className="pb-3">Owner (Recipient)</th>
                                <th className="pb-3">Type</th>
                                <th className="pb-3">Amount</th>
                                <th className="pb-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                            {transactions.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-slate-400">
                                        No escrow transactions found matching the selected filters.
                                    </td>
                                </tr>
                            ) : (
                                transactions.data.map((tx) => {
                                    const prop = tx.property_unit?.property;
                                    const landlord = prop?.user;

                                    return (
                                        <tr key={tx.id} className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/40">
                                            <td className="py-3.5 font-mono">
                                                <p className="font-bold text-slate-800 dark:text-slate-200">
                                                    {tx.payment_reference || `#TX-${tx.id}`}
                                                </p>
                                                <p className="text-[10px] text-slate-400">
                                                    {new Date(tx.created_at).toLocaleDateString('en-GB')}
                                                </p>
                                            </td>
                                            <td className="py-3.5 font-medium text-slate-800 dark:text-slate-200 max-w-[180px] truncate">
                                                {prop?.title || 'Property Unit #' + tx.property_unit_id}
                                            </td>
                                            <td className="py-3.5 text-slate-600 dark:text-slate-400">
                                                <p className="font-semibold text-slate-800 dark:text-slate-200">{tx.tenant?.name || 'User #' + tx.tenant_id}</p>
                                                <p className="text-[10px] text-slate-400 truncate">{tx.tenant?.email}</p>
                                            </td>
                                            <td className="py-3.5 text-slate-600 dark:text-slate-400">
                                                <p className="font-semibold text-slate-800 dark:text-slate-200">{landlord?.name || 'N/A'}</p>
                                                <p className="text-[10px] text-slate-400 truncate">{landlord?.email}</p>
                                            </td>
                                            <td className="py-3.5 uppercase text-[10px] font-bold text-slate-500">
                                                {tx.type.replace('_', ' ')}
                                            </td>
                                            <td className="py-3.5 font-black text-slate-900 dark:text-white">
                                                {formatNaira(tx.amount)}
                                            </td>
                                            <td className="py-3.5">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                                                    tx.status === 'held' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                                                    tx.status === 'released' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                                                    tx.status === 'disputed' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                                                    'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-slate-300'
                                                }`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {transactions.links && transactions.links.length > 3 && (
                    <div className="flex items-center justify-center gap-1 pt-6 border-t border-slate-100 dark:border-zinc-800 mt-4">
                        {transactions.links.map((link: any, idx: number) => (
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
        </div>
    );
}

AdminTransactions.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Admin', href: '/admin/dashboard' },
            { title: 'Escrow Ledger', href: '/admin/transactions' },
        ]}
    >
        {page}
    </AppLayout>
);
