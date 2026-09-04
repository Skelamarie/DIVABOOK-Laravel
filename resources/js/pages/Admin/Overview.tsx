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
                setLiveStats(prev => ({
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
        <div className="min-h-screen bg-[#faf9f6] text-stone-800 font-sans pt-[80px]">
            <Head title="Overview - Admin Portal" />
            <AdminNavbar active="overview" salonName={partner?.branding?.salon_name || partner?.shop_name} adminId={partner?.admin_id} />

            <main className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex justify-between items-end mb-6 border-b border-stone-200 pb-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-stone-900">Overview</h1>
                        <p className="text-xs text-stone-500">Manage your daily schedule and incoming client requests.</p>
                    </div>
                    <span className="text-xs bg-white border border-stone-200 px-3 py-1.5 rounded font-semibold text-stone-600 shadow-sm">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-stone-200 border-l-4 border-l-[#064E3B] shadow-sm">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Total Bookings</span>
                        <h2 className="text-4xl font-serif font-bold text-stone-900 mt-2">{liveStats.totalBookings}</h2>
                        <span className="text-xs font-bold text-emerald-700 mt-1 inline-block">● Real-time sync</span>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-stone-200 border-l-4 border-l-amber-500 shadow-sm">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Pending Approvals</span>
                        <h2 className="text-4xl font-serif font-bold text-amber-600 mt-2">{liveStats.pendingApprovals}</h2>
                        <span className="text-xs text-stone-400 mt-1 inline-block">Awaiting confirmation</span>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-stone-200 border-l-4 border-l-red-500 shadow-sm">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Cancelled Today</span>
                        <h2 className="text-4xl font-serif font-bold text-red-600 mt-2">{liveStats.cancelledToday}</h2>
                        <span className="text-xs text-stone-400 mt-1 inline-block">Declined or aborted</span>
                    </div>
                </div>

                {/* Weekly Bar Chart Simulation */}
                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm mb-8">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-6">Weekly Booking Inquiries</h3>
                    <div className="flex items-end justify-between h-40 gap-2 pt-4 px-4 border-b border-stone-100">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                            const val = chartData[idx] || 0;
                            const heightPercent = Math.max((val / maxChartVal) * 100, 8);
                            return (
                                <div key={day} className="flex flex-col items-center flex-1">
                                    <span className="text-[10px] font-bold text-stone-500 mb-1">{val}</span>
                                    <div
                                        style={{ height: `${heightPercent}%` }}
                                        className="w-full max-w-[36px] bg-[#064E3B] rounded-t transition-all duration-300"
                                    />
                                    <span className="text-[10px] font-semibold text-stone-400 mt-2">{day}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Two Column Lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Today's Appointments */}
                    <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-sm tracking-wide text-stone-900 uppercase">Today's Appointments</h3>
                            <Link href="/admin/bookings" className="text-xs text-[#064E3B] font-bold hover:underline">
                                View Calendar →
                            </Link>
                        </div>
                        {todayItems.length === 0 ? (
                            <p className="text-xs text-stone-400 text-center py-6">No appointments scheduled for today.</p>
                        ) : (
                            <div className="space-y-3">
                                {todayItems.map(item => (
                                    <div key={item.id} className="p-3 bg-stone-50 rounded-lg border border-stone-100 flex justify-between items-center">
                                        <div>
                                            <p className="text-xs font-bold text-stone-800">{item.name}</p>
                                            <p className="text-[11px] text-stone-500">{item.service} • {item.time}</p>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                            {item.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pending Requests */}
                    <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-sm tracking-wide text-stone-900 uppercase">Pending Service Approvals</h3>
                            <Link href="/admin/bookings" className="text-xs text-[#064E3B] font-bold hover:underline">
                                Manage Requests →
                            </Link>
                        </div>
                        {pendingItems.length === 0 ? (
                            <p className="text-xs text-stone-400 text-center py-6">No pending service requests.</p>
                        ) : (
                            <div className="space-y-3">
                                {pendingItems.map(item => (
                                    <div key={item.id} className="p-3 bg-amber-50/50 rounded-lg border border-amber-100 flex justify-between items-center">
                                        <div>
                                            <p className="text-xs font-bold text-stone-800">{item.name}</p>
                                            <p className="text-[11px] text-stone-500">{item.service} • {item.date}</p>
                                        </div>
                                        <Link
                                            href={`/admin/bookings/${item.id}`}
                                            className="text-[11px] font-bold text-amber-700 bg-white border border-amber-300 px-3 py-1 rounded shadow-sm hover:bg-amber-50"
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