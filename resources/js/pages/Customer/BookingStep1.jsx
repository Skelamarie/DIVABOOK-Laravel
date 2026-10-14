import BookingFlow from '@/components/booking-flow';

export default function BookingStep1({
    selectedService,
    partner,
    occupiedSlotsMap = {},
    bookingOptions,
}) {
    return (
        <BookingFlow
            service={selectedService}
            salonProfile={{
                ...partner.branding,
                salon_name: partner.branding?.salon_name || partner.shop_name,
                location: partner.branding?.location || partner.address,
            }}
            occupiedSlotsMap={occupiedSlotsMap}
            bookingOptions={bookingOptions}
        />
    );
}
