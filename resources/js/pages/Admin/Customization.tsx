import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminNavbar from '@/components/AdminNavbar';

interface CustomizationProps {
    partner: any;
    services: any[];
}

export default function Customization({
    partner,
    services = [],
}: CustomizationProps) {
    const [activeTab, setActiveTab] = useState<'profile' | 'services'>('profile');
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
        action: 'save_salon_profile',
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
        logo: null as File | null,
    });

    // 2. Service Form
    const serviceForm = useForm({
        service_id: '',
        service_name: '',
        category: 'Hair',
        rate: '',
        description: '',
        existing_photos: [] as string[],
        service_photo_1: null as File | null,
        service_photo_2: null as File | null,
        service_photo_3: null as File | null,
    });

    const [previews, setPreviews] = useState<string[]>(['', '', '']);

    const tint = (hex: string, ratio: number) => {
        if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return hex;
        const r = Math.round(parseInt(hex.slice(1, 3), 16) + (255 - parseInt(hex.slice(1, 3), 16)) * ratio);
        const g = Math.round(parseInt(hex.slice(3, 5), 16) + (255 - parseInt(hex.slice(3, 5), 16)) * ratio);
        const b = Math.round(parseInt(hex.slice(5, 7), 16) + (255 - parseInt(hex.slice(5, 7), 16)) * ratio);
        return `rgb(${r},${g},${b})`;
    };

    const primaryColor = profileForm.data.color_primary || '#064E3B';
    const secondaryColor = profileForm.data.color_secondary || '#7cbf7f';
    const paleColor = tint(primaryColor, 0.88);
    const lightColor = tint(primaryColor, 0.75);

    const handleHexChange = (field: 'color_primary' | 'color_secondary', value: string) => {
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
            onFinish: () => setIsLoading(false),
        });
    };

    const openServiceModal = (svc: any = null) => {
        if (svc) {
            setEditingService(svc);
            const existing = Array.isArray(svc.photos) ? svc.photos : (svc.photo ? [svc.photo] : []);
            serviceForm.setData({
                service_id: svc._id || svc.id,
                service_name: svc.name || '',
                category: svc.category || 'Hair',
                rate: svc.rate || '',
                description: svc.description || '',
                existing_photos: existing,
                service_photo_1: null,
                service_photo_2: null,
                service_photo_3: null,
            });
            setPreviews([existing[0] || '', existing[1] || '', existing[2] || '']);
        } else {
            setEditingService(null);
            serviceForm.reset();
            setPreviews(['', '', '']);
        }
        setModalOpen(true);
    };

    const submitService = (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingMessage('Processing Service Catalog...');
        setIsLoading(true);

        serviceForm.post('/admin/services', {
            forceFormData: true,
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

        router.delete(`/admin/services/${deleteTargetService._id || deleteTargetService.id}`, {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setDeleteTargetService(null);
            },
            onFinish: () => setIsLoading(false),
        });
    };

    const executeDeleteAccount = () => {
        setLoadingMessage('Permanently Deleting Data...');
        setIsLoading(true);
        router.post('/admin/delete-account', {}, {
            onFinish: () => setIsLoading(false),
        });
    };

    return (
        <div className="min-h-screen bg-[#faf9f6] text-stone-800 font-sans pt-[80px]">
            <Head title={`${profileForm.data.salon_name} - Customization`} />
            <AdminNavbar active="customization" adminId={partner?.admin_id} />

            {/* Dynamic Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-white/80 z-[10000] flex flex-col items-center justify-center">
                    <h1 className="font-serif italic font-black text-2xl tracking-[6px] text-[#064E3B] mb-5">
                        DIVABOOK
                    </h1>
                    <div className="w-[200px] h-[2px] bg-[#E5E7EB] relative overflow-hidden mb-4">
                        <div className="absolute inset-0 bg-[#064E3B] animate-pulse"></div>
                    </div>
                    <p className="text-xs uppercase tracking-widest text-stone-500">{loadingMessage}</p>
                </div>
            )}

            <main className="mx-auto max-w-6xl p-6 md:p-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="font-serif text-3xl font-bold text-[#064E3B]">
                        Customization
                    </h1>
                    <p className="text-xs text-stone-500">
                        Personalize your booking portal and maintain your treatments catalog.
                    </p>
                </div>

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
                            className="space-y-6 rounded-xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Left Form Column */}
                                <div className="lg:col-span-7 space-y-4">
                                    <h3 className="text-sm font-bold tracking-wider text-stone-700 uppercase mb-4">
                                        Business Details
                                    </h3>
                                    <div>
                                        <label className="mb-1 block text-[10px] font-bold text-stone-500 uppercase">
                                            Salon Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profileForm.data.salon_name}
                                            onChange={(e) => profileForm.setData('salon_name', e.target.value)}
                                            className="w-full rounded border border-stone-200 p-2.5 text-sm focus:outline-none focus:border-stone-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-[10px] font-bold text-stone-500 uppercase">
                                            Description
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={profileForm.data.description}
                                            onChange={(e) => profileForm.setData('description', e.target.value)}
                                            className="w-full rounded border border-stone-200 p-2.5 text-sm focus:outline-none focus:border-stone-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-[10px] font-bold text-stone-500 uppercase">
                                            Credentials
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={profileForm.data.credentials}
                                            onChange={(e) => profileForm.setData('credentials', e.target.value)}
                                            placeholder="Experience, background, or certificates..."
                                            className="w-full rounded border border-stone-200 p-2.5 text-sm focus:outline-none focus:border-stone-400"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="mb-1 block text-[10px] font-bold text-stone-500 uppercase">
                                                Business Address
                                            </label>
                                            <input
                                                type="text"
                                                value={profileForm.data.location}
                                                onChange={(e) => profileForm.setData('location', e.target.value)}
                                                className="w-full rounded border border-stone-200 p-2.5 text-sm focus:outline-none focus:border-stone-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-[10px] font-bold text-stone-500 uppercase">
                                                Contact Info
                                            </label>
                                            <input
                                                type="text"
                                                value={profileForm.data.contact_info}
                                                onChange={(e) => profileForm.setData('contact_info', e.target.value)}
                                                className="w-full rounded border border-stone-200 p-2.5 text-sm focus:outline-none focus:border-stone-400"
                                            />
                                        </div>
                                    </div>

                                    <h5 className="text-sm font-bold pt-4 text-stone-700 uppercase tracking-wider flex items-center gap-2">
                                        <span>🔗</span> Email &amp; Social Media
                                    </h5>

                                    <div>
                                        <label className="mb-1 block text-[10px] font-bold text-stone-500 uppercase">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={profileForm.data.email}
                                            onChange={(e) => profileForm.setData('email', e.target.value)}
                                            placeholder="shop@example.com"
                                            className="w-full rounded border border-stone-200 p-2.5 text-sm focus:outline-none focus:border-stone-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-[10px] font-bold text-stone-500 uppercase">
                                            Facebook
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                                            <div className="md:col-span-5">
                                                <input
                                                    type="text"
                                                    value={profileForm.data.facebook}
                                                    onChange={(e) => profileForm.setData('facebook', e.target.value)}
                                                    placeholder="@username"
                                                    className="w-full rounded border border-stone-200 p-2.5 text-sm focus:outline-none focus:border-stone-400"
                                                />
                                            </div>
                                            <div className="md:col-span-7">
                                                <input
                                                    type="url"
                                                    value={profileForm.data.facebook_url}
                                                    onChange={(e) => profileForm.setData('facebook_url', e.target.value)}
                                                    placeholder="https://www.facebook.com/..."
                                                    className="w-full rounded border border-stone-200 p-2.5 text-sm focus:outline-none focus:border-stone-400"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-[10px] font-bold text-stone-500 uppercase">
                                            Instagram
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                                            <div className="md:col-span-5">
                                                <input
                                                    type="text"
                                                    value={profileForm.data.instagram}
                                                    onChange={(e) => profileForm.setData('instagram', e.target.value)}
                                                    placeholder="@username"
                                                    className="w-full rounded border border-stone-200 p-2.5 text-sm focus:outline-none focus:border-stone-400"
                                                />
                                            </div>
                                            <div className="md:col-span-7">
                                                <input
                                                    type="url"
                                                    value={profileForm.data.instagram_url}
                                                    onChange={(e) => profileForm.setData('instagram_url', e.target.value)}
                                                    placeholder="https://www.instagram.com/..."
                                                    className="w-full rounded border border-stone-200 p-2.5 text-sm focus:outline-none focus:border-stone-400"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Branding Column */}
                                <div className="lg:col-span-5">
                                    <div
                                        className="p-6 rounded-2xl border transition"
                                        style={{ borderColor: lightColor, backgroundColor: paleColor }}
                                    >
                                        <h4 className="text-base font-bold mb-3" style={{ color: primaryColor }}>
                                            Branding Elements
                                        </h4>

                                        <div
                                            className="h-1.5 rounded-full mb-6"
                                            style={{ background: `linear-gradient(90deg, ${primaryColor} 50%, ${secondaryColor} 50%)` }}
                                        />

                                        {/* Logo Preview & Input */}
                                        <div className="mb-6">
                                            <label className="block text-[11px] font-bold text-stone-500 uppercase mb-2">
                                                Logo Image
                                            </label>
                                            <div className="bg-white border-2 border-dashed border-stone-300 rounded-xl p-4 text-center mb-3">
                                                {branding.logo_path ? (
                                                    <div>
                                                        <img
                                                            src={branding.logo_path}
                                                            alt="Salon Logo"
                                                            className="max-h-28 mx-auto object-contain rounded"
                                                        />
                                                        <p className="text-[11px] text-stone-400 mt-2">Current Logo</p>
                                                    </div>
                                                ) : (
                                                    <div className="py-4 text-stone-400">
                                                        <span className="text-3xl">🖼️</span>
                                                        <p className="text-xs mt-1">No logo uploaded yet</p>
                                                    </div>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => profileForm.setData('logo', e.target.files ? e.target.files[0] : null)}
                                                className="text-xs text-stone-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-white file:text-stone-700 file:shadow-sm hover:file:bg-stone-100"
                                            />
                                        </div>

                                        <hr className="border-stone-200 my-6" />

                                        {/* Color Pickers */}
                                        <div className="space-y-3">
                                            <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">
                                                Desired Color Palette
                                            </label>

                                            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-stone-200">
                                                <input
                                                    type="color"
                                                    value={profileForm.data.color_primary}
                                                    onChange={(e) => profileForm.setData('color_primary', e.target.value)}
                                                    className="w-11 h-11 rounded-lg border-0 cursor-pointer p-0"
                                                />
                                                <div className="flex-1">
                                                    <label className="block text-xs font-bold text-stone-800">Primary Color</label>
                                                </div>
                                                <input
                                                    type="text"
                                                    maxLength={7}
                                                    value={profileForm.data.color_primary.toUpperCase()}
                                                    onChange={(e) => handleHexChange('color_primary', e.target.value)}
                                                    className="font-mono text-xs font-bold uppercase w-24 p-2 border border-stone-300 rounded-lg text-center"
                                                />
                                            </div>

                                            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-stone-200">
                                                <input
                                                    type="color"
                                                    value={profileForm.data.color_secondary}
                                                    onChange={(e) => profileForm.setData('color_secondary', e.target.value)}
                                                    className="w-11 h-11 rounded-lg border-0 cursor-pointer p-0"
                                                />
                                                <div className="flex-1">
                                                    <label className="block text-xs font-bold text-stone-800">Secondary Color</label>
                                                </div>
                                                <input
                                                    type="text"
                                                    maxLength={7}
                                                    value={profileForm.data.color_secondary.toUpperCase()}
                                                    onChange={(e) => handleHexChange('color_secondary', e.target.value)}
                                                    className="font-mono text-xs font-bold uppercase w-24 p-2 border border-stone-300 rounded-lg text-center"
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
                                    className="text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow hover:opacity-95 transition"
                                >
                                    {profileForm.processing ? 'Saving...' : 'Save All Changes'}
                                </button>
                            </div>
                        </form>

                        {/* Danger Zone */}
                        <div className="mt-8 rounded-xl border border-red-200 bg-red-50/30 p-6">
                            <h4 className="text-red-600 font-bold text-base mb-1">Danger Zone</h4>
                            <p className="text-xs text-stone-500 mb-4">
                                Deleting your account will permanently remove your salon profile, services, and past records.
                            </p>
                            <button
                                type="button"
                                onClick={() => setAccountDeleteModalOpen(true)}
                                className="rounded bg-red-600 px-4 py-2 text-xs font-bold text-white uppercase hover:bg-red-700 transition"
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
                                Add or modify services available for customer booking.
                            </p>
                            <button
                                onClick={() => openServiceModal()}
                                className="rounded bg-[#064E3B] px-4 py-2 text-xs font-bold tracking-wider text-white uppercase hover:bg-[#043d2e] transition"
                            >
                                + Add New Service
                            </button>
                        </div>

                        {services.length === 0 ? (
                            <div className="rounded-xl border border-stone-200 bg-white p-12 text-center text-sm text-stone-400 shadow-sm">
                                No services found. Click &quot;+ Add New Service&quot; to begin.
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
                                                onClick={() => openServiceModal(svc)}
                                                className="flex-1 rounded bg-stone-100 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-200 transition"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => triggerDeleteService(svc)}
                                                className="rounded bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 transition"
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
                                {editingService ? 'Edit Service' : 'Add New Service'}
                            </h3>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="text-stone-400 hover:text-stone-700"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={submitService} className="space-y-3">
                            <div>
                                <label className="mb-1 block text-[10px] font-bold text-stone-500 uppercase">
                                    Service Name
                                </label>
                                <input
                                    type="text"
                                    value={serviceForm.data.service_name}
                                    onChange={(e) => serviceForm.setData('service_name', e.target.value)}
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
                                    onChange={(e) => serviceForm.setData('category', e.target.value)}
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
                                    onChange={(e) => serviceForm.setData('rate', e.target.value)}
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
                                    onChange={(e) => serviceForm.setData('description', e.target.value)}
                                    placeholder="Describe treatment details..."
                                    className="w-full rounded border border-stone-200 p-2 text-sm focus:outline-none"
                                />
                            </div>

                            <div className="flex gap-2 pt-2 border-t border-stone-100">
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
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
                        <div className="w-14 h-14 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl font-bold">
                            ⚠️
                        </div>
                        <h4 className="font-bold text-lg text-stone-800">Remove this service?</h4>
                        <p className="text-xs text-stone-500">
                            This will permanently delete <strong>{deleteTargetService.name}</strong> from your catalog. This action cannot be undone.
                        </p>
                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="flex-1 py-2.5 rounded-lg text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeDeleteService}
                                className="flex-1 py-2.5 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-700"
                            >
                                Delete Service
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CONFIRM ACCOUNT DELETION MODAL */}
            {accountDeleteModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
                        <div className="w-14 h-14 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl font-bold">
                            ⚠️
                        </div>
                        <h4 className="font-bold text-lg text-red-600">Are you absolutely sure?</h4>
                        <p className="text-xs text-stone-500">
                            This action is permanent. All your salon profile data, services, and branding will be deleted forever.
                        </p>
                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={() => setAccountDeleteModalOpen(false)}
                                className="flex-1 py-2.5 rounded-lg text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200"
                            >
                                No, Keep My Account
                            </button>
                            <button
                                onClick={executeDeleteAccount}
                                className="flex-1 py-2.5 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-700"
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