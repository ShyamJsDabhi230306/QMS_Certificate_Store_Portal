import React from 'react';
import CompanyList from './CompanyList';

import { Building2} from "lucide-react";
import CompanyForm from './CompanyForm';

export const companyRoutes = [
    {
    title: "Company Master",
    pageCode: "COMPANY",
    path: "/company",
    element: <CompanyList />,
    showInSidebar: true,
     icon: <Building2 size={18} strokeWidth={2.5} />
},
{
    title: "Add Company",
    pageCode: "COMPANY",
    path: "/company/add",
    element: <CompanyForm />,
    showInSidebar: false
},
{
    title: "Edit Company",
    pageCode: "COMPANY",
    path: "/company/edit/:id",
    element: <CompanyForm />,
    showInSidebar: false
}
];
