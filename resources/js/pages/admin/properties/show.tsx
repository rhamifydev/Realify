import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    Building2,
    CheckCircle2,
    Clock,
    ExternalLink,
    MapPin,
    User,
    XCircle,
    ArrowLeft,
    ShieldCheck,
    AlertTriangle,
    FileText,
    Bed,
    Bath,
    Layers,
    Eye,
    Shield,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Maximize2,
    X,
    Compass,
    Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type UnitItem = {
    id: number;
    title?: string;
    bedrooms?: number;
    bathrooms?: number;
    rent_price?: number;
    sale_price?: number;
    caution_deposit?: number;
    agency_fee?: number;
    status: string;
};

type MediaItem = {
    id: number;
    path: string;
    file_path?: string;
    type?: string;
    is_primary?: boolean;
};

type KycProfile = {
    id: number;
    status: string;
    id_type?: string;
    cac_rc_number?: string;
    lasrera_number?: string;
    esvarbon_license?: string;
    created_at?: string;
};

type PropertyOwner = {
    id: number;
    name: string;
    email: string;
    created_at?: string;
    kyc_profile?: KycProfile;
};

type PropertyDetail = {
    id: number;
    title: string;
    description: string;
    address: string;
    city: string;
    state: string;
    latitude?: number;
    longitude?: number;
    type: string;
    category?: string;
    structure_type: string;
    status: string;
    current_stage: number;
    title_type?: string;
    land_size?: string;
    ownership_document_path?: string;
    created_at: string;
    updated_at: string;
    user?: PropertyOwner;
    units?: UnitItem[];
    media?: MediaItem[];
};

type Props = {
    property: PropertyDetail;
};

export default function AdminPropertyShow({ property }: Props) {
    const [actioning, setActioning] = useState(false);
    const [activeImageIdx, setActiveImageIdx] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    // Fallback images if property has no uploaded media
    const fallbackImages = [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
    ];

    const mediaList = (property.media || [])
        .map((m) => {
            const rawPath = m.file_path || m.path;
            if (!rawPath) return null;
            return rawPath.startsWith('http') ? rawPath : `/storage/${rawPath}`;
        })
        .filter(Boolean) as string[];

    const images = mediaList.length > 0 ? mediaList : fallbackImages;

    const formatNaira = (amount?: number) => {
        return '₦' + Number(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 0 });
    };

    const handleApprove = () => {
        if (!confirm(`Are you sure you want to approve and publish "${property.title}" to the public marketplace?`)) {
            return;
        }

        setActioning(true);
        router.post(
            `/admin/properties/${property.id}/approve`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setActioning(false),
            }
        );
    };

    const handleReject = () => {
        const reason = prompt(`Specify the reason for returning "${property.title}" to draft:`);
        if (reason === null) return;

        setActioning(true);
        router.post(
            `/admin/properties/${property.id}/reject`,
            { reason },
            {
                preserveScroll: true,
                onFinish: () => setActioning(false),
            }
        );
    };

    const kycProfile = property.user?.kyc_profile;
    const isKycVerified = kycProfile?.status === 'verified';

    return (
        <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-8">
            <Head title={`Review: ${property.title}`} />

            {/* Top Navigation Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <Button asChild variant="outline" size="sm" className="rounded-xl border-slate-200 dark:border-zinc-800">
                        <Link href="/admin/properties">
                            <ArrowLeft className="mr-1.5 h-4 w-4" />
                            Back to Approvals
                        </Link>
                    </Button>
                    <div className="h-4 w-px bg-slate-200 dark:bg-zinc-800" />
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                        property.status === 'published' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        property.status === 'pending_review' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse' :
                        'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-slate-300'
                    }`}>
                        <span className={`h-2 w-2 rounded-full ${
                            property.status === 'published' ? 'bg-emerald-500' :
                            property.status === 'pending_review' ? 'bg-amber-500' : 'bg-slate-400'
                        }`} />
                        {property.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Stage {property.current_stage || 1} / 5
                    </span>
                </div>

                {/* Quick actions on header */}
                <div className="flex items-center gap-2">
                    {property.status === 'published' ? (
                        <>
                            <Button asChild variant="outline" size="sm" className="rounded-xl text-blue-900 dark:text-blue-400">
                                <Link href={`/browse/${property.id}`}>
                                    <ExternalLink className="mr-1.5 h-4 w-4" />
                                    View Marketplace Listing
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={actioning}
                                onClick={handleReject}
                                className="rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400"
                            >
                                <XCircle className="mr-1.5 h-4 w-4" />
                                Unpublish to Draft
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={actioning}
                                onClick={handleReject}
                                className="rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400"
                            >
                                <XCircle className="mr-1.5 h-4 w-4" />
                                Reject to Draft
                            </Button>
                            <Button
                                size="sm"
                                disabled={actioning}
                                onClick={handleApprove}
                                className="rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 shadow-md shadow-emerald-700/20"
                            >
                                <CheckCircle2 className="mr-1.5 h-4 w-4" />
                                Approve & Publish Live
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Verification Alert Banner if Pending */}
            {property.status === 'pending_review' && (
                <div className="flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300">
                            Property Pending Admin Inspection
                        </h4>
                        <p className="mt-0.5 text-xs text-amber-700/90 dark:text-amber-400/90">
                            Carefully inspect media clarity, address location, title deeds, and landlord KYC identity before granting approval. Once published, this property will be visible to all prospective tenants and investors across Nigeria.
                        </p>
                    </div>
                </div>
            )}

            {/* Main Layout: 2 Columns */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Left 2 Columns: Media & Property Specs */}
                <div className="space-y-8 lg:col-span-2">
                    {/* Header info */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-700 dark:bg-zinc-800 dark:text-slate-300">
                                {property.type?.replace('_', ' ')}
                            </span>
                            <span>•</span>
                            <span className="rounded-md bg-blue-50 px-2.5 py-1 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                {property.category || 'Residential'}
                            </span>
                            <span>•</span>
                            <span>{property.structure_type?.replace('_', ' ')}</span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                            {property.title}
                        </h1>

                        <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                            <MapPin className="h-4 w-4 shrink-0 text-rose-500" />
                            {property.address}, {property.city}, {property.state}
                        </p>

                        {/* Interactive Photo Gallery */}
                        <div className="mt-6 space-y-3">
                            <div className="relative aspect-16/9 w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-zinc-800 group">
                                <img
                                    src={images[activeImageIdx]}
                                    alt={`Property media ${activeImageIdx + 1}`}
                                    className="h-full w-full object-cover transition-all duration-300 group-hover:scale-102"
                                />

                                {/* Lightbox Trigger */}
                                <button
                                    onClick={() => setLightboxOpen(true)}
                                    className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-xl bg-black/70 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md transition-all hover:bg-black"
                                >
                                    <Maximize2 className="h-3.5 w-3.5" />
                                    Inspect Fullscreen ({activeImageIdx + 1}/{images.length})
                                </button>

                                {/* Navigation Chevrons */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-800 shadow-md backdrop-blur-md transition-all hover:bg-white dark:bg-zinc-900/80 dark:text-white"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-800 shadow-md backdrop-blur-md transition-all hover:bg-white dark:bg-zinc-900/80 dark:text-white"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Thumbnails Row */}
                            {images.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImageIdx(idx)}
                                            className={`relative h-18 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                                                activeImageIdx === idx
                                                    ? 'border-blue-900 ring-2 ring-blue-900/30'
                                                    : 'border-transparent opacity-70 hover:opacity-100'
                                            }`}
                                        >
                                            <img src={img} alt={`Thumb ${idx + 1}`} className="h-full w-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Property Description */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-zinc-800">
                            <FileText className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                Description & Property Overview
                            </h2>
                        </div>
                        <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line">
                            {property.description || 'No detailed description provided by the landlord.'}
                        </div>
                    </div>

                    {/* Specifications & Legal Details */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-zinc-800">
                            <Shield className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                Specifications & Title Documentation
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Title Deed Type</span>
                                <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                                    {property.title_type || "Governor's Consent / C of O"}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Land Size / Area</span>
                                <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                                    {property.land_size || 'Standard Plot'}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Structure Type</span>
                                <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white capitalize">
                                    {property.structure_type?.replace('_', ' ') || 'Single Unit'}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">City / State</span>
                                <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                                    {property.city}, {property.state}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Coordinates</span>
                                <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                                    {property.latitude && property.longitude ? (
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                                        >
                                            <Compass className="h-3.5 w-3.5" />
                                            {property.latitude.toFixed(4)}, {property.longitude.toFixed(4)}
                                        </a>
                                    ) : (
                                        'Not Geotagged'
                                    )}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Date Listed</span>
                                <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                                    {new Date(property.created_at).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>

                        {property.ownership_document_path && (
                            <div className="mt-4 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">Ownership Certificate / Deed Document</p>
                                        <p className="text-[11px] text-slate-500">Provided by owner for title inspection</p>
                                    </div>
                                </div>
                                <Button asChild size="sm" variant="outline" className="rounded-lg text-xs">
                                    <a href={`/storage/${property.ownership_document_path}`} target="_blank" rel="noreferrer">
                                        <Eye className="mr-1 h-3.5 w-3.5" /> View Deed
                                    </a>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Units & Pricing Breakdown */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-zinc-800">
                            <div className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                    Configured Units & Pricing Schedule
                                </h2>
                            </div>
                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 dark:bg-zinc-800 dark:text-slate-300">
                                {property.units?.length || 0} {property.units?.length === 1 ? 'Unit' : 'Units'}
                            </span>
                        </div>

                        {(!property.units || property.units.length === 0) ? (
                            <p className="text-xs text-slate-400 italic py-4 text-center">No unit configuration added yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {property.units.map((unit, index) => {
                                    const unitPrice = unit.rent_price || unit.sale_price || 0;
                                    return (
                                        <div
                                            key={unit.id}
                                            className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-800/40"
                                        >
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                                            {unit.title || `Unit #${index + 1}`}
                                                        </h3>
                                                        <span className={`rounded px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                                                            unit.status === 'available' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-700 dark:bg-zinc-700'
                                                        }`}>
                                                            {unit.status}
                                                        </span>
                                                    </div>
                                                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                                                        <span className="inline-flex items-center gap-1">
                                                            <Bed className="h-3.5 w-3.5 text-slate-400" />
                                                            {unit.bedrooms || 0} Beds
                                                        </span>
                                                        <span>•</span>
                                                        <span className="inline-flex items-center gap-1">
                                                            <Bath className="h-3.5 w-3.5 text-slate-400" />
                                                            {unit.bathrooms || 0} Baths
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 text-right sm:flex sm:items-center sm:gap-6">
                                                    <div>
                                                        <span className="text-[10px] uppercase font-bold text-slate-400">
                                                            {unit.rent_price ? 'Annual Rent' : 'Selling Price'}
                                                        </span>
                                                        <p className="text-sm font-black text-slate-900 dark:text-white">
                                                            {formatNaira(unitPrice)}
                                                        </p>
                                                    </div>

                                                    {unit.caution_deposit !== undefined && (
                                                        <div>
                                                            <span className="text-[10px] uppercase font-bold text-slate-400">Caution Deposit</span>
                                                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                                {formatNaira(unit.caution_deposit)}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {unit.agency_fee !== undefined && (
                                                        <div>
                                                            <span className="text-[10px] uppercase font-bold text-slate-400">Agency Fee</span>
                                                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                                {formatNaira(unit.agency_fee)}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Landlord KYC & Moderation Ruling Box */}
                <div className="space-y-6">
                    {/* Moderation Decision Card */}
                    <div className="rounded-3xl border-2 border-blue-900/20 bg-white p-6 shadow-md dark:border-blue-900/40 dark:bg-zinc-900 sticky top-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-zinc-800">
                            <h3 className="text-base font-black text-slate-900 dark:text-white">
                                Listing Ruling
                            </h3>
                            <span className="text-xs font-semibold text-slate-400">Admin Action</span>
                        </div>

                        <div className="mt-4 space-y-3">
                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/40 space-y-2 text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">Current Status</span>
                                    <span className="font-bold text-slate-900 dark:text-white capitalize">
                                        {property.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">Landlord KYC</span>
                                    <span className={`font-bold ${isKycVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {kycProfile?.status?.toUpperCase() || 'NOT SUBMITTED'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">Media Count</span>
                                    <span className="font-bold text-slate-900 dark:text-white">
                                        {images.length} photos
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {property.status === 'pending_review' ? (
                                <div className="space-y-2 pt-2">
                                    <Button
                                        onClick={handleApprove}
                                        disabled={actioning}
                                        className="w-full rounded-xl bg-emerald-700 py-6 text-sm font-black text-white hover:bg-emerald-800 shadow-md shadow-emerald-700/25 cursor-pointer"
                                    >
                                        <CheckCircle2 className="mr-2 h-5 w-5" />
                                        Publish to Marketplace
                                    </Button>

                                    <Button
                                        onClick={handleReject}
                                        disabled={actioning}
                                        variant="outline"
                                        className="w-full rounded-xl border-rose-200 py-5 text-xs font-bold text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 cursor-pointer"
                                    >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Reject & Return to Draft
                                    </Button>
                                </div>
                            ) : property.status === 'published' ? (
                                <div className="space-y-2 pt-2">
                                    <Button asChild className="w-full rounded-xl bg-blue-900 py-6 text-sm font-bold text-white hover:bg-blue-800">
                                        <Link href={`/browse/${property.id}`}>
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            View Live Public Page
                                        </Link>
                                    </Button>
                                    <Button
                                        onClick={handleReject}
                                        disabled={actioning}
                                        variant="outline"
                                        className="w-full rounded-xl border-slate-200 text-xs font-bold text-slate-600 hover:text-rose-600 dark:border-zinc-800 cursor-pointer"
                                    >
                                        Unpublish Listing
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-2 pt-2">
                                    <Button
                                        onClick={handleApprove}
                                        disabled={actioning}
                                        className="w-full rounded-xl bg-emerald-700 py-6 text-sm font-black text-white hover:bg-emerald-800"
                                    >
                                        <CheckCircle2 className="mr-2 h-5 w-5" />
                                        Publish Directly
                                    </Button>
                                </div>
                            )}

                            {/* Verification Checklist */}
                            <div className="mt-6 border-t border-slate-100 pt-4 dark:border-zinc-800">
                                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                                    Pre-Approval Checklist
                                </h4>
                                <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                                    <li className="flex items-center gap-2">
                                        <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${images.length > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                                            <Check className="h-2.5 w-2.5" />
                                        </div>
                                        <span>Uploaded real property photos</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${isKycVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                            <Check className="h-2.5 w-2.5" />
                                        </div>
                                        <span>Landlord verified via KYC / CAC</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${property.units && property.units.length > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                                            <Check className="h-2.5 w-2.5" />
                                        </div>
                                        <span>Unit pricing & caution deposit defined</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${property.address ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                                            <Check className="h-2.5 w-2.5" />
                                        </div>
                                        <span>Physical street address confirmed</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Landlord Profile Card */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-zinc-800">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-blue-900 dark:text-blue-400" />
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Landlord / Creator
                                </h3>
                            </div>
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                isKycVerified ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}>
                                <ShieldCheck className="h-3 w-3" />
                                {kycProfile?.status || 'unverified'}
                            </span>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400">Full Name</span>
                                <p className="font-bold text-slate-900 dark:text-white text-sm">
                                    {property.user?.name || 'Unknown User'}
                                </p>
                            </div>

                            <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400">Email</span>
                                <p className="font-semibold text-slate-700 dark:text-slate-300">
                                    {property.user?.email || 'N/A'}
                                </p>
                            </div>

                            {kycProfile && (
                                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/40 space-y-2">
                                    <p className="text-[11px] font-bold uppercase text-slate-500">Professional Credentials</p>
                                    {kycProfile.cac_rc_number && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500">CAC RC:</span>
                                            <span className="font-semibold text-slate-800 dark:text-slate-200">{kycProfile.cac_rc_number}</span>
                                        </div>
                                    )}
                                    {kycProfile.lasrera_number && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500">LASRERA:</span>
                                            <span className="font-semibold text-slate-800 dark:text-slate-200">{kycProfile.lasrera_number}</span>
                                        </div>
                                    )}
                                    {kycProfile.esvarbon_license && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500">ESVARBON:</span>
                                            <span className="font-semibold text-slate-800 dark:text-slate-200">{kycProfile.esvarbon_license}</span>
                                        </div>
                                    )}
                                    {kycProfile.id_type && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500">ID Type:</span>
                                            <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{kycProfile.id_type}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <Button asChild variant="ghost" size="sm" className="w-full text-xs text-blue-900 dark:text-blue-400">
                                <Link href="/admin/kyc">
                                    <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                                    View Full KYC Approvals
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox Modal */}
            {lightboxOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
                    <button
                        onClick={() => setLightboxOpen(false)}
                        className="absolute right-6 top-6 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-all"
                    >
                        <X className="h-6 w-6" />
                    </button>

                    <div className="relative max-h-[85vh] max-w-5xl overflow-hidden rounded-2xl">
                        <img
                            src={images[activeImageIdx]}
                            alt="Full preview"
                            className="max-h-[80vh] w-auto object-contain rounded-2xl shadow-2xl"
                        />
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                            {activeImageIdx + 1} of {images.length}
                        </div>
                    </div>

                    {images.length > 1 && (
                        <>
                            <button
                                onClick={() => setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                                className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-all"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </button>
                            <button
                                onClick={() => setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                                className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-all"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

AdminPropertyShow.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Admin', href: '/admin/dashboard' },
            { title: 'Property Approvals', href: '/admin/properties' },
            { title: 'Inspect & Review', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
