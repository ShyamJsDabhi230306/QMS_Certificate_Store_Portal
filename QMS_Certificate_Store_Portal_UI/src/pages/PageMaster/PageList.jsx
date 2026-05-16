import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Layout, RefreshCw } from 'lucide-react';
import { pageService } from '../../api/pageService';
import { toast } from 'react-hot-toast';
import { usePagination } from '../../components/usePagination';
import Pagination from '../../components/Pagination';
import SearchInput from '../../components/SearchInput';
import { useSearch } from '../../hooks/useSearch';
import { usePermissions } from '../../hooks/usePermissions';

const PageList = () => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const { searchTerm, setSearchTerm, filteredItems } = useSearch(pages);
    const { currentItems, paginationProps } = usePagination(filteredItems, 10);
    const navigate = useNavigate();

    // Using the same structure as your other pages
    const { canCreate, canEdit, canDelete } = usePermissions("Page Master");

    useEffect(() => { loadPages(); }, []);

    const loadPages = async () => {
        try {
            setLoading(true);
            const res = await pageService.getAll();
            if (res.success) setPages(res.data);
        } catch (error) { toast.error("Failed to load pages"); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this page?")) {
            const res = await pageService.delete(id);
            if (res.result > 0) {
                toast.success(res.message);
                loadPages();
            }
            else toast.error(res.message);
        }
    };

    const StatusBadge = ({ active }) => (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
            }`}>
            {active ? 'Active' : 'Inactive'}
        </span>
    );

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            {/* Header Section - Matching your "Perfect" structure */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
                    <Layout className="text-gold" size={32} /> Page Master
                </h1>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex-1 md:w-80">
                        <SearchInput
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Search pages..."
                        />
                    </div>

                    {canCreate && (
                        <button
                            onClick={() => navigate('/page-master/add')}
                            className="px-6 py-3 bg-gold hover:bg-gold/90 text-white rounded-xl font-black text-[14px] uppercase tracking-widest shadow-lg shadow-gold/20 flex items-center gap-2 transition-all hover:scale-105 whitespace-nowrap"
                        >
                            <Plus size={18} strokeWidth={3} /> Add New
                        </button>
                    )}
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-card/40 backdrop-blur-md rounded-3xl border border-border shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead className="bg-muted/50 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-border">
                            <tr>
                                <th className="px-6 py-5">#</th>
                                <th className="px-6 py-5">Page Name</th>
                                <th className="px-6 py-5 text-center">Status</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="py-20 text-center">
                                        <RefreshCw className="animate-spin text-gold mx-auto" size={32} />
                                    </td>
                                </tr>
                            ) : currentItems.map((item, index) => (
                                <tr key={item.idPage || item.IDPage} className="group hover:bg-gold/[0.03] transition-all">
                                    <td className="px-6 py-4 text-xs font-bold text-muted-foreground">
                                        {(paginationProps.currentPage - 1) * 10 + index + 1}
                                    </td>
                                    <td className="px-6 py-4 font-black text-sm text-foreground">
                                        {item.pageName}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <StatusBadge active={item.isActive} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {canEdit && (
                                                <button
                                                    onClick={() => navigate(`/page-master/edit/${item.idPage || item.IDPage}`)}
                                                    className="p-2 bg-gold/10 text-gold rounded-lg hover:bg-gold hover:text-white transition-all"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                            )}
                                            {canDelete && (
                                                <button
                                                    onClick={() => handleDelete(item.idPage || item.IDPage)}
                                                    className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-6 border-t border-border bg-muted/20">
                    <Pagination {...paginationProps} />
                </div>
            </div>
        </div>
    );
};

export default PageList;
