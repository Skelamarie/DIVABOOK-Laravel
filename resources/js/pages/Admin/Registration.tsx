import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Registration() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        shop_name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        terms: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className="flex min-h-screen flex-col justify-between bg-stone-50 font-sans">
            <Head title="DivaBook - Partner Registration" />

            <header className="bg-[#2D4336] px-6 py-4 text-white md:px-12">
                <span className="font-serif text-lg font-bold tracking-[4px]">
                    DIVABOOK
                </span>
            </header>

            <main className="mx-auto my-8 w-full max-w-4xl flex-1 overflow-hidden rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-10">
                <p className="mb-1 text-[10px] font-bold tracking-widest text-stone-400 uppercase">
                    STEP 01 OF 02
                </p>
                <h1 className="mb-1 font-serif text-3xl font-bold text-[#2D4336]">
                    Partner Registration
                </h1>
                <p className="mb-8 text-xs text-stone-500">
                    Enter your business details to create your digital
                    storefront.
                </p>

                <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-[10px] font-bold tracking-wider text-stone-600">
                                FULL NAME
                            </label>
                            <input
                                type="text"
                                placeholder="Jane Doe"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                className="w-full rounded border border-stone-300 bg-white p-3 text-sm text-black placeholder-stone-400 outline-none focus:border-[#2D4336]"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-[10px] font-bold tracking-wider text-stone-600">
                                BUSINESS NAME
                            </label>
                            <input
                                type="text"
                                placeholder="Lumina Wellness"
                                value={data.shop_name}
                                onChange={(e) =>
                                    setData('shop_name', e.target.value)
                                }
                                className="w-full rounded border border-stone-300 bg-white p-3 text-sm text-black placeholder-stone-400 outline-none focus:border-[#2D4336]"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-[10px] font-bold tracking-wider text-stone-600">
                                BUSINESS EMAIL
                            </label>
                            <input
                                type="email"
                                placeholder="contact@business.com"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                className="w-full rounded border border-stone-300 bg-white p-3 text-sm text-black placeholder-stone-400 outline-none focus:border-[#2D4336]"
                                required
                            />
                            {errors.email && (
                                <span className="text-xs text-red-500">
                                    {errors.email}
                                </span>
                            )}
                        </div>
                        <div>
                            <label className="mb-1 block text-[10px] font-bold tracking-wider text-stone-600">
                                PASSWORD
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    className="w-full rounded border border-stone-300 bg-white p-3 pr-12 text-sm text-black placeholder-stone-400 outline-none focus:border-[#2D4336]"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-stone-500 hover:text-black"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-[10px] font-bold tracking-wider text-stone-600">
                                PHONE NUMBER
                            </label>
                            <input
                                type="tel"
                                placeholder="09123456789"
                                value={data.phone}
                                onChange={(e) =>
                                    setData('phone', e.target.value)
                                }
                                className="w-full rounded border border-stone-300 bg-white p-3 text-sm text-black placeholder-stone-400 outline-none focus:border-[#2D4336]"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-[10px] font-bold tracking-wider text-stone-600">
                                BUSINESS ADDRESS
                            </label>
                            <input
                                type="text"
                                placeholder="123 Serenity Way, Suite 400"
                                value={data.address}
                                onChange={(e) =>
                                    setData('address', e.target.value)
                                }
                                className="w-full rounded border border-stone-300 bg-white p-3 text-sm text-black placeholder-stone-400 outline-none focus:border-[#2D4336]"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={data.terms}
                            onChange={(e) => setData('terms', e.target.checked)}
                            className="rounded text-[#2D4336] focus:ring-[#2D4336]"
                            required
                        />
                        <label
                            htmlFor="terms"
                            className="cursor-pointer text-xs text-stone-700"
                        >
                            I agree to the Partner Terms &amp; Privacy Policy.
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="mt-4 w-full rounded bg-[#2D4336] py-3.5 text-xs font-bold tracking-wider text-white uppercase transition hover:bg-[#1e2e25] disabled:opacity-50"
                    >
                        {processing
                            ? 'CREATING ACCOUNT...'
                            : 'REGISTER AS PARTNER'}
                    </button>
                </form>

                <p className="mt-6 text-center text-xs text-stone-500">
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        as="a"
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        className="cursor-pointer font-bold text-[#2D4336] underline hover:text-emerald-900"
                    >
                        Log in
                    </Link>
                </p>
            </main>

            <footer className="border-t border-stone-200 py-4 text-center text-xs text-stone-400">
                &copy; 2026 DIVABOOK WELLNESS
            </footer>
        </div>
    );
}
