import { Head } from '@inertiajs/react';

export default function TenantPayments() {
    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <Head title="Payment History - Tenant" />
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900">Payment History</h1>
                <p className="text-slate-500 font-medium mt-1">View your transaction logs and download receipts.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 text-center">
                <p className="text-slate-500 font-medium">Your transaction history will appear here.</p>
            </div>
        </div>
    );
}

TenantPayments.layout = {
    breadcrumbs: [
        { title: 'Payment History', href: '/tenant/payments' },
    ],
};
