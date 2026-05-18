import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ChevronLeft, Loader2 } from 'lucide-react';
import { certificateTypeService } from '../../api/certificateTypeService';
import { toast } from 'react-hot-toast';

const CertificateTypeForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ idCertificateType: 0, certificateTypeName: '', remarks: '', isActive: true });
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            loadData();
        }
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const res = await certificateTypeService.getById(id);
            if (res.success) setFormData(res.data);
        } catch (error) {
            toast.error("Error loading certificate type");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await certificateTypeService.save(formData);
            if (res.result > 0) {
                toast.success(res.message);
                navigate('/certificate-type');
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("An error occurred while saving");
        } finally {
            setSaving(false);
        }
    };

    const inputClass = "w-full bg-background border-2 border-border/60 rounded-xl px-4 py-3.5 text-sm font-bold text-foreground focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all shadow-sm";

    if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-gold" size={48} /></div>;

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-10 duration-700">
            <button
                onClick={() => navigate('/certificate-type')}
                className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground hover:text-gold tracking-widest"
            >
                <ChevronLeft size={16} /> Back to list
            </button>
            <h1 className="text-4xl font-black tracking-tight">{id ? 'Edit' : 'Add'} Certificate Type</h1>

            <form onSubmit={handleSubmit} className="bg-card border-2 border-border shadow-2xl p-8 md:p-12 rounded-[2.5rem] space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[14px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-1">Certificate Type Name</label>
                        <input
                            required
                            type="text"
                            value={formData.certificateTypeName}
                            onChange={e => setFormData({ ...formData, certificateTypeName: e.target.value })}
                            className={inputClass}
                            placeholder="e.g. ISO 9001:2015"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-border mt-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                            className="accent-gold w-5 h-5 rounded cursor-pointer"
                        />
                        <span className="text-[14px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">Active Status</span>
                    </label>
                    <button
                        disabled={saving}
                        className="px-10 py-4 bg-gold hover:bg-gold/90 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-gold/20 hover:scale-105 transition-all flex items-center gap-3"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} strokeWidth={3} />}
                        {id ? 'Update Certificate Type' : 'Save Certificate Type'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CertificateTypeForm;
