import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function BookingSuccess({ booking }) {
    return (
        <div className="min-h-screen bg-[#FDF8F7] flex items-center justify-center p-6 text-stone-800">
            <Head title="Booking Submitted" />

            <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-stone-200/70 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                    ✓
                </div>

                <h1 className="text-2xl font-black text-stone-900">Booking Request Sent!</h1>
                <p className="text-xs text-stone-600 leading-relaxed">
                    Thank you, <strong className="text-stone-800">{booking.first_name}</strong>. Your request for <strong className="text-stone-800">{booking.service_name}</strong> on <strong className="text-stone-800">{booking.selected_date} at {booking.selected_time}</strong> has been submitted.
                </p>

                <div className="bg-stone-50 p-4 rounded-2xl text-xs space-y-1 text-left border border-stone-100">
                    <div className="flex justify-between"><span className="text-stone-500">Booking Status:</span><span className="font-bold text-amber-600 uppercase">{booking.status}</span></div>
                    <div className="flex justify-between"><span className="text-stone-500">Total Amount:</span><span className="font-bold text-stone-800">₱{booking.total_price}</span></div>
                    <div className="flex justify-between"><span className="text-stone-500">Registered Email:</span><span className="font-bold text-stone-800">{booking.email}</span></div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                    <Link
                        href="/services"
                        className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition"
                    >
                        Browse Other Services
                    </Link>
                    <Link
                        href="/"
                        className="text-xs font-semibold text-stone-500 hover:text-stone-800 py-1"
                    >
                        Back to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}