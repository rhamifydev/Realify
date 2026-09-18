import { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import { 
    ShieldCheck, MapPin, CheckCircle2, Bed, Bath, Home, ChevronLeft, ChevronRight, 
    Calendar, Shield, CreditCard, ExternalLink, Share2, Heart, Copy, Check, 
    Sparkles, AlertCircle, FileCheck, Layers, Eye, Maximize2, X, Phone, Lock, 
    Info, Building2, Zap, Droplets, Car, Compass
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import PublicHeader from '@/components/public-header';

const headerCategories = [
    { name: 'Residential', query: 'residential' },
    { name: 'Commercial', query: 'commercial' },
    { name: 'Apartment', query: 'residential' },
    { name: 'Industrial', query: 'commercial' },
    { name: 'Building Code', query: 'commercial' },
];

export default function BrowseShow({ property }: any) {
    const { auth } = usePage().props as any;
    const { post, processing } = useForm();

    const [selectedUnitIndex, setSelectedUnitIndex] = useState(0);
    const units = property.units || [];
    const activeUnit = units[selectedUnitIndex] || units[0] || null;

    // Gallery images compilation
    const mediaImages = (property.media || [])
        .map((m: any) => m.file_path ? `/storage/${m.file_path}` : m.path ? `/storage/${m.path}` : null)
        .filter(Boolean);

    const fallbackImages = [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop',
    ];

    const galleryImages = mediaImages.length > 0 ? mediaImages : fallbackImages;

    // Lightbox modal state
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIdx, setCurrentImageIdx] = useState(0);

    // Mobile carousel active index
    const [mobileSlide, setMobileSlide] = useState(0);

    // Share state
    const [copied, setCopied] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // Expand description
    const [isDescExpanded, setIsDescExpanded] = useState(false);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handleBook = () => {
        post(`/browse/${property.id}/book`);
    };

    // Keyboard navigation for lightbox
    useEffect(() => {
        if (!lightboxOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setLightboxOpen(false);
            if (e.key === 'ArrowRight') setCurrentImageIdx((prev) => (prev + 1) % galleryImages.length);
            if (e.key === 'ArrowLeft') setCurrentImageIdx((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, galleryImages.length]);

    // Format numbers
    const formatCurrency = (amount: number | string | undefined | null) => {
        if (amount === undefined || amount === null || isNaN(Number(amount))) return '0';
        return Number(amount).toLocaleString();
    };

    const rentPrice = Number(activeUnit?.rent_price || 0);
    const cautionDeposit = Number(activeUnit?.caution_deposit || 0);
    const agencyFee = Number(activeUnit?.agency_fee || 0);
    const totalMoveIn = rentPrice + cautionDeposit + agencyFee;

    // Standard amenities list
    const amenities = [
        { icon: ShieldCheck, title: '24/7 Security Guard', desc: 'Manned access gate & patrol' },
        { icon: Zap, title: 'Dedicated Power Supply', desc: 'Transformer & backup generator' },
        { icon: Droplets, title: 'Treated Water Supply', desc: 'Borehole with water treatment' },
        { icon: Car, title: 'Ample Parking Space', desc: 'Paved compound parking' },
        { icon: Building2, title: 'Modern Fitted Kitchen', desc: 'Quality cabinets & extractor' },
        { icon: CheckCircle2, title: 'Prepaid Electric Meter', desc: 'Independent billing meter' },
        { icon: Compass, title: 'Serene Neighbourhood', desc: 'Tarred road network & drainage' },
        { icon: FileCheck, title: 'Digital Lease Agreement', desc: '100% legal tenancy paper trail' },
    ];

    return (
        <div className="antialiased bg-[#F8FAFC] text-slate-900 min-h-screen font-sans pb-28 md:pb-16">
            <Head title={`${property.title} — Rentify Escrow`} />

            {/* Global Public Header */}
            <PublicHeader categories={headerCategories} />

            <main className="max-w-7xl mx-auto px-4 md:px-8 pt-24 sm:pt-28 pb-28 md:pb-16">
                {/* Action Toolbar Row: Back button on Left, Share & Save on Right */}
                <div className="flex items-center justify-between gap-3 mb-5 sm:mb-6">
                    <Link 
                        href="/browse" 
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all shadow-2xs hover:text-blue-900 shrink-0"
                    >
                        <ChevronLeft className="w-4 h-4 text-slate-500" />
                        <span>Back to Browse</span>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <button 
                            onClick={handleCopyLink}
                            type="button"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-all shadow-2xs cursor-pointer"
                            title="Share property link"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4 text-emerald-600" />
                                    <span className="text-emerald-700">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Share2 className="w-4 h-4 text-slate-600" />
                                    <span>Share</span>
                                </>
                            )}
                        </button>

                        <button 
                            onClick={() => setIsSaved(!isSaved)}
                            type="button"
                            className={`px-3.5 py-2 rounded-full border text-xs sm:text-sm font-bold transition-all inline-flex items-center gap-1.5 shadow-2xs cursor-pointer ${
                                isSaved 
                                    ? 'border-red-200 bg-red-50 text-red-600' 
                                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                            }`}
                            title="Save to favorites"
                        >
                            <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-600 text-red-600' : 'text-slate-600'}`} />
                            <span>{isSaved ? 'Saved' : 'Save'}</span>
                        </button>
                    </div>
                </div>

                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 mb-5 overflow-hidden">
                    <Link href="/" className="hover:text-blue-900 transition-colors shrink-0">Home</Link>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <Link href="/browse" className="hover:text-blue-900 transition-colors shrink-0">Browse</Link>
                    {property.city && (
                        <>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <Link href={`/browse?location=${encodeURIComponent(property.city)}`} className="hover:text-blue-900 transition-colors shrink-0">
                                {property.city}
                            </Link>
                        </>
                    )}
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-slate-900 font-bold truncate">{property.title}</span>
                </nav>

                {/* Property Header Title & Badges */}
                <div className="mb-6">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider rounded-full shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 100% Escrow Protected
                        </span>
                        {property.type && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider rounded-full shadow-2xs">
                                {property.type === 'rent' ? 'For Rent' : property.type === 'sale' ? 'For Sale' : 'Sale or Rent'}
                            </span>
                        )}
                        {property.category && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider rounded-full shadow-2xs">
                                {property.category}
                            </span>
                        )}
                        {property.title_type && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-50 border border-violet-200 text-violet-800 text-xs font-bold uppercase tracking-wider rounded-full shadow-2xs">
                                <FileCheck className="w-3.5 h-3.5 text-violet-600" /> {property.title_type}
                            </span>
                        )}
                    </div>

                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-2">
                        {property.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-600">
                        <p className="flex items-center gap-1.5 font-medium">
                            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                            <span>{property.address ? `${property.address}, ` : ''}{property.city || 'Lagos'}, {property.state || 'Lagos'}</span>
                        </p>
                        
                        <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${property.address || ''} ${property.city || ''} ${property.state || ''}`)}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 hover:underline"
                        >
                            <span>Open on Google Maps</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </div>

                {/* Hero Image Gallery (Desktop 5-grid & Mobile Carousel) */}
                <div className="relative mb-10">
                    {/* Desktop Gallery (Grid of 5) */}
                    <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-3 h-[480px] rounded-3xl overflow-hidden shadow-md">
                        {/* Main large image */}
                        <div 
                            onClick={() => { setCurrentImageIdx(0); setLightboxOpen(true); }}
                            className="col-span-2 row-span-2 relative cursor-pointer overflow-hidden group bg-slate-900"
                        >
                            <img 
                                src={galleryImages[0]} 
                                alt={property.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Featured View
                            </div>
                        </div>

                        {/* Top-mid image */}
                        <div 
                            onClick={() => { setCurrentImageIdx(1); setLightboxOpen(true); }}
                            className="relative cursor-pointer overflow-hidden group bg-slate-900"
                        >
                            <img 
                                src={galleryImages[1] || galleryImages[0]} 
                                alt="Gallery 2" 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                        </div>

                        {/* Top-right image */}
                        <div 
                            onClick={() => { setCurrentImageIdx(2); setLightboxOpen(true); }}
                            className="relative cursor-pointer overflow-hidden group bg-slate-900"
                        >
                            <img 
                                src={galleryImages[2] || galleryImages[0]} 
                                alt="Gallery 3" 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                        </div>

                        {/* Bottom-mid image */}
                        <div 
                            onClick={() => { setCurrentImageIdx(3); setLightboxOpen(true); }}
                            className="relative cursor-pointer overflow-hidden group bg-slate-900"
                        >
                            <img 
                                src={galleryImages[3] || galleryImages[0]} 
                                alt="Gallery 4" 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                        </div>

                        {/* Bottom-right image with View All button */}
                        <div 
                            onClick={() => { setCurrentImageIdx(4); setLightboxOpen(true); }}
                            className="relative cursor-pointer overflow-hidden group bg-slate-900"
                        >
                            <img 
                                src={galleryImages[4] || galleryImages[0]} 
                                alt="Gallery 5" 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                <button 
                                    type="button"
                                    className="bg-white/95 hover:bg-white text-slate-900 font-extrabold text-xs px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 group-hover:scale-105 transition-all"
                                >
                                    <Eye className="w-4 h-4" /> View all {galleryImages.length} photos
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Gallery (Swipeable carousel feel) */}
                    <div className="md:hidden relative aspect-[4/3] rounded-3xl overflow-hidden shadow-md bg-slate-900">
                        <img 
                            src={galleryImages[mobileSlide] || galleryImages[0]} 
                            alt={property.title} 
                            onClick={() => { setCurrentImageIdx(mobileSlide); setLightboxOpen(true); }}
                            className="w-full h-full object-cover" 
                        />
                        {/* Slide counter */}
                        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                            {mobileSlide + 1} / {galleryImages.length}
                        </div>
                        {/* Nav buttons */}
                        {galleryImages.length > 1 && (
                            <>
                                <button 
                                    type="button"
                                    onClick={() => setMobileSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md"
                                >
                                    <ChevronLeft className="w-5 h-5 text-slate-800" />
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setMobileSlide((prev) => (prev + 1) % galleryImages.length)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md"
                                >
                                    <ChevronRight className="w-5 h-5 text-slate-800" />
                                </button>
                            </>
                        )}
                        <button 
                            onClick={() => { setCurrentImageIdx(mobileSlide); setLightboxOpen(true); }}
                            className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5"
                        >
                            <Eye className="w-3.5 h-3.5" /> Fullscreen
                        </button>
                    </div>
                </div>

                {/* Main Content Layout (2 Cols: Left details, Right sticky payment card) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-10">
                        {/* Key Specs Card Grid */}
                        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/70 shadow-xs">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 sm:mb-4">Property Highlights</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
                                <div className="p-3 sm:p-4 rounded-2xl bg-blue-50/50 border border-blue-100/70 flex flex-col justify-center">
                                    <div className="flex items-center gap-1.5 sm:gap-2 text-blue-900 mb-0.5 sm:mb-1">
                                        <Bed className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <span className="font-extrabold text-base sm:text-xl text-slate-900">
                                            {activeUnit?.bedrooms ?? 0}
                                        </span>
                                    </div>
                                    <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Bedrooms</span>
                                </div>

                                <div className="p-3 sm:p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/70 flex flex-col justify-center">
                                    <div className="flex items-center gap-1.5 sm:gap-2 text-indigo-900 mb-0.5 sm:mb-1">
                                        <Bath className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <span className="font-extrabold text-base sm:text-xl text-slate-900">
                                            {activeUnit?.bathrooms ?? 0}
                                        </span>
                                    </div>
                                    <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Bathrooms</span>
                                </div>

                                <div className="p-3 sm:p-4 rounded-2xl bg-amber-50/50 border border-amber-100/70 flex flex-col justify-center">
                                    <div className="flex items-center gap-1.5 sm:gap-2 text-amber-900 mb-0.5 sm:mb-1">
                                        <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <span className="font-extrabold text-xs sm:text-base text-slate-900 truncate">
                                            {property.structure_type === 'single_unit' ? 'Self-Contained' : 'Multi-Unit'}
                                        </span>
                                    </div>
                                    <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Structure</span>
                                </div>

                                <div className="p-3 sm:p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/70 flex flex-col justify-center">
                                    <div className="flex items-center gap-1.5 sm:gap-2 text-emerald-900 mb-0.5 sm:mb-1">
                                        <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <span className="font-extrabold text-xs sm:text-base text-slate-900">
                                            Verified
                                        </span>
                                    </div>
                                    <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Title Status</span>
                                </div>
                            </div>
                        </div>

                        {/* Multi-Unit Selector (If property has more than 1 unit) - 2 Columns on Mobile */}
                        {units.length > 1 && (
                            <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/70 shadow-xs">
                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                    <div>
                                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900">Available Units in this Building</h3>
                                        <p className="text-[11px] sm:text-xs text-slate-500">Select a unit to inspect pricing and specifications</p>
                                    </div>
                                    <span className="text-[11px] sm:text-xs font-extrabold px-2.5 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 shrink-0">
                                        {units.length} Units
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                                    {units.map((unit: any, idx: number) => {
                                        const isSelected = idx === selectedUnitIndex;
                                        return (
                                            <div 
                                                key={unit.id || idx}
                                                onClick={() => setSelectedUnitIndex(idx)}
                                                className={`p-3 sm:p-4 rounded-2xl border cursor-pointer transition-all ${
                                                    isSelected 
                                                        ? 'border-blue-900 bg-blue-50/40 ring-2 ring-blue-900/10 shadow-xs' 
                                                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-1 mb-1.5">
                                                    <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                                                        {unit.title || `Unit ${idx + 1}`}
                                                    </span>
                                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${isSelected ? 'bg-blue-900 text-white' : 'bg-slate-200 text-slate-700'}`}>
                                                        {isSelected ? 'Selected' : 'Select'}
                                                    </span>
                                                </div>
                                                <div className="text-[10px] sm:text-xs text-slate-500 flex items-center gap-1.5 sm:gap-2 mb-1.5">
                                                    <span>{unit.bedrooms || 0} Beds</span>
                                                    <span>•</span>
                                                    <span>{unit.bathrooms || 0} Baths</span>
                                                </div>
                                                <div className="font-extrabold text-blue-900 text-xs sm:text-base truncate">
                                                    ₦{formatCurrency(unit.rent_price)} <span className="text-[10px] font-normal text-slate-500">/ yr</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* About this Property Description */}
                        <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200/70 shadow-xs">
                            <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 mb-3 sm:mb-4">About this Property</h2>
                            <div className="relative">
                                <p className={`text-slate-600 font-medium leading-relaxed whitespace-pre-line text-sm sm:text-base text-justify ${
                                    !isDescExpanded && property.description?.length > 400 ? 'line-clamp-4' : ''
                                }`}>
                                    {property.description || 'Experience comfort and security in this carefully maintained property. Situated in a serene neighbourhood with reliable utilities, paved access, and quick connectivity to major transit routes. Verified under Rentify escrow guarantees.'}
                                </p>
                                {property.description?.length > 400 && (
                                    <button 
                                        type="button" 
                                        onClick={() => setIsDescExpanded(!isDescExpanded)}
                                        className="mt-3 text-xs sm:text-sm font-bold text-blue-900 hover:underline inline-flex items-center gap-1"
                                    >
                                        {isDescExpanded ? 'Show less' : 'Read full description'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Amenities & Estate Features Grid - 2 Columns on Mobile */}
                        <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200/70 shadow-xs">
                            <div className="mb-4 sm:mb-6">
                                <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900">Amenities & Estate Features</h2>
                                <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5 sm:mt-1">Inspected and confirmed during verification</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                                {amenities.map((item, index) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <div key={index} className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3.5 p-3 sm:p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shrink-0 shadow-2xs text-blue-900">
                                                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">{item.title}</h4>
                                                <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* How Escrow Protects You - 2 Columns on Mobile (2x2 grid) */}
                        <div className="bg-gradient-to-br from-blue-950 to-slate-900 text-white p-5 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
                            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                            <div className="flex items-center gap-2 text-amber-400 text-xs font-extrabold uppercase tracking-widest mb-2.5 sm:mb-3">
                                <ShieldCheck className="w-4 h-4" /> Rentify Escrow Guarantee
                            </div>
                            <h3 className="text-xl sm:text-2xl font-extrabold mb-2 sm:mb-3">Your funds never enter private accounts directly</h3>
                            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-5 sm:mb-6">
                                Traditional house hunting in Nigeria is plagued by inspection fee scams and fake landlords. Rentify locks your funds in an authorized escrow account until you physically confirm the property.
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-white/10">
                                <div className="space-y-1">
                                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-extrabold text-[11px] sm:text-xs">1</div>
                                    <h5 className="font-bold text-xs sm:text-sm text-white">Book Tour</h5>
                                    <p className="text-[11px] sm:text-xs text-slate-400 leading-snug">Refundable ₦5,000 fee deposited into Escrow.</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-extrabold text-[11px] sm:text-xs">2</div>
                                    <h5 className="font-bold text-xs sm:text-sm text-white">Physical Tour</h5>
                                    <p className="text-[11px] sm:text-xs text-slate-400 leading-snug">Inspect with agent. If not as advertised, full refund.</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-extrabold text-[11px] sm:text-xs">3</div>
                                    <h5 className="font-bold text-xs sm:text-sm text-white">Digital Lease</h5>
                                    <p className="text-[11px] sm:text-xs text-slate-400 leading-snug">Review and e-sign terms with legal protection.</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-extrabold text-[11px] sm:text-xs">4</div>
                                    <h5 className="font-bold text-xs sm:text-sm text-white">Key Handover</h5>
                                    <p className="text-[11px] sm:text-xs text-slate-400 leading-snug">Rent is only released after you accept keys.</p>
                                </div>
                            </div>
                        </div>

                        {/* Verified Landlord / Agent Card */}
                        <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200/70 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                            <img 
                                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=240&auto=format&fit=crop" 
                                alt={property.user?.name || 'Verified Landlord'} 
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-slate-100 shadow-xs shrink-0" 
                            />
                            <div className="flex-1 text-center sm:text-left w-full">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                    <div>
                                        <div className="flex items-center justify-center sm:justify-start gap-1.5">
                                            <h3 className="text-base sm:text-lg font-bold text-slate-900">{property.user?.name || 'Verified Landlord / Agent'}</h3>
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                                            Member since {new Date(property.user?.created_at || Date.now()).getFullYear()}
                                        </p>
                                    </div>
                                    <span className="inline-flex items-center justify-center gap-1 text-[11px] sm:text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 self-center sm:self-auto">
                                        <ShieldCheck className="w-3.5 h-3.5" /> Identity Verified
                                    </span>
                                </div>

                                <p className="text-xs text-slate-600 mb-3.5">
                                    Host background, BVN/NIN verification, and property ownership documentation are verified and vetted by Rentify compliance.
                                </p>

                                {/* 2 Columns on Mobile for Host Trust Pills */}
                                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
                                    <div className="text-center sm:text-left text-[11px] sm:text-xs font-semibold px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 truncate">
                                        ⏱️ &lt; 1hr Response
                                    </div>
                                    <div className="text-center sm:text-left text-[11px] sm:text-xs font-semibold px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 truncate">
                                        🏠 100% Escrow Safe
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Booking & Cost Breakdown Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 sticky top-24">
                            {activeUnit ? (
                                <>
                                    {/* Price Header */}
                                    <div className="mb-6 pb-6 border-b border-slate-100">
                                        <div className="flex items-baseline justify-between mb-1">
                                            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                                                {property.type === 'sale' ? 'Sale Price' : 'Annual Rent'}
                                            </span>
                                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                                                Escrow Secured
                                            </span>
                                        </div>
                                        <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                                            ₦{formatCurrency(rentPrice)}
                                            {property.type !== 'sale' && (
                                                <span className="text-sm font-semibold text-slate-500"> / yr</span>
                                            )}
                                        </h3>
                                        {property.type !== 'sale' && rentPrice > 0 && (
                                            <p className="text-xs font-semibold text-slate-400 mt-1">
                                                Equivalent to ~₦{formatCurrency(Math.round(rentPrice / 12))} / month
                                            </p>
                                        )}
                                    </div>

                                    {/* Upfront Costs Breakdown */}
                                    <div className="space-y-3.5 mb-6">
                                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                            Complete Upfront Breakdown
                                        </h4>

                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-600 font-medium">1st Year Rent</span>
                                            <span className="font-bold text-slate-900">₦{formatCurrency(rentPrice)}</span>
                                        </div>

                                        {cautionDeposit > 0 && (
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-600 font-medium flex items-center gap-1">
                                                    Caution Deposit 
                                                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">Refundable</span>
                                                </span>
                                                <span className="font-bold text-slate-900">₦{formatCurrency(cautionDeposit)}</span>
                                            </div>
                                        )}

                                        {agencyFee > 0 && (
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-600 font-medium">Legal & Agreement Fee</span>
                                                <span className="font-bold text-slate-900">₦{formatCurrency(agencyFee)}</span>
                                            </div>
                                        )}

                                        <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                                            <div>
                                                <span className="block text-sm font-extrabold text-slate-900">Total Move-in Cost</span>
                                                <span className="block text-[11px] text-slate-400 font-medium">Protected in Escrow</span>
                                            </div>
                                            <span className="text-xl font-extrabold text-blue-900">
                                                ₦{formatCurrency(totalMoveIn)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* First Step: Inspection Notice */}
                                    <div className="bg-amber-50/80 rounded-2xl p-4 mb-6 border border-amber-200/60 flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                                        <div>
                                            <h5 className="text-xs font-bold text-slate-900">Step 1: Physical Inspection</h5>
                                            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                                                Pay a refundable <strong>₦5,000 inspection deposit</strong> into Escrow to lock in an accompanied viewing schedule.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Booking CTA Button */}
                                    <Button 
                                        onClick={handleBook} 
                                        disabled={processing}
                                        className="w-full h-13 sm:h-14 bg-blue-900 hover:bg-blue-800 text-white rounded-2xl text-base font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-[0.99] cursor-pointer"
                                    >
                                        {processing ? 'Connecting to Escrow...' : 'Book Inspection (₦5,000)'}
                                    </Button>

                                    <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 text-center">
                                        <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span>Refundable if listing does not match description</span>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-slate-100 space-y-2.5">
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                            <span>Full money-back safety guarantee</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                            <span>Direct contact with verified representative</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                            <span>Zero unauthorized cash demands</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-10">
                                    <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">Currently Unavailable</h3>
                                    <p className="text-slate-500 text-xs">This property has no active units for lease or purchase right now.</p>
                                    <Link href="/browse" className="mt-4 inline-block text-xs font-bold text-blue-900 hover:underline">
                                        Browse other listings
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Mobile Fixed Bottom Booking Bar */}
            {activeUnit && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 px-4 py-3.5 shadow-2xl flex items-center justify-between gap-4">
                    <div className="min-w-0">
                        <span className="block text-xs text-slate-500 font-medium">Rent</span>
                        <span className="block text-lg font-extrabold text-slate-900 truncate">
                            ₦{formatCurrency(rentPrice)}
                            <span className="text-xs font-normal text-slate-500"> / yr</span>
                        </span>
                    </div>

                    <Button 
                        onClick={handleBook} 
                        disabled={processing}
                        className="h-12 px-6 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-900/20 shrink-0"
                    >
                        {processing ? 'Processing...' : 'Book Inspection'}
                    </Button>
                </div>
            )}

            {/* Lightbox Fullscreen Modal */}
            {lightboxOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200">
                    {/* Top control bar */}
                    <div className="flex items-center justify-between text-white max-w-6xl mx-auto w-full">
                        <div className="text-sm font-bold">
                            Photo {currentImageIdx + 1} of {galleryImages.length}
                        </div>
                        <button 
                            type="button"
                            onClick={() => setLightboxOpen(false)}
                            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Main Image container with Prev/Next buttons */}
                    <div className="relative flex-1 flex items-center justify-center max-w-5xl mx-auto w-full my-4">
                        <img 
                            src={galleryImages[currentImageIdx]} 
                            alt={`Photo ${currentImageIdx + 1}`} 
                            className="max-h-[70vh] max-w-full object-contain rounded-2xl shadow-2xl"
                        />

                        {galleryImages.length > 1 && (
                            <>
                                <button 
                                    type="button"
                                    onClick={() => setCurrentImageIdx((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                                    className="absolute left-2 sm:left-4 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all shadow-lg"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setCurrentImageIdx((prev) => (prev + 1) % galleryImages.length)}
                                    className="absolute right-2 sm:right-4 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all shadow-lg"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Thumbnail track at bottom */}
                    <div className="max-w-4xl mx-auto w-full overflow-x-auto py-2 flex items-center justify-center gap-2">
                        {galleryImages.map((img, idx) => (
                            <button 
                                key={idx}
                                type="button"
                                onClick={() => setCurrentImageIdx(idx)}
                                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 transition-all border-2 ${
                                    idx === currentImageIdx ? 'border-amber-400 scale-105 opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
                                }`}
                            >
                                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
