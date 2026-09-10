import React, { useState, useEffect, useRef } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminNavbar from '@/components/AdminNavbar';

interface CustomizationProps {
    partner: any;
    services: any[];
}

<<<<<<< HEAD
export default function Customization({ partner, services = [] }: CustomizationProps) {
    const [activeTab, setActiveTab] = useState<'profile' | 'services' | 'template'>('profile');
    
    // Modal states
    const [serviceModalOpen, setServiceModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [accountDeleteModalOpen, setAccountDeleteModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<any>(null);
    const [deleteTargetService, setDeleteTargetService] = useState<{ id: string; name: string } | null>(null);

    // Dynamic Loading Overlay
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Applying your changes...');
=======
export default function Customization({
    partner,
    services = [],
}: CustomizationProps) {
    const [activeTab, setActiveTab] = useState<'profile' | 'services'>(
        'profile',
    );
    const [modalOpen, setModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<any>(null);
>>>>>>> 33ab5ff544701f1538fbe5808b17028254537e67

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
        category: '',
        rate: '',
        description: '',
        existing_photos: [] as string[],
        service_photo_1: null as File | null,
        service_photo_2: null as File | null,
        service_photo_3: null as File | null,
    });

    // Service photo preview URLs
    const [previews, setPreviews] = useState<string[]>(['', '', '']);

    // Color Tinting & Dynamic CSS Injection (from admin_customization.js)
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

    // Sync Hex & Color inputs
    const handleHexChange = (field: 'color_primary' | 'color_secondary', value: string) => {
        let val = value.trim();
        if (!val.startsWith('#') && val.length > 0) val = '#' + val;
        profileForm.setData(field, val);
    };

    // Profile Submit
    const submitProfile = (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingMessage('Updating Salon Profile...');
        setIsLoading(true);

        profileForm.post('/admin/profile', {
            forceFormData: true,
            onFinish: () => setIsLoading(false),
        });
    };

    // Open Service Add/Edit Modal
    const openServiceModal = (svc: any = null) => {
        if (svc) {
            setSelectedService(svc);
            const existing = Array.isArray(svc.photos) ? svc.photos : (svc.photo ? [svc.photo] : []);
            serviceForm.setData({
                service_id: svc._id || svc.id,
                service_name: svc.name || '',
                category: svc.category || '',
                rate: svc.rate || '',
                description: svc.description || '',
                existing_photos: existing,
                service_photo_1: null,
                service_photo_2: null,
                service_photo_3: null,
            });
            setPreviews([existing[0] || '', existing[1] || '', existing[2] || '']);
        } else {
            setSelectedService(null);
            serviceForm.reset();
            setPreviews(['', '', '']);
        }
        setServiceModalOpen(true);
    };

    // Handle Service Inspo Photo Selection
    const handlePhotoSelect = (index: number, file: File | null) => {
        if (!file) return;
        const key = `service_photo_${index + 1}` as 'service_photo_1' | 'service_photo_2' | 'service_photo_3';
        serviceForm.setData(key, file);

        const reader = new FileReader();
        reader.onload = (e) => {
            const updated = [...previews];
            updated[index] = e.target?.result as string;
            setPreviews(updated);
        };
        reader.readAsDataURL(file);
    };

    // Submit Service Form
    const submitService = (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingMessage('Processing Service Catalog...');
        setIsLoading(true);

        serviceForm.post('/admin/services', {
            forceFormData: true,
            onSuccess: () => {
                setServiceModalOpen(false);
                serviceForm.reset();
            },
            onFinish: () => setIsLoading(false),
        });
    };

    // Confirm & Execute Delete Service
    const executeDeleteService = () => {
        if (!deleteTargetService) return;
        setLoadingMessage('Removing Service...');
        setIsLoading(true);

        router.delete(`/admin/services/${deleteTargetService.id}`, {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setDeleteTargetService(null);
            },
            onFinish: () => setIsLoading(false),
        });
    };

    // Delete Entire Account
    const executeDeleteAccount = () => {
        setLoadingMessage('Permanently Deleting Data...');
        setIsLoading(true);
        router.post('/admin/delete-account', {}, {
            onFinish: () => setIsLoading(false)
        });
    };

    return (
<<<<<<< HEAD
        <div className="min-h-screen bg-[#faf9f6] text-[#1a1c1a] font-['Manrope',sans-serif] pt-[80px]">
            <Head title={`${profileForm.data.salon_name} - Customization`} />
            <AdminNavbar active="customization" adminId={partner?.admin_id} />
            {/* Dynamic Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-white z-[10000] flex flex-col items-center justify-center">
                    <h1 className="font-serif italic font-black text-2xl tracking-[6px] text-[var(--primary-theme)] mb-5">
                        DIVABOOK
                    </h1>
                    <div className="w-[200px] h-[2px] bg-[#E5E7EB] relative overflow-hidden mb-4">
                        <div className="absolute inset-0 bg-[var(--primary-theme)] animate-pulse"></div>
=======
<<<<<<< HEAD
        <div className="min-h-screen bg-[#faf9f6] font-sans text-stone-800">
            <Head title="Customization - Admin Portal" />

            {/* Top Navigation */}
            <nav className="sticky top-0 z-40 flex h-[76px] items-center justify-between border-b border-stone-200 bg-white px-8">
                <div className="flex items-center gap-6">
                    <span className="font-serif text-2xl font-black text-[#064E3B] italic">
                        DIVABOOK
                    </span>
                    <span className="rounded bg-stone-100 px-2.5 py-1 font-mono text-xs text-stone-600">
                        Admin: {partner?.admin_id}
                    </span>
                </div>
                <button
                    onClick={() => router.post('/logout')}
                    className="text-xs font-bold tracking-wider text-red-600 uppercase hover:text-red-700"
                >
                    Sign Out
                </button>
            </nav>
=======
        <div className="min-h-screen bg-[#faf9f6] text-stone-800 font-sans pt-[80px]">
            <Head title="Customization - Admin Portal" />
            <AdminNavbar active="customization" adminId={partner?.admin_id} />
>>>>>>> cd3009760716be2bcbf08c7fd8ffea22f330cb8d

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

                {/* Tab Switcher Buttons */}
                <div className="mb-6 flex gap-2 border-b border-stone-200 pb-3">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`rounded px-4 py-2 text-xs font-bold tracking-wider uppercase ${
                            activeTab === 'profile'
                                ? 'bg-[#064E3B] text-white'
                                : 'border border-stone-200 bg-white text-stone-600'
                        }`}
                    >
                        Salon Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('services')}
                        className={`rounded px-4 py-2 text-xs font-bold tracking-wider uppercase ${
                            activeTab === 'services'
                                ? 'bg-[#064E3B] text-white'
                                : 'border border-stone-200 bg-white text-stone-600'
                        }`}
                    >
                        Service Catalog ({services.length})
                    </button>
                </div>

                {/* Tab 1: Profile Customization */}
                {activeTab === 'profile' && (
                    <form
                        onSubmit={submitProfile}
                        className="space-y-6 rounded-xl border border-stone-200 bg-white p-6 sm:p-8"
                    >
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold tracking-wider text-stone-700 uppercase">
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
                                        className="w-full rounded border border-stone-200 p-2.5 text-sm"
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
                                        className="w-full rounded border border-stone-200 p-2.5 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-[10px] font-bold text-stone-500 uppercase">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        value={profileForm.data.location}
                                        onChange={(e) =>
                                            profileForm.setData(
                                                'location',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded border border-stone-200 p-2.5 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-bold tracking-wider text-stone-700 uppercase">
                                    Brand Colors
                                </h3>
                                <div>
                                    <label className="mb-1 block text-[10px] font-bold text-stone-500 uppercase">
                                        Primary Color
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={
                                                profileForm.data.color_primary
                                            }
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    'color_primary',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-10 w-12 cursor-pointer rounded border-0"
                                        />
                                        <input
                                            type="text"
                                            value={
                                                profileForm.data.color_primary
                                            }
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    'color_primary',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-28 rounded border border-stone-200 p-2 font-mono text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-[10px] font-bold text-stone-500 uppercase">
                                        Secondary Color
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={
                                                profileForm.data.color_secondary
                                            }
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    'color_secondary',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-10 w-12 cursor-pointer rounded border-0"
                                        />
                                        <input
                                            type="text"
                                            value={
                                                profileForm.data.color_secondary
                                            }
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    'color_secondary',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-28 rounded border border-stone-200 p-2 font-mono text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end border-t border-stone-100 pt-4">
                            <button
                                type="submit"
                                disabled={profileForm.processing}
                                className="rounded bg-[#064E3B] px-8 py-3 text-xs font-bold tracking-wider text-white uppercase hover:bg-[#043d2e]"
                            >
                                {profileForm.processing
                                    ? 'Saving...'
                                    : 'Save All Changes'}
                            </button>
                        </div>
                    </form>
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
                                className="rounded bg-[#064E3B] px-4 py-2 text-xs font-bold tracking-wider text-white uppercase hover:bg-[#043d2e]"
                            >
                                + Add New Service
                            </button>
                        </div>

                        {services.length === 0 ? (
                            <div className="rounded-xl border border-stone-200 bg-white p-12 text-center text-sm text-stone-400">
                                No services found. Click &quot;+ Add New
                                Service&quot; to begin.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                {services.map((svc: any) => (
                                    <div
                                        key={svc._id || svc.id}
                                        className="flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-5"
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
                                                className="flex-1 rounded bg-stone-100 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-200"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    deleteService(
                                                        svc._id || svc.id,
                                                    )
                                                }
                                                className="rounded bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
>>>>>>> 33ab5ff544701f1538fbe5808b17028254537e67
                    </div>
                    <p className="text-xs uppercase tracking-widest text-stone-500">{loadingMessage}</p>
                </div>
            )}

<<<<<<< HEAD
            <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 pb-12">
                {/* Admin-ID Hero Card */}
                <div className="bg-[#f8f9fa] border border-[#c0c9bc] rounded-xl p-4 md:p-5 shadow-sm inline-flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center text-stone-600">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
                        </svg>
                    </div>
                    <div>
                        <small className="block text-[10px] font-extrabold uppercase tracking-wider text-stone-500">System Identifier</small>
                        <span className="text-sm font-semibold">
                            Admin ID: <strong className="font-mono text-xl font-bold ml-1" style={{ color: primaryColor }}>{partner?.admin_id}</strong>
                        </span>
                    </div>
                </div>

                {/* Page Title */}
                <div className="mb-6">
                    <h1 className="text-3xl font-serif font-bold" style={{ color: primaryColor }}>Customization</h1>
                    <p className="text-sm text-stone-500">Personalize your booking system and manage your salon&apos;s profile.</p>
                </div>

                {/* Card Container */}
                <div className="bg-white border border-[#c0c9bc] rounded-xl shadow-sm p-4 md:p-8">
                    {/* Navigation Tabs */}
                    <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-4 mb-6">
                        <button
                            type="button"
                            onClick={() => setActiveTab('profile')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                                activeTab === 'profile'
                                    ? 'text-white shadow-md'
                                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                            }`}
                            style={{ backgroundColor: activeTab === 'profile' ? primaryColor : undefined }}
                        >
                            <span>🏪</span> Salon Profile
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('services')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                                activeTab === 'services'
                                    ? 'text-white shadow-md'
                                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                            }`}
                            style={{ backgroundColor: activeTab === 'services' ? primaryColor : undefined }}
                        >
                            <span>📋</span> Service Catalog ({services.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('template')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                                activeTab === 'template'
                                    ? 'text-white shadow-md'
                                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                            }`}
                            style={{ backgroundColor: activeTab === 'template' ? primaryColor : undefined }}
                        >
                            <span>🌐</span> Template for Booking
                        </button>
                    </div>

                    {/* TAB 1: SALON PROFILE */}
                    {activeTab === 'profile' && (
                        <div>
                            <form onSubmit={submitProfile} className="space-y-8">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                    {/* Left Column: Basic Info & Socials */}
                                    <div className="lg:col-span-7 space-y-6">
                                        <h4 className="text-lg font-bold" style={{ color: primaryColor }}>Basic Information</h4>

                                        <div>
                                            <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">Business Name</label>
                                            <input
                                                type="text"
                                                value={profileForm.data.salon_name}
                                                onChange={(e) => profileForm.setData('salon_name', e.target.value)}
                                                className="w-full text-sm p-3 border border-[#c0c9bc] rounded-lg focus:outline-none"
                                                required
                                            />
                                        </div>
=======
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

                        <form onSubmit={submitService} className="space-y-3">
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
                                    className="w-full rounded border border-stone-200 p-2 text-sm"
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
                                    className="w-full rounded border border-stone-200 p-2 text-sm"
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
                                    className="w-full rounded border border-stone-200 p-2 text-sm"
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
                                    className="w-full rounded border border-stone-200 p-2 text-sm"
                                />
                            </div>
>>>>>>> 33ab5ff544701f1538fbe5808b17028254537e67

                                        <div>
                                            <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">Description</label>
                                            <textarea
                                                rows={3}
                                                value={profileForm.data.description}
                                                onChange={(e) => profileForm.setData('description', e.target.value)}
                                                className="w-full text-sm p-3 border border-[#c0c9bc] rounded-lg focus:outline-none bg-stone-50"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">Credentials</label>
                                            <textarea
                                                rows={3}
                                                value={profileForm.data.credentials}
                                                onChange={(e) => profileForm.setData('credentials', e.target.value)}
                                                placeholder="Experience, background, or certificates..."
                                                className="w-full text-sm p-3 border border-[#c0c9bc] rounded-lg focus:outline-none bg-stone-50"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">Business Address</label>
                                                <input
                                                    type="text"
                                                    value={profileForm.data.location}
                                                    onChange={(e) => profileForm.setData('location', e.target.value)}
                                                    className="w-full text-sm p-3 border border-[#c0c9bc] rounded-lg focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">Contact Info</label>
                                                <input
                                                    type="text"
                                                    value={profileForm.data.contact_info}
                                                    onChange={(e) => profileForm.setData('contact_info', e.target.value)}
                                                    className="w-full text-sm p-3 border border-[#c0c9bc] rounded-lg focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        <h5 className="text-base font-bold pt-4 flex items-center gap-2">
                                            <span>🔗</span> Email &amp; Social Media
                                        </h5>

                                        <div>
                                            <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">Email Address</label>
                                            <input
                                                type="email"
                                                value={profileForm.data.email}
                                                onChange={(e) => profileForm.setData('email', e.target.value)}
                                                placeholder="shop@example.com"
                                                className="w-full text-sm p-3 border border-[#c0c9bc] rounded-lg focus:outline-none bg-stone-50"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">Facebook</label>
                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                                                <div className="md:col-span-5">
                                                    <input
                                                        type="text"
                                                        value={profileForm.data.facebook}
                                                        onChange={(e) => profileForm.setData('facebook', e.target.value)}
                                                        placeholder="@username"
                                                        className="w-full text-sm p-3 border border-[#c0c9bc] rounded-lg focus:outline-none bg-stone-50"
                                                    />
                                                </div>
                                                <div className="md:col-span-7">
                                                    <input
                                                        type="url"
                                                        value={profileForm.data.facebook_url}
                                                        onChange={(e) => profileForm.setData('facebook_url', e.target.value)}
                                                        placeholder="https://www.facebook.com/..."
                                                        className="w-full text-sm p-3 border border-[#c0c9bc] rounded-lg focus:outline-none bg-stone-50"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">Instagram</label>
                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                                                <div className="md:col-span-5">
                                                    <input
                                                        type="text"
                                                        value={profileForm.data.instagram}
                                                        onChange={(e) => profileForm.setData('instagram', e.target.value)}
                                                        placeholder="@username"
                                                        className="w-full text-sm p-3 border border-[#c0c9bc] rounded-lg focus:outline-none bg-stone-50"
                                                    />
                                                </div>
                                                <div className="md:col-span-7">
                                                    <input
                                                        type="url"
                                                        value={profileForm.data.instagram_url}
                                                        onChange={(e) => profileForm.setData('instagram_url', e.target.value)}
                                                        placeholder="https://www.instagram.com/..."
                                                        className="w-full text-sm p-3 border border-[#c0c9bc] rounded-lg focus:outline-none bg-stone-50"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Branding Elements */}
                                    <div className="lg:col-span-5">
                                        <div
                                            className="p-6 rounded-2xl border transition"
                                            style={{ borderColor: lightColor, backgroundColor: paleColor }}
                                        >
                                            <h4 className="text-lg font-bold mb-3" style={{ color: primaryColor }}>Branding Elements</h4>
                                            
                                            {/* Preview Bar */}
                                            <div
                                                className="h-1.5 rounded-full mb-6"
                                                style={{ background: `linear-gradient(90deg, ${primaryColor} 50%, ${secondaryColor} 50%)` }}
                                            />

                                            {/* Logo */}
                                            <div className="mb-6">
                                                <label className="block text-[11px] font-bold text-stone-500 uppercase mb-2">Logo Image</label>
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

                                            {/* Desired Color Palette */}
                                            <div className="space-y-3">
                                                <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">Desired Color Palette</label>
                                                
                                                {/* Primary Color Row */}
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

                                                {/* Secondary Color Row */}
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

                                <div className="pt-6 border-t border-stone-200 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={profileForm.processing}
                                        style={{ backgroundColor: primaryColor }}
                                        className="text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow hover:opacity-95 transition"
                                    >
                                        Save All Changes
                                    </button>
                                </div>
                            </form>

                            {/* Danger Zone */}
                            <div className="mt-12 pt-8 border-t border-red-100">
                                <h4 className="text-red-600 font-bold text-base mb-1">Danger Zone</h4>
                                <p className="text-xs text-stone-500 mb-4">
                                    Deleting your account will permanently remove your salon profile, services, and past records.
                                </p>
                                <button
                                    type="button"
<<<<<<< HEAD
                                    onClick={() => setAccountDeleteModalOpen(true)}
                                    className="border border-red-500 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-xs font-bold transition"
                                >
                                    Delete My Entire Salon Account
                                </button>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: SERVICE CATALOG */}
                    {activeTab === 'services' && (
                        <div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                <div>
                                    <h4 className="text-lg font-bold text-stone-800">Your Service Portfolio</h4>
                                    <p className="text-xs text-stone-500">Showcase your services with descriptions, rates, and inspiration photos.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => openServiceModal()}
                                    style={{ backgroundColor: primaryColor }}
                                    className="text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow hover:opacity-95 transition"
                                >
                                    + Add New Service
                                </button>
                            </div>

                            {services.length === 0 ? (
                                <div className="text-center py-16 bg-stone-50 border-2 border-dashed border-stone-200 rounded-2xl">
                                    <h5 className="font-bold text-stone-700 mb-2">No Services Yet</h5>
                                    <button
                                        onClick={() => openServiceModal()}
                                        style={{ color: primaryColor, borderColor: primaryColor }}
                                        className="border px-4 py-2 rounded-lg text-xs font-bold hover:bg-white transition"
                                    >
                                        Add My First Service
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {services.map((svc: any) => {
                                        const photos = Array.isArray(svc.photos) ? svc.photos : (svc.photo ? [svc.photo] : []);
                                        const thumbnail = photos[0];

                                        return (
                                            <div
                                                key={svc._id || svc.id}
                                                className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
                                            >
                                                {thumbnail ? (
                                                    <img src={thumbnail} alt={svc.name} className="h-44 w-full object-cover" />
                                                ) : (
                                                    <div className="h-44 bg-stone-100 flex items-center justify-center text-stone-400 text-2xl">
                                                        🖼️
                                                    </div>
                                                )}

                                                <div className="p-5 flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex justify-between items-start gap-2 mb-2">
                                                            <span
                                                                className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-md"
                                                                style={{ backgroundColor: paleColor, color: primaryColor }}
                                                            >
                                                                {svc.category}
                                                            </span>
                                                            <span className="font-extrabold text-sm" style={{ color: primaryColor }}>
                                                                ₱{svc.rate}
                                                            </span>
                                                        </div>
                                                        <h5 className="font-bold text-base text-stone-900 mb-1">{svc.name}</h5>
                                                        <p className="text-xs text-stone-500 line-clamp-3 mb-4">{svc.description}</p>
                                                    </div>

                                                    <div className="flex gap-2 pt-3 border-t border-stone-100">
                                                        <button
                                                            type="button"
                                                            onClick={() => openServiceModal(svc)}
                                                            className="flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1"
                                                            style={{ backgroundColor: paleColor, color: primaryColor }}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setDeleteTargetService({ id: svc._id || svc.id, name: svc.name });
                                                                setDeleteModalOpen(true);
                                                            }}
                                                            className="px-3 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold transition"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB 3: BOOKING TEMPLATE */}
                    {activeTab === 'template' && (
                        <div className="text-center py-20">
                            <h3 className="text-xl font-serif font-bold text-stone-800 mb-2">Booking Template</h3>
                            <p className="text-xs text-stone-400">Currently under development for upcoming portal releases.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* SERVICE ADD/EDIT MODAL (3 Inspo Slots) */}
            {serviceModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl space-y-6">
                        <div className="flex justify-between items-center border-b pb-3">
                            <h5 className="font-bold text-lg text-stone-800">
                                {selectedService ? 'Edit Service' : 'Add New Service'}
                            </h5>
                            <button onClick={() => setServiceModalOpen(false)} className="text-stone-400 hover:text-stone-700">✕</button>
                        </div>

                        <form onSubmit={submitService} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                {/* Left Fields */}
                                <div className="md:col-span-7 space-y-3">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Service Name</label>
                                        <input
                                            type="text"
                                            value={serviceForm.data.service_name}
                                            onChange={(e) => serviceForm.setData('service_name', e.target.value)}
                                            placeholder="E.g. Balayage Transformation"
                                            className="w-full text-sm p-2.5 border border-stone-200 rounded-lg"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Category</label>
                                        <select
                                            value={serviceForm.data.category}
                                            onChange={(e) => serviceForm.setData('category', e.target.value)}
                                            className="w-full text-sm p-2.5 border border-stone-200 rounded-lg"
                                            required
                                        >
                                            <option value="" disabled>Select category</option>
                                            <option value="Hair">Hair</option>
                                            <option value="Nails">Nails</option>
                                            <option value="Skin">Skin</option>
                                            <option value="Massage">Massage</option>
                                            <option value="Others">Others</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Service Rate (₱)</label>
                                        <input
                                            type="number"
                                            value={serviceForm.data.rate}
                                            onChange={(e) => serviceForm.setData('rate', e.target.value)}
                                            placeholder="0.00"
                                            className="w-full text-sm p-2.5 border border-stone-200 rounded-lg"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Description</label>
                                        <textarea
                                            rows={3}
                                            value={serviceForm.data.description}
                                            onChange={(e) => serviceForm.setData('description', e.target.value)}
                                            placeholder="Describe treatment details..."
                                            className="w-full text-sm p-2.5 border border-stone-200 rounded-lg"
                                        />
                                    </div>
                                </div>

                                {/* Right: 3 Photo Slots */}
                                <div className="md:col-span-5 space-y-2">
                                    <label className="block text-[10px] font-bold uppercase text-stone-500">Inspiration Photos (Max 3)</label>
                                    
                                    <div className="grid grid-cols-3 gap-2">
                                        {[0, 1, 2].map((idx) => (
                                            <div
                                                key={idx}
                                                className="h-24 bg-stone-50 border-2 border-dashed border-stone-300 rounded-xl relative flex items-center justify-center overflow-hidden"
                                            >
                                                {previews[idx] ? (
                                                    <img src={previews[idx]} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-stone-400 text-lg">📷</span>
                                                )}

                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handlePhotoSelect(idx, e.target.files ? e.target.files[0] : null)}
                                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[11px] text-stone-400 leading-tight">
                                        Click a slot to upload up to 3 photos of your work or inspiration for this service.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setServiceModalOpen(false)}
                                    className="flex-1 py-2.5 rounded-lg text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200"
=======
                                    onClick={() => setModalOpen(false)}
                                    className="flex-1 rounded bg-stone-100 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-200"
>>>>>>> 33ab5ff544701f1538fbe5808b17028254537e67
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={serviceForm.processing}
<<<<<<< HEAD
                                    style={{ backgroundColor: primaryColor }}
                                    className="flex-1 py-2.5 rounded-lg text-xs font-bold text-white uppercase tracking-wider shadow hover:opacity-95"
=======
                                    className="flex-1 rounded bg-[#064E3B] py-2.5 text-xs font-bold text-white uppercase hover:bg-[#043d2e]"
>>>>>>> 33ab5ff544701f1538fbe5808b17028254537e67
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
