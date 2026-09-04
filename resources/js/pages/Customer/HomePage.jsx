import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#FDF8F7] text-stone-800">
            <Head title="DivaBook | Beauty & Wellness Booking" />

            {/* Navigation Bar */}
            <nav className="border-b border-rose-100 bg-white/80 backdrop-blur px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-black tracking-tight text-emerald-900">DivaBook</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        href="/services"
                        className="text-sm font-semibold text-stone-600 hover:text-emerald-800 transition"
                    >
                        Services
                    </Link>
                    <Link
                        href="/login"
                        className="text-xs font-semibold px-4 py-2 rounded-full border border-stone-300 hover:bg-stone-50 transition"
                    >
                        Partner Portal
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="max-w-4xl mx-auto text-center py-20 px-6">
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-rose-600 bg-rose-50 px-3.5 py-1 rounded-full border border-rose-200/60 mb-4">
                    Freelance Beauty Hub
                </span>
                <h1 className="text-4xl sm:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight">
                    Effortless booking for your favorite beauty rituals.
                </h1>
                <p className="mt-4 text-stone-600 text-base sm:text-lg max-w-2xl mx-auto">
                    Explore services from verified beauty professionals, select appointment dates in real time, and lock in your session seamlessly.
                </p>

                <div className="mt-8 flex justify-center gap-4">
                    <Link
                        href="/services"
                        className="px-7 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-900/10 transition transform active:scale-95"
                    >
                        Browse Services
                    </Link>
                </div>
            </header>
        </div>
    );
}