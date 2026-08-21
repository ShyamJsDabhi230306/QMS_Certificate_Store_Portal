import React from 'react';
import { Award, UserStar } from 'lucide-react';
import CertificateList from './CertificateList';
import CertificateForm from './CertificateForm';
import CertificateViewLog from './CertificateViewLog';


const certificateRoutes = [
     {
        title: "Certificate",
        pageCode: "CERTIFICATE",
        path: "/certificate",
        element: <CertificateList />,
        showInSidebar: true,
        icon: <UserStar size={18} strokeWidth={2.5} />
    },
    {
        title: "Add Certificate",
        pageCode: "CERTIFICATE",
        path: "/certificate/add",
        element: <CertificateForm />,
        showInSidebar: false
    },
    {
        title: "Edit Certificate",
        pageCode: "CERTIFICATE",
        path: "/certificate/edit/:id",
        element: <CertificateForm />,
        showInSidebar: false
    },
    {
        title: "Certificate Logs",
        pageCode: "CERTIFICATE",
        path: "/certificate-view-log",
        element: <CertificateViewLog />,
        showInSidebar: false
    }
];

export default certificateRoutes;
