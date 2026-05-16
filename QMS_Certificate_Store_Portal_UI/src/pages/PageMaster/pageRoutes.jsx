import React from 'react';
import PageList from './PageList';
import PageForm from './PageForm';
import { Layout } from "lucide-react";

export const pageRoutes = [
    {
        title: "Page Master",
        path: "/page-master",
        element: <PageList />,
        showInSidebar: true,
        icon: <Layout size={18} strokeWidth={2.5} />
    },
    {
        title: "Add Page",
        path: "/page-master/add",
        element: <PageForm />,
        showInSidebar: false
    },
    {
        title: "Edit Page",
        path: "/page-master/edit/:id",
        element: <PageForm />,
        showInSidebar: false
    }
];

export default pageRoutes;
