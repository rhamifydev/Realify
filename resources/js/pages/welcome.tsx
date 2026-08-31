import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import { ShieldCheck, MapPin, Search, Home as HomeIcon, CheckCircle2, ChevronRight, Lock, Star, Building2, Wallet, Heart } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage().props as any;

    const featuredListings = [
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

    return (
        <div className="antialiased bg-[#F8FAFC] text-slate-900 min-h-screen font-sans selection:bg-blue-900 selection:text-white">
            <Head title="Rentify — Escrow-Protected Rentals" />

            <style dangerouslySetInnerHTML={{__html: `
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-[100] px-4 md:px-8 py-4 flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
                <div className="flex items-center gap-12">
                    <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-blue-900">
                        <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
                            <ShieldCheck className="text-white w-5 h-5" />
                        </div>
                        Rent<span className="text-amber-500">ify</span>
                    </Link>
                    <div className="hidden lg:flex items-center gap-6">
                        <Link href="/browse" className="text-sm font-semibold text-slate-600 hover:text-blue-900 transition-colors">Find a Home</Link>
                        <a href="#escrow" className="text-sm font-semibold text-slate-600 hover:text-blue-900 transition-colors">How Escrow Works</a>
                        <a href="#trust" className="text-sm font-semibold text-slate-600 hover:text-blue-900 transition-colors">Trust & Safety</a>
                    </div>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                    {auth.user ? (
                        <Link href={dashboard()} className="bg-blue-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-800 transition-all shadow-md shadow-blue-900/20">Go to Dashboard</Link>
                    ) : (
                        <>
                            <Link href={login()} className="hidden sm:block text-sm font-bold text-slate-600 hover:text-blue-900 transition-colors px-2">Log In</Link>
                            <Link href={register()} className="bg-blue-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-800 transition-all shadow-md shadow-blue-900/20">Sign Up</Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">100% Escrow Protected Rentals</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-slate-900">
                            Find your next home.<br/>
                            <span className="text-blue-900">Keep your money safe.</span>
                        </h1>
                        
                        <p className="text-lg md:text-xl text-slate-600 font-medium max-w-lg leading-relaxed">
                            Rentify holds your rent and fees in a secure escrow vault until you physically inspect the property and sign the agreement. No scams, total peace of mind.
                        </p>

                        {/* Search Bar - Airbnb Style */}
                        <div className="bg-white p-2 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col sm:flex-row items-center gap-2 max-w-xl">
                            <div className="flex-1 w-full px-6 py-3 hover:bg-slate-50 rounded-3xl transition-colors cursor-text">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Location</label>
                                <input type="text" placeholder="Where do you want to live?" className="w-full bg-transparent outline-none border-none text-sm font-semibold text-slate-900 placeholder:text-slate-400 p-0 focus:ring-0" />
                            </div>
                            <div className="hidden sm:block w-px h-10 bg-slate-200"></div>
                            <div className="flex-1 w-full px-6 py-3 hover:bg-slate-50 rounded-3xl transition-colors cursor-pointer">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Property Type</label>
                                <select className="w-full bg-transparent outline-none border-none text-sm font-semibold text-slate-900 cursor-pointer p-0 focus:ring-0">
                                    <option>Any Type</option>
                                    <option>Apartment</option>
                                    <option>Duplex</option>
                                    <option>Studio</option>
                                </select>
                            </div>
                            <button className="w-full sm:w-14 sm:h-14 bg-amber-500 text-white rounded-full font-bold flex items-center justify-center hover:bg-amber-600 transition-all shadow-md shrink-0 py-3 sm:py-0">
                                <Search className="w-5 h-5" />
                                <span className="sm:hidden ml-2">Search</span>
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        {/* Abstract Fintech / Real Estate Visual */}
                        <div className="relative z-10 bg-white rounded-[2.5rem] p-4 shadow-2xl shadow-blue-900/10 border border-slate-100">
                            <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop" alt="Luxury Home" className="w-full h-[400px] object-cover rounded-[2rem]" />
                            
                            {/* Floating Fintech Badge */}
                            <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-3xl shadow-xl border border-slate-100 flex items-center gap-4 animate-float">
                                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                    <Lock className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Funds Secured</p>
                                    <p className="text-lg font-extrabold text-slate-900">₦4,500,000</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Listings (Airbnb Style) */}
            <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Verified Properties in Lagos</h2>
                        <p className="text-slate-500 font-medium">Showing 1,240 properties found across Lagos State.</p>
                    </div>
                    <div className="hidden sm:flex gap-2">
                        <button className="w-10 h-10 border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-50">
                            <MapPin className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 border border-slate-200 rounded-lg flex items-center justify-center bg-slate-50 text-slate-900">
                            <HomeIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {featuredListings.map((listing, i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-4 shadow-sm border border-slate-100">
                                <img src={listing.img} alt={listing.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                
                                {/* Gradient for bottom text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                                
                                {/* Top Badges */}
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className="bg-[#1e3a8a] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">Verified</span>
                                    {i === 0 && <span className="bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">3D Tour</span>}
                                    {i === 2 && <span className="bg-amber-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">Selling Fast</span>}
                                </div>
                                
                                {/* Top Right Heart */}
                                <button className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm">
                                    <Heart className="w-4 h-4 text-slate-700" />
                                </button>

                                {/* Floating Bottom Price & Units */}
                                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                                    <div className="text-white">
                                        <span className="text-[26px] font-extrabold">{listing.price}</span>
                                        <span className="text-sm font-medium opacity-80">{listing.period}</span>
                                    </div>
                                    <div className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${listing.units === 'SINGLE UNIT' ? 'text-slate-300' : 'text-emerald-400'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${listing.units === 'SINGLE UNIT' ? 'bg-slate-300' : 'bg-emerald-400'}`}></span>
                                        {listing.units}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Below Image Details */}
                            <div>
                                <h3 className="text-[13px] sm:text-[17px] font-bold text-slate-900 mb-1 leading-snug truncate">{listing.title}</h3>
                                <p className="text-[11px] sm:text-[13px] font-medium text-slate-500 truncate">
                                    {listing.location} • {i === 0 ? '2' : (i === 1 ? '5' : '1')} Baths • {i === 0 ? 'Gym' : (i === 1 ? 'Pool' : 'Gated')}
                                </p>
                            </div>
                        </div>
                    ))}
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
            <footer className="bg-white pt-20 pb-10 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                        <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-blue-900">
                            <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
                                <ShieldCheck className="text-white w-5 h-5" />
                            </div>
                            Rent<span className="text-amber-500">ify</span>
                        </Link>
                        
                        <div className="flex gap-8 text-sm font-bold text-slate-500">
                            <a href="#" className="hover:text-blue-900 transition-colors">About Us</a>
                            <a href="#" className="hover:text-blue-900 transition-colors">Help Center</a>
                            <a href="#" className="hover:text-blue-900 transition-colors">Terms & Privacy</a>
                        </div>
                    </div>
                    
                    <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">© 2026 Rentify Technologies Ltd.</div>
                        <div className="flex items-center gap-4">
                            <i className="fa-brands fa-cc-visa text-3xl text-slate-300"></i>
                            <i className="fa-brands fa-cc-mastercard text-3xl text-slate-300"></i>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
