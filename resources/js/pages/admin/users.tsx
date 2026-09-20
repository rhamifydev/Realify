import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    Building2,
    CheckCircle2,
    Clock,
    Search,
    Shield,
    ShieldAlert,
    ShieldCheck,
    UserCheck,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type UserItem = {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    kyc_profile?: {
        id: number;
        status: string;
    };
    properties?: any[];
};

type Props = {
    users: {
        data: UserItem[];
        links: any[];
        total: number;
    };
    currentRole: string;
    search: string;
    counts: {
        all: number;
        tenant: number;
        owner: number;
        agent: number;
        admin: number;
    };
};

export default function AdminUsers({ users, currentRole, search, counts }: Props) {
    const [searchTerm, setSearchTerm] = useState(search || '');
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/users',
            {
                role: currentRole,
                search: searchTerm,
            },
            { preserveState: true }
        );
    };

    const handleRoleChange = (userId: number, userName: string, newRole: string) => {
        if (!confirm(`Change role for "${userName}" to ${newRole.toUpperCase()}?`)) return;

        setUpdatingId(userId);
        router.post(
            `/admin/users/${userId}/role`,
            { role: newRole },
            {
                preserveScroll: true,
                onFinish: () => setUpdatingId(null),
            }
        );
    };

    const tabs = [
        { key: 'all', label: 'All Users', count: counts.all, color: 'text-slate-600 bg-slate-100 dark:bg-zinc-800' },
        { key: 'tenant', label: 'Tenants', count: counts.tenant, color: 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300' },
        { key: 'owner', label: 'House Owners', count: counts.owner, color: 'text-amber-700 bg-amber-100 dark:bg-amber-950 dark:text-amber-300' },
        { key: 'agent', label: 'Agents', count: counts.agent, color: 'text-indigo-700 bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300' },
        { key: 'admin', label: 'Admins', count: counts.admin, color: 'text-red-700 bg-red-100 dark:bg-red-950 dark:text-red-300' },
    ];

    return (
        <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-8">
            <Head title="User Management" />

            {/* Header */}
            <div>
                <div className="flex items-center gap-2">
                    <span className="rounded-md bg-blue-900 px-2 py-0.5 text-xs font-black uppercase tracking-widest text-white">
                        Access Control
                    </span>
                    <span className="text-xs font-semibold text-slate-400">Identity & Role Permissions</span>
                </div>
                <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    Platform User Directory
                </h1>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Browse registered users, inspect identity verification statuses, and manage role permissions.
                </p>
            </div>

            {/* Tabs & Search */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-zinc-800">
                <div className="flex flex-wrap items-center gap-2">
                    {tabs.map((tab) => {
                        const isActive = currentRole === tab.key;
                        return (
                            <Link
                                key={tab.key}
                                href={`/admin/users?role=${tab.key}&search=${searchTerm}`}
                                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                                    isActive
                                        ? 'bg-blue-900 text-white shadow-md shadow-blue-900/15'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-300'
                                }`}
                            >
                                <span>{tab.label}</span>
                                <span className={`rounded-full px-2 py-0.2 text-[10px] font-extrabold ${isActive ? 'bg-white/20 text-white' : tab.color}`}>
                                    {tab.count}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                <form onSubmit={handleSearch} className="flex items-center gap-2 sm:w-72">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Search name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-9 rounded-xl pl-9 text-xs border-slate-200 dark:border-zinc-700"
                        />
                    </div>
                    <Button type="submit" size="sm" variant="secondary" className="rounded-xl text-xs">
                        Search
                    </Button>
                </form>
            </div>

            {/* Users Table */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:border-zinc-800">
                                <th className="pb-3">User</th>
                                <th className="pb-3">Current Role</th>
                                <th className="pb-3">KYC Status</th>
                                <th className="pb-3">Properties Owned</th>
                                <th className="pb-3">Joined Date</th>
                                <th className="pb-3 text-right">Assign Role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                            {users.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-slate-400">
                                        No users found matching this filter or search query.
                                    </td>
                                </tr>
                            ) : (
                                users.data.map((user) => {
                                    const isUpdating = updatingId === user.id;
                                    const kycStatus = user.kyc_profile?.status || 'unsubmitted';

                                    return (
                                        <tr key={user.id} className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/40">
                                            <td className="py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 dark:bg-zinc-800 dark:text-slate-200">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                                                        <p className="text-[11px] text-slate-400">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-3.5">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                                                    user.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' :
                                                    user.role === 'owner' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                                                    user.role === 'agent' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' :
                                                    'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>

                                            <td className="py-3.5">
                                                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                                                    kycStatus === 'verified' ? 'text-emerald-600' :
                                                    kycStatus === 'pending' ? 'text-amber-600' :
                                                    'text-slate-400'
                                                }`}>
                                                    {kycStatus === 'verified' && <CheckCircle2 className="h-3 w-3" />}
                                                    {kycStatus === 'pending' && <Clock className="h-3 w-3" />}
                                                    {kycStatus.toUpperCase()}
                                                </span>
                                            </td>

                                            <td className="py-3.5 text-slate-700 dark:text-slate-300">
                                                {user.properties?.length || 0} listings
                                            </td>

                                            <td className="py-3.5 text-slate-400 text-[11px]">
                                                {new Date(user.created_at).toLocaleDateString('en-GB')}
                                            </td>

                                            <td className="py-3.5 text-right">
                                                <select
                                                    value={user.role}
                                                    disabled={isUpdating}
                                                    onChange={(e) => handleRoleChange(user.id, user.name, e.target.value)}
                                                    className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-200 cursor-pointer"
                                                >
                                                    <option value="tenant">Tenant</option>
                                                    <option value="owner">House Owner</option>
                                                    <option value="agent">Agent</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {users.links && users.links.length > 3 && (
                    <div className="flex items-center justify-center gap-1 pt-6 border-t border-slate-100 dark:border-zinc-800 mt-4">
                        {users.links.map((link: any, idx: number) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                    link.active
                                        ? 'bg-blue-900 text-white'
                                        : link.url
                                        ? 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800'
                                        : 'cursor-not-allowed opacity-40'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

AdminUsers.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Admin', href: '/admin/dashboard' },
            { title: 'Users Directory', href: '/admin/users' },
        ]}
    >
        {page}
    </AppLayout>
);
