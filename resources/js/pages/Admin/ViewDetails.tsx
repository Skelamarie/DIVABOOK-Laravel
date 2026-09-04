import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminNavbar from '@/components/AdminNavbar';

interface Props {
    partner: any;
    booking: any;
}

export default function ViewDetail({ partner, booking }: Props) {
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);

    const updateStatus = (status: string) => {
        router.post(`/admin/bookings/${booking._id}/status`, { status });
    };

    return (
        <div className="min-h-screen bg-[#faf9f6] text-stone-800 font-sans pt-[80px]">
            <Head title={`Booking - ${booking.first_name} ${booking.last_name}`} />
            <AdminNavbar active="bookings" salonName={partner?.branding?.salon_name || partner?.shop_name} adminId={partner?.admin_id} />

            <main className="max-w-5xl mx-auto px-6 py-8">
                <Link href="/admin/bookings" className="text-xs font-bold text-[#064E3B] hover:underline mb-4 inline-block">
                    ← Back to Calendar &amp; Requests
                </Link>

                <div className="flex justify-between items-center mb-8 border-b border-stone-200 pb-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-stone-900">
                            {booking.first_name} {booking.last_name}
                        </h1>
                        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded mt-1 inline-block bg-amber-100 text-amber-800">
                            {booking.status}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => updateStatus('approved')}
                            className="bg-[#064E3B] hover:bg-[#043d2e] text-white px-5 py-2 rounded text-xs font-bold tracking-wider uppercase"
                        >
                            Approve Slot
                        </button>
                        <button
                            onClick={() => updateStatus('declined')}
                            className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded text-xs font-bold tracking-wider uppercase"
                        >
                            Decline
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Column 1: Details */}
                    <div className="space-y-6 md:col-span-1">
                        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm text-xs space-y-3">
                            <h3 className="font-bold text-stone-800 border-b pb-2 uppercase text-[10px] text-stone-400">
                                Service Details
                            </h3>
                            <div className="flex justify-between">
                                <span className="text-stone-500">Service</span>
                                <span className="font-bold text-stone-800">{booking.service_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-stone-500">Rate</span>
                                <span className="font-bold text-stone-800">₱{booking.service_price || booking.total_price}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-stone-500">Schedule</span>
                                <span className="font-bold text-emerald-800">{booking.selected_date} @ {booking.selected_time}</span>
                            </div>
                        </div>

                        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm text-xs space-y-3">
                            <h3 className="font-bold text-stone-800 border-b pb-2 uppercase text-[10px] text-stone-400">
                                Client Info
                            </h3>
                            <p><strong>Email:</strong> {booking.email}</p>
                            <p><strong>Phone:</strong> {booking.phone}</p>
                            <p className="bg-stone-50 p-2.5 rounded italic text-stone-600">
                                &quot;{booking.special_requests || 'No specific requests provided.'}&quot;
                            </p>
                        </div>
                    </div>

                    {/* Column 2: Payment Receipt Photo */}
                    <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-stone-800 border-b pb-2 uppercase text-[10px] text-stone-400 mb-3">
                                Proof of Payment
                            </h3>
                            <div className="text-xs space-y-1 mb-4">
                                <p><strong>Strategy:</strong> {booking.payment_strategy || 'Deposit'}</p>
                                <p><strong>Amount Paid:</strong> ₱{booking.amount_paid}</p>
                            </div>
                        </div>

                        <div className="w-full h-64 bg-stone-100 rounded-lg overflow-hidden border border-stone-200 flex items-center justify-center">
                            {booking.receipt_path ? (
                                <img
                                    src={booking.receipt_path}
                                    alt="Payment Receipt"
                                    onClick={() => setZoomedImage(booking.receipt_path)}
                                    className="w-full h-full object-cover cursor-zoom-in hover:opacity-90"
                                />
                            ) : (
                                <span className="text-xs text-stone-400">No receipt attached</span>
                            )}
                        </div>
                    </div>

                    {/* Column 3: Reference Image Photo */}
                    <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-stone-800 border-b pb-2 uppercase text-[10px] text-stone-400 mb-3">
                                Style Reference Photo
                            </h3>
                            <p className="text-xs text-stone-500 mb-4">Inspiration uploaded by the customer.</p>
                        </div>

                        <div className="w-full h-64 bg-stone-100 rounded-lg overflow-hidden border border-stone-200 flex items-center justify-center">
                            {booking.reference_image ? (
                                <img
                                    src={booking.reference_image}
                                    alt="Reference"
                                    onClick={() => setZoomedImage(booking.reference_image)}
                                    className="w-full h-full object-cover cursor-zoom-in hover:opacity-90"
                                />
                            ) : (
                                <span className="text-xs text-stone-400">No reference photo</span>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal for Zoomed Image */}
            {zoomedImage && (
                <div
                    onClick={() => setZoomedImage(null)}
                    className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
                >
                    <img
                        src={zoomedImage}
                        alt="Zoomed"
                        className="max-h-[90vh] max-w-[90vw] object-contain rounded border-4 border-white shadow-2xl"
                    />
                </div>
            )}
        </div>
    );
}