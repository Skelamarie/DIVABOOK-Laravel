export default function BookingPolicy() {
    return (
        <div className="grid gap-5 text-sm sm:grid-cols-2">
            <div className="space-y-2">
                <h3 className="font-semibold">LATE FEES:</h3>
                <ul className="list-disc space-y-1 pl-5">
                    <li>10 minutes late – ₱200</li>
                    <li>20 minutes or more – ₱500</li>
                    <li>Late fees help ensure timely appointments.</li>
                </ul>
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold">DEPOSIT : ₱450</h3>
                <ul className="list-disc space-y-1 pl-5">
                    <li>Deposits are non-refundable.</li>
                    <li>Rescheduling results in a forfeited deposit.</li>
                </ul>
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold">WARRANTY</h3>
                <ul className="list-disc space-y-1 pl-5">
                    <li>We offer a 1-week service warranty.</li>
                    <li>
                        Inform us of any skin allergies or medical conditions.
                    </li>
                </ul>
            </div>
        </div>
    );
}
