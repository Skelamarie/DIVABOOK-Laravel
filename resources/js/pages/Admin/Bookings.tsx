import React, { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminNavbar from '@/components/AdminNavbar';

interface Appointment {
    id: string;
    title: string;
    time: string;
    date: string;
    type?: string; // 'appt-accepted' | 'appt-pending' | 'appt-declined' | 'appt-queue'
    status?: string;
    name: string;
    email: string;
    request?: string;
    method?: string;
    paid?: string | number;
}

interface PendingRequest {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    service_name?: string;
    selected_date: string;
    selected_time: string;
    payment_strategy?: string;
    amount_paid?: number;
    status: string;
}

interface Props {
    partner: any;
    appointments?: Record<string, Appointment[]>;
    pendingRequests?: PendingRequest[];
}

const TIME_SLOTS = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM'
];

export default function Bookings({ partner, appointments = {}, pendingRequests = [] }: Props) {
    const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

    const updateStatus = (id: string, newStatus: string) => {
        router.post(`/admin/bookings/${id}/status`, { status: newStatus });
    };

    // Style badge mappings equivalent to BnA.php
    const getStatusStyle = (type?: string, status?: string) => {
        const check = type || status || 'pending';
        if (check.includes('accepted') || check.includes('approved')) {
            return 'bg-emerald-100 text-emerald-800 border-l-4 border-emerald-700';
        }
        if (check.includes('declined')) {
            return 'bg-rose-100 text-rose-800 border-l-4 border-rose-600';
        }
        if (check.includes('queue')) {
            return 'bg-stone-100 text-stone-700 border-l-4 border-stone-500';
        }
        return 'bg-amber-100 text-amber-800 border-l-4 border-amber-600';
    };

    // Navigation logic from BnA.php
    const navigate = (direction: number) => {
        const next = new Date(currentDate);
        if (viewMode === 'day') {
            next.setDate(next.getDate() + direction);
        } else if (viewMode === 'week') {
            next.setDate(next.getDate() + direction * 7);
        } else if (viewMode === 'month') {
            next.setMonth(next.getMonth() + direction);
        }
        setCurrentDate(next);
    };

    // Calculate start of the week (Monday)
    const activeMonday = useMemo(() => {
        const d = new Date(currentDate);
        const dayOffset = d.getDay() === 0 ? 6 : d.getDay() - 1;
        d.setDate(d.getDate() - dayOffset);
        d.setHours(0, 0, 0, 0);
        return d;
    }, [currentDate]);

    // Populate dropdown options matching BnA.php populateDayDropdown()
    const dropdownOptions = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        if (viewMode === 'day') {
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const opts = [];
            for (let i = 1; i <= daysInMonth; i++) {
                const d = new Date(year, month, i);
                opts.push({
                    value: d.toISOString().split('T')[0],
                    label: `${currentDate.toLocaleDateString('en-US', { month: 'short' })} ${i}`
                });
            }
            return opts;
        }

        if (viewMode === 'week') {
            let currentPos = new Date(year, month, 1);
            const dayOffset = currentPos.getDay() === 0 ? 6 : currentPos.getDay() - 1;
            currentPos.setDate(currentPos.getDate() - dayOffset);

            const opts = [];
            for (let i = 0; i < 6; i++) {
                const weekEnd = new Date(currentPos);
                weekEnd.setDate(currentPos.getDate() + 6);

                if (i > 0 && currentPos.getMonth() !== month && currentPos.getTime() !== activeMonday.getTime()) {
                    break;
                }

                const startLabel = currentPos.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const endLabel = weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                opts.push({
                    value: currentPos.toISOString().split('T')[0],
                    label: `${startLabel} - ${endLabel}`
                });
                currentPos.setDate(currentPos.getDate() + 7);
            }
            return opts;
        }

        return [];
    }, [currentDate, viewMode, activeMonday]);

    // Current dropdown selected value
    const selectedDropdownVal = useMemo(() => {
        if (viewMode === 'day') {
            return currentDate.toISOString().split('T')[0];
        }
        return activeMonday.toISOString().split('T')[0];
    }, [viewMode, currentDate, activeMonday]);

    // Convert time string into vertical offset in the grid
    const calculateTopOffset = (timeStr: string) => {
        const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (!match) return 0;
        let h = parseInt(match[1], 10);
        const m = parseInt(match[2], 10);
        const ampm = match[3].toUpperCase();
        if (h === 12 && ampm === 'AM') h = 0;
        if (h < 12 && ampm === 'PM') h += 12;

        const hoursFromStart = (h - 9) + (m / 60);
        return Math.max(0, hoursFromStart * 64); // 64px is each 1-hour slot height
    };

    // Days to show in Day / Week view
    const daysToRender = useMemo(() => {
        if (viewMode === 'day') {
            const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
            return [{
                date: new Date(currentDate),
                dateKey,
                label: currentDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' }),
                isToday: currentDate.toDateString() === new Date().toDateString()
            }];
        }

        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(activeMonday);
            d.setDate(activeMonday.getDate() + i);
            const dateKey = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
            days.push({
                date: d,
                dateKey,
                label: `${d.toLocaleDateString('en-US', { weekday: 'short' })} ${d.getDate()}`,
                isToday: d.toDateString() === new Date().toDateString()
            });
        }
        return days;
    }, [viewMode, currentDate, activeMonday]);

    //calendar : month
    const monthCells = useMemo(() => {
        if (viewMode !== 'month') return [];
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const start = new Date(year, month, 1);
        const end = new Date(year, month + 1, 0);
        const startPadding = start.getDay() === 0 ? 6 : start.getDay() - 1;

        const cells = [];
        for (let i = 0; i < startPadding; i++) {
            cells.push(null);
        }
        for (let d = 1; d <= end.getDate(); d++) {
            const dateObj = new Date(year, month, d);
            const dateKey = `${year}-${month + 1}-${d}`;
            cells.push({
                dayNum: d,
                dateKey,
                isToday: dateObj.toDateString() === new Date().toDateString()
            });
        }
        return cells;
    }, [viewMode, currentDate]);

    return (
        <div className="min-h-screen bg-[#faf9f6] text-stone-800 font-sans pt-[80px]">
            <Head title="Bookings & Appointments - Admin" />
            <AdminNavbar active="bookings" adminId={partner?.admin_id} />

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                {/* Page Title Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-stone-900">Booking &amp; Appointment</h1>
                        <p className="text-xs text-stone-500">Manage your appointment calendar and customer inquiries.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Main Calendar Card */}
                    <div className="lg:col-span-8 bg-white border border-stone-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                        {/* Toolbar */}
                        <div className="p-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <h2 className="text-lg font-bold text-[#064E3B] font-serif">
                                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </h2>

                                {/* Navigation Arrows and Range Select */}
                                <div className="flex items-center border border-stone-200 rounded-md overflow-hidden bg-white">
                                    <button
                                        onClick={() => navigate(-1)}
                                        className="px-2.5 py-1 text-stone-600 hover:bg-stone-50 text-sm font-bold border-r border-stone-200 transition"
                                    >
                                        &lsaquo;
                                    </button>

                                    {viewMode !== 'month' ? (
                                        <select
                                            value={selectedDropdownVal}
                                            onChange={(e) => setCurrentDate(new Date(e.target.value))}
                                            className="px-3 py-1 text-xs font-semibold text-stone-700 bg-transparent outline-none border-none cursor-pointer text-center"
                                        >
                                            {dropdownOptions.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span className="px-3 py-1 text-xs font-semibold text-stone-700">
                                            {currentDate.toLocaleDateString('en-US', { month: 'short' })}
                                        </span>
                                    )}

                                    <button
                                        onClick={() => navigate(1)}
                                        className="px-2.5 py-1 text-stone-600 hover:bg-stone-50 text-sm font-bold border-l border-stone-200 transition"
                                    >
                                        &rsaquo;
                                    </button>
                                </div>
                            </div>

                            {/* View Switchers */}
                            <div className="flex bg-stone-100 p-1 rounded-lg border border-stone-200">
                                <button
                                    onClick={() => setViewMode('day')}
                                    className={`px-3 py-1 text-xs font-semibold rounded-md transition ${viewMode === 'day' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-800'}`}
                                >
                                    Day
                                </button>
                                <button
                                    onClick={() => setViewMode('week')}
                                    className={`px-3 py-1 text-xs font-semibold rounded-md transition ${viewMode === 'week' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-800'}`}
                                >
                                    Week
                                </button>
                                <button
                                    onClick={() => setViewMode('month')}
                                    className={`px-3 py-1 text-xs font-semibold rounded-md transition ${viewMode === 'month' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-800'}`}
                                >
                                    Month
                                </button>
                            </div>
                        </div>

                        {/* Calendar Body: Day & Week View */}
                        {(viewMode === 'day' || viewMode === 'week') && (
                            <div className="overflow-x-auto">
                                <div className={`min-w-[650px] grid ${viewMode === 'day' ? 'grid-cols-[70px_1fr]' : 'grid-cols-[70px_repeat(7,1fr)]'} divide-x divide-stone-200`}>
                                    {/* Header Corner Spacer */}
                                    <div className="h-10 bg-stone-50/50 border-b border-stone-200"></div>

                                    {/* Day Headers */}
                                    {daysToRender.map((day) => (
                                        <div
                                            key={day.dateKey}
                                            className={`h-10 border-b border-stone-200 flex items-center justify-center font-bold text-xs ${
                                                day.isToday ? 'text-emerald-800 bg-emerald-50/40' : 'text-stone-600 bg-stone-50/30'
                                            }`}
                                        >
                                            {day.label}
                                        </div>
                                    ))}

                                    {/* Time Labels Column */}
                                    <div className="divide-y divide-stone-100 bg-stone-50/20">
                                        {TIME_SLOTS.map((slot) => (
                                            <div key={slot} className="h-16 text-[10px] text-stone-400 font-medium px-2 pt-1">
                                                {slot}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Day Content Columns with Bookings */}
                                    {daysToRender.map((day) => {
                                        const dayAppts = appointments[day.dateKey] || [];
                                        return (
                                            <div key={day.dateKey} className="relative divide-y divide-stone-100 min-h-[448px]">
                                                {/* Background Grid Lines */}
                                                {TIME_SLOTS.map((slot) => (
                                                    <div key={slot} className="h-16"></div>
                                                ))}

                                                {/* Positioned Appointments */}
                                                {dayAppts.map((appt) => {
                                                    const topPos = calculateTopOffset(appt.time);
                                                    return (
                                                        <div
                                                            key={appt.id}
                                                            onClick={() => setSelectedAppt(appt)}
                                                            style={{ top: `${topPos}px` }}
                                                            className={`absolute left-1 right-1 p-1.5 text-[10px] rounded shadow-xs cursor-pointer z-10 hover:opacity-90 transition ${getStatusStyle(
                                                                appt.type,
                                                                appt.status
                                                            )}`}
                                                        >
                                                            <div className="font-bold truncate">{appt.title}</div>
                                                            <div className="text-[9px] opacity-80">{appt.time}</div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Calendar Body: Month View */}
                        {viewMode === 'month' && (
                            <div className="p-4">
                                <div className="grid grid-cols-7 gap-2 border border-stone-200 rounded-lg p-3 bg-stone-50/50">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                        <div key={day} className="text-center font-bold text-xs text-stone-400 py-1">
                                            {day}
                                        </div>
                                    ))}

                                    {monthCells.map((cell, i) => {
                                        if (!cell) {
                                            return <div key={`empty-${i}`} className="min-h-[80px]" />;
                                        }

                                        const dayAppts = appointments[cell.dateKey] || [];

                                        return (
                                            <div
                                                key={cell.dateKey}
                                                className={`bg-white border ${
                                                    cell.isToday ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-stone-100'
                                                } rounded min-h-[80px] p-1.5 flex flex-col justify-between`}
                                            >
                                                <span className={`text-[10px] font-bold ${cell.isToday ? 'text-emerald-700' : 'text-stone-400'}`}>
                                                    {cell.dayNum}
                                                </span>

                                                <div className="space-y-1 overflow-y-auto max-h-[60px]">
                                                    {dayAppts.map((appt) => (
                                                        <div
                                                            key={appt.id}
                                                            onClick={() => setSelectedAppt(appt)}
                                                            className={`p-1 text-[9px] font-bold rounded cursor-pointer truncate ${getStatusStyle(
                                                                appt.type,
                                                                appt.status
                                                            )}`}
                                                        >
                                                            {appt.title}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Client Information Sidebar Inspector Card */}
                    <aside className="lg:col-span-4 bg-white border border-stone-200 rounded-xl p-6 shadow-sm flex flex-col justify-between h-fit">
                        <div>
                            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
                                <h3 className="font-bold text-sm text-stone-800 font-serif">
                                    {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                </h3>
                                <span className="text-stone-400 text-xs">📅</span>
                            </div>

                            <div className="text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-2">
                                Client Information
                            </div>

                            {selectedAppt ? (
                                <div className="space-y-4 text-xs bg-stone-50/50 p-4 rounded-lg border border-stone-100">
                                    <div>
                                        <span className="text-stone-400 font-bold uppercase text-[9px] block">Customer</span>
                                        <p className="font-bold text-sm text-stone-800">{selectedAppt.name}</p>
                                        <p className="text-stone-500">{selectedAppt.email}</p>
                                    </div>
                                    <hr className="border-stone-200" />
                                    <div>
                                        <span className="text-stone-400 font-bold uppercase text-[9px] block">Schedule Details</span>
                                        <p className="font-bold text-stone-800">{selectedAppt.title}</p>
                                        <p className="text-stone-600">{selectedAppt.date} @ {selectedAppt.time}</p>
                                    </div>
                                    <hr className="border-stone-200" />
                                    <div>
                                        <span className="text-stone-400 font-bold uppercase text-[9px] block">Payment &amp; Strategy</span>
                                        <p className="text-stone-700 font-semibold">{selectedAppt.method?.toUpperCase()} (₱{selectedAppt.paid})</p>
                                        <p className="italic text-stone-500 mt-2 bg-white border border-stone-200 p-2 rounded">
                                            &quot;{selectedAppt.request || 'None'}&quot;
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-stone-50 border border-stone-100 rounded-lg py-12 px-4 text-center text-stone-400 text-xs">
                                    Select a schedule to view client details
                                </div>
                            )}
                        </div>
                    </aside>
                </div>

                {/* Table of Recent Service Inquiries */}
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
                                    <th className="p-3">Customer Contact</th>
                                    <th className="p-3">Service Type</th>
                                    <th className="p-3">Requested Date</th>
                                    <th className="p-3">Payment Strategy</th>
                                    <th className="p-3">Amount Paid</th>
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
                                            <td className="p-3">{req.service_name || 'Service'}</td>
                                            <td className="p-3 text-stone-500">{req.selected_date} • {req.selected_time}</td>
                                            <td className="p-3 capitalize text-stone-600">{req.payment_strategy || 'N/A'}</td>
                                            <td className="p-3 font-bold">₱{Number(req.amount_paid || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
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