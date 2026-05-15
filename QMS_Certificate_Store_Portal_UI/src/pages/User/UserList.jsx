import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Edit2, Trash2, Users, RefreshCw, EyeOff, Eye, } from 'lucide-react';
import { userApi } from '../../api/userApi';
import { toast } from 'react-hot-toast';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visiblePasswords, setVisiblePasswords] = useState({}); // 🟢 Track visibility by User ID

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
        if (window.confirm("Delete this user permanently?")) {
            try {
                const res = await userApi.delete(id);
                if (res.result === 1) {
                    toast.success(res.message);
                    loadUsers();
                } else {
                    toast.error(res.message);
                }
            } catch (error) {
                toast.error("Error deleting user");
            }
        }
    };

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
                    <Users className="text-gold" size={32} /> User Master
                </h1>
                <button
                    onClick={() => navigate('/users/add')}
                    className="px-6 py-3 bg-gold hover:bg-gold/90 text-white rounded-xl font-black text-[14px] uppercase tracking-widest shadow-lg shadow-gold/20 flex items-center gap-2 transition-all hover:scale-105"
                >
                    <UserPlus size={18} strokeWidth={3} /> Add New
                </button>
            </div>

            {/* Table Container */}
            <div className="bg-card/40 backdrop-blur-md rounded-3xl border border-border shadow-2xl overflow-hidden text-[14px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead className="bg-muted/50 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-border">
                            <tr>
                                <th className="px-6 py-5 w-20">#</th>
                                <th className="px-6 py-5">Full Name</th>
                                <th className="px-6 py-5">Email</th>
                                <th className="px-6 py-5">Phone</th>
                                <th className="px-6 py-5">User Name</th>
                                <th className="px-6 py-5">Password</th>
                                <th className="px-6 py-5">Department</th>
                                <th className="px-6 py-5">Designation</th>
                                <th className="px-6 py-5 text-center">Status</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center">
                                        <RefreshCw className="animate-spin text-gold mx-auto" size={32} />
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center text-muted-foreground font-black text-xs uppercase tracking-widest">
                                        No Users Found
                                    </td>
                                </tr>
                            ) : users.map((item, index) => (
                                <tr key={item.idUser} className="group hover:bg-gold/[0.03] transition-colors">
                                    <td className="px-6 py-4 font-black text-muted-foreground">{index + 1}</td>
                                    <td className="px-6 py-4 font-black text-foreground uppercase tracking-tight">
                                        {item.userFullName}
                                    </td>
                                    <td className="px-6 py-4 font-black text-gold tracking-widest text-xs">
                                        {item.email}
                                    </td>
                                    <td className="px-6 py-4 font-black text-gold tracking-widest text-xs">
                                        {item.phone}
                                    </td>
                                    <td className="px-6 py-4 font-black text-gold tracking-widest text-xs">
                                        {item.userName}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 group">
                                            <span className="font-mono text-[11px] text-muted-foreground min-w-[80px]">
                                                {visiblePasswords[item.idUser] ? (item.password || 'N/A') : '••••••••'}
                                            </span>
                                            <button
                                                onClick={() => togglePassword(item.idUser)}
                                                className="p-1.5 rounded-md hover:bg-gold/10 text-muted-foreground/40 hover:text-gold transition-all"
                                                title={visiblePasswords[item.idUser] ? "Hide Password" : "Show Password"}
                                            >
                                                {visiblePasswords[item.idUser] ? <EyeOff size={12} /> : <Eye size={12} />}
                                            </button>
                                        </div>
                                    </td>



                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-muted rounded-lg text-[11px] font-black uppercase text-muted-foreground">
                                            {item.departmentName || 'General'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-muted-foreground italic">
                                        {item.designationName || 'Staff'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${item.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {item.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`/users/edit/${item.idUser}`)}
                                                className="p-2 bg-gold/10 text-gold rounded-lg hover:bg-gold hover:text-white transition-all"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.idUser)}
                                                className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserList;
