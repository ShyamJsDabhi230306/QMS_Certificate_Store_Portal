import React from 'react';
import { Award } from 'lucide-react';
import CertificateTypeList from './CertificateTypeList';
import CertificateTypeForm from './CertificateTypeForm';

const certificateTypeRoutes = [
    {
        title: "Certificate Type",
        path: "/certificate-type",
        element: <CertificateTypeList />,
        showInSidebar: true,
        icon: <Award size={18} strokeWidth={2.5} />
    },
    {
        title: "Add Certificate Type",
        path: "/certificate-type/add",
        element: <CertificateTypeForm />,
        showInSidebar: false
    },
    {
        title: "Edit Certificate Type",
        path: "/certificate-type/edit/:id",
        element: <CertificateTypeForm />,
        showInSidebar: false
    }
];

export default certificateTypeRoutes;
