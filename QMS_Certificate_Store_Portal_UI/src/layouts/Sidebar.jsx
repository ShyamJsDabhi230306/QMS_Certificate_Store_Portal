import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { navConfig } from '../routes/navConfig';
import { ChevronDown, ChevronRight, Folder, Settings, ArrowLeftRight } from 'lucide-react';
import { cn } from "@/lib/utils";
import air from "../assets/air.jpeg"

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [openProfile, setOpenProfile] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setOpenProfile(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 1. Sidebar dropdown toggle state
    const [expandedCategories, setExpandedCategories] = useState({
        Masters: true,
        Transactions: true,
        Configurations: true
    });

    // 2. Maps pages to categories
    const getCategory = (title) => {
        switch (title) {
            case "Company Master":
            case "Location Master":
            case "Department Master":
            case "Designation Master":
            case "Certificate Type":
                return "Masters";
            case "User Management":
            case "Page Master":
            case "User Rights":
                return "Configurations";
            case "Transaction Page":
            case "Transactions":
            case "Certificate":
                return "Transactions";
            default:
                return null; // Renders flat (e.g. Dashboard)
        }
    };

    // 3. Smart Auto-Expand active page's group
    useEffect(() => {
        const activeItem = navConfig.find(item => item.path === location.pathname);
        if (activeItem) {
            const cat = getCategory(activeItem.title);
            if (cat) {
                setExpandedCategories(prev => ({ ...prev, [cat]: true }));
            }
        }
    }, [location.pathname]);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
    }, [theme]);

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden" onClick={toggleSidebar} />}
            <aside className={cn(
                "fixed top-0 left-0 z-50 h-screen w-72 border-r border-border bg-sidebar transition-all duration-500 ease-in-out flex flex-col shadow-2xl lg:shadow-none",
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                {/* <div className="h-24 flex items-center px-10 border-b border-border bg-muted/20">
                    <span className="text-2xl font-black tracking-[-0.05em] uppercase text-foreground">
                        QMS <span className="text-gold italic font-extrabold">PORTAL</span>
                    </span>
                </div> */}
                <div
                    className="
        h-24 w-72
        overflow-hidden
        
        bg-card
        border border-border
        shadow-sm
        flex items-center justify-center
        p-3
        transition-all duration-300
    "
                >
                    <img
                        src={air}
                        alt="Aira Euro Automation"
                        className="
            max-w-full
            max-h-full
            object-contain
            rounded-lg
        "
                    />
                </div>
                <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
                    <div className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground px-4">
                        Main Navigation
                    </div>

                    {/* Flat Items (Dashboard) */}
                    {navConfig.filter(i => i.showInSidebar && getCategory(i.title) === null).map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path} to={item.path}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 group relative overflow-hidden",
                                    isActive
                                        ? "bg-gold text-white shadow-lg shadow-gold/20 translate-x-1"
                                        : "text-sidebar-foreground hover:bg-muted hover:text-foreground hover:translate-x-1"
                                )}
                            >
                                <span className={cn("text-lg transition-transform", isActive ? "text-white" : "text-muted-foreground group-hover:text-gold")}>
                                    {item.icon}
                                </span>
                                <span className="tracking-tight">{item.title}</span>
                                {isActive && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-full" />}
                            </Link>
                        );
                    })}

                    {/* Categorized Dropdowns */}
                    {[
                        { id: 'Masters', title: 'Masters', icon: <Folder size={16} strokeWidth={2.5} className="text-gold" /> },
                        { id: 'Transactions', title: 'Transactions', icon: <ArrowLeftRight size={16} strokeWidth={2.5} className="text-gold" /> },
                        { id: 'Configurations', title: 'Configurations', icon: <Settings size={16} strokeWidth={2.5} className="text-gold" /> }
                    ].map((cat) => {
                        const categoryItems = navConfig.filter(i => i.showInSidebar && getCategory(i.title) === cat.id);
                        if (categoryItems.length === 0) return null;

                        const isExpanded = expandedCategories[cat.id];
                        const hasActiveChild = categoryItems.some(i => location.pathname === i.path);

                        return (
                            <div key={cat.id} className="space-y-1">
                                {/* Header Toggle Button */}
                                <button
                                    onClick={() => setExpandedCategories(prev => ({ ...prev, [cat.id]: !prev[cat.id] }))}
                                    className={cn(
                                        "w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 hover:bg-muted/50 group text-sidebar-foreground",
                                        hasActiveChild && "text-gold font-extrabold"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-lg transition-transform group-hover:scale-110">{cat.icon}</span>
                                        <span className="tracking-tight">{cat.title}</span>
                                    </div>
                                    <span className="text-muted-foreground group-hover:text-gold transition-colors">
                                        {isExpanded ? <ChevronDown size={16} strokeWidth={3} /> : <ChevronRight size={16} strokeWidth={3} />}
                                    </span>
                                </button>

                                {/* Child Links */}
                                {isExpanded && (
                                    <div className="ml-5 pl-4 border-l-2 border-border/30 space-y-1 animate-in fade-in slide-in-from-top-1 duration-300">
                                        {categoryItems.map((item) => {
                                            const isActive = location.pathname === item.path;
                                            return (
                                                <Link
                                                    key={item.path} to={item.path}
                                                    className={cn(
                                                        "flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 group relative overflow-hidden",
                                                        isActive
                                                            ? "bg-gold text-white shadow-lg shadow-gold/10 translate-x-1"
                                                            : "text-sidebar-foreground/80 hover:bg-muted hover:text-foreground hover:translate-x-1"
                                                    )}
                                                >
                                                    <span className={cn("text-base transition-transform group-hover:scale-110", isActive ? "text-white" : "text-muted-foreground group-hover:text-gold")}>
                                                        {item.icon}
                                                    </span>
                                                    <span className="tracking-tight">{item.title}</span>
                                                    {isActive && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-full" />}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                <div ref={profileRef} className="relative p-5 border-t border-[#1F2937] flex justify-start">
                    {/* Profile Button */}
                    <button
                        onClick={() => setOpenProfile(!openProfile)}
                        className="w-14 h-14 rounded-2xl border-2 border-[#D4A95A] bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] flex items-center justify-center text-white font-black text-lg shadow-lg hover:scale-105 transition-all duration-300"
                    >
                        {user?.userFullName ? user.userFullName.split(" ").map((n) => n[0]).join("").slice(0, 2) : "AD"}
                    </button>

                    {/* Profile Modal Popup */}
                    {openProfile && (
                        <div className="fixed bottom-24 left-24 w-[340px] rounded-[30px] overflow-hidden bg-[#081120] border border-[#1E293B] shadow-2xl z-[99999]">
                            <div className="px-7 py-7 bg-gradient-to-br from-[#101B32] to-[#0B1220] border-b border-[#1F2937]">
                                <div className="flex items-center gap-5">
                                    <div className="w-20 h-20 rounded-full border-[3px] border-[#D4A95A] bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] flex items-center justify-center text-white text-2xl font-black">
                                        {user?.userFullName ? user.userFullName.split(" ").map((n) => n[0]).join("").slice(0, 2) : "RD"}
                                    </div>
                                    <div className="flex flex-col">
                                        <h2 className="text-white text-xl font-black leading-tight tracking-tight">{user?.userFullName || "Admin"}</h2>
                                        <p className="text-[#D4A95A] text-xs font-bold uppercase tracking-[0.2em] mt-2">{user?.designationName || "Administrator"}</p>
                                        <div className="mt-3 px-4 py-1.5 rounded-full bg-[#374151] text-[#F3F4F6] text-[10px] font-black tracking-[0.25em] uppercase inline-flex w-fit">
                                            {user?.departmentName || "Management"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-7 flex flex-col gap-4">
                                <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-[#111827] border border-[#243041] hover:border-[#D4A95A] transition-all">
                                    <div className="w-11 h-11 rounded-xl bg-[#2A1F0A] flex items-center justify-center text-[#D4A95A]">☀</div>
                                    <span className="text-white font-bold text-sm">{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
                                </button>
                                <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-[#111827] border border-[#243041] hover:border-red-500 hover:bg-red-500/10 transition-all">
                                    <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">↪</div>
                                    <span className="text-red-500 font-bold text-sm">Sign Out</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
