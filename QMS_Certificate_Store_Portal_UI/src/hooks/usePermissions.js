import { useState, useEffect } from 'react';

// export const usePermissions = (pageName) => {
//     const [permissions, setPermissions] = useState({
//         canView: false,
//         canCreate: false,
//         canEdit: false,
//         canDelete: false,
//         loading: true
//     });

//     useEffect(() => {
//         const allPermissions = JSON.parse(localStorage.getItem('userRights') || '[]');

//         // Use the same Smart Matching as the Sidebar
//         // const pageRight = allPermissions.find(r => {
//         //     const dbName = (r.pageName || r.PageName || "").toLowerCase().trim();
//         //     const uiName = (pageName || "").toLowerCase().trim();
//         //     return dbName === uiName || uiName.includes(dbName) || dbName.includes(uiName);
//         // });

//         // Use the same Smart Matching as the Sidebar
//         const pageRight = allPermissions.find(r => {
//             const dbName = (r.pageName || r.PageName || "").toLowerCase().trim();
//             const uiName = (pageName || "").toLowerCase().trim();

//             // 1. Check for exact match first
//             if (dbName === uiName) return true;

//             // 2. Prevent the word "Certificate" from accidentally matching "Certificate Type"
//             if (dbName === "certificate" && uiName === "certificate type") return false;
//             if (uiName === "certificate" && dbName === "certificate type") return false;

//             // 3. Fallback to fuzzy matching
//             return uiName.includes(dbName) || dbName.includes(uiName);
//         });

//         // console.log(`Rights for ${pageName}:`, pageRight);
//         if (pageRight) {
//             setPermissions({
//                 // Check both r.canView and r.CanView
//                 canView: pageRight.canView || pageRight.CanView || false,
//                 canCreate: pageRight.canCreate || pageRight.CanCreate || false,
//                 canEdit: pageRight.canEdit || pageRight.CanEdit || false,
//                 canDelete: pageRight.canDelete || pageRight.CanDelete || false,
//                 loading: false
//             });
//         } else {
//             setPermissions(prev => ({ ...prev, loading: false }));
//         }
//     }, [pageName]);

//     return permissions;
// };


export const usePermissions = (pageName) => {
    const [permissions, setPermissions] = useState({
        canView: false,
        canCreate: false,
        canEdit: false,
        canDelete: false,
        loading: true
    });

    useEffect(() => {
        // 👇 ADD THIS ADMIN BYPASS BLOCK
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.isSuperAdmin === true) {
                setPermissions({
                    canView: true,
                    canCreate: true,
                    canEdit: true,
                    canDelete: true,
                    loading: false
                });
                return; // Stop checking rights, give full access immediately!
            }
        } catch (e) { }

        const allPermissions = JSON.parse(localStorage.getItem('userRights') || '[]');

        // Use the same Smart Matching as the Sidebar
        const pageRight = allPermissions.find(r => {
            const dbName = (r.pageName || r.PageName || "").toLowerCase().trim();
            const uiName = (pageName || "").toLowerCase().trim();

            // 1. Check for exact match first
            if (dbName === uiName) return true;

            // 2. Prevent the word "Certificate" from accidentally matching "Certificate Type"
            if (dbName === "certificate" && uiName === "certificate type") return false;
            if (uiName === "certificate" && dbName === "certificate type") return false;

            // 3. Fallback to fuzzy matching
            return uiName.includes(dbName) || dbName.includes(uiName);
        });

        if (pageRight) {
            setPermissions({
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
