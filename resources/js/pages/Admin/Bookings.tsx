import React, { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminNavbar from '@/components/AdminNavbar';

interface Appointment {
    id: string;
    title: string;
    time: string;
    date: string;
    type?: string;
    status?: string;
    name: string;
    email: string;
    request?: string;
    method?: string;
    paid?: string | number;
}

<<<<<<< HEAD
export default function Bookings({
    partner,
    appointments = {},
    pendingRequests = [],
}: Props) {
    const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
    const [selectedAppt, setSelectedAppt] = useState<any | null>(null);
=======
interface PendingRequest {
    _id: string;
    id?: string;
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
>>>>>>> cd3009760716be2bcbf08c7fd8ffea22f330cb8d

    const updateStatus = (id: string, newStatus: string) => {
        router.post(`/admin/bookings/${id}/status`, { status: newStatus });
    };

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

    const activeMonday = useMemo(() => {
        const d = new Date(currentDate);
        const dayOffset = d.getDay() === 0 ? 6 : d.getDay() - 1;
        d.setDate(d.getDate() - dayOffset);
        d.setHours(0, 0, 0, 0);
        return d;
    }, [currentDate]);

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

    const selectedDropdownVal = useMemo(() => {
        if (viewMode === 'day') {
            return currentDate.toISOString().split('T')[0];
        }
        return activeMonday.toISOString().split('T')[0];
    }, [viewMode, currentDate, activeMonday]);

    const calculateTopOffset = (timeStr: string) => {
        const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (!match) return 0;
        let h = parseInt(match[1], 10);
        const m = parseInt(match[2], 10);
        const ampm = match[3].toUpperCase();
        if (h === 12 && ampm === 'AM') h = 0;
        if (h < 12 && ampm === 'PM') h += 12;

        const hoursFromStart = (h - 9) + (m / 60);
        return Math.max(0, hoursFromStart * 64);
    };

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
        <div className="min-h-screen bg-[#faf9f6] pt-[80px] font-sans text-stone-800">
            <Head title="Bookings & Appointments - Admin" />
<<<<<<< HEAD
            <AdminNavbar
                active="bookings"
                salonName={partner?.branding?.salon_name || partner?.shop_name}
                adminId={partner?.admin_id}
            />

            <main className="mx-auto max-w-7xl space-y-8 px-6 py-8">
                <div className="flex flex-col justify-between gap-4 border-b border-stone-200 pb-4 md:flex-row md:items-center">
=======
            <AdminNavbar active="bookings" adminId={partner?.admin_id} />

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-4">
>>>>>>> cd3009760716be2bcbf08c7fd8ffea22f330cb8d
                    <div>
                        <h1 className="font-serif text-3xl font-bold text-stone-900">
                            Booking &amp; Appointment
                        </h1>
                        <p className="text-xs text-stone-500">
                            Manage your appointment calendar and customer
                            inquiries.
                        </p>
                    </div>
<<<<<<< HEAD
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
=======
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 bg-white border border-stone-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <h2 className="text-lg font-bold text-[#064E3B] font-serif">
                                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </h2>

                                <div className="flex items-center border border-stone-200 rounded-md overflow-hidden bg-white">
                                    <button
                                        type="button"
                                        onClick={() => navigate(-1)}
                                        className="px-2.5 py-1 text-stone-600 hover:bg-stone-50 text-sm font-bold border-r border-stone-200 transition cursor-pointer"
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
                                        type="button"
                                        onClick={() => navigate(1)}
                                        className="px-2.5 py-1 text-stone-600 hover:bg-stone-50 text-sm font-bold border-l border-stone-200 transition cursor-pointer"
                                    >
                                        &rsaquo;
                                    </button>
>>>>>>> cd3009760716be2bcbf08c7fd8ffea22f330cb8d
                                </div>
                            </div>

<<<<<<< HEAD
=======
<<<<<<< HEAD
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
=======
                            {/* View Switchers */}
>>>>>>> 33ab5ff544701f1538fbe5808b17028254537e67
                            <div className="flex bg-stone-100 p-1 rounded-lg border border-stone-200">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('day')}
                                    className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${viewMode === 'day' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-800'}`}
                                >
                                    Day
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('week')}
                                    className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${viewMode === 'week' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-800'}`}
                                >
                                    Week
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('month')}
                                    className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${viewMode === 'month' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-800'}`}
                                >
                                    Month
                                </button>
                            </div>
>>>>>>> cd3009760716be2bcbf08c7fd8ffea22f330cb8d
                        </div>

                        {(viewMode === 'day' || viewMode === 'week') && (
                            <div className="overflow-x-auto">
                                <div className={`min-w-[650px] grid ${viewMode === 'day' ? 'grid-cols-[70px_1fr]' : 'grid-cols-[70px_repeat(7,1fr)]'} divide-x divide-stone-200`}>
                                    <div className="h-10 bg-stone-50/50 border-b border-stone-200"></div>

                                    {daysToRender.map((day) => (
                                        <div
                                            key={`day-header-${day.dateKey}`}
                                            className={`h-10 border-b border-stone-200 flex items-center justify-center font-bold text-xs ${
                                                day.isToday ? 'text-emerald-800 bg-emerald-50/40' : 'text-stone-600 bg-stone-50/30'
                                            }`}
                                        >
                                            {day.label}
                                        </div>
                                    ))}

                                    <div className="divide-y divide-stone-100 bg-stone-50/20">
                                        {TIME_SLOTS.map((slot) => (
                                            <div key={`timeslot-label-${slot}`} className="h-16 text-[10px] text-stone-400 font-medium px-2 pt-1">
                                                {slot}
                                            </div>
                                        ))}
                                    </div>

                                    {daysToRender.map((day) => {
                                        const dayAppts = appointments[day.dateKey] || [];
                                        return (
                                            <div key={`day-col-${day.dateKey}`} className="relative divide-y divide-stone-100 min-h-[448px]">
                                                {TIME_SLOTS.map((slot) => (
                                                    <div key={`grid-line-${day.dateKey}-${slot}`} className="h-16"></div>
                                                ))}

                                                {dayAppts.map((appt, idx) => {
                                                    const topPos = calculateTopOffset(appt.time);
                                                    const uniqueKey = appt.id ? `appt-${appt.id}` : `appt-${day.dateKey}-${idx}`;
                                                    return (
                                                        <div
                                                            key={uniqueKey}
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

                        {viewMode === 'month' && (
                            <div className="p-4">
                                <div className="grid grid-cols-7 gap-2 border border-stone-200 rounded-lg p-3 bg-stone-50/50">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                        <div key={`month-header-${day}`} className="text-center font-bold text-xs text-stone-400 py-1">
                                            {day}
                                        </div>
                                    ))}

                                    {monthCells.map((cell, i) => {
                                        if (!cell) {
                                            return <div key={`month-empty-${i}`} className="min-h-[80px]" />;
                                        }

                                        const dayAppts = appointments[cell.dateKey] || [];

                                        return (
                                            <div
                                                key={`month-cell-${cell.dateKey}`}
                                                className={`bg-white border ${
                                                    cell.isToday ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-stone-100'
                                                } rounded min-h-[80px] p-1.5 flex flex-col justify-between`}
                                            >
                                                <span className={`text-[10px] font-bold ${cell.isToday ? 'text-emerald-700' : 'text-stone-400'}`}>
                                                    {cell.dayNum}
                                                </span>

                                                <div className="space-y-1 overflow-y-auto max-h-[60px]">
                                                    {dayAppts.map((appt, idx) => (
                                                        <div
                                                            key={appt.id ? `month-appt-${appt.id}` : `month-appt-${cell.dateKey}-${idx}`}
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

<<<<<<< HEAD
=======
<<<<<<< HEAD
                    {/* Client Information Inspector Card */}
                    <aside className="flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-6 shadow-sm lg:col-span-4">
                        <div>
                            <h3 className="mb-4 border-b border-stone-100 pb-2 text-xs font-bold tracking-wider text-stone-400 uppercase">
                                Client Details
                            </h3>
=======
                    {/* Client Information Sidebar Inspector Card */}
>>>>>>> 33ab5ff544701f1538fbe5808b17028254537e67
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
>>>>>>> cd3009760716be2bcbf08c7fd8ffea22f330cb8d

                            {selectedAppt ? (
                                <div className="space-y-4 text-xs bg-stone-50/50 p-4 rounded-lg border border-stone-100">
                                    <div>
<<<<<<< HEAD
                                        <span className="text-[9px] font-bold text-stone-400 uppercase">
                                            Customer
                                        </span>
                                        <p className="text-sm font-bold text-stone-800">
                                            {selectedAppt.name}
                                        </p>
                                        <p className="text-stone-500">
                                            {selectedAppt.email}
                                        </p>
=======
                                        <span className="text-stone-400 font-bold uppercase text-[9px] block">Customer</span>
                                        <p className="font-bold text-sm text-stone-800">{selectedAppt.name}</p>
                                        <p className="text-stone-500">{selectedAppt.email}</p>
>>>>>>> cd3009760716be2bcbf08c7fd8ffea22f330cb8d
                                    </div>
                                    <hr className="border-stone-200" />
                                    <div>
<<<<<<< HEAD
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
=======
                                        <span className="text-stone-400 font-bold uppercase text-[9px] block">Schedule Details</span>
                                        <p className="font-bold text-stone-800">{selectedAppt.title}</p>
                                        <p className="text-stone-600">{selectedAppt.date} @ {selectedAppt.time}</p>
>>>>>>> cd3009760716be2bcbf08c7fd8ffea22f330cb8d
                                    </div>
                                    <hr className="border-stone-200" />
                                    <div>
<<<<<<< HEAD
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
=======
                                        <span className="text-stone-400 font-bold uppercase text-[9px] block">Payment &amp; Strategy</span>
                                        <p className="text-stone-700 font-semibold">{selectedAppt.method?.toUpperCase()} (₱{selectedAppt.paid})</p>
                                        <p className="italic text-stone-500 mt-2 bg-white border border-stone-200 p-2 rounded">
                                            &quot;{selectedAppt.request || 'None'}&quot;
>>>>>>> cd3009760716be2bcbf08c7fd8ffea22f330cb8d
                                        </p>
                                    </div>
                                </div>
                            ) : (
<<<<<<< HEAD
                                <div className="py-16 text-center text-xs text-stone-400">
                                    Click any slot on the calendar to view full
                                    customer details.
=======
                                <div className="bg-stone-50 border border-stone-100 rounded-lg py-12 px-4 text-center text-stone-400 text-xs">
                                    Select a schedule to view client details
>>>>>>> cd3009760716be2bcbf08c7fd8ffea22f330cb8d
                                </div>
                            )}
                        </div>
                    </aside>
                </div>

<<<<<<< HEAD
=======
<<<<<<< HEAD
                {/* Table of Inquiries */}
                <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-stone-200 p-4">
                        <h3 className="text-xs font-bold tracking-wider text-stone-800 uppercase">
=======
                {/* Table of Recent Service Inquiries */}
>>>>>>> 33ab5ff544701f1538fbe5808b17028254537e67
                <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-stone-200 flex justify-between items-center">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-stone-800">
>>>>>>> cd3009760716be2bcbf08c7fd8ffea22f330cb8d
                            Recent Service Inquiries ({pendingRequests.length})
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-stone-200 bg-stone-50 text-[10px] font-bold text-stone-400 uppercase">
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
                                        <td
                                            colSpan={6}
                                            className="p-6 text-center text-stone-400"
                                        >
                                            No inquiries pending approval.
                                        </td>
                                    </tr>
                                ) : (
<<<<<<< HEAD
                                    pendingRequests.map((req, idx) => {
                                      const reqId = (req._id || req.id || String(idx)).toString();
                                        return (
                                            <tr key={`req-row-${reqId}`} className="hover:bg-stone-50">
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
                                                        type="button"
                                                        onClick={() => updateStatus(reqId, 'approved')}
                                                        className="px-3 py-1 bg-[#064E3B] hover:bg-[#043d2e] text-white rounded font-bold text-[10px] cursor-pointer"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateStatus(reqId, 'declined')}
                                                        className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded font-bold text-[10px] cursor-pointer"
                                                    >
                                                        Decline
                                                    </button>
                                                    <Link
                                                        href={`/admin/bookings/${reqId}`}
                                                        className="px-2 py-1 text-stone-500 hover:text-stone-800 font-bold underline text-[10px]"
                                                    >
                                                        Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
=======
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
<<<<<<< HEAD
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
=======
                                            <td className="p-3">{req.service_name || 'Service'}</td>
                                            <td className="p-3 text-stone-500">{req.selected_date} • {req.selected_time}</td>
                                            <td className="p-3 capitalize text-stone-600">{req.payment_strategy || 'N/A'}</td>
                                            <td className="p-3 font-bold">₱{Number(req.amount_paid || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                            <td className="p-3 text-right space-x-2">
>>>>>>> cd3009760716be2bcbf08c7fd8ffea22f330cb8d
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
>>>>>>> 33ab5ff544701f1538fbe5808b17028254537e67
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
