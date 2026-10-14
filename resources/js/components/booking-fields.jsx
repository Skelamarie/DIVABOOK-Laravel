export function BookingField({ label, error, children, id }) {
    return (
        <div className="min-w-0">
            <label htmlFor={id} className="booking-label">
                {label}
            </label>
            {children}
            {error && (
                <p
                    id={id + '-error'}
                    role="alert"
                    className="mt-1 text-sm text-red-700"
                >
                    {error}
                </p>
            )}
        </div>
    );
}

export function BookingCheck({
    label,
    name,
    checked,
    onChange,
    error,
    required = false,
}) {
    return (
        <div>
            <label className="booking-check-label" htmlFor={name}>
                <input
                    id={name}
                    name={name}
                    type="checkbox"
                    className="booking-check"
                    checked={checked}
                    onChange={(event) => onChange(event.target.checked)}
                    required={required}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? name + '-error' : undefined}
                />
                <span>{label}</span>
            </label>
            {error && (
                <p
                    id={name + '-error'}
                    role="alert"
                    className="mt-1 text-sm text-red-700"
                >
                    {error}
                </p>
            )}
        </div>
    );
}

export const controlProps = (name, errors) => ({
    id: name,
    name,
    className: 'booking-field',
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? name + '-error' : undefined,
});
export const money = (value) =>
    new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    }).format(Number(value) || 0);
export const slots = ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM'];
export const localDate = (date) =>
    [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
    ].join('-');
export const appointmentIsPast = (date, time) => {
    if (!date || !time) return false;
    const [clock, meridiem] = time.split(' ');
    const [hours, minutes] = clock.split(':').map(Number);
    return (
        new Date(
            date +
                'T' +
                String((hours % 12) + (meridiem === 'PM' ? 12 : 0)).padStart(
                    2,
                    '0',
                ) +
                ':' +
                String(minutes).padStart(2, '0') +
                ':00+08:00',
        ) <= new Date()
    );
};
