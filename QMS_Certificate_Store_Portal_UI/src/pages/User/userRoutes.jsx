import React from 'react';
import UserList from './UserList';
import UserForm from './UserForm';
import { Users } from "lucide-react";

export const userRoutes = [
    {
        title: "User Management",
        path: "/users",
        element: <UserList />,
        showInSidebar: true,
        icon: <Users size={18} strokeWidth={2.5} />
    },
    {
        title: "Add User",
        path: "/users/add",
        element: <UserForm />,
        showInSidebar: false
    },
    {
        title: "Edit User",
        path: "/users/edit/:id",
        element: <UserForm />,
        showInSidebar: false
    }
];
