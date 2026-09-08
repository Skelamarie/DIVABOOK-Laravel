import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminNavbar from '@/components/AdminNavbar';

interface Props {
    partner: any;
    appointments: Record<string, any[]>;
    pendingRequests: any[];
}

export default function Bookings({ partner, appointments = {}, pendingRequests = [] }: Props) {
    const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
    const [selectedAppt, setSelectedAppt] = useState<any | null>(null);

    const updateStatus = (id: string, newStatus: string) => {
        router.post(`/admin/bookings/${id}/status`, { status: newStatus });
    };

    return (
        <div className="min-h-screen bg-[#faf9f6] text-stone-800 font-sans pt-[80px]">
            <Head title="Bookings & Appointments - Admin" />
            <AdminNavbar active="bookings" adminId={partner?.admin_id} />

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-stone-900">Booking &amp; Appointment</h1>
                        <p className="text-xs text-stone-500">Manage your appointment calendar and customer inquiries.</p>
                    </div>
                    <div className="flex bg-stone-200 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('week')}
                            className={`px-4 py-1 text-xs font-bold rounded ${viewMode === 'week' ? 'bg-white shadow text-stone-900' : 'text-stone-600'}`}
                        >
                            Week View
                        </button>
                        <button
                            onClick={() => setViewMode('month')}
                            className={`px-4 py-1 text-xs font-bold rounded ${viewMode === 'month' ? 'bg-white shadow text-stone-900' : 'text-stone-600'}`}
                        >
                            Month View
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Calendar Area */}
                    <div className="lg:col-span-8 bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-[#064E3B] mb-4">
                            Active Schedule ({viewMode.toUpperCase()})
                        </h2>

                        <div className="grid grid-cols-7 gap-2 border border-stone-200 rounded-lg p-3 bg-stone-50 min-h-[350px]">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                <div key={day} className="text-center font-bold text-xs text-stone-400 py-1">
                                    {day}
                                </div>
                            ))}

                            {/* Calendar Days Simulation */}
                            {Array.from({ length: 14 }).map((_, i) => {
                                const dayNum = i + 1;
                                return (
                                    <div key={i} className="bg-white border border-stone-100 rounded min-h-[70px] p-1.5 flex flex-col justify-between">
                                        <span className="text-[10px] font-bold text-stone-400">{dayNum}</span>
                                        {i === 2 && (
                                            <div
                                                onClick={() => setSelectedAppt({
                                                    name: 'Maria Santos',
                                                    email: 'maria@example.com',
                                                    title: 'Gel Nails',
                                                    date: 'September 3, 2026',
                                                    time: '10:00 AM',
                                                    method: 'GCASH',
                                                    paid: '1,200.00',
                                                    request: 'Please be gentle on cuticles',
                                                })}
                                                className="bg-emerald-100 text-emerald-800 text-[9px] font-bold p-1 rounded cursor-pointer truncate"
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
                    <aside className="lg:col-span-4 bg-white border border-stone-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-400 border-b border-stone-100 pb-2 mb-4">
                                Client Details
                            </h3>

                            {selectedAppt ? (
                                <div className="space-y-4 text-xs">
                                    <div>
                                        <span className="text-stone-400 font-bold uppercase text-[9px]">Customer</span>
                                        <p className="font-bold text-sm text-stone-800">{selectedAppt.name}</p>
                                        <p className="text-stone-500">{selectedAppt.email}</p>
                                    </div>
                                    <hr className="border-stone-100" />
                                    <div>
                                        <span className="text-stone-400 font-bold uppercase text-[9px]">Schedule</span>
                                        <p className="font-bold text-stone-800">{selectedAppt.title}</p>
                                        <p className="text-stone-600">{selectedAppt.date} @ {selectedAppt.time}</p>
                                    </div>
                                    <hr className="border-stone-100" />
                                    <div>
                                        <span className="text-stone-400 font-bold uppercase text-[9px]">Payment &amp; Strategy</span>
                                        <p className="text-stone-700 font-semibold">{selectedAppt.method} (₱{selectedAppt.paid})</p>
                                        <p className="italic text-stone-500 mt-1 bg-stone-50 p-2 rounded">
                                            &quot;{selectedAppt.request || 'None'}&quot;
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-16 text-stone-400 text-xs">
                                    Click any slot on the calendar to view full customer details.
                                </div>
                            )}
                        </div>
                    </aside>
                </div>

                {/* Table of Inquiries */}
                <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-stone-200 flex justify-between items-center">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-stone-800">
                            Recent Service Inquiries ({pendingRequests.length})
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-stone-50 border-b border-stone-200 text-stone-400 uppercase font-bold text-[10px]">
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
                                        <td colSpan={6} className="p-6 text-center text-stone-400">
                                            No inquiries pending approval.
                                        </td>
                                    </tr>
                                ) : (
                                    pendingRequests.map(req => (
                                        <tr key={req._id} className="hover:bg-stone-50">
                                            <td className="p-3 font-bold text-stone-800">
                                                {req.first_name} {req.last_name}
                                                <span className="block font-normal text-stone-400 text-[10px]">{req.email}</span>
                                            </td>
                                            <td className="p-3">{req.service_name}</td>
                                            <td className="p-3 text-stone-500">{req.selected_date} • {req.selected_time}</td>
                                            <td className="p-3 font-bold">₱{req.amount_paid}</td>
                                            <td className="p-3">
                                                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="p-3 text-right space-x-2">
                                                <button
                                                    onClick={() => updateStatus(req._id, 'approved')}
                                                    className="px-3 py-1 bg-[#064E3B] hover:bg-[#043d2e] text-white rounded font-bold text-[10px]"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(req._id, 'declined')}
                                                    className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded font-bold text-[10px]"
                                                >
                                                    Decline
                                                </button>
                                                <Link
                                                    href={`/admin/bookings/${req._id}`}
                                                    className="px-2 py-1 text-stone-500 hover:text-stone-800 font-bold underline text-[10px]"
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