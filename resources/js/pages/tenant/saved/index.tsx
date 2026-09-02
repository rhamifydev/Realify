import { Head } from '@inertiajs/react';

export default function TenantSavedListings() {
    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <Head title="Saved Listings - Tenant" />
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900">Saved Listings</h1>
                <p className="text-slate-500 font-medium mt-1">Properties you've bookmarked for later.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 text-center">
                <p className="text-slate-500 font-medium">You have 2 saved properties.</p>
            </div>
        </div>
    );
}

TenantSavedListings.layout = {
    breadcrumbs: [
        { title: 'Saved Listings', href: '/tenant/saved' },
    ],
};
