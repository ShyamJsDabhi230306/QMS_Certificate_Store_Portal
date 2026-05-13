import React from 'react';
import CompanyList from './CompanyList';

import { Building2 } from "lucide-react";
import CompanyForm from './CompanyForm';

export const companyRoutes = [
    {
        title: "Company Master",
        path: "/company",
        element: <CompanyList />,
        showInSidebar: true,
        icon: <Building2 size={18} strokeWidth={2.5} />
    },
    {
        title: "Add Company",
        path: "/company/add",
        element: <CompanyForm />,
        showInSidebar: false
    },
    {
        title: "Edit Company",
        path: "/company/edit/:id",
        element: <CompanyForm />,
        showInSidebar: false
    }
];
