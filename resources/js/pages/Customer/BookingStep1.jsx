import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';

export default function BookingStep1({ selectedService, partner }) {
    const { data, setData, post, processing, errors } = useForm({
        admin_id: partner?.admin_id || 'DB-BEL-001',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        service: selectedService?.category?.toLowerCase() || 'nails',
        service_name: selectedService?.name || 'Soft BIAB Overlay',
        service_price: parseInt(selectedService?.rate || '1200', 10),
        size: 'standard',
        size_name: 'Standard',
        size_price: 0,
        addon: '',
        addon_name: '',
        addon_price: 0,
        removal: false,
        removal_price: 0,
        selected_date: '',
        selected_time: '',
        special_requests: '',
        total_price: parseInt(selectedService?.rate || '1200', 10),
        payment_method: 'GCash',
    });

    const handleRemovalToggle = (checked) => {
        const removalCost = checked ? 150 : 0;
        setData((prev) => ({
            ...prev,
            removal: checked,
            removal_price: removalCost,
            total_price:
                prev.service_price +
                prev.size_price +
                prev.addon_price +
                removalCost,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/bookings');
    };

    const timeSlots = [
        '09:00 AM',
        '10:30 AM',
        '01:00 PM',
        '02:30 PM',
        '04:00 PM',
        '05:30 PM',
    ];

    return (
        <div className="min-h-screen bg-[#FDF8F7] px-4 py-10">
            <Head title={`Book ${data.service_name}`} />

            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
                {/* Left & Middle: Form Inputs */}
                <div className="rounded-3xl border border-stone-200/70 bg-white p-6 shadow-sm sm:p-8 md:col-span-2">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold tracking-wider text-rose-600 uppercase">
                                Step 1 of 2
                            </span>
                            <h1 className="text-2xl font-bold text-stone-900">
                                Schedule Your Session
                            </h1>
                        </div>
                        <Link
                            href="/services"
                            className="text-xs font-semibold text-stone-500 hover:text-stone-800"
                        >
                            Cancel
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Customer Details */}
                        <div>
                            <h2 className="mb-3 text-xs font-bold tracking-wider text-stone-500 uppercase">
                                1. Personal Details
                            </h2>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-stone-700">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.first_name}
                                        onChange={(e) =>
                                            setData(
                                                'first_name',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm focus:border-emerald-800 focus:ring-emerald-800"
                                        placeholder="e.g. Maria"
                                        required
                                    />
                                    {errors.first_name && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.first_name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-stone-700">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.last_name}
                                        onChange={(e) =>
                                            setData('last_name', e.target.value)
                                        }
                                        className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm focus:border-emerald-800 focus:ring-emerald-800"
                                        placeholder="e.g. Santos"
                                        required
                                    />
                                    {errors.last_name && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.last_name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-stone-700">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm focus:border-emerald-800 focus:ring-emerald-800"
                                        placeholder="maria@example.com"
                                        required
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-stone-700">
                                        Contact Number
                                    </label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData('phone', e.target.value)
                                        }
                                        className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm focus:border-emerald-800 focus:ring-emerald-800"
                                        placeholder="09171234567"
                                        required
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Date & Time Selector */}
                        <div className="border-t border-stone-100 pt-4">
                            <h2 className="mb-3 text-xs font-bold tracking-wider text-stone-500 uppercase">
                                2. Choose Slot
                            </h2>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="text-xs font-semibold text-stone-700">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={data.selected_date}
                                        onChange={(e) =>
                                            setData(
                                                'selected_date',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm focus:ring-emerald-800"
                                        required
                                    />
                                    {errors.selected_date && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.selected_date}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-stone-700">
                                        Time Slot
                                    </label>
                                    <select
                                        value={data.selected_time}
                                        onChange={(e) =>
                                            setData(
                                                'selected_time',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm focus:ring-emerald-800"
                                        required
                                    >
                                        <option value="">
                                            Select a time slot
                                        </option>
                                        {timeSlots.map((time) => (
                                            <option key={time} value={time}>
                                                {time}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.selected_time && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.selected_time}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Extras & Notes */}
                        <div className="space-y-3 border-t border-stone-100 pt-4">
                            <h2 className="mb-2 text-xs font-bold tracking-wider text-stone-500 uppercase">
                                3. Add-ons & Notes
                            </h2>

                            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-200 p-3 transition hover:bg-stone-50">
                                <input
                                    type="checkbox"
                                    checked={data.removal}
                                    onChange={(e) =>
                                        handleRemovalToggle(e.target.checked)
                                    }
                                    className="rounded text-rose-600 focus:ring-rose-500"
                                />
                                <div className="flex-1 text-xs">
                                    <span className="font-bold text-stone-800">
                                        Add Old Gel Removal
                                    </span>
                                    <p className="text-stone-500">
                                        Include safe soak-off before new service
                                    </p>
                                </div>
                                <span className="text-xs font-bold text-stone-700">
                                    +₱150
                                </span>
                            </label>

                            <div>
                                <label className="text-xs font-semibold text-stone-700">
                                    Health Notes & Style Preferences
                                </label>
                                <textarea
                                    rows={2}
                                    value={data.special_requests}
                                    onChange={(e) =>
                                        setData(
                                            'special_requests',
                                            e.target.value,
                                        )
                                    }
                                    className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs focus:ring-emerald-800"
                                    placeholder="Any allergies, nail sensitivity, or design inspiration details..."
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-2xl bg-rose-600 py-3.5 font-bold text-white shadow transition hover:bg-rose-700 disabled:opacity-50"
                        >
                            {processing
                                ? 'Processing Booking...'
                                : `Confirm & Request Booking (₱${data.total_price})`}
                        </button>
                    </form>
                </div>

                {/* Right: Booking Summary Card */}
                <div className="h-fit space-y-4 rounded-3xl border border-stone-200/70 bg-white p-6 shadow-sm">
                    <h2 className="border-b border-stone-100 pb-3 text-sm font-bold text-stone-900">
                        Booking Summary
                    </h2>

                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                            <span className="text-stone-500">Salon</span>
                            <span className="font-semibold text-stone-800">
                                {partner?.shop_name || 'Belleza'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-stone-500">Service</span>
                            <span className="font-semibold text-stone-800">
                                {data.service_name}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-stone-500">Base Rate</span>
                            <span className="font-semibold text-stone-800">
                                ₱{data.service_price}
                            </span>
                        </div>
                        {data.removal && (
                            <div className="flex justify-between text-rose-600">
                                <span>Removal Fee</span>
                                <span className="font-semibold">
                                    +₱{data.removal_price}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-stone-500">Date</span>
                            <span className="font-semibold text-stone-800">
                                {data.selected_date || 'Not selected'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-stone-500">Time</span>
                            <span className="font-semibold text-stone-800">
                                {data.selected_time || 'Not selected'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                        <span className="text-xs font-bold text-stone-700 uppercase">
                            Estimated Total
                        </span>
                        <span className="text-lg font-black text-emerald-900">
                            ₱{data.total_price}
                        </span>
                    </div>

                    <div className="rounded-xl border border-amber-200/60 bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-800">
                        <strong>Payment-Before-Confirmation:</strong>{' '}
                        Appointment slot will remain pending until deposit
                        payment proof is submitted and verified[cite: 1, 3].
                    </div>
                </div>
            </div>
        </div>
    );
}
