import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Edit2, Trash2, Users, RefreshCw, EyeOff, Eye, } from 'lucide-react';
import { userApi } from '../../api/userApi';
import { toast } from 'react-hot-toast';
import { usePagination } from '../../components/usePagination';
import Pagination from '../../components/Pagination';
import SearchInput from '../../components/SearchInput'; // 👈 NEW
import { useSearch } from '../../hooks/useSearch';     // 👈 NEW

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visiblePasswords, setVisiblePasswords] = useState({}); // 🟢 Track visibility by User ID
    // Inside UserList component
    const { searchTerm, setSearchTerm, filteredItems } = useSearch(users);
    const { currentItems, paginationProps } = usePagination(filteredItems, 10);
    // It will automatically search every column (Name, Email, Phone, Username, etc.)


    const togglePassword = (id) => {
        setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const navigate = useNavigate();

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const res = await userApi.getAll();
            if (res.success) setUsers(res.data);
        } catch (error) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const res = await userApi.delete(id);
                if (res.success || res.result == 1) { // 🟢 Check both success or result
                    toast.success(res.message);
                    loadUsers();
                } else {
                    toast.error(res.message);
                }
            } catch (error) {
                toast.error("Failed to delete user");
            }
        }
    };

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            {/* ── Header Section ───────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
                    <Users className="text-gold" size={32} /> User Registry
                </h1>

                {/* 🟢 Search Input and Add Button together */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex-1 md:w-80">
                        <SearchInput
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Search users..."
                        />
                    </div>
                    <button
                        onClick={() => navigate('/users/add')}
                        className="px-6 py-3 bg-gold hover:bg-gold-hover text-white rounded-xl font-black text-[14px] uppercase tracking-widest shadow-lg shadow-gold/20 flex items-center gap-2 transition-all hover:scale-105 whitespace-nowrap"
                    >
                        <UserPlus size={18} strokeWidth={3} />Add New User
                    </button>
                </div>
            </div>


            {/* ── Data Grid ────────────────────────────────────────── */}
            <div className="bg-card/40 backdrop-blur-md rounded-3xl border border-border shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1200px]">
                        <thead className="bg-muted/50 border-b border-border text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                            <tr>
                                <th className="px-6 py-5 w-16">ID</th>
                                <th className="px-6 py-5">Full Name</th>
                                <th className="px-6 py-5">Email</th>
                                <th className="px-6 py-5">Phone</th>
                                <th className="px-6 py-5">Username</th>
                                <th className="px-6 py-5">Password</th>
                                {/* <th className="px-6 py-5">Department</th> */}
                                <th className="px-6 py-5">Designation</th>
                                <th className="px-6 py-5">Company</th>
                                <th className="px-6 py-5">Location</th>
                                <th className="px-6 py-5 text-center">Status</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan="10" className="py-24 text-center">
                                        <RefreshCw className="animate-spin text-gold mx-auto" size={28} />
                                    </td>
                                </tr>
                            ) : currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan="10" className="py-24 text-center">
                                        <Users size={36} className="mx-auto text-gold/70 mb-3" />
                                        <p className="text-xs uppercase tracking-widest font-black text-muted-foreground">
                                            No Users Found
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((item) => (
                                    <tr key={item.idUser} className="group hover:bg-gold/[0.03] transition-colors duration-100">

                                        {/* 1. ID */}
                                        <td className="px-6 py-4 text-[13px] font-black text-muted-foreground">
                                            #{item.idUser}
                                        </td>

                                        {/* 2. UserFullName */}
                                        <td className="px-6 py-4">
                                            <p className="font-black text-[14px] text-foreground">
                                                {item.userFullName || '–'}
                                            </p>
                                        </td>

                                        {/* 3. Email */}
                                        <td className="px-6 py-4 text-[13px] font-bold text-foreground/80">
                                            {item.email || '–'}
                                        </td>

                                        {/* 4. Phone */}
                                        <td className="px-6 py-4 text-[12px] font-black tracking-widest text-muted-foreground">
                                            {item.phone || '–'}
                                        </td>

                                        {/* 5. userName */}
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1.5 rounded-lg bg-muted/50 text-[12px] font-black tracking-widest text-foreground/80">
                                                {item.userName || '–'}
                                            </span>
                                        </td>

                                        {/* 6. Password */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <p className="text-[13px] font-black tracking-[0.2em] text-muted-foreground w-20">
                                                    {visiblePasswords[item.idUser] ? item.password : '••••••••'}
                                                </p>
                                                <button
                                                    onClick={() => togglePassword(item.idUser)}
                                                    className="p-1.5 rounded-md hover:bg-muted/80 text-muted-foreground transition-colors focus:outline-none"
                                                    title={visiblePasswords[item.idUser] ? "Hide Password" : "Show Password"}
                                                >
                                                    {visiblePasswords[item.idUser] ? <EyeOff size={14} /> : <Eye size={14} />}
                                                </button>
                                            </div>
                                        </td>

                                        {/* 7. Department */}
                                        {/* <td className="px-6 py-4 text-[12px] font-black text-foreground/80 uppercase tracking-wider">
                                            {item.departmentName || '–'}
                                        </td> */}


                                        {/* 8. Designation */}
                                        <td className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gold">
                                            {item.designationName || '–'}
                                        </td>
                                        <td className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gold">
                                            {item.companyName || '–'}
                                        </td>
                                        <td className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gold">
                                            {item.locationName || '–'}
                                        </td>

                                        {/* 9. IsActive */}
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${item.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                                {item.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>

                                        {/* 10. Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/users/edit/${item.idUser}`)}
                                                    className="w-8 h-8 flex items-center justify-center bg-gold/10 text-gold hover:bg-gold hover:text-white rounded-lg transition-all"
                                                    title="Edit User"
                                                >
                                                    <Edit2 size={14} strokeWidth={2.5} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.idUser)}
                                                    className="w-8 h-8 flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={14} strokeWidth={2.5} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                </div>

                {/* ── Pagination ───────────────────────────────────────── */}
                <Pagination {...paginationProps} />
            </div>
        </div>
    );
};

export default UserList;

