import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function BookingSuccess({ booking }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#FDF8F7] p-6 text-stone-800">
            <Head title="Booking Submitted" />

            <div className="w-full max-w-md space-y-4 rounded-3xl border border-stone-200/70 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-800">
                    ✓
                </div>

                <h1 className="text-2xl font-black text-stone-900">
                    Booking Request Sent!
                </h1>
                <p className="text-xs leading-relaxed text-stone-600">
                    Thank you,{' '}
                    <strong className="text-stone-800">
                        {booking.first_name}
                    </strong>
                    . Your request for{' '}
                    <strong className="text-stone-800">
                        {booking.service_name}
                    </strong>{' '}
                    on{' '}
                    <strong className="text-stone-800">
                        {booking.selected_date} at {booking.selected_time}
                    </strong>{' '}
                    has been submitted.
                </p>

                <div className="space-y-1 rounded-2xl border border-stone-100 bg-stone-50 p-4 text-left text-xs">
                    <div className="flex justify-between">
                        <span className="text-stone-500">Booking Status:</span>
                        <span className="font-bold text-amber-600 uppercase">
                            {booking.status}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-stone-500">Total Amount:</span>
                        <span className="font-bold text-stone-800">
                            ₱{booking.total_price}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-stone-500">
                            Registered Email:
                        </span>
                        <span className="font-bold text-stone-800">
                            {booking.email}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                    <Link
                        href="/services"
                        className="w-full rounded-xl bg-emerald-800 py-3 text-xs font-bold text-white transition hover:bg-emerald-900"
                    >
                        Browse Other Services
                    </Link>
                    <Link
                        href="/"
                        className="py-1 text-xs font-semibold text-stone-500 hover:text-stone-800"
                    >
                        Back to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}
