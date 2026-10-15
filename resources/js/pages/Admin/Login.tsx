import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    // Persistent notice that stays visible while retyping
    const [persistedNotice, setPersistedNotice] = useState<string | null>(null);

    const {
        data,
        setData,
        post,
        processing,
        reset,
        errors: serverErrors,
    } = useForm({
        admin_id: '',
        email: '',
        password: '',
    });

    // Capture server-side authentication failure
    useEffect(() => {
        const authErr = (serverErrors as Record<string, string | undefined>)
            .auth_failed;
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
            setPersistedNotice(
                'All fields are required. Please fill in your details.',
            );
            reset(); // Clear fields
            return;
        }

        post('/login', {
            preserveScroll: true,
            preserveState: true,
            onError: (err) => {
                const message =
                    (err as Record<string, string>).auth_failed ||
                    Object.values(err)[0];
                if (message) {
                    setPersistedNotice(message);
                }
                reset(); // Clear all typed inputs on error
            },
        });
    };

    return (
        <div className="flex min-h-screen flex-col justify-between bg-[#FAFAFA] font-sans">
            <Head title="DivaBook - Login" />

            <header className="bg-[#2D4336] py-4 text-center">
                <span className="font-serif text-lg font-bold tracking-[4px] text-white">
                    DIVABOOK
                </span>
            </header>

            <main className="flex flex-1 items-center justify-center p-4">
                <section className="w-full max-w-[380px] rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
                    <h1 className="mb-1 font-serif text-2xl font-bold text-[#2D4336]">
                        Welcome Back
                    </h1>
                    <p className="mb-6 text-xs text-stone-500">
                        Enter your details to access your portal.
                    </p>

                    {/* Notice Box: Stays visible while retyping in the cleared fields */}
                    {persistedNotice && (
                        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-left">
                            <p className="mb-1 text-xs font-bold tracking-wider text-red-700 uppercase">
                                Notice:
                            </p>
                            <p className="text-xs text-red-600">
                                {persistedNotice}
                            </p>
                        </div>
                    )}

                    <form
                        onSubmit={submit}
                        noValidate
                        autoComplete="off"
                        className="space-y-4 text-left"
                    >
                        <div>
                            <label className="mb-1 block text-[10px] font-bold tracking-wider text-stone-600">
                                ADMIN-ID
                            </label>
                            <input
                                type="text"
                                placeholder="DB-XXXX"
                                value={data.admin_id}
                                onChange={(e) =>
                                    setData('admin_id', e.target.value)
                                }
                                autoComplete="off"
                                className="w-full rounded border border-stone-300 bg-white p-3 text-sm text-black placeholder-stone-400 outline-none focus:border-[#2D4336]"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-[10px] font-bold tracking-wider text-stone-600">
                                EMAIL ADDRESS
                            </label>
                            <input
                                type="email"
                                placeholder="admin@gmail.com"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                autoComplete="off"
                                className="w-full rounded border border-stone-300 bg-white p-3 text-sm text-black placeholder-stone-400 outline-none focus:border-[#2D4336]"
                            />
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
                                    autoComplete="new-password"
                                    className="w-full rounded border border-stone-300 bg-white p-3 pr-12 text-sm text-black placeholder-stone-400 outline-none focus:border-[#2D4336]"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-stone-500 select-none hover:text-black"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-2 w-full cursor-pointer rounded bg-[#2D4336] py-3 text-xs font-bold tracking-wider text-white uppercase transition hover:bg-[#1e2e25] disabled:opacity-50"
                        >
                            {processing ? 'VERIFYING...' : 'SIGN IN'}
                        </button>
                    </form>

                    <p className="mt-6 text-xs text-stone-500">
                        New here?{' '}
                        <Link
                            href="/register"
                            className="font-bold text-[#2D4336] underline hover:text-emerald-900"
                        >
                            Register
                        </Link>
                    </p>
                </section>
            </main>

            <footer className="border-t border-stone-100 py-4 text-center text-xs text-stone-400">
                &copy; 2026 DIVABOOK WELLNESS
            </footer>
        </div>
    );
}
