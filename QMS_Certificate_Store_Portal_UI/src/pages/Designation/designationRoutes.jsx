import React from 'react';
import DesignationList from './DesignationList';
import DesignationForm from './DesignationForm';
import { Award, IdCard } from "lucide-react";

export const designationRoutes = [
    {
        title: "Designation Master",
        path: "/designation",
        element: <DesignationList />,
        showInSidebar: true,
        icon: <IdCard size={18} strokeWidth={2.5} />
    },
    {
        title: "Add Designation",
        path: "/designation/add",
        element: <DesignationForm />,
        showInSidebar: false
    },
    {
        title: "Edit Designation",
        path: "/designation/edit/:id",
        element: <DesignationForm />,
        showInSidebar: false
    }
];
