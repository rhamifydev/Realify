import { Head, Link } from '@inertiajs/react';
import { EscrowStepper } from '@/components/escrow-stepper';
import { Home, ShieldCheck, Wallet, ChevronRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TenantDashboard() {
    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <Head title="Tenant Dashboard" />

            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900">Welcome back, John!</h1>
                <p className="text-slate-500 font-medium mt-1">Here is what's happening with your property search and rentals.</p>
            </div>

            {/* KYC Banner */}
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-amber-900">Complete Your KYC Verification</h4>
                        <p className="text-sm font-medium text-amber-700">You need to verify your identity before you can book inspections or rent properties.</p>
                    </div>
                </div>
                <Link href="/kyc" className="shrink-0">
                    <Button className="bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-full">Verify Now</Button>
                </Link>
            </div>

            {/* Quick Status Widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Total Held in Escrow</p>
                        <h4 className="text-2xl font-extrabold text-slate-900">₦25,000</h4>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                        <Wallet className="w-6 h-6" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Active Applications</p>
                        <h4 className="text-2xl font-extrabold text-slate-900">1</h4>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Upcoming Inspections</p>
                        <h4 className="text-2xl font-extrabold text-slate-900">2</h4>
                    </div>
                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                        <Home className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Escrow Stepper */}
            <EscrowStepper currentStage="inspection_paid" amountHeld="₦15,000" />

            {/* Upcoming Inspections & Saved Listings Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-slate-900">Upcoming Inspections</h3>
                        <Link href="/tenant/inspections" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">View All <ChevronRight className="w-4 h-4" /></Link>
                    </div>
                    
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer">
                                <img src={`https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=200&auto=format&fit=crop`} alt="Property" className="w-16 h-16 rounded-xl object-cover" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-900 truncate">Luxury 3-Bed Apartment</h4>
                                    <p className="text-sm font-medium text-slate-500">Tomorrow at 10:00 AM</p>
                                </div>
                                <div className="text-right">
                                    <span className="inline-block bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">Upcoming</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-slate-900">Saved Listings</h3>
                        <Link href="/tenant/saved" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">View All <ChevronRight className="w-4 h-4" /></Link>
                    </div>

                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer">
                                <img src={`https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=200&auto=format&fit=crop`} alt="Property" className="w-16 h-16 rounded-xl object-cover" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-900 truncate">Cozy Studio in Lekki</h4>
                                    <p className="text-sm font-medium text-slate-500">₦1.2m / year</p>
                                </div>
                                <div className="text-right">
                                    <span className="inline-block bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">Available</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

TenantDashboard.layout = {
    breadcrumbs: [
        { title: 'Overview', href: '/dashboard' },
    ],
};