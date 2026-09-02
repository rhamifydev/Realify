import { Head, Link, useForm, router } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import { ShieldCheck, MapPin, Search, CheckCircle2, ChevronRight, Star, Home, Building2, Wallet, Filter, Navigation, Loader2, MapPinOff, Bed, Bath, SlidersHorizontal, X, Menu } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useState, useEffect, useCallback } from 'react';

function formatDistance(distance: number | undefined): string | null {
    if (distance === undefined || distance === null) return null;
    if (distance < 1) return `${Math.round(distance * 1000)}m away`;
    if (distance < 10) return `${distance.toFixed(1)}km away`;
    return `${Math.round(distance)}km away`;
}

export default function Browse({ properties, filters, auth, userLocation }: any) {
    const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable'>('idle');
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(userLocation || null);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const { data, setData, get, processing } = useForm({
        location: filters?.location || '',
        type: filters?.type || '',
        category: filters?.category || '',
        bedrooms: filters?.bedrooms || '',
        bathrooms: filters?.bathrooms || '',
        max_price: filters?.max_price || '',
        lat: userLocation?.lat?.toString() || '',
        lng: userLocation?.lng?.toString() || '',
    });

    // Request geolocation on mount (only once)
    useEffect(() => {
        if (userLocation) {
            setLocationStatus('granted');
            return;
        }

        if (!navigator.geolocation) {
            setLocationStatus('unavailable');
            return;
        }

        setLocationStatus('requesting');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCoords({ lat: latitude, lng: longitude });
                setLocationStatus('granted');

                // Navigate with geolocation params to get distance-sorted results
                router.get('/browse', {
                    ...filters,
                    lat: latitude.toString(),
                    lng: longitude.toString(),
                }, {
                    preserveState: false,
                    preserveScroll: false,
                });
            },
            (error) => {
                console.log('Geolocation error:', error.message);
                setLocationStatus(error.code === 1 ? 'denied' : 'unavailable');
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 300000, // Cache position for 5 minutes
            }
        );
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params: Record<string, string> = {};
        if (data.location) params.location = data.location;
        if (data.type) params.type = data.type;
        if (data.category) params.category = data.category;
        if (data.bedrooms) params.bedrooms = data.bedrooms;
        if (data.bathrooms) params.bathrooms = data.bathrooms;
        if (data.max_price) params.max_price = data.max_price;
        if (coords) {
            params.lat = coords.lat.toString();
            params.lng = coords.lng.toString();
        }
        router.get('/browse', params, { preserveState: false });
    };

    return (
        <div className="antialiased bg-[#F8FAFC] text-slate-900 min-h-screen font-sans">
            <Head title="Browse Properties — Rentify" />

            {/* Mobile Top Bar */}
            <div className="md:hidden flex items-center justify-between px-4 h-14 border-b border-slate-200 bg-white sticky top-0 z-50">
                <div className="flex items-center">
                    <Link href="/" className="flex items-center text-sm font-semibold text-slate-600 hover:text-blue-900 transition-colors">
                        <Home className="w-4 h-4 mr-1.5" />
                        Home
                    </Link>
                    <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-900">Browse</span>
                </div>

                {/* Mobile Menu */}
                <div className="flex items-center">
                    <Sheet>
                        <SheetTrigger className="p-2 -mr-2 text-slate-600 hover:text-blue-900">
                            <Menu className="w-6 h-6" />
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-white w-[300px] sm:w-[400px]">
                            <SheetHeader className="mb-8 mt-4 text-left">
                                <SheetTitle className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-blue-900">
                                    <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
                                        <ShieldCheck className="text-white w-5 h-5" />
                                    </div>
                                    Rent<span className="text-amber-500">ify</span>
                                </SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-6">
                                <Link href="/browse" className="text-lg font-bold text-slate-900 hover:text-blue-900">Find a Home</Link>
                                <a href="/#escrow" className="text-lg font-bold text-slate-900 hover:text-blue-900">How Escrow Works</a>
                                <a href="/#trust" className="text-lg font-bold text-slate-900 hover:text-blue-900">Trust & Safety</a>
                                <div className="h-px bg-slate-100 my-2"></div>
                                {auth?.user ? (
                                    <Link href={dashboard()} className="bg-blue-900 text-white px-6 py-3 rounded-full text-center font-bold hover:bg-blue-800 transition-all">Go to Dashboard</Link>
                                ) : (
                                    <>
                                        <Link href={login()} className="text-lg font-bold text-slate-900 hover:text-blue-900">Log In</Link>
                                        <Link href={register()} className="bg-blue-900 text-white px-6 py-3 rounded-full text-center font-bold hover:bg-blue-800 transition-all">Sign Up</Link>
                                    </>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Find your next home</h1>
                        <p className="text-slate-500 font-medium text-lg">100% Escrow Protected. Verified listings only.</p>
                    </div>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="mb-6">
                    <div className="bg-white p-2 rounded-[2rem] shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col sm:flex-row items-center gap-2 relative z-20">
                        <div className="flex-1 w-full px-6 py-3 hover:bg-slate-50 rounded-3xl transition-colors">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Location</label>
                            <input 
                                type="text" 
                                value={data.location}
                                onChange={(e) => setData('location', e.target.value)}
                                placeholder="City, State or Neighborhood" 
                                className="w-full bg-transparent outline-none border-none text-sm font-semibold text-slate-900 placeholder:text-slate-400 p-0 focus:ring-0" 
                            />
                        </div>
                        <div className="hidden sm:block w-px h-10 bg-slate-200"></div>
                        <div className="flex-1 w-full px-6 py-3 hover:bg-slate-50 rounded-3xl transition-colors">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Category</label>
                            <select 
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                                className="w-full bg-transparent outline-none border-none text-sm font-semibold text-slate-900 cursor-pointer p-0 focus:ring-0"
                            >
                                <option value="">All Categories</option>
                                <option value="residential">Residential</option>
                                <option value="commercial">Commercial</option>
                            </select>
                        </div>
                        <div className="hidden sm:block w-px h-10 bg-slate-200"></div>
                        <div className="flex-1 w-full px-6 py-3 hover:bg-slate-50 rounded-3xl transition-colors">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Listing Type</label>
                            <select 
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                className="w-full bg-transparent outline-none border-none text-sm font-semibold text-slate-900 cursor-pointer p-0 focus:ring-0"
                            >
                                <option value="">Any Type</option>
                                <option value="rent">For Rent</option>
                                <option value="sale">For Sale</option>
                                <option value="sale_or_rent">Sale or Rent</option>
                            </select>
                        </div>
                        <button 
                            type="button" 
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className={`w-full sm:w-14 sm:h-14 rounded-full font-bold flex items-center justify-center transition-all shrink-0 py-3 sm:py-0 border ${showAdvanced ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-transparent border-slate-200 text-slate-400 hover:bg-slate-50'}`}
                        >
                            <SlidersHorizontal className="w-5 h-5" />
                            <span className="sm:hidden ml-2">Advanced</span>
                        </button>
                        <button type="submit" disabled={processing} className="w-full sm:w-14 sm:h-14 bg-amber-500 text-white rounded-full font-bold flex items-center justify-center hover:bg-amber-600 transition-all shadow-md shrink-0 py-3 sm:py-0 disabled:opacity-50">
                            <Search className="w-5 h-5" />
                            <span className="sm:hidden ml-2">Search</span>
                        </button>
                    </div>

                    {/* Advanced Search Panel */}
                    {showAdvanced && (
                        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 mt-2 animate-in slide-in-from-top-4 fade-in duration-300 relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Advanced Filters</h3>
                                <button type="button" onClick={() => setShowAdvanced(false)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Bedrooms</label>
                                    <select 
                                        value={data.bedrooms}
                                        onChange={(e) => setData('bedrooms', e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 px-4 py-3"
                                    >
                                        <option value="">Any Bedrooms</option>
                                        <option value="1">1 Bedroom</option>
                                        <option value="2">2 Bedrooms</option>
                                        <option value="3">3 Bedrooms</option>
                                        <option value="4+">4+ Bedrooms</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Bathrooms</label>
                                    <select 
                                        value={data.bathrooms}
                                        onChange={(e) => setData('bathrooms', e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 px-4 py-3"
                                    >
                                        <option value="">Any Bathrooms</option>
                                        <option value="1">1 Bathroom</option>
                                        <option value="2">2 Bathrooms</option>
                                        <option value="3+">3+ Bathrooms</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Max Price (₦)</label>
                                    <select 
                                        value={data.max_price}
                                        onChange={(e) => setData('max_price', e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 px-4 py-3"
                                    >
                                        <option value="">Any Price</option>
                                        <option value="500000">Up to ₦500,000</option>
                                        <option value="1000000">Up to ₦1,000,000</option>
                                        <option value="2000000">Up to ₦2,000,000</option>
                                        <option value="5000000">Up to ₦5,000,000</option>
                                        <option value="10000000">Up to ₦10,000,000</option>
                                        <option value="50000000">Up to ₦50,000,000</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold hover:bg-slate-800 transition-colors">
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    )}
                </form>

                {/* Location Status Banner */}
                {locationStatus === 'granted' && userLocation && (
                    <div className="flex items-center gap-2.5 px-5 py-3 mb-8 bg-emerald-50 border border-emerald-100 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-500">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                            <Navigation className="w-4 h-4 text-emerald-600" />
                        </div>
                        <p className="text-sm font-semibold text-emerald-800">
                            📍 Showing properties nearest to your location first
                        </p>
                    </div>
                )}
                {locationStatus === 'requesting' && !userLocation && (
                    <div className="flex items-center gap-2.5 px-5 py-3 mb-8 bg-blue-50 border border-blue-100 rounded-2xl">
                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                        <p className="text-sm font-semibold text-blue-800">
                            Detecting your location to show nearest properties...
                        </p>
                    </div>
                )}
                {locationStatus === 'denied' && (
                    <div className="flex items-center gap-2.5 px-5 py-3 mb-8 bg-amber-50 border border-amber-100 rounded-2xl">
                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                            <MapPinOff className="w-4 h-4 text-amber-600" />
                        </div>
                        <p className="text-sm font-semibold text-amber-800">
                            Enable location access to see properties nearest to you. You can still search by city or state above.
                        </p>
                    </div>
                )}

                {/* Property Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {properties.data.length === 0 ? (
                        <div className="col-span-full py-24 text-center">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">No properties found</h3>
                            <p className="text-slate-500">Try adjusting your search filters to find what you're looking for.</p>
                        </div>
                    ) : (
                        properties.data.map((property: any) => (
                            <Link key={property.id} href={`/browse/${property.id}`} className="group block">
                                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-slate-200 shadow-sm border border-slate-100">
                                    <img 
                                        src={property.media?.[0]?.file_path ? `/storage/${property.media[0].file_path}` : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop'} 
                                        alt={property.title} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                    />
                                    
                                    <div className="absolute top-4 left-4 flex items-center gap-2">
                                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                            <span className="text-[10px] font-extrabold text-slate-900 uppercase tracking-wider">Verified</span>
                                        </div>
                                        {property.category && (
                                            <div className={`backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm ${
                                                property.category === 'commercial' 
                                                    ? 'bg-violet-100/90 text-violet-700' 
                                                    : 'bg-sky-100/90 text-sky-700'
                                            }`}>
                                                {property.category}
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                                        <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-white shadow-sm">
                                            {property.units?.length || 0} Unit{property.units?.length !== 1 ? 's' : ''}
                                        </div>
                                        {property.type && (
                                            <div className={`backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold shadow-sm ${
                                                property.type === 'rent' ? 'bg-emerald-500/90 text-white' :
                                                property.type === 'sale' ? 'bg-blue-500/90 text-white' :
                                                'bg-amber-500/90 text-white'
                                            }`}>
                                                {property.type === 'rent' ? 'For Rent' : property.type === 'sale' ? 'For Sale' : 'Sale / Rent'}
                                            </div>
                                        )}
                                    </div>

                                    {/* Distance badge */}
                                    {property.distance !== undefined && property.distance !== null && (
                                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                                            <Navigation className="w-3.5 h-3.5 text-blue-600" />
                                            <span className="text-[11px] font-bold text-slate-700">
                                                {formatDistance(property.distance)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex justify-between items-start">
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-lg font-bold text-slate-900 mb-1 truncate">{property.title}</h3>
                                        <p className="text-sm font-medium text-slate-500 flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5 shrink-0" /> 
                                            <span className="truncate">{property.city || 'Lagos'}, {property.state || 'Lagos'}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Quick stats */}
                                {property.units?.[0] && property.category !== 'commercial' && (
                                    <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-slate-500">
                                        {property.units[0].bedrooms > 0 && (
                                            <span className="flex items-center gap-1">
                                                <Bed className="w-3.5 h-3.5" /> {property.units[0].bedrooms} Bed{property.units[0].bedrooms !== 1 ? 's' : ''}
                                            </span>
                                        )}
                                        {property.units[0].bathrooms > 0 && (
                                            <span className="flex items-center gap-1">
                                                <Bath className="w-3.5 h-3.5" /> {property.units[0].bathrooms} Bath{property.units[0].bathrooms !== 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="mt-3">
                                    {property.units?.[0] ? (
                                        <>
                                            <span className="text-xl font-extrabold text-slate-900">
                                                ₦{Number(property.units[0].rent_price).toLocaleString()}
                                            </span>
                                            <span className="text-sm font-medium text-slate-500"> / year</span>
                                        </>
                                    ) : (
                                        <span className="text-sm font-medium text-slate-500">Price on request</span>
                                    )}
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {properties.links && properties.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                        {properties.links.map((link: any, index: number) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                    link.active
                                        ? 'bg-blue-900 text-white shadow-md'
                                        : link.url
                                            ? 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                            : 'text-slate-300 cursor-not-allowed'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                preserveState
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
