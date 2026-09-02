import { Head } from '@inertiajs/react';

export default function TenantInspections() {
    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <Head title="My Inspections - Tenant" />
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900">My Inspections</h1>
                <p className="text-slate-500 font-medium mt-1">Manage your upcoming and past property visits.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 text-center">
                <p className="text-slate-500 font-medium">You have 2 upcoming inspections.</p>
            </div>
        </div>
    );
}

TenantInspections.layout = {
    breadcrumbs: [
        { title: 'My Inspections', href: '/tenant/inspections' },
    ],
};
