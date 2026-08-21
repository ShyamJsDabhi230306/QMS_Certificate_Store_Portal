import React from 'react';
import DepartmentList from './DepartmentList';
import DepartmentForm from './DepartmentForm';
import { Layers } from "lucide-react";

export const departmentRoutes = [
     {
        title: "Department Master",
        pageCode: "DEPARTMENT",
        path: "/department",
        element: <DepartmentList />,
        showInSidebar: true,
        icon: <Layers size={18} strokeWidth={2.5} />
    },
    {
        title: "Add Department",
        pageCode: "DEPARTMENT",
        path: "/department/add",
        element: <DepartmentForm />,
        showInSidebar: false
    },
    {
        title: "Edit Department",
        pageCode: "DEPARTMENT",
        path: "/department/edit/:id",
        element: <DepartmentForm />,
        showInSidebar: false
    }
];
