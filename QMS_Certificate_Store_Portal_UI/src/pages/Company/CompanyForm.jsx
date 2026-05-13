import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ChevronLeft, Loader2 } from 'lucide-react';
import { companyService } from '../../api/companyService';
import { toast } from 'react-hot-toast';

const CompanyForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ idCompany: 0, companyName: '', address: '', contactNo: '', email: '', panNo: '', gstNo: '', isActive: true });
    const [saving, setSaving] = useState(false);

    useEffect(() => { if (id) loadCompany(); }, [id]);

    const loadCompany = async () => {
        const res = await companyService.getById(id);
        if (res.success) setFormData(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const res = await companyService.save(formData);
        if (res.result === 1) { toast.success(res.message); navigate('/company'); }
        else toast.error(res.message);
        setSaving(false);
    };

    // Style classes for visibility in Light Mode
    const inputClass = "w-full bg-background border-2 border-border/60 rounded-xl px-4 py-3.5 text-sm font-bold text-foreground focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all shadow-sm placeholder:text-muted-foreground/50";

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-10 duration-700">
            <button onClick={() => navigate('/company')} className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground hover:text-gold tracking-widest"><ChevronLeft size={16} /> Back to list</button>
            <h1 className="text-4xl font-black tracking-tight">{id ? 'Edit' : 'Add'} Company</h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 bg-card border-2 border-border shadow-2xl p-8 md:p-12 rounded-[2.5rem]">
                <div className="space-y-2 col-span-2">
                    <label className="text-[14px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-1">Company Name</label>
                    <input required type="text" value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })} className={inputClass} placeholder="Enter company name" />
                </div>

                <div className="space-y-2">
                    <label className="text-[14px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-1">Email ID</label>
                    <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className={inputClass} placeholder="mail@company.com" />
                </div>

                <div className="space-y-2">
                    <label className="text-[14px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-1">Contact Number</label>
                    <input required type="text" value={formData.contactNo} onChange={e => setFormData({ ...formData, contactNo: e.target.value })} className={inputClass} placeholder="+91 ..." />
                </div>

                <div className="space-y-2">
                    <label className="text-[14px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-1">PAN Number</label>
                    <input required type="text" value={formData.panNo} onChange={e => setFormData({ ...formData, panNo: e.target.value.toUpperCase() })} className={inputClass} placeholder="ABCDE1234F" />
                </div>

                <div className="space-y-2">
                    <label className="text-[14px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-1">GST Number</label>
                    <input required type="text" value={formData.gstNo} onChange={e => setFormData({ ...formData, gstNo: e.target.value.toUpperCase() })} className={inputClass} placeholder="22AAAAA0000A1Z5" />
                </div>

                <div className="space-y-2 col-span-2">
                    <label className="text-[14px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-1">Office Address</label>
                    <textarea required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className={`${inputClass} resize-none`} rows="3" placeholder="Enter full address" />
                </div>

                <div className="col-span-2 flex items-center justify-between pt-6 border-t border-border mt-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} className="accent-gold w-5 h-5 rounded cursor-pointer" />
                        <span className="text-[14px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">Active Status</span>
                    </label>

                    <button disabled={saving} className="px-10 py-4 bg-gold hover:bg-gold/90 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-gold/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} strokeWidth={3} />}
                        {id ? 'Update Company' : 'Save Company'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompanyForm;
