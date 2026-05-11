import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { navConfig } from './navConfig';
import Login from '../pages/Login';
import DashboardLayout from '../layouts/DashboardLayout'; // 1. Import the Layout

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" />} />

            {/* Protected Routes - WRAPPED IN LAYOUT */}
            {navConfig.map((route, index) => (
                <Route
                    key={index}
                    path={route.path}
                    element={
                        <DashboardLayout>  {/* 2. Wrap here */}
                            {route.element}
                        </DashboardLayout>
                    }
                />
            ))}

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
};

export default AppRoutes;
