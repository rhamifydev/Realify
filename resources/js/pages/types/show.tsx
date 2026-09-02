import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BedDouble, Building2, MapPin, ShieldCheck, ShowerHead } from 'lucide-react';
import PublicHeader from '@/components/public-header';

interface Property {
    id: number;
    title: string;
    location: string;
    price: number;
    img: string;
    beds: number;
    baths: number;
    type: string;
}

interface PropertyType {
    slug: string;
    name: string;
    img: string;
}

const formatPrice = (price: number) => `₦${new Intl.NumberFormat('en-NG').format(price)}`;

export default function TypeProperties({ type, properties = [] }: { type: PropertyType; properties?: Property[] }) {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <Head title={`${type.name} Properties — Rentify`} />
            <PublicHeader categories={[{ name: type.name, query: type.slug }]} />

            <main className="mx-auto max-w-7xl px-4 pb-12 pt-28 md:px-8 md:pb-16 md:pt-36">
                <Link href="/types" className="mb-8 flex w-fit items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-900">
                    <ArrowLeft className="h-4 w-4" /> All property types
                </Link>
                <div className="relative mb-10 overflow-hidden rounded-3xl bg-slate-900 px-6 py-10 md:px-12 md:py-16">
                    <img src={type.img} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
                    <div className="absolute inset-0 bg-slate-950/55" />
                    <div className="relative max-w-2xl">
                        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-amber-300">Property type</p>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl">{type.name} properties</h1>
                        <p className="mt-4 text-lg font-medium text-white/80">Browse all available {type.name.toLowerCase()} properties on Rentify.</p>
                    </div>
                </div>

                {properties.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                        {properties.map((property) => (
                            <Link key={property.id} href={`/browse/${property.id}`} className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
                                <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
                                    <img src={property.img} alt={property.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" onError={(event) => { event.currentTarget.src = '/images/lagos.jpg'; }} />
                                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-extrabold text-blue-900 sm:left-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-xs">Verified listing</span>
                                </div>
                                <div className="p-3 sm:p-5">
                                    <p className="text-lg font-extrabold text-slate-900 sm:text-xl">{formatPrice(property.price)} <span className="text-[10px] font-semibold text-slate-400 sm:text-xs">/ year</span></p>
                                    <h2 className="mt-1.5 truncate text-sm font-bold text-slate-900 group-hover:text-blue-900 sm:mt-2 sm:text-base">{property.title}</h2>
                                    <p className="mt-1 flex items-center gap-1 text-xs font-medium text-slate-500 sm:text-sm"><MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> {property.location}</p>
                                    <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3 text-[10px] font-bold text-slate-500 sm:mt-4 sm:gap-4 sm:pt-4 sm:text-xs">
                                        <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5 text-blue-900 sm:h-4 sm:w-4" /> {property.beds} beds</span>
                                        <span className="flex items-center gap-1"><ShowerHead className="h-3.5 w-3.5 text-blue-900 sm:h-4 sm:w-4" /> {property.baths} baths</span>
                                        <span className="ml-auto flex items-center gap-1 text-blue-900">View <ArrowLeft className="h-3 w-3 rotate-180 sm:h-3.5 sm:w-3.5" /></span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                        <Building2 className="mx-auto h-8 w-8 text-blue-900" />
                        <h2 className="mt-4 text-xl font-bold">No {type.name.toLowerCase()} properties available</h2>
                        <Link href="/types" className="mt-4 inline-flex text-sm font-bold text-blue-900 hover:text-blue-700">Browse other types</Link>
                    </div>
                )}
            </main>
        </div>
    );
}
