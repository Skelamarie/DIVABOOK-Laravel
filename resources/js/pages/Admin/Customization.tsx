import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import ImageUploadField from '@/components/image-upload-field';

interface CustomizationProps {
    partner: any;
    services?: any[];
    initialTab?: 'profile' | 'services';
}

export default function Customization({
    partner,
    services = [],
    initialTab = 'profile',
}: CustomizationProps) {
    const [activeTab, setActiveTab] = useState<'profile' | 'services'>(
        initialTab,
    );
    const [modalOpen, setModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTargetService, setDeleteTargetService] = useState<any>(null);
    const [accountDeleteModalOpen, setAccountDeleteModalOpen] = useState(false);

    const branding = partner?.branding || {};

    // 1. Profile Form
    const profileForm = useForm({
        salon_name: branding.salon_name || partner?.shop_name || 'DivaBook',
        description: branding.description || '',
        credentials: branding.credentials || '',
        location: branding.location || partner?.address || '',
        contact_info: branding.contact_info || partner?.phone || '',
        email: branding.email || partner?.email || '',
        facebook: branding.facebook || '',
        facebook_url: branding.facebook_url || '',
        instagram: branding.instagram || '',
        instagram_url: branding.instagram_url || '',
        color_primary: branding.color_primary || '#064E3B',
        color_secondary: branding.color_secondary || '#7cbf7f',
        logo_file: null as File | null,
    });

    // 2. Service Form
    const serviceForm = useForm({
        service_id: '',
        service_name: '',
        category: 'Hair',
        rate: '',
        description: '',
        photos: [] as File[],
    });

    const tint = (hex: string, ratio: number) => {
        if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return hex;
        const r = Math.round(
            parseInt(hex.slice(1, 3), 16) +
                (255 - parseInt(hex.slice(1, 3), 16)) * ratio,
        );
        const g = Math.round(
            parseInt(hex.slice(3, 5), 16) +
                (255 - parseInt(hex.slice(3, 5), 16)) * ratio,
        );
        const b = Math.round(
            parseInt(hex.slice(5, 7), 16) +
                (255 - parseInt(hex.slice(5, 7), 16)) * ratio,
        );
        return `rgb(${r},${g},${b})`;
    };

    const primaryColor = profileForm.data.color_primary || '#064E3B';
    const secondaryColor = profileForm.data.color_secondary || '#7cbf7f';
    const paleColor = tint(primaryColor, 0.88);
    const lightColor = tint(primaryColor, 0.75);

    const handleHexChange = (
        field: 'color_primary' | 'color_secondary',
        value: string,
    ) => {
        let val = value.trim();
        if (!val.startsWith('#') && val.length > 0) val = '#' + val;
        profileForm.setData(field, val);
    };

    const submitProfile = (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingMessage('Updating Salon Profile...');
        setIsLoading(true);

        profileForm.post('/admin/profile', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => profileForm.setData('logo_file', null),
            onFinish: () => setIsLoading(false),
        });
    };

    const openServiceModal = (svc: any = null) => {
        if (svc) {
            setEditingService(svc);
            serviceForm.clearErrors();
            serviceForm.setData({
                service_id: svc._id || svc.id,
                service_name: svc.name || '',
                category: svc.category || 'Hair',
                rate: String(svc.rate ?? ''),
                description: svc.description || '',
                photos: [],
            });
        } else {
            setEditingService(null);
            serviceForm.reset();
            serviceForm.clearErrors();
        }
        setModalOpen(true);
    };

    const submitService = (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingMessage('Processing Service Catalog...');
        setIsLoading(true);

        serviceForm.post('/admin/services', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setModalOpen(false);
                serviceForm.reset();
            },
            onFinish: () => setIsLoading(false),
        });
    };

    const triggerDeleteService = (svc: any) => {
        setDeleteTargetService(svc);
        setDeleteModalOpen(true);
    };

    const executeDeleteService = () => {
        if (!deleteTargetService) return;
        setLoadingMessage('Removing Service...');
        setIsLoading(true);

        router.delete(
            `/admin/services/${deleteTargetService._id || deleteTargetService.id}`,
            {
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setDeleteTargetService(null);
                },
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const executeDeleteAccount = () => {
        setLoadingMessage('Permanently Deleting Data...');
        setIsLoading(true);
        router.post(
            '/admin/delete-account',
            {},
            {
                onFinish: () => setIsLoading(false),
            },
        );
    };

    return (
        <div className="min-h-screen bg-[#faf9f6] font-sans text-stone-800">
            <Head title={`${profileForm.data.salon_name} - Customization`} />

            {/* Dynamic Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-white/80">
                    <h1 className="mb-5 font-serif text-2xl font-black tracking-[6px] text-[#064E3B] italic">
                        DIVABOOK
                    </h1>
                    <div className="relative mb-4 h-[2px] w-[200px] overflow-hidden bg-[#E5E7EB]">
                        <div className="absolute inset-0 animate-pulse bg-[#064E3B]"></div>
                    </div>
                    <p className="text-xs tracking-widest text-stone-500 uppercase">
                        {loadingMessage}
                    </p>
                </div>
            )}

            <main className="mx-auto max-w-6xl p-6 md:p-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="font-serif text-3xl font-bold text-[#064E3B]">
                        Customization
                    </h1>
                    <p className="text-xs text-stone-500">
                        Personalize your booking portal and maintain your
                        treatments catalog.
                    </p>
                </div>

                {Object.entries(profileForm.errors).map(([field, message]) => (
                    <p
                        key={field}
                        role="alert"
                        className="mb-2 text-sm text-red-700"
                    >
                        {message}
                    </p>
                ))}
                {/* Tab Switcher */}
                <div className="mb-6 flex gap-2 border-b border-stone-200 pb-3">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`rounded px-4 py-2 text-xs font-bold tracking-wider uppercase transition ${
                            activeTab === 'profile'
                                ? 'bg-[#064E3B] text-white'
                                : 'border border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                        }`}
                    >
                        Salon Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('services')}
                        className={`rounded px-4 py-2 text-xs font-bold tracking-wider uppercase transition ${
                            activeTab === 'services'
                                ? 'bg-[#064E3B] text-white'
                                : 'border border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                        }`}
                    >
                        Service Catalog ({services.length})
                    </button>
                </div>

                {/* Tab 1: Profile Customization */}
                {activeTab === 'profile' && (
                    <div className="space-y-8">
                        <form
                            onSubmit={submitProfile}
                            encType="multipart/form-data"
                            className="space-y-6 rounded-xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
                        >
                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                                {/* Left Form Column */}
                                <div className="space-y-4 lg:col-span-7">
                                    <h3 className="mb-4 text-sm font-bold tracking-wider text-stone-700 uppercase">
                                        Business Details
                                    </h3>
                                    <div>
                                        <label className="mb-1 block text-[10px] font-bold text-stone-500 uppercase">
                                            Salon Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profileForm.data.salon_name}
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    'salon_name',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-stone-400 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-[10px] font-bold text-stone-500 uppercase">
                                            Description
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={profileForm.data.description}
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-stone-400 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-[10px] font-bold text-stone-500 uppercase">
                                            Credentials
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={profileForm.data.credentials}
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    'credentials',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Experience, background, or certificates..."
                                            className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-stone-400 focus:outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="mb-1 block text-[10px] font-bold text-stone-500 uppercase">
                                                Business Address
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    profileForm.data.location
                                                }
                                                onChange={(e) =>
                                                    profileForm.setData(
                                                        'location',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-stone-400 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-[10px] font-bold text-stone-500 uppercase">
                                                Contact Info
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    profileForm.data
                                                        .contact_info
                                                }
                                                onChange={(e) =>
                                                    profileForm.setData(
                                                        'contact_info',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-stone-400 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <h5 className="flex items-center gap-2 pt-4 text-sm font-bold tracking-wider text-stone-700 uppercase">
                                        <span>🔗</span> Email &amp; Social Media
                                    </h5>

                                    <div>
                                        <label className="mb-1 block text-[10px] font-bold text-stone-500 uppercase">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={profileForm.data.email}
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    'email',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="shop@example.com"
                                            className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-stone-400 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-[10px] font-bold text-stone-500 uppercase">
                                            Facebook
                                        </label>
                                        <div className="grid grid-cols-1 gap-2 md:grid-cols-12">
                                            <div className="md:col-span-5">
                                                <input
                                                    type="text"
                                                    value={
                                                        profileForm.data
                                                            .facebook
                                                    }
                                                    onChange={(e) =>
                                                        profileForm.setData(
                                                            'facebook',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="@username"
                                                    className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-stone-400 focus:outline-none"
                                                />
                                            </div>
                                            <div className="md:col-span-7">
                                                <input
                                                    type="url"
                                                    value={
                                                        profileForm.data
                                                            .facebook_url
                                                    }
                                                    onChange={(e) =>
                                                        profileForm.setData(
                                                            'facebook_url',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="https://www.facebook.com/..."
                                                    className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-stone-400 focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-[10px] font-bold text-stone-500 uppercase">
                                            Instagram
                                        </label>
                                        <div className="grid grid-cols-1 gap-2 md:grid-cols-12">
                                            <div className="md:col-span-5">
                                                <input
                                                    type="text"
                                                    value={
                                                        profileForm.data
                                                            .instagram
                                                    }
                                                    onChange={(e) =>
                                                        profileForm.setData(
                                                            'instagram',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="@username"
                                                    className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-stone-400 focus:outline-none"
                                                />
                                            </div>
                                            <div className="md:col-span-7">
                                                <input
                                                    type="url"
                                                    value={
                                                        profileForm.data
                                                            .instagram_url
                                                    }
                                                    onChange={(e) =>
                                                        profileForm.setData(
                                                            'instagram_url',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="https://www.instagram.com/..."
                                                    className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-stone-400 focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Branding Column */}
                                <div className="lg:col-span-5">
                                    <div
                                        className="rounded-2xl border p-6 transition"
                                        style={{
                                            borderColor: lightColor,
                                            backgroundColor: paleColor,
                                        }}
                                    >
                                        <h4
                                            className="mb-3 text-base font-bold"
                                            style={{ color: primaryColor }}
                                        >
                                            Branding Elements
                                        </h4>

                                        <div
                                            className="mb-6 h-1.5 rounded-full"
                                            style={{
                                                background: `linear-gradient(90deg, ${primaryColor} 50%, ${secondaryColor} 50%)`,
                                            }}
                                        />

                                        {/* Logo Preview & Input */}
                                        <ImageUploadField
                                            name="logo_file"
                                            label="Profile Picture / Salon Logo"
                                            files={
                                                profileForm.data.logo_file
                                                    ? [
                                                          profileForm.data
                                                              .logo_file,
                                                      ]
                                                    : []
                                            }
                                            onChange={(files) =>
                                                profileForm.setData(
                                                    'logo_file',
                                                    files[0] || null,
                                                )
                                            }
                                            savedImages={
                                                branding.logo_path
                                                    ? [branding.logo_path]
                                                    : []
                                            }
                                            error={profileForm.errors.logo_file}
                                            disabled={profileForm.processing}
                                        />
                                        {/* Color Pickers */}
                                        <div className="space-y-3">
                                            <label className="mb-1 block text-[11px] font-bold text-stone-500 uppercase">
                                                Desired Color Palette
                                            </label>

                                            <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-3">
                                                <input
                                                    type="color"
                                                    value={
                                                        profileForm.data
                                                            .color_primary
                                                    }
                                                    onChange={(e) =>
                                                        profileForm.setData(
                                                            'color_primary',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-11 w-11 cursor-pointer rounded-lg border-0 p-0"
                                                />
                                                <div className="flex-1">
                                                    <label className="block text-xs font-bold text-stone-800">
                                                        Primary Color
                                                    </label>
                                                </div>
                                                <input
                                                    type="text"
                                                    maxLength={7}
                                                    value={profileForm.data.color_primary.toUpperCase()}
                                                    onChange={(e) =>
                                                        handleHexChange(
                                                            'color_primary',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-24 rounded-lg border border-stone-300 p-2 text-center font-mono text-xs font-bold uppercase"
                                                />
                                            </div>

                                            <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-3">
                                                <input
                                                    type="color"
                                                    value={
                                                        profileForm.data
                                                            .color_secondary
                                                    }
                                                    onChange={(e) =>
                                                        profileForm.setData(
                                                            'color_secondary',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-11 w-11 cursor-pointer rounded-lg border-0 p-0"
                                                />
                                                <div className="flex-1">
                                                    <label className="block text-xs font-bold text-stone-800">
                                                        Secondary Color
                                                    </label>
                                                </div>
                                                <input
                                                    type="text"
                                                    maxLength={7}
                                                    value={profileForm.data.color_secondary.toUpperCase()}
                                                    onChange={(e) =>
                                                        handleHexChange(
                                                            'color_secondary',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-24 rounded-lg border border-stone-300 p-2 text-center font-mono text-xs font-bold uppercase"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end border-t border-stone-100 pt-4">
                                <button
                                    type="submit"
                                    disabled={profileForm.processing}
                                    style={{ backgroundColor: primaryColor }}
                                    className="rounded-xl px-8 py-3 text-xs font-bold tracking-wider text-white uppercase shadow transition hover:opacity-95"
                                >
                                    {profileForm.processing
                                        ? 'Saving...'
                                        : 'Save All Changes'}
                                </button>
                            </div>
                        </form>

                        {/* Danger Zone */}
                        <div className="mt-8 rounded-xl border border-red-200 bg-red-50/30 p-6">
                            <h4 className="mb-1 text-base font-bold text-red-600">
                                Danger Zone
                            </h4>
                            <p className="mb-4 text-xs text-stone-500">
                                Deleting your account will permanently remove
                                your salon profile, services, and past records.
                            </p>
                            <button
                                type="button"
                                onClick={() => setAccountDeleteModalOpen(true)}
                                className="rounded bg-red-600 px-4 py-2 text-xs font-bold text-white uppercase transition hover:bg-red-700"
                            >
                                Delete Salon Account
                            </button>
                        </div>
                    </div>
                )}

                {/* Tab 2: Service Catalog */}
                {activeTab === 'services' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-stone-500">
                                Add or modify services available for customer
                                booking.
                            </p>
                            <button
                                onClick={() => openServiceModal()}
                                className="rounded bg-[#064E3B] px-4 py-2 text-xs font-bold tracking-wider text-white uppercase transition hover:bg-[#043d2e]"
                            >
                                + Add New Service
                            </button>
                        </div>

                        {services.length === 0 ? (
                            <div className="rounded-xl border border-stone-200 bg-white p-12 text-center text-sm text-stone-400 shadow-sm">
                                No services found. Click &quot;+ Add New
                                Service&quot; to begin.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                {services.map((svc: any) => (
                                    <div
                                        key={svc._id || svc.id}
                                        className="flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
                                    >
                                        <div>
                                            <div className="mb-2 flex items-start justify-between">
                                                <span className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-600 uppercase">
                                                    {svc.category}
                                                </span>
                                                <span className="text-sm font-bold text-[#064E3B]">
                                                    ₱{svc.rate}
                                                </span>
                                            </div>
                                            <h4 className="mb-1 text-base font-bold text-stone-800">
                                                {svc.name}
                                            </h4>
                                            <p className="line-clamp-2 text-xs text-stone-500">
                                                {svc.description}
                                            </p>
                                        </div>

                                        <div className="mt-4 flex gap-2 border-t border-stone-100 pt-4">
                                            <button
                                                onClick={() =>
                                                    openServiceModal(svc)
                                                }
                                                className="flex-1 rounded bg-stone-100 py-1.5 text-xs font-bold text-stone-700 transition hover:bg-stone-200"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    triggerDeleteService(svc)
                                                }
                                                className="rounded bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Service Add/Edit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between border-b pb-2">
                            <h3 className="text-sm font-bold text-stone-800">
                                {editingService
                                    ? 'Edit Service'
                                    : 'Add New Service'}
                            </h3>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="text-stone-400 hover:text-stone-700"
                            >
                                ✕
                            </button>
                        </div>

                        <form
                            onSubmit={submitService}
                            encType="multipart/form-data"
                            className="space-y-3"
                        >
                            <div>
                                <label className="mb-1 block text-[10px] font-bold text-stone-500 uppercase">
                                    Service Name
                                </label>
                                <input
                                    type="text"
                                    value={serviceForm.data.service_name}
                                    onChange={(e) =>
                                        serviceForm.setData(
                                            'service_name',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="e.g., Soft BIAB Overlay"
                                    className="w-full rounded border border-stone-200 p-2 text-sm focus:outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-[10px] font-bold text-stone-500 uppercase">
                                    Category
                                </label>
                                <select
                                    value={serviceForm.data.category}
                                    onChange={(e) =>
                                        serviceForm.setData(
                                            'category',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded border border-stone-200 p-2 text-sm focus:outline-none"
                                >
                                    <option value="Hair">Hair</option>
                                    <option value="Nails">Nails</option>
                                    <option value="Skin">Skin</option>
                                    <option value="Massage">Massage</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-[10px] font-bold text-stone-500 uppercase">
                                    Rate (₱)
                                </label>
                                <input
                                    type="text"
                                    value={serviceForm.data.rate}
                                    onChange={(e) =>
                                        serviceForm.setData(
                                            'rate',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="1200"
                                    className="w-full rounded border border-stone-200 p-2 text-sm focus:outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-[10px] font-bold text-stone-500 uppercase">
                                    Description
                                </label>
                                <textarea
                                    rows={3}
                                    value={serviceForm.data.description}
                                    onChange={(e) =>
                                        serviceForm.setData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Describe treatment details..."
                                    className="w-full rounded border border-stone-200 p-2 text-sm focus:outline-none"
                                />
                            </div>

                            <ImageUploadField
                                name="photos[]"
                                label="Sample Service Images"
                                files={serviceForm.data.photos}
                                onChange={(files) =>
                                    serviceForm.setData('photos', files)
                                }
                                savedImages={editingService?.photos || []}
                                maxFiles={10}
                                error={serviceForm.errors.photos}
                                disabled={serviceForm.processing}
                            />
                            {Object.entries(serviceForm.errors).map(
                                ([field, message]) => (
                                    <p
                                        key={field}
                                        role="alert"
                                        className="text-sm text-red-700"
                                    >
                                        {message}
                                    </p>
                                ),
                            )}
                            <div className="flex gap-2 border-t border-stone-100 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="flex-1 rounded bg-stone-100 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={serviceForm.processing}
                                    className="flex-1 rounded bg-[#064E3B] py-2.5 text-xs font-bold text-white uppercase hover:bg-[#043d2e]"
                                >
                                    Save Service
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE SERVICE MODAL */}
            {deleteModalOpen && deleteTargetService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 text-center shadow-2xl">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl font-bold text-red-600">
                            ⚠️
                        </div>
                        <h4 className="text-lg font-bold text-stone-800">
                            Remove this service?
                        </h4>
                        <p className="text-xs text-stone-500">
                            This will permanently delete{' '}
                            <strong>{deleteTargetService.name}</strong> from
                            your catalog. This action cannot be undone.
                        </p>
                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="flex-1 rounded-lg bg-stone-100 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeDeleteService}
                                className="flex-1 rounded-lg bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700"
                            >
                                Delete Service
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CONFIRM ACCOUNT DELETION MODAL */}
            {accountDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 text-center shadow-2xl">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl font-bold text-red-600">
                            ⚠️
                        </div>
                        <h4 className="text-lg font-bold text-red-600">
                            Are you absolutely sure?
                        </h4>
                        <p className="text-xs text-stone-500">
                            This action is permanent. All your salon profile
                            data, services, and branding will be deleted
                            forever.
                        </p>
                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={() => setAccountDeleteModalOpen(false)}
                                className="flex-1 rounded-lg bg-stone-100 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-200"
                            >
                                No, Keep My Account
                            </button>
                            <button
                                onClick={executeDeleteAccount}
                                className="flex-1 rounded-lg bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700"
                            >
                                Yes, Delete Everything
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
