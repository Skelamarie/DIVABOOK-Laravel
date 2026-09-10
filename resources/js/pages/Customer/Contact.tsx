import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Contact() {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        category: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle inquiry submission logic
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB] text-[#0C0A09] font-sans flex flex-col">
            <Head>
                <title>Contact Us | DivaBook</title>
            </Head>

            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-50 flex items-center justify-between px-[5%] py-[25px] bg-[#14532d] text-white">
                <div className="hidden md:flex items-center gap-[30px] text-[13px] tracking-[1.5px]">
                    <Link href="/" className="hover:text-emerald-200 transition">
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
                    <Link href="/contact" className="font-bold border-b-2 border-white pb-0.5 uppercase">
                        CONTACT US
                    </Link>
                    <button type="button" aria-label="Search" className="cursor-pointer text-base focus:outline-none">
                        🔍
                    </button>
                </div>

                <button
                    onClick={() => setMobileNavOpen(true)}
                    className="md:hidden flex flex-col justify-between w-6 h-4 cursor-pointer focus:outline-none"
                    aria-label="Toggle navigation"
                >
                    <span className="block h-[2px] w-full bg-white"></span>
                    <span className="block h-[2px] w-full bg-white"></span>
                    <span className="block h-[2px] w-full bg-white"></span>
                </button>

                {/* Mobile Drawer */}
                <div
                    className={`fixed top-0 right-0 h-screen w-4/5 max-w-[300px] bg-[#F9F8F6] text-[#44403C] p-10 flex flex-col gap-6 shadow-2xl z-50 transition-transform duration-300 ${
                        mobileNavOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    <button
                        onClick={() => setMobileNavOpen(false)}
                        className="self-end text-2xl font-light text-[#0C0A09]"
                    >
                        ✕
                    </button>
                    <Link href="/" onClick={() => setMobileNavOpen(false)} className="text-lg font-medium tracking-[1.5px]">
                        HOME
                    </Link>
                    <Link href="/services" onClick={() => setMobileNavOpen(false)} className="text-lg font-medium tracking-[1.5px]">
                        SERVICES
                    </Link>
                    <Link href="/contact" onClick={() => setMobileNavOpen(false)} className="text-lg font-medium tracking-[1.5px] text-[#064E3B]">
                        CONTACT US
                    </Link>
                </div>
            </nav>

            {/* Header */}
            <header className="text-center pt-16 pb-12 px-4">
                <h1 className="font-['Noto_Serif'] text-4xl sm:text-5xl font-bold text-[#1C1917] mb-3">
                    Contact Us
                </h1>
                <p className="text-stone-500 text-sm sm:text-base">
                    We are here to assist with your boutique wellness journey.
                </p>
            </header>

            {/* Content Container */}
            <main className="max-w-6xl mx-auto w-full px-6 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Left Info Panel */}
                <div className="lg:col-span-5 space-y-8 pt-4">
                    <div>
                        <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
                            MAIN ADDRESS
                        </h2>
                        <p className="text-stone-700 font-medium text-sm sm:text-base leading-relaxed">
                            Inigo Street, Obrero<br />
                            Davao City, 8000
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
                                SUPPORT
                            </h2>
                            <a href="mailto:concierge@divabook.com" className="font-bold text-stone-800 text-sm hover:underline">
                                concierge@divabook.com
                            </a>
                        </div>
                        <div>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
                                PARTNERSHIPS
                            </h2>
                            <a href="mailto:partners@divabook.com" className="font-bold text-stone-800 text-sm hover:underline">
                                partners@divabook.com
                            </a>
                        </div>
                    </div>

                    {/* Map Box */}
                    <div className="w-full h-56 bg-stone-200 rounded-lg flex items-center justify-center text-stone-400 font-bold tracking-widest text-xs uppercase">
                        MAP VIEW
                    </div>
                </div>

                {/* Right Form Card */}
                <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-stone-100">
                    <h2 className="font-['Noto_Serif'] text-2xl font-bold text-stone-800 mb-6">
                        Inquiry Form
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                                    FULL NAME
                                </label>
                                <input
                                    type="text"
                                    placeholder="Jane Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-800 placeholder:text-stone-400"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                                    EMAIL ADDRESS
                                </label>
                                <input
                                    type="email"
                                    placeholder="jane@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-800 placeholder:text-stone-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                                INQUIRY TYPE
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm text-stone-700 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                            >
                                <option value="">Select a category</option>
                                <option value="general">General Support</option>
                                <option value="partnership">Business Partnership</option>
                                <option value="booking">Booking Issues</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                                MESSAGE
                            </label>
                            <textarea
                                rows={4}
                                placeholder="How can we assist you?"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-800 placeholder:text-stone-400"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#274436] hover:bg-[#1d3329] text-white font-bold py-4 rounded-lg tracking-wider text-xs uppercase transition flex items-center justify-center gap-2"
                        >
                            <span>SEND INQUIRY</span>
                            <span className="text-base">✈</span>
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}