import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

export default function GenServices({ services = [], selectedCategory = '', selectedAdminId = '' }) {
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        { id: '', label: 'ALL SERVICES' },
        { id: 'hair', label: 'HAIR' },
        { id: 'nails', label: 'NAILS' },
        { id: 'makeup', label: 'MAKEUP' },
        { id: 'spa', label: 'SPA' },
    ];

    const handleCategoryFilter = (catId) => {
        const query = {};
        if (catId) query.category = catId;
        if (selectedAdminId) query.admin_id = selectedAdminId;

        router.get('/services', query, { preserveState: true });
    };

    const filteredServices = services.filter((svc) => {
        const query = searchQuery.toLowerCase();
        const name = (svc.name || '').toLowerCase();
        const shopName = (svc.shop_name || '').toLowerCase();
        const description = (svc.description || '').toLowerCase();

        return name.includes(query) || shopName.includes(query) || description.includes(query);
    });

    return (
        <div className="min-h-screen bg-white text-[#0C0A09] font-sans flex flex-col">
            <Head>
                <title>DivaBook | All Available Services</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;1,400;1,600&family=Inter:wght@400;500;700&family=Noto+Serif:ital,wght@0,400;0,700;1,400&display=swap"
                    rel="stylesheet"
                />
            </Head>

            {/* --- TOP NAVIGATION BAR --- */}
            <nav className="sticky top-0 z-50 flex items-center justify-between px-[5%] py-[25px] bg-[#14532d] text-white">
                <div className="flex items-center gap-[30px] text-[13px] tracking-[1.5px]">
                    <Link href="/" className="hover:text-emerald-200 transition">
                        HOME
                    </Link>
                    <Link href="/services" className="font-bold border-b-2 border-white pb-0.5">
                        SERVICES
                    </Link>
                </div>

                <div className="text-center">
                    <Link href="/" className="font-['Crimson_Pro'] italic text-[32px] tracking-[2px] text-[#F9F8F6]">
                        DIVABOOK
                    </Link>
                </div>

                <div className="flex items-center gap-[30px] text-[13px] tracking-[1.5px]">
                    <Link href="/contact" className="hover:text-emerald-200 transition">
                        CONTACT US
                    </Link>
                    <span className="cursor-pointer text-base">🔍</span>
                </div>
            </nav>

            <main className="max-w-[1200px] mx-auto w-full px-[5%] py-12 flex-grow">
                {/* Back Link */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="text-xs uppercase tracking-[2px] font-semibold text-[#78716C] hover:text-[#064E3B] transition"
                    >
                        ← BACK TO HOME
                    </Link>
                </div>

                {/* Hero / Page Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="font-['Noto_Serif'] text-4xl sm:text-5xl font-bold text-[#0C0A09] mb-4">
                        All Available Services
                    </h1>
                    <p className="text-[#57534E] text-base leading-relaxed">
                        Explore our complete catalog of premium beauty and wellness treatments across all our partner boutiques.
                    </p>
                </div>

                {/* Catalog Controls Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-stone-200 pb-6 gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-[#0C0A09]">Complete Service Catalog</h2>
                        <p className="text-xs text-stone-500 mt-1">
                            {filteredServices.length} total services available
                        </p>
                    </div>

                    {/* Search Input */}
                    <div className="w-full md:w-72">
                        <input
                            type="text"
                            placeholder="Search services or boutiques..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-[#064E3B]"
                        />
                    </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap gap-2 mb-10">
                    {categories.map((cat) => {
                        const isActive = (selectedCategory?.toLowerCase() || '') === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryFilter(cat.id)}
                                className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider transition ${
                                    isActive
                                        ? 'bg-[#064E3B] text-white'
                                        : 'bg-[#F5F5F4] text-[#44403C] hover:bg-stone-200'
                                }`}
                            >
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                {/* Services Grid (Image Cards) */}
                {filteredServices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {filteredServices.map((svc) => (
                            <div
                                key={svc.id}
                                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    {/* Image Display */}
                                    <div className="w-full h-56 bg-stone-100 overflow-hidden relative">
                                        <img
                                            src={svc.photo}
                                            alt={svc.name || 'Service'}
                                            className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                                        />
                                        <span className="absolute top-3 right-3 bg-[#D2E9C7] text-[#384C33] text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                                            {svc.category || 'General'}
                                        </span>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-6">
                                        <p className="text-[11px] font-semibold text-[#064E3B] uppercase tracking-wider mb-1">
                                            {svc.shop_name}
                                        </p>
                                        <h3 className="font-['Noto_Serif'] text-xl font-bold text-[#0C0A09] mb-2">
                                            {svc.name}
                                        </h3>
                                        <p className="text-stone-600 text-xs leading-relaxed line-clamp-2">
                                            {svc.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-stone-100">
                                    <span className="font-bold text-base text-[#0C0A09]">
                                        ₱{svc.rate}
                                    </span>
                                    <Link
                                        href={`/services/${svc.id}`}
                                        className="bg-[#064E3B] hover:bg-[#043d2e] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition"
                                    >
                                        Book Now
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-[#F9F8F6] rounded-2xl border border-dashed border-stone-300">
                        <p className="text-stone-500 text-sm">
                            No services found matching your criteria.
                        </p>
                    </div>
                )}
            </main>

            {/* --- FOOTER --- */}
            <footer className="mt-auto bg-[#F5F5F4] px-[5%] py-8 border-t border-stone-200 text-center text-xs text-[#78716C]">
                © 2026 DivaBook. The Luxury of Care.
            </footer>
        </div>
    );
}