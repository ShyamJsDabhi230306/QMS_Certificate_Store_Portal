import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, deleteUser } from '@/api/userApi';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [visiblePasswords, setVisiblePasswords] = useState({});

    const itemsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = async () => {
        const res = await getAllUsers();
        if (res.success) setUsers(res.data);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this user permanently?")) {
            const res = await deleteUser(id);
            if (res.success) loadUsers();
        }
    };

    const filteredUsers = users.filter(user =>
        (user.userFullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.userName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentItems = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    return (
        <div className="p-10 lg:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

            <header className="flex flex-col lg:flex-row justify-between items-end gap-10">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        {/* <div className="h-10 w-2 bg-gold rounded-full"></div> */}
                        <h1 className="text-5xl md:text-5xl font-black italic tracking-tighter uppercase text-foreground leading-none">
                            User <span className="text-gold">Management</span>
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-sm font-bold uppercase tracking-[0.4em] ml-5">
                        Enterprise Access Control System
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    <div className="relative group">
                        <Input
                            placeholder="SEARCH SYSTEM RECORDS..."
                            className="h-12 w-full lg:w-96 bg-card border-2 border-border font-black tracking-widest px-8 rounded-2xl group-hover:border-gold transition-all duration-300"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-gold transition-colors">🔍</div>
                    </div>
                    <Button
                        onClick={() => navigate('/users/add')}
                        className="h-12 bg-gold text-white font-black italic uppercase tracking-widest px-10 rounded-2xl shadow-2xl shadow-gold/30 hover:shadow-gold/50 hover:bg-gold-hover hover:-translate-y-1 transition-all duration-300 active:scale-95"
                    >
                        + Add User
                    </Button>
                </div>
            </header>

            <Card className="rounded-[3rem] border-none shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] overflow-hidden bg-card/60 backdrop-blur-xl border border-white/10">
                <CardHeader className="bg-muted/30 p-6 border-b border-border flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-xs font-black uppercase tracking-[0.6em] text-gold mb-1">Database Master List</CardTitle>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Total Active Entities: {users.length}</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="h-2 w-2 rounded-full bg-gold animate-pulse"></div>
                        <div className="h-2 w-2 rounded-full bg-gold/40"></div>
                        <div className="h-2 w-2 rounded-full bg-gold/20"></div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[12px] font-black uppercase tracking-[0.3em] text-muted-foreground border-b border-border bg-muted/10">
                                    <th className="px-10 py-8 text-center w-20">#</th>
                                    <th className="px-8 py-8">Full Name</th>
                                    <th className="px-8 py-8">Email</th>
                                    <th className="px-8 py-8">Department</th>
                                    <th className="px-8 py-8">Designation</th>
                                    <th className="px-8 py-8">User Name</th>
                                    <th className="px-8 py-8">Password</th>
                                    <th className="px-8 py-8 text-right">Actions  </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {currentItems.map((user, index) => (
                                    <tr key={user.idUser} className="hover:bg-gold/5 transition-all duration-300 group cursor-default">

                                        {/* Reduced padding from py-8 to py-3 to make row height smaller */}
                                        <td className="px-6 py-3 text-center font-mono text-xs font-black text-muted-foreground group-hover:text-gold transition-colors">
                                            {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, '0')}
                                        </td>

                                        <td className="px-6 py-3">
                                            <div className="text-md  tracking-tighter  group-hover:translate-x-1 transition-transform duration-300">
                                                {user.userFullName}
                                            </div>
                                        </td>



                                        <td className="px-6 py-3 text-md    tracking-tight">
                                            {user.email}
                                        </td>

                                        <td className="px-6 py-3 text-md ">
                                            {user.departmentName || "GENERAL"}
                                        </td>

                                        <td className="px-6 py-3 text-md ">
                                            {user.designationName || "STAFF"}
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full   text-[14px] font-black text-gold-text tracking-widest  border border-border group-hover:border-gold/30 transition-all">
                                                {user.userName}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-center font-mono text-xs ">
                                            <div className="flex items-center justify-center gap-2">
                                                <span className="italic">
                                                    {visiblePasswords[user.idUser] ? user.password : "••••••••"}
                                                </span>
                                                <button
                                                    onClick={() => setVisiblePasswords(prev => ({ ...prev, [user.idUser]: !prev[user.idUser] }))}
                                                    className="hover:text-gold transition-colors text-sm cursor-pointer focus:outline-none"
                                                    title={visiblePasswords[user.idUser] ? "Hide Password" : "Show Password"}
                                                >
                                                    {visiblePasswords[user.idUser] ? "🙈" : "👁️"}
                                                </button>
                                            </div>
                                        </td>


                                        <td className="px-6 py-3 text-right">
                                            <div className="flex justify-end items-center gap-6">
                                                <button
                                                    className="text-gold-text hover:text-gold font-black text-[11px] uppercase tracking-widest transition-all duration-300 hover:scale-110 active:scale-95"
                                                    onClick={() => navigate(`/users/edit/${user.idUser}`)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="text-muted-foreground hover:text-red-500 font-black text-[11px] uppercase tracking-widest transition-all duration-300 hover:scale-110 active:scale-95"
                                                    onClick={() => handleDelete(user.idUser)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>

                    {/* Pagination - Keep it simple but premium */}
                    <div className="p-2 border-t border-border flex justify-between items-center bg-muted/5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            Displaying {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} records
                        </p>
                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                className="h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-gold hover:text-gold transition-all disabled:opacity-30"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => p - 1)}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                className="h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-gold hover:text-gold transition-all disabled:opacity-30"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => p + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserList;

