// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { UserPlus, Edit2, Trash2, Users, RefreshCw, EyeOff, Eye, } from 'lucide-react';
// import { userApi } from '../../api/userApi';
// import { toast } from 'react-hot-toast';
// import { usePagination } from '../../components/usePagination';
// import Pagination from '../../components/Pagination';
// import SearchInput from '../../components/SearchInput'; // 👈 NEW
// import { useSearch } from '../../hooks/useSearch';     // 👈 NEW

// const UserList = () => {
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [visiblePasswords, setVisiblePasswords] = useState({}); // 🟢 Track visibility by User ID
//     // Inside UserList component
//     const { searchTerm, setSearchTerm, filteredItems } = useSearch(users);
//     const { currentItems, paginationProps } = usePagination(filteredItems, 10);
//     // It will automatically search every column (Name, Email, Phone, Username, etc.)


//     const togglePassword = (id) => {
//         setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
//     };

//     const navigate = useNavigate();

//     useEffect(() => { loadUsers(); }, []);

//     const loadUsers = async () => {
//         try {
//             setLoading(true);
//             const res = await userApi.getAll();
//             if (res.success) setUsers(res.data);
//         } catch (error) {
//             toast.error("Failed to load users");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDelete = async (id) => {
//         if (window.confirm("Are you sure you want to delete this user?")) {
//             try {
//                 const res = await userApi.delete(id);
//                 if (res.success || res.result == 1) { // 🟢 Check both success or result
//                     toast.success(res.message);
//                     loadUsers();
//                 } else {
//                     toast.error(res.message);
//                 }
//             } catch (error) {
//                 toast.error("Failed to delete user");
//             }
//         }
//     };

//     return (
//         <div className="p-6 space-y-6 animate-in fade-in duration-500">
//             {/* ── Header Section ───────────────────────────────────── */}
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                 <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
//                     <Users className="text-gold" size={32} /> User Registry
//                 </h1>

//                 {/* 🟢 Search Input and Add Button together */}
//                 <div className="flex items-center gap-4 w-full md:w-auto">
//                     <div className="flex-1 md:w-80">
//                         <SearchInput
//                             value={searchTerm}
//                             onChange={setSearchTerm}
//                             placeholder="Search users..."
//                         />
//                     </div>
//                     <button
//                         onClick={() => navigate('/users/import')}
//                         className="px-6 py-3 bg-gold hover:bg-gold-hover text-white rounded-xl font-black text-[14px] uppercase tracking-widest shadow-lg shadow-gold/20 flex items-center gap-2 transition-all hover:scale-105 whitespace-nowrap"
//                     >
//                         <UserPlus size={18} strokeWidth={3} />Add New User
//                     </button>
//                 </div>
//             </div>


//             {/* ── Data Grid ────────────────────────────────────────── */}
//             <div className="bg-card/40 backdrop-blur-md rounded-3xl border border-border shadow-2xl overflow-hidden">
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-left border-collapse min-w-[1200px]">
//                         <thead className="bg-muted/50 border-b border-border text-[9px] font-black uppercase tracking-widest text-muted-foreground">
//                             <tr>
//                                 <th className="px-6 py-5 w-16">ID</th>
//                                 <th className="px-6 py-5">Full Name</th>
//                                 <th className="px-6 py-5">Email</th>
//                                 <th className="px-6 py-5">Phone</th>
//                                 <th className="px-6 py-5">Username</th>
//                                 <th className="px-6 py-5">Password</th>
//                                 {/* <th className="px-6 py-5">Department</th> */}
//                                 <th className="px-6 py-5">Designation</th>
//                                 <th className="px-6 py-5">Company</th>
//                                 <th className="px-6 py-5">Location</th>
//                                 <th className="px-6 py-5 text-center">Status</th>
//                                 <th className="px-6 py-5 text-right">Actions</th>
//                             </tr>
//                         </thead>

//                         <tbody className="divide-y divide-border">
//                             {loading ? (
//                                 <tr>
//                                     <td colSpan="10" className="py-24 text-center">
//                                         <RefreshCw className="animate-spin text-gold mx-auto" size={28} />
//                                     </td>
//                                 </tr>
//                             ) : currentItems.length === 0 ? (
//                                 <tr>
//                                     <td colSpan="10" className="py-24 text-center">
//                                         <Users size={36} className="mx-auto text-gold/70 mb-3" />
//                                         <p className="text-xs uppercase tracking-widest font-black text-muted-foreground">
//                                             No Users Found
//                                         </p>
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 currentItems.map((item) => (
//                                     <tr key={item.idUser} className="group hover:bg-gold/[0.03] transition-colors duration-100">

//                                         {/* 1. ID */}
//                                         <td className="px-6 py-4 text-[13px] font-black text-muted-foreground">
//                                             #{item.idUser}
//                                         </td>

//                                         {/* 2. UserFullName */}
//                                         <td className="px-6 py-4">
//                                             <p className="font-black text-[14px] text-foreground">
//                                                 {item.userFullName || '–'}
//                                             </p>
//                                         </td>

//                                         {/* 3. Email */}
//                                         <td className="px-6 py-4 text-[13px] font-bold text-foreground/80">
//                                             {item.email || '–'}
//                                         </td>

//                                         {/* 4. Phone */}
//                                         <td className="px-6 py-4 text-[12px] font-black tracking-widest text-muted-foreground">
//                                             {item.phone || '–'}
//                                         </td>

//                                         {/* 5. userName */}
//                                         <td className="px-6 py-4">
//                                             <span className="px-3 py-1.5 rounded-lg bg-muted/50 text-[12px] font-black tracking-widest text-foreground/80">
//                                                 {item.userName || '–'}
//                                             </span>
//                                         </td>

//                                         {/* 6. Password */}
//                                         <td className="px-6 py-4">
//                                             <div className="flex items-center gap-2">
//                                                 <p className="text-[13px] font-black tracking-[0.2em] text-muted-foreground w-20">
//                                                     {visiblePasswords[item.idUser] ? item.password : '••••••••'}
//                                                 </p>
//                                                 <button
//                                                     onClick={() => togglePassword(item.idUser)}
//                                                     className="p-1.5 rounded-md hover:bg-muted/80 text-muted-foreground transition-colors focus:outline-none"
//                                                     title={visiblePasswords[item.idUser] ? "Hide Password" : "Show Password"}
//                                                 >
//                                                     {visiblePasswords[item.idUser] ? <EyeOff size={14} /> : <Eye size={14} />}
//                                                 </button>
//                                             </div>
//                                         </td>

//                                         {/* 7. Department */}
//                                         {/* <td className="px-6 py-4 text-[12px] font-black text-foreground/80 uppercase tracking-wider">
//                                             {item.departmentName || '–'}
//                                         </td> */}


//                                         {/* 8. Designation */}
//                                         <td className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gold">
//                                             {item.designationName || '–'}
//                                         </td>
//                                         <td className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gold">
//                                             {item.companyName || '–'}
//                                         </td>
//                                         <td className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gold">
//                                             {item.locationName || '–'}
//                                         </td>

//                                         {/* 9. IsActive */}
//                                         <td className="px-6 py-4 text-center">
//                                             <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${item.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
//                                                 {item.isActive ? 'Active' : 'Inactive'}
//                                             </span>
//                                         </td>

//                                         {/* 10. Actions */}
//                                         <td className="px-6 py-4">
//                                             <div className="flex justify-end gap-2">
//                                                 <button
//                                                     onClick={() => navigate(`/users/edit/${item.idUser}`)}
//                                                     className="w-8 h-8 flex items-center justify-center bg-gold/10 text-gold hover:bg-gold hover:text-white rounded-lg transition-all"
//                                                     title="Edit User"
//                                                 >
//                                                     <Edit2 size={14} strokeWidth={2.5} />
//                                                 </button>
//                                                 <button
//                                                     onClick={() => handleDelete(item.idUser)}
//                                                     className="w-8 h-8 flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
//                                                     title="Delete User"
//                                                 >
//                                                     <Trash2 size={14} strokeWidth={2.5} />
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>

//                 </div>

//                 {/* ── Pagination ───────────────────────────────────────── */}
//                 <Pagination {...paginationProps} />
//             </div>
//         </div>
//     );
// };

// export default UserList;


import React, { useEffect, useMemo, useState } from "react";
import {
    Edit2,
    RefreshCw,
    Trash2,
    UserPlus,
    Users,
    CheckCircle2,
    Clock3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { userApi } from "../../api/userApi";
import { designationService } from "../../api/designationService";
import SearchInput from "../../components/SearchInput";
import Pagination from "../../components/Pagination";
import { usePagination } from "../../components/usePagination";
import { useSearch } from "../../hooks/useSearch";
import { getAiraImageUrl } from "../../utils/airaImage";
const UserList = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savingUserId, setSavingUserId] = useState(null);

    const {
        searchTerm,
        setSearchTerm,
        filteredItems,
    } = useSearch(users);

    const {
        currentItems,
        paginationProps,
    } = usePagination(filteredItems, 10);

    const loadData = async () => {
        try {
            setLoading(true);

            const [userResponse, designationResponse] =
                await Promise.all([
                    userApi.getAll(),
                    designationService.getAll(),
                ]);

            if (userResponse?.success) {
                setUsers(userResponse.data || []);
            }

            if (designationResponse?.success) {
                setDesignations(designationResponse.data || []);
            }
        } catch (error) {
            console.error(error);
            toast.error("Unable to load user management data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDesignationChange = async (user, event) => {
        const designationId = Number(event.target.value);

        if (!designationId || !user.idUserManagement) {
            return;
        }

        try {
            setSavingUserId(user.idUser);

            const response = await userApi.assignDesignation(
                user.idUserManagement,
                designationId
            );

            if (!response?.success && response?.result !== 1) {
                toast.error(
                    response?.message ||
                    "Designation could not be assigned."
                );
                return;
            }

            toast.success("Designation assigned successfully.");
            await loadData();
        } catch (error) {
            console.error(error);
            toast.error("Designation assignment failed.");
        } finally {
            setSavingUserId(null);
        }
    };

    const handleDelete = async (idUser) => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
            return;
        }

        try {
            const response = await userApi.delete(idUser);

            if (!response?.success && response?.result !== 1) {
                toast.error(response?.message || "User delete failed.");
                return;
            }

            toast.success("User deleted successfully.");
            await loadData();
        } catch (error) {
            console.error(error);
            toast.error("Unable to delete user.");
        }
    };

const activeUsersCount = useMemo(
    () =>
        users.filter(
            (user) =>
                (user.isSync === true || user.isSync === 1) &&
                (user.isActive === true || user.isActive === 1)
        ).length,
    [users]
);

    return (
        <div className="min-h-full bg-background p-5 text-foreground md:p-8">
            <div className="mx-auto max-w-[1600px] space-y-6">

                <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-3">
                            <Users className="text-gold" size={30} />
                            <h1 className="text-3xl font-black tracking-tight">
                                User Management
                            </h1>
                        </div>

                        <p className="text-sm font-medium text-muted-foreground">
                            Manage QMS users, designations and access status.
                        </p>

                        <div className="mt-4 flex flex-wrap gap-3">
                            <span className="rounded-full bg-gold/10 px-4 py-2 text-xs font-bold text-gold">
                                Total Users: {users.length}
                            </span>

                            <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-600">
                                Active Users: {activeUsersCount}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <SearchInput
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Search name, employee code or phone..."
                        />

                        <button
                            type="button"
                            onClick={() => navigate("/users/import")}
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gold px-5 text-sm font-bold text-white shadow-lg shadow-gold/20 transition hover:bg-gold-hover"
                        >
                            <UserPlus size={18} />
                            Import Aira Users
                        </button>

                        <button
                            type="button"
                            onClick={loadData}
                            disabled={loading}
                            className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-card px-4 text-foreground transition hover:border-gold hover:text-gold disabled:opacity-50"
                            title="Refresh"
                        >
                            <RefreshCw
                                size={18}
                                className={loading ? "animate-spin" : ""}
                            />
                        </button>
                    </div>
                </section>

                <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-md">
                    <div className="overflow-x-auto">
                        <table className="min-w-[1180px] w-full border-collapse text-left">
                            <thead className="bg-muted text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                                <tr>
                                    <th className="px-5 py-4">Employee Code</th>
                                    <th className="px-5 py-4"> User Picture</th>
                                    <th className="px-5 py-4">Name</th>
                                    <th className="px-5 py-4">Mobile</th>
                                    <th className="px-5 py-4">Company</th>
                                    <th className="px-5 py-4">Designation</th>
                                    <th className="px-5 py-4">Sync Status</th>
                                    <th className="px-5 py-4">Account</th>
                                    {/* <th className="px-5 py-4 text-right">
                                        Actions
                                    </th> */}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-border">
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="py-20 text-center"
                                        >
                                            <RefreshCw
                                                size={30}
                                                className="mx-auto animate-spin text-gold"
                                            />
                                            <p className="mt-3 text-sm text-muted-foreground">
                                                Loading users...
                                            </p>
                                        </td>
                                    </tr>
                                ) : currentItems.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="py-20 text-center text-sm font-semibold text-muted-foreground"
                                        >
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    currentItems.map((user) => (
                                        <tr
                                            key={user.idUser}
                                            className="transition hover:bg-gold/[0.04]"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="font-bold text-foreground">
                                                    {user.airaEmployeeCode ||
                                                        user.userName ||
                                                        "—"}
                                                </div>

                                                <div className="mt-1 text-xs text-muted-foreground">
                                                    Local ID: {user.idUser}
                                                </div>
                                            </td>
                                             <td className="px-5 py-4">
                                                <img
                                                  src={getAiraImageUrl(user.airaImageFileURL)}
                                                  alt={user.userFullName || "User"}
                                                  className="h-10 w-10 rounded-full border border-border object-cover"
                                                  onError={(event) => {
                                                      event.currentTarget.src = "/default-user.png";
                                                  }}
                                                />
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="font-bold text-foreground">
                                                    {user.userFullName ||
                                                        user.airaName ||
                                                        "—"}
                                                </div>

                                                {user.airaRoleName && (
                                                    <div className="mt-1 text-xs text-muted-foreground">
                                                        Aira:{" "}
                                                        {user.airaRoleName}
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-5 py-4 text-sm font-medium text-muted-foreground">
                                                {user.phone ||
                                                    user.airaContactNo ||
                                                    "—"}
                                            </td>

                                            <td className="max-w-[220px] px-5 py-4 text-sm font-semibold text-foreground">
                                                <span className="line-clamp-2">
                                                    {user.companyName || "—"}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <select
                                                    value={
                                                        user.idDesignation || ""
                                                    }
                                                    onChange={(event) =>
                                                        handleDesignationChange(
                                                            user,
                                                            event
                                                        )
                                                    }
                                                    disabled={
                                                        savingUserId ===
                                                            user.idUser ||
                                                        !user.idUserManagement ||
                                                        user.isSuperAdmin
                                                    }
                                                    className="h-10 min-w-[170px] rounded-lg border border-border bg-background px-3 text-sm font-semibold text-foreground outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    <option value="">
                                                        Select designation
                                                    </option>

                                                    {designations.map(
                                                        (designation) => (
                                                            <option
                                                                key={
                                                                    designation.idDesignation
                                                                }
                                                                value={
                                                                    designation.idDesignation
                                                                }
                                                            >
                                                                {
                                                                    designation.designationName
                                                                }
                                                            </option>
                                                        )
                                                    )}
                                                </select>

                                                {user.isSuperAdmin && (
                                                    <p className="mt-1 text-[11px] font-bold text-gold">
                                                        Super Admin
                                                    </p>
                                                )}
                                            </td>

                                            <td className="px-5 py-4">
                                                {user.isSync ? (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600">
                                                        <CheckCircle2
                                                            size={14}
                                                        />
                                                        Synced
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-600">
                                                        <Clock3 size={14} />
                                                        Not Sync
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                                                        user.isActive
                                                            ? "bg-emerald-500/10 text-emerald-600"
                                                            : "bg-red-500/10 text-red-600"
                                                    }`}
                                                >
                                                    {user.isActive
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>

                                            {/* <td className="px-5 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/users/edit/${user.idUser}`
                                                            )
                                                        }
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gold/40 text-gold transition hover:bg-gold hover:text-white"
                                                        title="Edit user"
                                                    >
                                                        <Edit2 size={15} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                user.idUser
                                                            )
                                                        }
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/40 text-red-500 transition hover:bg-red-500 hover:text-white"
                                                        title="Delete user"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </td> */}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination {...paginationProps} />
                </section>
            </div>
        </div>
    );
};

export default UserList;

