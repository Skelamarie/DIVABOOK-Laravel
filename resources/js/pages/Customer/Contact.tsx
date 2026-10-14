import React from 'react';
import { Head, useForm } from '@inertiajs/react';


export default function Contact() {

    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        fullname: '',
        email: '',
        type: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contact', {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB] text-[#0C0A09] font-sans flex flex-col">
            <Head>
                <title>Contact Us | DivaBook</title>
            </Head>

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

                    {wasSuccessful && (
                        <div className="p-4 mb-5 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg">
                            Your inquiry has been received.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                                    FULL NAME
                                </label>
                                <input
                                    type="text"
                                    name="fullname"
                                    placeholder="Jane Doe"
                                    value={data.fullname}
                                    onChange={(e) => setData('fullname', e.target.value)}
                                    required
                                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-800 placeholder:text-stone-400"
                                />
                                {errors.fullname && (
                                    <p className="text-red-500 text-xs mt-1">{errors.fullname}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                                    EMAIL ADDRESS
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="jane@example.com"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-800 placeholder:text-stone-400"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                                INQUIRY TYPE
                            </label>
                            <select
                                name="type"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                required
                                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm text-stone-700 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                            >
                                <option value="" disabled>Select a category</option>
                                <option value="General Support">General Support</option>
                                <option value="Partnership Interest">Partnership Interest</option>
                            </select>
                            {errors.type && (
                                <p className="text-red-500 text-xs mt-1">{errors.type}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                                MESSAGE
                            </label>
                            <textarea
                                rows={4}
                                name="message"
                                placeholder="How can we assist you?"
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                required
                                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-800 placeholder:text-stone-400"
                            ></textarea>
                            {errors.message && (
                                <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#274436] hover:bg-[#1d3329] disabled:opacity-50 text-white font-bold py-4 rounded-lg tracking-wider text-xs uppercase transition flex items-center justify-center gap-2"
                        >
                            <span>{processing ? 'SENDING...' : 'SEND INQUIRY'}</span>
                            <span className="text-base">✈</span>
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}