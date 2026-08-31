import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

export default function DisputesIndex({ disputes }: { disputes: any[] }) {
    const { put, processing } = useForm();
    const [resolutions, setResolutions] = useState<Record<number, string>>({});

    const resolveDispute = (id: number) => {
        const resolution = resolutions[id];
        if (!resolution) return;

        put(route('admin.disputes.resolve', id), {
            data: { resolution },
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Dispute Resolution" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mx-auto w-full max-w-5xl space-y-8">
                    <div>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-8 w-8 text-red-600" />
                            <h2 className="text-2xl font-bold tracking-tight">Admin: Dispute Resolution</h2>
                        </div>
                        <p className="text-muted-foreground mt-2">Investigate and resolve escrow transaction disputes.</p>
                    </div>

                    <div className="grid gap-4">
                        {disputes.length === 0 && (
                            <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                                No active disputes. The platform is running smoothly!
                            </div>
                        )}
                        {disputes.map((dispute) => (
                            <div key={dispute.id} className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg">Transaction #{dispute.id} - ₦{Number(dispute.amount).toLocaleString()}</h3>
                                    <p className="text-sm font-medium">{dispute.type.replace('_', ' ').toUpperCase()}</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Property Unit ID: {dispute.property_unit_id} | Tenant ID: {dispute.tenant_id}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Ref: {dispute.payment_reference}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <Select 
                                        value={resolutions[dispute.id]} 
                                        onValueChange={(val) => setResolutions({...resolutions, [dispute.id]: val})}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select Resolution" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="released">Release to Agent/Owner</SelectItem>
                                            <SelectItem value="refunded">Refund to Tenant</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button onClick={() => resolveDispute(dispute.id)} disabled={!resolutions[dispute.id] || processing}>
                                        Execute
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

DisputesIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Admin Disputes', href: '/admin/disputes' },
    ]}>
        {page}
    </AppLayout>
);
