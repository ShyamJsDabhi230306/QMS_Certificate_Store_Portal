import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { navConfig } from '../routes/navConfig';
import '../css/sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();

    return (
        <div className="sidebar">
            <div className="sidebar-logo">QMS PORTAL</div>
            <nav className="sidebar-nav">
                {navConfig
                    .filter(item => item.showInSidebar)
                    .map((item, index) => (
                        <Link key={index} to={item.path} className="sidebar-link">
                            {item.icon} {item.title}
                        </Link>
                    ))
                }
            </nav>
            <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="logout-btn">
                Logout
            </button>
        </div>
    );
};

export default Sidebar;
