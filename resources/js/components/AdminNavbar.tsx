import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Power } from 'lucide-react';

interface NavbarProps {
    active: 'overview' | 'bookings' | 'customization';
    adminId?: string;
}

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
            </div>

            <div className="flex items-center gap-4">
                {adminId && (
                    <span className="hidden sm:inline text-xs px-2.5 py-1 bg-white/10 rounded text-white font-mono">
                        Admin: {adminId}
                    </span>
                )}
                <button
                    onClick={() => router.post('/logout')}
                    type="button"
                    aria-label="Logout"
                    title="Logout"
                    className="text-white hover:text-emerald-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#14532d]"
                >
                    <Power size={20} strokeWidth={2.25} aria-hidden="true" />
                </button>
            </div>
        </nav>
    );
}