import { ReactNode } from 'react';
import Navbar from "../Components/Navbar.tsx";
import Footer from "../Components/Footer.tsx";

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />
            <main className="flex-1 flex items-center justify-center px-4">
                {children}
            </main>
            <Footer />
        </div>
    );
}

