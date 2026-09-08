import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';

interface CustomizationProps {
    partner: any;
    services: any[];
}

export default function Customization({
    partner,
    services = [],
}: CustomizationProps) {
    const [activeTab, setActiveTab] = useState<'profile' | 'services'>(
        'profile',
    );
    const [modalOpen, setModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<any>(null);

    const branding = partner?.branding || {};

    // 1. Profile Form
    const profileForm = useForm({
        salon_name: branding.salon_name || partner?.shop_name || '',
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
    });

    const submitProfile = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.post('/admin/profile');
    };

    // 2. Service Form
    const serviceForm = useForm({
        service_id: '',
        service_name: '',
        category: 'Hair',
        rate: '',
        description: '',
    });

    const openServiceModal = (svc: any = null) => {
        if (svc) {
            setEditingService(svc);
            serviceForm.setData({
                service_id: svc._id || svc.id,
                service_name: svc.name,
                category: svc.category,
                rate: svc.rate,
                description: svc.description || '',
            });
        } else {
            setEditingService(null);
            serviceForm.reset();
        }
        setModalOpen(true);
    };

    const submitService = (e: React.FormEvent) => {
        e.preventDefault();
        serviceForm.post('/admin/services', {
            onSuccess: () => {
                setModalOpen(false);
                serviceForm.reset();
            },
        });
    };

    const deleteService = (id: string) => {
        if (confirm('Delete this service permanently?')) {
            router.delete(`/admin/services/${id}`);
        }
    };

    return (
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

                            <div className="flex gap-2 pt-2">
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
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
