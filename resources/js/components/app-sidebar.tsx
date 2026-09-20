import { Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    BookOpen,
    Building2,
    CalendarCheck,
    CreditCard,
    FileSignature,
    FolderGit2,
    Heart,
    Home,
    LayoutGrid,
    Search,
    ShieldCheck,
    UserCheck,
    Users,
    Wallet,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const userRole = auth?.user?.role || 'tenant';

    const getNavItems = (): NavItem[] => {
        switch (userRole) {
            case 'admin':
                return [
                    {
                        title: 'Overview',
                        href: '/admin/dashboard',
                        icon: LayoutGrid,
                    },
                    {
                        title: 'Dispute Center',
                        href: '/admin/disputes',
                        icon: AlertTriangle,
                    },
                    {
                        title: 'Property Approvals',
                        href: '/admin/properties',
                        icon: Building2,
                    },
                    {
                        title: 'KYC Verifications',
                        href: '/admin/kyc',
                        icon: UserCheck,
                    },
                    {
                        title: 'Inspection Visits',
                        href: '/tenant/inspections',
                        icon: CalendarCheck,
                    },
                    {
                        title: 'Escrow Ledger',
                        href: '/admin/transactions',
                        icon: Wallet,
                    },
                    {
                        title: 'User Directory',
                        href: '/admin/users',
                        icon: Users,
                    },
                    {
                        title: 'Public Market',
                        href: '/browse',
                        icon: Search,
                    },
                ];

            case 'owner':
                return [
                    {
                        title: 'My Properties',
                        href: '/properties',
                        icon: Home,
                    },
                    {
                        title: 'Inspection Visits',
                        href: '/tenant/inspections',
                        icon: CalendarCheck,
                    },
                    {
                        title: 'Agent Mandates',
                        href: '/mandates',
                        icon: FileSignature,
                    },
                    {
                        title: 'Escrow Payouts',
                        href: '/escrow',
                        icon: Wallet,
                    },
                    {
                        title: 'KYC & Verification',
                        href: '/kyc',
                        icon: UserCheck,
                    },
                    {
                        title: 'Browse Listings',
                        href: '/browse',
                        icon: Search,
                    },
                ];

            case 'agent':
                return [
                    {
                        title: 'Property Inventory',
                        href: '/properties',
                        icon: Building2,
                    },
                    {
                        title: 'Inspection Visits',
                        href: '/tenant/inspections',
                        icon: CalendarCheck,
                    },
                    {
                        title: 'Agent Mandates',
                        href: '/mandates',
                        icon: FileSignature,
                    },
                    {
                        title: 'Escrow Earnings',
                        href: '/escrow',
                        icon: Wallet,
                    },
                    {
                        title: 'Agent License / KYC',
                        href: '/kyc',
                        icon: UserCheck,
                    },
                    {
                        title: 'Marketplace',
                        href: '/browse',
                        icon: Search,
                    },
                ];

            case 'tenant':
            default:
                return [
                    {
                        title: 'Overview',
                        href: '/tenant/dashboard',
                        icon: LayoutGrid,
                    },
                    {
                        title: 'Saved Listings',
                        href: '/tenant/saved',
                        icon: Heart,
                    },
                    {
                        title: 'My Inspections',
                        href: '/tenant/inspections',
                        icon: CalendarCheck,
                    },
                    {
                        title: 'Active Applications',
                        href: '/tenant/applications',
                        icon: FileSignature,
                    },
                    {
                        title: 'Payment History',
                        href: '/tenant/payments',
                        icon: CreditCard,
                    },
                    {
                        title: 'Disputes',
                        href: '/tenant/disputes',
                        icon: AlertTriangle,
                    },
                    {
                        title: 'Escrow Vault',
                        href: '/escrow',
                        icon: Wallet,
                    },
                    {
                        title: 'KYC Verification',
                        href: '/kyc',
                        icon: UserCheck,
                    },
                    {
                        title: 'Browse Properties',
                        href: '/browse',
                        icon: Search,
                    },
                ];
        }
    };

    const roleBadge = {
        admin: {
            label: 'Admin',
            classes: 'bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400',
        },
        owner: {
            label: 'House Owner',
            classes: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
        },
        agent: {
            label: 'Agent',
            classes: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20 dark:text-indigo-400',
        },
        tenant: {
            label: 'Tenant',
            classes: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400',
        },
    }[userRole as 'admin' | 'owner' | 'agent' | 'tenant'] || {
        label: 'Tenant',
        classes: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    };

    const footerNavItems: NavItem[] = [
        {
            title: 'Browse Public Market',
            href: '/browse',
            icon: Search,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch className="flex items-center justify-between">
                                <AppLogo />
                                <span className={`hidden group-data-[collapsible=icon]:hidden sm:inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${roleBadge.classes}`}>
                                    {roleBadge.label}
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={getNavItems()} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
