import { useState } from 'react';
import { BookingField, controlProps, money } from '@/components/booking-fields';

const methods = [
    ['gcash', 'GCash', '/qr/gcash.png'],
    ['paymaya', 'Maya', '/qr/maya.png'],
    ['shopeepay', 'ShopeePay', '/qr/spay.png'],
];

export default function P1({
    data,
    setData,
    errors,
    total,
    processing,
    onSubmit,
    onBack,
    salonProfile,
}) {
    const [fileError, setFileError] = useState('');
    const [missingQr, setMissingQr] = useState('');
    const amount =
        data.payment_strategy === 'full' ? total : Math.min(450, total);
    const imageChange = (event) => {
        const file = event.target.files?.[0] || null;
        if (
            file &&
            (!['image/jpeg', 'image/png'].includes(file.type) ||
                file.size > 5 * 1024 * 1024)
        ) {
            setFileError('Choose a JPG or PNG image no larger than 5 MB.');
            event.target.value = '';
            setData('receipt_file', null);
            return;
        }
        setFileError('');
        setData('receipt_file', file);
    };
    const selected = methods.find(([key]) => key === data.payment_method);

    return (
        <form
            encType="multipart/form-data"
            onSubmit={onSubmit}
            className="space-y-5"
        >
            <h2 className="text-xl font-semibold">Payment</h2>
            <fieldset className="space-y-3">
                <legend className="booking-label">Payment Amount</legend>
                {[
                    [
                        'downpayment',
                        'Downpayment — ' + money(Math.min(450, total)),
                    ],
                    ['full', 'Full payment — ' + money(total)],
                ].map(([key, label]) => (
                    <label key={key} className="booking-check-label">
                        <input
                            className="booking-check"
                            name="payment_strategy"
                            type="radio"
                            value={key}
                            checked={data.payment_strategy === key}
                            onChange={(event) =>
                                setData('payment_strategy', event.target.value)
                            }
                        />
                        {label}
                    </label>
                ))}
            </fieldset>
            <fieldset className="space-y-3">
                <legend className="booking-label">Payment Method</legend>
                {methods.map(([key, label]) => (
                    <label key={key} className="booking-check-label">
                        <input
                            className="booking-check"
                            name="payment_method"
                            type="radio"
                            value={key}
                            checked={data.payment_method === key}
                            onChange={(event) =>
                                setData('payment_method', event.target.value)
                            }
                            required
                        />
                        {label}
                    </label>
                ))}
            </fieldset>
            {selected && (
                <div className="rounded-lg border border-stone-200 bg-white p-4 text-sm">
                    <p className="font-semibold">
                        Send {money(amount)} using {selected[1]}.
                    </p>
                    {missingQr === selected[0] ? (
                        <p className="mt-3 text-stone-600">
                            Ask your provider for their payment QR code.
                        </p>
                    ) : (
                        <img
                            src={
                                salonProfile.payment_qr?.[
                                    data.payment_method
                                ] || selected[2]
                            }
                            onError={() => setMissingQr(selected[0])}
                            alt={selected[1] + ' payment QR code'}
                            className="mx-auto mt-3 size-44 object-contain"
                        />
                    )}
                    <p className="mt-2">
                        Use the payment details confirmed by your provider
                        before sending payment.
                    </p>
                </div>
            )}
            <BookingField
                label="Sender Name"
                id="sender_name"
                error={errors.sender_name}
            >
                <input
                    {...controlProps('sender_name', errors)}
                    type="text"
                    autoComplete="name"
                    value={data.sender_name}
                    onChange={(event) =>
                        setData('sender_name', event.target.value)
                    }
                    placeholder="Name on the payment account"
                    required
                    maxLength={255}
                    pattern=".*\S.*"
                />
            </BookingField>
            <BookingField
                label="Payment Receipt (JPG/PNG, up to 5 MB)"
                id="receipt_file"
                error={fileError || errors.receipt_file}
            >
                <input
                    {...controlProps('receipt_file', errors)}
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={imageChange}
                    required={!data.receipt_file}
                />
                {data.receipt_file && (
                    <p className="mt-1 text-sm break-all text-stone-600">
                        Selected: {data.receipt_file.name}
                    </p>
                )}
            </BookingField>
            <p className="text-sm text-stone-600">
                Payment proof will be reviewed by the provider. Uploading it
                does not automatically confirm payment.
            </p>
            <div className="flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={onBack}
                    disabled={processing}
                    className="rounded-lg border border-stone-300 px-5 py-3 disabled:opacity-50"
                >
                    Back to Personal Information
                </button>
                <button
                    type="submit"
                    disabled={
                        processing || !data.payment_method || !data.receipt_file
                    }
                    className="rounded-lg bg-emerald-900 px-5 py-3 font-semibold text-white disabled:opacity-50"
                >
                    {processing ? 'Submitting…' : 'Submit Booking'}
                </button>
            </div>
        </form>
    );
}
