import React from 'react';
import Sidebar from './Sidebar';
import '../css/dashboardLayout.css';

const DashboardLayout = ({ children }) => {
    return (
         <div className="dashboard-container"> {/* Added className */}
            <Sidebar />
            <div className="main-content"> {/* Added className */}
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;
