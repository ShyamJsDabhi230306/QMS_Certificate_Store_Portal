import { userRoutes } from '../pages/User/userRoutes.jsx';

export const navConfig = [
    {
        title: "Dashboard",
        path: "/dashboard",
        element: <div style={{ padding: '20px' }}><h1>Dashboard</h1><p>Welcome to QMS Portal</p></div>,
        showInSidebar: true,
        icon: "📊"
    },
    ...userRoutes // Add user routes here
];
