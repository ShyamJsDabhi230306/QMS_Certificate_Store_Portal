import React from 'react';
import DesignationList from './DesignationList';
import DesignationForm from './DesignationForm';
import { Award, IdCard } from "lucide-react";

export const designationRoutes = [
   {
        title: "Designation Master",
        pageCode: "DESIGNATION",
        path: "/designation",
        element: <DesignationList />,
        showInSidebar: true,
        icon: <IdCard size={18} strokeWidth={2.5} />
    },
    {
        title: "Add Designation",
        pageCode: "DESIGNATION",
        path: "/designation/add",
        element: <DesignationForm />,
        showInSidebar: false
    },
    {
        title: "Edit Designation",
        pageCode: "DESIGNATION",
        path: "/designation/edit/:id",
        element: <DesignationForm />,
        showInSidebar: false
    }
];
