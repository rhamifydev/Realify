import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type {BreadcrumbItem} from '@/types';
import { Button } from '@/components/ui/button';

export default function MandatesIndex({ mandates, isOwner }: { mandates: any[], isOwner: boolean }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'My Mandates', href: '/mandates' },
    ];

    const { put, processing } = useForm();

    const updateMandate = (id: number, status: string) => {
        put(route('mandates.update', id), {
            data: { status },
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="My Mandates" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mx-auto w-full max-w-5xl space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Agent Mandates</h2>
                        <p className="text-muted-foreground mt-2">Manage your property mandates and fee splits.</p>
                    </div>

                    <div className="grid gap-4">
                        {mandates.length === 0 && (
                            <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                                No active mandates found.
                            </div>
                        )}
                        {mandates.map((mandate) => (
                            <div key={mandate.id} className="flex items-center justify-between rounded-xl border bg-card p-4 shadow">
                                <div>
                                    <h3 className="font-semibold">{mandate.property?.title || 'Unknown Property'}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Owner Split: {mandate.owner_split}% | Agent Split: {mandate.agent_split}%
                                    </p>
                                    <div className="mt-2">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                            mandate.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            mandate.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {mandate.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                {!isOwner && mandate.status === 'pending' && (
                                    <div className="flex gap-2">
                                        <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => updateMandate(mandate.id, 'rejected')} disabled={processing}>
                                            Reject
                                        </Button>
                                        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => updateMandate(mandate.id, 'approved')} disabled={processing}>
                                            Approve
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

MandatesIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'My Mandates', href: '/mandates' },
    ]}>
        {page}
    </AppLayout>
);
