import React, { useEffect, useState } from 'react';
import { ShieldCheck, User as UserIcon, RefreshCw, Save } from 'lucide-react';
import { userRightService } from '../../api/userRightService';
import { userApi } from '../../api/userApi';
import { toast } from 'react-hot-toast';

const UserRightForm = () => {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [rights, setRights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = async () => {
        const res = await userApi.getAll();
        if (res.success) setUsers(res.data);
    };

    useEffect(() => {
        if (selectedUserId) loadUserRights();
    }, [selectedUserId]);

    const loadUserRights = async () => {
        setLoading(true);
        const res = await userRightService.getByUserId(selectedUserId);
        if (res.success) setRights(res.data);
        setLoading(false);
    };

    // This now only updates the local state (No API call here)
    const handleToggle = (idPage, field) => {
        setRights(prev => prev.map(item =>
            (item.idPage === idPage || item.IDPage === idPage)
                ? { ...item, [field]: !item[field] }
                : item
        ));
    };

    // The Master Save Function
    const handleSaveAll = async () => {
        setSaving(true);
        try {
            // We send the entire array to a new bulk-update endpoint
            const res = await userRightService.updateBulk(rights);
            if (res.success) {
                toast.success("All permissions updated successfully!");
                loadUserRights(); // Refresh data
            } else {
                toast.error(res.message || "Failed to update permissions");
            }
        } catch (error) {
            toast.error("An error occurred while saving");
        } finally {
            setSaving(false);
        }
    };

    const inputClass = "w-full bg-background border-2 border-border/60 rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:border-gold transition-all shadow-sm";

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
                    <ShieldCheck className="text-gold" size={32} /> User Rights Master
                </h1>

                {selectedUserId && (
                    <button
                        onClick={handleSaveAll}
                        disabled={saving}
                        className="px-8 py-3 bg-gold hover:bg-gold/90 text-white rounded-xl font-black uppercase tracking-widest shadow-lg shadow-gold/20 flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
                    >
                        {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} strokeWidth={3} />}
                        Save All Rights
                    </button>
                )}
            </div>

            {/* User Selection Card */}
            <div className="bg-card border-2 border-border p-6 rounded-3xl shadow-xl max-w-md">
                <label className="text-[12px] font-black uppercase text-muted-foreground tracking-widest ml-1 mb-2 block">Select User</label>
                <div className="relative">
                    <UserIcon className="absolute left-4 top-3.5 text-muted-foreground" size={18} />
                    <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} className={`${inputClass} pl-12`}>
                        <option value="">-- Choose User --</option>
                        {users.map(u => (
                            <option key={u.idUser} value={u.idUser}>{u.userFullName}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Rights Table */}
            {selectedUserId && (
                <div className="bg-card/40 backdrop-blur-md rounded-3xl border border-border shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-muted/50 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-border">
                                <tr>
                                    <th className="px-8 py-5">Page Name</th>
                                    <th className="px-6 py-5 text-center">View</th>
                                    <th className="px-6 py-5 text-center">Create</th>
                                    <th className="px-6 py-5 text-center">Edit</th>
                                    <th className="px-6 py-5 text-center">Delete</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {loading ? (
                                    <tr><td colSpan="5" className="py-20 text-center"><RefreshCw className="animate-spin text-gold mx-auto" /></td></tr>
                                ) : rights.map((item) => (
                                    <tr key={item.idPage} className="group hover:bg-gold/[0.03] transition-colors">
                                        <td className="px-8 py-4 font-black text-sm text-foreground">{item.pageName}</td>
                                        {['canView', 'canCreate', 'canEdit', 'canDelete'].map((field) => (
                                            <td key={field} className="px-6 py-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={item[field]}
                                                    onChange={() => handleToggle(item.idPage, field)}
                                                    className="w-5 h-5 rounded accent-gold cursor-pointer"
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserRightForm;
