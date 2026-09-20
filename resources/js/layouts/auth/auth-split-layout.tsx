import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';
import {
    ArrowLeft,
    Building2,
    CheckCircle2,
    Lock,
    ShieldCheck,
    Star,
} from 'lucide-react';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="min-h-screen w-full grid lg:grid-cols-12 bg-slate-50 dark:bg-zinc-950">
            {/* Left Hero Panel (Desktop & Tablet Large) */}
            <div className="relative hidden lg:col-span-5 xl:col-span-6 lg:flex flex-col justify-between overflow-hidden bg-slate-950 p-10 xl:p-14 text-white">
                {/* Architectural Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop"
                        alt="Luxury Nigerian Residence"
                        className="h-full w-full object-cover opacity-35 scale-105 transition-transform duration-10000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-blue-950/80" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-800/30 via-transparent to-transparent" />
                </div>

                {/* Top Brand & Badge */}
                <div className="relative z-20 flex items-center justify-between">
                    <Link
                        href={home()}
                        className="flex items-center gap-3 transition-opacity hover:opacity-90"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/30">
                            <ShieldCheck className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-white">
                            Rent<span className="text-amber-400">ify</span>
                        </span>
                    </Link>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-md">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                        Escrow Guaranteed
                    </span>
                </div>

                {/* Center Value Proposition & Social Proof */}
                <div className="relative z-20 my-auto py-8 space-y-7">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-blue-200 backdrop-blur-md">
                            <Building2 className="h-3.5 w-3.5 text-amber-400" />
                            Nigeria's Premier Escrow PropTech
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-white xl:text-4xl leading-tight">
                            Rent, Buy & List With <br />
                            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-white bg-clip-text text-transparent">
                                100% Escrow Protection
                            </span>
                        </h2>
                        <p className="max-w-lg text-sm text-slate-300 xl:text-base leading-relaxed">
                            Every deposit is secured in licensed escrow. No agent ghosting, no fake title documents, and zero double-letting scams.
                        </p>
                    </div>

                    {/* Trust Pillars */}
                    <div className="grid gap-2.5 max-w-lg">
                        <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
                            <div className="mt-0.5 rounded-lg bg-blue-600/30 p-2 text-blue-400">
                                <ShieldCheck className="h-4 w-4" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-white xl:text-sm">
                                    Guaranteed Escrow Safety
                                </h4>
                                <p className="mt-0.5 text-xs text-slate-300">
                                    Funds are only disbursed to landlords after physical inspection and key handover.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
                            <div className="mt-0.5 rounded-lg bg-amber-500/20 p-2 text-amber-400">
                                <CheckCircle2 className="h-4 w-4" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-white xl:text-sm">
                                    Verified Deeds & Title
                                </h4>
                                <p className="mt-0.5 text-xs text-slate-300">
                                    Every listing is legally vetted against official land registries before publication.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Verified Testimonial */}
                    <div className="max-w-lg space-y-3 rounded-2xl border border-white/15 bg-white/10 p-4.5 shadow-2xl backdrop-blur-xl">
                        <div className="flex items-center gap-1 text-amber-400">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                            ))}
                            <span className="ml-2 text-xs font-semibold text-slate-300">
                                4.9/5 Renter Rating
                            </span>
                        </div>
                        <p className="text-xs xl:text-sm italic leading-relaxed text-slate-200">
                            "Rentify completely eliminated the anxiety of renting in Lagos. My deposit remained locked safely in escrow until I inspected and collected the keys in Lekki Phase 1."
                        </p>
                        <div className="flex items-center justify-between border-t border-white/10 pt-2.5">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-blue-600 text-xs font-bold text-white">
                                    BO
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white">Babatunde Adeleke</p>
                                    <p className="text-[10px] text-slate-400">Verified Tenant • Lekki Phase 1</p>
                                </div>
                            </div>
                            <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                                ₦3.5M Protected
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bottom Trust Seal */}
                <div className="relative z-20 flex items-center justify-between border-t border-white/10 pt-5 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                        <Lock className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Bank-Grade 256-Bit Escrow Security</span>
                    </div>
                    <span>NDPR Compliant</span>
                </div>
            </div>

            {/* Right Form Area (Responsive for All Screens) */}
            <div className="col-span-12 lg:col-span-7 xl:col-span-6 flex min-h-screen flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16">
                {/* Top Navigation Bar */}
                <div className="flex items-center justify-between pb-6">
                    <Link
                        href={home()}
                        className="flex items-center gap-2 lg:hidden"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-900 shadow-sm">
                            <ShieldCheck className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-extrabold tracking-tight text-blue-900 dark:text-white">
                            Rent<span className="text-amber-500">ify</span>
                        </span>
                    </Link>

                    <Link
                        href="/browse"
                        className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200/60 hover:text-blue-900 dark:text-slate-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to Listings
                    </Link>
                </div>

                {/* Center Form Container */}
                <div className="mx-auto my-auto w-full max-w-md py-4">
                    <div className="mb-6 space-y-1.5 text-left">
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                            {title}
                        </h1>
                        {description && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/40 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
                        {children}
                    </div>

                    {/* Escrow Guarantee Micro-Footer */}
                    <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-slate-400 dark:text-slate-500">
                        <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
                        <span>Protected by Rentify SafeLock™ Escrow Guarantee</span>
                    </div>
                </div>

                {/* Footer Copyright & Legal Links */}
                <div className="pt-6 text-center text-xs text-slate-400 dark:text-slate-500">
                    <p>
                        &copy; {new Date().getFullYear()} Rentify Technologies Ltd. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
