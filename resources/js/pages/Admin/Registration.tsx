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
        <div className="min-h-screen bg-stone-50 flex flex-col justify-between font-sans">
            <Head title="DivaBook - Partner Registration" />

            <header className="py-4 px-6 md:px-12 bg-[#2D4336] text-white">
                <span className="font-serif tracking-[4px] text-lg font-bold">DIVABOOK</span>
            </header>

            <main className="flex-1 max-w-4xl w-full mx-auto my-8 bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden p-6 sm:p-10">
                <p className="text-[10px] font-bold text-stone-400 tracking-widest uppercase mb-1">STEP 01 OF 02</p>
                <h1 className="font-serif text-3xl font-bold text-[#2D4336] mb-1">Partner Registration</h1>
                <p className="text-xs text-stone-500 mb-8">Enter your business details to create your digital storefront.</p>

                <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold tracking-wider text-stone-600 mb-1">FULL NAME</label>
                            <input
                                type="text"
                                placeholder="Jane Doe"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full text-sm p-3 border border-stone-300 rounded outline-none text-black bg-white placeholder-stone-400 focus:border-[#2D4336]"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold tracking-wider text-stone-600 mb-1">BUSINESS NAME</label>
                            <input
                                type="text"
                                placeholder="Lumina Wellness"
                                value={data.shop_name}
                                onChange={(e) => setData('shop_name', e.target.value)}
                                className="w-full text-sm p-3 border border-stone-300 rounded outline-none text-black bg-white placeholder-stone-400 focus:border-[#2D4336]"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold tracking-wider text-stone-600 mb-1">BUSINESS EMAIL</label>
                            <input
                                type="email"
                                placeholder="contact@business.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full text-sm p-3 border border-stone-300 rounded outline-none text-black bg-white placeholder-stone-400 focus:border-[#2D4336]"
                                required
                            />
                            {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold tracking-wider text-stone-600 mb-1">PASSWORD</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full text-sm p-3 border border-stone-300 rounded outline-none pr-12 text-black bg-white placeholder-stone-400 focus:border-[#2D4336]"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-500 hover:text-black"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold tracking-wider text-stone-600 mb-1">PHONE NUMBER</label>
                            <input
                                type="tel"
                                placeholder="09123456789"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="w-full text-sm p-3 border border-stone-300 rounded outline-none text-black bg-white placeholder-stone-400 focus:border-[#2D4336]"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold tracking-wider text-stone-600 mb-1">BUSINESS ADDRESS</label>
                            <input
                                type="text"
                                placeholder="123 Serenity Way, Suite 400"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className="w-full text-sm p-3 border border-stone-300 rounded outline-none text-black bg-white placeholder-stone-400 focus:border-[#2D4336]"
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
                        <label htmlFor="terms" className="text-xs text-stone-700 cursor-pointer">
                            I agree to the Partner Terms &amp; Privacy Policy.
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-[#2D4336] hover:bg-[#1e2e25] text-white py-3.5 rounded text-xs font-bold tracking-wider uppercase transition mt-4 disabled:opacity-50"
                    >
                        {processing ? 'CREATING ACCOUNT...' : 'REGISTER AS PARTNER'}
                    </button>
                </form>

                <p className="mt-6 text-center text-xs text-stone-500">
                    Already have an account?{' '}
                    <Link 
                        href="/login" 
                        className="text-[#2D4336] font-bold underline hover:text-emerald-900"
                    >
                        Log in
                    </Link>
                </p>
            </main>

            <footer className="py-4 text-center text-stone-400 text-xs border-t border-stone-200">
                &copy; 2026 DIVABOOK WELLNESS
            </footer>
        </div>
    );
}