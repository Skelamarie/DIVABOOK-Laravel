import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

interface Props {
    partner: any;
    booking: any;
}

export default function ViewDetails({ booking }: Props) {
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

            <main className="mx-auto max-w-5xl px-6 py-8">
                <Link
                    href="/admin/bookings"
                    className="mb-4 inline-block text-xs font-bold text-[#064E3B] hover:underline"
                >
                    ← Back to Calendar &amp; Requests
                </Link>

                <div className="mb-8 flex flex-col justify-between gap-4 border-b border-stone-200 pb-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-serif text-3xl font-bold text-stone-900">
                            {booking.first_name} {booking.last_name}
                        </h1>
                        <span
                            className={`mt-1 inline-block rounded border px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${getStatusBadge(
                                booking.status,
                            )}`}
                        >
                            {booking.status || 'Pending'}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => updateStatus('approved')}
                            className="cursor-pointer rounded bg-[#064E3B] px-5 py-2.5 text-xs font-bold tracking-wider text-white uppercase transition hover:bg-[#043d2e]"
                        >
                            Approve Slot
                        </button>
                        <button
                            type="button"
                            onClick={() => updateStatus('declined')}
                            className="cursor-pointer rounded bg-red-100 px-4 py-2.5 text-xs font-bold tracking-wider text-red-700 uppercase transition hover:bg-red-200"
                        >
                            Decline
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Column 1: Details */}
                    <div className="space-y-6 md:col-span-1">
                        <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-5 text-xs shadow-sm">
                            <h3 className="border-b border-stone-100 pb-2 text-[10px] font-bold text-stone-400 uppercase">
                                Service Details
                            </h3>
                            <div className="flex justify-between">
                                <span className="text-stone-500">Service</span>
                                <span className="font-bold text-stone-800">
                                    {booking.service_name || 'Standard Service'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-stone-500">
                                    Total Rate
                                </span>
                                <span className="font-bold text-stone-800">
                                    ₱
                                    {Number(
                                        booking.total_price ||
                                            booking.service_price ||
                                            0,
                                    ).toLocaleString('en-US', {
                                        minimumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-stone-500">Schedule</span>
                                <span className="font-bold text-emerald-800">
                                    {booking.selected_date} @{' '}
                                    {booking.selected_time}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-5 text-xs shadow-sm">
                            <h3 className="border-b border-stone-100 pb-2 text-[10px] font-bold text-stone-400 uppercase">
                                Client Info
                            </h3>
                            <p>
                                <strong>Email:</strong> {booking.email}
                            </p>
                            <p>
                                <strong>Phone:</strong> {booking.phone || 'N/A'}
                            </p>
                            <div>
                                <span className="mb-1 block text-[9px] font-bold text-stone-400 uppercase">
                                    Notes / Requests
                                </span>
                                <p className="rounded border border-stone-100 bg-stone-50 p-2.5 text-stone-600 italic">
                                    &quot;
                                    {booking.special_requests ||
                                        'No specific requests provided.'}
                                    &quot;
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Payment Receipt */}
                    <div className="flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
                        <div>
                            <h3 className="mb-3 border-b border-stone-100 pb-2 text-[10px] font-bold text-stone-400 uppercase">
                                Proof of Payment
                            </h3>
                            <div className="mb-4 space-y-1 text-xs">
                                <p>
                                    <strong>Strategy:</strong>{' '}
                                    {booking.payment_strategy || 'Deposit'}
                                </p>
                                <p>
                                    <strong>Amount Paid:</strong> ₱
                                    {Number(
                                        booking.amount_paid || 0,
                                    ).toLocaleString('en-US', {
                                        minimumFractionDigits: 2,
                                    })}
                                </p>
                                {booking.payment_method && (
                                    <p>
                                        <strong>Method:</strong>{' '}
                                        {booking.payment_method.toUpperCase()}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex h-64 w-full items-center justify-center overflow-hidden rounded-lg border border-stone-200 bg-stone-50">
                            {booking.receipt_path ? (
                                <img
                                    src={receiptUrl}
                                    alt="Payment Receipt"
                                    onClick={() => setZoomedImage(receiptUrl)}
                                    className="h-full w-full cursor-zoom-in object-cover hover:opacity-90"
                                />
                            ) : (
                                <span className="text-xs text-stone-400">
                                    No receipt attached
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Column 3: Style Reference */}
                    <div className="flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
                        <div>
                            <h3 className="mb-3 border-b border-stone-100 pb-2 text-[10px] font-bold text-stone-400 uppercase">
                                Style Reference Photo
                            </h3>
                            <p className="mb-4 text-xs text-stone-500">
                                Customer-provided reference image.
                            </p>
                        </div>

                        <div className="flex h-64 w-full items-center justify-center overflow-hidden rounded-lg border border-stone-200 bg-stone-50">
                            {booking.reference_image ? (
                                <img
                                    src={booking.reference_image}
                                    alt="Reference"
                                    onClick={() =>
                                        setZoomedImage(booking.reference_image)
                                    }
                                    className="h-full w-full cursor-zoom-in object-cover transition hover:opacity-90"
                                />
                            ) : (
                                <span className="text-xs text-stone-400">
                                    No reference photo
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal for Zoomed Image */}
            {zoomedImage && (
                <div
                    onClick={() => setZoomedImage(null)}
                    className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
                >
                    <img
                        src={zoomedImage}
                        alt="Zoomed"
                        className="max-h-[90vh] max-w-[90vw] rounded border-4 border-white object-contain shadow-2xl"
                    />
                </div>
            )}
        </div>
    );
}
