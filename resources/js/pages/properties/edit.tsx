import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type {BreadcrumbItem} from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PropertyAvailabilityManager from '@/components/property-availability-manager';

export default function PropertyEdit({ property }: { property: any }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'My Properties', href: '/properties' },
        { title: property.title || 'Draft Property', href: '#' },
    ];

    const { data, setData, put, processing, errors } = useForm({
        step: property.current_stage || 1,
        title: property.title || '',
        description: property.description || '',
        address: property.address || '',
        state: property.state || '',
        city: property.city || '',
        type: property.type || '',
        structure_type: property.structure_type || '',
        
        // Unit info
        rent_price: property.units?.[0]?.rent_price || '',
        sale_price: property.units?.[0]?.sale_price || '',
        bedrooms: property.units?.[0]?.bedrooms || '',
        bathrooms: property.units?.[0]?.bathrooms || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('properties.update', property.id), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Edit Property" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mx-auto w-full max-w-3xl space-y-8">
                    
                    <div className="flex gap-2 mb-8">
                        {[1, 2, 3, 4, 5].map((step) => (
                            <div key={step} className={`h-2 flex-1 rounded-full ${property.current_stage >= step ? 'bg-primary' : 'bg-muted'}`} />
                        ))}
                    </div>

                    <form onSubmit={submit} className="space-y-6 rounded-xl border bg-card p-6 shadow">
                        {data.step === 1 && (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold">Step 1: Basic Information</h3>
                                    <p className="text-muted-foreground">Provide the primary details for this property.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input value={data.title} onChange={e => setData('title', e.target.value)} placeholder="e.g. Beautiful 3 Bedroom Duplex in Lekki" />
                                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <Select value={data.type} onValueChange={v => setData('type', v)}>
                                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="rent">For Rent</SelectItem>
                                            <SelectItem value="sale">For Sale</SelectItem>
                                            <SelectItem value="sale_or_rent">For Sale or Rent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Structure Type</Label>
                                    <Select value={data.structure_type} onValueChange={v => setData('structure_type', v)}>
                                        <SelectTrigger><SelectValue placeholder="Select structure" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="single_unit">Single Unit (e.g. standalone house)</SelectItem>
                                            <SelectItem value="multi_unit">Multi-Unit (e.g. apartment block)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.structure_type && <p className="text-sm text-red-500">{errors.structure_type}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Input value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Describe the property" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>State</Label>
                                        <Input value={data.state} onChange={e => setData('state', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>City</Label>
                                        <Input value={data.city} onChange={e => setData('city', e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Full Address</Label>
                                    <Input value={data.address} onChange={e => setData('address', e.target.value)} />
                                </div>
                            </div>
                        )}

                        {data.step === 2 && (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold">Step 2: Media Upload</h3>
                                    <p className="text-muted-foreground">Upload photos and video tours.</p>
                                </div>
                                <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                                    <p>Media upload interface (MVP placeholder). In a full implementation, we'd use direct S3 upload components here.</p>
                                </div>
                                <Button type="button" onClick={() => setData('step', 3)} variant="outline" className="w-full">Skip to next step for MVP</Button>
                            </div>
                        )}

                        {data.step === 3 && (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold">Step 3: Unit Details</h3>
                                    <p className="text-muted-foreground">Price and specifications.</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Rent Price (₦)</Label>
                                        <Input type="number" value={data.rent_price} onChange={e => setData('rent_price', e.target.value)} disabled={data.type === 'sale'} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Sale Price (₦)</Label>
                                        <Input type="number" value={data.sale_price} onChange={e => setData('sale_price', e.target.value)} disabled={data.type === 'rent'} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Bedrooms</Label>
                                        <Input type="number" value={data.bedrooms} onChange={e => setData('bedrooms', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Bathrooms</Label>
                                        <Input type="number" value={data.bathrooms} onChange={e => setData('bathrooms', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {data.step === 4 && (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold">Step 4: Ownership Documents</h3>
                                    <p className="text-muted-foreground">Required for platform trust and verification.</p>
                                </div>
                                <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                                    <p>Document upload interface (C of O, Deed of Assignment).</p>
                                </div>
                                <Button type="button" onClick={() => setData('step', 5)} variant="outline" className="w-full">Skip to Review</Button>
                            </div>
                        )}

                        {data.step === 5 && (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold">Step 5: Review & Submit</h3>
                                    <p className="text-muted-foreground">Review your property details before submitting for approval.</p>
                                </div>
                                <div className="rounded-lg bg-muted p-4">
                                    <p><strong>Title:</strong> {data.title}</p>
                                    <p><strong>Type:</strong> {data.type}</p>
                                    <p><strong>Address:</strong> {data.address}, {data.city}, {data.state}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between">
                            {data.step > 1 && (
                                <Button type="button" variant="outline" onClick={() => setData('step', data.step - 1)}>Back</Button>
                            )}
                            <Button type="submit" disabled={processing} className="ml-auto">
                                {data.step === 5 ? 'Submit for Review' : 'Save & Continue'}
                            </Button>
                        </div>
                    </form>

                    {/* Inspection Slot Availability Configuration */}
                    <div className="mt-8">
                        <PropertyAvailabilityManager
                            propertyId={property.id}
                            initialSchedules={property.availabilities || []}
                        />
                    </div>

                </div>
            </div>
        </>
    );
}

PropertyEdit.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'My Properties', href: '/properties' },
        { title: 'Edit Property', href: '#' },
    ]}>
        {page}
    </AppLayout>
);
