import { Link } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, UserCheck, Home, FileSignature, ShieldCheck, ShieldAlert } from 'lucide-react';
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

const mainNavItems: NavItem[] = [
    {
        title: 'Overview',
        href: '/tenant/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Saved Listings',
        href: '/tenant/saved',
        icon: Home, // using Home for now, will fix to Heart later if needed
    },
    {
        title: 'My Inspections',
        href: '/tenant/inspections',
        icon: ShieldCheck,
    },
    {
        title: 'Active Applications',
        href: '/tenant/applications',
        icon: FileSignature,
    },
    {
        title: 'Payment History',
        href: '/tenant/payments',
        icon: ShieldAlert, // using ShieldAlert for now
    },
    {
        title: 'Disputes',
        href: '/tenant/disputes',
        icon: UserCheck,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
