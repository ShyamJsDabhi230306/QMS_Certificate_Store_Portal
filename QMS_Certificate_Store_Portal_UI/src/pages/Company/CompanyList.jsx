import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Building2, RefreshCw } from 'lucide-react';
import { companyService } from '../../api/companyService';
import { toast } from 'react-hot-toast';
import { usePagination } from '../../components/usePagination';
import Pagination from '../../components/Pagination';
import SearchInput from '../../components/SearchInput';
import { useSearch } from '../../hooks/useSearch';
import { usePermissions } from '@/hooks/usePermissions';

const CompanyList = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const { searchTerm, setSearchTerm, filteredItems } = useSearch(companies);
    const { currentItems, paginationProps } = usePagination(filteredItems, 10);
    const navigate = useNavigate();
    const { canCreate, canEdit, canDelete, } = usePermissions("Company Master");

    useEffect(() => { loadCompanies(); }, []);

    const loadCompanies = async () => {
        try {
            setLoading(true);
            const res = await companyService.getAll();
            if (res.success) setCompanies(res.data);
        } catch (error) { toast.error("Failed to load companies"); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this company?")) {
            try {
                const res = await companyService.delete(id);
                if (res.result === 1) { toast.success(res.message); loadCompanies(); }
                else toast.error(res.message);
            } catch (error) { toast.error("Error deleting company"); }
        }
    };

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
                    <Building2 className="text-gold" size={32} /> Company Master
                </h1>

                {/* 🟢 Group Search and Button together to remove the large gap */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex-1 md:w-80">
                        <SearchInput
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Search anything..."
                        />
                    </div>

                    {canCreate && (<button
                        onClick={() => navigate('/company/add')}
                        className="px-6 py-3 bg-gold hover:bg-gold/90 text-white rounded-xl font-black text-[14px] uppercase tracking-widest shadow-lg shadow-gold/20 flex items-center gap-2 transition-all hover:scale-105 whitespace-nowrap"
                    >
                        <Plus size={18} strokeWidth={3} /> Add New
                    </button>)}

                </div>
            </div>

            <div className="bg-card/40 backdrop-blur-md rounded-3xl border border-border shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1200px]">
                        <thead className="bg-muted/50 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-border">
                            <tr>
                                <th className="px-6 py-5">#</th>
                                <th className="px-6 py-5">Company Name</th>
                                <th className="px-6 py-5">Address</th>
                                <th className="px-6 py-5">Email</th>
                                <th className="px-6 py-5">Contact No</th>
                                <th className="px-6 py-5">PAN No</th>
                                <th className="px-6 py-5">GST No</th>
                                <th className="px-6 py-5 text-center">Status</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr><td colSpan="9" className="py-20 text-center"><RefreshCw className="animate-spin text-gold mx-auto" /></td></tr>
                            ) : currentItems.map((item, index) => (
                                <tr key={item.idCompany} className="group hover:bg-gold/[0.03] transition-colors">
                                    <td className="px-6 py-4 text-[14px] font-black text-muted-foreground">{index + 1}</td>
                                    <td className="px-6 py-4 font-black text-sm text-foreground">{item.companyName}</td>
                                    <td className="px-6 py-4 text-[14px] font-bold text-muted-foreground italic truncate max-w-[200px]">{item.address}</td>
                                    <td className="px-6 py-4 text-[14px] font-bold text-foreground/80">{item.email}</td>
                                    <td className="px-6 py-4 text-[14px] font-bold text-foreground/80">{item.contactNo}</td>
                                    <td className="px-6 py-4 text-[14px] font-black tracking-widest uppercase">{item.panNo}</td>
                                    <td className="px-6 py-4 text-[14px] font-black tracking-widest uppercase text-gold">{item.gstNo}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${item.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {item.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {canEdit && (<button onClick={() => navigate(`/company/edit/${item.idCompany}`)} className="p-2 bg-gold/10 text-gold rounded-lg hover:bg-gold hover:text-white transition-all"><Edit2 size={14} /></button>)}
                                            {canDelete && (<button onClick={() => handleDelete(item.idCompany)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14} /></button>)}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination {...paginationProps} />
            </div>
        </div>
    );
};

export default CompanyList;
