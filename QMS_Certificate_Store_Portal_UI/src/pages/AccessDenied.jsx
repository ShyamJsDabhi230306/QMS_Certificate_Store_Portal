import React from 'react';

const AccessDenied = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
            <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-10 text-center shadow-2xl">
                <div className="mb-4 text-6xl text-white">403</div>
                <h1 className="text-2xl font-bold text-white">
                    You do not have access to this application
                </h1>
                <p className="mt-4 text-slate-300">
                    Your account was created successfully, but an administrator
                    has not assigned a designation and right yet.
                </p>
                <p className="mt-2 text-slate-400">
                    Please contact your administrator for access rights.
                </p>
                <button
                    type="button"
                    onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('userRights');
                        window.location.href = '/login';
                    }}
                    className="mt-8 rounded-xl bg-amber-500 px-6 py-3 font-semibold text-slate-950 hover:bg-amber-400"
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
};

export default AccessDenied;
