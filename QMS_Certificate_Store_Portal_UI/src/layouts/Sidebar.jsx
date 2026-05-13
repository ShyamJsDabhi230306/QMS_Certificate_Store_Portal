import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { navConfig } from '../routes/navConfig';

import { cn } from "@/lib/utils";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');



    const [openProfile, setOpenProfile] = useState(false);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
    }, [theme]);

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const loginTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden" onClick={toggleSidebar} />}
            <aside className={cn(
                "fixed top-0 left-0 z-50 h-screen w-72 border-r border-border bg-sidebar transition-all duration-500 ease-in-out flex flex-col shadow-2xl lg:shadow-none",
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="h-24 flex items-center px-10 border-b border-border bg-muted/20">
                    <span className="text-2xl font-black tracking-[-0.05em] uppercase text-foreground">
                        QMS <span className="text-gold italic font-extrabold">PORTAL</span>
                    </span>
                </div>

                <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
                    <div className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground px-4">
                        Main Navigation
                    </div>
                    {navConfig.filter(i => i.showInSidebar).map((item) => {
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
                                <span className={cn(
                                    "text-lg transition-transform duration-300 group-hover:scale-110",
                                    isActive ? "text-white" : "text-muted-foreground group-hover:text-gold"
                                )}>
                                    {item.icon}
                                </span>
                                <span className="tracking-tight">{item.title}</span>

                                {isActive && (
                                    <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-full" />
                                )}
                            </Link>
                        );
                    })}
                </nav>



                <div className="relative p-5 border-t border-[#1F2937] flex justify-start">

                    {/* PROFILE BUTTON */}
                    <button
                        onClick={() => setOpenProfile(!openProfile)}
                        className="
        w-14 h-14
        rounded-2xl
        border-2 border-[#D4A95A]
        bg-gradient-to-br from-[#7C3AED] to-[#5B21B6]
        flex items-center justify-center
        text-white
        font-black
        text-lg
        shadow-[0_0_25px_rgba(124,58,237,0.45)]
        hover:scale-105
        transition-all duration-300
        "
                    >
                        {user?.userFullName
                            ? user.userFullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                            : "Admin"}
                    </button>

                    {/* POPUP */}
                    {openProfile && (
                        <div
                            className="
            fixed
            bottom-24
            left-24
            w-[340px]
            rounded-[30px]
            overflow-hidden
            bg-[#081120]
            border border-[#1E293B]
            shadow-[0_25px_90px_rgba(0,0,0,0.75)]
            z-[99999]
            "
                        >

                            {/* HEADER */}
                            <div className="px-7 py-7 bg-gradient-to-br from-[#101B32] to-[#0B1220] border-b border-[#1F2937]">

                                <div className="flex items-center gap-5">

                                    {/* AVATAR */}
                                    <div
                                        className="
            w-20 h-20
            rounded-full
            border-[3px] border-[#D4A95A]
            bg-gradient-to-br from-[#7C3AED] to-[#5B21B6]
            flex items-center justify-center
            text-white text-2xl font-black
            shadow-[0_0_30px_rgba(124,58,237,0.45)]
            "
                                    >
                                        {user?.userFullName
                                            ? user.userFullName
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .slice(0, 2)
                                            : "RD"}
                                    </div>

                                    {/* INFO */}
                                    <div className="flex flex-col">

                                        {/* NAME */}
                                        <h2 className="text-white text-xl font-black leading-tight tracking-tight">
                                            {user?.userFullName || "Ram Dabhi"}
                                        </h2>

                                        {/* DESIGNATION */}
                                        <p className="text-[#D4A95A] text-xs font-bold uppercase tracking-[0.2em] mt-2">
                                            {user?.designationName || "Software Engineer"}
                                        </p>

                                        {/* DEPARTMENT */}
                                        <div
                                            className="
                mt-3
                px-4 py-1.5
                rounded-full
                bg-[#374151]
                text-[#F3F4F6]
                text-[10px]
                font-black
                tracking-[0.25em]
                uppercase
                inline-flex
                w-fit
                "
                                        >
                                            {user?.departmentName || "IT Department"}
                                        </div>
                                    </div>
                                </div>
                            </div>



                            {/* DIVIDER */}
                            <div className="border-t border-[#1F2937]" />

                            {/* ACTIONS */}
                            <div className="p-7 flex flex-col gap-4">

                                {/* THEME */}
                                <button
                                    onClick={() =>
                                        setTheme(theme === "light" ? "dark" : "light")
                                    }
                                    className="
                    flex items-center gap-4
                    px-4 py-4
                    rounded-2xl
                    bg-[#111827]
                    border border-[#243041]
                    hover:border-[#D4A95A]
                    transition-all duration-300
                    "
                                >
                                    <div className="w-11 h-11 rounded-xl bg-[#2A1F0A] flex items-center justify-center text-[#D4A95A]">
                                        ☀
                                    </div>

                                    <span className="text-white font-bold text-sm">
                                        {theme === "light"
                                            ? "Dark Mode"
                                            : "Light Mode"}
                                    </span>
                                </button>

                                {/* LOGOUT */}
                                <button
                                    onClick={() => {
                                        localStorage.clear();
                                        navigate("/login");
                                    }}
                                    className="
                    flex items-center gap-4
                    px-4 py-4
                    rounded-2xl
                    bg-[#111827]
                    border border-[#243041]
                    hover:border-red-500
                    hover:bg-red-500/10
                    transition-all duration-300
                    "
                                >
                                    <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                                        ↪
                                    </div>

                                    <span className="text-red-500 font-bold text-sm">
                                        Sign Out
                                    </span>
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

