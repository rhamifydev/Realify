import { usePage } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-blue-900 text-white">
                <ShieldCheck className="size-6" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-extrabold text-lg">
                    Rent<span className="text-amber-500">ify</span>
                </span>
            </div>
        </>
    );
}
