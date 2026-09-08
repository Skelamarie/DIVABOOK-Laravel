import React from 'react';
import { Link, router } from '@inertiajs/react';

interface NavbarProps {
    active: 'overview' | 'bookings' | 'customization';
    salonName?: string;
    adminId?: string;
}

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
            </div>

            <div className="flex items-center gap-4">
                {adminId && (
                    <span className="rounded bg-stone-100 px-2.5 py-1 font-mono text-xs text-stone-700">
                        {adminId}
                    </span>
                )}
                <button
                    onClick={() => router.post('/logout')}
                    className="text-xs font-bold tracking-wider text-red-600 uppercase hover:text-red-700"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}
