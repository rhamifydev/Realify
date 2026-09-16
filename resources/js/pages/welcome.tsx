import { useState, useEffect, useRef } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import { ShieldCheck, MapPin, Search, Home as HomeIcon, CheckCircle2, ChevronRight, ChevronLeft, Lock, Building2, Wallet, Heart, Menu, ArrowRight, TrendingUp, FileText, UserRound, Truck, BadgeCheck, Sparkles, Star, Quote, Mail, Phone, Send, Twitter, Instagram, Linkedin, Facebook, Globe, CreditCard } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

export default function Welcome({ topPlaces = [], featuredListings = [] }: { topPlaces?: any[], featuredListings?: any[] }) {
const { auth } = usePage().props as any;

    const [searchLocation, setSearchLocation] = useState('');
    const [searchType, setSearchType] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/browse', {
            location: searchLocation,
            ...(searchType ? { type: searchType } : {})
        });
    };

    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        let animationFrameId: number;
        let lastTime = performance.now();

        const scrollLoop = (time: number) => {
            const delta = time - lastTime;
            lastTime = time;

            if (!isPaused && container) {
                container.scrollLeft += delta * 0.05; // ~50px/sec smooth glide

                const halfWidth = container.scrollWidth / 2;
                if (container.scrollLeft >= halfWidth) {
                    container.scrollLeft -= halfWidth;
                } else if (container.scrollLeft <= 0) {
                    container.scrollLeft += halfWidth;
                }
            }

            animationFrameId = requestAnimationFrame(scrollLoop);
        };

        animationFrameId = requestAnimationFrame(scrollLoop);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isPaused]);

    const handleManualScroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        setIsPaused(true);
        const scrollAmount = 310;
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
        setTimeout(() => setIsPaused(false), 2000);
    };

    const testimonialsRef = useRef<HTMLDivElement>(null);
    const [isTestimonialsPaused, setIsTestimonialsPaused] = useState(false);

    useEffect(() => {
        const container = testimonialsRef.current;
        if (!container) return;

        let animationFrameId: number;
        let lastTime = performance.now();

        const scrollLoop = (time: number) => {
            const delta = time - lastTime;
            lastTime = time;

            if (!isTestimonialsPaused && container) {
                container.scrollLeft += delta * 0.045; // ~45px/sec smooth glide

                const halfWidth = container.scrollWidth / 2;
                if (container.scrollLeft >= halfWidth) {
                    container.scrollLeft -= halfWidth;
                } else if (container.scrollLeft <= 0) {
                    container.scrollLeft += halfWidth;
                }
            }

            animationFrameId = requestAnimationFrame(scrollLoop);
        };

        animationFrameId = requestAnimationFrame(scrollLoop);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isTestimonialsPaused]);

    const handleTestimonialsScroll = (direction: 'left' | 'right') => {
        if (!testimonialsRef.current) return;
        setIsTestimonialsPaused(true);
        const scrollAmount = 380;
        testimonialsRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
        setTimeout(() => setIsTestimonialsPaused(false), 2000);
    };

    // Safe fallbacks in case database is empty
    const safeFeaturedListings = featuredListings.length > 0 ? featuredListings : [
        {
            title: 'Modern 1-Bedroom Apartment',
            location: 'Lekki Phase 1, Lagos',
            price: '₦3.5m',
            period: '/year',
            units: '3 UNITS LEFT',
            img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop',
            agent: 'Verified Agent'
        },
        {
            title: '4-Bedroom Luxury Duplex',
            location: 'Ikoyi, Lagos',
            price: '₦12m',
            period: '/year',
            units: 'SINGLE UNIT',
            img: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop',
            agent: 'Verified Owner'
        },
        {
            title: 'Executive Studio Apartment',
            location: 'Yaba, Lagos',
            price: '₦1.2m',
            period: '/year',
            units: '1 UNIT LEFT',
            img: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?q=80&w=800&auto=format&fit=crop',
            agent: 'Verified Agent'
        },
        {
            title: 'Spacious 2-Bedroom Flat',
            location: 'Ikeja GRA, Lagos',
            price: '₦5m',
            period: '/year',
            units: '8 UNITS LEFT',
            img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&auto=format&fit=crop',
            agent: 'Verified Agent'
        }
    ];

    // City image map — used by both controller data and fallback
    const cityImageMap: Record<string, string> = {
        'Lagos': '/images/lagos.jpg',
        'Abuja': '/images/abuja.jpg',
        'Port Harcourt': '/images/port-harcourt.jpg',
    };

    const safeTopPlaces = topPlaces.length >= 3
        ? topPlaces.map((p: any) => ({ ...p, img: cityImageMap[p.city] || p.img }))
        : [
            { city: 'Lagos', count: 120, img: cityImageMap['Lagos'] },
            { city: 'Abuja', count: 85, img: cityImageMap['Abuja'] },
            { city: 'Port Harcourt', count: 45, img: cityImageMap['Port Harcourt'] }
        ];

    const propertyCategories = [
        { name: 'Residential', description: 'Comfortable homes for everyday living', query: 'residential', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=900&auto=format&fit=crop' },
        { name: 'Apartment', description: 'Modern spaces in connected neighbourhoods', query: 'apartment', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=900&auto=format&fit=crop' },
        { name: 'Industrial', description: 'Practical spaces built for operations', query: 'industrial', img: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?q=80&w=900&auto=format&fit=crop' },
        { name: 'Commercial', description: 'High-visibility spaces for growing businesses', query: 'commercial', img: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=900&auto=format&fit=crop' },
        { name: 'Building Code', description: 'Development-ready land and structures', query: 'building-code', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=900&auto=format&fit=crop' },
    ];

    const agentsList = [
        { name: 'Oluwaseun Adebayo', role: 'Senior Agent, Lagos', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop', deals: '48 Closed Deals' },
        { name: 'Chika Nwosu', role: 'Property Manager, Abuja', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop', deals: '35 Closed Deals' },
        { name: 'Ahmed Ibrahim', role: 'Commercial Specialist, Lagos', img: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?q=80&w=400&auto=format&fit=crop', deals: '62 Closed Deals' },
        { name: 'Grace Okafor', role: 'Luxury Consultant, Ikoyi', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop', deals: '29 Closed Deals' },
        { name: 'Emeka Eze', role: 'Residential Expert, Lekki', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop', deals: '41 Closed Deals' },
        { name: 'Amina Bello', role: 'Short-let Consultant, Abuja', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop', deals: '53 Closed Deals' },
    ];

    const testimonialsList = [
        {
            name: 'Rebeka Dawson',
            role: 'Verified Tenant',
            city: 'Lekki Phase 1, Lagos',
            headline: 'Zero fear of fake landlords or inspection fee scams!',
            text: 'Rentify completely changed my house hunting experience. The escrow vault held my funds safely until I physically inspected the apartment, verified the title, and received the keys.',
            img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
            tag: '₦3.5M Escrow Vault',
            verified: 'Verified Tenant'
        },
        {
            name: 'Chief Marc Kenneth',
            role: 'Property Investor',
            city: 'Ikoyi, Lagos',
            headline: 'Seamless rent collection with zero payment defaults',
            text: 'Managing luxury duplexes used to be an operational headache. With Rentify, I only deal with vetted, KYC-verified tenants. The escrow release happened automatically on move-in day.',
            img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop',
            tag: '₦12M Luxury Lease',
            verified: 'Verified Landlord'
        },
        {
            name: 'Owen Lester',
            role: 'Senior Real Estate Broker',
            city: 'Victoria Island, Lagos',
            headline: 'Closed 3x more rental deals with zero trust friction',
            text: 'Clients trust me immediately because their funds never enter private accounts—everything sits protected in Rentify escrow until legal contracts are signed digitally.',
            img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
            tag: 'Top Agent 2026',
            verified: 'Verified Agent'
        },
        {
            name: 'Dr. Folake Adeyemi',
            role: 'Diaspora Landlord',
            city: 'London / Abuja',
            headline: 'Managed my Abuja rentals from London with total peace of mind',
            text: 'Living abroad while leasing property in Nigeria was terrifying before Rentify. Digital tenancy agreements and automated escrow payouts made the entire process 100% transparent.',
            img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
            tag: '₦8.5M Escrow Safe',
            verified: 'Verified Owner'
        },
        {
            name: 'Tunde Bakare',
            role: 'Tech Lead & Renter',
            city: 'Yaba, Lagos',
            headline: 'Inspected 3 flats and paid zero fraudulent caution fees',
            text: 'I scheduled 3 verified inspections through the app, picked my dream flat in Yaba, and only released payment once the lease was finalized. No hidden agency cuts or bogus fees.',
            img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
            tag: '₦2.8M Flat Lease',
            verified: 'Verified Tenant'
        },
        {
            name: 'Halima Mohammed',
            role: 'Corporate Professional',
            city: 'Maitama, Abuja',
            headline: 'Digital lease signed in 10 mins, keys handed over same day',
            text: 'The seamless combination of electronic legal agreements, identity verification, and instant bank disbursement makes Rentify the gold standard of modern Nigerian real estate.',
            img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
            tag: '₦6.0M Lease',
            verified: 'Verified Tenant'
        }
    ];

    return (
        <div className="antialiased text-slate-900 min-h-screen font-sans selection:bg-blue-900 selection:text-white">
            <Head title="Rentify — Escrow-Protected Rentals in Nigeria" />

            <style dangerouslySetInnerHTML={{__html: `
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes hero-float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
                .float-anim { animation: hero-float 4s ease-in-out infinite; }
                @keyframes gradient-shift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .hero-bg {
                    background: linear-gradient(135deg, #f0f4ff 0%, #fafafa 30%, #fffbf0 60%, #f0f8ff 100%);
                    background-size: 300% 300%;
                    animation: gradient-shift 8s ease infinite;
                }
                .card-hover { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease; }
                .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 60px -10px rgba(30, 58, 138, 0.15); }
            `}} />

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-sm transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-blue-900 hover:opacity-90 transition-opacity">
                            <div className="w-9 h-9 bg-blue-900 rounded-xl flex items-center justify-center shadow-inner">
                                <ShieldCheck className="text-white w-5 h-5" />
                            </div>
                            Rent<span className="text-amber-500">ify</span>
                        </Link>
                        <div className="hidden lg:flex items-center gap-8">
                            <Link href="/browse" className="text-sm font-bold text-slate-600 hover:text-blue-900 transition-colors">Find a Home</Link>
                            <a href="#escrow" className="text-sm font-bold text-slate-600 hover:text-blue-900 transition-colors">How Escrow Works</a>
                            <a href="#trust" className="text-sm font-bold text-slate-600 hover:text-blue-900 transition-colors">Trust & Safety</a>
                        </div>
                    </div>

                    {/* Desktop Auth Links */}
                    <div className="hidden lg:flex items-center gap-4">
                        {auth?.user ? (
                            <Link href={dashboard()} className="bg-blue-900 text-white px-7 py-2.5 rounded-full text-sm font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 active:translate-y-0">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={login()} className="text-sm font-bold text-slate-600 hover:text-blue-900 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50">Log In</Link>
                                <Link href={register()} className="bg-blue-900 text-white px-7 py-2.5 rounded-full text-sm font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 active:translate-y-0">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu */}
                    <div className="lg:hidden flex items-center">
                        <Sheet>
                            <SheetTrigger className="p-2 -mr-2 text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                                <Menu className="w-7 h-7" />
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] gap-0 overflow-hidden bg-white p-0 sm:w-[400px]">
                                <SheetHeader className="border-b border-slate-100 p-5 pr-14 text-left">
                                    <SheetTitle className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-blue-900">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-900">
                                            <ShieldCheck className="h-5 w-5 text-white" />
                                        </div>
                                        Rent<span className="text-amber-500">ify</span>
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex h-full flex-col">
                                    <div className="flex-1 overflow-y-auto px-5 py-5">
                                        {auth?.user ? (
                                            <Link href={dashboard()} className="mb-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-900 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-blue-800">
                                                <HomeIcon className="h-4 w-4" /> Go to Dashboard
                                            </Link>
                                        ) : (
                                            <Link href={login()} className="mb-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-900 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-blue-800">
                                                <UserRound className="h-4 w-4" /> Sign In / Register
                                            </Link>
                                        )}

                                        <div className="mb-7">
                                            <div className="mb-3 flex items-center justify-between">
                                                <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Categories</p>
                                                <Link href="/browse" className="text-xs font-extrabold text-emerald-600 hover:text-emerald-700">View All</Link>
                                            </div>
                                            <div className="divide-y divide-slate-100">
                                                {propertyCategories.map((category) => (
                                                    <Link key={category.name} href={`/browse?category=${category.query}`} className="flex items-center justify-between py-3 text-sm font-bold text-slate-700 transition-colors hover:text-blue-900">
                                                        <span>{category.name}</span>
                                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><ChevronRight className="h-3.5 w-3.5" /></span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-slate-400">Quick Links</p>
                                            <div className="space-y-1">
                                                <Link href="/browse" className="flex items-center gap-3 rounded-xl px-2 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"><Search className="h-5 w-5 text-emerald-600" /> Find a Home</Link>
                                                <a href="#escrow" className="flex items-center gap-3 rounded-xl px-2 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"><Wallet className="h-5 w-5 text-emerald-600" /> How Escrow Works</a>
                                                <a href="#trust" className="flex items-center gap-3 rounded-xl px-2 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"><ShieldCheck className="h-5 w-5 text-emerald-600" /> Trust & Safety</a>
                                                <Link href="/properties/create" className="flex items-center gap-3 rounded-xl px-2 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"><Building2 className="h-5 w-5 text-emerald-600" /> List a Property</Link>
                                                <Link href="/kyc" className="flex items-center gap-3 rounded-xl px-2 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"><FileText className="h-5 w-5 text-emerald-600" /> KYC Verification</Link>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4 text-xs font-semibold text-slate-500">
                                        <Truck className="h-4 w-4 text-emerald-600" />
                                        Secure property transactions across Nigeria
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-bg pt-28 pb-6 md:pt-32 md:pb-10 px-4 md:px-8 relative overflow-hidden">
                {/* decorative blobs */}
                <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl pointer-events-none"></div>
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div className="space-y-7 md:space-y-8 flex flex-col items-center text-center lg:items-start lg:text-left">
                        <div className="inline-flex max-w-full items-center gap-2 px-3 py-2 sm:px-4 bg-emerald-50 border border-emerald-200 rounded-full shadow-sm">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 uppercase tracking-wider">100% Escrow Protected Rentals</span>
                        </div>

                        <h1 className="max-w-3xl text-[2.65rem] sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.08] text-slate-900">
                            Find your next home.<br/>
                            <span className="bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">Keep your money safe.</span>
                        </h1>

                        <p className="text-base sm:text-lg md:text-xl text-slate-600 font-medium max-w-lg leading-relaxed">
                            Rentify holds your rent in a secure escrow vault until you physically inspect the property and sign the agreement. No scams. Total peace of mind.
                        </p>

                        {/* Trust micro stats */}
                        <div className="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:gap-6 sm:text-sm font-bold text-slate-500">
                            <div className="flex items-center gap-1.5"><span className="text-blue-900 text-base sm:text-lg font-extrabold">10k+</span> Happy Tenants</div>
                            <div className="hidden sm:block w-px h-4 bg-slate-300"></div>
                            <div className="flex items-center gap-1.5"><span className="text-blue-900 text-base sm:text-lg font-extrabold">₦2B+</span> Secured</div>
                            <div className="hidden sm:block w-px h-4 bg-slate-300"></div>
                            <div className="flex items-center gap-1.5"><span className="text-blue-900 text-base sm:text-lg font-extrabold">500+</span> Properties</div>
                        </div>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="bg-white p-2 rounded-3xl sm:rounded-[2rem] shadow-xl shadow-blue-900/10 border border-slate-200 flex flex-col sm:flex-row items-center gap-2 w-full max-w-xl">
                            <div className="flex-1 w-full px-4 sm:px-6 py-3 hover:bg-slate-50 rounded-2xl sm:rounded-3xl transition-colors cursor-text text-left">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Location</label>
                                <input
                                    type="text"
                                    value={searchLocation}
                                    onChange={(e) => setSearchLocation(e.target.value)}
                                    placeholder="Lagos, Abuja, Port Harcourt..."
                                    className="w-full bg-transparent outline-none border-none text-sm font-semibold text-slate-900 placeholder:text-slate-400 p-0 focus:ring-0"
                                />
                            </div>
                            <div className="hidden sm:block w-px h-10 bg-slate-200"></div>
                            <div className="flex-1 w-full px-4 sm:px-6 py-3 hover:bg-slate-50 rounded-2xl sm:rounded-3xl transition-colors cursor-pointer text-left">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">I want to</label>
                                <select
                                    value={searchType}
                                    onChange={(e) => setSearchType(e.target.value)}
                                    className="w-full bg-transparent outline-none border-none text-sm font-semibold text-slate-900 cursor-pointer p-0 focus:ring-0"
                                >
                                    <option value="">Rent or Buy</option>
                                    <option value="rent">Rent</option>
                                    <option value="sale">Buy</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full sm:w-14 sm:h-14 bg-amber-500 text-white rounded-full font-bold flex items-center justify-center hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/30 shrink-0 py-3 sm:py-0">
                                <Search className="w-5 h-5" />
                                <span className="sm:hidden ml-2">Search</span>
                            </button>
                        </form>
                    </div>

                    <div className="relative hidden lg:block">
                        <div className="absolute -top-8 -right-8 w-64 h-64 bg-blue-100/50 rounded-full blur-2xl"></div>
                        <div className="relative z-10 bg-white rounded-[2.5rem] p-4 shadow-2xl shadow-blue-900/10 border border-slate-100">
                            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop" alt="Luxury Home" className="w-full h-[400px] object-cover rounded-[2rem]" />
                            {/* Verified badge top right */}
                            <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-md">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span className="text-xs font-extrabold text-slate-800">KYC Verified</span>
                            </div>
                            {/* Floating Fintech Badge */}
                            <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-3xl shadow-xl border border-slate-100 flex items-center gap-4 float-anim">
                                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                    <Lock className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Funds in Escrow</p>
                                    <p className="text-lg font-extrabold text-slate-900">₦4,500,000</p>
                                </div>
                            </div>
                            {/* Floating top left — active listing count */}
                            <div className="absolute -top-5 -left-5 bg-blue-900 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3">
                                <TrendingUp className="w-5 h-5 text-amber-400" />
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">Listed Today</p>
                                    <p className="text-base font-extrabold">24 New Homes</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Most Popular Places */}
            <section className="pt-16 pb-12 bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 text-center sm:text-left items-center sm:items-end">
                        <div className="w-full sm:w-auto">
                            <span className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-2 block">Top Places</span>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Most Popular Cities</h2>
                        </div>
                        <Link href="/cities" className="text-sm font-bold text-blue-900 hover:text-blue-700 flex items-center justify-center sm:justify-start gap-1.5 transition-colors shrink-0">
                            Browse All Cities <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
                        {/* Large Tile - Lagos */}
                        <Link href={`/browse?location=${safeTopPlaces[0]?.city || 'Lagos'}`} className="group relative rounded-2xl md:rounded-3xl overflow-hidden col-span-2 md:col-span-2 md:row-span-2 h-[110px] md:h-full flex items-center justify-between px-5 md:p-0 md:items-end">
                            <img src={safeTopPlaces[0]?.img} alt={safeTopPlaces[0]?.city} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/25 md:bg-gradient-to-t md:from-black/50 md:via-black/10 md:to-transparent"></div>
                            <div className="relative z-10 flex items-center justify-between w-full md:block md:w-auto md:absolute md:bottom-8 md:left-8">
                                <h3 className="text-xl md:text-3xl font-extrabold text-white md:mb-2">{safeTopPlaces[0]?.city}</h3>
                                <p className="text-white/90 text-[11px] md:text-base font-medium bg-white/20 md:bg-transparent px-2.5 py-1 md:p-0 rounded-lg md:rounded-none backdrop-blur-sm md:backdrop-blur-none">{safeTopPlaces[0]?.count}+ Properties</p>
                            </div>
                        </Link>
                        {/* Small Tile - Abuja */}
                        <Link href={`/browse?location=${safeTopPlaces[1]?.city || 'Abuja'}`} className="group relative rounded-2xl md:rounded-3xl overflow-hidden col-span-1 h-[110px] md:h-72 flex flex-col justify-center items-center md:justify-end md:items-start p-3 md:p-0">
                            <img src={safeTopPlaces[1]?.img} alt={safeTopPlaces[1]?.city} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/25 md:bg-gradient-to-t md:from-black/50 md:via-black/10 md:to-transparent"></div>
                            <div className="relative z-10 text-center md:text-left md:absolute md:bottom-6 md:left-6">
                                <h3 className="text-lg md:text-2xl font-extrabold text-white mb-1">{safeTopPlaces[1]?.city}</h3>
                                <p className="text-white/90 text-[10px] md:text-base font-medium">{safeTopPlaces[1]?.count}+ Properties</p>
                            </div>
                        </Link>
                        {/* Small Tile - Port Harcourt */}
                        <Link href={`/browse?location=${safeTopPlaces[2]?.city || 'Port Harcourt'}`} className="group relative rounded-2xl md:rounded-3xl overflow-hidden col-span-1 h-[110px] md:h-72 flex flex-col justify-center items-center md:justify-end md:items-start p-3 md:p-0">
                            <img src={safeTopPlaces[2]?.img} alt={safeTopPlaces[2]?.city} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 bg-slate-200" />
                            <div className="absolute inset-0 bg-black/25 md:bg-gradient-to-t md:from-black/50 md:via-black/10 md:to-transparent"></div>
                            <div className="relative z-10 text-center md:text-left md:absolute md:bottom-6 md:left-6">
                                <h3 className="text-lg md:text-2xl font-extrabold text-white mb-1 truncate max-w-[80px] md:max-w-none">{safeTopPlaces[2]?.city}</h3>
                                <p className="text-white/90 text-[10px] md:text-base font-medium">{safeTopPlaces[2]?.count}+ Properties</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Property Categories */}
            <section className="py-8 md:py-20 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 text-center md:text-left items-center md:items-end">
                        <div className="w-full md:w-auto">
                            <span className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-2 block">Browse by type</span>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Find the right space</h2>
                            <p className="text-slate-500 font-medium mt-2">Explore properties shaped around the way you live and work.</p>
                        </div>
                        <Link href="/types" className="text-sm font-bold text-blue-900 hover:text-blue-700 flex items-center justify-center md:justify-start gap-1.5 transition-colors shrink-0">
                            View all properties <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                        {propertyCategories.map((category, index) => (
                            <Link
                                key={category.name}
                                href={`/types/${category.query}`}
                                className={`${index === 4 ? 'hidden sm:block' : ''} group relative aspect-[4/5] overflow-hidden rounded-2xl md:rounded-3xl bg-slate-900 shadow-sm`}
                            >
                                <img
                                    src={category.img}
                                    alt={category.name}
                                    loading={index < 4 ? 'eager' : 'lazy'}
                                    onError={(event) => { event.currentTarget.src = '/images/lagos.jpg'; }}
                                    className="absolute inset-0 block h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent" />
                                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                                    <h3 className="text-lg md:text-xl font-extrabold text-white">{category.name}</h3>
                                    <p className="mt-1 text-[11px] md:text-xs font-medium leading-relaxed text-white/75">{category.description}</p>
                                    <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-amber-300">
                                        Explore <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Listings */}
            <section className="pt-10 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 text-center sm:text-left">
                    <div className="w-full sm:w-auto">
                        <span className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-2 block">Featured</span>
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-1">Latest Verified Properties</h2>
                        <p className="text-slate-500 font-medium">{safeFeaturedListings.length} properties freshly listed across Nigeria.</p>
                    </div>
                    <Link href="/browse" className="hidden sm:inline-flex items-center gap-2 bg-blue-900 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-blue-800 transition-all shadow-md">
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {safeFeaturedListings.map((listing, i) => (
                        <Link key={i} href={listing.id ? `/browse/${listing.id}` : '/browse'} className="group cursor-pointer block card-hover">
                            <div className="relative aspect-[3/4] rounded-2xl md:rounded-3xl overflow-hidden mb-3 shadow-sm border border-slate-100">
                                <img src={listing.img} alt={listing.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent"></div>

                                {/* Top Badges */}
                                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                                    <span className="bg-[#1e3a8a] text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">Verified</span>
                                    {i === 0 && <span className="bg-slate-900/80 backdrop-blur-sm text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">3D Tour</span>}
                                    {i === 2 && <span className="bg-amber-500 text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">Hot</span>}
                                </div>

                                {/* Favourite */}
                                <button onClick={(e) => e.preventDefault()} className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm">
                                    <Heart className="w-3.5 h-3.5 text-slate-600" />
                                </button>

                                {/* Price */}
                                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                                    <div className="text-white">
                                        <span className="text-2xl font-extrabold leading-none">{listing.price}</span>
                                        <span className="text-xs font-medium opacity-75 ml-1">{listing.period}</span>
                                    </div>
                                    <div className={`text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 ${!listing.units || listing.units === 'SINGLE UNIT' ? 'text-slate-300' : 'text-emerald-400'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${!listing.units || listing.units === 'SINGLE UNIT' ? 'bg-slate-300' : 'bg-emerald-400'}`}></span>
                                        {listing.units || 'SINGLE UNIT'}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[13px] sm:text-base font-bold text-slate-900 mb-0.5 leading-snug truncate group-hover:text-blue-900 transition-colors">{listing.title}</h3>
                                <p className="text-[11px] sm:text-xs font-medium text-slate-500 truncate flex items-center gap-1">
                                    <MapPin className="w-3 h-3 inline-block shrink-0" />
                                    {listing.location} · {listing.baths ?? (i === 0 ? '2' : (i === 1 ? '5' : '1'))} beds
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="mt-8 text-center sm:hidden">
                    <Link href="/browse" className="inline-flex items-center gap-2 bg-blue-900 text-white px-8 py-3.5 rounded-full text-sm font-bold hover:bg-blue-800 transition-all shadow-md">
                        View All Properties <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-24 bg-gradient-to-b from-slate-50 to-white border-y border-slate-200/50">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-2 block">Why Choose Us?</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Built for Nigeria's Property Market</h2>
                        <p className="text-slate-500 font-medium text-lg">We provide a secure, transparent, and seamless property experience that protects tenants, owners, and agents.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 card-hover group flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-blue-50 border border-blue-100 text-blue-900 rounded-full flex items-center justify-center mb-6 shadow-sm ring-8 ring-blue-50/50 group-hover:scale-110 group-hover:bg-blue-900 group-hover:text-white group-hover:ring-blue-100 transition-all duration-300">
                                <ShieldCheck className="w-8 h-8 stroke-[1.8]" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">100% Escrow Protected</h3>
                            <p className="text-slate-500 font-medium leading-relaxed text-sm">Your money is held safely in our vault until you've inspected the property and signed. Zero risk of fraud, ever.</p>
                        </div>
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 card-hover group flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-sm ring-8 ring-emerald-50/50 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white group-hover:ring-emerald-100 transition-all duration-300">
                                <BadgeCheck className="w-8 h-8 stroke-[1.8]" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">KYC Verified Agents</h3>
                            <p className="text-slate-500 font-medium leading-relaxed text-sm">Every agent on our platform undergoes strict KYC verification using NIN and CAC documentation to ensure authenticity.</p>
                        </div>
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 card-hover group flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-amber-50 border border-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-6 shadow-sm ring-8 ring-amber-50/50 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white group-hover:ring-amber-100 transition-all duration-300">
                                <Sparkles className="w-8 h-8 stroke-[1.8]" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Premium Experience</h3>
                            <p className="text-slate-500 font-medium leading-relaxed text-sm">From virtual tours to instant booking — enjoy a seamless, modern property search experience built for 2025.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Escrow Tracker Process (Fintech Style) */}
            <section id="escrow" className="py-24 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">How our Escrow works</h2>
                        <p className="text-slate-500 font-medium text-lg">You are in complete control of your money. We only release funds when you are satisfied.</p>
                    </div>

                    <div className="relative">
                        <div className="hidden lg:block absolute top-[45px] left-[10%] right-[10%] h-1 bg-slate-100 rounded-full z-0"></div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 relative z-10">
                            {/* Step 1 */}
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-white border-4 border-slate-100 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-slate-200/50">
                                    <Wallet className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">1. Inspection Paid</h3>
                                <p className="text-sm font-medium text-slate-500">Pay the inspection fee securely into the Rentify vault via Paystack.</p>
                            </div>
                            {/* Step 2 */}
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-white border-4 border-blue-100 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-blue-900/10 relative">
                                    <div className="absolute inset-0 bg-blue-50 rounded-full animate-ping opacity-20"></div>
                                    <Search className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">2. Inspection Held</h3>
                                <p className="text-sm font-medium text-slate-500">You physically visit the property. Your money is held safely by us.</p>
                            </div>
                            {/* Step 3 */}
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-white border-4 border-slate-100 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-slate-200/50">
                                    <Lock className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">3. Agreement Signed</h3>
                                <p className="text-sm font-medium text-slate-500">If you like it, pay the full rent into escrow and sign the legal docs.</p>
                            </div>
                            {/* Step 4 */}
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-white border-4 border-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-900/10">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">4. Funds Released</h3>
                                <p className="text-sm font-medium text-slate-500">You get the keys. We release the funds to the owner and agent.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Agents */}
            <section className="py-24 bg-white border-t border-slate-100 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-center md:text-left">
                        <div className="max-w-2xl mx-auto md:mx-0">
                            <span className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-2 block">Our Agents</span>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">Meet Our Excellent Agents</h2>
                            <p className="text-slate-500 font-medium text-base md:text-lg">Work with Nigeria's most trusted and verified real estate professionals.</p>
                        </div>

                        {/* Navigation Controls */}
                        <div className="hidden sm:flex items-center justify-center md:justify-end gap-3 shrink-0">
                            <button
                                onClick={() => handleManualScroll('left')}
                                aria-label="Scroll left"
                                className="w-12 h-12 rounded-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 flex items-center justify-center transition-all shadow-sm active:scale-95"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleManualScroll('right')}
                                aria-label="Scroll right"
                                className="w-12 h-12 rounded-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 flex items-center justify-center transition-all shadow-sm active:scale-95"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Auto-scrolling & Swipeable Track */}
                    <div className="relative">
                        {/* Soft edge fade masks for desktop */}
                        <div className="pointer-events-none hidden md:block absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
                        <div className="pointer-events-none hidden md:block absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

                        <div
                            ref={scrollRef}
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                            onTouchStart={() => setIsPaused(true)}
                            onTouchEnd={() => {
                                setTimeout(() => setIsPaused(false), 1500);
                            }}
                            className="flex overflow-x-auto gap-6 pb-6 pt-2 hide-scrollbar select-none"
                            style={{ scrollBehavior: 'auto', WebkitOverflowScrolling: 'touch' }}
                        >
                            {/* Duplicate array for seamless infinite auto-scroll */}
                            {[...agentsList, ...agentsList].map((agent, i) => (
                                <div
                                    key={i}
                                    className="w-[260px] sm:w-[280px] shrink-0 group bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1.5"
                                >
                                    <div className="aspect-[4/5] overflow-hidden relative">
                                        <img
                                            src={agent.img}
                                            alt={agent.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                                        />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                            <span className="text-[10px] font-extrabold text-slate-900 uppercase tracking-wider">KYC Verified</span>
                                        </div>
                                    </div>
                                    <div className="p-5 text-center">
                                        <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-900 transition-colors">{agent.name}</h4>
                                        <p className="text-xs sm:text-sm font-medium text-slate-500 mb-3">{agent.role}</p>
                                        <span className="inline-block text-[11px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{agent.deals}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mobile swipe hint */}
                        <div className="sm:hidden flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 mt-3">
                            <span>← Auto-scrolling · Swipe to explore →</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-blue-900 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-800 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-800 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-center md:text-left">
                        <div className="max-w-2xl mx-auto md:mx-0">
                            <span className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-2 block">Testimonials</span>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">What They Say About Us</h2>
                            <p className="text-blue-100 font-medium text-base md:text-lg">Don't just take our word for it. Hear from our satisfied users across Nigeria.</p>
                        </div>

                        {/* Navigation Controls */}
                        <div className="hidden sm:flex items-center justify-center md:justify-end gap-3 shrink-0">
                            <button
                                onClick={() => handleTestimonialsScroll('left')}
                                aria-label="Previous testimonials"
                                className="w-12 h-12 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all shadow-sm active:scale-95 backdrop-blur-sm"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleTestimonialsScroll('right')}
                                aria-label="Next testimonials"
                                className="w-12 h-12 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all shadow-sm active:scale-95 backdrop-blur-sm"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Auto-scrolling & Swipeable Track */}
                    <div className="relative">
                        {/* Soft edge fade masks for desktop */}
                        <div className="pointer-events-none hidden md:block absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-blue-900 via-blue-900/80 to-transparent z-10" />
                        <div className="pointer-events-none hidden md:block absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-blue-900 via-blue-900/80 to-transparent z-10" />

                        <div
                            ref={testimonialsRef}
                            onMouseEnter={() => setIsTestimonialsPaused(true)}
                            onMouseLeave={() => setIsTestimonialsPaused(false)}
                            onTouchStart={() => setIsTestimonialsPaused(true)}
                            onTouchEnd={() => {
                                setTimeout(() => setIsTestimonialsPaused(false), 1500);
                            }}
                            className="flex overflow-x-auto gap-6 pb-6 pt-2 hide-scrollbar select-none"
                            style={{ scrollBehavior: 'auto', WebkitOverflowScrolling: 'touch' }}
                        >
                            {[...testimonialsList, ...testimonialsList].map((testimonial, i) => (
                                <div
                                    key={i}
                                    className="w-[300px] sm:w-[380px] shrink-0 bg-white/10 backdrop-blur-md p-7 sm:p-8 rounded-3xl border border-white/20 relative flex flex-col justify-between transition-all duration-300 hover:bg-white/15 hover:border-white/30 hover:-translate-y-1"
                                >
                                    <div>
                                        {/* Stars & Tag */}
                                        <div className="flex items-center justify-between gap-2 mb-4">
                                            <div className="flex items-center gap-1 text-amber-400">
                                                {[...Array(5)].map((_, starIdx) => (
                                                    <Star key={starIdx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                ))}
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 bg-blue-950/60 border border-blue-800/60 px-2.5 py-1 rounded-full">
                                                {testimonial.verified}
                                            </span>
                                        </div>

                                        <h3 className="text-white font-bold text-base sm:text-lg mb-2 leading-snug">
                                            "{testimonial.headline}"
                                        </h3>

                                        <p className="text-blue-100/90 text-sm leading-relaxed mb-6 font-normal">
                                            "{testimonial.text}"
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3.5 pt-5 border-t border-white/15">
                                        <img
                                            src={testimonial.img}
                                            alt={testimonial.name}
                                            className="w-11 h-11 rounded-full object-cover border-2 border-white/30 shrink-0"
                                        />
                                        <div>
                                            <h4 className="text-white font-bold text-sm sm:text-base leading-tight">
                                                {testimonial.name}
                                            </h4>
                                            <p className="text-blue-200 text-xs font-medium mt-0.5">
                                                {testimonial.role} · {testimonial.city}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mobile swipe hint */}
                        <div className="sm:hidden flex items-center justify-center gap-2 text-xs font-semibold text-blue-200 mt-4">
                            <span>← Auto-scrolling · Swipe to explore →</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Role Selection / Onboarding CTA */}
            <section id="trust" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="bg-blue-900 rounded-[3rem] p-10 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-800 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>

                    <div className="relative z-10 max-w-xl text-center lg:text-left">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">Built for Trust.<br/>Designed for Nigeria.</h2>
                        <p className="text-blue-100 text-lg font-medium mb-10">Whether you are looking for a home, managing properties, or an agent closing deals—Rentify ensures zero fraud and full transparency.</p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link href={register()} className="bg-amber-500 text-white px-8 py-4 rounded-full font-extrabold hover:bg-amber-600 transition-all flex items-center justify-center gap-2 shadow-lg">
                                Join as Tenant
                            </Link>
                            <Link href={register()} className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-full font-extrabold hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                                <Building2 className="w-5 h-5" /> Owner / Agent
                            </Link>
                        </div>
                    </div>

                    {/* Trust Signals */}
                    <div className="relative z-10 grid grid-cols-2 gap-4 w-full max-w-md">
                        <div className="bg-blue-950/50 backdrop-blur-md p-6 rounded-3xl border border-blue-800/50 text-center">
                            <h4 className="text-3xl font-extrabold text-white mb-1">10k+</h4>
                            <p className="text-xs font-bold text-blue-200 uppercase tracking-widest">Verified Tenants</p>
                        </div>
                        <div className="bg-blue-950/50 backdrop-blur-md p-6 rounded-3xl border border-blue-800/50 text-center">
                            <h4 className="text-3xl font-extrabold text-white mb-1">₦2B+</h4>
                            <p className="text-xs font-bold text-blue-200 uppercase tracking-widest">Escrow Processed</p>
                        </div>
                        <div className="bg-blue-950/50 backdrop-blur-md p-6 rounded-3xl border border-blue-800/50 text-center col-span-2">
                            <h4 className="text-xl font-extrabold text-white mb-2 flex items-center justify-center gap-2">
                                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                                KYC Verified
                            </h4>
                            <p className="text-sm font-medium text-blue-200">Every agent and owner is verified using NIN and CAC documentation.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white pt-20 pb-12 border-t border-slate-200 text-slate-600">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    {/* Newsletter & Rental Alerts Banner */}
                    <div className="bg-slate-50 rounded-3xl p-8 sm:p-10 border border-slate-200/80 mb-16">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                            <div className="max-w-xl text-center lg:text-left">
                                <span className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-2 block">Rental Alerts</span>
                                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                                    Get Weekly Verified Rental Alerts
                                </h3>
                                <p className="text-slate-500 text-sm sm:text-base">
                                    Subscribe for first-look notifications on vetted apartments in Lekki, Ikoyi, Victoria Island, and Abuja.
                                </p>
                            </div>

                            <form onSubmit={(e) => e.preventDefault()} className="w-full lg:w-auto flex-1 max-w-md">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-1">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="email"
                                            placeholder="Enter your email address"
                                            className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-all shadow-sm"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-blue-900 hover:bg-blue-800 text-white text-sm font-bold px-7 py-3.5 rounded-full transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 shrink-0"
                                    >
                                        Subscribe <Send className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-xs text-slate-400 mt-2.5 text-center lg:text-left flex items-center justify-center lg:justify-start gap-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5 text-blue-900 shrink-0" />
                                    <span>Zero spam · Instant unsubscribe anytime · Bank-grade data protection</span>
                                </p>
                            </form>
                        </div>
                    </div>

                    {/* Main Footer Directory Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-16 border-b border-slate-100">
                        {/* Column 1: Brand & Contact */}
                        <div className="lg:col-span-2 pr-0 lg:pr-8">
                            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight text-blue-900 mb-4 hover:opacity-90 transition-opacity">
                                <div className="w-9 h-9 bg-blue-900 rounded-xl flex items-center justify-center shadow-inner">
                                    <ShieldCheck className="text-white w-5 h-5" />
                                </div>
                                Rent<span className="text-amber-500">ify</span>
                            </Link>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-sm">
                                Nigeria's foremost escrow-backed rental marketplace. We eliminate fraudulent inspection fees, hold deposits in secure vaults, and modernize residential leases.
                            </p>

                            {/* Trust Signals */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
                                    NDPR Compliant
                                </span>
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
                                    CAC RC: 1894022
                                </span>
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
                                    Escrow Protected
                                </span>
                            </div>

                            {/* Contact Details */}
                            <div className="space-y-2.5 text-xs text-slate-500">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                                    <span>Victoria Island, Lagos · CBD, Abuja</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                                    <a href="mailto:support@rentify.ng" className="hover:text-blue-900 transition-colors">support@rentify.ng</a>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                                    <span>+234 (01) 888-RENT · Mon - Sat: 8AM - 7PM</span>
                                </div>
                            </div>
                        </div>

                        {/* Column 2: For Renters */}
                        <div>
                            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 mb-4">
                                For Renters
                            </h4>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <Link href="/browse" className="text-slate-600 hover:text-blue-900 transition-colors">
                                        Browse Verified Homes
                                    </Link>
                                </li>
                                <li>
                                    <a href="#escrow" className="text-slate-600 hover:text-blue-900 transition-colors">
                                        How Escrow Works
                                    </a>
                                </li>
                                <li>
                                    <Link href="/browse?location=Lekki" className="text-slate-600 hover:text-blue-900 transition-colors">
                                        Flats in Lekki Phase 1
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/browse?location=Ikoyi" className="text-slate-600 hover:text-blue-900 transition-colors">
                                        Luxury Homes in Ikoyi
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/browse?location=Abuja" className="text-slate-600 hover:text-blue-900 transition-colors">
                                        Duplexes in Abuja
                                    </Link>
                                </li>
                                <li>
                                    <a href="#trust" className="text-slate-600 hover:text-blue-900 transition-colors">
                                        Anti-Fraud Guide
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Column 3: For Landlords & Agents */}
                        <div>
                            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 mb-4">
                                Landlords & Agents
                            </h4>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <Link href={register()} className="text-slate-600 hover:text-blue-900 transition-colors">
                                        List a Property
                                    </Link>
                                </li>
                                <li>
                                    <a href="#trust" className="text-slate-600 hover:text-blue-900 transition-colors">
                                        Automated Rent Payouts
                                    </a>
                                </li>
                                <li>
                                    <a href="#trust" className="text-slate-600 hover:text-blue-900 transition-colors">
                                        Verified Agent Network
                                    </a>
                                </li>
                                <li>
                                    <a href="#trust" className="text-slate-600 hover:text-blue-900 transition-colors">
                                        NIN & CAC Screening
                                    </a>
                                </li>
                                <li>
                                    <a href="#trust" className="text-slate-600 hover:text-blue-900 transition-colors">
                                        Digital Lease Agreements
                                    </a>
                                </li>
                                <li>
                                    <Link href={login()} className="text-slate-600 hover:text-blue-900 transition-colors">
                                        Owner Portal Login
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Column 4: Trust & Legal */}
                        <div>
                            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 mb-4">
                                Trust & Legal
                            </h4>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <a href="#" className="text-slate-600 hover:text-blue-900 transition-colors">
                                        About Rentify
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-slate-600 hover:text-blue-900 transition-colors">
                                        Careers
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-slate-600 hover:text-blue-900 transition-colors">
                                        Terms of Service
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-slate-600 hover:text-blue-900 transition-colors">
                                        Privacy Policy & NDPR
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-slate-600 hover:text-blue-900 transition-colors">
                                        Dispute Resolution Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="mailto:support@rentify.ng" className="text-slate-600 hover:text-blue-900 transition-colors">
                                        Help Center & Support
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Payment Rails Strip */}
                    <div className="py-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
                            <CreditCard className="w-4 h-4 text-slate-400" />
                            <span>Secured Payment Infrastructure</span>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <span className="px-3 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600">Mastercard</span>
                            <span className="px-3 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600">Visa</span>
                            <span className="px-3 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600">Verve</span>
                            <span className="px-3 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600">NIBSS Transfer</span>
                            <span className="px-3 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600">Paystack</span>
                        </div>
                    </div>

                    {/* Bottom Legal & Social Bar */}
                    <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-400">
                        <div>
                            © 2026 Rentify Technologies Ltd. All rights reserved.
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-2">
                            <a href="#" aria-label="Twitter" className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-blue-900 flex items-center justify-center transition-colors">
                                <Twitter className="w-3.5 h-3.5" />
                            </a>
                            <a href="#" aria-label="LinkedIn" className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-blue-900 flex items-center justify-center transition-colors">
                                <Linkedin className="w-3.5 h-3.5" />
                            </a>
                            <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-blue-900 flex items-center justify-center transition-colors">
                                <Instagram className="w-3.5 h-3.5" />
                            </a>
                            <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-blue-900 flex items-center justify-center transition-colors">
                                <Facebook className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
