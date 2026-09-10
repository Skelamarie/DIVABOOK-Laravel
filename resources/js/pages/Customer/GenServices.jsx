import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

export default function GenServices({
    services = [],
    selectedCategory = '',
    selectedAdminId = '',
}) {
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

        return (
            name.includes(query) ||
            shopName.includes(query) ||
            description.includes(query)
        );
    });

    return (
        <div className="flex min-h-screen flex-col bg-white font-sans text-[#0C0A09]">
            <Head>
                <title>DivaBook | All Available Services</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;1,400;1,600&family=Inter:wght@400;500;700&family=Noto+Serif:ital,wght@0,400;0,700;1,400&display=swap"
                    rel="stylesheet"
                />
            </Head>

            {/* --- TOP NAVIGATION BAR --- */}
            <nav className="sticky top-0 z-50 flex items-center justify-between bg-[#14532d] px-[5%] py-[25px] text-white">
                <div className="flex items-center gap-[30px] text-[13px] tracking-[1.5px]">
                    <Link
                        href="/"
                        className="transition hover:text-emerald-200"
                    >
                        HOME
                    </Link>
                    <Link
                        href="/services"
                        className="border-b-2 border-white pb-0.5 font-bold"
                    >
                        SERVICES
                    </Link>
                </div>

                <div className="text-center">
                    <Link
                        href="/"
                        className="font-['Crimson_Pro'] text-[32px] tracking-[2px] text-[#F9F8F6] italic"
                    >
                        DIVABOOK
                    </Link>
                </div>

                <div className="flex items-center gap-[30px] text-[13px] tracking-[1.5px]">
                    <Link
                        href="/contact"
                        className="transition hover:text-emerald-200"
                    >
                        CONTACT US
                    </Link>
                    <span className="cursor-pointer text-base">🔍</span>
                </div>
            </nav>

            <main className="mx-auto w-full max-w-[1200px] flex-grow px-[5%] py-12">
                {/* Back Link */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="text-xs font-semibold tracking-[2px] text-[#78716C] uppercase transition hover:text-[#064E3B]"
                    >
                        ← BACK TO HOME
                    </Link>
                </div>

                {/* Hero / Page Header */}
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <h1 className="mb-4 font-['Noto_Serif'] text-4xl font-bold text-[#0C0A09] sm:text-5xl">
                        All Available Services
                    </h1>
                    <p className="text-base leading-relaxed text-[#57534E]">
                        Explore our complete catalog of premium beauty and
                        wellness treatments across all our partner boutiques.
                    </p>
                </div>

                {/* Catalog Controls Header */}
                <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-stone-200 pb-6 md:flex-row md:items-end">
                    <div>
                        <h2 className="text-xl font-bold text-[#0C0A09]">
                            Complete Service Catalog
                        </h2>
                        <p className="mt-1 text-xs text-stone-500">
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
                            className="w-full rounded-lg border border-stone-300 px-4 py-2 text-xs focus:border-[#064E3B] focus:outline-none"
                        />
                    </div>
                </div>

                {/* Category Filter Pills */}
                <div className="mb-10 flex flex-wrap gap-2">
                    {categories.map((cat) => {
                        const isActive =
                            (selectedCategory?.toLowerCase() || '') === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryFilter(cat.id)}
                                className={`rounded-full px-5 py-2 text-xs font-bold tracking-wider transition ${
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
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {filteredServices.map((svc) => (
                            <div
                                key={svc.id}
                                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
                            >
                                <div>
                                    {/* Image Display */}
                                    <div className="relative h-56 w-full overflow-hidden bg-stone-100">
                                        <img
                                            src={svc.photo}
                                            alt={svc.name || 'Service'}
                                            className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                                        />
                                        <span className="absolute top-3 right-3 rounded-full bg-[#D2E9C7] px-3 py-1 text-[10px] font-bold text-[#384C33] uppercase">
                                            {svc.category || 'General'}
                                        </span>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-6">
                                        <p className="mb-1 text-[11px] font-semibold tracking-wider text-[#064E3B] uppercase">
                                            {svc.shop_name}
                                        </p>
                                        <h3 className="mb-2 font-['Noto_Serif'] text-xl font-bold text-[#0C0A09]">
                                            {svc.name}
                                        </h3>
                                        <p className="line-clamp-2 text-xs leading-relaxed text-stone-600">
                                            {svc.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="flex items-center justify-between border-t border-stone-100 px-6 pt-2 pb-6">
                                    <span className="text-base font-bold text-[#0C0A09]">
                                        ₱{svc.rate}
                                    </span>
                                    <Link
                                        href={`/services/${svc.id}`}
                                        className="rounded-lg bg-[#064E3B] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#043d2e]"
                                    >
                                        Book Now
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-stone-300 bg-[#F9F8F6] py-20 text-center">
                        <p className="text-sm text-stone-500">
                            No services found matching your criteria.
                        </p>
                    </div>
                )}
            </main>

            {/* --- FOOTER --- */}
            <footer className="mt-auto border-t border-stone-200 bg-[#F5F5F4] px-[5%] py-8 text-center text-xs text-[#78716C]">
                © 2026 DivaBook. The Luxury of Care.
            </footer>
        </div>
    );
}
