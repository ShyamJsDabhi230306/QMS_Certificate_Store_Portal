import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { navConfig } from '../routes/navConfig';
import { cn } from "@/lib/utils";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={toggleSidebar} />}
            <aside className={cn(
                "fixed top-0 left-0 z-50 h-screen w-64 border-r border-border bg-sidebar transition-transform duration-300 flex flex-col",
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="h-20 flex items-center px-8 border-b border-border bg-muted/30">
                    <span className="text-xl font-bold tracking-tighter uppercase">QMS <span className="text-[#ffcc00]">Portal</span></span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navConfig.filter(i => i.showInSidebar).map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path} to={item.path}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all",
                                    isActive
                                        ? "bg-[#ffcc00] text-black shadow-lg shadow-yellow-500/20"
                                        : "text-sidebar-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span>{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border">
                    <button
                        onClick={() => { localStorage.clear(); navigate('/login'); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                        🚪 <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
