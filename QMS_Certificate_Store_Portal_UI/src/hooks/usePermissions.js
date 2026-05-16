import { useState, useEffect } from 'react';

export const usePermissions = (pageName) => {
    const [permissions, setPermissions] = useState({
        canView: false,
        canCreate: false,
        canEdit: false,
        canDelete: false,
        loading: true
    });

    useEffect(() => {
        const allPermissions = JSON.parse(localStorage.getItem('userRights') || '[]');

        // Use the same Smart Matching as the Sidebar
        const pageRight = allPermissions.find(r => {
            const dbName = (r.pageName || r.PageName || "").toLowerCase().trim();
            const uiName = (pageName || "").toLowerCase().trim();
            return dbName === uiName || uiName.includes(dbName) || dbName.includes(uiName);
        });

        console.log(`Rights for ${pageName}:`, pageRight);
        if (pageRight) {
            setPermissions({
                // Check both r.canView and r.CanView
                canView: pageRight.canView || pageRight.CanView || false,
                canCreate: pageRight.canCreate || pageRight.CanCreate || false,
                canEdit: pageRight.canEdit || pageRight.CanEdit || false,
                canDelete: pageRight.canDelete || pageRight.CanDelete || false,
                loading: false
            });
        } else {
            setPermissions(prev => ({ ...prev, loading: false }));
        }
    }, [pageName]);

    return permissions;
};
