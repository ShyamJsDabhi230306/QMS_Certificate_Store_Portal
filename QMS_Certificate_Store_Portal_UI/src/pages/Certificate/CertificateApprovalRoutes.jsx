import React from 'react';
import { ShieldCheck } from 'lucide-react';
import CertificateApprovalList from './CertificateApprovalList';

const certificateApprovalRoutes = [
    {
        title: "Approval",
        path: "/certificate/approvals",
        element: <CertificateApprovalList />,
        showInSidebar: true,
        icon: <ShieldCheck size={18} strokeWidth={2.5} />
    }
];

export default certificateApprovalRoutes;
