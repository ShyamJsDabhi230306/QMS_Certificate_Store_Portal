// import React, { useEffect, useState, useRef } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { navConfig } from '../routes/navConfig';
// import { ChevronDown, ChevronRight, Folder, Settings, ArrowLeftRight } from 'lucide-react';
// import { cn } from "@/lib/utils";
// import air from "../assets/air.jpeg"
// import logo from "@/assets/Logo_Aira-removebg-preview.png"
// import { companyService } from "../api/companyService";
// const Sidebar = ({ isOpen, toggleSidebar }) => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
//     const [openProfile, setOpenProfile] = useState(false);
//     const profileRef = useRef(null);
//      // this is for dynamic name for the company
//     const [company, setCompany] = useState(null);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (profileRef.current && !profileRef.current.contains(event.target)) {
//                 setOpenProfile(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

// //  this is the comapany call for it from backend 
//     const loadCompany = async () => {
//     try {
//         const response = await companyService.getAll();

//         if (!response?.success) {
//             return;
//         }

//         const companies = response.data || [];

//         const syncedCompany =
//             companies.find(
//                 item => item.isAiraSynced === true
//             ) || companies[0];

//         setCompany(syncedCompany || null);
//     } catch (error) {
//         console.error(
//             "Unable to load company name:",
//             error
//         );
//     }
// };
// // this is for the company name call from the backend 
// useEffect(() => {
//     loadCompany();

//     const handleCompanyChanged = () => {
//         loadCompany();
//     };

//     window.addEventListener(
//         "companyChanged",
//         handleCompanyChanged
//     );

//     return () => {
//         window.removeEventListener(
//             "companyChanged",
//             handleCompanyChanged
//         );
//     };
// }, []); 
//     // 1. Sidebar dropdown toggle state
//     const [expandedCategories, setExpandedCategories] = useState({
//         Masters: true,
//         Transactions: true,
//         Configurations: true
//     });

//     // 2. Maps pages to categories
//     const getCategory = (title) => {
//         switch (title) {
//             case "Company Master":
//             case "Location Master":
//             case "Department Master":
//             case "Designation Master":
//             case "Certificate Type":
//                 return "Masters";
//             case "User Management":
//             case "Page Master":
//             case "User Rights":
//                 return "Configurations";
//             case "Transaction Page":
//             case "Transactions":
//             case "Certificate":
//             case "Approval":
//                 // case "Reminder Center":
//                 return "Transactions";
//             default:
//                 return null; // Renders flat (e.g. Dashboard)
//         }
//     };

//     // 3. Smart Auto-Expand active page's group
//     useEffect(() => {
//         const activeItem = navConfig.find(item => item.path === location.pathname);
//         if (activeItem) {
//             const cat = getCategory(activeItem.title);
//             if (cat) {
//                 setExpandedCategories(prev => ({ ...prev, [cat]: true }));
//             }
//         }
//     }, [location.pathname]);

//     useEffect(() => {
//         document.documentElement.classList.toggle('dark', theme === 'dark');
//         localStorage.setItem('theme', theme);
//     }, [theme]);

//     const userStr = localStorage.getItem('user');
//     const user = userStr ? JSON.parse(userStr) : null;








  
//     return (
//         <>
//             {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden" onClick={toggleSidebar} />}
//             <aside className={cn(
//                 "fixed top-0 left-0 z-50 h-screen w-72 border-r border-border bg-sidebar transition-all duration-500 ease-in-out flex flex-col shadow-2xl lg:shadow-none",
//                 isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
//             )}>
//                 {/* <div className="h-24 flex items-center px-10 border-b border-border bg-muted/20">
//                     <span className="text-2xl font-black tracking-[-0.05em] uppercase text-foreground">
//                         QMS <span className="text-gold italic font-extrabold">PORTAL</span>
//                     </span>
//                 </div> */}
//                 {/* <div
//                     className="
//         h-24 w-72
//         overflow-hidden
        
//         bg-card
//         border border-border
//         shadow-sm
//         flex items-center justify-center
//         p-3
//         transition-all duration-300
//     "
//                 >
//                     <img
//                         src={theme === "light" ? air : logo}
//                         alt="Aira Euro Automation"
//                         className="
//             max-w-full
//             max-h-full
//             object-contain
//             rounded-lg
//         "
//                     />
//                 </div> */}
//                                 <div
//                     className="
//         h-24 w-72
//         bg-card
//         border-b border-border
//         shadow-sm
//         flex flex-col items-center justify-center
//         p-3
//         transition-all duration-300
//     "
//                 >
//                     <div className="text-center">
//                         {/* <p
//                             className="
//         text-xl
//         font-black
//         uppercase
//         tracking-tight
//         text-foreground
//         leading-none
//         "
//                         >
//                             Aira Euro Automation
//                         </p> */}


// <p
//     className="
//          text-xl
//         font-black
//         uppercase
//         tracking-tight
//         text-foreground
//         leading-none
//     "
// >
//     {company?.companyName || "QMS Certificate Portal"}
// </p>
//                         {/* <p
//                             className="
//         text-[15px]
//         font-black
//         text-gold
//         uppercase
//         tracking-[0.2em]
//         mt-1.5
//         leading-none
//         "
//                         >
//                             Pvt. Ltd.
//                         </p> */}
//                     </div>
//                 </div>

//                 <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
//                     <div className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground px-4">
//                         Main Navigation
//                     </div>
                        

                        
//                     {/* Flat Items (Dashboard) */}
//                     {navConfig.filter(i => i.showInSidebar && getCategory(i.title) === null).map((item) => {
//                         const isActive = location.pathname === item.path;
//                         return (
//                             <Link
//                                 key={item.path} to={item.path}
//                                 className={cn(
//                                     "flex items-center gap-4 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 group relative overflow-hidden",
//                                     isActive
//                                         ? "bg-gold text-white shadow-lg shadow-gold/20 translate-x-1"
//                                         : "text-sidebar-foreground hover:bg-muted hover:text-foreground hover:translate-x-1"
//                                 )}
//                             >
//                                 <span className={cn("text-lg transition-transform", isActive ? "text-white" : "text-muted-foreground group-hover:text-gold")}>
//                                     {item.icon}
//                                 </span>
//                                 <span className="tracking-tight">{item.title}</span>
//                                 {isActive && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-full" />}
//                             </Link>
//                         );
//                     })}

//                     {/* Categorized Dropdowns */}
//                     {[
//                         { id: 'Masters', title: 'Masters', icon: <Folder size={16} strokeWidth={2.5} className="text-gold" /> },
//                         { id: 'Transactions', title: 'Transactions', icon: <ArrowLeftRight size={16} strokeWidth={2.5} className="text-gold" /> },
//                         { id: 'Configurations', title: 'Configurations', icon: <Settings size={16} strokeWidth={2.5} className="text-gold" /> }
//                     ].map((cat) => {
//                         const categoryItems = navConfig.filter(i => i.showInSidebar && getCategory(i.title) === cat.id);
//                         if (categoryItems.length === 0) return null;

//                         const isExpanded = expandedCategories[cat.id];
//                         const hasActiveChild = categoryItems.some(i => location.pathname === i.path);

//                         return (
//                             <div key={cat.id} className="space-y-1">
//                                 {/* Header Toggle Button */}
//                                 <button
//                                     onClick={() => setExpandedCategories(prev => ({ ...prev, [cat.id]: !prev[cat.id] }))}
//                                     className={cn(
//                                         "w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 hover:bg-muted/50 group text-sidebar-foreground",
//                                         hasActiveChild && "text-gold font-extrabold"
//                                     )}
//                                 >
//                                     <div className="flex items-center gap-4">
//                                         <span className="text-lg transition-transform group-hover:scale-110">{cat.icon}</span>
//                                         <span className="tracking-tight">{cat.title}</span>
//                                     </div>
//                                     <span className="text-muted-foreground group-hover:text-gold transition-colors">
//                                         {isExpanded ? <ChevronDown size={16} strokeWidth={3} /> : <ChevronRight size={16} strokeWidth={3} />}
//                                     </span>
//                                 </button>

//                                 {/* Child Links */}
//                                 {isExpanded && (
//                                     <div className="ml-5 pl-4 border-l-2 border-border/30 space-y-1 animate-in fade-in slide-in-from-top-1 duration-300">
//                                         {categoryItems.map((item) => {
//                                             const isActive = location.pathname === item.path;
//                                             return (
//                                                 <Link
//                                                     key={item.path} to={item.path}
//                                                     className={cn(
//                                                         "flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 group relative overflow-hidden",
//                                                         isActive
//                                                             ? "bg-gold text-white shadow-lg shadow-gold/10 translate-x-1"
//                                                             : "text-sidebar-foreground/80 hover:bg-muted hover:text-foreground hover:translate-x-1"
//                                                     )}
//                                                 >
//                                                     <span className={cn("text-base transition-transform group-hover:scale-110", isActive ? "text-white" : "text-muted-foreground group-hover:text-gold")}>
//                                                         {item.icon}
//                                                     </span>
//                                                     <span className="tracking-tight">{item.title}</span>
//                                                     {isActive && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-full" />}
//                                                 </Link>
//                                             );
//                                         })}
//                                     </div>
//                                 )}
//                             </div>
//                         );
//                     })}
//                 </nav>

//                 <div ref={profileRef} className="relative p-5 border-t border-[#1F2937] flex justify-start">
//                     {/* Profile Button */}
//                     <button
//                         onClick={() => setOpenProfile(!openProfile)}
//                         className="w-14 h-14 rounded-2xl border-2 border-[#D4A95A] bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] flex items-center justify-center text-white font-black text-lg shadow-lg hover:scale-105 transition-all duration-300"
//                     >
//                         {user?.userFullName ? user.userFullName.split(" ").map((n) => n[0]).join("").slice(0, 2) : "AD"}
//                     </button>

//                     {/* Profile Modal Popup */}
//                     {openProfile && (
//                         <div className="fixed bottom-24 left-24 w-[340px] rounded-[30px] overflow-hidden bg-[#081120] border border-[#1E293B] shadow-2xl z-[99999]">
//                             <div className="px-7 py-7 bg-gradient-to-br from-[#101B32] to-[#0B1220] border-b border-[#1F2937]">
//                                 <div className="flex items-center gap-5">
//                                     <div className="w-20 h-20 rounded-full border-[3px] border-[#D4A95A] bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] flex items-center justify-center text-white text-2xl font-black">
//                                         {user?.userFullName ? user.userFullName.split(" ").map((n) => n[0]).join("").slice(0, 2) : "RD"}
//                                     </div>
//                                     <div className="flex flex-col">
//                                         <h2 className="text-white text-xl font-black leading-tight tracking-tight">{user?.userFullName || "Admin"}</h2>
//                                         <p className="text-[#D4A95A] text-xs font-bold uppercase tracking-[0.2em] mt-2">{user?.designationName || "Administrator"}</p>
//                                         <div className="mt-3 px-4 py-1.5 rounded-full bg-[#374151] text-[#F3F4F6] text-[10px] font-black tracking-[0.25em] uppercase inline-flex w-fit">
//                                             {user?.departmentName || "Management"}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="p-7 flex flex-col gap-4">
//                                 <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-[#111827] border border-[#243041] hover:border-[#D4A95A] transition-all">
//                                     <div className="w-11 h-11 rounded-xl bg-[#2A1F0A] flex items-center justify-center text-[#D4A95A]">☀</div>
//                                     <span className="text-white font-bold text-sm">{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
//                                 </button>
//                                 <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-[#111827] border border-[#243041] hover:border-red-500 hover:bg-red-500/10 transition-all">
//                                     <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">↪</div>
//                                     <span className="text-red-500 font-bold text-sm">Sign Out</span>
//                                 </button>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </aside>
//         </>
//     );
// };

// export default Sidebar;





import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    ArrowLeftRight,
    ChevronDown,
    ChevronRight,
    Folder,
    Settings,
} from "lucide-react";

import { navConfig } from "../routes/navConfig";
import { cn } from "@/lib/utils";
import { companyService } from "../api/companyService";
import { getAiraImageUrl } from "../utils/airaImage";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const profileRef = useRef(null);

    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    const [openProfile, setOpenProfile] = useState(false);
    const [company, setCompany] = useState(null);

    const [expandedCategories, setExpandedCategories] = useState({
        Masters: true,
        Transactions: true,
        Configurations: true,
    });

    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    const profileImage = getAiraImageUrl(
        user?.airaImageFileURL || user?.imageFileURL
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setOpenProfile(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle(
            "dark",
            theme === "dark"
        );

        localStorage.setItem("theme", theme);
    }, [theme]);

    const loadCompany = async () => {
        try {
            const response = await companyService.getAll();

            if (!response?.success) {
                return;
            }

            const companies = response.data || [];

            const syncedCompany =
                companies.find(
                    (item) => item.isAiraSynced === true
                ) || companies[0];

            setCompany(syncedCompany || null);
        } catch (error) {
            console.error("Unable to load company name:", error);
        }
    };

    useEffect(() => {
        loadCompany();

        const handleCompanyChanged = () => {
            loadCompany();
        };

        window.addEventListener(
            "companyChanged",
            handleCompanyChanged
        );

        return () => {
            window.removeEventListener(
                "companyChanged",
                handleCompanyChanged
            );
        };
    }, []);

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
            case "Approval":
                return "Transactions";

            default:
                return null;
        }
    };

    useEffect(() => {
        const activeItem = navConfig.find(
            (item) => item.path === location.pathname
        );

        if (!activeItem) {
            return;
        }

        const category = getCategory(activeItem.title);

        if (category) {
            setExpandedCategories((previous) => ({
                ...previous,
                [category]: true,
            }));
        }
    }, [location.pathname]);

    const toggleCategory = (category) => {
        setExpandedCategories((previous) => ({
            ...previous,
            [category]: !previous[category],
        }));
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const categories = [
        {
            id: "Masters",
            title: "Masters",
            icon: (
                <Folder
                    size={16}
                    strokeWidth={2.5}
                    className="text-gold"
                />
            ),
        },
        {
            id: "Transactions",
            title: "Transactions",
            icon: (
                <ArrowLeftRight
                    size={16}
                    strokeWidth={2.5}
                    className="text-gold"
                />
            ),
        },
        {
            id: "Configurations",
            title: "Configurations",
            icon: (
                <Settings
                    size={16}
                    strokeWidth={2.5}
                    className="text-gold"
                />
            ),
        },
    ];

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <aside
                className={cn(
                    "fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-border bg-sidebar shadow-2xl transition-all duration-500 ease-in-out lg:shadow-none",
                    isOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                )}
            >
                <div className="flex h-24 w-72 items-center justify-center border-b border-border bg-card px-4">
                    <p className="text-center text-xl font-black uppercase tracking-tight text-foreground">
                        {company?.companyName ||
                            "QMS Certificate Portal"}
                    </p>
                </div>

                <nav className="custom-scrollbar flex-1 space-y-2 overflow-y-auto p-6">
                    <div className="mb-4 px-4 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                        Main Navigation
                    </div>

                    {navConfig
                        .filter(
                            (item) =>
                                item.showInSidebar &&
                                getCategory(item.title) === null
                        )
                        .map((item) => {
                            const isActive =
                                location.pathname === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={cn(
                                        "group relative flex items-center gap-4 overflow-hidden rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all duration-300",
                                        isActive
                                            ? "translate-x-1 bg-gold text-white shadow-lg shadow-gold/20"
                                            : "text-sidebar-foreground hover:translate-x-1 hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "text-lg transition-transform",
                                            isActive
                                                ? "text-white"
                                                : "text-muted-foreground group-hover:text-gold"
                                        )}
                                    >
                                        {item.icon}
                                    </span>

                                    <span className="tracking-tight">
                                        {item.title}
                                    </span>

                                    {isActive && (
                                        <span className="absolute bottom-1/4 left-0 top-1/4 w-1 rounded-full bg-white" />
                                    )}
                                </Link>
                            );
                        })}

                    {categories.map((category) => {
                        const categoryItems = navConfig.filter(
                            (item) =>
                                item.showInSidebar &&
                                getCategory(item.title) === category.id
                        );

                        if (!categoryItems.length) {
                            return null;
                        }

                        const isExpanded =
                            expandedCategories[category.id];

                        const hasActiveChild = categoryItems.some(
                            (item) => location.pathname === item.path
                        );

                        return (
                            <div
                                key={category.id}
                                className="space-y-1"
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        toggleCategory(category.id)
                                    }
                                    className={cn(
                                        "group flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider text-sidebar-foreground transition-all duration-300 hover:bg-muted/50",
                                        hasActiveChild && "text-gold"
                                    )}
                                >
                                    <span className="flex items-center gap-4">
                                        <span className="text-lg transition-transform group-hover:scale-110">
                                            {category.icon}
                                        </span>

                                        <span className="tracking-tight">
                                            {category.title}
                                        </span>
                                    </span>

                                    <span className="text-muted-foreground group-hover:text-gold">
                                        {isExpanded ? (
                                            <ChevronDown
                                                size={16}
                                                strokeWidth={3}
                                            />
                                        ) : (
                                            <ChevronRight
                                                size={16}
                                                strokeWidth={3}
                                            />
                                        )}
                                    </span>
                                </button>

                                {isExpanded && (
                                    <div className="ml-5 space-y-1 border-l-2 border-border/30 pl-4">
                                        {categoryItems.map((item) => {
                                            const isActive =
                                                location.pathname ===
                                                item.path;

                                            return (
                                                <Link
                                                    key={item.path}
                                                    to={item.path}
                                                    className={cn(
                                                        "group relative flex items-center gap-3.5 overflow-hidden rounded-xl px-4 py-2.5 text-[11px] font-black uppercase tracking-wider transition-all duration-300",
                                                        isActive
                                                            ? "translate-x-1 bg-gold text-white shadow-lg shadow-gold/10"
                                                            : "text-sidebar-foreground/80 hover:translate-x-1 hover:bg-muted hover:text-foreground"
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            "text-base transition-transform group-hover:scale-110",
                                                            isActive
                                                                ? "text-white"
                                                                : "text-muted-foreground group-hover:text-gold"
                                                        )}
                                                    >
                                                        {item.icon}
                                                    </span>

                                                    <span className="tracking-tight">
                                                        {item.title}
                                                    </span>

                                                    {isActive && (
                                                        <span className="absolute bottom-1/4 left-0 top-1/4 w-1 rounded-full bg-white" />
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                <div
                    ref={profileRef}
                    className="relative flex justify-start border-t border-border p-5"
                >
                    <button
                        type="button"
                        onClick={() =>
                            setOpenProfile((previous) => !previous)
                        }
                        className="h-14 w-14 overflow-hidden rounded-2xl border-2 border-gold bg-gold/20 shadow-lg transition hover:scale-105"
                    >
                        <img
                            src={profileImage}
                            alt={user?.userFullName || "User"}
                            className="h-full w-full object-cover"
                            onError={(event) => {
                                event.currentTarget.src =
                                    "/default-user.png";
                            }}
                        />
                    </button>

                    {openProfile && (
                        <div className="fixed bottom-24 left-24 z-[99999] w-[340px] overflow-hidden rounded-[30px] border border-[#1E293B] bg-[#081120] shadow-2xl">
                            <div className="border-b border-[#1F2937] bg-gradient-to-br from-[#101B32] to-[#0B1220] px-7 py-7">
                                <div className="flex items-center gap-5">
                                    <div className="h-20 w-20 overflow-hidden rounded-full border-[3px] border-gold bg-[#7C3AED]">
                                        <img
                                            src={profileImage}
                                            alt={
                                                user?.userFullName ||
                                                "User"
                                            }
                                            className="h-full w-full object-cover"
                                            onError={(event) => {
                                                event.currentTarget.src =
                                                    "/default-user.png";
                                            }}
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <h2 className="text-xl font-black leading-tight tracking-tight text-white">
                                            {user?.userFullName ||
                                                "Admin"}
                                        </h2>

                                        <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-gold">
                                            {user?.designationName ||
                                                "Administrator"}
                                        </p>

                                        <div className="mt-3 inline-flex w-fit rounded-full bg-[#374151] px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-[#F3F4F6]">
                                            {user?.departmentName ||
                                                "Management"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 p-7">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setTheme(
                                            theme === "light"
                                                ? "dark"
                                                : "light"
                                        )
                                    }
                                    className="flex items-center gap-4 rounded-2xl border border-[#243041] bg-[#111827] px-4 py-4 transition hover:border-gold"
                                >
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 text-gold">
                                        {theme === "light" ? "☀" : "☾"}
                                    </div>

                                    <span className="text-sm font-bold text-white">
                                        {theme === "light"
                                            ? "Dark Mode"
                                            : "Light Mode"}
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex items-center gap-4 rounded-2xl border border-[#243041] bg-[#111827] px-4 py-4 transition hover:border-red-500 hover:bg-red-500/10"
                                >
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                                        ↪
                                    </div>

                                    <span className="text-sm font-bold text-red-500">
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