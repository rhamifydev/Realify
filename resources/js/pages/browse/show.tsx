import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import { ShieldCheck, MapPin, CheckCircle2, Bed, Bath, Home, ChevronLeft, Calendar, Shield, CreditCard, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BrowseShow({ property, auth }: any) {
    const { post, processing } = useForm();
    const primaryUnit = property.units?.[0] || null;

    const handleBook = () => {
        post(`/browse/${property.id}/book`);
    };

    return (
        <div className="antialiased bg-[#F8FAFC] text-slate-900 min-h-screen font-sans">
            <Head title={`${property.title} — Rentify`} />

            {/* Navbar */}
            <nav className="sticky top-0 z-[100] px-4 md:px-8 py-4 flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
                <div className="flex items-center gap-6">
                    <Link href="/browse" className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors">
                        <ChevronLeft className="w-5 h-5 text-slate-600" />
                    </Link>
                    <Link href="/" className="hidden md:flex items-center gap-2 text-xl font-extrabold tracking-tight text-blue-900">
                        <div className="w-7 h-7 bg-blue-900 rounded-lg flex items-center justify-center">
                            <ShieldCheck className="text-white w-4 h-4" />
                        </div>
                        Rent<span className="text-amber-500">ify</span>
                    </Link>
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

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
                {/* Image Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 h-[50vh] md:h-[60vh]">
                    <div className="rounded-l-[2rem] overflow-hidden h-full">
                        <img 
                            src={property.media?.[0]?.file_path ? `/storage/${property.media[0].file_path}` : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop'} 
                            alt={property.title} 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                        />
                    </div>
                    <div className="hidden md:grid grid-rows-2 gap-4 h-full">
                        <div className="rounded-tr-[2rem] overflow-hidden relative">
                            <img 
                                src={property.media?.[1]?.file_path ? `/storage/${property.media[1].file_path}` : 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop'} 
                                alt="Gallery 2" 
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                            />
                        </div>
                        <div className="rounded-br-[2rem] overflow-hidden relative group">
                            <img 
                                src={property.media?.[2]?.file_path ? `/storage/${property.media[2].file_path}` : 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?q=80&w=800&auto=format&fit=crop'} 
                                alt="Gallery 3" 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" 
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center cursor-pointer hover:bg-black/30 transition-all">
                                <span className="text-white font-extrabold text-lg flex items-center gap-2">
                                    <Home className="w-5 h-5" /> View all photos
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-10">
                        {/* Title & Basics */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest rounded-full">
                                    <CheckCircle2 className="w-4 h-4" /> Escrow Eligible
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest rounded-full">
                                    {property.type}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">{property.title}</h1>
                            <p className="text-lg font-medium text-slate-500 flex items-center gap-2 mb-6">
                                <MapPin className="w-5 h-5 text-slate-400" /> {property.address}, {property.city}, {property.state}
                            </p>
                            
                            {/* Key Features */}
                            <div className="flex flex-wrap items-center gap-6 py-6 border-y border-slate-200">
                                <div className="flex items-center gap-3">
                                    <Bed className="w-6 h-6 text-blue-900" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{primaryUnit?.bedrooms || 0} Beds</p>
                                    </div>
                                </div>
                                <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>
                                <div className="flex items-center gap-3">
                                    <Bath className="w-6 h-6 text-blue-900" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{primaryUnit?.bathrooms || 0} Baths</p>
                                    </div>
                                </div>
                                <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>
                                <div className="flex items-center gap-3">
                                    <Home className="w-6 h-6 text-blue-900" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{property.structure_type}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-2xl font-extrabold text-slate-900 mb-4">About this property</h2>
                            <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-line">
                                {property.description || 'This beautiful property is available for rent immediately. Contact the agent to schedule an inspection.'}
                            </p>
                        </div>

                        {/* Owner/Agent Profile */}
                        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
                            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop" alt="Agent" className="w-24 h-24 rounded-full object-cover border-4 border-slate-50" />
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                    <h3 className="text-xl font-bold text-slate-900">{property.user?.name || 'Verified Agent'}</h3>
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                </div>
                                <p className="text-sm font-medium text-slate-500 mb-4">Joined in {new Date(property.user?.created_at || Date.now()).getFullYear()}</p>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                    <span className="flex items-center gap-1 text-sm font-bold text-slate-900">
                                        <Shield className="w-4 h-4 text-blue-600" /> Identity Verified
                                    </span>
                                    <span className="flex items-center gap-1 text-sm font-bold text-slate-900">
                                        <Home className="w-4 h-4 text-amber-500" /> 12 Properties
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking / Payment Card */}
                    <div className="lg:pl-8">
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-24">
                            {primaryUnit ? (
                                <>
                                    <div className="mb-6 pb-6 border-b border-slate-100">
                                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Rent</p>
                                        <h3 className="text-4xl font-extrabold text-slate-900">
                                            ₦{Number(primaryUnit.rent_price).toLocaleString()}
                                            <span className="text-lg font-medium text-slate-500"> / yr</span>
                                        </h3>
                                    </div>
                                    
                                    <div className="space-y-4 mb-8">
                                        <h4 className="font-bold text-slate-900">Required Upfront (Escrow)</h4>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 font-medium underline decoration-dashed">Rent (1 yr)</span>
                                            <span className="font-bold text-slate-900">₦{Number(primaryUnit.rent_price).toLocaleString()}</span>
                                        </div>
                                        {primaryUnit.caution_deposit > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500 font-medium underline decoration-dashed">Caution Deposit</span>
                                                <span className="font-bold text-slate-900">₦{Number(primaryUnit.caution_deposit).toLocaleString()}</span>
                                            </div>
                                        )}
                                        {primaryUnit.agency_fee > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500 font-medium underline decoration-dashed">Agency Fee</span>
                                                <span className="font-bold text-slate-900">₦{Number(primaryUnit.agency_fee).toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-sm pt-4 border-t border-slate-100">
                                            <span className="text-slate-900 font-extrabold">Total Move-in Cost</span>
                                            <span className="font-extrabold text-blue-900">
                                                ₦{(Number(primaryUnit.rent_price) + Number(primaryUnit.caution_deposit || 0) + Number(primaryUnit.agency_fee || 0)).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-amber-50 rounded-2xl p-4 mb-6 border border-amber-100 flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                                        <div>
                                            <h5 className="text-sm font-bold text-slate-900 mb-1">First step: Inspection</h5>
                                            <p className="text-xs font-medium text-slate-600">Pay a refundable ₦5,000 inspection fee into Escrow to book a physical tour.</p>
                                        </div>
                                    </div>

                                    <Button 
                                        onClick={handleBook} 
                                        disabled={processing}
                                        className="w-full h-14 bg-blue-900 hover:bg-blue-800 text-white rounded-full text-base font-bold shadow-lg shadow-blue-900/20"
                                    >
                                        {processing ? 'Processing...' : 'Book Inspection (₦5,000)'}
                                    </Button>

                                    <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-slate-500">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                        You won't be charged the full rent yet.
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Not Available</h3>
                                    <p className="text-slate-500 text-sm">This property currently has no units listed.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
