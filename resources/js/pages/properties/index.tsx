import { Head, Link } from '@inertiajs/react';
import { PlusCircle, FileEdit } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type {BreadcrumbItem} from '@/types';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'My Properties', href: '/properties' },
];

export default function PropertyIndex({ properties }: { properties: any[] }) {
    return (
        <>
            <Head title="My Properties" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mx-auto w-full max-w-5xl space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">My Properties & Drafts</h2>
                            <p className="text-muted-foreground mt-2">Manage your listings, drafts, and active properties.</p>
                        </div>
                        <Button asChild>
                            <Link href={route('properties.create')}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add New Property
                            </Link>
                        </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {properties.length === 0 && (
                            <div className="col-span-full rounded-xl border border-dashed p-8 text-center">
                                <p className="text-muted-foreground">You have no properties or drafts yet.</p>
                            </div>
                        )}
                        {properties.map((property) => (
                            <div key={property.id} className="flex flex-col justify-between rounded-xl border bg-card p-4 shadow">
                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className={`rounded px-2 py-1 text-xs font-semibold ${property.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                            {property.status.toUpperCase()}
                                        </span>
                                        <span className="text-xs text-muted-foreground">Stage {property.current_stage}/5</span>
                                    </div>
                                    <h3 className="font-semibold text-lg">{property.title || 'Untitled Property'}</h3>
                                    <p className="text-sm text-muted-foreground truncate">{property.address || 'No address provided'}</p>
                                </div>
                                <div className="mt-4 flex items-center justify-end gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={route('properties.edit', property.id)}>
                                            <FileEdit className="mr-2 h-4 w-4" /> {property.status === 'draft' ? 'Continue Draft' : 'Edit'}
                                        </Link>
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

PropertyIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'My Properties', href: '/properties' },
    ]}>
        {page}
    </AppLayout>
);
