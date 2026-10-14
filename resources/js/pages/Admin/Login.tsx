import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    // Persistent notice that stays visible while retyping
    const [persistedNotice, setPersistedNotice] = useState<string | null>(null);

    const { data, setData, post, processing, reset, errors: serverErrors } = useForm({
        admin_id: '',
        email: '',
        password: '',
    });

    // Capture server-side authentication failure
    useEffect(() => {
        const authErr = (serverErrors as Record<string, string | undefined>).auth_failed;
        if (authErr) {
            setPersistedNotice(authErr);
            reset(); // Clears all input fields so the user starts fresh
        }
    }, [serverErrors]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Local check for empty fields
        if (!data.admin_id.trim() || !data.email.trim() || !data.password) {
            setPersistedNotice('All fields are required. Please fill in your details.');
            reset(); // Clear fields
            return;
        }

        post('/login', {
            preserveScroll: true,
            preserveState: true,
            onError: (err) => {
                const message = (err as Record<string, string>).auth_failed || Object.values(err)[0];
                if (message) {
                    setPersistedNotice(message);
                }
                reset(); // Clear all typed inputs on error
            },
        });
    };

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

                    {/* Notice Box: Stays visible while retyping in the cleared fields */}
                    {persistedNotice && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                            <p className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">Notice:</p>
                            <p className="text-xs text-red-600">{persistedNotice}</p>
                        </div>
                    )}

                    <form onSubmit={submit} noValidate autoComplete="off" className="text-left space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold tracking-wider text-stone-600 mb-1">
                                ADMIN-ID
                            </label>
                            <input
                                type="text"
                                placeholder="DB-XXXX"
                                value={data.admin_id}
                                onChange={(e) => setData('admin_id', e.target.value)}
                                autoComplete="off"
                                className="w-full text-sm p-3 border border-stone-300 rounded focus:border-[#2D4336] outline-none text-black bg-white placeholder-stone-400"
                            />
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
                                autoComplete="off"
                                className="w-full text-sm p-3 border border-stone-300 rounded focus:border-[#2D4336] outline-none text-black bg-white placeholder-stone-400"
                            />
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
                                    autoComplete="new-password"
                                    className="w-full text-sm p-3 border border-stone-300 rounded focus:border-[#2D4336] outline-none pr-12 text-black bg-white placeholder-stone-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-500 hover:text-black select-none"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#2D4336] hover:bg-[#1e2e25] text-white py-3 rounded text-xs font-bold tracking-wider uppercase transition mt-2 disabled:opacity-50 cursor-pointer"
                        >
                            {processing ? 'VERIFYING...' : 'SIGN IN'}
                        </button>
                    </form>

                    <p className="mt-6 text-xs text-stone-500">
                        New here?{' '}
                        <Link href="/register" className="text-[#2D4336] font-bold underline hover:text-emerald-900">
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