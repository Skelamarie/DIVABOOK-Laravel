import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function ServiceList({ services = [], partner }) {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', ...new Set(services.map((s) => s.category))];
    const filteredServices =
        selectedCategory === 'All'
            ? services
            : services.filter((s) => s.category === selectedCategory);

    return (
        <div className="min-h-screen bg-[#FDF8F7] pb-16 text-stone-800">
            <Head title={`Services | ${partner?.shop_name || 'DivaBook'}`} />

            {/* Storefront Header */}
            <div className="bg-emerald-900 px-6 py-12 text-white">
                <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <span className="text-xs font-semibold tracking-widest text-emerald-300 uppercase">
                            Verified Partner
                        </span>
                        <h1 className="mt-1 text-3xl font-extrabold">
                            {partner?.shop_name || 'Belleza Nails & Beauty'}
                        </h1>
                        <p className="mt-1 text-sm text-emerald-100/80">
                            {partner?.address || 'Davao City, Philippines'}
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="rounded-xl border border-emerald-700 bg-emerald-800/80 px-4 py-2 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-800"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>

            <main className="mx-auto mt-10 max-w-6xl px-6">
                {/* Category Filter Pills */}
                <div className="flex gap-2 overflow-x-auto pb-4">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                                selectedCategory === cat
                                    ? 'bg-emerald-900 text-white shadow-sm'
                                    : 'border border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Service Cards Grid */}
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredServices.map((service) => (
                        <div
                            key={service.id}
                            className="flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition hover:shadow-md"
                        >
                            <div>
                                {service.photos && service.photos[0] && (
                                    <img
                                        src={service.photos[0]}
                                        alt={service.name}
                                        className="h-44 w-full object-cover"
                                    />
                                )}
                                <div className="p-5">
                                    <span className="text-[11px] font-bold tracking-wider text-rose-600 uppercase">
                                        {service.category}
                                    </span>
                                    <h2 className="mt-1 text-lg font-bold text-stone-900">
                                        {service.name}
                                    </h2>
                                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-stone-500">
                                        {service.description}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between border-t border-stone-100 p-5 pt-0">
                                <div>
                                    <span className="text-[11px] font-semibold text-stone-400 uppercase">
                                        Rate
                                    </span>
                                    <p className="text-base font-extrabold text-stone-900">
                                        ₱{service.rate}
                                    </p>
                                </div>
                                <Link
                                    href={`/booking/create?service_id=${service.id}`}
                                    className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow transition hover:bg-rose-700"
                                >
                                    Book Now
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
