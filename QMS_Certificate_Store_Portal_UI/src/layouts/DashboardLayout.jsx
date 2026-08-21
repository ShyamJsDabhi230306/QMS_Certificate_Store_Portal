import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
// import air from "../assets/air.jpeg"
const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");;

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);
    return (
        <div className="flex min-h-screen bg-background selection:bg-gold/30">
            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
            />
            <main className=" flex-1 lg:ml-72 flex flex-col min-w-0 transition-all duration-500 ">
                <header className="h-24 border-b border-border bg-card/80 backdrop-blur-xl flex items-center justify-end px-10 sticky top-0 z-30 shadow-sm">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden text-2xl p-2 hover:bg-muted rounded-xl transition-colors"
                    >
                        <span className="text-foreground">☰</span>
                    </button>
                    <div className="flex items-center gap-8">
                        {/* Company Section */}
                        <div className="flex items-center gap-4">
                            {/* Company Logo */}
                            {/* <div
                                className="
           h-20 w-35
            rounded-2xl
            overflow-hidden
            border-2 border-gold/20
            bg-white
            shadow-inner
            flex items-center justify-center
            "
                            >
                                <img
                                    src={air}
                                    alt="Aira Euro Automation"
                                    className=" w-full
        h-full object-contain"
                                />
                            </div> */}

                            {/* Company Name */}
                            {/* <div className="text-left hidden sm:block">
                                <p
                                    className="
                text-xl
                font-black
                uppercase
                tracking-tight
                text-foreground
                leading-none
                "
                                >
                                    Aira Euro Automation
                                </p>

                                <p
                                    className="
                text-[15px]
                font-black
                text-gold
                uppercase
                tracking-[0.2em]
                mt-1.5
                leading-none
                "gie me f
                                >
                                    Pvt. Ltd.
                                </p>
                            </div> */}
                        </div>
                    </div>
                </header>
                <div className="p-0 animate-in fade-in duration-1000">{children}</div>
            </main>
        </div>
    );
};

export default DashboardLayout;
