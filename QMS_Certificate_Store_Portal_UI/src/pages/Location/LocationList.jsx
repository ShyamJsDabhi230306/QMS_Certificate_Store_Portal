import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, MapPin, RefreshCw } from 'lucide-react';
import { locationService } from '../../api/locationService';
import { toast } from 'react-hot-toast';

const LocationList = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => { loadLocations(); }, []);

    const loadLocations = async () => {
        try {
            setLoading(true);
            const res = await locationService.getAll();
            if (res.success) setLocations(res.data);
        } catch (error) { toast.error("Failed to load locations"); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this location?")) {
            try {
                const res = await locationService.delete(id);
                if (res.result === 1) { toast.success(res.message); loadLocations(); }
                else toast.error(res.message);
            } catch (error) { toast.error("Error deleting location"); }
        }
    };

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
                    <MapPin className="text-gold" size={32} /> Location Master
                </h1>
                <button onClick={() => navigate('/location/add')} className="px-6 py-3 bg-gold hover:bg-gold/90 text-white rounded-xl font-black text-[14px] uppercase tracking-widest shadow-lg shadow-gold/20 flex items-center gap-2 transition-all hover:scale-105">
                    <Plus size={18} strokeWidth={3} /> Add New
                </button>
            </div>

            <div className="bg-card/40 backdrop-blur-md rounded-3xl border border-border shadow-2xl overflow-hidden text-[14px]">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/50 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-border">
                        <tr>
                            <th className="px-6 py-5 w-20">#</th>
                            <th className="px-6 py-5">Company Name</th>
                            <th className="px-6 py-5">Location Name</th>
                            <th className="px-6 py-5 text-center">Status</th>
                            <th className="px-6 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr><td colSpan="5" className="py-20 text-center"><RefreshCw className="animate-spin text-gold mx-auto" /></td></tr>
                        ) : locations.length === 0 ? (
                            <tr><td colSpan="5" className="py-20 text-center text-muted-foreground font-black text-xs uppercase tracking-widest">No Records Found</td></tr>
                        ) : locations.map((item, index) => (
                            <tr key={item.idLocation} className="group hover:bg-gold/[0.03] transition-colors">
                                <td className="px-6 py-4 font-black text-muted-foreground">{index + 1}</td>
                                <td className="px-6 py-4 font-black text-gold uppercase tracking-wider">{item.companyName}</td>
                                <td className="px-6 py-4 font-black text-foreground">{item.locationName}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${item.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {item.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => navigate(`/location/edit/${item.idLocation}`)} className="p-2 bg-gold/10 text-gold rounded-lg hover:bg-gold hover:text-white transition-all"><Edit2 size={14} /></button>
                                        <button onClick={() => handleDelete(item.idLocation)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LocationList;
