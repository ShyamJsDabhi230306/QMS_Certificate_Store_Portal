import React from 'react';
import UserRightForm from './UserRightForm';
import { ShieldCheck } from "lucide-react";

export const userRightRoutes = [
    {
        title: "User Rights",
        path: "/user-rights",
        element: <UserRightForm />,
        showInSidebar: true,
        icon: <ShieldCheck size={18} strokeWidth={2.5} />
    }
];

export default userRightRoutes;
