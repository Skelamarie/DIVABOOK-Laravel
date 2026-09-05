import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

interface PartnerItem {
    id: string;
    admin_id: string;
    name: string;
    description: string;
    logo: string | null;
}

interface HomePageProps {
    recommended?: PartnerItem[];
    catalogCategories?: {
        hair?: boolean;
        nails?: boolean;
        makeup?: boolean;
        spa?: boolean;
    };
}

export default function HomePage({ recommended = [], catalogCategories }: HomePageProps) {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white text-[#0C0A09] font-sans flex flex-col">
            <Head>
                <title>DivaBook | Premium Beauty Booking</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;1,400;1,600&family=Inter:wght@400;500;700&family=Noto+Serif:ital,wght@0,400;0,700;1,400&display=swap"
                    rel="stylesheet"
                />
            </Head>

            {/* --- TOP NAVIGATION BAR --- */}
            <nav className="sticky top-0 z-50 flex items-center justify-between px-[5%] py-[25px] bg-[#14532d] text-white">
                <div className="hidden md:flex items-center gap-[30px] text-[13px] tracking-[1.5px]">
                    <Link href="/" className="font-bold border-b-2 border-white pb-0.5">
                        HOME
                    </Link>
                    <Link href="/services" className="hover:text-emerald-200 transition">
                        SERVICES
                    </Link>
                </div>

                <div className="text-center md:absolute md:left-1/2 md:-translate-x-1/2">
                    <Link href="/" className="font-['Crimson_Pro'] italic text-[32px] tracking-[2px] text-[#F9F8F6]">
                        DIVABOOK
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-[30px] text-[13px] tracking-[1.5px]">
                    <Link href="/contact" className="hover:text-emerald-200 transition">
                        CONTACT US
                    </Link>
                    <span className="cursor-pointer text-base">🔍</span>
                </div>

                {/* Mobile Hamburger Button */}
                <button
                    onClick={() => setMobileNavOpen(true)}
                    className="md:hidden flex flex-col justify-between w-6 h-4 cursor-pointer focus:outline-none"
                    aria-label="Toggle navigation"
                >
                    <span className="block h-[2px] w-full bg-white transition"></span>
                    <span className="block h-[2px] w-full bg-white transition"></span>
                    <span className="block h-[2px] w-full bg-white transition"></span>
                </button>

                {/* Mobile Sidebar */}
                <div
                    className={`fixed top-0 right-0 h-screen w-4/5 max-w-[300px] bg-[#F9F8F6] text-[#44403C] p-10 flex flex-col gap-6 shadow-2xl z-50 transition-transform duration-300 ${
                        mobileNavOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    <button
                        onClick={() => setMobileNavOpen(false)}
                        className="self-end text-2xl font-light text-[#0C0A09] focus:outline-none"
                    >
                        ✕
                    </button>
                    <Link href="/" className="text-lg font-medium tracking-[1.5px] text-[#064E3B]">
                        HOME
                    </Link>
                    <Link href="/services" className="text-lg font-medium tracking-[1.5px] hover:text-[#064E3B]">
                        SERVICES
                    </Link>
                    <Link href="/contact" className="text-lg font-medium tracking-[1.5px] hover:text-[#064E3B]">
                        CONTACT US
                    </Link>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <header className="text-center py-24 px-[10%]">
                <p className="text-xs uppercase tracking-[3px] font-semibold text-[#78716C] mb-3">
                    ESTABLISHED EXCELLENCE
                </p>
                <h1 className="font-['Noto_Serif'] text-5xl md:text-[64px] font-normal leading-[1.1] text-[#0C0A09]">
                    Elevate Your <br />
                    <i className="font-['Crimson_Pro'] italic font-normal">Self-Care Ritual</i>
                </h1>
                <hr className="w-20 border-t border-[#0C0A09] mx-auto my-6" />
                <p className="text-base sm:text-lg text-[#44403C] max-w-xl mx-auto leading-relaxed">
                    Experience curated beauty and wellness in the most exclusive service providers across the city.
                </p>
                <div className="mt-8">
                    <Link
                        href="/services"
                        className="inline-block bg-[#1C1917] hover:bg-[#064E3B] text-white px-11 py-4 text-xs tracking-[2px] font-semibold uppercase transition-all duration-300 hover:tracking-[3px]"
                    >
                        EXPLORE SERVICES
                    </Link>
                </div>
            </header>

            {/* --- CATALOG GRID (MOSAIC LAYOUT) --- */}
            <section id="services" className="max-w-[1400px] mx-auto w-full px-[5%] py-12">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                    {/* Haircut Card */}
                    <Link
                        href="/services?category=hair"
                        className="md:col-span-2 h-[420px] rounded-[32px] overflow-hidden relative flex items-end group shadow-sm hover:shadow-xl transition-all duration-500 bg-stone-900"
                        style={{
                            backgroundImage: "url('/img/image1.png')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="w-full p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                            <div className="mb-2">
                                <span className="bg-[#D2E9C7] text-[#384C33] text-[11px] font-bold px-3 py-1 rounded-full mr-2">
                                    Styling
                                </span>
                                <span className="bg-[#D2E9C7] text-[#384C33] text-[11px] font-bold px-3 py-1 rounded-full">
                                    Coloring
                                </span>
                            </div>
                            <h3 className="font-['Noto_Serif'] text-2xl font-bold">Haircut &amp; Styling</h3>
                            <p className="text-xs text-stone-200 mt-2 line-clamp-2">
                                Precision cuts and bespoke coloring treatments tailored to your unique profile and aesthetic goals.
                            </p>
                        </div>
                    </Link>

                    {/* Nail Artistry Card */}
                    <Link
                        href="/services?category=nails"
                        className="md:col-span-3 h-[420px] rounded-[32px] overflow-hidden relative flex items-end group shadow-sm hover:shadow-xl transition-all duration-500 bg-stone-900"
                        style={{
                            backgroundImage: "url('/img/image2.png')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="w-full p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                            <div className="mb-2">
                                <span className="bg-[#D2E9C7] text-[#384C33] text-[11px] font-bold px-3 py-1 rounded-full mr-2">
                                    Manicures
                                </span>
                                <span className="bg-[#D2E9C7] text-[#384C33] text-[11px] font-bold px-3 py-1 rounded-full">
                                    Extensions
                                </span>
                            </div>
                            <h3 className="font-['Noto_Serif'] text-2xl font-bold">Nail Artistry</h3>
                            <p className="text-xs text-stone-200 mt-2 line-clamp-2">
                                Advanced manicures, pedicures, and custom extensions using premium products.
                            </p>
                        </div>
                    </Link>

                    {/* Makeup Card */}
                    <Link
                        href="/services?category=makeup"
                        className="md:col-span-3 h-[420px] rounded-[32px] overflow-hidden relative flex items-end group shadow-sm hover:shadow-xl transition-all duration-500 bg-stone-900"
                        style={{
                            backgroundImage: "url('/img/image3.png')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="w-full p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                            <h3 className="font-['Noto_Serif'] text-2xl font-bold">Professional Makeup</h3>
                            <p className="text-xs text-stone-200 mt-2 line-clamp-2">
                                From bridal elegance to editorial glam, our artists craft the perfect look for any occasion.
                            </p>
                        </div>
                    </Link>

                    {/* Spa Card */}
                    <Link
                        href="/services?category=spa"
                        className="md:col-span-2 h-[420px] rounded-[32px] overflow-hidden relative flex items-end group shadow-sm hover:shadow-xl transition-all duration-500 bg-stone-900"
                        style={{
                            backgroundImage: "url('/img/image4.png')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="w-full p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                            <div className="mb-2">
                                <span className="bg-[#D2E9C7] text-[#384C33] text-[11px] font-bold px-3 py-1 rounded-full mr-2">
                                    Relaxation
                                </span>
                                <span className="bg-[#D2E9C7] text-[#384C33] text-[11px] font-bold px-3 py-1 rounded-full">
                                    Skin Health
                                </span>
                            </div>
                            <h3 className="font-['Noto_Serif'] text-2xl font-bold">Spa &amp; Wellness</h3>
                            <p className="text-xs text-stone-200 mt-2 line-clamp-2">
                                Immersive massages and rejuvenating facials that restore balance to both body and mind.
                            </p>
                        </div>
                    </Link>
                </div>
            </section>

            {/* --- RECOMMENDED SERVICE PROVIDERS --- */}
            <section className="bg-[#D9D9D9] py-20 px-[5%] mt-12">
                <div className="max-w-[1400px] mx-auto">
                    <div className="flex flex-col md:flex-row justify-between md:items-end mb-12">
                        <div>
                            <p className="text-xs uppercase tracking-widest text-[#064E3B] font-bold">OFFICIAL PARTNERS</p>
                            <h2 className="font-['Noto_Serif'] text-[#064E3B] text-4xl sm:text-5xl mt-1">
                                Our Service <br />Providers
                            </h2>
                        </div>
                        <Link
                            href="/services"
                            className="text-[#064E3B] text-xs font-bold tracking-widest uppercase border-b border-[#064E3B] hover:text-[#0C0A09] hover:border-[#0C0A09] transition pb-1 mt-4 md:mt-0"
                        >
                            VIEW ALL SERVICE PROVIDERS
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {recommended.length > 0 ? (
                            recommended.map((partner) => (
                                <div
                                    key={partner.id}
                                    className="bg-white rounded-lg p-6 flex flex-col justify-between shadow-sm hover:-translate-y-1 transition duration-300"
                                >
                                    <div>
                                        <div className="w-full h-[320px] bg-[#F5F5F4] rounded overflow-hidden flex items-center justify-center mb-4">
                                            {partner.logo ? (
                                                <img
                                                    src={partner.logo}
                                                    alt={partner.name}
                                                    className="w-full h-full object-cover object-center"
                                                />
                                            ) : (
                                                <div className="text-center text-[#A8A29E] text-xs uppercase tracking-wider font-semibold">
                                                    Business Logo
                                                    <br />
                                                    Unavailable
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="font-['Noto_Serif'] text-xl font-bold text-[#0C0A09]">{partner.name}</h3>
                                        <div className="flex items-center gap-1 text-xs mb-3 mt-1">
                                            <span className="text-[#d4af37]">★★★★★</span>
                                            <span className="text-[#78716C] font-semibold">(5.0)</span>
                                        </div>
                                        <p className="text-[#44403C] text-xs leading-relaxed line-clamp-3">
                                            {partner.description}
                                        </p>
                                    </div>

                                    <Link
                                        href={`/services?admin_id=${partner.admin_id}`}
                                        className="mt-6 block w-full bg-[#064E3B] hover:bg-[#043d2e] text-white text-center text-xs font-bold py-3 rounded tracking-wider uppercase transition shadow-sm"
                                    >
                                        VIEW PARTNER
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className="text-stone-600 text-sm">No recommended partners found.</p>
                        )}
                    </div>
                </div>
            </section>

            {/* --- ADVERTISEMENT / CTA SECTION --- */}
            <section className="text-center py-28 px-[10%]">
                <h2 className="font-['Crimson_Pro'] italic text-4xl sm:text-5xl text-[#0C0A09] mb-6">
                    For a more efficient booking...
                </h2>
                <p className="text-[#44403C] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
                    Join our community! Level up your salon business and beauty experience with a smart booking system made for you. Join a growing community that values convenience, style, and self-care.
                </p>
                <Link
                    href="/register"
                    className="inline-block bg-[#064E3B] hover:bg-[#043a2c] text-white text-sm font-bold tracking-wider px-12 py-4 rounded-full transition transform hover:scale-105"
                >
                    Add my business
                </Link>
            </section>

            {/* --- MAIN FOOTER --- */}
            <footer className="mt-auto bg-[#F5F5F4] px-[5%] pt-20 pb-8 text-[#44403C] text-sm border-t border-stone-200">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div className="md:col-span-2 space-y-3">
                        <h4 className="font-['Crimson_Pro'] text-2xl text-[#064E3B] font-bold">DivaBook</h4>
                        <p className="text-xs text-[#44403C] max-w-sm leading-relaxed">
                            Redefining luxury beauty through seamless technology and expert craftsmanship.
                        </p>
                    </div>

                    <div>
                        <h5 className="text-xs uppercase tracking-widest text-[#0C0A09] font-bold mb-4">EXPLORE</h5>
                        <div className="flex flex-col gap-2 text-xs">
                            <Link href="/" className="hover:text-[#064E3B] transition">
                                About Us
                            </Link>
                            <Link href="/register" className="hover:text-[#064E3B] transition">
                                Partner with Us
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h5 className="text-xs uppercase tracking-widest text-[#0C0A09] font-bold mb-4">LEGAL</h5>
                        <div className="flex flex-col gap-2 text-xs">
                            <a href="#" className="hover:text-[#064E3B] transition">
                                Privacy Policy
                            </a>
                            <a href="#" className="hover:text-[#064E3B] transition">
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-14 pt-5 border-t border-[#E7E5E4] text-center text-xs text-[#78716C]">
                    © 2026 DivaBook. The Luxury of Care.
                </div>
            </footer>
        </div>
    );
}