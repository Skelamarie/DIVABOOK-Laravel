import BookingPolicy from '@/components/booking-policy';
import {
    BookingCheck,
    BookingField,
    controlProps,
} from '@/components/booking-fields';

export default function B2({ data, setData, errors, onNext, onBack }) {
    const submit = (event) => {
        event.preventDefault();
        onNext();
    };
    return (
        <form onSubmit={submit} className="space-y-5">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            <div className="grid gap-5 sm:grid-cols-2">
                <BookingField
                    label="First Name"
                    id="first_name"
                    error={errors.first_name}
                >
                    <input
                        {...controlProps('first_name', errors)}
                        autoComplete="given-name"
                        type="text"
                        value={data.first_name}
                        onChange={(event) =>
                            setData('first_name', event.target.value)
                        }
                        required
                        maxLength={100}
                        pattern=".*\S.*"
                    />
                </BookingField>
                <BookingField
                    label="Last Name"
                    id="last_name"
                    error={errors.last_name}
                >
                    <input
                        {...controlProps('last_name', errors)}
                        autoComplete="family-name"
                        type="text"
                        value={data.last_name}
                        onChange={(event) =>
                            setData('last_name', event.target.value)
                        }
                        required
                        maxLength={100}
                        pattern=".*\S.*"
                    />
                </BookingField>
            </div>
            <BookingField label="Email" id="email" error={errors.email}>
                <input
                    {...controlProps('email', errors)}
                    autoComplete="email"
                    type="email"
                    value={data.email}
                    onChange={(event) => setData('email', event.target.value)}
                    required
                    maxLength={255}
                />
            </BookingField>
            <BookingField label="Phone Number" id="phone" error={errors.phone}>
                <input
                    {...controlProps('phone', errors)}
                    autoComplete="tel"
                    type="tel"
                    inputMode="tel"
                    placeholder="09123456789 or +639123456789"
                    value={data.phone}
                    onChange={(event) => setData('phone', event.target.value)}
                    required
                    pattern="(09[0-9]{9}|9[0-9]{9}|\+639[0-9]{9})"
                />
                <p className="mt-1 text-xs text-stone-600">
                    Enter your Philippine mobile number without spaces.
                </p>
            </BookingField>
            <BookingField
                label="Special Requests (optional)"
                id="special_requests"
                error={errors.special_requests}
            >
                <textarea
                    {...controlProps('special_requests', errors)}
                    rows={4}
                    maxLength={5000}
                    value={data.special_requests}
                    onChange={(event) =>
                        setData('special_requests', event.target.value)
                    }
                    placeholder="Allergies, preferences, or details for your provider"
                />
            </BookingField>
            <details className="rounded-lg border border-stone-200 bg-white p-4 text-sm">
                <summary className="cursor-pointer font-semibold">
                    Booking Terms and Conditions
                </summary>
                <div className="mt-3">
                    <BookingPolicy />
                </div>
            </details>
            <BookingCheck
                name="terms_agreed"
                label="I have read and agree to the booking terms and conditions."
                checked={data.terms_agreed}
                onChange={(checked) => setData('terms_agreed', checked)}
                error={errors.terms_agreed}
                required
            />
            <div className="flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={onBack}
                    className="rounded-lg border border-stone-300 px-5 py-3"
                >
                    Back to Scheduling
                </button>
                <button
                    type="submit"
                    className="rounded-lg bg-emerald-900 px-5 py-3 font-semibold text-white"
                >
                    Continue to Payment
                </button>
            </div>
        </form>
    );
}
