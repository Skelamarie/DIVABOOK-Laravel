import React from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function Contact() {
    const { data, setData, post, processing, errors, reset, wasSuccessful } =
        useForm({
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
        <div className="flex min-h-screen flex-col bg-[#FDFCFB] font-sans text-[#0C0A09]">
            <Head>
                <title>Contact Us | DivaBook</title>
            </Head>

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

                    {wasSuccessful && (
                        <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                            Your inquiry has been received.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-[11px] font-bold tracking-wider text-stone-500 uppercase">
                                    FULL NAME
                                </label>
                                <input
                                    type="text"
                                    name="fullname"
                                    placeholder="Jane Doe"
                                    value={data.fullname}
                                    onChange={(e) =>
                                        setData('fullname', e.target.value)
                                    }
                                    required
                                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm placeholder:text-stone-400 focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                                />
                                {errors.fullname && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.fullname}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="mb-2 block text-[11px] font-bold tracking-wider text-stone-500 uppercase">
                                    EMAIL ADDRESS
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="jane@example.com"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    required
                                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm placeholder:text-stone-400 focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-[11px] font-bold tracking-wider text-stone-500 uppercase">
                                INQUIRY TYPE
                            </label>
                            <select
                                name="type"
                                value={data.type}
                                onChange={(e) =>
                                    setData('type', e.target.value)
                                }
                                required
                                className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                            >
                                <option value="" disabled>
                                    Select a category
                                </option>
                                <option value="General Support">
                                    General Support
                                </option>
                                <option value="Partnership Interest">
                                    Partnership Interest
                                </option>
                            </select>
                            {errors.type && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.type}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-[11px] font-bold tracking-wider text-stone-500 uppercase">
                                MESSAGE
                            </label>
                            <textarea
                                rows={4}
                                name="message"
                                placeholder="How can we assist you?"
                                value={data.message}
                                onChange={(e) =>
                                    setData('message', e.target.value)
                                }
                                required
                                className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm placeholder:text-stone-400 focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                            ></textarea>
                            {errors.message && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#274436] py-4 text-xs font-bold tracking-wider text-white uppercase transition hover:bg-[#1d3329] disabled:opacity-50"
                        >
                            <span>
                                {processing ? 'SENDING...' : 'SEND INQUIRY'}
                            </span>
                            <span className="text-base">✈</span>
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
