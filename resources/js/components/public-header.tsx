import { Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import { Building2, ChevronRight, FileText, Home, Menu, Search, ShieldCheck, Truck, UserRound, Wallet } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

export interface PublicHeaderCategory {
    name: string;
    query: string;
}

type Props = {
    categories?: PublicHeaderCategory[];
};

export default function PublicHeader({ categories = [] }: Props) {
    const { auth } = usePage().props as any;
    const { url } = usePage();
    const isBrowseActive = url?.startsWith('/browse');

    return (
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
                        <Link 
                            href="/browse" 
                            className={`text-sm font-bold transition-colors ${
                                isBrowseActive ? 'text-blue-900 font-extrabold' : 'text-slate-600 hover:text-blue-900'
                            }`}
                        >
                            Find a Home
                        </Link>
                        <a href="/#escrow" className="text-sm font-bold text-slate-600 hover:text-blue-900 transition-colors">How Escrow Works</a>
                        <a href="/#trust" className="text-sm font-bold text-slate-600 hover:text-blue-900 transition-colors">Trust & Safety</a>
                    </div>
                </div>

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
                                            <Home className="h-4 w-4" /> Go to Dashboard
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
                                            {categories.map((category) => (
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
                                            <a href="/#escrow" className="flex items-center gap-3 rounded-xl px-2 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"><Wallet className="h-5 w-5 text-emerald-600" /> How Escrow Works</a>
                                            <a href="/#trust" className="flex items-center gap-3 rounded-xl px-2 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"><ShieldCheck className="h-5 w-5 text-emerald-600" /> Trust & Safety</a>
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
    );
}
