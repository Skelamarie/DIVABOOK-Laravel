import { Link, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    House,
    LayoutGrid,
    LogOut,
    Mail,
    Paintbrush,
    Scissors,
    Users,
} from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

const adminItems: NavItem[] = [
    { title: 'Overview', href: '/admin/overview', icon: LayoutGrid },
    {
        title: 'Booking & Appointment',
        href: '/admin/bookings',
        icon: CalendarDays,
    },
    { title: 'Client', href: '/admin/clients', icon: Users },
    { title: 'Services', href: '/admin/services', icon: Scissors },
    { title: 'Customization', href: '/admin/customization', icon: Paintbrush },
];
const customerItems: NavItem[] = [
    { title: 'Home', href: '/', icon: House },
    { title: 'Services', href: '/services', icon: Scissors },
    { title: 'Contact Us', href: '/contact', icon: Mail },
];

export function AppSidebar() {
    const { partnerSession } = usePage().props;
    const isPartner = Boolean(partnerSession?.admin_id);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={isPartner ? '/admin/overview' : '/'}>
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-900 font-bold text-white">
                                    D
                                </span>
                                <span className="truncate font-semibold">
                                    DivaBook
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={isPartner ? adminItems : customerItems} />
            </SidebarContent>
            <SidebarFooter>
                {isPartner && (
                    <div className="text-muted-foreground truncate px-2 text-xs group-data-[collapsible=icon]:hidden">
                        {partnerSession.shop_name}
                        <br />
                        {partnerSession.admin_id}
                    </div>
                )}
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            tooltip={isPartner ? 'Logout' : 'Partner Login'}
                        >
                            {isPartner ? (
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="w-full"
                                >
                                    <LogOut />
                                    <span>Logout</span>
                                </Link>
                            ) : (
                                <Link href="/login">
                                    <Users />
                                    <span>Partner Login</span>
                                </Link>
                            )}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
