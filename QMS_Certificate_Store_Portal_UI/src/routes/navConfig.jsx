import { userRoutes } from '../pages/User/userRoutes.jsx';
import { companyRoutes } from '../pages/Company/companyRoutes';
import { LayoutDashboard } from "lucide-react";
import { locationRoutes } from '@/pages/Location/locationRoutes.jsx';
import { departmentRoutes } from '@/pages/Department/departmentRoutes.jsx';
import { designationRoutes } from '@/pages/Designation/designationRoutes.jsx';



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
    ...userRoutes, // Add user routes here
];
