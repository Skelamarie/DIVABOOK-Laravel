import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        admin_id: '',
        email: '',
        password: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    const authError = (errors as Record<string, string | undefined>).auth_failed;

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between font-sans">
            <Head title="DivaBook - Login" />

            <header className="py-4 text-center bg-[#2D4336]">
                <span className="font-serif text-white tracking-[4px] text-lg font-bold">DIVABOOK</span>
            </header>

            <main className="flex-1 flex items-center justify-center p-4">
                <section className="bg-white w-full max-w-[380px] p-8 rounded-lg shadow-sm border border-stone-200 text-center">
                    <h1 className="font-serif text-2xl text-[#2D4336] mb-1 font-bold">Welcome Back</h1>
                    <p className="text-xs text-stone-500 mb-6">Enter your details to access your portal.</p>

                    {authError && (
                        <div className="mb-4 p-2.5 bg-red-100 border border-red-200 text-red-700 text-xs rounded text-center">
                            {authError}
                        </div>
                    )}

                    <form onSubmit={submit} className="text-left space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold tracking-wider text-stone-600 mb-1">
                                ADMIN-ID
                            </label>
                            <input
                                type="text"
                                placeholder="DB-XXXX"
                                value={data.admin_id}
                                onChange={(e) => setData('admin_id', e.target.value)}
                                className="w-full text-sm p-3 border border-stone-300 rounded focus:border-[#2D4336] outline-none text-black bg-white placeholder-stone-400"
                                required
                            />
                            {errors.admin_id && (
                                <p className="text-red-500 text-xs mt-1">{errors.admin_id}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold tracking-wider text-stone-600 mb-1">
                                EMAIL ADDRESS
                            </label>
                            <input
                                type="email"
                                placeholder="admin@gmail.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full text-sm p-3 border border-stone-300 rounded focus:border-[#2D4336] outline-none text-black bg-white placeholder-stone-400"
                                required
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold tracking-wider text-stone-600 mb-1">
                                PASSWORD
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full text-sm p-3 border border-stone-300 rounded focus:border-[#2D4336] outline-none pr-12 text-black bg-white placeholder-stone-400"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-500 hover:text-black select-none"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#2D4336] hover:bg-[#1e2e25] text-white py-3 rounded text-xs font-bold tracking-wider uppercase transition mt-2 disabled:opacity-50"
                        >
                            {processing ? 'VERIFYING...' : 'SIGN IN'}
                        </button>
                    </form>

                    <p className="mt-6 text-xs text-stone-500">
                        New here?{' '}
                        <Link href="/register" className="text-[#2D4336] font-bold underline">
                            Register
                        </Link>
                    </p>
                </section>
            </main>

            <footer className="py-4 text-center text-stone-400 text-xs border-t border-stone-100">
                &copy; 2026 DIVABOOK WELLNESS
            </footer>
        </div>
    );
}