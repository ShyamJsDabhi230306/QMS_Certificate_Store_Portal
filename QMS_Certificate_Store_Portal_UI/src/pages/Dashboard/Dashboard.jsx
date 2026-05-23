import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { RefreshCw, ArrowRight } from 'lucide-react';
import { certificateService } from '../../api/certificateService';
import toast from 'react-hot-toast';
import { transactionCertificateApprovalService } 
from '../../api/transactionCertificateApprovalService';
const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [approvalHistory, setApprovalHistory] = useState([]);

const [historyOpen, setHistoryOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            const res = await certificateService.getDashboardStats();
            if (res.success) {
                setStats(res.data);
            }
        } catch (error) {
            toast.error("Failed to load dashboard stats", error);
        } finally {
            setLoading(false);
        }
    };
const loadApprovalHistory = async () => {

    try {

        const res =
            await transactionCertificateApprovalService
                .getHistory();

        if (res.success) {

            setApprovalHistory(res.data);
        }

    } catch {

        toast.error(
            "Failed to load approval history"
        );
    }
};
    if (loading || !stats) {
        return (
            <div className="h-[80vh] flex items-center justify-center bg-background">
                <RefreshCw className="animate-spin text-gold" size={48} />
            </div>
        );
    }

    const { summary, expiriesNext12Months, certificatesByType, recentlyAdded } = stats;

    // Golden gradient colors for the Donut chart
    const COLORS = ['#3b82f6', '#10b981', '#ec4899', '#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444'];

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-700 bg-background min-h-screen">
            {/* ── Header ───────────────────────────────────────────── */}
            <div>
                <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">An overview of all certificates in your organization.</p>
                <button
        onClick={() => {
            setHistoryOpen(true);
            loadApprovalHistory();
        }}
        className="
            px-4
            py-2.5
            rounded-xl
            bg-card
            border-2
            border-border
            hover:border-gold/50
            text-xs
            font-black
            uppercase
            tracking-[0.15em]
            text-foreground
            transition-all
            hover:scale-[1.02]
            shadow-lg
        "
    >
        Approval History
    </button>

            </div>

            {/* ── 4 Summary Cards ──────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 1. Total */}
                <div className="bg-card border-2 border-border p-6 rounded-2xl shadow-xl flex flex-col justify-between h-32 hover:border-gold/30 transition-colors">
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Total Certificates</p>
                    <div>
                        <p className="text-4xl font-black text-foreground">{summary.totalCertificates}</p>
                        <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider mt-1">▲ Stored & Tracked</p>
                    </div>
                </div>

                {/* 2. Valid */}
                <div className="bg-card border-2 border-emerald-500/30 p-6 rounded-2xl shadow-xl flex flex-col justify-between h-32 hover:border-emerald-500/60 transition-colors">
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Currently Valid</p>
                    <div>
                        <p className="text-4xl font-black text-foreground">{summary.validCertificates}</p>
                        <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider mt-1">In Good Standing</p>
                    </div>
                </div>

                {/* 3. Expiring < 30 days */}
                <div className="bg-card border-2 border-yellow-500/30 p-6 rounded-2xl shadow-xl flex flex-col justify-between h-32 hover:border-yellow-500/60 transition-colors">
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Expiring &lt; 30 Days</p>
                    <div>
                        <p className="text-4xl font-black text-foreground">{summary.expiringIn30Days}</p>
                        <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider mt-1">Action Recommended</p>
                    </div>
                </div>

                {/* 4. Expired */}
                <div className="bg-card border-2 border-red-500/30 p-6 rounded-2xl shadow-xl flex flex-col justify-between h-32 hover:border-red-500/60 transition-colors">
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Expired</p>
                    <div>
                        <p className="text-4xl font-black text-foreground">{summary.expiredCertificates}</p>
                        <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-1">Renew Immediately</p>
                    </div>
                </div>
            </div>

            {/* ── Charts Row ───────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bar Chart: Expiries */}
                <div className="lg:col-span-2 bg-card border-2 border-border p-6 rounded-3xl shadow-2xl h-[350px]">
                    <h3 className="text-[12px] font-black uppercase tracking-widest text-foreground mb-6">Expiries — Next 12 Months</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={expiriesNext12Months} margin={{ top: 0, right: 0, left: 0, bottom: 20 }}>
                            <XAxis dataKey="monthName" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 800 }} dy={10} />
                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #1f2937', borderRadius: '12px' }} />
                            <Bar dataKey="count" fill="#D4A95A" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Donut Chart: By Type */}
                <div className="bg-card border-2 border-border p-6 rounded-3xl shadow-2xl h-[350px] flex flex-col">
                    <h3 className="text-[12px] font-black uppercase tracking-widest text-foreground mb-4">Certificates by Type</h3>
                    <div className="flex-1 flex items-center justify-between">
                        <div className="w-1/2 h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={certificatesByType} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="count" stroke="none">
                                        {certificatesByType.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #1f2937', borderRadius: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-1/2 pl-4 space-y-3">
                            {certificatesByType.map((entry, index) => (
                                <div key={entry.typeName} className="flex items-center justify-between text-xs font-bold">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        <span className="text-muted-foreground">{entry.typeName}</span>
                                    </div>
                                    <span className="text-foreground">{entry.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Recently Added Table ─────────────────────────────── */}
            <div className="bg-card border-2 border-border rounded-3xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                    <h3 className="text-[12px] font-black uppercase tracking-widest text-foreground">Recently Added</h3>
                    <button onClick={() => navigate('/certificate')} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-gold transition-colors flex items-center gap-1 border border-border px-3 py-1.5 rounded-lg">
                        View all <ArrowRight size={12} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/50 border-b border-border text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                            <tr>
                                <th className="px-6 py-4">Certificate</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Owner</th>
                                <th className="px-6 py-4">Expiry</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {recentlyAdded.map((cert) => (
                                <tr key={cert.idCertificate} className="hover:bg-gold/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-[13px] font-black text-foreground">{cert.certificateName}</p>
                                        <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mt-0.5">{cert.certificateNumber}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-muted/80 text-foreground">
                                            {cert.certificateTypeName || '–'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[12px] font-bold text-foreground/80">{cert.ownerName || '–'}</td>
                                    <td className="px-6 py-4 text-[12px] font-bold text-foreground/80">
                                        {new Date(cert.expiryDate).toLocaleDateString('en-CA')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-[11px] font-black">
                                            <span className={`w-2 h-2 rounded-full ${cert.status === 'Valid' ? 'bg-emerald-500' : cert.status === 'Pending' ? 'bg-blue-400' : 'bg-red-500'}`} />
                                            <span className={cert.status === 'Valid' ? 'text-emerald-400' : cert.status === 'Pending' ? 'text-blue-400' : 'text-red-400'}>{cert.status}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {
    historyOpen && (

        <div
            className="
                fixed
                inset-0
                bg-black/50
                backdrop-blur-sm
                z-50
                flex
                items-center
                justify-center
                p-6
            "
        >

            <div
                className="
                    w-full
                    max-w-6xl
                    max-h-[90vh]
                    overflow-hidden
                    rounded-3xl
                    bg-card
                    border-2
                    border-border
                    shadow-2xl
                "
            >

                {/* HEADER */}
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        px-6
                        py-5
                        border-b
                        border-border
                    "
                >

                    <h2
                        className="
                            text-xl
                            font-black
                            tracking-tight
                            text-foreground
                        "
                    >
                        Approval History
                    </h2>

                    <button
                        onClick={() => setHistoryOpen(false)}
                        className="
                            px-4
                            py-2
                            rounded-xl
                            border
                            border-border
                            hover:border-red-500/40
                            text-xs
                            font-black
                            uppercase
                            tracking-widest
                            transition-colors
                        "
                    >
                        Close
                    </button>

                </div>

                {/* TABLE */}
                <div className="overflow-auto max-h-[75vh]">

                    <table className="w-full text-left">

                        <thead
                            className="
                                bg-muted/50
                                border-b
                                border-border
                                text-[10px]
                                uppercase
                                tracking-[0.2em]
                                text-muted-foreground
                            "
                        >

                            <tr>

                                <th className="px-6 py-4">
                                    Certificate
                                </th>

                                <th className="px-6 py-4">
                                    Type
                                </th>

                                <th className="px-6 py-4">
                                    Status
                                </th>

                                <th className="px-6 py-4">
                                    Approved By
                                </th>

                                <th className="px-6 py-4">
                                    Date
                                </th>

                            </tr>

                        </thead>

                        <tbody className="divide-y divide-border">

                            {
                                approvalHistory.map((item) => (

                                    <tr
                                        key={
                                            item.idCertificate
                                        }
                                        className="
                                            hover:bg-gold/[0.03]
                                            transition-colors
                                        "
                                    >

                                        <td className="px-6 py-4">

                                            <p
                                                className="
                                                    text-[13px]
                                                    font-black
                                                    text-foreground
                                                "
                                            >
                                                {
                                                    item.certificateName
                                                }
                                            </p>

                                            <p
                                                className="
                                                    text-[10px]
                                                    uppercase
                                                    tracking-widest
                                                    text-muted-foreground
                                                    mt-1
                                                "
                                            >
                                                {
                                                    item.certificateNumber
                                                }
                                            </p>

                                        </td>

                                        <td className="px-6 py-4 text-sm font-bold">
                                            {
                                                item.certificateTypeName
                                            }
                                        </td>

                                        <td className="px-6 py-4">

                                            <span
                                                className={`
                                                    px-3
                                                    py-1
                                                    rounded-full
                                                    text-[10px]
                                                    font-black
                                                    uppercase
                                                    tracking-widest

                                                    ${
                                                        item.approvalStatus === 'Approved'
                                                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                                            : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                    }
                                                `}
                                            >
                                                {
                                                    item.approvalStatus
                                                }
                                            </span>

                                        </td>

                                        <td className="px-6 py-4 text-sm font-bold text-foreground/80">
                                            {
                                                item.approvedByName
                                            }
                                        </td>

                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                            {
                                                item.approvalDate
                                                    ?.split('T')[0]
                                            }
                                        </td>

                                    </tr>
                                ))
                            }

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    )
}
        </div>
        
    );
};

export default Dashboard;
