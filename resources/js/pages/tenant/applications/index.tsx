import { Head } from '@inertiajs/react';
import { EscrowStepper } from '@/components/escrow-stepper';
import { Building } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TenantApplications() {
    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <Head title="Active Applications - Tenant" />

            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900">Active Applications</h1>
                <p className="text-slate-500 font-medium mt-1">Track the status of your ongoing property rentals and escrow funds.</p>
            </div>

            <div className="space-y-8">
                {/* Single Application Mock */}
                <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row items-center gap-6">
                        <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=400&auto=format&fit=crop" alt="Property" className="w-full md:w-32 md:h-32 rounded-2xl object-cover" />
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Luxury 3-Bed Apartment, Ikoyi</h3>
                            <div className="flex items-center justify-center md:justify-start gap-4 text-sm font-medium text-slate-500">
                                <span className="flex items-center gap-1"><Building className="w-4 h-4" /> Agent: Oluwaseun Adebayo</span>
                            </div>
                        </div>
                        <div className="shrink-0 flex gap-2">
                            <Button variant="outline" className="rounded-full">Cancel Application</Button>
                            <Button className="bg-blue-900 text-white hover:bg-blue-800 rounded-full">Contact Agent</Button>
                        </div>
                    </div>
                    
                    <div className="p-6 md:p-8 bg-slate-50/50">
                        <EscrowStepper currentStage="inspection_paid" amountHeld="₦15,000" />
                        
                        <div className="mt-8 bg-white p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <h4 className="font-bold text-slate-900">Next Step: Attend Inspection</h4>
                                <p className="text-sm text-slate-500">Your inspection is scheduled for Tomorrow at 10:00 AM.</p>
                            </div>
                            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full">Confirm Inspection Held</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

TenantApplications.layout = {
    breadcrumbs: [
        { title: 'Active Applications', href: '/tenant/applications' },
    ],
};
