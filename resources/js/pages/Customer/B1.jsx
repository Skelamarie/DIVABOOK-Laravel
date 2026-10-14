import BookingPolicy from '@/components/booking-policy';
import { useEffect, useState } from 'react';
import {
    BookingCheck,
    BookingField,
    controlProps,
    localDate,
    appointmentIsPast,
    slots,
    money,
} from '@/components/booking-fields';

export default function B1({
    data,
    setData,
    errors,
    service,
    bookingOptions,
    occupiedSlotsMap,
    onNext,
    onBack,
}) {
    const [preview, setPreview] = useState('');
    const [localError, setLocalError] = useState('');
    const [showPolicy, setShowPolicy] = useState(false);
    useEffect(() => {
        if (!data.reference_image) {
            setPreview('');
            return;
        }
        const url = URL.createObjectURL(data.reference_image);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [data.reference_image]);
    const occupied = occupiedSlotsMap[data.selected_date] || [];
    const nailService = (service.category || '').toLowerCase().includes('nail');
    const submit = (event) => {
        event.preventDefault();
        if (
            occupied.includes(data.selected_time) ||
            appointmentIsPast(data.selected_date, data.selected_time)
        ) {
            setLocalError(
                'Please choose an available future appointment time.',
            );
            return;
        }
        if (!data.provider_chooses && !data.reference_image) {
            setLocalError(
                'Upload a reference image or let the provider choose the design.',
            );
            return;
        }
        setLocalError('');
        onNext();
    };
    const imageChange = (event) => {
        const file = event.target.files?.[0] || null;
        if (
            file &&
            (!['image/jpeg', 'image/png'].includes(file.type) ||
                file.size > 5 * 1024 * 1024)
        ) {
            setLocalError('Choose a JPG or PNG image no larger than 5 MB.');
            event.target.value = '';
            setData('reference_image', null);
            return;
        }
        setLocalError('');
        setData('reference_image', file);
    };

    return (
        <form
            encType="multipart/form-data"
            onSubmit={submit}
            className="space-y-5"
        >
            <h2 className="text-xl font-semibold">Scheduling</h2>
            {localError && (
                <p role="alert" className="text-sm text-red-700">
                    {localError}
                </p>
            )}
            <BookingField label="Service" id="service" error={errors.service}>
                <select
                    {...controlProps('service', errors)}
                    value={data.service}
                    onChange={(event) => setData('service', event.target.value)}
                >
                    <option value="catalog">
                        {service.name} — {money(service.rate)}
                    </option>
                    {nailService &&
                        Object.entries(bookingOptions.services).map(
                            ([key, item]) => (
                                <option key={key} value={key}>
                                    {item.name} — {money(item.price)}
                                </option>
                            ),
                        )}
                </select>
            </BookingField>
            {nailService && (
                <div className="grid gap-5 sm:grid-cols-2">
                    <BookingField
                        label="Base Coat Size"
                        id="size"
                        error={errors.size}
                    >
                        <select
                            {...controlProps('size', errors)}
                            value={data.size}
                            onChange={(event) =>
                                setData('size', event.target.value)
                            }
                        >
                            <option value="standard">Standard</option>
                            <option value="xl">
                                I – XXL (+{money(bookingOptions.sizes.xl)})
                            </option>
                        </select>
                    </BookingField>
                    <BookingField
                        label="Design Add-on"
                        id="addon"
                        error={errors.addon}
                    >
                        <select
                            {...controlProps('addon', errors)}
                            value={data.addon}
                            onChange={(event) =>
                                setData('addon', event.target.value)
                            }
                        >
                            {Object.entries(bookingOptions.addons).map(
                                ([key, price]) => (
                                    <option key={key} value={key}>
                                        {key === 'none'
                                            ? 'No add-on'
                                            : key.charAt(0).toUpperCase() +
                                              key.slice(1) +
                                              ' (+' +
                                              money(price) +
                                              ')'}
                                    </option>
                                ),
                            )}
                        </select>
                    </BookingField>
                </div>
            )}
            {nailService && (
                <div className="space-y-3">
                    <p className="text-sm text-stone-600">
                        Design prices may vary with complexity. Confirm detailed
                        designs and any extra cash charges with your provider
                        before payment.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-3">
                        {[
                            [
                                'basic',
                                'Minimal design, 1–2 accent stones, plain or French tip',
                            ],
                            [
                                'moderate',
                                'Cat eye, stickers, chromes, embossed design',
                            ],
                            [
                                'heavy',
                                'Freehand nail art, unlimited stones, 3D nail art',
                            ],
                        ].map(([key, description]) => (
                            <button
                                type="button"
                                key={key}
                                onClick={() => setData('addon', key)}
                                aria-pressed={data.addon === key}
                                className={
                                    'rounded-lg border bg-white p-3 text-left ' +
                                    (data.addon === key
                                        ? 'border-emerald-800 ring-1 ring-emerald-800'
                                        : 'border-stone-200')
                                }
                            >
                                <img
                                    src={'/img/' + key + '.png'}
                                    alt={key + ' design example'}
                                    className="mb-2 aspect-square w-full rounded object-cover"
                                />
                                <span className="block text-sm font-semibold capitalize">
                                    {key}
                                </span>
                                <span className="block text-xs text-stone-600">
                                    {description}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
            {nailService && (
                <BookingCheck
                    name="removal"
                    label={
                        'Add old gel removal (+' +
                        money(bookingOptions.removal) +
                        ')'
                    }
                    checked={data.removal}
                    onChange={(checked) => setData('removal', checked)}
                    error={errors.removal}
                />
            )}
            <BookingCheck
                name="provider_chooses"
                label="Service provider will choose the design"
                checked={data.provider_chooses}
                onChange={(checked) => setData('provider_chooses', checked)}
                error={errors.provider_chooses}
            />
            {!data.provider_chooses && (
                <BookingField
                    label="Reference Image (JPG/PNG, up to 5 MB)"
                    id="reference_image"
                    error={errors.reference_image}
                >
                    <input
                        {...controlProps('reference_image', errors)}
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={imageChange}
                        required={!data.reference_image}
                    />
                    {preview && (
                        <div className="mt-3">
                            <img
                                src={preview}
                                alt="Your selected design reference"
                                className="max-h-48 rounded-lg"
                            />
                            <button
                                type="button"
                                className="mt-2 text-sm text-red-700 underline"
                                onClick={() => {
                                    setData('reference_image', null);
                                    document.getElementById(
                                        'reference_image',
                                    ).value = '';
                                }}
                            >
                                Remove reference image
                            </button>
                        </div>
                    )}
                </BookingField>
            )}
            <div className="grid gap-5 sm:grid-cols-2">
                <BookingField
                    label="Date"
                    id="selected_date"
                    error={errors.selected_date}
                >
                    <input
                        {...controlProps('selected_date', errors)}
                        type="date"
                        min={localDate(new Date())}
                        value={data.selected_date}
                        onChange={(event) => {
                            setData((current) => ({
                                ...current,
                                selected_date: event.target.value,
                                selected_time: '',
                            }));
                        }}
                        required
                    />
                </BookingField>
                <BookingField
                    label="Time"
                    id="selected_time"
                    error={errors.selected_time}
                >
                    <select
                        {...controlProps('selected_time', errors)}
                        value={data.selected_time}
                        onChange={(event) =>
                            setData('selected_time', event.target.value)
                        }
                        required
                    >
                        <option value="">Choose a time</option>
                        {slots.map((slot) => (
                            <option
                                key={slot}
                                disabled={
                                    occupied.includes(slot) ||
                                    appointmentIsPast(data.selected_date, slot)
                                }
                                value={slot}
                            >
                                {slot}
                                {occupied.includes(slot) ? ' (Booked)' : ''}
                            </option>
                        ))}
                    </select>
                </BookingField>
            </div>
            <button
                type="button"
                className="text-sm text-emerald-800 underline"
                aria-expanded={showPolicy}
                onClick={() => setShowPolicy((value) => !value)}
            >
                Read booking policies
            </button>
            {showPolicy && (
                <div className="rounded-lg border border-stone-200 bg-white p-4 text-sm">
                    <BookingPolicy />
                </div>
            )}
            <div className="flex flex-wrap gap-3">
                {onBack && (
                    <button
                        type="button"
                        onClick={onBack}
                        className="rounded-lg border border-stone-300 px-5 py-3"
                    >
                        Back
                    </button>
                )}
                <button
                    type="submit"
                    className="rounded-lg bg-emerald-900 px-5 py-3 font-semibold text-white"
                >
                    Continue to Personal Information
                </button>
            </div>
        </form>
    );
}
