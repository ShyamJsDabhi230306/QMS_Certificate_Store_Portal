import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ChevronLeft, Loader2 } from 'lucide-react';
import { departmentService } from '../../api/departmentService';
import { locationService } from '../../api/locationService';
import { toast } from 'react-hot-toast';

const DepartmentForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [locations, setLocations] = useState([]);
    const [formData, setFormData] = useState({ idDepartment: 0, idLocation: '', departmentName: '', isActive: true });
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadData(); }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const locRes = await locationService.getAll();
            if (locRes.success) setLocations(locRes.data);
            if (id) {
                const depRes = await departmentService.getById(id);
                if (depRes.success) setFormData(depRes.data);
            }
        } catch (error) { toast.error("Error loading data"); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.idLocation) return toast.error("Please select a location");
        setSaving(true);
        const res = await departmentService.save(formData);
        if (res.result === 1) { toast.success(res.message); navigate('/department'); }
        else toast.error(res.message);
        setSaving(false);
    };

    const inputClass = "w-full bg-background border-2 border-border/60 rounded-xl px-4 py-3.5 text-sm font-bold text-foreground focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all shadow-sm";

    if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-gold" size={48} /></div>;

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-10 duration-700">
            <button onClick={() => navigate('/department')} className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground hover:text-gold tracking-widest"><ChevronLeft size={16} /> Back to list</button>
            <h1 className="text-4xl font-black tracking-tight">{id ? 'Edit' : 'Add'} Department</h1>

            <form onSubmit={handleSubmit} className="bg-card border-2 border-border shadow-2xl p-8 md:p-12 rounded-[2.5rem] space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[14px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-1">Select Location</label>
                        <select required value={formData.idLocation} onChange={e => setFormData({ ...formData, idLocation: e.target.value })} className={inputClass}>
                            <option value="">-- Select Location --</option>
                            {locations.map(l => <option key={l.idLocation} value={l.idLocation}>{l.locationName}</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[14px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-1">Department Name</label>
                        <input required type="text" value={formData.departmentName} onChange={e => setFormData({ ...formData, departmentName: e.target.value })} className={inputClass} placeholder="e.g. Sales / HR" />
                    </div>

                    {/* <div className="space-y-2 col-span-2">
                        <label className="text-[14px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-1">Remarks</label>
                        <textarea value={formData.remarks} onChange={e => setFormData({ ...formData, remarks: e.target.value })} className={`${inputClass} resize-none`} rows="2" placeholder="Optional notes" />
                    </div> */}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-border mt-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} className="accent-gold w-5 h-5 rounded cursor-pointer" />
                        <span className="text-[14px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">Active Status</span>
                    </label>
                    <button disabled={saving} className="px-10 py-4 bg-gold hover:bg-gold/90 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-gold/20 hover:scale-105 transition-all flex items-center gap-3">
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} strokeWidth={3} />}
                        {id ? 'Update Department' : 'Save Department'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DepartmentForm;
