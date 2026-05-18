import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { allRoutes } from './navConfig';
import Login from '../pages/Login';
import DashboardLayout from '../layouts/DashboardLayout';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" />} />

            {/* Protected Routes - uses allRoutes so every path is always reachable */}
            {allRoutes.map((route, index) => (
                <Route
                    key={index}
                    path={route.path}
                    element={
                        <DashboardLayout>
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
