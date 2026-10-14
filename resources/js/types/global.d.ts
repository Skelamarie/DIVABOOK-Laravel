import type { Auth } from '@/types/auth';

declare module 'react' {
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            partnerSession: {
                admin_id: string | null;
                shop_name: string | null;
            };
            [key: string]: unknown;
        };
    }
}
