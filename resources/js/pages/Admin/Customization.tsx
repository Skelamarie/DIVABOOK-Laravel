import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminNavbar from '@/components/AdminNavbar';

interface CustomizationProps {
    partner: any;
    services: any[];
}

export default function Customization({ partner, services = [] }: CustomizationProps) {
    const [activeTab, setActiveTab] = useState<'profile' | 'services'>('profile');
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
        <div className="min-h-screen bg-[#faf9f6] text-stone-800 font-sans pt-[80px]">
            <Head title="Customization - Admin Portal" />
            <AdminNavbar active="customization" adminId={partner?.admin_id} />

            <main className="max-w-6xl mx-auto p-6 md:p-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-serif font-bold text-[#064E3B]">Customization</h1>
                    <p className="text-xs text-stone-500">Personalize your booking portal and maintain your treatments catalog.</p>
                </div>

                {/* Tab Switcher Buttons */}
                <div className="flex gap-2 border-b border-stone-200 pb-3 mb-6">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded ${
                            activeTab === 'profile' ? 'bg-[#064E3B] text-white' : 'bg-white border border-stone-200 text-stone-600'
                        }`}
                    >
                        Salon Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('services')}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded ${
                            activeTab === 'services' ? 'bg-[#064E3B] text-white' : 'bg-white border border-stone-200 text-stone-600'
                        }`}
                    >
                        Service Catalog ({services.length})
                    </button>
                </div>

                {/* Tab 1: Profile Customization */}
                {activeTab === 'profile' && (
                    <form onSubmit={submitProfile} className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="font-bold text-sm uppercase tracking-wider text-stone-700">Business Details</h3>
                                <div>
                                    <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Salon Name</label>
                                    <input
                                        type="text"
                                        value={profileForm.data.salon_name}
                                        onChange={(e) => profileForm.setData('salon_name', e.target.value)}
                                        className="w-full text-sm p-2.5 border border-stone-200 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Description</label>
                                    <textarea
                                        rows={3}
                                        value={profileForm.data.description}
                                        onChange={(e) => profileForm.setData('description', e.target.value)}
                                        className="w-full text-sm p-2.5 border border-stone-200 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Address</label>
                                    <input
                                        type="text"
                                        value={profileForm.data.location}
                                        onChange={(e) => profileForm.setData('location', e.target.value)}
                                        className="w-full text-sm p-2.5 border border-stone-200 rounded"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-sm uppercase tracking-wider text-stone-700">Brand Colors</h3>
                                <div>
                                    <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Primary Color</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={profileForm.data.color_primary}
                                            onChange={(e) => profileForm.setData('color_primary', e.target.value)}
                                            className="w-12 h-10 border-0 cursor-pointer rounded"
                                        />
                                        <input
                                            type="text"
                                            value={profileForm.data.color_primary}
                                            onChange={(e) => profileForm.setData('color_primary', e.target.value)}
                                            className="text-sm p-2 border border-stone-200 rounded font-mono w-28"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Secondary Color</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={profileForm.data.color_secondary}
                                            onChange={(e) => profileForm.setData('color_secondary', e.target.value)}
                                            className="w-12 h-10 border-0 cursor-pointer rounded"
                                        />
                                        <input
                                            type="text"
                                            value={profileForm.data.color_secondary}
                                            onChange={(e) => profileForm.setData('color_secondary', e.target.value)}
                                            className="text-sm p-2 border border-stone-200 rounded font-mono w-28"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-stone-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={profileForm.processing}
                                className="bg-[#064E3B] hover:bg-[#043d2e] text-white px-8 py-3 text-xs font-bold tracking-wider uppercase rounded"
                            >
                                {profileForm.processing ? 'Saving...' : 'Save All Changes'}
                            </button>
                        </div>
                    </form>
                )}

                {/* Tab 2: Service Catalog */}
                {activeTab === 'services' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <p className="text-xs text-stone-500">Add or modify services available for customer booking.</p>
                            <button
                                onClick={() => openServiceModal()}
                                className="bg-[#064E3B] hover:bg-[#043d2e] text-white px-4 py-2 text-xs font-bold tracking-wider uppercase rounded"
                            >
                                + Add New Service
                            </button>
                        </div>

                        {services.length === 0 ? (
                            <div className="bg-white border border-stone-200 rounded-xl p-12 text-center text-stone-400 text-sm">
                                No services found. Click &quot;+ Add New Service&quot; to begin.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {services.map((svc: any) => (
                                    <div key={svc._id || svc.id} className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded font-bold uppercase text-stone-600">
                                                    {svc.category}
                                                </span>
                                                <span className="text-sm font-bold text-[#064E3B]">₱{svc.rate}</span>
                                            </div>
                                            <h4 className="font-bold text-stone-800 text-base mb-1">{svc.name}</h4>
                                            <p className="text-xs text-stone-500 line-clamp-2">{svc.description}</p>
                                        </div>

                                        <div className="flex gap-2 pt-4 mt-4 border-t border-stone-100">
                                            <button
                                                onClick={() => openServiceModal(svc)}
                                                className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 py-1.5 rounded text-xs font-bold"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteService(svc._id || svc.id)}
                                                className="px-3 bg-red-50 hover:bg-red-100 text-red-600 py-1.5 rounded text-xs font-bold"
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
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                            <h3 className="font-bold text-stone-800 text-sm">
                                {editingService ? 'Edit Service' : 'Add New Service'}
                            </h3>
                            <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-stone-700">✕</button>
                        </div>

                        <form onSubmit={submitService} className="space-y-3">
                            <div>
                                <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Service Name</label>
                                <input
                                    type="text"
                                    value={serviceForm.data.service_name}
                                    onChange={(e) => serviceForm.setData('service_name', e.target.value)}
                                    placeholder="e.g., Soft BIAB Overlay"
                                    className="w-full text-sm p-2 border border-stone-200 rounded"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Category</label>
                                <select
                                    value={serviceForm.data.category}
                                    onChange={(e) => serviceForm.setData('category', e.target.value)}
                                    className="w-full text-sm p-2 border border-stone-200 rounded"
                                >
                                    <option value="Hair">Hair</option>
                                    <option value="Nails">Nails</option>
                                    <option value="Skin">Skin</option>
                                    <option value="Massage">Massage</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Rate (₱)</label>
                                <input
                                    type="text"
                                    value={serviceForm.data.rate}
                                    onChange={(e) => serviceForm.setData('rate', e.target.value)}
                                    placeholder="1200"
                                    className="w-full text-sm p-2 border border-stone-200 rounded"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    value={serviceForm.data.description}
                                    onChange={(e) => serviceForm.setData('description', e.target.value)}
                                    placeholder="Describe treatment details..."
                                    className="w-full text-sm p-2 border border-stone-200 rounded"
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="flex-1 bg-stone-100 hover:bg-stone-200 py-2.5 rounded text-xs font-bold text-stone-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={serviceForm.processing}
                                    className="flex-1 bg-[#064E3B] hover:bg-[#043d2e] py-2.5 rounded text-xs font-bold text-white uppercase"
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