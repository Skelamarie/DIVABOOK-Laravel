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
        <div className="flex min-h-screen flex-col bg-[#FDFCFB] font-sans text-[#0C0A09]">
            <Head>
                <title>Contact Us | DivaBook</title>
            </Head>

            {/* Top Navigation Bar */}

            {/* Header */}
            <header className="px-4 pt-16 pb-12 text-center">
                <h1 className="mb-3 font-['Noto_Serif'] text-4xl font-bold text-[#1C1917] sm:text-5xl">
                    Contact Us
                </h1>
                <p className="text-sm text-stone-500 sm:text-base">
                    We are here to assist with your boutique wellness journey.
                </p>
            </header>

            {/* Content Container */}
            <main className="mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-12 px-6 pb-24 lg:grid-cols-12">
                {/* Left Info Panel */}
                <div className="space-y-8 pt-4 lg:col-span-5">
                    <div>
                        <h2 className="mb-2 text-xs font-bold tracking-widest text-stone-400 uppercase">
                            MAIN ADDRESS
                        </h2>
                        <p className="text-sm leading-relaxed font-medium text-stone-700 sm:text-base">
                            Inigo Street, Obrero
                            <br />
                            Davao City, 8000
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h2 className="mb-2 text-xs font-bold tracking-widest text-stone-400 uppercase">
                                SUPPORT
                            </h2>
                            <a
                                href="mailto:concierge@divabook.com"
                                className="text-sm font-bold text-stone-800 hover:underline"
                            >
                                concierge@divabook.com
                            </a>
                        </div>
                        <div>
                            <h2 className="mb-2 text-xs font-bold tracking-widest text-stone-400 uppercase">
                                PARTNERSHIPS
                            </h2>
                            <a
                                href="mailto:partners@divabook.com"
                                className="text-sm font-bold text-stone-800 hover:underline"
                            >
                                partners@divabook.com
                            </a>
                        </div>
                    </div>

                    {/* Map Box */}
                    <div className="flex h-56 w-full items-center justify-center rounded-lg bg-stone-200 text-xs font-bold tracking-widest text-stone-400 uppercase">
                        MAP VIEW
                    </div>
                </div>

                {/* Right Form Card */}
                <div className="rounded-2xl border border-stone-100 bg-white p-8 shadow-sm sm:p-10 lg:col-span-7">
                    <h2 className="mb-6 font-['Noto_Serif'] text-2xl font-bold text-stone-800">
                        Inquiry Form
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-[11px] font-bold tracking-wider text-stone-500 uppercase">
                                    FULL NAME
                                </label>
                                <input
                                    type="text"
                                    placeholder="Jane Doe"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm placeholder:text-stone-400 focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-[11px] font-bold tracking-wider text-stone-500 uppercase">
                                    EMAIL ADDRESS
                                </label>
                                <input
                                    type="email"
                                    placeholder="jane@example.com"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm placeholder:text-stone-400 focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-[11px] font-bold tracking-wider text-stone-500 uppercase">
                                INQUIRY TYPE
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        category: e.target.value,
                                    })
                                }
                                className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                            >
                                <option value="">Select a category</option>
                                <option value="general">General Support</option>
                                <option value="partnership">
                                    Business Partnership
                                </option>
                                <option value="booking">Booking Issues</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-[11px] font-bold tracking-wider text-stone-500 uppercase">
                                MESSAGE
                            </label>
                            <textarea
                                rows={4}
                                placeholder="How can we assist you?"
                                value={formData.message}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        message: e.target.value,
                                    })
                                }
                                className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm placeholder:text-stone-400 focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#274436] py-4 text-xs font-bold tracking-wider text-white uppercase transition hover:bg-[#1d3329]"
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
