import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    Building2,
    CheckCircle2,
    Clock,
    ExternalLink,
    Filter,
    Home,
    MapPin,
    Search,
    User,
    XCircle,
    Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type PropertyItem = {
    id: number;
    title: string;
    description: string;
    address: string;
    city: string;
    state: string;
    type: string;
    structure_type: string;
    status: string;
    current_stage: number;
    created_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    units?: any[];
    media?: any[];
};

type Props = {
    properties: {
        data: PropertyItem[];
        links: any[];
        total: number;
    };
    currentStatus: string;
    search: string;
    counts: {
        all: number;
        pending_review: number;
        published: number;
        draft: number;
    };
};

export default function AdminProperties({ properties, currentStatus, search, counts }: Props) {
    const [searchTerm, setSearchTerm] = useState(search || '');
    const [actioningId, setActioningId] = useState<number | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/properties',
            {
                status: currentStatus,
                search: searchTerm,
            },
            { preserveState: true }
        );
    };

    const handleApprove = (propertyId: number, title: string) => {
        if (!confirm(`Are you sure you want to approve and publish "${title}"?`)) return;

        setActioningId(propertyId);
        router.post(
            `/admin/properties/${propertyId}/approve`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setActioningId(null),
            }
        );
    };

    const handleReject = (propertyId: number, title: string) => {
        const reason = prompt(`Reason for rejecting "${title}" and returning to draft:`);
        if (reason === null) return;

        setActioningId(propertyId);
        router.post(
            `/admin/properties/${propertyId}/reject`,
            { reason },
            {
                preserveScroll: true,
                onFinish: () => setActioningId(null),
            }
        );
    };

    const tabs = [
        { key: 'pending_review', label: 'Awaiting Approval', count: counts.pending_review, color: 'text-amber-700 bg-amber-100 dark:bg-amber-950 dark:text-amber-300' },
        { key: 'published', label: 'Published Live', count: counts.published, color: 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300' },
        { key: 'draft', label: 'Drafts', count: counts.draft, color: 'text-slate-600 bg-slate-100 dark:bg-zinc-800' },
        { key: 'all', label: 'All Properties', count: counts.all, color: 'text-blue-700 bg-blue-100 dark:bg-blue-950 dark:text-blue-300' },
    ];

    const formatNaira = (amount: number) => {
        return '₦' + Number(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 0 });
    };

    return (
        <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-8">
            <Head title="Property Approvals" />

            {/* Header */}
            <div>
                <div className="flex items-center gap-2">
                    <span className="rounded-md bg-blue-900 px-2 py-0.5 text-xs font-black uppercase tracking-widest text-white">
                        Listing Moderation
                    </span>
                    <span className="text-xs font-semibold text-slate-400">Title & Deed Verification Engine</span>
                </div>
                <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    Property Approvals & Inventory
                </h1>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Review and verify property listings submitted by landlords before publishing to the public marketplace.
                </p>
            </div>

            {/* Search & Tabs bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-zinc-800">
                <div className="flex flex-wrap items-center gap-2">
                    {tabs.map((tab) => {
                        const isActive = currentStatus === tab.key;
                        return (
                            <Link
                                key={tab.key}
                                href={`/admin/properties?status=${tab.key}&search=${searchTerm}`}
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

                <form onSubmit={handleSearch} className="flex items-center gap-2 sm:w-72">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Search title, city, owner..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-9 rounded-xl pl-9 text-xs border-slate-200 dark:border-zinc-700"
                        />
                    </div>
                    <Button type="submit" size="sm" variant="secondary" className="rounded-xl text-xs">
                        Filter
                    </Button>
                </form>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {properties.data.length === 0 ? (
                    <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
                        <Home className="mx-auto h-8 w-8 text-slate-300" />
                        <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">No Properties Found</h3>
                        <p className="mt-1 text-xs text-slate-400">There are no properties matching this status filter or search query.</p>
                    </div>
                ) : (
                    properties.data.map((prop) => {
                        const unit = prop.units?.[0];
                        const price = unit?.rent_price || unit?.sale_price || 0;
                        const isActioning = actioningId === prop.id;

                        return (
                            <div
                                key={prop.id}
                                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                            prop.status === 'published' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                                            prop.status === 'pending_review' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                                            'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-slate-300'
                                        }`}>
                                            {prop.status.replace('_', ' ')}
                                        </span>
                                        <span className="text-[11px] font-semibold text-slate-400 uppercase">
                                            {prop.type.replace('_', ' ')}
                                        </span>
                                    </div>

                                    <div>
                                        <Link
                                            href={`/admin/properties/${prop.id}`}
                                            className="text-base font-bold text-slate-900 hover:text-blue-900 dark:text-white dark:hover:text-blue-400 line-clamp-1 transition-colors"
                                        >
                                            {prop.title}
                                        </Link>
                                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 line-clamp-1">
                                            <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                                            {prop.address}, {prop.city}
                                        </p>
                                    </div>

                                    {/* Pricing & Units */}
                                    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 dark:border-zinc-800 dark:bg-zinc-800/40 flex items-center justify-between text-xs">
                                        <div>
                                            <span className="text-[10px] uppercase font-bold text-slate-400">Price:</span>
                                            <p className="font-extrabold text-slate-900 dark:text-white">
                                                {price > 0 ? formatNaira(price) : 'Price unlisted'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] uppercase font-bold text-slate-400">Layout:</span>
                                            <p className="font-semibold text-slate-700 dark:text-slate-300">
                                                {unit ? `${unit.bedrooms || 0} Bed • ${unit.bathrooms || 0} Bath` : 'Multi Unit'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Landlord details */}
                                    <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
                                        <User className="h-3.5 w-3.5 text-slate-400" />
                                        <span className="truncate">Owner: <strong>{prop.user?.name || 'Unassigned'}</strong></span>
                                    </div>
                                </div>

                                {/* Bottom Actions */}
                                <div className="mt-5 border-t border-slate-100 pt-3.5 dark:border-zinc-800">
                                    {prop.status === 'pending_review' ? (
                                        <div className="space-y-2">
                                            <Button
                                                asChild
                                                size="sm"
                                                className="w-full rounded-xl bg-blue-900 text-xs font-bold text-white hover:bg-blue-800 cursor-pointer shadow-xs"
                                            >
                                                <Link href={`/admin/properties/${prop.id}`}>
                                                    <Eye className="mr-1.5 h-3.5 w-3.5" />
                                                    Inspect & Review Details
                                                </Link>
                                            </Button>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={isActioning}
                                                    onClick={() => handleReject(prop.id, prop.title)}
                                                    className="w-full rounded-xl border-rose-200 text-xs font-bold text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 cursor-pointer"
                                                >
                                                    <XCircle className="mr-1 h-3.5 w-3.5" />
                                                    Reject
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    disabled={isActioning}
                                                    onClick={() => handleApprove(prop.id, prop.title)}
                                                    className="w-full rounded-xl bg-emerald-700 text-xs font-bold text-white hover:bg-emerald-800 cursor-pointer"
                                                >
                                                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                                                    Publish
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between gap-2">
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="outline"
                                                className="rounded-xl text-xs font-semibold text-blue-900 dark:text-blue-400"
                                            >
                                                <Link href={`/admin/properties/${prop.id}`}>
                                                    <Eye className="mr-1 h-3.5 w-3.5" />
                                                    Inspect Details
                                                </Link>
                                            </Button>

                                            {prop.status === 'published' ? (
                                                <div className="flex items-center gap-1.5">
                                                    <Button asChild size="sm" variant="ghost" className="text-xs text-slate-500 hover:text-slate-900">
                                                        <Link href={`/browse/${prop.id}`} target="_blank">
                                                            <ExternalLink className="h-3.5 w-3.5" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        disabled={isActioning}
                                                        onClick={() => handleReject(prop.id, prop.title)}
                                                        className="rounded-xl text-xs text-rose-600 hover:bg-rose-50 border-rose-200 dark:border-rose-950"
                                                    >
                                                        Unpublish
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    disabled={isActioning}
                                                    onClick={() => handleApprove(prop.id, prop.title)}
                                                    className="rounded-xl bg-emerald-700 text-xs font-bold text-white hover:bg-emerald-800"
                                                >
                                                    Publish
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pagination */}
            {properties.links && properties.links.length > 3 && (
                <div className="flex items-center justify-center gap-1 pt-4">
                    {properties.links.map((link: any, idx: number) => (
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

AdminProperties.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Admin', href: '/admin/dashboard' },
            { title: 'Property Approvals', href: '/admin/properties' },
        ]}
    >
        {page}
    </AppLayout>
);
