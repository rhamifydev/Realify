import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Building2, MapPin } from 'lucide-react';
import PublicHeader from '@/components/public-header';

interface City {
    city: string;
    count: number;
    img: string;
}

export default function Cities({ cities = [] }: { cities?: City[] }) {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <Head title="Explore Cities — Rentify" />

            <PublicHeader categories={[
                { name: 'Residential', query: 'residential' },
                { name: 'Apartment', query: 'residential' },
                { name: 'Industrial', query: 'industrial' },
                { name: 'Commercial', query: 'commercial' },
                { name: 'Building Code', query: 'building-code' },
            ]} />

            <main className="mx-auto max-w-7xl px-4 pb-10 pt-28 md:px-8 md:pb-16 md:pt-36">
                <Link href="/" className="mb-8 ml-auto flex w-fit items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-900">
                    <ArrowLeft className="h-4 w-4" /> Back to home
                </Link>

                <div className="mx-auto mb-10 max-w-3xl text-center">
                    <p className="mb-3 text-sm font-bold uppercase tracking-widest text-amber-500">Explore Nigeria</p>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl">Find a city to call home.</h1>
                    <p className="mt-4 text-lg font-medium leading-relaxed text-slate-500">Browse every city with published Rentify properties and see how many verified spaces are available.</p>
                </div>

                {cities.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-5">
                        {cities.map((city) => (
                            <Link key={city.city} href={`/browse?location=${encodeURIComponent(city.city)}`} className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-900 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-3xl">
                                <img src={city.img} alt={city.city} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" onError={(event) => { event.currentTarget.src = '/images/lagos.jpg'; }} />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                                <div className="absolute right-2.5 top-2.5 flex items-center gap-1.5 rounded-xl bg-slate-950/55 px-2 py-1.5 backdrop-blur-sm sm:right-4 sm:top-4 sm:rounded-2xl sm:px-3 sm:py-2">
                                    <Building2 className="h-3.5 w-3.5 text-amber-300 sm:h-4 sm:w-4" />
                                    <span className="text-sm font-extrabold text-white sm:text-lg">{city.count}</span>
                                    <span className="hidden text-[10px] font-bold uppercase tracking-wider text-white/70 sm:inline">properties</span>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5">
                                    <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold text-white/75 sm:text-xs"><MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Nigeria</div>
                                    <h2 className="truncate text-lg font-extrabold text-white sm:text-2xl">{city.city}</h2>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                        <h2 className="text-xl font-bold text-slate-900">No cities available yet</h2>
                        <p className="mt-2 text-slate-500">Run the demo database seeder to add published properties.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
