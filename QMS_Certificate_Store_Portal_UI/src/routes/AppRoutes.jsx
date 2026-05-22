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
                        localStorage.getItem("token") ? (
                            <DashboardLayout>
                                {route.element}
                            </DashboardLayout>
                        ) : (
                            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">

                                <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">

                                    {/* Top Section */}
                                    <div className="bg-red-500 px-8 py-6 text-white text-center">
                                        <div className="text-5xl mb-3">🚫</div>

                                        <h2 className="text-2xl font-bold tracking-wide">
                                            Access Denied
                                        </h2>

                                        <p className="text-sm text-red-100 mt-2">
                                            Unauthorized Access
                                        </p>
                                    </div>

                                    {/* Content */}
                                    <div className="p-8 text-center">

                                        <p className="text-slate-700 text-base leading-7">
                                            You do not have permission to access this page.
                                        </p>

                                        <p className="text-slate-500 text-sm mt-3">
                                            Please contact your administrator for access rights.
                                        </p>

                                        <button
                                            onClick={() => window.location.href = "/login"}
                                            className="mt-8 w-full bg-slate-900 hover:bg-slate-800 transition-all duration-300 text-white py-3 rounded-xl font-semibold shadow-lg"
                                        >
                                            Go To Login
                                        </button>

                                    </div>

                                </div>

                            </div>
                        )
                    }
                />
            ))}

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
};

export default AppRoutes;
