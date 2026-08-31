import { Head, useForm } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type {BreadcrumbItem} from '@/types';
import { Button } from '@/components/ui/button';

export default function EscrowIndex({ transactions }: { transactions: any[] }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Escrow Transactions', href: '/escrow' },
    ];

    const { post, processing } = useForm();

    const confirmInspection = (id: number) => {
        post(route('escrow.confirm', id), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Escrow Transactions" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mx-auto w-full max-w-5xl space-y-8">
                    <div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-8 w-8 text-green-600" />
                            <h2 className="text-2xl font-bold tracking-tight">Escrow Wallet</h2>
                        </div>
                        <p className="text-muted-foreground mt-2">Manage secure payments and track transaction milestones.</p>
                    </div>

                    <div className="grid gap-4">
                        {transactions.length === 0 && (
                            <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                                No active escrow transactions found.
                            </div>
                        )}
                        {transactions.map((tx) => (
                            <div key={tx.id} className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow md:flex-row md:items-center md:justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-lg">₦{Number(tx.amount).toLocaleString()}</h3>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                            tx.status === 'released' ? 'bg-green-100 text-green-800' :
                                            tx.status === 'held' ? 'bg-blue-100 text-blue-800' :
                                            tx.status === 'pending_release' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {tx.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium">{tx.type.replace('_', ' ').toUpperCase()}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Ref: {tx.payment_reference} | Property ID: {tx.property_unit_id}
                                    </p>
                                </div>

                                {tx.status === 'held' && (tx.type === 'inspection_fee' || tx.type === 'title_verification_fee') && (
                                    <Button onClick={() => confirmInspection(tx.id)} disabled={processing}>
                                        Confirm {tx.type === 'inspection_fee' ? 'Inspection' : 'Verification'}
                                    </Button>
                                )}
                                {tx.status === 'held' && tx.type === 'offer_deposit' && (
                                    <Button onClick={() => confirmInspection(tx.id)} disabled={processing}>
                                        Acknowledge Offer
                                    </Button>
                                )}
                                {tx.status === 'pending_transfer' && (
                                    <Button variant="outline" disabled>
                                        Awaiting Legal Transfer...
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

EscrowIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Escrow Transactions', href: '/escrow' },
    ]}>
        {page}
    </AppLayout>
);
