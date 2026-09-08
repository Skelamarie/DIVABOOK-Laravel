import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Registration() {
    const [showPassword, setShowPassword] = useState(false);
    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

    const { data, setData, post, processing, errors: serverErrors } = useForm({
        name: '',
        shop_name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        terms: false,
    });

    // Merge backend server errors and frontend validation errors cleanly
    const allErrors = { ...serverErrors, ...clientErrors };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!data.name.trim()) newErrors.name = 'Full name is required.';
        if (!data.shop_name.trim()) newErrors.shop_name = 'Business name is required.';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email.trim()) {
            newErrors.email = 'Business email is required.';
        } else if (!emailRegex.test(data.email)) {
            newErrors.email = 'Please enter a valid email containing "@" and a domain (e.g. name@domain.com).';
        }

        if (!data.password) {
            newErrors.password = 'Password is required.';
        } else if (data.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters.';
        }

        const phoneDigits = data.phone.replace(/\D/g, '');
        if (!data.phone.trim()) {
            newErrors.phone = 'Phone number is required.';
        } else if (phoneDigits.length !== 11) {
            newErrors.phone = 'Phone number must be exactly 11 digits (e.g. 09123456789).';
        }

        if (!data.address.trim()) newErrors.address = 'Business address is required.';
        if (!data.terms) newErrors.terms = 'You must agree to the Partner Terms & Privacy Policy.';

        setClientErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!validate()) return;

        post('/register', {
            preserveScroll: true,
            preserveState: true,
            onError: (err) => {
                setClientErrors((prev) => ({ ...prev, ...err }));
            },
        });
    };

    const handleFieldChange = (field: string, value: any) => {
        setData(field as any, value);
        if (clientErrors[field]) {
            setClientErrors((prev) => {
                const updated = { ...prev };
                delete updated[field];
                return updated;
            });
        }
    };

    return (
        <div className="flex min-h-screen flex-col justify-between bg-stone-50 font-sans">
            <Head title="DivaBook - Partner Registration" />

            <header className="bg-[#2D4336] px-6 py-4 text-white md:px-12">
                <span className="font-serif text-lg font-bold tracking-[4px]">
                    DIVABOOK
                </span>
            </header>

<<<<<<< HEAD
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
=======
            <main className="flex-1 max-w-4xl w-full mx-auto my-8 bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden p-6 sm:p-10">
                <p className="text-[10px] font-bold text-stone-400 tracking-widest uppercase mb-1">STEP 01 OF 02</p>
                <h1 className="font-serif text-3xl font-bold text-[#2D4336] mb-1">Partner Registration</h1>
                <p className="text-xs text-stone-500 mb-6">Enter your business details to create your digital storefront.</p>

                {/* Notice Box for Server and Client Validation Errors */}
                {Object.keys(allErrors).length > 0 && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">Notice:</p>
                        <ul className="list-disc list-inside text-xs text-red-600">
                            {Object.entries(allErrors).map(([key, msg]) => (
                                <li key={key}>{msg}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <form onSubmit={submit} noValidate className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
>>>>>>> cd3009760716be2bcbf08c7fd8ffea22f330cb8d
                        <div>
                            <label className="mb-1 block text-[10px] font-bold tracking-wider text-stone-600">
                                FULL NAME
                            </label>
                            <input
                                type="text"
                                placeholder="Jane Doe"
                                value={data.name}
<<<<<<< HEAD
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                className="w-full rounded border border-stone-300 bg-white p-3 text-sm text-black placeholder-stone-400 outline-none focus:border-[#2D4336]"
                                required
=======
                                onChange={(e) => handleFieldChange('name', e.target.value)}
                                className={`w-full text-sm p-3 border rounded outline-none text-black bg-white placeholder-stone-400 focus:border-[#2D4336] ${
                                    allErrors.name ? 'border-red-500 bg-red-50/20' : 'border-stone-300'
                                }`}
>>>>>>> cd3009760716be2bcbf08c7fd8ffea22f330cb8d
                            />
                            {allErrors.name && <p className="text-red-500 text-xs mt-1 font-medium">{allErrors.name}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-[10px] font-bold tracking-wider text-stone-600">
                                BUSINESS NAME
                            </label>
                            <input
                                type="text"
                                placeholder="Lumina Wellness"
                                value={data.shop_name}
<<<<<<< HEAD
                                onChange={(e) =>
                                    setData('shop_name', e.target.value)
                                }
                                className="w-full rounded border border-stone-300 bg-white p-3 text-sm text-black placeholder-stone-400 outline-none focus:border-[#2D4336]"
                                required
=======
                                onChange={(e) => handleFieldChange('shop_name', e.target.value)}
                                className={`w-full text-sm p-3 border rounded outline-none text-black bg-white placeholder-stone-400 focus:border-[#2D4336] ${
                                    allErrors.shop_name ? 'border-red-500 bg-red-50/20' : 'border-stone-300'
                                }`}
>>>>>>> cd3009760716be2bcbf08c7fd8ffea22f330cb8d
                            />
                            {allErrors.shop_name && <p className="text-red-500 text-xs mt-1 font-medium">{allErrors.shop_name}</p>}
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
<<<<<<< HEAD
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
=======
                                onChange={(e) => handleFieldChange('email', e.target.value)}
                                className={`w-full text-sm p-3 border rounded outline-none text-black bg-white placeholder-stone-400 focus:border-[#2D4336] ${
                                    allErrors.email ? 'border-red-500 bg-red-50/20' : 'border-stone-300'
                                }`}
                            />
                            {allErrors.email && <p className="text-red-500 text-xs mt-1 font-medium">{allErrors.email}</p>}
>>>>>>> cd3009760716be2bcbf08c7fd8ffea22f330cb8d
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
<<<<<<< HEAD
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
=======
                                    onChange={(e) => handleFieldChange('password', e.target.value)}
                                    className={`w-full text-sm p-3 border rounded outline-none pr-12 text-black bg-white placeholder-stone-400 focus:border-[#2D4336] ${
                                        allErrors.password ? 'border-red-500 bg-red-50/20' : 'border-stone-300'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-500 hover:text-black select-none"
>>>>>>> cd3009760716be2bcbf08c7fd8ffea22f330cb8d
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            {allErrors.password && <p className="text-red-500 text-xs mt-1 font-medium">{allErrors.password}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
<<<<<<< HEAD
                            <label className="mb-1 block text-[10px] font-bold tracking-wider text-stone-600">
                                PHONE NUMBER
                            </label>
=======
                            <label className="block text-[10px] font-bold tracking-wider text-stone-600 mb-1">PHONE NUMBER (11 DIGITS)</label>
>>>>>>> cd3009760716be2bcbf08c7fd8ffea22f330cb8d
                            <input
                                type="tel"
                                maxLength={11}
                                placeholder="09123456789"
                                value={data.phone}
<<<<<<< HEAD
                                onChange={(e) =>
                                    setData('phone', e.target.value)
                                }
                                className="w-full rounded border border-stone-300 bg-white p-3 text-sm text-black placeholder-stone-400 outline-none focus:border-[#2D4336]"
                                required
=======
                                onChange={(e) => handleFieldChange('phone', e.target.value)}
                                className={`w-full text-sm p-3 border rounded outline-none text-black bg-white placeholder-stone-400 focus:border-[#2D4336] ${
                                    allErrors.phone ? 'border-red-500 bg-red-50/20' : 'border-stone-300'
                                }`}
>>>>>>> cd3009760716be2bcbf08c7fd8ffea22f330cb8d
                            />
                            {allErrors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{allErrors.phone}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-[10px] font-bold tracking-wider text-stone-600">
                                BUSINESS ADDRESS
                            </label>
                            <input
                                type="text"
                                placeholder="123 Serenity Way, Suite 400"
                                value={data.address}
<<<<<<< HEAD
                                onChange={(e) =>
                                    setData('address', e.target.value)
                                }
                                className="w-full rounded border border-stone-300 bg-white p-3 text-sm text-black placeholder-stone-400 outline-none focus:border-[#2D4336]"
                                required
=======
                                onChange={(e) => handleFieldChange('address', e.target.value)}
                                className={`w-full text-sm p-3 border rounded outline-none text-black bg-white placeholder-stone-400 focus:border-[#2D4336] ${
                                    allErrors.address ? 'border-red-500 bg-red-50/20' : 'border-stone-300'
                                }`}
>>>>>>> cd3009760716be2bcbf08c7fd8ffea22f330cb8d
                            />
                            {allErrors.address && <p className="text-red-500 text-xs mt-1 font-medium">{allErrors.address}</p>}
                        </div>
                    </div>

<<<<<<< HEAD
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
=======
                    <div>
                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={data.terms}
                                onChange={(e) => handleFieldChange('terms', e.target.checked)}
                                className="rounded text-[#2D4336] focus:ring-[#2D4336]"
                            />
                            <label htmlFor="terms" className="text-xs text-stone-700 cursor-pointer">
                                I agree to the Partner Terms &amp; Privacy Policy.
                            </label>
                        </div>
                        {allErrors.terms && <p className="text-red-500 text-xs mt-1 font-medium">{allErrors.terms}</p>}
>>>>>>> cd3009760716be2bcbf08c7fd8ffea22f330cb8d
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
<<<<<<< HEAD
                    <Link
                        href="/login"
                        as="a"
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        className="cursor-pointer font-bold text-[#2D4336] underline hover:text-emerald-900"
=======
                    <Link 
                        href="/login" 
                        className="text-[#2D4336] font-bold underline hover:text-emerald-900"
>>>>>>> cd3009760716be2bcbf08c7fd8ffea22f330cb8d
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
