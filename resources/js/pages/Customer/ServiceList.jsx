import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function ServiceList({ services = [], partner }) {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', ...new Set(services.map(s => s.category))];
    const filteredServices = selectedCategory === 'All'
        ? services
        : services.filter(s => s.category === selectedCategory);

    return (
        <div className="min-h-screen bg-[#FDF8F7] text-stone-800 pb-16">
            <Head title={`Services | ${partner?.shop_name || 'DivaBook'}`} />

            {/* Storefront Header */}
            <div className="bg-emerald-900 text-white py-12 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <span className="text-xs uppercase tracking-widest text-emerald-300 font-semibold">Verified Partner</span>
                        <h1 className="text-3xl font-extrabold mt-1">{partner?.shop_name || 'Belleza Nails & Beauty'}</h1>
                        <p className="text-emerald-100/80 text-sm mt-1">{partner?.address || 'Davao City, Philippines'}</p>
                    </div>
                    <Link
                        href="/"
                        className="text-xs font-semibold px-4 py-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-700 transition"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-6 mt-10">
                {/* Category Filter Pills */}
                <div className="flex gap-2 pb-4 overflow-x-auto">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                                selectedCategory === cat
                                    ? 'bg-emerald-900 text-white shadow-sm'
                                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Service Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {filteredServices.map(service => (
                        <div
                            key={service.id}
                            className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                        >
                            <div>
                                {service.photos && service.photos[0] && (
                                    <img
                                        src={service.photos[0]}
                                        alt={service.name}
                                        className="w-full h-44 object-cover"
                                    />
                                )}
                                <div className="p-5">
                                    <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">
                                        {service.category}
                                    </span>
                                    <h2 className="text-lg font-bold text-stone-900 mt-1">{service.name}</h2>
                                    <p className="text-xs text-stone-500 mt-2 line-clamp-2 leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>
                            </div>

                            <div className="p-5 pt-0 border-t border-stone-100 flex items-center justify-between mt-4">
                                <div>
                                    <span className="text-[11px] text-stone-400 uppercase font-semibold">Rate</span>
                                    <p className="text-base font-extrabold text-stone-900">₱{service.rate}</p>
                                </div>
                                <Link
                                    href={`/booking/create?service_id=${service.id}`}
                                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow transition"
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