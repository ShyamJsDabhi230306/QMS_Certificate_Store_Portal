import { userRoutes } from '../pages/User/userRoutes.jsx';
import { LayoutDashboard } from "lucide-react";



export const navConfig = [
    {
        title: "Dashboard",
        path: "/dashboard",
        element: <div style={{ padding: '20px' }}><h1>Dashboard</h1><p>Welcome to QMS Portal</p></div>,
        showInSidebar: true,
        icon: <LayoutDashboard size={18} strokeWidth={2.5} />
    },
    ...userRoutes // Add user routes here
];
