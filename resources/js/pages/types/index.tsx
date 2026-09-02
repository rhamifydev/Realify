import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Building2, ShieldCheck } from 'lucide-react';
import PublicHeader from '@/components/public-header';

interface PropertyType {
    slug: string;
    name: string;
    count: number;
    img: string;
}

export default function Types({ types = [] }: { types?: PropertyType[] }) {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <Head title="Browse Property Types — Rentify" />
            <PublicHeader categories={types.map((type) => ({ name: type.name, query: type.slug }))} />

            <main className="mx-auto max-w-7xl px-4 pb-12 pt-28 md:px-8 md:pb-16 md:pt-36">
                <Link href="/" className="mb-8 flex w-fit items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-900">
                    <ArrowLeft className="h-4 w-4" /> Back to home
                </Link>
                <div className="mx-auto mb-10 max-w-3xl text-center">
                    <p className="mb-3 text-sm font-bold uppercase tracking-widest text-amber-500">Browse by type</p>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl">Find the right space.</h1>
                    <p className="mt-4 text-lg font-medium leading-relaxed text-slate-500">Explore every property type currently available on Rentify.</p>
                </div>

                {types.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                        {types.map((type) => (
                            <Link key={type.slug} href={`/types/${type.slug}`} className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-900 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-3xl">
                                <img src={type.img} alt={type.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" onError={(event) => { event.currentTarget.src = '/images/lagos.jpg'; }} />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5">
                                    <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold text-white/75 sm:text-xs"><Building2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> {type.count} properties</div>
                                    <h2 className="truncate text-lg font-extrabold text-white sm:text-2xl">{type.name}</h2>
                                    <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-amber-300">Explore <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                        <ShieldCheck className="mx-auto h-8 w-8 text-blue-900" />
                        <h2 className="mt-4 text-xl font-bold">No property types available yet</h2>
                    </div>
                )}
            </main>
        </div>
    );
}
