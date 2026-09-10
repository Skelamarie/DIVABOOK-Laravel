import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminNavbar from '@/components/AdminNavbar';

interface Props {
    partner: any;
    stats: {
        totalBookings: number;
        pendingApprovals: number;
        todayAppointments: number;
        cancelledToday: number;
    };
}

export default function Overview({ partner, stats }: Props) {
    const [liveStats, setLiveStats] = useState(stats);
    const [todayItems, setTodayItems] = useState<any[]>([]);
    const [pendingItems, setPendingItems] = useState<any[]>([]);
    const [chartData, setChartData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

    const fetchLive = async () => {
        try {
            const res = await fetch('/admin/api/overview-stats');
            const data = await res.json();
            if (data.success) {
                setLiveStats((prev) => ({
                    ...prev,
                    totalBookings: data.totalBookings,
                    pendingApprovals: data.pendingApprovals,
                    cancelledToday: data.cancelledToday,
                }));
                setTodayItems(data.todayAppointments.items || []);
                setPendingItems(data.pendingServiceApprovals.items || []);
                if (data.weekly?.data) {
                    setChartData(data.weekly.data);
                }
            }
        } catch (e) {
            console.error('Failed to poll overview statistics', e);
        }
    };

    useEffect(() => {
        fetchLive();
        const interval = setInterval(fetchLive, 5000);
        return () => clearInterval(interval);
    }, []);

    const maxChartVal = Math.max(...chartData, 1);

    return (
        <div className="min-h-screen bg-[#faf9f6] pt-[80px] font-sans text-stone-800">
            <Head title="Overview - Admin Portal" />
            <AdminNavbar active="overview" adminId={partner?.admin_id} />

            <main className="mx-auto max-w-6xl px-6 py-8">
                <div className="mb-6 flex items-end justify-between border-b border-stone-200 pb-4">
                    <div>
                        <h1 className="font-serif text-3xl font-bold text-stone-900">
                            Overview
                        </h1>
                        <p className="text-xs text-stone-500">
                            Manage your daily schedule and incoming client
                            requests.
                        </p>
                    </div>
                    <span className="rounded border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-600 shadow-sm">
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </span>
                </div>

                {/* Stat Cards */}
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="rounded-xl border border-l-4 border-stone-200 border-l-[#064E3B] bg-white p-6 shadow-sm">
                        <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase">
                            Total Bookings
                        </span>
                        <h2 className="mt-2 font-serif text-4xl font-bold text-stone-900">
                            {liveStats.totalBookings}
                        </h2>
                        <span className="mt-1 inline-block text-xs font-bold text-emerald-700">
                            ● Real-time sync
                        </span>
                    </div>

                    <div className="rounded-xl border border-l-4 border-stone-200 border-l-amber-500 bg-white p-6 shadow-sm">
                        <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase">
                            Pending Approvals
                        </span>
                        <h2 className="mt-2 font-serif text-4xl font-bold text-amber-600">
                            {liveStats.pendingApprovals}
                        </h2>
                        <span className="mt-1 inline-block text-xs text-stone-400">
                            Awaiting confirmation
                        </span>
                    </div>

                    <div className="rounded-xl border border-l-4 border-stone-200 border-l-red-500 bg-white p-6 shadow-sm">
                        <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase">
                            Cancelled Today
                        </span>
                        <h2 className="mt-2 font-serif text-4xl font-bold text-red-600">
                            {liveStats.cancelledToday}
                        </h2>
                        <span className="mt-1 inline-block text-xs text-stone-400">
                            Declined or aborted
                        </span>
                    </div>
                </div>

                {/* Weekly Bar Chart Simulation */}
                <div className="mb-8 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-6 text-xs font-bold tracking-wider text-stone-600 uppercase">
                        Weekly Booking Inquiries
                    </h3>
                    <div className="flex h-40 items-end justify-between gap-2 border-b border-stone-100 px-4 pt-4">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
                            (day, idx) => {
                                const val = chartData[idx] || 0;
                                const heightPercent = Math.max(
                                    (val / maxChartVal) * 100,
                                    8,
                                );
                                return (
                                    <div
                                        key={day}
                                        className="flex flex-1 flex-col items-center"
                                    >
                                        <span className="mb-1 text-[10px] font-bold text-stone-500">
                                            {val}
                                        </span>
                                        <div
                                            style={{
                                                height: `${heightPercent}%`,
                                            }}
                                            className="w-full max-w-[36px] rounded-t bg-[#064E3B] transition-all duration-300"
                                        />
                                        <span className="mt-2 text-[10px] font-semibold text-stone-400">
                                            {day}
                                        </span>
                                    </div>
                                );
                            },
                        )}
                    </div>
                </div>

                {/* Two Column Lists */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Today's Appointments */}
                    <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-bold tracking-wide text-stone-900 uppercase">
                                Today's Appointments
                            </h3>
                            <Link
                                href="/admin/bookings"
                                className="text-xs font-bold text-[#064E3B] hover:underline"
                            >
                                View Calendar →
                            </Link>
                        </div>
                        {todayItems.length === 0 ? (
                            <p className="py-6 text-center text-xs text-stone-400">
                                No appointments scheduled for today.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {todayItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between rounded-lg border border-stone-100 bg-stone-50 p-3"
                                    >
                                        <div>
                                            <p className="text-xs font-bold text-stone-800">
                                                {item.name}
                                            </p>
                                            <p className="text-[11px] text-stone-500">
                                                {item.service} • {item.time}
                                            </p>
                                        </div>
                                        <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase">
                                            {item.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pending Requests */}
                    <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-bold tracking-wide text-stone-900 uppercase">
                                Pending Service Approvals
                            </h3>
                            <Link
                                href="/admin/bookings"
                                className="text-xs font-bold text-[#064E3B] hover:underline"
                            >
                                Manage Requests →
                            </Link>
                        </div>
                        {pendingItems.length === 0 ? (
                            <p className="py-6 text-center text-xs text-stone-400">
                                No pending service requests.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {pendingItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between rounded-lg border border-amber-100 bg-amber-50/50 p-3"
                                    >
                                        <div>
                                            <p className="text-xs font-bold text-stone-800">
                                                {item.name}
                                            </p>
                                            <p className="text-[11px] text-stone-500">
                                                {item.service} • {item.date}
                                            </p>
                                        </div>
                                        <Link
                                            href={`/admin/bookings/${item.id}`}
                                            className="rounded border border-amber-300 bg-white px-3 py-1 text-[11px] font-bold text-amber-700 shadow-sm hover:bg-amber-50"
                                        >
                                            Review
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
