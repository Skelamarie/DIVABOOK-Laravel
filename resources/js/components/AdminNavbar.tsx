import React from 'react';
import { Link, router } from '@inertiajs/react';

interface NavbarProps {
    active: 'overview' | 'bookings' | 'customization';
    salonName?: string;
    adminId?: string;
}

export default function AdminNavbar({ active, salonName = 'DivaBook', adminId }: NavbarProps) {
    return (
        <nav className="fixed top-0 left-0 w-full h-[76px] bg-white border-b border-stone-200 z-50 flex items-center justify-between px-6 md:px-10">
            <div className="flex items-center gap-8">
                <span className="font-serif italic font-extrabold text-2xl text-[#064E3B]">
                    {salonName}
                </span>
                <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-stone-500">
                    <Link
                        href="/admin/overview"
                        className={`transition pb-1 ${active === 'overview' ? 'text-[#064E3B] border-b-2 border-[#064E3B]' : 'hover:text-[#064E3B]'}`}
                    >
                        Overview
                    </Link>
                    <Link
                        href="/admin/bookings"
                        className={`transition pb-1 ${active === 'bookings' ? 'text-[#064E3B] border-b-2 border-[#064E3B]' : 'hover:text-[#064E3B]'}`}
                    >
                        Bookings &amp; Appointments
                    </Link>
                    <Link
                        href="/admin/customization"
                        className={`transition pb-1 ${active === 'customization' ? 'text-[#064E3B] border-b-2 border-[#064E3B]' : 'hover:text-[#064E3B]'}`}
                    >
                        Customization
                    </Link>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {adminId && (
                    <span className="text-xs px-2.5 py-1 bg-stone-100 rounded text-stone-700 font-mono">
                        {adminId}
                    </span>
                )}
                <button
                    onClick={() => router.post('/logout')}
                    className="text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-700"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}