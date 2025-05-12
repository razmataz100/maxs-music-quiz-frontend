import { ReactNode } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-100 to-gray-200">
            <Navbar/>
            <main className="flex-1 flex items-center justify-center px-4 p-5">
                {children}
            </main>
            <Footer/>
        </div>
    );
}
