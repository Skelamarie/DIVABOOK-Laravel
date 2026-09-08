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
<<<<<<< HEAD
        <div className="min-h-screen bg-[#faf9f6] pt-[80px] font-sans text-stone-800">
            <Head
                title={`Booking - ${booking.first_name} ${booking.last_name}`}
            />
            <AdminNavbar
                active="bookings"
                salonName={partner?.branding?.salon_name || partner?.shop_name}
                adminId={partner?.admin_id}
            />
=======
        <div className="min-h-screen bg-[#faf9f6] text-stone-800 font-sans pt-[80px]">
            <Head title={`Booking - ${booking.first_name} ${booking.last_name}`} />
            <AdminNavbar active="bookings" adminId={partner?.admin_id} />
>>>>>>> cd3009760716be2bcbf08c7fd8ffea22f330cb8d

            <main className="mx-auto max-w-5xl px-6 py-8">
                <Link
                    href="/admin/bookings"
                    className="mb-4 inline-block text-xs font-bold text-[#064E3B] hover:underline"
                >
                    ← Back to Calendar &amp; Requests
                </Link>

                <div className="mb-8 flex items-center justify-between border-b border-stone-200 pb-4">
                    <div>
                        <h1 className="font-serif text-3xl font-bold text-stone-900">
                            {booking.first_name} {booking.last_name}
                        </h1>
                        <span className="mt-1 inline-block rounded bg-amber-100 px-2.5 py-0.5 text-xs font-bold tracking-wider text-amber-800 uppercase">
                            {booking.status}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => updateStatus('approved')}
                            className="rounded bg-[#064E3B] px-5 py-2 text-xs font-bold tracking-wider text-white uppercase hover:bg-[#043d2e]"
                        >
                            Approve Slot
                        </button>
                        <button
                            onClick={() => updateStatus('declined')}
                            className="rounded bg-red-100 px-4 py-2 text-xs font-bold tracking-wider text-red-700 uppercase hover:bg-red-200"
                        >
                            Decline
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Column 1: Details */}
                    <div className="space-y-6 md:col-span-1">
                        <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-5 text-xs shadow-sm">
                            <h3 className="border-b pb-2 text-[10px] font-bold text-stone-400 text-stone-800 uppercase">
                                Service Details
                            </h3>
                            <div className="flex justify-between">
                                <span className="text-stone-500">Service</span>
                                <span className="font-bold text-stone-800">
                                    {booking.service_name}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-stone-500">Rate</span>
                                <span className="font-bold text-stone-800">
                                    ₱
                                    {booking.service_price ||
                                        booking.total_price}
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
                            <h3 className="border-b pb-2 text-[10px] font-bold text-stone-400 text-stone-800 uppercase">
                                Client Info
                            </h3>
                            <p>
                                <strong>Email:</strong> {booking.email}
                            </p>
                            <p>
                                <strong>Phone:</strong> {booking.phone}
                            </p>
                            <p className="rounded bg-stone-50 p-2.5 text-stone-600 italic">
                                &quot;
                                {booking.special_requests ||
                                    'No specific requests provided.'}
                                &quot;
                            </p>
                        </div>
                    </div>

                    {/* Column 2: Payment Receipt Photo */}
                    <div className="flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
                        <div>
                            <h3 className="mb-3 border-b pb-2 text-[10px] font-bold text-stone-400 text-stone-800 uppercase">
                                Proof of Payment
                            </h3>
                            <div className="mb-4 space-y-1 text-xs">
                                <p>
                                    <strong>Strategy:</strong>{' '}
                                    {booking.payment_strategy || 'Deposit'}
                                </p>
                                <p>
                                    <strong>Amount Paid:</strong> ₱
                                    {booking.amount_paid}
                                </p>
                            </div>
                        </div>

                        <div className="flex h-64 w-full items-center justify-center overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
                            {booking.receipt_path ? (
                                <img
                                    src={booking.receipt_path}
                                    alt="Payment Receipt"
                                    onClick={() =>
                                        setZoomedImage(booking.receipt_path)
                                    }
                                    className="h-full w-full cursor-zoom-in object-cover hover:opacity-90"
                                />
                            ) : (
                                <span className="text-xs text-stone-400">
                                    No receipt attached
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Column 3: Reference Image Photo */}
                    <div className="flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
                        <div>
                            <h3 className="mb-3 border-b pb-2 text-[10px] font-bold text-stone-400 text-stone-800 uppercase">
                                Style Reference Photo
                            </h3>
                            <p className="mb-4 text-xs text-stone-500">
                                Inspiration uploaded by the customer.
                            </p>
                        </div>

                        <div className="flex h-64 w-full items-center justify-center overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
                            {booking.reference_image ? (
                                <img
                                    src={booking.reference_image}
                                    alt="Reference"
                                    onClick={() =>
                                        setZoomedImage(booking.reference_image)
                                    }
                                    className="h-full w-full cursor-zoom-in object-cover hover:opacity-90"
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
