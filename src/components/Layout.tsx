import { useEffect } from 'react';

export function Layout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Force Arabic RTL
        document.dir = 'rtl';
        document.documentElement.lang = 'ar';
        // Beautiful Arabic font - Tajawal
        document.body.style.fontFamily = '"Tajawal", "Cairo", sans-serif';
    }, []);

    return <>{children}</>;
}
