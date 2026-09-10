import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import B1 from './B1'; // Adjust path if B1.jsx is in a different folder
import B2 from './B2'; // Adjust path if B2.jsx is in a different folder
import P1 from './P1'; // <-- ADD THIS IMPORT

// Catches render errors inside the booking flow (B1/B2/P1) so a bug in one of
// those steps shows a visible message instead of silently blanking the page,
// which is what makes "the button does nothing" bugs so hard to diagnose.
class BookingErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }
    static getDerivedStateFromError(error) {
        return { error };
    }
    componentDidCatch(error, info) {
        // Also log full details to the console so you can inspect the stack trace.
        console.error('Booking flow crashed:', error, info);
    }
    render() {
        if (this.state.error) {
            return (
                <div style={{ padding: 40, fontFamily: 'monospace', color: '#7f1d1d', background: '#fef2f2' }}>
                    <h2 style={{ marginBottom: 12 }}>Something broke while loading the booking step.</h2>
                    <p style={{ marginBottom: 12 }}>{String(this.state.error.message || this.state.error)}</p>
                    <button
                        type="button"
                        onClick={() => { this.setState({ error: null }); this.props.onReset?.(); }}
                        style={{ padding: '8px 16px', cursor: 'pointer' }}
                    >
                        ← Go back
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default function ServiceDetail({ service, occupiedSlotsMap = {} }) {
    const [selectedImg, setSelectedImg] = useState(null);
    
    // Booking flow step state:
    // 0 = Service Details View
    // 1 = B1.jsx (Step 1: Booking Details / Date & Time)
    // 2 = B2.jsx (Step 2: Personal Information)
    const [bookingStep, setBookingStep] = useState(0); 

    // Store shared booking data collected between B1 and B2
    const [bookingData, setBookingData] = useState({});

    const provider = service?.provider || {};
    const photos = service?.photos || (service?.photo ? [service.photo] : []);

    // 1. Generate a consistent color palette per provider if backend colors are missing
    const dynamicTheme = useMemo(() => {
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

        // Coerce to a string first: provider.id is usually a number, and numbers
        // don't have .length / .charCodeAt, which used to crash this hash on render.
        const key = String(provider.id || provider.shop_name || 'default');
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

    // Handle transition from B1 -> B2 (Called when "CONFIRM APPOINTMENT" is clicked in B1)
    const handleB1Next = (dataFromB1) => {
        setBookingData(prev => ({ ...prev, ...dataFromB1 }));
        setBookingStep(2); // Go to B2
    };

    // B1/B2/P1 expect different field names than `provider` uses
    // (salon_name/logo_path/location vs shop_name/logo/address).
    // Alias them here so the real salon info shows up instead of silently
    // falling back to the "DivaBook" placeholder defaults inside those steps.
    const salonProfileForBooking = {
        ...provider,
        salon_name: provider.salon_name || provider.shop_name,
        logo_path: provider.logo_path || provider.logo,
        location: provider.location || provider.address,
    };

// Step 1: Render B1 Component
    if (bookingStep === 1) {
        return (
            <BookingErrorBoundary onReset={() => setBookingStep(0)}>
                <B1
                    service={service}
                    salonProfile={salonProfileForBooking}
                    occupiedSlotsMap={occupiedSlotsMap}
                    onBack={() => setBookingStep(0)}
                    onNext={(dataFromB1) => {
                        setBookingData(prev => ({ ...prev, ...dataFromB1 }));
                        setBookingStep(2); // Move to B2
                    }}
                />
            </BookingErrorBoundary>
        );
    }

    // Step 2: Render B2 Component
    if (bookingStep === 2) {
        return (
            <BookingErrorBoundary onReset={() => setBookingStep(1)}>
                <B2
                    bookingData={bookingData}
                    salonProfile={salonProfileForBooking}
                    onBack={() => setBookingStep(1)}
                    onNext={(finalData) => {
                        setBookingData(prev => ({ ...prev, ...finalData }));
                        setBookingStep(3); // Move to P1
                    }}
                />
            </BookingErrorBoundary>
        );
    }

    // Step 3: Render P1 Component
    if (bookingStep === 3) {
        return (
            <BookingErrorBoundary onReset={() => setBookingStep(2)}>
                <P1
                    bookingData={bookingData}
                    salonProfile={salonProfileForBooking}
                    service={service}
                    onBack={() => setBookingStep(2)}
                    onSubmit={(finalBookingData) => {
                        // TODO: wire this up to your actual booking submission
                        // (e.g. Inertia's router.post('/booking/confirm', finalBookingData)).
                        console.log('Booking submitted:', { ...bookingData, ...finalBookingData });
                    }}
                    onGoHome={() => { window.location.href = '/'; }}
                />
            </BookingErrorBoundary>
        );
    }

    return (
        <div
            className="flex min-h-screen flex-col font-sans"
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
                <div className="flex items-center gap-6 text-xs font-medium tracking-widest">
                    <Link
                        href="/"
                        className="transition hover:text-emerald-200"
                        style={{ color: '#ffffff' }}
                    >
                        HOME
                    </Link>
                    <Link
                        href="/services"
                        className="border-b-2 border-white pb-0.5 font-bold"
                        style={{ color: '#ffffff' }}
                    >
                        SERVICES
                    </Link>
                </div>
                <div className="text-center">
                    <Link
                        href="/"
                        className="font-['Crimson_Pro'] text-2xl tracking-widest italic"
                        style={{ color: '#F9F8F6' }}
                    >
                        DIVABOOK
                    </Link>
                </div>
                <div className="flex items-center gap-6 text-xs font-medium tracking-widest">
                    <Link
                        href="/contact"
                        className="transition hover:text-emerald-200"
                        style={{ color: '#ffffff' }}
                    >
                        CONTACT US
                    </Link>
                </div>
            </nav>

            <main
                className="mx-auto w-full max-w-[1100px] flex-grow space-y-4 px-6 py-4"
                style={{ backgroundColor: '#FAF9F6', color: '#1c1917' }}
            >
                {/* 1. Dynamic Provider Header Banner */}
                <div
                    className="flex flex-col items-start gap-4 rounded-xl border border-l-4 p-4 shadow-sm sm:flex-row sm:items-center"
                    style={{
                        backgroundColor: dynamicTheme.bg,
                        borderColor: dynamicTheme.border,
                        borderLeftColor: dynamicTheme.primary,
                        color: '#1c1917',
                    }}
                >
                    <div
                        className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 shadow-sm"
                        style={{
                            backgroundColor: '#ffffff',
                            borderColor: dynamicTheme.border,
                        }}
                    >
                        {provider.logo ? (
                            <img
                                src={provider.logo}
                                alt={provider.shop_name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span
                                className="font-['Noto_Serif'] text-xl font-bold italic"
                                style={{ color: dynamicTheme.text }}
                            >
                                {(provider.shop_name || 'S').charAt(0)}
                            </span>
                        )}
                    </div>

                    <div className="flex-1 space-y-1">
                        <p
                            className="text-[10px] font-bold tracking-widest uppercase"
                            style={{ color: dynamicTheme.text }}
                        >
                            SERVICE PROVIDER
                        </p>
                        <h2
                            className="font-['Noto_Serif'] text-xl leading-tight font-bold"
                            style={{ color: '#1c1917' }}
                        >
                            {provider.shop_name || "Skela's Nail Art"}
                        </h2>
                        <p className="text-xs" style={{ color: '#44403c' }}>
                            {provider.description || 'Amazing Nail Art by Skela'}
                        </p>

                        <div
                            className="flex flex-wrap items-center gap-4 pt-1 text-xs font-medium"
                            style={{ color: '#292524' }}
                        >
                            <span
                                className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium"
                                style={{
                                    backgroundColor: '#ffffff',
                                    color: dynamicTheme.text,
                                    borderColor: dynamicTheme.border,
                                }}
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
                        className="inline-block text-[11px] font-semibold tracking-widest uppercase transition hover:opacity-80"
                        style={{ color: '#57534e' }}
                    >
                        ← BACK TO SERVICE MENU
                    </Link>
                </div>

                {/* 3. Hero Image Banner */}
                <div
                    className="relative w-full overflow-hidden rounded-xl border shadow-sm"
                    style={{
                        height: '400px',
                        backgroundColor: '#f5f5f4',
                        borderColor: '#e7e5e4',
                    }}
                >
                    {service.photo ? (
                        <img
                            src={service.photo}
                            alt={service.name}
                            className="h-full w-full object-cover object-center"
                        />
                    ) : (
                        <div
                            className="flex h-full w-full items-center justify-center text-xs"
                            style={{ color: '#78716c' }}
                        >
                            No service image provided
                        </div>
                    )}
                </div>

                {/* 4. Details & Dynamic Provider Layout */}
                <div className="grid grid-cols-1 items-start gap-6 pt-2 lg:grid-cols-3">
                    {/* Left Column */}
                    <div className="space-y-5 lg:col-span-2">
                        {/* Service Detail Box */}
                        <section
                            className="space-y-1 rounded-xl border p-5 shadow-sm"
                            style={{
                                backgroundColor: dynamicTheme.bg,
                                borderColor: dynamicTheme.border,
                                color: '#1c1917',
                            }}
                        >
                            <p
                                className="text-[10px] font-bold tracking-wider uppercase"
                                style={{ color: dynamicTheme.text }}
                            >
                                {service.category || 'NAILS'}
                            </p>
                            <h3
                                className="font-['Noto_Serif'] text-lg font-bold"
                                style={{ color: '#1c1917' }}
                            >
                                {service.name || 'Nail Art'}
                            </h3>
                            {service.description && (
                                <p
                                    className="pt-1 text-xs leading-relaxed"
                                    style={{ color: '#44403c' }}
                                >
                                    {service.description}
                                </p>
                            )}
                        </section>

                        {/* Style Inspiration */}
                        <section className="space-y-3">
                            <h3
                                className="font-['Noto_Serif'] text-base font-bold"
                                style={{ color: '#1c1917' }}
                            >
                                Style Inspiration
                            </h3>
                            <div className="grid grid-cols-3 gap-3">
                                {[0, 1, 2].map((idx) => {
                                    const imgSrc = photos[idx];
                                    return (
                                        <div
                                            key={idx}
                                            className="overflow-hidden rounded-lg border shadow-sm"
                                            style={{
                                                height: '140px',
                                                backgroundColor: '#f5f5f4',
                                                borderColor: '#e7e5e4',
                                            }}
                                        >
                                            {imgSrc ? (
                                                <img
                                                    src={imgSrc}
                                                    alt={`Inspiration ${idx + 1}`}
                                                    onClick={() => setSelectedImg(imgSrc)}
                                                    className="h-full w-full cursor-pointer object-cover transition duration-200 hover:scale-105"
                                                />
                                            ) : (
                                                <div
                                                    className="flex h-full w-full items-center justify-center p-2 text-center text-[10px]"
                                                    style={{ color: '#78716c' }}
                                                >
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
                            className="space-y-5 rounded-xl border p-5 shadow-sm"
                            style={{
                                backgroundColor: dynamicTheme.bg,
                                borderColor: dynamicTheme.border,
                                color: '#1c1917',
                            }}
                        >
                            <div
                                className="grid grid-cols-2 gap-3 border-b pb-3"
                                style={{ borderColor: dynamicTheme.border }}
                            >
                                <div>
                                    <span
                                        className="block text-[10px] font-bold tracking-wider uppercase"
                                        style={{ color: dynamicTheme.text }}
                                    >
                                        STARTING FROM
                                    </span>
                                    <span
                                        className="text-2xl font-bold"
                                        style={{ color: '#1c1917' }}
                                    >
                                        ₱{service.rate || '561'}
                                    </span>
                                </div>
                                <div>
                                    <span
                                        className="block text-[10px] font-bold tracking-wider uppercase"
                                        style={{ color: dynamicTheme.text }}
                                    >
                                        EST. TIME
                                    </span>
                                    <span
                                        className="text-2xl font-bold"
                                        style={{ color: '#1c1917' }}
                                    >
                                        {service.duration || '1 hour'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <span
                                    className="block text-[10px] font-bold tracking-wider uppercase"
                                    style={{ color: dynamicTheme.text }}
                                >
                                    AVAILABLE ARTISTS
                                </span>
                                <p
                                    className="text-xs italic"
                                    style={{ color: '#57534e' }}
                                >
                                    Artist availability confirmed upon booking.
                                </p>
                            </div>

                            {/* Book Appointment Button */}
                            <button
                                type="button"
                                onClick={() => setBookingStep(1)} // Opens Step 1 (B1)
                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-xs font-bold tracking-wider uppercase shadow-md transition-opacity hover:opacity-90"
                                style={{
                                    backgroundColor: dynamicTheme.buttonBg,
                                    color: dynamicTheme.buttonText,
                                    border: 'none',
                                    outline: 'none',
                                }}
                            >
                                <span className="text-sm">📅</span>
                                <span
                                    className="font-bold tracking-wider"
                                    style={{ color: dynamicTheme.buttonText }}
                                >
                                    BOOK APPOINTMENT
                                </span>
                            </button>
                        </div>

                        {/* Sustainability Promise */}
                        <div
                            className="space-y-1 rounded-xl border p-4 shadow-sm"
                            style={{
                                backgroundColor: dynamicTheme.bg,
                                borderColor: dynamicTheme.border,
                                color: '#1c1917',
                            }}
                        >
                            <div
                                className="flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase"
                                style={{ color: dynamicTheme.text }}
                            >
                                🌿 SUSTAINABILITY PROMISE
                            </div>
                            <p
                                className="text-xs italic"
                                style={{ color: '#44403c' }}
                            >
                                "We only use 100% cruelty-free, ammonia-free products."
                            </p>
                        </div>
                    </aside>
                </div>
            </main>

            {/* Footer */}
            <footer
                className="mt-auto border-t px-[5%] py-4 text-center text-xs"
                style={{
                    backgroundColor: '#F5F5F4',
                    borderColor: '#e7e5e4',
                    color: '#78716c',
                }}
            >
                © 2026 DivaBook. The Luxury of Care.
            </footer>

            {/* Image Zoom Modal */}
            {selectedImg && (
                <div
                    className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center p-4"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
                    onClick={() => setSelectedImg(null)}
                >
                    <img
                        src={selectedImg}
                        alt="Zoomed view"
                        className="max-h-[85vh] max-w-full rounded-xl object-contain"
                    />
                </div>
            )}
        </div>
    );
}