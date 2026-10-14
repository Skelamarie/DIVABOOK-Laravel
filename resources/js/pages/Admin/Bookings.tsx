import React, { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';

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
    '03:00 PM',
];
const dateValue = (date: Date) =>
    [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
    ].join('-');

export default function Bookings({
    partner,
    appointments = {},
    pendingRequests = [],
}: Props) {
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
                    value: dateValue(d),
                    label: `${currentDate.toLocaleDateString('en-US', { month: 'short' })} ${i}`,
                });
            }
            return opts;
        }

        if (viewMode === 'week') {
            let currentPos = new Date(year, month, 1);
            const dayOffset =
                currentPos.getDay() === 0 ? 6 : currentPos.getDay() - 1;
            currentPos.setDate(currentPos.getDate() - dayOffset);

            const opts = [];
            for (let i = 0; i < 6; i++) {
                const weekEnd = new Date(currentPos);
                weekEnd.setDate(currentPos.getDate() + 6);

                if (
                    i > 0 &&
                    currentPos.getMonth() !== month &&
                    currentPos.getTime() !== activeMonday.getTime()
                ) {
                    break;
                }

                const startLabel = currentPos.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                });
                const endLabel = weekEnd.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                });

                opts.push({
                    value: dateValue(currentPos),
                    label: `${startLabel} - ${endLabel}`,
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
            return dateValue(currentDate);
        }
        return dateValue(activeMonday);
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

        const hoursFromStart = h - 9 + m / 60;
        return Math.max(0, hoursFromStart * 64); // 64px is each 1-hour slot height
    };

    // Days to show in Day / Week view
    const daysToRender = useMemo(() => {
        if (viewMode === 'day') {
            const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
            return [
                {
                    date: new Date(currentDate),
                    dateKey,
                    label: currentDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        day: 'numeric',
                    }),
                    isToday:
                        currentDate.toDateString() ===
                        new Date().toDateString(),
                },
            ];
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
                isToday: d.toDateString() === new Date().toDateString(),
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
                isToday: dateObj.toDateString() === new Date().toDateString(),
            });
        }
        return cells;
    }, [viewMode, currentDate]);

    return (
        <div className="min-h-full bg-[#faf9f6] font-sans text-stone-800">
            <Head title="Bookings & Appointments - Admin" />

            <main className="mx-auto max-w-7xl space-y-8 px-6 py-8">
                {/* Page Title Header */}
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
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Main Calendar Card */}
                    <div className="flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm lg:col-span-8">
                        {/* Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 p-4">
                            <div className="flex items-center gap-3">
                                <h2 className="font-serif text-lg font-bold text-[#064E3B]">
                                    {currentDate.toLocaleDateString('en-US', {
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </h2>

                                {/* Navigation Arrows and Range Select */}
                                <div className="flex items-center overflow-hidden rounded-md border border-stone-200 bg-white">
                                    <button
                                        onClick={() => navigate(-1)}
                                        className="border-r border-stone-200 px-2.5 py-1 text-sm font-bold text-stone-600 transition hover:bg-stone-50"
                                    >
                                        &lsaquo;
                                    </button>

                                    {viewMode !== 'month' ? (
                                        <select
                                            value={selectedDropdownVal}
                                            onChange={(e) =>
                                                setCurrentDate(
                                                    new Date(e.target.value),
                                                )
                                            }
                                            className="cursor-pointer border-none bg-transparent px-3 py-1 text-center text-xs font-semibold text-stone-700 outline-none"
                                        >
                                            {dropdownOptions.map((opt) => (
                                                <option
                                                    key={opt.value}
                                                    value={opt.value}
                                                >
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span className="px-3 py-1 text-xs font-semibold text-stone-700">
                                            {currentDate.toLocaleDateString(
                                                'en-US',
                                                { month: 'short' },
                                            )}
                                        </span>
                                    )}

                                    <button
                                        onClick={() => navigate(1)}
                                        className="border-l border-stone-200 px-2.5 py-1 text-sm font-bold text-stone-600 transition hover:bg-stone-50"
                                    >
                                        &rsaquo;
                                    </button>
                                </div>
                            </div>

                            {/* View Switchers */}
                            <div className="flex rounded-lg border border-stone-200 bg-stone-100 p-1">
                                <button
                                    onClick={() => setViewMode('day')}
                                    className={`rounded-md px-3 py-1 text-xs font-semibold transition ${viewMode === 'day' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}
                                >
                                    Day
                                </button>
                                <button
                                    onClick={() => setViewMode('week')}
                                    className={`rounded-md px-3 py-1 text-xs font-semibold transition ${viewMode === 'week' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}
                                >
                                    Week
                                </button>
                                <button
                                    onClick={() => setViewMode('month')}
                                    className={`rounded-md px-3 py-1 text-xs font-semibold transition ${viewMode === 'month' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}
                                >
                                    Month
                                </button>
                            </div>
                        </div>

                        {/* Calendar Body: Day & Week View */}
                        {(viewMode === 'day' || viewMode === 'week') && (
                            <div className="overflow-x-auto">
                                <div
                                    className={`grid min-w-[650px] ${viewMode === 'day' ? 'grid-cols-[70px_1fr]' : 'grid-cols-[70px_repeat(7,1fr)]'} divide-x divide-stone-200`}
                                >
                                    {/* Header Corner Spacer */}
                                    <div className="h-10 border-b border-stone-200 bg-stone-50/50"></div>

                                    {/* Day Headers */}
                                    {daysToRender.map((day) => (
                                        <div
                                            key={day.dateKey}
                                            className={`flex h-10 items-center justify-center border-b border-stone-200 text-xs font-bold ${
                                                day.isToday
                                                    ? 'bg-emerald-50/40 text-emerald-800'
                                                    : 'bg-stone-50/30 text-stone-600'
                                            }`}
                                        >
                                            {day.label}
                                        </div>
                                    ))}

                                    {/* Time Labels Column */}
                                    <div className="divide-y divide-stone-100 bg-stone-50/20">
                                        {TIME_SLOTS.map((slot) => (
                                            <div
                                                key={slot}
                                                className="h-16 px-2 pt-1 text-[10px] font-medium text-stone-400"
                                            >
                                                {slot}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Day Content Columns with Bookings */}
                                    {daysToRender.map((day) => {
                                        const dayAppts =
                                            appointments[day.dateKey] || [];
                                        return (
                                            <div
                                                key={day.dateKey}
                                                className="relative min-h-[448px] divide-y divide-stone-100"
                                            >
                                                {/* Background Grid Lines */}
                                                {TIME_SLOTS.map((slot) => (
                                                    <div
                                                        key={slot}
                                                        className="h-16"
                                                    ></div>
                                                ))}

                                                {/* Positioned Appointments */}
                                                {dayAppts.map((appt) => {
                                                    const topPos =
                                                        calculateTopOffset(
                                                            appt.time,
                                                        );
                                                    return (
                                                        <div
                                                            key={appt.id}
                                                            onClick={() =>
                                                                setSelectedAppt(
                                                                    appt,
                                                                )
                                                            }
                                                            style={{
                                                                top: `${topPos}px`,
                                                            }}
                                                            className={`absolute right-1 left-1 z-10 cursor-pointer rounded p-1.5 text-[10px] shadow-xs transition hover:opacity-90 ${getStatusStyle(
                                                                appt.type,
                                                                appt.status,
                                                            )}`}
                                                        >
                                                            <div className="truncate font-bold">
                                                                {appt.title}
                                                            </div>
                                                            <div className="text-[9px] opacity-80">
                                                                {appt.time}
                                                            </div>
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
                                <div className="grid grid-cols-7 gap-2 rounded-lg border border-stone-200 bg-stone-50/50 p-3">
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

                                    {monthCells.map((cell, i) => {
                                        if (!cell) {
                                            return (
                                                <div
                                                    key={`empty-${i}`}
                                                    className="min-h-[80px]"
                                                />
                                            );
                                        }

                                        const dayAppts =
                                            appointments[cell.dateKey] || [];

                                        return (
                                            <div
                                                key={cell.dateKey}
                                                className={`border bg-white ${
                                                    cell.isToday
                                                        ? 'border-emerald-500 ring-1 ring-emerald-500'
                                                        : 'border-stone-100'
                                                } flex min-h-[80px] flex-col justify-between rounded p-1.5`}
                                            >
                                                <span
                                                    className={`text-[10px] font-bold ${cell.isToday ? 'text-emerald-700' : 'text-stone-400'}`}
                                                >
                                                    {cell.dayNum}
                                                </span>

                                                <div className="max-h-[60px] space-y-1 overflow-y-auto">
                                                    {dayAppts.map((appt) => (
                                                        <div
                                                            key={appt.id}
                                                            onClick={() =>
                                                                setSelectedAppt(
                                                                    appt,
                                                                )
                                                            }
                                                            className={`cursor-pointer truncate rounded p-1 text-[9px] font-bold ${getStatusStyle(
                                                                appt.type,
                                                                appt.status,
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
                    <aside className="flex h-fit flex-col justify-between rounded-xl border border-stone-200 bg-white p-6 shadow-sm lg:col-span-4">
                        <div>
                            <div className="mb-4 flex items-center justify-between border-b border-stone-100 pb-3">
                                <h3 className="font-serif text-sm font-bold text-stone-800">
                                    {currentDate.toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </h3>
                                <span className="text-xs text-stone-400">
                                    📅
                                </span>
                            </div>

                            <div className="mb-2 text-[10px] font-bold tracking-wider text-stone-400 uppercase">
                                Client Information
                            </div>

                            {selectedAppt ? (
                                <div className="space-y-4 rounded-lg border border-stone-100 bg-stone-50/50 p-4 text-xs">
                                    <div>
                                        <span className="block text-[9px] font-bold text-stone-400 uppercase">
                                            Customer
                                        </span>
                                        <p className="text-sm font-bold text-stone-800">
                                            {selectedAppt.name}
                                        </p>
                                        <p className="text-stone-500">
                                            {selectedAppt.email}
                                        </p>
                                    </div>
                                    <hr className="border-stone-200" />
                                    <div>
                                        <span className="block text-[9px] font-bold text-stone-400 uppercase">
                                            Schedule Details
                                        </span>
                                        <p className="font-bold text-stone-800">
                                            {selectedAppt.title}
                                        </p>
                                        <p className="text-stone-600">
                                            {selectedAppt.date} @{' '}
                                            {selectedAppt.time}
                                        </p>
                                    </div>
                                    <hr className="border-stone-200" />
                                    <div>
                                        <span className="block text-[9px] font-bold text-stone-400 uppercase">
                                            Payment &amp; Strategy
                                        </span>
                                        <p className="font-semibold text-stone-700">
                                            {selectedAppt.method?.toUpperCase()}{' '}
                                            (₱{selectedAppt.paid})
                                        </p>
                                        <p className="mt-2 rounded border border-stone-200 bg-white p-2 text-stone-500 italic">
                                            &quot;
                                            {selectedAppt.request || 'None'}
                                            &quot;
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-lg border border-stone-100 bg-stone-50 px-4 py-12 text-center text-xs text-stone-400">
                                    Select a schedule to view client details
                                </div>
                            )}
                        </div>
                    </aside>
                </div>

                {/* Table of Recent Service Inquiries */}
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
                                                {req.service_name || 'Service'}
                                            </td>
                                            <td className="p-3 text-stone-500">
                                                {req.selected_date} •{' '}
                                                {req.selected_time}
                                            </td>
                                            <td className="p-3 text-stone-600 capitalize">
                                                {req.payment_strategy || 'N/A'}
                                            </td>
                                            <td className="p-3 font-bold">
                                                ₱
                                                {Number(
                                                    req.amount_paid || 0,
                                                ).toLocaleString('en-US', {
                                                    minimumFractionDigits: 2,
                                                })}
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
