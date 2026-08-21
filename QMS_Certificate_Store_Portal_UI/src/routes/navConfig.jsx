import { userRoutes } from '../pages/User/userRoutes.jsx';
import { companyRoutes } from '../pages/Company/companyRoutes';
import { LayoutDashboard } from "lucide-react";
import { locationRoutes } from '@/pages/Location/locationRoutes.jsx';
import { departmentRoutes } from '@/pages/Department/departmentRoutes.jsx';
import { designationRoutes } from '@/pages/Designation/designationRoutes.jsx';
import pageRoutes from '@/pages/PageMaster/pageRoutes.jsx';
import userRightRoutes from '@/pages/UserRight/userRightRoutes.jsx';
import certificateTypeRoutes from '@/pages/CertificateType/certificateTypeRoutes.jsx';
import CertificateRoutes from '@/pages/Certificate/CertificateRoutes.jsx';
import { Settings } from 'lucide-react';
import Dashboard from '../pages/Dashboard/Dashboard';
import ThemeSettings from '@/pages/ThemeSettings/ThemeSettings.jsx';
import certificateApprovalRoutes from '@/pages/Certificate/CertificateApprovalRoutes.jsx';
import { reminderRoutes } from '@/pages/Reminder/reminderRoutes.jsx';

// 1. Get the rights from localStorage
const getRights = () => {
    try {
        const rights = localStorage.getItem('userRights');
        return rights ? JSON.parse(rights) : [];
    } catch (e) {
        return [];
    }
};

// 2. ALL routes (unfiltered) — used by AppRoutes.jsx so every path is reachable
export const allRoutes = [
    {
    title: "Dashboard",
    pageCode: "DASHBOARD",
    path: "/dashboard",
    element: <Dashboard />,
    showInSidebar: true,
    icon: <LayoutDashboard size={18} strokeWidth={2.5} />
},
 

    ...companyRoutes,
    // ...locationRoutes,
    // ...departmentRoutes,
    ...designationRoutes,
    ...userRoutes,
    ...pageRoutes,
    ...userRightRoutes,
    ...certificateTypeRoutes,
    ...CertificateRoutes,
    ...certificateApprovalRoutes,
    // ...reminderRoutes
];

export const navConfig = allRoutes.filter((route) => {
    try {
        const user = JSON.parse(
            localStorage.getItem("user") || "{}"
        );

        if (user.isSuperAdmin === true) {
            return true;
        }

        const userRights = getRights();

        const permission = userRights.find((right) => {
            const databasePageCode = String(
                right.pageCode ||
                right.PageCode ||
                ""
            )
                .trim()
                .toUpperCase();

            const frontendPageCode = String(
                route.pageCode || ""
            )
                .trim()
                .toUpperCase();

            return (
                databasePageCode !== "" &&
                databasePageCode === frontendPageCode
            );
        });

        return (
            permission?.canView === true ||
            permission?.CanView === true ||
            permission?.canView === 1 ||
            permission?.CanView === 1 ||
            permission?.canView === "1" ||
            permission?.CanView === "1"
        );
    } catch {
        return false;
    }
});


// export const navConfig = allRoutes.filter(route => {
//     // Always show Dashboard
//     if (route.title === "Dashboard") return true;
//     // 👇 ADD THIS ADMIN BYPASS BLOCK
//     try {
//         const user = JSON.parse(localStorage.getItem('user'));
//         if (user && user.isSuperAdmin === true) return true; // Admin sees ALL sidebar links
//     } catch (e) { }



    
//     const userRights = getRights();


//     const permission = userRights.find((right) => {
//     const databasePageCode = (
//         right.pageCode ||
//         right.PageCode ||
//         ""
//     ).trim().toUpperCase();

//     const frontendPageCode = (
//         route.pageCode ||
//         ""
//     ).trim().toUpperCase();

//     return (
//         databasePageCode !== "" &&
//         frontendPageCode !== "" &&
//         databasePageCode === frontendPageCode
//     );

//     });
//     if (!permission) return false;
//     // Check for View permission
//     return (
//         permission.canView === true ||
//         permission.CanView === true ||
//         permission.canView === 1 ||
//         permission.CanView === 1
//     );
// });