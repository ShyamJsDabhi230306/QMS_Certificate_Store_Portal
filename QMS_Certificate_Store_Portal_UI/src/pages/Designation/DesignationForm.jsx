import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ChevronLeft, Loader2 } from 'lucide-react';
import { designationService } from '../../api/designationService';
import { toast } from 'react-hot-toast';

const DesignationForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ idDesignation: 0, designationName: '', isActive: true });
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(Boolean(id));

    useEffect(() => { if (id) loadData(); }, [id]);

    const loadData = async () => {
        try {
            const res = await designationService.getById(id);
            if (res.success) setFormData(res.data);
        } catch (error) { toast.error("Error loading data"); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const res = await designationService.save(formData);
        if (res.result === 1) { toast.success(res.message); navigate('/designation'); }
        else toast.error(res.message);
        setSaving(false);
    };

    const inputClass = "w-full bg-background border-2 border-border/60 rounded-xl px-4 py-3.5 text-sm font-bold text-foreground focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all shadow-sm";

    if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-gold" size={48} /></div>;

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-10 duration-700">
            <button onClick={() => navigate('/designation')} className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground hover:text-gold tracking-widest"><ChevronLeft size={16} /> Back to list</button>
            <h1 className="text-4xl font-black tracking-tight">{id ? 'Edit' : 'Add'} Designation</h1>

            <form onSubmit={handleSubmit} className="bg-card border-2 border-border shadow-2xl p-8 md:p-10 rounded-[2.5rem] space-y-8">
                <div className="space-y-2">
                    <label className="text-[14px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-1">Designation Name</label>
                    <input required type="text" value={formData.designationName} onChange={e => setFormData({ ...formData, designationName: e.target.value })} className={inputClass} placeholder="e.g. Senior Manager" />
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-border mt-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} className="accent-gold w-5 h-5 rounded cursor-pointer" />
                        <span className="text-[14px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">Active Status</span>
                    </label>
                    <button disabled={saving} className="px-10 py-4 bg-gold hover:bg-gold/90 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-gold/20 hover:scale-105 transition-all flex items-center gap-3">
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} strokeWidth={3} />}
                        {id ? 'Update' : 'Save'} Designation
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DesignationForm;
