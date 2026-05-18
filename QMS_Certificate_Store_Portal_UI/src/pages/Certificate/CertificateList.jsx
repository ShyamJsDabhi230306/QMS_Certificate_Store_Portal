import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Edit2, Trash2, Award, RefreshCw,
    Eye, Download, Clock, FileText, X, Info
} from 'lucide-react';
import { certificateService } from '../../api/certificateService';
import { toast } from 'react-hot-toast';
import { usePagination } from '../../components/usePagination';
import SearchInput from '../../components/SearchInput';
import { useSearch } from '../../hooks/useSearch';
import Pagination from '../../components/Pagination';
import { usePermissions } from '@/hooks/usePermissions';

const API_BASE = 'https://localhost:7294';

/* ── helpers ─────────────────────────────────────────── */
const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-CA') : '–'; // YYYY-MM-DD

const getDaysLeft = (expiry) => {
    if (!expiry) return null;
    return Math.ceil((new Date(expiry) - new Date()) / 86_400_000);
};

const DaysLeftCell = ({ expiry }) => {
    const d = getDaysLeft(expiry);
    if (d === null) return <span className="text-gray-500 text-xs">–</span>;
    if (d < 0) return <span className="text-[12px] font-black text-red-400">Expired {Math.abs(d)}d ago</span>;
    if (d <= 30) return <span className="text-[12px] font-black text-orange-400">{d}d left</span>;
    if (d <= 90) return <span className="text-[12px] font-black text-yellow-400">{d}d left</span>;
    return <span className="text-[12px] font-black text-emerald-400">{d}d left</span>;
};

const StatusCell = ({ status, expiry }) => {
    const d = getDaysLeft(expiry);
    let dot = 'bg-gray-400', label = status || 'Unknown', color = 'text-gray-400';
    if (d !== null && d < 0) { dot = 'bg-red-500'; label = 'Expired'; color = 'text-red-400'; }
    else if (d !== null && d <= 30) { dot = 'bg-orange-400'; label = 'Expiring'; color = 'text-orange-400'; }
    else if (!status || status === 'Active' || status === 'Approved') {
        dot = 'bg-emerald-500'; label = 'Valid'; color = 'text-emerald-400';
    } else if (status === 'Draft') { dot = 'bg-yellow-400'; label = 'Draft'; color = 'text-yellow-400'; }
    else if (status === 'Pending') { dot = 'bg-blue-400'; label = 'Pending'; color = 'text-blue-400'; }
    else if (status === 'Expired') { dot = 'bg-red-500'; label = 'Expired'; color = 'text-red-400'; }
    else { dot = 'bg-emerald-500'; label = status; color = 'text-emerald-400'; }

    return (
        <span className={`flex items-center gap-1.5 text-[12px] font-black ${color}`}>
            <span className={`inline-block w-2 h-2 rounded-full ${dot}`} />
            {label}
        </span>
    );
};

const TYPE_COLORS = {
    legal: 'bg-purple-600  text-white',
    compliance: 'bg-blue-600    text-white',
    security: 'bg-red-600     text-white',
    insurance: 'bg-pink-600    text-white',
    'domain/ssl': 'bg-emerald-600 text-white',
    training: 'bg-yellow-600  text-black',
    vendor: 'bg-cyan-600    text-white',
};
const typeColor = (t = '') =>
    TYPE_COLORS[(t || '').toLowerCase()] || 'bg-[#D4A95A]/80 text-black';

/* ── View Modal ──────────────────────────────────────── */
const ViewModal = ({ cert, onClose }) => {
    if (!cert) return null;
    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-[#0d1117] border border-[#1f2937] rounded-2xl w-full max-w-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f2937]">
                    <div className="flex items-center gap-2">
                        <Award size={18} className="text-[#D4A95A]" />
                        <span className="font-black uppercase tracking-widest text-sm text-white">Certificate Details</span>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
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
                            ['Type', cert.certificateTypeName || '–'],
                            ['Owner', cert.ownerName || '–'],
                            ['Department', cert.departmentName || '–'],
                            ['Status', cert.status || '–'],
                            ['Issue Date', fmtDate(cert.issueDate)],
                            ['Expiry Date', fmtDate(cert.expiryDate)],
                            ['Valid (Yrs)', cert.validForYears || '–'],
                            ['Renewal', cert.renewalCategory || '–'],
                        ].map(([label, val]) => (
                            <div key={label} className="bg-[#111827] rounded-xl px-4 py-3">
                                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-500 mb-1">{label}</p>
                                <p className="text-sm font-black text-white">{val}</p>
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

/* ── History Modal ───────────────────────────────────── */
const HistoryModal = ({ cert, onClose }) => {
    if (!cert) return null;
    const events = [
        { label: 'Created', user: cert.e_By || 'System', date: cert.createdOn, color: 'bg-emerald-500/20 text-emerald-400' },
        cert.u_Date && { label: 'Last Updated', user: cert.u_By || '–', date: cert.u_Date, color: 'bg-blue-500/20 text-blue-400' },
        cert.d_Date && { label: 'Deleted', user: cert.d_By || '–', date: cert.d_Date, color: 'bg-red-500/20 text-red-400' },
    ].filter(Boolean);

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-[#0d1117] border border-[#1f2937] rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f2937]">
                    <div className="flex items-center gap-2">
                        <Clock size={17} className="text-[#D4A95A]" />
                        <span className="font-black uppercase tracking-widest text-sm text-white">Certificate History</span>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                </div>
                <div className="p-6 space-y-5">
                    <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest">{cert.certificateName}</p>
                    <div className="space-y-4">
                        {events.map((e, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-black ${e.color}`}>
                                    {i + 1}
                                </div>
                                <div>
                                    <p className="text-sm font-black text-white">{e.label}</p>
                                    <p className="text-[11px] text-gray-500 font-bold">
                                        {e.user} &bull; {e.date ? new Date(e.date).toLocaleString('en-GB') : '–'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ── Info Panel (right-side slide-in) ───────────────── */
const InfoPanel = ({ cert, onClose }) => {
    if (!cert) return null;
    return (
        <div className="fixed inset-0 z-[998] flex justify-end" onClick={onClose}>
            <div className="h-full w-80 bg-[#0d1117] border-l border-[#1f2937] shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto"
                onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f2937]">
                    <span className="font-black uppercase tracking-widest text-xs text-white flex items-center gap-2">
                        <Info size={14} className="text-[#D4A95A]" /> Quick Info
                    </span>
                    <button onClick={onClose} className="p-1 rounded hover:bg-white/10 text-gray-400"><X size={14} /></button>
                </div>
                <div className="p-5 space-y-4">
                    <p className="font-black text-white text-base">{cert.certificateName}</p>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500">{cert.certificateNumber}</p>
                    {[
                        ['Type', cert.certificateTypeName],
                        ['Owner', cert.ownerName],
                        ['Department', cert.departmentName],
                        ['Issue', fmtDate(cert.issueDate)],
                        ['Expiry', fmtDate(cert.expiryDate)],
                        ['Status', cert.status],
                        ['Renewal', cert.renewalCategory],
                        ['Tags', cert.tags],
                    ].filter(([, v]) => v).map(([label, val]) => (
                        <div key={label} className="border-b border-[#1f2937] pb-3">
                            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-600 font-black">{label}</p>
                            <p className="text-sm font-bold text-gray-200 mt-0.5">{val}</p>
                        </div>
                    ))}
                    {cert.notes && (
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-600 font-black">Notes</p>
                            <p className="text-sm text-gray-400 mt-1">{cert.notes}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ── Main Component ──────────────────────────────────── */
const CertificateList = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewCert, setViewCert] = useState(null);
    const [historyCert, setHistoryCert] = useState(null);
    const [infoCert, setInfoCert] = useState(null);

    const { searchTerm, setSearchTerm, filteredItems } = useSearch(certificates);
    const { currentItems, paginationProps } = usePagination(filteredItems, 10);
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




    // Fetch file as blob and force browser download (fixes cross-origin download block)
    const handleDownload = async (item) => {
        if (!item.filePath) return;
        try {
            // Use our API endpoint instead of direct static file URL (fixes CORS)
            const apiUrl = `${API_BASE}/api/transaction/Certificate/download?path=${encodeURIComponent(item.filePath)}`;
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('File not found');
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = item.fileName || item.filePath.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch {
            toast.error('Could not download the file. Please try again.');
        }
    };


    return (
        <div className="p-6 space-y-5 animate-in fade-in duration-500">

            {/* Modals */}
            {viewCert && <ViewModal cert={viewCert} onClose={() => setViewCert(null)} />}
            {historyCert && <HistoryModal cert={historyCert} onClose={() => setHistoryCert(null)} />}
            {infoCert && <InfoPanel cert={infoCert} onClose={() => setInfoCert(null)} />}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-black text-white flex items-center gap-3">
                    <Award className="text-[#D4A95A]" size={26} /> Certificates Registry
                </h1>
                <div className="flex items-center gap-3">
                    <div className="flex-1 md:w-80">
                        <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search certificates..." />
                    </div>
                    {canCreate && (
                        <button onClick={() => navigate('/certificate/add')}
                            className="px-6 py-3 bg-gold hover:bg-gold/90 text-white rounded-xl font-black text-[14px] uppercase tracking-widest shadow-lg shadow-gold/20 flex items-center gap-2 transition-all hover:scale-105 whitespace-nowrap">
                            <Plus size={18} strokeWidth={3} /> Add Certificate
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            {/* ── Table (gold‑and‑glass style) ───────────────────────────────────────────── */}
            <div className="rounded-3xl border border-border bg-card/40 backdrop-blur-md shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        {/* ── Header ───────────────────────────────────── */}
                        <thead className="bg-muted/20 border-b border-border text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                            <tr>
                                {/* <th className="pl-5 pr-2 py-3.5 w-8">
                                    <input type="checkbox" className="accent-gold w-3.5 h-3.5 cursor-pointer" />
                                </th> */}
                                <TH ch="Certificate" cls="min-w-[200px]" />
                                <TH ch="Type" />
                                <TH ch="Owner" />
                                <TH ch="Department" />
                                <TH ch="Issue" />
                                <TH ch="Expiry" />
                                <TH ch="Days Left" />
                                <TH ch="Status" />
                                {/* <TH ch="File" cls="text-center" /> */}
                                <TH ch="Actions" cls="text-center pr-5" />
                            </tr>
                        </thead>

                        {/* ── Body ─────────────────────────────────────── */}
                        <tbody className="divide-y divide-border/30">
                            {loading ? (
                                <tr>
                                    <td colSpan={11} className="py-24 text-center">
                                        <RefreshCw className="animate-spin text-gold mx-auto" size={28} />
                                    </td>
                                </tr>
                            ) : currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan={11} className="py-24 text-center">
                                        <Award size={36} className="mx-auto text-gold/70 mb-3" />
                                        <p className="text-xs uppercase tracking-widest font-black text-muted-foreground">
                                            No Certificates Found
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((item) => (
                                    <tr
                                        key={item.idCertificate}
                                        className="group hover:bg-gold/5 transition-colors duration-100"
                                    >
                                        {/* ── Checkbox ─────────────────────
                                        <td className="pl-5 pr-2 py-4">
                                            <input
                                                type="checkbox"
                                                className="accent-gold w-3.5 h-3.5 cursor-pointer"
                                            />
                                        </td> */}

                                        {/* ── Certificate name & number ───── */}
                                        <td className="px-3 py-4 min-w-[200px]">
                                            <p className="font-black text-white text-[13px] leading-snug">
                                                {item.certificateName}
                                            </p>
                                            <p className="text-[10px] text-gray-600 font-bold tracking-widest uppercase mt-0.5">
                                                {item.certificateNumber}
                                            </p>
                                        </td>

                                        {/* ── Type badge ───────────────────── */}
                                        <td className="px-3 py-4">
                                            <span
                                                className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${typeColor(
                                                    item.certificateTypeName
                                                )}`}
                                            >
                                                {item.certificateTypeName || '–'}
                                            </span>
                                        </td>

                                        {/* ── Owner ────────────────────────── */}
                                        <td className="px-3 py-4 text-[12px] font-bold text-gray-200 whitespace-nowrap">
                                            {item.ownerName || '–'}
                                        </td>

                                        {/* ── Department ──────────────────── */}
                                        <td className="px-3 py-4 text-[12px] font-bold text-gray-400 whitespace-nowrap">
                                            {item.departmentName || '–'}
                                        </td>

                                        {/* ── Issue date ─────────────────── */}
                                        <td className="px-3 py-4 text-[12px] font-bold text-gray-400 whitespace-nowrap">
                                            {fmtDate(item.issueDate)}
                                        </td>

                                        {/* ── Expiry date ────────────────── */}
                                        <td className="px-3 py-4 text-[12px] font-bold text-gray-300 whitespace-nowrap">
                                            {fmtDate(item.expiryDate)}
                                        </td>

                                        {/* ── Days left ─────────────────── */}
                                        <td className="px-3 py-4 whitespace-nowrap">
                                            <DaysLeftCell expiry={item.expiryDate} />
                                        </td>

                                        {/* ── Status ───────────────────── */}
                                        <td className="px-3 py-4 whitespace-nowrap">
                                            <StatusCell status={item.status} expiry={item.expiryDate} />
                                        </td>

                                        {/* ── File info (quick‑info button) ── */}
                                        {/* <td className="px-3 py-4 text-center">
                                            {item.filePath ? (
                                                <button
                                                    onClick={() => setInfoCert(item)}
                                                    title="Quick Info"
                                                    className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#1a2332] hover:bg-[#D4A95A]/20 text-gray-400 hover:text-[#D4A95A] transition-all text-[11px] font-black"
                                                >
                                                    i
                                                </button>
                                            ) : (
                                                <span className="text-gray-700 text-xs">–</span>
                                            )}
                                        </td> */}

                                        {/* ── Action buttons ───────────────── */}
                                        <td className="px-3 py-4 pr-5">
                                            <div className="flex items-center justify-center gap-1">
                                                {/* View */}
                                                <button
                                                    onClick={() => setViewCert(item)}
                                                    title="View"
                                                    className="w-7 h-7 rounded-lg bg-[#1a2332] hover:bg-[#D4A95A]/20 hover:text-[#D4A95A] text-gray-400 flex items-center justify-center transition-all"
                                                >
                                                    <Eye size={13} strokeWidth={2.5} />
                                                </button>

                                                {/* Download */}
                                                {item.filePath ? (
                                                    <button
                                                        onClick={() => handleDownload(item)}
                                                        title="Download"
                                                        className="w-7 h-7 rounded-lg bg-[#1a2332] hover:bg-emerald-500/20 hover:text-emerald-400 text-gray-400 flex items-center justify-center transition-all"
                                                    >
                                                        <Download size={13} strokeWidth={2.5} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        disabled
                                                        title="No file"
                                                        className="w-7 h-7 rounded-lg bg-[#1a2332] text-gray-700 flex items-center justify-center cursor-not-allowed"
                                                    >
                                                        <FileText size={13} />
                                                    </button>
                                                )}

                                                {/* History */}
                                                <button
                                                    onClick={() => setHistoryCert(item)}
                                                    title="History"
                                                    className="w-7 h-7 rounded-lg bg-[#D4A95A]/10 hover:bg-[#D4A95A]/30 text-[#D4A95A] flex items-center justify-center transition-all"
                                                >
                                                    <Clock size={13} strokeWidth={2.5} />
                                                </button>

                                                {/* Edit */}
                                                {canEdit && (
                                                    <button
                                                        onClick={() => navigate(`/certificate/edit/${item.idCertificate}`)}
                                                        title="Edit"
                                                        className="w-7 h-7 rounded-lg bg-[#1a2332] hover:bg-blue-500/20 hover:text-blue-400 text-gray-400 flex items-center justify-center transition-all"
                                                    >
                                                        <Edit2 size={13} strokeWidth={2.5} />
                                                    </button>
                                                )}

                                                {/* Delete */}
                                                {canDelete && (
                                                    <button
                                                        onClick={() => handleDelete(item.idCertificate)}
                                                        title="Delete"
                                                        className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-500 flex items-center justify-center transition-all"
                                                    >
                                                        <Trash2 size={13} strokeWidth={2.5} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination – unchanged */}
                <Pagination {...paginationProps} />
            </div>

        </div>
    );
};

export default CertificateList;
