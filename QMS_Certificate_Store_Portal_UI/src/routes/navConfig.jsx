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

import Dashboard from '../pages/Dashboard/Dashboard';

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
        path: "/dashboard",
        element: <Dashboard />,
        showInSidebar: true,
        icon: <LayoutDashboard size={18} strokeWidth={2.5} />
    },
    ...companyRoutes,
    ...locationRoutes,
    ...departmentRoutes,
    ...designationRoutes,
    ...userRoutes,
    ...pageRoutes,
    ...userRightRoutes,
    ...certificateTypeRoutes,
    ...CertificateRoutes,
];

// 3. FILTERED routes — used by Sidebar.jsx to show only permitted pages
export const navConfig = allRoutes.filter(route => {
    // Always show Dashboard and Certificate pages
    if (route.title === "Dashboard") return true;
    if (route.title === "Certificate") return true;
    if (route.title === "Add Certificate") return true;
    if (route.title === "Edit Certificate") return true;
    if (route.title === "CertificateType") return true;

    const userRights = getRights();

    // Find the permission (case-insensitive)
    const permission = userRights.find(r => {
        const dbName = (r.pageName || r.PageName || "").toLowerCase().trim();
        const uiName = (route.title || "").toLowerCase().trim();
        return dbName === uiName || uiName.includes(dbName) || dbName.includes(uiName);
    });

    if (!permission) return false;

    // Check for View permission
    return (
        permission.canView === true ||
        permission.CanView === true ||
        permission.canView === 1 ||
        permission.CanView === 1
    );
});
