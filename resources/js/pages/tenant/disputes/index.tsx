import { Head } from '@inertiajs/react';

export default function TenantDisputes() {
    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <Head title="Disputes - Tenant" />
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900">Disputes</h1>
                <p className="text-slate-500 font-medium mt-1">Track the status of any disputes raised regarding your rentals.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 text-center">
                <p className="text-slate-500 font-medium">You have no active disputes.</p>
            </div>
        </div>
    );
}

TenantDisputes.layout = {
    breadcrumbs: [
        { title: 'Disputes', href: '/tenant/disputes' },
    ],
};
