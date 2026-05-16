import { userRoutes } from '../pages/User/userRoutes.jsx';
import { companyRoutes } from '../pages/Company/companyRoutes';
import { LayoutDashboard } from "lucide-react";
import { locationRoutes } from '@/pages/Location/locationRoutes.jsx';
import { departmentRoutes } from '@/pages/Department/departmentRoutes.jsx';
import { designationRoutes } from '@/pages/Designation/designationRoutes.jsx';
import pageRoutes from '@/pages/PageMaster/pageRoutes.jsx';
import userRightRoutes from '@/pages/UserRight/userRightRoutes.jsx';


// 1. Get the rights from localStorage
const getRights = () => {
    try {
        const rights = localStorage.getItem('userRights');
        return rights ? JSON.parse(rights) : [];
    } catch (e) {
        return [];
    }
};

export const navConfig = [
    {
        title: "Dashboard",
        path: "/dashboard",
        element: <div style={{ padding: '20px' }}><h1>Dashboard</h1><p>Welcome to QMS Portal</p></div>,
        showInSidebar: true,
        icon: <LayoutDashboard size={18} strokeWidth={2.5} />
    },
    ...companyRoutes,
    ...locationRoutes,
    ...departmentRoutes,
    ...designationRoutes,
    ...userRoutes,
    ...pageRoutes,
    ...userRightRoutes// Add user routes here
    // ... rest of navConfig ...
].filter(route => {
    // 1. Dashboard is always visible
    if (route.title === "Dashboard") return true;

    const userRights = getRights();

    // 2. Find the permission (Case-Insensitive check)
    const permission = userRights.find(r => {
        const dbName = (r.pageName || r.PageName || "").toLowerCase().trim();
        const uiName = (route.title || "").toLowerCase().trim();

        // Check if they are exactly equal OR if the UI name contains the DB name
        return dbName === uiName || uiName.includes(dbName) || dbName.includes(uiName);
    });

    if (!permission) return false;

    // 3. Check for View permission (Handles both 'canView' and 'CanView')
    const hasView =
        permission.canView === true ||
        permission.CanView === true ||
        permission.canView === 1 ||
        permission.CanView === 1;

    return hasView;
});
