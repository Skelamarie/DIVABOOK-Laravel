import { Head } from '@inertiajs/react';

type Client = {
    name: string;
    email: string;
    phone: string;
    bookings_count: number;
};

export default function Clients({ clients = [] }: { clients?: Client[] }) {
    return (
        <main className="space-y-6 p-6">
            <Head title="Clients" />
            <h1 className="text-2xl font-semibold">Client</h1>
            <div className="overflow-x-auto rounded-xl border">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted">
                        <tr>
                            {['Name', 'Email', 'Phone', 'Bookings'].map(
                                (label) => (
                                    <th key={label} scope="col" className="p-4">
                                        {label}
                                    </th>
                                ),
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client, index) => (
                            <tr
                                key={client.email || index}
                                className="border-t"
                            >
                                <td className="p-4">{client.name}</td>
                                <td className="p-4">{client.email}</td>
                                <td className="p-4">{client.phone}</td>
                                <td className="p-4">{client.bookings_count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {clients.length === 0 && (
                    <p className="text-muted-foreground p-6">
                        Clients will appear here when they submit a booking.
                    </p>
                )}
            </div>
        </main>
    );
}
