import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function ServiceDetail({ service }) {
    const [selectedImg, setSelectedImg] = useState(null);

    const provider = service?.provider || {};
    const photos = service?.photos || (service?.photo ? [service.photo] : []);

    // 1. Generate a consistent color palette per provider if backend colors are missing
    const dynamicTheme = useMemo(() => {
        // Use custom brand color from DB if present
        if (provider.color_primary) {
            return {
                primary: provider.color_primary,
                bg: provider.color_bg || '#FFF8F0',
                border: provider.color_border || '#FDE68A',
                text: provider.color_text || '#92400e',
                buttonBg: provider.color_button || provider.color_primary,
                buttonText: provider.color_button_text || '#ffffff',
            };
        }

        // Deterministic hash to generate unique hues per provider name / ID
        const key = provider.id || provider.shop_name || 'default';
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = key.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = Math.abs(hash) % 360;

        return {
            primary: `hsl(${hue}, 65%, 40%)`,
            bg: `hsl(${hue}, 40%, 97%)`,
            border: `hsl(${hue}, 35%, 88%)`,
            text: `hsl(${hue}, 70%, 25%)`,
            buttonBg: `hsl(${hue}, 60%, 45%)`,
            buttonText: '#ffffff',
        };
    }, [provider]);

    return (
        <div 
            className="min-h-screen font-sans flex flex-col"
            style={{ backgroundColor: '#FAF9F6', color: '#1c1917' }}
        >
            <Head>
                <title>{`${provider.shop_name || 'DivaBook'} | ${service.name || 'Service'}`}</title>
            </Head>

            {/* Navigation Bar */}
            <nav 
                className="sticky top-0 z-50 flex items-center justify-between px-[5%] py-3 shadow-md"
                style={{ backgroundColor: '#14532d', color: '#ffffff' }}
            >
                <div className="flex items-center gap-6 text-xs tracking-widest font-medium">
                    <Link href="/" className="hover:text-emerald-200 transition" style={{ color: '#ffffff' }}>HOME</Link>
                    <Link href="/services" className="font-bold border-b-2 border-white pb-0.5" style={{ color: '#ffffff' }}>SERVICES</Link>
                </div>
                <div className="text-center">
                    <Link href="/" className="font-['Crimson_Pro'] italic text-2xl tracking-widest" style={{ color: '#F9F8F6' }}>
                        DIVABOOK
                    </Link>
                </div>
                <div className="flex items-center gap-6 text-xs tracking-widest font-medium">
                    <Link href="/contact" className="hover:text-emerald-200 transition" style={{ color: '#ffffff' }}>CONTACT US</Link>
                </div>
            </nav>

            <main 
                className="max-w-[1100px] mx-auto w-full px-6 py-4 flex-grow space-y-4"
                style={{ backgroundColor: '#FAF9F6', color: '#1c1917' }}
            >
                
                {/* 1. Dynamic Provider Header Banner */}
                <div 
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border-l-4 border shadow-sm"
                    style={{ 
                        backgroundColor: dynamicTheme.bg, 
                        borderColor: dynamicTheme.border,
                        borderLeftColor: dynamicTheme.primary,
                        color: '#1c1917'
                    }}
                >
                    <div 
                        className="w-14 h-14 rounded-full overflow-hidden border-2 flex items-center justify-center flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: '#ffffff', borderColor: dynamicTheme.border }}
                    >
                        {provider.logo ? (
                            <img src={provider.logo} alt={provider.shop_name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="font-['Noto_Serif'] text-xl font-bold italic" style={{ color: dynamicTheme.text }}>
                                {(provider.shop_name || 'S').charAt(0)}
                            </span>
                        )}
                    </div>

                    <div className="flex-1 space-y-1">
                        <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: dynamicTheme.text }}>
                            SERVICE PROVIDER
                        </p>
                        <h2 className="font-['Noto_Serif'] text-xl font-bold leading-tight" style={{ color: '#1c1917' }}>
                            {provider.shop_name || "Skela's Nail Art"}
                        </h2>
                        <p className="text-xs" style={{ color: '#44403c' }}>
                            {provider.description || 'Amazing Nail Art by Skela'}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-medium" style={{ color: '#292524' }}>
                            <span 
                                className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border font-medium"
                                style={{ backgroundColor: '#ffffff', color: dynamicTheme.text, borderColor: dynamicTheme.border }}
                            >
                                🎓 {provider.credentials || '10 years experience'}
                            </span>
                            <span>📍 {provider.address || 'mandug davao city'}</span>
                            <span>📞 {provider.phone || '1234567891'}</span>
                            <span>✉️ {provider.email || 'skela@gmail.com'}</span>
                        </div>
                    </div>
                </div>

                {/* 2. Back Link */}
                <div>
                    <Link
                        href="/services"
                        className="inline-block text-[11px] uppercase tracking-widest font-semibold hover:opacity-80 transition"
                        style={{ color: '#57534e' }}
                    >
                        ← BACK TO SERVICE MENU
                    </Link>
                </div>

                {/* 3. Hero Image Banner (400px Height) */}
                <div 
                    className="relative w-full rounded-xl overflow-hidden shadow-sm border"
                    style={{ height: '400px', backgroundColor: '#f5f5f4', borderColor: '#e7e5e4' }}
                >
                    {service.photo ? (
                        <img
                            src={service.photo}
                            alt={service.name}
                            className="w-full h-full object-cover object-center"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: '#78716c' }}>
                            No service image provided
                        </div>
                    )}
                </div>

                {/* 4. Details & Dynamic Provider Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start pt-2">
                    
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-5">
                        
                        {/* Service Detail Box */}
                        <section 
                            className="p-5 rounded-xl border shadow-sm space-y-1"
                            style={{ backgroundColor: dynamicTheme.bg, borderColor: dynamicTheme.border, color: '#1c1917' }}
                        >
                            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: dynamicTheme.text }}>
                                {service.category || 'NAILS'}
                            </p>
                            <h3 className="font-['Noto_Serif'] text-lg font-bold" style={{ color: '#1c1917' }}>
                                {service.name || 'Nail Art'}
                            </h3>
                            {service.description && (
                                <p className="text-xs leading-relaxed pt-1" style={{ color: '#44403c' }}>
                                    {service.description}
                                </p>
                            )}
                        </section>

                        {/* Style Inspiration */}
                        <section className="space-y-3">
                            <h3 className="font-['Noto_Serif'] text-base font-bold" style={{ color: '#1c1917' }}>
                                Style Inspiration
                            </h3>
                            <div className="grid grid-cols-3 gap-3">
                                {[0, 1, 2].map((idx) => {
                                    const imgSrc = photos[idx];
                                    return (
                                        <div 
                                            key={idx} 
                                            className="rounded-lg overflow-hidden border shadow-sm"
                                            style={{ height: '140px', backgroundColor: '#f5f5f4', borderColor: '#e7e5e4' }}
                                        >
                                            {imgSrc ? (
                                                <img
                                                    src={imgSrc}
                                                    alt={`Inspiration ${idx + 1}`}
                                                    onClick={() => setSelectedImg(imgSrc)}
                                                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition duration-200"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] p-2 text-center" style={{ color: '#78716c' }}>
                                                    Inspiration image {idx + 1}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Dynamic Provider-Themed Booking Card */}
                    <aside className="space-y-4">
                        <div 
                            className="p-5 rounded-xl border shadow-sm space-y-5"
                            style={{ backgroundColor: dynamicTheme.bg, borderColor: dynamicTheme.border, color: '#1c1917' }}
                        >
                            <div className="grid grid-cols-2 gap-3 pb-3 border-b" style={{ borderColor: dynamicTheme.border }}>
                                <div>
                                    <span className="text-[10px] uppercase font-bold tracking-wider block" style={{ color: dynamicTheme.text }}>
                                        STARTING FROM
                                    </span>
                                    <span className="text-2xl font-bold" style={{ color: '#1c1917' }}>
                                        ₱{service.rate || '561'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase font-bold tracking-wider block" style={{ color: dynamicTheme.text }}>
                                        EST. TIME
                                    </span>
                                    <span className="text-2xl font-bold" style={{ color: '#1c1917' }}>
                                        {service.duration || '1 hour'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <span className="text-[10px] uppercase font-bold tracking-wider block" style={{ color: dynamicTheme.text }}>
                                    AVAILABLE ARTISTS
                                </span>
                                <p className="text-xs italic" style={{ color: '#57534e' }}>
                                    Artist availability confirmed upon booking.
                                </p>
                            </div>

                            {/* Dynamic Provider Brand Button */}
                            <button 
                                type="button" 
                                className="w-full font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 cursor-pointer transition-opacity hover:opacity-90"
                                style={{ 
                                    backgroundColor: dynamicTheme.buttonBg, 
                                    color: dynamicTheme.buttonText, 
                                    border: 'none',
                                    outline: 'none' 
                                }}
                            >
                                <span className="text-sm">📅</span> 
                                <span className="font-bold tracking-wider" style={{ color: dynamicTheme.buttonText }}>
                                    BOOK APPOINTMENT
                                </span>
                            </button>
                        </div>

                        {/* Sustainability Promise */}
                        <div 
                            className="p-4 rounded-xl border shadow-sm space-y-1"
                            style={{ backgroundColor: dynamicTheme.bg, borderColor: dynamicTheme.border, color: '#1c1917' }}
                        >
                            <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: dynamicTheme.text }}>
                                🌿 SUSTAINABILITY PROMISE
                            </div>
                            <p className="text-xs italic" style={{ color: '#44403c' }}>
                                "We only use 100% cruelty-free, ammonia-free products."
                            </p>
                        </div>
                    </aside>
                </div>
            </main>

            {/* Footer */}
            <footer 
                className="mt-auto px-[5%] py-4 border-t text-center text-xs"
                style={{ backgroundColor: '#F5F5F4', borderColor: '#e7e5e4', color: '#78716c' }}
            >
                © 2026 DivaBook. The Luxury of Care.
            </footer>

            {/* Image Zoom Modal */}
            {selectedImg && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 cursor-pointer"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
                    onClick={() => setSelectedImg(null)}
                >
                    <img src={selectedImg} alt="Zoomed view" className="max-w-full max-h-[85vh] rounded-xl object-contain" />
                </div>
            )}
        </div>
    );
}