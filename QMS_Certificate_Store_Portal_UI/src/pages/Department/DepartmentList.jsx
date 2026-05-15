import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Layers, RefreshCw } from 'lucide-react';
import { departmentService } from '../../api/departmentService';
import { toast } from 'react-hot-toast';
import { usePagination } from '../../components/usePagination';
import Pagination from '../../components/Pagination';
import { useSearch } from '../../hooks/useSearch';
import SearchInput from '../../components/SearchInput';
const DepartmentList = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { searchTerm, setSearchTerm, filteredItems } = useSearch(departments);

    const { currentItems, paginationProps } = usePagination(filteredItems, 10);

    useEffect(() => { loadDepartments(); }, []);

    const loadDepartments = async () => {
        try {
            setLoading(true);
            const res = await departmentService.getAll();
            if (res.success) setDepartments(res.data);
        } catch (error) { toast.error("Failed to load departments"); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this department?")) {
            try {
                const res = await departmentService.delete(id);
                if (res.result === 1) { toast.success(res.message); loadDepartments(); }
                else toast.error(res.message);
            } catch (error) { toast.error("Error deleting department"); }
        }
    };

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
                    <Layers className="text-gold" size={32} /> Department Master
                </h1>

                {/* 🟢 Group Search and Button together */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex-1 md:w-80">
                        <SearchInput
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Search departments..."
                        />
                    </div>

                    <button
                        onClick={() => navigate('/department/add')}
                        className="px-6 py-3 bg-gold hover:bg-gold/90 text-white rounded-xl font-black text-[14px] uppercase tracking-widest shadow-lg shadow-gold/20 flex items-center gap-2 transition-all hover:scale-105 whitespace-nowrap"
                    >
                        <Plus size={18} strokeWidth={3} /> Add New
                    </button>
                </div>
            </div>


            <div className="bg-card/40 backdrop-blur-md rounded-3xl border border-border shadow-2xl overflow-hidden text-[14px]">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/50 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-border">
                        <tr>
                            <th className="px-6 py-5 w-20">#</th>
                            <th className="px-6 py-5">Location</th>
                            <th className="px-6 py-5">Department Name</th>
                            {/* <th className="px-6 py-5">Remarks</th> */}
                            <th className="px-6 py-5 text-center">Status</th>
                            <th className="px-6 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr><td colSpan="6" className="py-20 text-center"><RefreshCw className="animate-spin text-gold mx-auto" /></td></tr>
                        ) : departments.length === 0 ? (
                            <tr><td colSpan="6" className="py-20 text-center text-muted-foreground font-black text-xs uppercase tracking-widest">No Records Found</td></tr>
                        ) : currentItems.map((item, index) => (
                            <tr key={item.idDepartment} className="group hover:bg-gold/[0.03] transition-colors">
                                <td className="px-6 py-4 font-black text-muted-foreground">{index + 1}</td>
                                <td className="px-6 py-4"><span className="px-3 py-1 bg-muted rounded-lg text-[11px] font-black uppercase text-muted-foreground">{item.locationName}</span></td>
                                <td className="px-6 py-4 font-black text-foreground">{item.departmentName}</td>
                                {/* <td className="px-6 py-4 text-xs italic text-muted-foreground">{item.remarks || '-'}</td> */}
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${item.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {item.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => navigate(`/department/edit/${item.idDepartment}`)} className="p-2 bg-gold/10 text-gold rounded-lg hover:bg-gold hover:text-white transition-all"><Edit2 size={14} /></button>
                                        <button onClick={() => handleDelete(item.idDepartment)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination {...paginationProps} />
            </div>
        </div>
    );
};

export default DepartmentList;
