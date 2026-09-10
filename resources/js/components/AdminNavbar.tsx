import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Power } from 'lucide-react';

interface NavbarProps {
    active: 'overview' | 'bookings' | 'customization';
    adminId?: string;
}

<<<<<<< HEAD
export default function AdminNavbar({
    active,
    salonName = 'DivaBook',
    adminId,
}: NavbarProps) {
    return (
        <nav className="fixed top-0 left-0 z-50 flex h-[76px] w-full items-center justify-between border-b border-stone-200 bg-white px-6 md:px-10">
            <div className="flex items-center gap-8">
                <span className="font-serif text-2xl font-extrabold text-[#064E3B] italic">
                    {salonName}
                </span>
                <div className="hidden items-center gap-6 text-sm font-semibold text-stone-500 md:flex">
                    <Link
                        href="/admin/overview"
                        className={`pb-1 transition ${active === 'overview' ? 'border-b-2 border-[#064E3B] text-[#064E3B]' : 'hover:text-[#064E3B]'}`}
                    >
                        Overview
                    </Link>
                    <Link
                        href="/admin/bookings"
                        className={`pb-1 transition ${active === 'bookings' ? 'border-b-2 border-[#064E3B] text-[#064E3B]' : 'hover:text-[#064E3B]'}`}
                    >
                        Bookings &amp; Appointments
                    </Link>
                    <Link
                        href="/admin/customization"
                        className={`pb-1 transition ${active === 'customization' ? 'border-b-2 border-[#064E3B] text-[#064E3B]' : 'hover:text-[#064E3B]'}`}
                    >
                        Customization
                    </Link>
                </div>
=======
export default function AdminNavbar({ active, adminId }: NavbarProps) {
    return (
        <nav className="fixed top-0 left-0 w-full h-[76px] bg-[#14532d] text-white z-50 flex items-center justify-between px-6 md:px-10">
            <div className="flex items-center">
                <span className="font-serif italic font-extrabold text-2xl">
                    DIVABOOK
                </span>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 md:gap-6 text-[10px] sm:text-xs md:text-sm font-semibold text-white whitespace-nowrap">
                <Link
                    href="/admin/overview"
                    className={`transition pb-1 ${active === 'overview' ? 'border-b-2 border-white' : 'hover:text-emerald-200'}`}
                >
                    OVERVIEW
                </Link>
                <Link
                    href="/admin/bookings"
                    className={`transition pb-1 ${active === 'bookings' ? 'border-b-2 border-white' : 'hover:text-emerald-200'}`}
                >
                    BOOKINGS &amp; APPOINTMENTS
                </Link>
                <Link
                    href="/admin/customization"
                    className={`transition pb-1 ${active === 'customization' ? 'border-b-2 border-white' : 'hover:text-emerald-200'}`}
                >
                    CUSTOMIZATION
                </Link>
>>>>>>> cd3009760716be2bcbf08c7fd8ffea22f330cb8d
            </div>

            <div className="flex items-center gap-4">
                {adminId && (
<<<<<<< HEAD
                    <span className="rounded bg-stone-100 px-2.5 py-1 font-mono text-xs text-stone-700">
                        {adminId}
=======
                    <span className="hidden sm:inline text-xs px-2.5 py-1 bg-white/10 rounded text-white font-mono">
                        Admin: {adminId}
>>>>>>> cd3009760716be2bcbf08c7fd8ffea22f330cb8d
                    </span>
                )}
                <button
                    onClick={() => router.post('/logout')}
<<<<<<< HEAD
                    className="text-xs font-bold tracking-wider text-red-600 uppercase hover:text-red-700"
=======
                    type="button"
                    aria-label="Logout"
                    title="Logout"
                    className="text-white hover:text-emerald-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#14532d]"
>>>>>>> cd3009760716be2bcbf08c7fd8ffea22f330cb8d
                >
                    <Power size={20} strokeWidth={2.25} aria-hidden="true" />
                </button>
            </div>
        </nav>
    );
}
