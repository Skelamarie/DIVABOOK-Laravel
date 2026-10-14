import React from 'react';
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

export default function HomePage({
    recommended = [],
    catalogCategories,
}: HomePageProps) {
    return (
        <div className="flex min-h-screen flex-col bg-white font-sans text-[#0C0A09]">
            <Head>
                <title>DivaBook | Premium Beauty Booking</title>
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

            {/* --- HERO SECTION --- */}
            <header className="px-[10%] py-24 text-center">
                <p className="mb-3 text-xs font-semibold tracking-[3px] text-[#78716C] uppercase">
                    ESTABLISHED EXCELLENCE
                </p>
                <h1 className="font-['Noto_Serif'] text-5xl leading-[1.1] font-normal text-[#0C0A09] md:text-[64px]">
                    Elevate Your <br />
                    <i className="font-['Crimson_Pro'] font-normal italic">
                        Self-Care Ritual
                    </i>
                </h1>
                <hr className="mx-auto my-6 w-20 border-t border-[#0C0A09]" />
                <p className="mx-auto max-w-xl text-base leading-relaxed text-[#44403C] sm:text-lg">
                    Experience curated beauty and wellness in the most exclusive
                    service providers across the city.
                </p>
                <div className="mt-8">
                    <Link
                        href="/services"
                        className="inline-block bg-[#1C1917] px-11 py-4 text-xs font-semibold tracking-[2px] text-white uppercase transition-all duration-300 hover:bg-[#064E3B] hover:tracking-[3px]"
                    >
                        EXPLORE SERVICES
                    </Link>
                </div>
            </header>

            {/* --- CATALOG GRID (MOSAIC LAYOUT) --- */}
            <section
                id="services"
                className="mx-auto w-full max-w-[1400px] px-[5%] py-12"
            >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-5">
                    {/* Haircut Card */}
                    <Link
                        href="/services?category=hair"
                        className="group relative flex h-[420px] items-end overflow-hidden rounded-[32px] bg-stone-900 shadow-sm transition-all duration-500 hover:shadow-xl md:col-span-2"
                        style={{
                            backgroundImage: "url('/img/image1.png')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 text-white">
                            <div className="mb-2">
                                <span className="mr-2 rounded-full bg-[#D2E9C7] px-3 py-1 text-[11px] font-bold text-[#384C33]">
                                    Styling
                                </span>
                                <span className="rounded-full bg-[#D2E9C7] px-3 py-1 text-[11px] font-bold text-[#384C33]">
                                    Coloring
                                </span>
                            </div>
                            <h3 className="font-['Noto_Serif'] text-2xl font-bold">
                                Haircut &amp; Styling
                            </h3>
                            <p className="mt-2 line-clamp-2 text-xs text-stone-200">
                                Precision cuts and bespoke coloring treatments
                                tailored to your unique profile and aesthetic
                                goals.
                            </p>
                        </div>
                    </Link>

                    {/* Nail Artistry Card */}
                    <Link
                        href="/services?category=nails"
                        className="group relative flex h-[420px] items-end overflow-hidden rounded-[32px] bg-stone-900 shadow-sm transition-all duration-500 hover:shadow-xl md:col-span-3"
                        style={{
                            backgroundImage: "url('/img/image2.png')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 text-white">
                            <div className="mb-2">
                                <span className="mr-2 rounded-full bg-[#D2E9C7] px-3 py-1 text-[11px] font-bold text-[#384C33]">
                                    Manicures
                                </span>
                                <span className="rounded-full bg-[#D2E9C7] px-3 py-1 text-[11px] font-bold text-[#384C33]">
                                    Extensions
                                </span>
                            </div>
                            <h3 className="font-['Noto_Serif'] text-2xl font-bold">
                                Nail Artistry
                            </h3>
                            <p className="mt-2 line-clamp-2 text-xs text-stone-200">
                                Advanced manicures, pedicures, and custom
                                extensions using premium products.
                            </p>
                        </div>
                    </Link>

                    {/* Makeup Card */}
                    <Link
                        href="/services?category=makeup"
                        className="group relative flex h-[420px] items-end overflow-hidden rounded-[32px] bg-stone-900 shadow-sm transition-all duration-500 hover:shadow-xl md:col-span-3"
                        style={{
                            backgroundImage: "url('/img/image3.png')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 text-white">
                            <h3 className="font-['Noto_Serif'] text-2xl font-bold">
                                Professional Makeup
                            </h3>
                            <p className="mt-2 line-clamp-2 text-xs text-stone-200">
                                From bridal elegance to editorial glam, our
                                artists craft the perfect look for any occasion.
                            </p>
                        </div>
                    </Link>

                    {/* Spa Card */}
                    <Link
                        href="/services?category=spa"
                        className="group relative flex h-[420px] items-end overflow-hidden rounded-[32px] bg-stone-900 shadow-sm transition-all duration-500 hover:shadow-xl md:col-span-2"
                        style={{
                            backgroundImage: "url('/img/image4.png')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 text-white">
                            <div className="mb-2">
                                <span className="mr-2 rounded-full bg-[#D2E9C7] px-3 py-1 text-[11px] font-bold text-[#384C33]">
                                    Relaxation
                                </span>
                                <span className="rounded-full bg-[#D2E9C7] px-3 py-1 text-[11px] font-bold text-[#384C33]">
                                    Skin Health
                                </span>
                            </div>
                            <h3 className="font-['Noto_Serif'] text-2xl font-bold">
                                Spa &amp; Wellness
                            </h3>
                            <p className="mt-2 line-clamp-2 text-xs text-stone-200">
                                Immersive massages and rejuvenating facials that
                                restore balance to both body and mind.
                            </p>
                        </div>
                    </Link>
                </div>
            </section>

            {/* --- RECOMMENDED SERVICE PROVIDERS --- */}
            <section className="mt-12 bg-[#D9D9D9] px-[5%] py-20">
                <div className="mx-auto max-w-[1400px]">
                    <div className="mb-12 flex flex-col justify-between md:flex-row md:items-end">
                        <div>
                            <p className="text-xs font-bold tracking-widest text-[#064E3B] uppercase">
                                OFFICIAL PARTNERS
                            </p>
                            <h2 className="mt-1 font-['Noto_Serif'] text-4xl text-[#064E3B] sm:text-5xl">
                                Our Service <br />
                                Providers
                            </h2>
                        </div>
                        <Link
                            href="/services"
                            className="mt-4 border-b border-[#064E3B] pb-1 text-xs font-bold tracking-widest text-[#064E3B] uppercase transition hover:border-[#0C0A09] hover:text-[#0C0A09] md:mt-0"
                        >
                            VIEW ALL SERVICE PROVIDERS
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {recommended.length > 0 ? (
                            recommended.map((partner) => (
                                <div
                                    key={partner.id}
                                    className="flex flex-col justify-between rounded-lg bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1"
                                >
                                    <div>
                                        <div className="mb-4 flex h-[320px] w-full items-center justify-center overflow-hidden rounded bg-[#F5F5F4]">
                                            {partner.logo ? (
                                                <img
                                                    src={partner.logo}
                                                    alt={partner.name}
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            ) : (
                                                <div className="text-center text-xs font-semibold tracking-wider text-[#A8A29E] uppercase">
                                                    Business Logo
                                                    <br />
                                                    Unavailable
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="font-['Noto_Serif'] text-xl font-bold text-[#0C0A09]">
                                            {partner.name}
                                        </h3>
                                        <div className="mt-1 mb-3 flex items-center gap-1 text-xs">
                                            <span className="text-[#d4af37]">
                                                ★★★★★
                                            </span>
                                            <span className="font-semibold text-[#78716C]">
                                                (5.0)
                                            </span>
                                        </div>
                                        <p className="line-clamp-3 text-xs leading-relaxed text-[#44403C]">
                                            {partner.description}
                                        </p>
                                    </div>

                                    <Link
                                        href={`/services?admin_id=${partner.admin_id}`}
                                        className="mt-6 block w-full rounded bg-[#064E3B] py-3 text-center text-xs font-bold tracking-wider text-white uppercase shadow-sm transition hover:bg-[#043d2e]"
                                    >
                                        VIEW PARTNER
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-stone-600">
                                No recommended partners found.
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* --- ADVERTISEMENT / CTA SECTION --- */}
            <section className="px-[10%] py-28 text-center">
                <h2 className="mb-6 font-['Crimson_Pro'] text-4xl text-[#0C0A09] italic sm:text-5xl">
                    For a more efficient booking...
                </h2>
                <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-[#44403C] sm:text-base">
                    Join our community! Level up your salon business and beauty
                    experience with a smart booking system made for you. Join a
                    growing community that values convenience, style, and
                    self-care.
                </p>
                <Link
                    href="/register"
                    className="inline-block transform rounded-full bg-[#064E3B] px-12 py-4 text-sm font-bold tracking-wider text-white transition hover:scale-105 hover:bg-[#043a2c]"
                >
                    Add my business
                </Link>
            </section>

            {/* --- MAIN FOOTER --- */}
            <footer className="mt-auto border-t border-stone-200 bg-[#F5F5F4] px-[5%] pt-20 pb-8 text-sm text-[#44403C]">
                <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 md:grid-cols-4">
                    <div className="space-y-3 md:col-span-2">
                        <h4 className="font-['Crimson_Pro'] text-2xl font-bold text-[#064E3B]">
                            DivaBook
                        </h4>
                        <p className="max-w-sm text-xs leading-relaxed text-[#44403C]">
                            Redefining luxury beauty through seamless technology
                            and expert craftsmanship.
                        </p>
                    </div>

                    <div>
                        <h5 className="mb-4 text-xs font-bold tracking-widest text-[#0C0A09] uppercase">
                            EXPLORE
                        </h5>
                        <div className="flex flex-col gap-2 text-xs">
                            <Link
                                href="/"
                                className="transition hover:text-[#064E3B]"
                            >
                                About Us
                            </Link>
                            <Link
                                href="/register"
                                className="transition hover:text-[#064E3B]"
                            >
                                Partner with Us
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h5 className="mb-4 text-xs font-bold tracking-widest text-[#0C0A09] uppercase">
                            LEGAL
                        </h5>
                        <div className="flex flex-col gap-2 text-xs">
                            <a
                                href="#"
                                className="transition hover:text-[#064E3B]"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="#"
                                className="transition hover:text-[#064E3B]"
                            >
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-14 pt-5 border-t border-[#E7E5E4] text-center text-xs text-[#78716C]">
                    © {new Date().getFullYear()} DivaBook. The Luxury of Care.
                </div>
            </footer>
        </div>
    );
}
