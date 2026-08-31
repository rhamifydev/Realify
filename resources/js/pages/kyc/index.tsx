import { Head, useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import AppLayout from '@/layouts/app-layout';
import type {BreadcrumbItem} from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'KYC Verification',
        href: '/kyc',
    },
];

export default function KycIndex({ kycProfile }: { kycProfile: any }) {
    const { data, setData, post, processing, errors } = useForm({
        nin: kycProfile?.nin || '',
        bvn: kycProfile?.bvn || '',
        id_type: kycProfile?.id_type || '',
        id_document: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('kyc.update'), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="KYC Verification" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mx-auto w-full max-w-2xl space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Identity Verification (KYC)</h2>
                        <p className="text-muted-foreground mt-2">
                            To maintain a secure platform, all users must verify their identity. 
                            Your current status is: <span className="font-semibold uppercase text-primary">{kycProfile?.status || 'Draft'}</span>
                        </p>
                    </div>

                    <div className="rounded-xl border bg-card text-card-foreground shadow">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nin">National Identification Number (NIN)</Label>
                                        <Input
                                            id="nin"
                                            value={data.nin}
                                            onChange={(e) => setData('nin', e.target.value)}
                                            placeholder="Enter your 11-digit NIN"
                                            disabled={!!kycProfile?.nin}
                                        />
                                        {errors.nin && <p className="text-sm text-red-500">{errors.nin}</p>}
                                        {kycProfile?.nin && <p className="text-sm text-green-600">NIN Verified</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bvn">Bank Verification Number (BVN)</Label>
                                        <Input
                                            id="bvn"
                                            value={data.bvn}
                                            onChange={(e) => setData('bvn', e.target.value)}
                                            placeholder="Enter your 11-digit BVN"
                                            disabled={!!kycProfile?.bvn}
                                        />
                                        {errors.bvn && <p className="text-sm text-red-500">{errors.bvn}</p>}
                                        {kycProfile?.bvn && <p className="text-sm text-green-600">BVN Verified</p>}
                                    </div>

                                    {!kycProfile?.id_document_path && (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="id_type">Document Type</Label>
                                                <Select onValueChange={(value) => setData('id_type', value)} value={data.id_type}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select ID Type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="national_id">National ID</SelectItem>
                                                        <SelectItem value="passport">International Passport</SelectItem>
                                                        <SelectItem value="drivers_license">Driver's License</SelectItem>
                                                        <SelectItem value="voters_card">Voter's Card</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.id_type && <p className="text-sm text-red-500">{errors.id_type}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="id_document">Upload ID Document</Label>
                                                <Input
                                                    id="id_document"
                                                    type="file"
                                                    onChange={(e) => setData('id_document', e.target.files ? e.target.files[0] : null)}
                                                    accept="image/*,.pdf"
                                                />
                                                {errors.id_document && <p className="text-sm text-red-500">{errors.id_document}</p>}
                                            </div>
                                        </>
                                    )}
                                    {kycProfile?.id_document_path && (
                                        <div className="rounded bg-green-50 p-4 text-green-800 dark:bg-green-900 dark:text-green-200">
                                            ID Document uploaded. Pending admin review.
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit" disabled={processing || kycProfile?.status === 'approved'}>
                                        {processing ? 'Submitting...' : 'Submit Verification'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

KycIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'KYC Verification', href: '/kyc' },
    ]}>
        {page}
    </AppLayout>
);
