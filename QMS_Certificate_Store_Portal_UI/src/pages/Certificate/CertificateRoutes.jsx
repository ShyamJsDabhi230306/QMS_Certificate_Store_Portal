import React from 'react';
import { Award, UserStar } from 'lucide-react';
import CertificateList from './CertificateList';
import CertificateForm from './CertificateForm';

const certificateRoutes = [
    {
        title: "Certificate",
        path: "/certificate",
        element: <CertificateList />,
        showInSidebar: true,
        icon: <UserStar size={18} strokeWidth={2.5} />
    },
    {
        title: "Add Certificate",
        path: "/certificate/add",
        element: <CertificateForm />,
        showInSidebar: false
    },
    {
        title: "Edit Certificate",
        path: "/certificate/edit/:id",
        element: <CertificateForm />,
        showInSidebar: false
    }
];

export default certificateRoutes;
