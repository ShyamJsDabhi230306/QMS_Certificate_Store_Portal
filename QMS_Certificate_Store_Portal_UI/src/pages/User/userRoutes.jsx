import React from 'react';
import UserList from './UserList';
import UserForm from './UserForm';
import UserImport from './UserImport';
import { Users } from "lucide-react";

export const userRoutes = [
    {
        title: "User Management",
        pageCode: "USER",
        path: "/users",
        element: <UserList />,
        showInSidebar: true,
        icon: <Users size={18} strokeWidth={2.5} />
    },
    {
        title: "Add User",
        pageCode: "USER",
        path: "/users/add",
        element: <UserForm />,
        showInSidebar: false
    },
    {
        title: "Import Users",
        pageCode: "USER",
        path: "/users/import",
        element: <UserImport />,
        showInSidebar: false
    },
    {
        title: "Edit User",
        pageCode: "USER",
        path: "/users/edit/:id",
        element: <UserForm />,
        showInSidebar: false
    }
];
