import React from 'react';
import UserList from './UserList';
import UserForm from './UserForm';


export const userRoutes = [
    {
        title: "User Management",
        path: "/users",
        element: <UserList />,
        showInSidebar: true,
        icon: "👥"
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
