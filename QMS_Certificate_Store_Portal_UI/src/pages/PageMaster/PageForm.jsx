import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ChevronLeft, Loader2 } from 'lucide-react';
import { pageService } from '../../api/pageService';
import { toast } from 'react-hot-toast';

const PageForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // 1. Always keep a default object structure
    const [formData, setFormData] = useState({ idPage: 0, pageName: '', isActive: true });
    const [saving, setSaving] = useState(false);

    useEffect(() => { if (id) loadPage(); }, [id]);

    const loadPage = async () => {
        try {
            const res = await pageService.getById(id);
            // 2. SAFETY CHECK: Only set data if it exists and is not null
            if (res.success && res.data) {
                setFormData(res.data);
            } else if (res.success && !res.data) {
                toast.error("Page record not found in database");
                navigate('/page-master');
            }
        } catch (error) {
            toast.error("Failed to fetch page data");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const res = await pageService.save(formData);
        if (res.result > 0) {
            toast.success(res.message);
            navigate('/page-master');
        } else {
            toast.error(res.message);
        }
        setSaving(false);
    };

    const inputClass = "w-full bg-background border-2 border-border/60 rounded-xl px-4 py-3.5 text-sm font-bold text-foreground focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all shadow-sm placeholder:text-muted-foreground/50";

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-10 duration-700">
            <button onClick={() => navigate('/page-master')} className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground hover:text-gold tracking-widest">
                <ChevronLeft size={16} /> Back to list
            </button>
            <h1 className="text-4xl font-black tracking-tight">{id ? 'Edit' : 'Add'} Page</h1>

            <form onSubmit={handleSubmit} className="bg-card border-2 border-border shadow-2xl p-8 md:p-12 rounded-[2.5rem] space-y-8">
                <div className="space-y-2">
                    <label className="text-[14px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-1">Page Name</label>
                    <input
                        required
                        type="text"
                        // 3. Fallback to empty string if pageName is null
                        value={formData?.pageName || ''}
                        onChange={e => setFormData({ ...formData, pageName: e.target.value })}
                        className={inputClass}
                        placeholder="e.g. User Rights, Inventory..."
                    />
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-border mt-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={formData?.isActive || false}
                            onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                            className="accent-gold w-5 h-5 rounded cursor-pointer"
                        />
                        <span className="text-[14px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">Active Status</span>
                    </label>

                    <button disabled={saving} className="px-10 py-4 bg-gold hover:bg-gold/90 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-gold/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} strokeWidth={3} />}
                        {id ? 'Update Page' : 'Save Page'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PageForm;
