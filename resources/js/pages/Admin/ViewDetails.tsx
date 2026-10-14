import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

interface Props {
    partner: any;
    booking: any;
}

export default function ViewDetails({ partner, booking }: Props) {
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);

    const bookingId = (booking._id || booking.id)?.toString();

    const updateStatus = (status: string) => {
        router.post(`/admin/bookings/${bookingId}/status`, { status });
    };

    const getStatusBadge = (status: string) => {
        const s = (status || 'pending').toLowerCase();
        if (s === 'approved' || s === 'accepted') {
            return 'bg-emerald-100 text-emerald-800 border-emerald-300';
        }
        if (s === 'declined' || s === 'cancelled') {
            return 'bg-red-100 text-red-700 border-red-300';
        }
        return 'bg-amber-100 text-amber-800 border-amber-300';
    };

    const receiptUrl =
        booking.receipt_path &&
        (/^https?:\/\//.test(booking.receipt_path)
            ? booking.receipt_path
            : '/storage/' + booking.receipt_path);

    return (
        <div className="min-h-full bg-[#faf9f6] font-sans text-stone-800">
            <Head
                title={`Booking - ${booking.first_name} ${booking.last_name}`}
            />

            <main className="max-w-5xl mx-auto px-6 py-8">
                <Link
                    href="/admin/bookings"
                    className="text-xs font-bold text-[#064E3B] hover:underline mb-4 inline-block"
                >
                    ← Back to Calendar &amp; Requests
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-stone-200 pb-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-stone-900">
                            {booking.first_name} {booking.last_name}
                        </h1>
                        <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded mt-1 inline-block border ${getStatusBadge(
                                booking.status
                            )}`}
                        >
                            {booking.status || 'Pending'}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => updateStatus('approved')}
                            className="bg-[#064E3B] hover:bg-[#043d2e] text-white px-5 py-2.5 rounded text-xs font-bold tracking-wider uppercase transition cursor-pointer"
                        >
                            Approve Slot
                        </button>
                        <button
                            type="button"
                            onClick={() => updateStatus('declined')}
                            className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2.5 rounded text-xs font-bold tracking-wider uppercase transition cursor-pointer"
                        >
                            Decline
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Column 1: Details */}
                    <div className="space-y-6 md:col-span-1">
                        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm text-xs space-y-3">
                            <h3 className="font-bold border-b border-stone-100 pb-2 uppercase text-[10px] text-stone-400">
                                Service Details
                            </h3>
                            <div className="flex justify-between">
                                <span className="text-stone-500">Service</span>
                                <span className="font-bold text-stone-800">{booking.service_name || 'Standard Service'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-stone-500">Total Rate</span>
                                <span className="font-bold text-stone-800">
                                    ₱{Number(booking.total_price || booking.service_price || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-stone-500">Schedule</span>
                                <span className="font-bold text-emerald-800">
                                    {booking.selected_date} @ {booking.selected_time}
                                </span>
                            </div>
                        </div>

                        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm text-xs space-y-3">
                            <h3 className="font-bold border-b border-stone-100 pb-2 uppercase text-[10px] text-stone-400">
                                Client Info
                            </h3>
                            <p><strong>Email:</strong> {booking.email}</p>
                            <p><strong>Phone:</strong> {booking.phone || 'N/A'}</p>
                            <div>
                                <span className="text-stone-400 font-bold uppercase text-[9px] block mb-1">Notes / Requests</span>
                                <p className="bg-stone-50 p-2.5 rounded italic text-stone-600 border border-stone-100">
                                    &quot;{booking.special_requests || 'No specific requests provided.'}&quot;
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Payment Receipt */}
                    <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold border-b border-stone-100 pb-2 uppercase text-[10px] text-stone-400 mb-3">
                                Proof of Payment
                            </h3>
                            <div className="text-xs space-y-1 mb-4">
                                <p><strong>Strategy:</strong> {booking.payment_strategy || 'Deposit'}</p>
                                <p>
                                    <strong>Amount Paid:</strong> ₱{Number(booking.amount_paid || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </p>
                                {booking.payment_method && (
                                    <p><strong>Method:</strong> {booking.payment_method.toUpperCase()}</p>
                                )}
                            </div>
                        </div>

                        <div className="w-full h-64 bg-stone-50 rounded-lg overflow-hidden border border-stone-200 flex items-center justify-center">
                            {booking.receipt_path ? (
                                <img
                                    src={receiptUrl}
                                    alt="Payment Receipt"
                                    onClick={() => setZoomedImage(receiptUrl)}
                                    className="h-full w-full cursor-zoom-in object-cover hover:opacity-90"
                                />
                            ) : (
                                <span className="text-xs text-stone-400">No receipt attached</span>
                            )}
                        </div>
                    </div>

                    {/* Column 3: Style Reference */}
                    <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold border-b border-stone-100 pb-2 uppercase text-[10px] text-stone-400 mb-3">
                                Style Reference Photo
                            </h3>
                            <p className="text-xs text-stone-500 mb-4">Customer-provided reference image.</p>
                        </div>

                        <div className="w-full h-64 bg-stone-50 rounded-lg overflow-hidden border border-stone-200 flex items-center justify-center">
                            {booking.reference_image ? (
                                <img
                                    src={booking.reference_image}
                                    alt="Reference"
                                    onClick={() => setZoomedImage(booking.reference_image)}
                                    className="w-full h-full object-cover cursor-zoom-in hover:opacity-90 transition"
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