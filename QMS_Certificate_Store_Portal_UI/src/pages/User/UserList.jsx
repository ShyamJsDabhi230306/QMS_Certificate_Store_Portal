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
        <div className="p-8 lg:p-12 space-y-10 animate-in fade-in duration-700">

            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div className="space-y-1">
                    <h1 className="text-4xl md:text-6xl font-[1000] italic tracking-tighter uppercase text-foreground">User Directory</h1>
                    <div className="h-2 w-48 bg-gold rounded-full"></div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    <Input placeholder="SEARCH ERP RECORDS..." className="h-16 w-full lg:w-96 bg-card border-2 border-border font-bold tracking-[0.2em]" onChange={(e) => setSearchTerm(e.target.value)} />
                    <Button className="h-16 bg-gold text-black font-[1000] italic uppercase tracking-widest px-10 rounded-[2rem] shadow-xl hover:shadow-gold/40 transition-all">+ Add Record</Button>
                </div>
            </header>

            <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-card/50 backdrop-blur-md">
                <CardHeader className="bg-muted/30 p-8 border-b border-border">
                    <CardTitle className="text-xs font-black uppercase tracking-[0.5em] text-gold">Master User Records</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-separate border-spacing-y-2 px-8">
                            <thead className="text-sm font-black uppercase tracking-[0.3em] text-foreground/70">
                                <tr>
                                    <th className="p-6 text-center">No</th>
                                    <th className="p-6">Full Name</th>
                                    <th className="p-6">User Name</th>
                                    <th className="p-6">Email Address</th>
                                    <th className="p-6">Department</th>
                                    <th className="p-6">Designation</th>
                                    <th className="p-6 text-center">Password</th>
                                    <th className="p-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {currentItems.map((user, index) => (
                                    <tr key={user.idUser} className="bg-muted/5 hover:bg-gold/5 transition-all group">
                                        <td className="p-6 text-center font-mono text-sm font-bold text-foreground/60 italic">
                                            {(currentPage - 1) * itemsPerPage + index + 1}
                                        </td>

                                        <td className="p-6">
                                            <div className="text-base font-[1000] uppercase italic tracking-tighter text-foreground leading-none">
                                                {user.userFullName}
                                            </div>
                                        </td>

                                        {/* Use gold-text for readability */}
                                        <td className="p-6 text-sm font-black text-gold-text tracking-widest italic">
                                            {user.userName}
                                        </td>

                                        {/* Email is now solid foreground */}
                                        <td className="p-6 text-sm text-foreground font-bold italic">
                                            {user.email}
                                        </td>

                                        <td className="p-6 text-xs font-black uppercase tracking-tighter text-foreground">
                                            {user.departmentName || "GENERAL"}
                                        </td>

                                        <td className="p-6 text-xs font-black uppercase tracking-tighter text-foreground">
                                            {user.designationName || "STAFF"}
                                        </td>

                                        {/* Password is now solid grey instead of transparent */}
                                        <td className="p-6 text-center font-mono text-sm text-muted-foreground italic">
                                            ••••••••
                                        </td>

                                        <td className="p-6 text-right space-x-6">
                                            {/* EDIT BUTTON IS NOW BOLD GOLD */}
                                            <button
                                                className="text-gold-text hover:underline font-[1000] text-xs uppercase tracking-[0.2em]"
                                                onClick={() => navigate(`/users/edit/${user.idUser}`)}
                                            >
                                                Edit Record
                                            </button>
                                            <button
                                                className="text-red-600 hover:underline font-[1000] text-xs uppercase tracking-[0.2em]"
                                                onClick={() => handleDelete(user.idUser)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
};

export default UserList;
