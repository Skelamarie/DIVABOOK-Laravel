import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminNavbar from '@/components/AdminNavbar';

interface Props {
    partner: any;
    appointments: Record<string, any[]>;
    pendingRequests: any[];
}

export default function Bookings({
    partner,
    appointments = {},
    pendingRequests = [],
}: Props) {
    const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
    const [selectedAppt, setSelectedAppt] = useState<any | null>(null);

    const updateStatus = (id: string, newStatus: string) => {
        router.post(`/admin/bookings/${id}/status`, { status: newStatus });
    };

    return (
        <div className="min-h-screen bg-[#faf9f6] pt-[80px] font-sans text-stone-800">
            <Head title="Bookings & Appointments - Admin" />
            <AdminNavbar
                active="bookings"
                salonName={partner?.branding?.salon_name || partner?.shop_name}
                adminId={partner?.admin_id}
            />

            <main className="mx-auto max-w-7xl space-y-8 px-6 py-8">
                <div className="flex flex-col justify-between gap-4 border-b border-stone-200 pb-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="font-serif text-3xl font-bold text-stone-900">
                            Booking &amp; Appointment
                        </h1>
                        <p className="text-xs text-stone-500">
                            Manage your appointment calendar and customer
                            inquiries.
                        </p>
                    </div>
                    <div className="flex rounded-lg bg-stone-200 p-1">
                        <button
                            onClick={() => setViewMode('week')}
                            className={`rounded px-4 py-1 text-xs font-bold ${viewMode === 'week' ? 'bg-white text-stone-900 shadow' : 'text-stone-600'}`}
                        >
                            Week View
                        </button>
                        <button
                            onClick={() => setViewMode('month')}
                            className={`rounded px-4 py-1 text-xs font-bold ${viewMode === 'month' ? 'bg-white text-stone-900 shadow' : 'text-stone-600'}`}
                        >
                            Month View
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Calendar Area */}
                    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm lg:col-span-8">
                        <h2 className="mb-4 text-sm font-bold tracking-wider text-[#064E3B] uppercase">
                            Active Schedule ({viewMode.toUpperCase()})
                        </h2>

                        <div className="grid min-h-[350px] grid-cols-7 gap-2 rounded-lg border border-stone-200 bg-stone-50 p-3">
                            {[
                                'Mon',
                                'Tue',
                                'Wed',
                                'Thu',
                                'Fri',
                                'Sat',
                                'Sun',
                            ].map((day) => (
                                <div
                                    key={day}
                                    className="py-1 text-center text-xs font-bold text-stone-400"
                                >
                                    {day}
                                </div>
                            ))}

                            {/* Calendar Days Simulation */}
                            {Array.from({ length: 14 }).map((_, i) => {
                                const dayNum = i + 1;
                                return (
                                    <div
                                        key={i}
                                        className="flex min-h-[70px] flex-col justify-between rounded border border-stone-100 bg-white p-1.5"
                                    >
                                        <span className="text-[10px] font-bold text-stone-400">
                                            {dayNum}
                                        </span>
                                        {i === 2 && (
                                            <div
                                                onClick={() =>
                                                    setSelectedAppt({
                                                        name: 'Maria Santos',
                                                        email: 'maria@example.com',
                                                        title: 'Gel Nails',
                                                        date: 'September 3, 2026',
                                                        time: '10:00 AM',
                                                        method: 'GCASH',
                                                        paid: '1,200.00',
                                                        request:
                                                            'Please be gentle on cuticles',
                                                    })
                                                }
                                                className="cursor-pointer truncate rounded bg-emerald-100 p-1 text-[9px] font-bold text-emerald-800"
                                            >
                                                Maria: Gel Nails
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Client Information Inspector Card */}
                    <aside className="flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-6 shadow-sm lg:col-span-4">
                        <div>
                            <h3 className="mb-4 border-b border-stone-100 pb-2 text-xs font-bold tracking-wider text-stone-400 uppercase">
                                Client Details
                            </h3>

                            {selectedAppt ? (
                                <div className="space-y-4 text-xs">
                                    <div>
                                        <span className="text-[9px] font-bold text-stone-400 uppercase">
                                            Customer
                                        </span>
                                        <p className="text-sm font-bold text-stone-800">
                                            {selectedAppt.name}
                                        </p>
                                        <p className="text-stone-500">
                                            {selectedAppt.email}
                                        </p>
                                    </div>
                                    <hr className="border-stone-100" />
                                    <div>
                                        <span className="text-[9px] font-bold text-stone-400 uppercase">
                                            Schedule
                                        </span>
                                        <p className="font-bold text-stone-800">
                                            {selectedAppt.title}
                                        </p>
                                        <p className="text-stone-600">
                                            {selectedAppt.date} @{' '}
                                            {selectedAppt.time}
                                        </p>
                                    </div>
                                    <hr className="border-stone-100" />
                                    <div>
                                        <span className="text-[9px] font-bold text-stone-400 uppercase">
                                            Payment &amp; Strategy
                                        </span>
                                        <p className="font-semibold text-stone-700">
                                            {selectedAppt.method} (₱
                                            {selectedAppt.paid})
                                        </p>
                                        <p className="mt-1 rounded bg-stone-50 p-2 text-stone-500 italic">
                                            &quot;
                                            {selectedAppt.request || 'None'}
                                            &quot;
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-16 text-center text-xs text-stone-400">
                                    Click any slot on the calendar to view full
                                    customer details.
                                </div>
                            )}
                        </div>
                    </aside>
                </div>

                {/* Table of Inquiries */}
                <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-stone-200 p-4">
                        <h3 className="text-xs font-bold tracking-wider text-stone-800 uppercase">
                            Recent Service Inquiries ({pendingRequests.length})
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-stone-200 bg-stone-50 text-[10px] font-bold text-stone-400 uppercase">
                                <tr>
                                    <th className="p-3">Customer</th>
                                    <th className="p-3">Service</th>
                                    <th className="p-3">Requested Date</th>
                                    <th className="p-3">Amount</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {pendingRequests.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="p-6 text-center text-stone-400"
                                        >
                                            No inquiries pending approval.
                                        </td>
                                    </tr>
                                ) : (
                                    pendingRequests.map((req) => (
                                        <tr
                                            key={req._id}
                                            className="hover:bg-stone-50"
                                        >
                                            <td className="p-3 font-bold text-stone-800">
                                                {req.first_name} {req.last_name}
                                                <span className="block text-[10px] font-normal text-stone-400">
                                                    {req.email}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                {req.service_name}
                                            </td>
                                            <td className="p-3 text-stone-500">
                                                {req.selected_date} •{' '}
                                                {req.selected_time}
                                            </td>
                                            <td className="p-3 font-bold">
                                                ₱{req.amount_paid}
                                            </td>
                                            <td className="p-3">
                                                <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase">
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="space-x-2 p-3 text-right">
                                                <button
                                                    onClick={() =>
                                                        updateStatus(
                                                            req._id,
                                                            'approved',
                                                        )
                                                    }
                                                    className="rounded bg-[#064E3B] px-3 py-1 text-[10px] font-bold text-white hover:bg-[#043d2e]"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        updateStatus(
                                                            req._id,
                                                            'declined',
                                                        )
                                                    }
                                                    className="rounded bg-red-100 px-3 py-1 text-[10px] font-bold text-red-700 hover:bg-red-200"
                                                >
                                                    Decline
                                                </button>
                                                <Link
                                                    href={`/admin/bookings/${req._id}`}
                                                    className="px-2 py-1 text-[10px] font-bold text-stone-500 underline hover:text-stone-800"
                                                >
                                                    Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
