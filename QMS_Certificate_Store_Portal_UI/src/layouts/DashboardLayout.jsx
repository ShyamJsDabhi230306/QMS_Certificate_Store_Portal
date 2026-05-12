import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
            <main className="flex-1 lg:ml-64 flex flex-col min-w-0">
                <header className="h-20 border-b border-border bg-card flex items-center justify-between px-8 sticky top-0 z-30">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-2xl">☰</button>
                    <div className="flex items-center gap-6">
                        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="p-2 rounded-full hover:bg-muted transition-colors text-xl">
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-border">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold leading-none">Admin User</p>
                                <p className="text-[10px] font-bold text-[#ffcc00] uppercase tracking-widest mt-1">Super Admin</p>
                            </div>
                            <div className="h-10 w-10 bg-[#ffcc00] rounded-full flex items-center justify-center font-bold text-black shadow-md">AD</div>
                        </div>
                    </div>
                </header>
                <div className="p-6 md:p-10">{children}</div>
            </main>
        </div>
    );
};

export default DashboardLayout;
