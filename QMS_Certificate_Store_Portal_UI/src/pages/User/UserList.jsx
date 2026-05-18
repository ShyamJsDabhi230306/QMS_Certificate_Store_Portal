import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Edit2, Trash2, Award, RefreshCw,
    Eye, Download, Clock, FileText, X
} from 'lucide-react';
import { certificateService } from '../../api/certificateService';
import { toast } from 'react-hot-toast';
import { usePagination } from '../../components/usePagination';
import SearchInput from '../../components/SearchInput';
import { useSearch } from '../../hooks/useSearch';
import Pagination from '../../components/Pagination';
import { usePermissions } from '@/hooks/usePermissions';

const API_BASE = 'https://localhost:7294';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-CA') : '–';

const getDays = (expiry) => {
    if (!expiry) return null;
    return Math.ceil((new Date(expiry) - new Date()) / 86_400_000);
};

const DaysLeftCell = ({ expiry }) => {
    const d = getDays(expiry);
    if (d === null) return <span className="text-gray-500 text-xs">–</span>;
    if (d < 0)   return <span className="text-[12px] font-black text-red-400">Expired {Math.abs(d)}d ago</span>;
    if (d <= 30) return <span className="text-[12px] font-black text-orange-400">{d}d left</span>;
    if (d <= 90) return <span className="text-[12px] font-black text-yellow-400">{d}d left</span>;
    return <span className="text-[12px] font-black text-emerald-400">{d}d left</span>;
};

const StatusCell = ({ status, expiry }) => {
    const d = getDays(expiry);
    let dot = 'bg-gray-400', label = status || 'Unknown', color = 'text-gray-400';
    if (d !== null && d < 0)        { dot = 'bg-red-500';     label = 'Expired';  color = 'text-red-400'; }
    else if (d !== null && d <= 30) { dot = 'bg-orange-400';  label = 'Expiring'; color = 'text-orange-400'; }
    else if (status === 'Pending')  { dot = 'bg-blue-400';    label = 'Pending';  color = 'text-blue-400'; }
    else if (status === 'Draft')    { dot = 'bg-yellow-400';  label = 'Draft';    color = 'text-yellow-400'; }
    else if (status === 'Expired')  { dot = 'bg-red-500';     label = 'Expired';  color = 'text-red-400'; }
    else                            { dot = 'bg-emerald-500'; label = 'Valid';    color = 'text-emerald-400'; }
    return (
        <span className={`flex items-center gap-1.5 text-[12px] font-black ${color}`}>
            <span className={`w-2 h-2 rounded-full ${dot}`} />
            {label}
        </span>
    );
};

const TYPE_COLORS = {
    legal: 'bg-purple-600 text-white', compliance: 'bg-blue-600 text-white',
    security: 'bg-red-600 text-white', insurance: 'bg-pink-600 text-white',
    'domain/ssl': 'bg-emerald-600 text-white', training: 'bg-yellow-500 text-black',
    vendor: 'bg-cyan-600 text-white',
};
const typeColor = (t = '') => TYPE_COLORS[(t || '').toLowerCase()] || 'bg-[#D4A95A]/80 text-black';

/* ── View Modal ─────────────────────── */
const ViewModal = ({ cert, onClose }) => {
    if (!cert) return null;
    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-[#0d1117] border border-[#1f2937] rounded-2xl w-full max-w-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f2937]">
                    <span className="font-black uppercase tracking-widest text-sm text-white flex items-center gap-2">
                        <Award size={16} className="text-[#D4A95A]" /> Certificate Details
                    </span>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white">
                        <X size={16} />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-black mb-1">Certificate</p>
                        <p className="text-xl font-black text-white">{cert.certificateName}</p>
                        <p className="text-[11px] text-gray-500 uppercase tracking-widest mt-0.5">{cert.certificateNumber}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            ['Type', cert.certificateTypeName],
                            ['Owner', cert.ownerName],
                            ['Department', cert.departmentName],
                            ['Status', cert.status],
                            ['Issue Date', fmtDate(cert.issueDate)],
                            ['Expiry Date', fmtDate(cert.expiryDate)],
                            ['Valid (Yrs)', cert.validForYears],
                            ['Renewal', cert.renewalCategory],
                        ].map(([label, val]) => (
                            <div key={label} className="bg-[#111827] rounded-xl px-4 py-3">
                                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-500 mb-1">{label}</p>
                                <p className="text-sm font-black text-white">{val || '–'}</p>
                            </div>
                        ))}
                    </div>
                    {cert.notes && (
                        <div className="bg-[#111827] rounded-xl px-4 py-3">
                            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-500 mb-1">Notes</p>
                            <p className="text-sm text-gray-300">{cert.notes}</p>
                        </div>
                    )}
                    {cert.filePath && (
                        <a href={`${API_BASE}${cert.filePath}`} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-3 bg-[#D4A95A]/10 hover:bg-[#D4A95A]/20 text-[#D4A95A] rounded-xl font-black text-sm transition-all w-fit">
                            <Download size={14} /> Download Attachment
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ── History Modal ──────────────────── */
const HistoryModal = ({ cert, onClose }) => {
    if (!cert) return null;
    const events = [
        { label: 'Created',      user: cert.e_By || 'System', date: cert.createdOn,  color: 'bg-emerald-500/20 text-emerald-400' },
        cert.u_Date && { label: 'Last Updated', user: cert.u_By || '–', date: cert.u_Date, color: 'bg-blue-500/20 text-blue-400' },
        cert.d_Date && { label: 'Deleted',      user: cert.d_By || '–', date: cert.d_Date, color: 'bg-red-500/20 text-red-400' },
    ].filter(Boolean);
    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-[#0d1117] border border-[#1f2937] rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f2937]">
                    <span className="font-black uppercase tracking-widest text-sm text-white flex items-center gap-2">
                        <Clock size={16} className="text-[#D4A95A]" /> Certificate History
                    </span>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white">
                        <X size={16} />
                    </button>
                </div>
                <div className="p-6 space-y-5">
                    <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest">{cert.certificateName}</p>
                    <div className="space-y-4">
                        {events.map((e, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${e.color}`}>{i + 1}</div>
                                <div>
                                    <p className="text-sm font-black text-white">{e.label}</p>
                                    <p className="text-[11px] text-gray-500">{e.user} &bull; {e.date ? new Date(e.date).toLocaleString('en-GB') : '–'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ── Main List ──────────────────────── */
const CertificateList = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading]           = useState(true);
    const [viewCert, setViewCert]         = useState(null);
    const [historyCert, setHistoryCert]   = useState(null);

    const { searchTerm, setSearchTerm, filteredItems } = useSearch(certificates);
    const { currentItems, paginationProps }            = usePagination(filteredItems, 10);
    const navigate = useNavigate();
    const { canCreate, canEdit, canDelete } = usePermissions('Transaction Page');

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            setLoading(true);
            const res = await certificateService.getAll();
            if (res.success) setCertificates(res.data);
        } catch { toast.error('Failed to load certificates'); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this certificate?')) return;
        try {
            const res = await certificateService.delete(id);
            if (res.result > 0) { toast.success(res.message); load(); }
            else toast.error(res.message);
        } catch { toast.error('Error deleting certificate'); }
    };

    const TH = ({ ch, cls = '' }) => (
        <th className={`px-3 py-3.5 text-[9px] font-black uppercase tracking-[0.22em] text-gray-500 whitespace-nowrap ${cls}`}>{ch}</th>
    );

    return (
        <div className="p-6 space-y-5 animate-in fade-in duration-500">
            {viewCert    && <ViewModal    cert={viewCert}    onClose={() => setViewCert(null)} />}
            {historyCert && <HistoryModal cert={historyCert} onClose={() => setHistoryCert(null)} />}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-black text-white flex items-center gap-3">
                    <Award className="text-[#D4A95A]" size={26} /> Certificates Registry
                </h1>
                <div className="flex items-center gap-3">
                    <div className="w-64">
                        <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search certificates..." />
                    </div>
                    {canCreate && (
                        <button onClick={() => navigate('/certificate/add')}
                            className="px-4 py-2.5 bg-[#D4A95A] hover:bg-[#c49848] text-black rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 transition-all hover:scale-105 whitespace-nowrap shadow-lg">
                            <Plus size={14} strokeWidth={3} /> Add Certificate
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-[#1a2332] overflow-hidden bg-[#0a0f17] shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#0f1623] border-b border-[#1a2332]">
                            <tr>
                                <th className="pl-5 pr-2 py-3.5 w-8">
                                    <input type="checkbox" className="accent-[#D4A95A] w-3.5 h-3.5 cursor-pointer" />
                                </th>
                                <TH ch="Certificate"  cls="min-w-[200px]" />
                                <TH ch="Type" />
                                <TH ch="Owner" />
                                <TH ch="Department" />
                                <TH ch="Issue" />
                                <TH ch="Expiry" />
                                <TH ch="Days Left" />
                                <TH ch="Status" />
                                <TH ch="File"    cls="text-center" />
                                <TH ch="Actions" cls="text-center pr-5" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1a2332]/60">
                            {loading ? (
                                <tr><td colSpan={11} className="py-24 text-center">
                                    <RefreshCw className="animate-spin text-[#D4A95A] mx-auto" size={28} />
                                </td></tr>
                            ) : currentItems.length === 0 ? (
                                <tr><td colSpan={11} className="py-24 text-center">
                                    <Award size={36} className="mx-auto text-gray-700 mb-3" />
                                    <p className="text-xs uppercase tracking-widest font-black text-gray-600">No Certificates Found</p>
                                </td></tr>
                            ) : currentItems.map((item) => (
                                <tr key={item.idCertificate} className="group hover:bg-white/[0.02] transition-colors duration-100">
                                    <td className="pl-5 pr-2 py-4">
                                        <input type="checkbox" className="accent-[#D4A95A] w-3.5 h-3.5 cursor-pointer" />
                                    </td>
                                    <td className="px-3 py-4 min-w-[200px]">
                                        <p className="font-black text-white text-[13px] leading-snug">{item.certificateName}</p>
                                        <p className="text-[10px] text-gray-600 font-bold tracking-widest uppercase mt-0.5">{item.certificateNumber}</p>
                                    </td>
                                    <td className="px-3 py-4">
                                        <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${typeColor(item.certificateTypeName)}`}>
                                            {item.certificateTypeName || '–'}
                                        </span>
                                    </td>
                                    <td className="px-3 py-4 text-[12px] font-bold text-gray-200 whitespace-nowrap">{item.ownerName || '–'}</td>
                                    <td className="px-3 py-4 text-[12px] font-bold text-gray-400 whitespace-nowrap">{item.departmentName || '–'}</td>
                                    <td className="px-3 py-4 text-[12px] font-bold text-gray-400 whitespace-nowrap">{fmtDate(item.issueDate)}</td>
                                    <td className="px-3 py-4 text-[12px] font-bold text-gray-300 whitespace-nowrap">{fmtDate(item.expiryDate)}</td>
                                    <td className="px-3 py-4 whitespace-nowrap"><DaysLeftCell expiry={item.expiryDate} /></td>
                                    <td className="px-3 py-4 whitespace-nowrap"><StatusCell status={item.status} expiry={item.expiryDate} /></td>
                                    <td className="px-3 py-4 text-center">
                                        {item.filePath
                                            ? <a href={`${API_BASE}${item.filePath}`} target="_blank" rel="noopener noreferrer" title="View File"
                                                className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#1a2332] hover:bg-[#D4A95A]/20 text-[#D4A95A] font-black text-[11px] transition-all">i</a>
                                            : <span className="text-gray-700 text-xs">–</span>
                                        }
                                    </td>
                                    <td className="px-3 py-4 pr-5">
                                        <div className="flex items-center justify-center gap-1">
                                            <button onClick={() => setViewCert(item)} title="View"
                                                className="w-7 h-7 rounded-lg bg-[#1a2332] hover:bg-[#D4A95A]/20 hover:text-[#D4A95A] text-gray-400 flex items-center justify-center transition-all">
                                                <Eye size={13} strokeWidth={2.5} />
                                            </button>
                                            {item.filePath
                                                ? <a href={`${API_BASE}${item.filePath}`} download title="Download"
                                                    className="w-7 h-7 rounded-lg bg-[#1a2332] hover:bg-emerald-500/20 hover:text-emerald-400 text-gray-400 flex items-center justify-center transition-all">
                                                    <Download size={13} strokeWidth={2.5} />
                                                  </a>
                                                : <button disabled className="w-7 h-7 rounded-lg bg-[#1a2332] text-gray-700 flex items-center justify-center cursor-not-allowed">
                                                    <FileText size={13} />
                                                  </button>
                                            }
                                            <button onClick={() => setHistoryCert(item)} title="History"
                                                className="w-7 h-7 rounded-lg bg-[#D4A95A]/10 hover:bg-[#D4A95A]/30 text-[#D4A95A] flex items-center justify-center transition-all">
                                                <Clock size={13} strokeWidth={2.5} />
                                            </button>
                                            {canEdit && (
                                                <button onClick={() => navigate(`/certificate/edit/${item.idCertificate}`)} title="Edit"
                                                    className="w-7 h-7 rounded-lg bg-[#1a2332] hover:bg-blue-500/20 hover:text-blue-400 text-gray-400 flex items-center justify-center transition-all">
                                                    <Edit2 size={13} strokeWidth={2.5} />
                                                </button>
                                            )}
                                            {canDelete && (
                                                <button onClick={() => handleDelete(item.idCertificate)} title="Delete"
                                                    className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-500 flex items-center justify-center transition-all">
                                                    <Trash2 size={13} strokeWidth={2.5} />
                                                </button>
                                            )}
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

export default CertificateList;
