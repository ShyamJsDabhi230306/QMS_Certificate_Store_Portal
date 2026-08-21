import React from 'react';
import { Award, FileBadge } from 'lucide-react';
import CertificateTypeList from './CertificateTypeList';
import CertificateTypeForm from './CertificateTypeForm';

const certificateTypeRoutes = [
     {
        title: "Certificate Type",
        pageCode: "CERTIFICATE_TYPE",
        path: "/certificate-type",
        element: <CertificateTypeList />,
        showInSidebar: true,
        icon: <FileBadge size={18} strokeWidth={2.5} />
    },
    {
        title: "Add Certificate Type",
        pageCode: "CERTIFICATE_TYPE",
        path: "/certificate-type/add",
        element: <CertificateTypeForm />,
        showInSidebar: false
    },
    {
        title: "Edit Certificate Type",
        pageCode: "CERTIFICATE_TYPE",
        path: "/certificate-type/edit/:id",
        element: <CertificateTypeForm />,
        showInSidebar: false
    }
];

export default certificateTypeRoutes;
