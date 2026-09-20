import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    Award,
    CheckCircle2,
    Clock,
    CreditCard,
    FileCheck,
    FileText,
    ShieldCheck,
    UserCheck,
    XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type KycItem = {
    id: number;
    user_id: number;
    status: string;
    nin?: string;
    bvn?: string;
    id_type?: string;
    id_document_path?: string;
    lasrera_number?: string;
    esvarbon_license?: string;
    cac_rc_number?: string;
    created_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
};

type Props = {
    profiles: {
        data: KycItem[];
        links: any[];
        total: number;
    };
    currentStatus: string;
    counts: {
        all: number;
        pending: number;
        verified: number;
        rejected: number;
    };
};

export default function AdminKyc({ profiles, currentStatus, counts }: Props) {
    const [actioningId, setActioningId] = useState<number | null>(null);

    const handleVerify = (profileId: number, name: string) => {
        if (!confirm(`Are you sure you want to mark KYC as VERIFIED for "${name}"?`)) return;

        setActioningId(profileId);
        router.post(
            `/admin/kyc/${profileId}/verify`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setActioningId(null),
            }
        );
    };

    const handleReject = (profileId: number, name: string) => {
        if (!confirm(`Are you sure you want to REJECT the KYC submission for "${name}"?`)) return;

        setActioningId(profileId);
        router.post(
            `/admin/kyc/${profileId}/reject`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setActioningId(null),
            }
        );
    };

    const tabs = [
        { key: 'pending', label: 'Pending Review', count: counts.pending, color: 'text-amber-700 bg-amber-100 dark:bg-amber-950 dark:text-amber-300' },
        { key: 'verified', label: 'Verified Accounts', count: counts.verified, color: 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300' },
        { key: 'rejected', label: 'Rejected', count: counts.rejected, color: 'text-rose-700 bg-rose-100 dark:bg-rose-950 dark:text-rose-300' },
        { key: 'all', label: 'All Submissions', count: counts.all, color: 'text-blue-700 bg-blue-100 dark:bg-blue-950 dark:text-blue-300' },
    ];

    const maskNumber = (val?: string) => {
        if (!val) return 'Not provided';
        if (val.length <= 4) return val;
        return val.slice(0, 3) + '••••' + val.slice(-3);
    };

    return (
        <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-8">
            <Head title="KYC Verifications" />

            {/* Header */}
            <div>
                <div className="flex items-center gap-2">
                    <span className="rounded-md bg-blue-900 px-2 py-0.5 text-xs font-black uppercase tracking-widest text-white">
                        Identity Compliance
                    </span>
                    <span className="text-xs font-semibold text-slate-400">NDPR & Anti-Fraud Engine</span>
                </div>
                <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    KYC & Broker License Verifications
                </h1>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Verify government IDs, bank verification numbers, and estate agent licensing credentials.
                </p>
            </div>

            {/* Filter tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4 dark:border-zinc-800">
                {tabs.map((tab) => {
                    const isActive = currentStatus === tab.key;
                    return (
                        <Link
                            key={tab.key}
                            href={`/admin/kyc?status=${tab.key}`}
                            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
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

            {/* KYC Profiles List */}
            <div className="space-y-4">
                {profiles.data.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
                        <UserCheck className="mx-auto h-8 w-8 text-slate-300" />
                        <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">No KYC Records Found</h3>
                        <p className="mt-1 text-xs text-slate-400">There are no identity submissions in this verification category.</p>
                    </div>
                ) : (
                    profiles.data.map((profile) => {
                        const user = profile.user;
                        const isActioning = actioningId === profile.id;

                        return (
                            <div
                                key={profile.id}
                                className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
                            >
                                <div className="space-y-2.5 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-base font-bold text-slate-900 dark:text-white">
                                            {user?.name || 'Unknown User'}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            ({user?.email || 'N/A'})
                                        </span>
                                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                                            user?.role === 'owner' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                                            user?.role === 'agent' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' :
                                            'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                        }`}>
                                            {user?.role || 'tenant'}
                                        </span>
                                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                                            profile.status === 'verified' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300' :
                                            profile.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950 dark:text-amber-300' :
                                            profile.status === 'rejected' ? 'bg-rose-100 text-rose-800 border border-rose-200 dark:bg-rose-950 dark:text-rose-300' :
                                            'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-slate-300'
                                        }`}>
                                            {profile.status}
                                        </span>
                                    </div>

                                    {/* Credentials Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                        <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 dark:border-zinc-800 dark:bg-zinc-800/40">
                                            <span className="text-[10px] font-bold uppercase text-slate-400">National ID (NIN):</span>
                                            <p className="font-mono font-bold text-slate-800 dark:text-slate-200">{maskNumber(profile.nin)}</p>
                                        </div>
                                        <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 dark:border-zinc-800 dark:bg-zinc-800/40">
                                            <span className="text-[10px] font-bold uppercase text-slate-400">Bank BVN:</span>
                                            <p className="font-mono font-bold text-slate-800 dark:text-slate-200">{maskNumber(profile.bvn)}</p>
                                        </div>
                                        <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 dark:border-zinc-800 dark:bg-zinc-800/40">
                                            <span className="text-[10px] font-bold uppercase text-slate-400">ID Document:</span>
                                            <p className="font-bold text-slate-800 dark:text-slate-200 uppercase">{profile.id_type?.replace('_', ' ') || 'Government ID'}</p>
                                        </div>
                                        <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 dark:border-zinc-800 dark:bg-zinc-800/40">
                                            <span className="text-[10px] font-bold uppercase text-slate-400">License / CAC:</span>
                                            <p className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate">
                                                {profile.lasrera_number || profile.cac_rc_number || profile.esvarbon_license || 'Not required'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 lg:pl-4">
                                    {profile.status === 'pending' ? (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                disabled={isActioning}
                                                onClick={() => handleReject(profile.id, user?.name || 'User')}
                                                className="rounded-xl border-rose-200 text-xs font-bold text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 cursor-pointer"
                                            >
                                                <XCircle className="mr-1 h-3.5 w-3.5" />
                                                Reject
                                            </Button>

                                            <Button
                                                size="sm"
                                                disabled={isActioning}
                                                onClick={() => handleVerify(profile.id, user?.name || 'User')}
                                                className="rounded-xl bg-emerald-700 text-xs font-bold text-white hover:bg-emerald-800 cursor-pointer"
                                            >
                                                <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                                                Verify
                                            </Button>
                                        </>
                                    ) : (
                                        <span className="text-xs text-slate-400 font-medium">
                                            {profile.status === 'verified' ? '✓ Identity Confirmed' : 'Submission Rejected'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pagination */}
            {profiles.links && profiles.links.length > 3 && (
                <div className="flex items-center justify-center gap-1 pt-4">
                    {profiles.links.map((link: any, idx: number) => (
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

AdminKyc.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Admin', href: '/admin/dashboard' },
            { title: 'KYC Verifications', href: '/admin/kyc' },
        ]}
    >
        {page}
    </AppLayout>
);
