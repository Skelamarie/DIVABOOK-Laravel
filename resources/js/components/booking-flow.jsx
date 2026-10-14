import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import B1 from '@/pages/Customer/B1';
import B2 from '@/pages/Customer/B2';
import P1 from '@/pages/Customer/P1';
import { money } from './booking-fields';

export default function BookingFlow({
    service,
    salonProfile = {},
    occupiedSlotsMap = {},
    bookingOptions,
    onBack,
}) {
    const [step, setStep] = useState(1);
    const form = useForm({
        service_id: String(service.id || service._id),
        service: 'catalog',
        size: 'standard',
        addon: 'none',
        removal: false,
        provider_chooses: !(service.category || '')
            .toLowerCase()
            .includes('nail'),
        reference_image: null,
        selected_date: '',
        selected_time: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        special_requests: '',
        terms_agreed: false,
        payment_strategy: 'downpayment',
        payment_method: '',
        sender_name: '',
        receipt_file: null,
    });
    const { data, setData, errors } = form;
    const selectedBase = bookingOptions.services[data.service] || {
        name: service.name,
        price: Number(service.rate || 0),
    };
    const total =
        Number(selectedBase.price) +
        bookingOptions.sizes[data.size] +
        bookingOptions.addons[data.addon] +
        (data.removal ? bookingOptions.removal : 0);
    const next = () => {
        setStep((value) => value + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const previous = () => {
        if (step === 1) onBack?.();
        else setStep((value) => value - 1);
    };

    const submit = (event) => {
        event.preventDefault();
        form.post('/bookings', {
            forceFormData: true,
            preserveScroll: true,
            onError: (serverErrors) => {
                const scheduling = [
                    'service_id',
                    'service',
                    'size',
                    'addon',
                    'removal',
                    'provider_chooses',
                    'reference_image',
                    'selected_date',
                    'selected_time',
                ];
                const personal = [
                    'first_name',
                    'last_name',
                    'email',
                    'phone',
                    'special_requests',
                    'terms_agreed',
                ];
                if (scheduling.some((field) => serverErrors[field])) setStep(1);
                else if (personal.some((field) => serverErrors[field]))
                    setStep(2);
            },
        });
    };
    const props = {
        data,
        setData,
        errors,
        onNext: next,
        onBack: previous,
        service,
        salonProfile,
        total,
        bookingOptions,
        occupiedSlotsMap,
    };

    return (
        <main
            className="booking-flow min-h-full rounded-xl p-4 sm:p-8"
            style={{
                '--booking-primary': salonProfile.color_primary || '#064E3B',
                '--booking-secondary':
                    salonProfile.color_secondary || '#7cbf7f',
            }}
        >
            <Head title="Book an appointment" />
            <h1 className="mb-2 text-2xl font-semibold">
                {salonProfile.salon_name || 'DivaBook'} — Book an appointment
            </h1>
            {salonProfile.location && (
                <p className="mb-5 text-sm text-stone-600">
                    {salonProfile.location}
                </p>
            )}
            <ol
                className="mb-6 grid grid-cols-3 gap-2 border-b border-stone-200 pb-4 text-sm"
                aria-label="Booking progress"
            >
                {['Scheduling', 'Personal Information', 'Payment'].map(
                    (label, index) => (
                        <li
                            key={label}
                            aria-current={
                                step === index + 1 ? 'step' : undefined
                            }
                            className={
                                step === index + 1
                                    ? 'font-bold text-emerald-800'
                                    : 'text-stone-500'
                            }
                        >
                            {index + 1}. {label}
                        </li>
                    ),
                )}
            </ol>
            {Object.keys(errors).length > 0 && (
                <div
                    role="alert"
                    className="mb-5 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-800"
                >
                    <p className="font-semibold">Please review your booking.</p>
                    {Object.entries(errors).map(([field, message]) => (
                        <p key={field}>{message}</p>
                    ))}
                </div>
            )}
            <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(240px,1fr)]">
                <div className="min-w-0">
                    {step === 1 ? (
                        <B1 {...props} />
                    ) : step === 2 ? (
                        <B2 {...props} />
                    ) : (
                        <P1
                            {...props}
                            processing={form.processing}
                            onSubmit={submit}
                        />
                    )}
                </div>
                <aside
                    className="h-fit space-y-3 rounded-xl border border-stone-200 bg-white p-5"
                    aria-label="Booking summary"
                >
                    <h2 className="font-semibold">Booking Summary</h2>
                    <p>{selectedBase.name}</p>
                    <p className="text-sm">
                        {data.selected_date || 'Choose a date'}{' '}
                        {data.selected_time}
                    </p>
                    <dl className="space-y-2 text-sm">
                        {[
                            ['Base service', selectedBase.price],
                            ['Size upgrade', bookingOptions.sizes[data.size]],
                            [
                                'Design add-on',
                                bookingOptions.addons[data.addon],
                            ],
                            [
                                'Removal',
                                data.removal ? bookingOptions.removal : 0,
                            ],
                        ].map(([label, price]) => (
                            <div
                                className="flex justify-between gap-4"
                                key={label}
                            >
                                <dt>{label}</dt>
                                <dd>{money(price)}</dd>
                            </div>
                        ))}
                    </dl>
                    <p className="flex justify-between border-t border-stone-200 pt-3 font-bold">
                        <span>Total</span>
                        <span>{money(total)}</span>
                    </p>
                    <p className="text-xs text-stone-600">
                        Your appointment remains pending until the provider
                        reviews your request and payment proof.
                    </p>
                </aside>
            </div>
        </main>
    );
}
