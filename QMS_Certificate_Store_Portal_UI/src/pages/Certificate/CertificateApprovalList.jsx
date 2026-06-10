import React, { useEffect, useState } from 'react';
import {
    ShieldCheck, Check, X, Info, Download,
    RefreshCw, FileText, AlertTriangle, MessageSquare,
    Eye
} from 'lucide-react';
import { transactionCertificateApprovalService } from '../../api/transactionCertificateApprovalService';
import { toast } from 'react-hot-toast';
import { usePagination } from '../../components/usePagination';
import SearchInput from '../../components/SearchInput';
import { useSearch } from '../../hooks/useSearch';
import Pagination from '../../components/Pagination';
import { usePermissions } from '@/hooks/usePermissions';

const API_BASE = 'https://localhost:7294';

/* ── Helpers ─────────────────────────────────────────── */
const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-CA') : '–'; // YYYY-MM-DD

const getDaysLeft = (surveillanceDate) => {

    if (!surveillanceDate)
        return null;

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const target = new Date(surveillanceDate);

    target.setHours(0, 0, 0, 0);

    return Math.ceil(
        (target - today) / 86_400_000
    );
};

const DaysLeftCell = ({ surveillanceDate }) => {

    const d = getDaysLeft(surveillanceDate);

    if (d === null) {
        return (
            <span className="text-muted-foreground text-xs">
                –
            </span>
        );
    }

    if (d < 0) {
        return (
            <span className="text-[12px] font-black text-red-500">
                Expired {Math.abs(d)}d ago
            </span>
        );
    }

    if (d <= 30) {
        return (
            <span className="text-[12px] font-black text-orange-500">
                {d}d left
            </span>
        );
    }

    if (d <= 90) {
        return (
            <span className="text-[12px] font-black text-yellow-500">
                {d}d left
            </span>
        );
    }

    return (
        <span className="text-[12px] font-black text-emerald-500">
            {d}d left
        </span>
    );
};

/* ── Slide-out Info Drawer ───────────────────────────── */
const InfoPanel = ({ item, onClose, onDownload }) => {
    if (!item) return null;

    // Defensive resolution of nested or flat certificate fields
    const cert = item.certificate || {};
    const name = cert.certificateName || item.certificateName || 'Untitled Certificate';
    const number = cert.certificateNumber || item.certificateNumber || '–';
    const type = cert.certificateTypeName || item.certificateTypeName || '–';
    const owner = cert.ownerName || item.ownerName || '–';
    const dept = cert.departmentName || item.departmentName || '–';
    const issue = cert.issueDate || item.issueDate;
    // const expiry = cert.expiryDate || item.expiryDate;
    // const surveillanceDate = cert.surveillanceDate || item.surveillanceDate;
    const notes = cert.notes || item.notes;
    const filePath = cert.filePath || item.filePath;

    return (
        <div className="fixed inset-0 z-[998] flex justify-end" onClick={onClose}>
            <div className="h-full w-80 bg-card border-l border-border shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto"
                onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <span className="font-black uppercase tracking-widest text-xs text-foreground flex items-center gap-2">
                        <Info size={14} className="text-[#D4A95A]" /> Quick Details
                    </span>
                    <button onClick={onClose} className="p-1 rounded hover:bg-muted text-muted-foreground"><X size={14} /></button>
                </div>
                <div className="p-5 space-y-4">
                    <p className="font-black text-foreground text-base leading-snug">{name}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{number}</p>

                    {[
                        ['Type', type],
                        ['Owner', owner],
                        ['Department', dept],
                        ['Issue Date', fmtDate(issue)],
                        // ['Expiry Date', fmtDate(expiry)],
                        ['Approval Level Required', `Level ${item.approvalLevel || 1}`],
                    ].map(([label, val]) => (
                        <div key={label} className="border-b border-border pb-3">
                            <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/70 font-black">{label}</p>
                            <p className="text-sm font-bold text-foreground/90 mt-0.5">{val}</p>
                        </div>
                    ))}

                    {notes && (
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/70 font-black">Notes</p>
                            <p className="text-sm text-foreground/80 mt-1">{notes}</p>
                        </div>
                    )}

                    {filePath && (
                        <button onClick={() => onDownload(cert.filePath ? cert : item)}
                            className="flex items-center gap-2 px-4 py-3 bg-[#D4A95A]/10 hover:bg-[#D4A95A]/20 text-[#D4A95A] rounded-xl font-black text-sm transition-all w-full justify-center mt-4">
                            <Download size={14} /> Download Attachment
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ── Approval Action Modal ────────────────────────────── */
const ActionModal = ({ isOpen, onClose, onSubmit, type, item }) => {
    const [comment, setComment] = useState('');
    const [remarks, setRemarks] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen || !item) return null;


    const handleFormSubmit = async (e) => {
        e.preventDefault();

        setSubmitting(true);

        try {

            console.log("ITEM", item);

            await onSubmit({

                IDCertificate:
                    item.idCertificate ||
                    item.certificate?.idCertificate,

                ApprovalStatus:
                    type === 'approve'
                        ? 'Approved'
                        : 'Rejected',

                ApprovalComment: comment,

                ApprovalLevel:
                    item.approvalLevel || 1,

                Remarks: remarks
            });

            setComment('');
            setRemarks('');

            onClose();

        } finally {

            setSubmitting(false);

        }
    };

    const isApprove = type === 'approve';

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in scale-in duration-200 overflow-hidden">
                <form onSubmit={handleFormSubmit}>
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={18} className={isApprove ? "text-emerald-500" : "text-red-500"} />
                            <span className="font-black uppercase tracking-widest text-sm text-foreground">
                                {isApprove ? "Approve Request" : "Reject Request"}
                            </span>
                        </div>
                        <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
                            <X size={16} />
                        </button>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="bg-muted/10 rounded-xl p-3 border border-border/40 text-xs">
                            <p className="font-black text-foreground mb-0.5">
                                {item.certificate?.certificateName || item.certificateName || 'Certificate'}
                            </p>
                            <p className="text-muted-foreground">
                                Level {item.approvalLevel || 1} Approval Verification
                            </p>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1.5 block">
                                Decision Comment
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder={`Enter your reasons or decisions regarding this ${isApprove ? 'approval' : 'rejection'}...`}
                                className="w-full h-24 input-ui text-sm resize-none"
                                required={!isApprove} // Rejections must have a reason
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1.5 block">
                                Audit Remarks (Optional)
                            </label>
                            <input
                                type="text"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder="Internal auditing notes..."
                                className="w-full input-ui text-sm"
                            />
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-muted/20 border-t border-border flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-black uppercase tracking-wider text-muted-foreground hover:bg-muted rounded-xl transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-lg transition-all flex items-center gap-1.5 ${isApprove
                                ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/10"
                                : "bg-red-600 hover:bg-red-500 shadow-red-500/10"
                                }`}
                        >
                            {submitting ? (
                                <RefreshCw className="animate-spin" size={14} />
                            ) : isApprove ? (
                                <Check size={14} strokeWidth={3} />
                            ) : (
                                <X size={14} strokeWidth={3} />
                            )}
                            {isApprove ? "Approve" : "Reject"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ── Main Component ──────────────────────────────────── */
const CertificateApprovalList = () => {
    const [pendingItems, setPendingItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // UI Interaction States
    const [selectedItem, setSelectedItem] = useState(null);
    const [infoItem, setInfoItem] = useState(null);
    const [modalType, setModalType] = useState(null); // 'approve' | 'reject'

    const { searchTerm, setSearchTerm, filteredItems } = useSearch(pendingItems);
    const { currentItems, paginationProps } = usePagination(filteredItems, 10);
    const { canEdit } = usePermissions('approval ');

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            setLoading(true);
            const res = await transactionCertificateApprovalService.getPending();
            if (res.success) {
                setPendingItems(res.data || []);
            }
        } catch {
            toast.error('Failed to load pending approvals');
        } finally {
            setLoading(false);
        }
    };

    // Submits the Approve/Reject decision back to controller '/process'
    const handleActionSubmit = async (payload) => {
        try {
            const res = await transactionCertificateApprovalService.process(payload);
            console.log(res);
            if (res.isSuccess || res.result > 0) {
                toast.success(res.message);
                load();
            } else {
                toast.error(res.message || 'Operation failed');
            }
        } catch {
            toast.error('Error submitting approval action');
        }
    };

    // CORS Safe File Download
    const handleDownload = async (item) => {
        const path = item.filePath || (item.certificate && item.certificate.filePath);
        if (!path) return;
        if (!window.confirm('Do you want to download this certificate?')) return;
        try {
            const apiUrl = `${API_BASE}/api/transaction/Certificate/download?path=${encodeURIComponent(path)}`;
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('File not found');
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = item.fileName || (item.certificate && item.certificate.fileName) || path.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch {
            toast.error('Could not download file. Please try again.');
        }
    };

    const TH = ({ ch, cls = '' }) => (
        <th className={`px-4 py-4 text-[9px] font-black uppercase tracking-[0.22em] text-muted-foreground whitespace-nowrap ${cls}`}>{ch}</th>
    );

    // Calculate quick stats
    const totalPendingCount = pendingItems.length;
    const criticalApprovalsCount =
        pendingItems.filter(item => {

            const surveillance =
                item.certificate?.surveillanceDate ||
                item.surveillanceDate ||
                item.certificate?.serveillanceDate ||
                item.serveillanceDate;

            console.log(
                "SURVEILLANCE DATE",
                surveillance
            );

            const days =
                getDaysLeft(surveillance);

            console.log(
                "DAYS LEFT",
                days
            );

            return (
                days !== null &&
                days <= 30
            );

        }).length;
    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            {/* Slide-out details drawer */}
            {infoItem && <InfoPanel item={infoItem} onClose={() => setInfoItem(null)} onDownload={handleDownload} />}

            {/* Approve/Reject Modals */}
            <ActionModal
                isOpen={!!modalType}
                onClose={() => { setModalType(null); setSelectedItem(null); }}
                onSubmit={handleActionSubmit}
                type={modalType}
                item={selectedItem}
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
                    <ShieldCheck className="text-gold" size={32} /> Certificate Approvals
                </h1>
                <div className="w-full md:w-80">
                    <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search pending requests..." />
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="card-ui p-5 flex items-center justify-between bg-card/50">
                    <div>
                        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">Awaiting Review</p>
                        <h3 className="text-3xl font-black text-foreground">{totalPendingCount}</h3>
                    </div>
                    <div className="p-3.5 rounded-xl bg-gold/10 text-gold">
                        <ShieldCheck size={24} />
                    </div>
                </div>

                <div className="card-ui p-5 flex items-center justify-between bg-card/50">
                    <div>
                        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">Urgent Renewals</p>
                        <h3 className="text-3xl font-black text-red-500">{criticalApprovalsCount}</h3>
                    </div>
                    <div className="p-3.5 rounded-xl bg-red-500/10 text-red-500">
                        <AlertTriangle size={24} />
                    </div>
                </div>

                <div className="card-ui p-5 flex items-center justify-between bg-card/50">
                    <div>
                        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">Approval Standard</p>
                        <h3 className="text-sm font-black text-foreground mt-2">Compliance Level 1 & 2</h3>
                    </div>
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                        <Check size={24} />
                    </div>
                </div>
            </div>

            {/* Table Registry */}
            <div className="bg-card/40 backdrop-blur-md rounded-3xl border border-border shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1200px]">
                        <thead className="bg-muted/50 border-b border-border text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                            <tr>
                                <TH ch="Certificate Detail" cls="min-w-[250px]" />
                                {/* <TH ch="Owner" />
                                <TH ch="Department" /> */}
                                <TH ch="Type" />
                                <TH ch="Days Left" />
                                <TH ch="Required Level" cls="text-center" />
                                <TH ch="Action Decision" cls="text-center pr-6" />
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="py-24 text-center">
                                        <RefreshCw className="animate-spin text-gold mx-auto" size={28} />
                                    </td>
                                </tr>
                            ) : currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-24 text-center">
                                        <ShieldCheck size={36} className="mx-auto text-gold/50 mb-3" />
                                        <p className="text-xs uppercase tracking-widest font-black text-muted-foreground">
                                            No Pending Approvals Found
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((item, index) => {
                                    // Defensive fallback mapping
                                    const cert = item.certificate || {};
                                    const name = cert.certificateName || item.certificateName || 'Untitled Certificate';
                                    const num = cert.certificateNumber || item.certificateNumber || '–';
                                    const type = cert.certificateTypeName || item.certificateTypeName || '–';
                                    const owner = cert.ownerName || item.ownerName || '–';
                                    const dept = cert.departmentName || item.departmentName || '–';
                                    const expiry = cert.expiryDate || item.expiryDate;
                                    const surveillanceDate =
                                        cert.surveillanceDate ||
                                        item.surveillanceDate ||
                                        expiry;

                                    return (
                                        <tr key={item.idTrasaction_Certificate_Approval || item.idCertificate || index} className="group hover:bg-gold/[0.02] transition-colors">
                                            {/* Certificate Name & Code */}
                                            <td className="px-4 py-4 min-w-[250px]">
                                                <p className="font-black text-foreground text-[13px] leading-snug">
                                                    {name}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground/80 font-bold tracking-widest uppercase mt-0.5">
                                                    {num}
                                                </p>
                                            </td>

                                            {/* Owner */}
                                            {/* <td className="px-4 py-4 text-[12px] font-bold text-foreground/85 whitespace-nowrap">
                                                {owner}
                                            </td> */}

                                            {/* Department */}
                                            {/* <td className="px-4 py-4 text-[12px] font-bold text-muted-foreground whitespace-nowrap">
                                                {dept}
                                            </td> */}

                                            {/* Type Badge */}
                                            <td className="px-4 py-4">
                                                <span className="px-2.5 py-1 rounded bg-[#D4A95A]/80 text-black text-[9px] font-black uppercase tracking-wider whitespace-nowrap">
                                                    {type}
                                                </span>
                                            </td>

                                            {/* Expiry / Days Left */}
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <DaysLeftCell surveillanceDate={surveillanceDate} />
                                            </td>

                                            {/* Required Level */}
                                            <td className="px-4 py-4 text-center whitespace-nowrap">
                                                <span className="inline-block px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[11px] font-black">
                                                    Lvl {item.approvalLevel || 1}
                                                </span>
                                            </td>

                                            {/* Approval Actions */}
                                            <td className="px-4 py-4 pr-6">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    {/* View */}
                                                    {/* View */}
                                                    <button
                                                        onClick={() =>
                                                            window.open(
                                                                `${API_BASE}${item.filePath}`,
                                                                "_blank"
                                                            )
                                                        }
                                                        title="View Certificate"
                                                        className="
                                                        w-8 h-8
                                                        rounded-xl
                                                        bg-muted/60
                                                        hover:bg-gold/20
                                                        hover:text-gold
                                                        text-muted-foreground
                                                        flex items-center justify-center
                                                        transition-all"
                                                    >
                                                        <Eye
                                                            size={14}
                                                            strokeWidth={2.5}
                                                        />
                                                    </button>
                                                    {/* Custom Download */}
                                                    {(cert.filePath || item.filePath) ? (
                                                        <button
                                                            onClick={() => handleDownload(item)}
                                                            title="Download Original File"
                                                            className="w-8 h-8 rounded-xl bg-muted/60 hover:bg-blue-500/20 hover:text-blue-500 text-muted-foreground flex items-center justify-center transition-all"
                                                        >
                                                            <Download size={14} strokeWidth={2.5} />
                                                        </button>
                                                    ) : (
                                                        <button disabled className="w-8 h-8 rounded-xl bg-muted/20 text-muted-foreground/30 flex items-center justify-center cursor-not-allowed">
                                                            <Download size={14} />
                                                        </button>
                                                    )}

                                                    {/* Approve Button */}
                                                    {canEdit !== false && (
                                                        <button
                                                            onClick={() => { setSelectedItem(item); setModalType('approve'); }}
                                                            title="Approve Request"
                                                            className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-500 hover:text-white text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-all"
                                                        >
                                                            <Check size={12} strokeWidth={3} /> Approve
                                                        </button>
                                                    )}

                                                    {/* Reject Button */}
                                                    {canEdit !== false && (
                                                        <button
                                                            onClick={() => { setSelectedItem(item); setModalType('reject'); }}
                                                            title="Reject Request"
                                                            className="px-3.5 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500 text-red-500 hover:text-white text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-all"
                                                        >
                                                            <X size={12} strokeWidth={3} /> Reject
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination {...paginationProps} />
            </div>
        </div>
    );
};

export default CertificateApprovalList;
