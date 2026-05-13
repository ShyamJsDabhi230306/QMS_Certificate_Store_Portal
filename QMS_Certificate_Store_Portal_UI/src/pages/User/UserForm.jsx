import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById, saveUser } from '@/api/userApi';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        idUser: 0,
        userFullName: '',
        userName: '',
        password: '',
        email: '',
        idDepartment: 0,
        idDesignation: 0,
        isActive: true,
        e_By: 'Admin'
    });

    useEffect(() => {
        if (id) {
            loadUser(id);
        }
    }, [id]);

    const loadUser = async (userId) => {
        const res = await getUserById(userId);
        if (res.success) {
            setFormData(res.data);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await saveUser(formData);
            if (res.success) {
                navigate('/users');
            } else {
                alert(res.message);
            }
        } catch (error) {
            console.error("Error saving user", error);
        }
    };

    return (
        <div className="p-10 lg:p-16 max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            
            <header className="space-y-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/users')}
                        className="h-12 w-12 flex items-center justify-center rounded-2xl bg-muted/50 hover:bg-gold/10 hover:text-gold transition-all duration-300 border border-border/50"
                    >
                        ←
                    </button>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-foreground leading-none">
                            {id ? 'Modify' : 'Initialize'} <span className="text-gold">Entity</span>
                        </h1>
                        <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.4em] mt-2">
                            Secure Access Provisioning Protocol
                        </p>
                    </div>
                </div>
            </header>

            <Card className="rounded-[3rem] border-none shadow-[0_32px_64px_-15px_rgba(0,0,0,0.15)] overflow-hidden bg-card/60 backdrop-blur-2xl border border-white/10">
                <CardHeader className="bg-muted/30 p-12 border-b border-border">
                    <CardTitle className="text-xs font-black uppercase tracking-[0.6em] text-gold">System Configuration Manifest</CardTitle>
                </CardHeader>
                <CardContent className="p-12">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Full Identity</label>
                            <Input 
                                type="text" 
                                name="userFullName" 
                                value={formData.userFullName || ''} 
                                onChange={handleChange} 
                                required 
                                className="h-16 bg-muted/20 border-2 border-border/50 focus:border-gold rounded-2xl font-bold tracking-tight px-6 transition-all"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Credential ID</label>
                            <Input 
                                type="text" 
                                name="userName" 
                                value={formData.userName || ''} 
                                onChange={handleChange} 
                                required 
                                className="h-16 bg-muted/20 border-2 border-border/50 focus:border-gold rounded-2xl font-bold tracking-widest px-6 transition-all"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Digital Address</label>
                            <Input 
                                type="email" 
                                name="email" 
                                value={formData.email || ''} 
                                onChange={handleChange} 
                                required 
                                className="h-16 bg-muted/20 border-2 border-border/50 focus:border-gold rounded-2xl font-bold italic px-6 transition-all"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Access Cipher</label>
                            <Input 
                                type="password" 
                                name="password" 
                                value={formData.password || ''} 
                                onChange={handleChange} 
                                required={!id} 
                                placeholder={id ? "Leave empty to retain current" : "••••••••"}
                                className="h-16 bg-muted/20 border-2 border-border/50 focus:border-gold rounded-2xl font-bold px-6 transition-all"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Sector Code (Dept)</label>
                            <Input 
                                type="number" 
                                name="idDepartment" 
                                value={formData.idDepartment || 0} 
                                onChange={handleChange} 
                                className="h-16 bg-muted/20 border-2 border-border/50 focus:border-gold rounded-2xl font-bold px-6 transition-all"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Role Classification (Desig)</label>
                            <Input 
                                type="number" 
                                name="idDesignation" 
                                value={formData.idDesignation || 0} 
                                onChange={handleChange} 
                                className="h-16 bg-muted/20 border-2 border-border/50 focus:border-gold rounded-2xl font-bold px-6 transition-all"
                            />
                        </div>

                        <div className="md:col-span-2 pt-8 flex items-center gap-6">
                            <Button 
                                type="submit" 
                                className="h-16 flex-1 bg-gold text-white font-black italic uppercase tracking-widest rounded-2xl shadow-2xl shadow-gold/30 hover:shadow-gold/50 hover:bg-gold-hover hover:-translate-y-1 transition-all duration-300"
                            >
                                {id ? 'Commit Changes' : 'Authorize Entity'}
                            </Button>
                            <Button 
                                type="button" 
                                variant="outline"
                                onClick={() => navigate('/users')}
                                className="h-16 px-12 border-2 border-border hover:bg-muted text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all"
                            >
                                Abort
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserForm;

