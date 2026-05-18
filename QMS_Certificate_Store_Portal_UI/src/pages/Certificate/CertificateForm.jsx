import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ChevronLeft, Loader2, Upload, X, Calendar, Plus } from 'lucide-react';
import { certificateService } from '../../api/certificateService';
import { certificateTypeService } from '../../api/certificateTypeService';
import { userApi } from '../../api/userApi';
import { departmentService } from '../../api/departmentService';
import { toast } from 'react-hot-toast';

const CertificateForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // Form State
    const [formData, setFormData] = useState({
        idCertificate: 0,
        certificateName: '',
        certificateNumber: '',
        idCertificateType: '',
        idOwner: '',
        idDepartment: '',
        issueDate: '',
        validForYears: '',
        expiryDate: '',
        renewalCategory: 'Every Year',
        tags: '',
        fileName: '',
        filePath: '',
        status: 'Draft',
        notes: '',
        reminders: [
            { daysBeforeExpiry: 30, channel: 'Email + In-App' },
            { daysBeforeExpiry: 15, channel: 'Email + In-App' }
        ]
    });

    // Lookup Option Lists
    const [certificateTypes, setCertificateTypes] = useState([]);
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);

    // UI Loading States
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadLookups();
        if (id) {
            loadCertificate();
        }
    }, [id]);

    // Auto-calculate Expiry Date when IssueDate or ValidForYears changes
    useEffect(() => {
        if (formData.issueDate && formData.validForYears) {
            const issue = new Date(formData.issueDate);
            const years = parseInt(formData.validForYears);
            if (!isNaN(years)) {
                issue.setFullYear(issue.getFullYear() + years);
                // Format back to YYYY-MM-DD for date input
                const expDateStr = issue.toISOString().split('T')[0];
                setFormData(prev => ({ ...prev, expiryDate: expDateStr }));
            }
        }
    }, [formData.issueDate, formData.validForYears]);

    // Load Lookup data for dropdowns
    const loadLookups = async () => {
        try {
            const [typesRes, usersRes, deptsRes] = await Promise.all([
                certificateTypeService.getAll(),
                userApi.getAll(),
                departmentService.getAll()
            ]);

            if (typesRes.success) setCertificateTypes(typesRes.data);
            if (usersRes.success) setUsers(usersRes.data);
            if (deptsRes.success) setDepartments(deptsRes.data);
        } catch (error) {
            toast.error("Error loading form lookup options");
        }
    };

    // Load existing Certificate details (for editing)
    const loadCertificate = async () => {
        try {
            setLoading(true);
            const res = await certificateService.getById(id);
            if (res.success && res.data) {
                // Ensure dates are parsed correctly to YYYY-MM-DD
                const data = res.data;
                setFormData({
                    ...data,
                    issueDate: data.issueDate ? data.issueDate.split('T')[0] : '',
                    expiryDate: data.expiryDate ? data.expiryDate.split('T')[0] : '',
                    reminders: data.reminders || []
                });
            }
        } catch (error) {
            toast.error("Error loading certificate details");
        } finally {
            setLoading(false);
        }
    };

    // Handle File Upload
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size exceeds the 10 MB limit.");
            return;
        }

        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            setUploading(true);
            const res = await certificateService.upload(uploadData);
            if (res.success) {
                setFormData(prev => ({
                    ...prev,
                    fileName: res.fileName,
                    filePath: res.filePath
                }));
                toast.success("File uploaded successfully!");
            }
        } catch (error) {
            toast.error("File upload failed.");
        } finally {
            setUploading(false);
        }
    };

    // Dynamic Reminders Management
    const handleAddReminder = () => {
        setFormData(prev => ({
            ...prev,
            reminders: [...prev.reminders, { daysBeforeExpiry: 30, channel: 'Email + In-App' }]
        }));
    };

    const handleUpdateReminder = (index, field, value) => {
        const updated = [...formData.reminders];
        updated[index] = { ...updated[index], [field]: value };
        setFormData(prev => ({ ...prev, reminders: updated }));
    };

    const handleRemoveReminder = (index) => {
        setFormData(prev => ({
            ...prev,
            reminders: prev.reminders.filter((_, i) => i !== index)
        }));
    };

    // Submit Form (Save)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Parse numeric FK ids
            const payload = {
                ...formData,
                idCertificateType: parseInt(formData.idCertificateType),
                idOwner: formData.idOwner ? parseInt(formData.idOwner) : null,
                idDepartment: formData.idDepartment ? parseInt(formData.idDepartment) : null,
                validForYears: formData.validForYears ? parseInt(formData.validForYears) : null
            };

            const res = await certificateService.save(payload);
            if (res.result > 0) {
                toast.success(res.message);
                navigate('/certificate');
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Error occurred while saving certificate");
        } finally {
            setSaving(false);
        }
    };

    const inputClass = "w-full bg-[#111827]/60 border-2 border-border/40 rounded-xl px-4 py-3.5 text-sm font-bold text-foreground focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all shadow-sm";
    const labelClass = "text-[12px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-1";

    if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-gold" size={48} /></div>;

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-6 animate-in slide-in-from-bottom-10 duration-700">
            <button
                onClick={() => navigate('/certificate')}
                className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground hover:text-gold tracking-widest transition-colors"
            >
                <ChevronLeft size={16} /> Back to Registry
            </button>
            <h1 className="text-4xl font-black tracking-tight">{id ? 'Edit' : 'Add'} Certificate</h1>

            <form onSubmit={handleSubmit} className="bg-card border-2 border-border shadow-2xl p-8 md:p-12 rounded-[2.5rem] space-y-10">

                {/* 1. BASIC INFORMATION */}
                <div className="space-y-6">
                    <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gold border-b border-border/40 pb-2">Basic Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <label className={labelClass}>Certificate Name *</label>
                            <input
                                required
                                type="text"
                                value={formData.certificateName}
                                onChange={e => setFormData({ ...formData, certificateName: e.target.value })}
                                className={inputClass}
                                placeholder="e.g. ISO 9001 Certification"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className={labelClass}>Certificate Number / ID *</label>
                            <input
                                required
                                type="text"
                                value={formData.certificateNumber}
                                onChange={e => setFormData({ ...formData, certificateNumber: e.target.value })}
                                className={inputClass}
                                placeholder="e.g. ISO-2025-0012"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className={labelClass}>Certificate Type *</label>
                            <select
                                required
                                value={formData.idCertificateType}
                                onChange={e => setFormData({ ...formData, idCertificateType: e.target.value })}
                                className={inputClass}
                            >
                                <option value="">Select type</option>
                                {certificateTypes.map(t => (
                                    <option key={t.idCertificateType} value={t.idCertificateType}>{t.certificateTypeName}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className={labelClass}>Owner</label>
                            <select
                                value={formData.idOwner}
                                onChange={e => setFormData({ ...formData, idOwner: e.target.value })}
                                className={inputClass}
                            >
                                <option value="">- None -</option>
                                {users.map(u => (
                                    <option key={u.idUser} value={u.idUser}>{u.userFullName}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className={labelClass}>Department</label>
                            <select
                                value={formData.idDepartment}
                                onChange={e => setFormData({ ...formData, idDepartment: e.target.value })}
                                className={inputClass}
                            >
                                <option value="">- None -</option>
                                {departments.map(d => (
                                    <option key={d.idDepartment} value={d.idDepartment}>{d.departmentName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2. VALIDITY & DATES */}
                <div className="space-y-6">
                    <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gold border-b border-border/40 pb-2">Validity & Dates</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className={labelClass}>Issue Date *</label>
                            <input
                                required
                                type="date"
                                value={formData.issueDate}
                                onChange={e => setFormData({ ...formData, issueDate: e.target.value })}
                                className={inputClass}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className={labelClass}>Valid For (Years) *</label>
                            <select
                                required
                                value={formData.validForYears}
                                onChange={e => setFormData({ ...formData, validForYears: e.target.value })}
                                className={inputClass}
                            >
                                <option value="">Select</option>
                                <option value="1">1 Year</option>
                                <option value="2">2 Years</option>
                                <option value="3">3 Years</option>
                                <option value="5">5 Years</option>
                                <option value="10">10 Years</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className={labelClass}>Expiry / Due Date *</label>
                            <div className="relative">
                                <input
                                    required
                                    readOnly
                                    type="date"
                                    value={formData.expiryDate}
                                    className={`${inputClass} bg-muted/20 cursor-not-allowed`}
                                />
                                <span className="absolute bottom-[-18px] left-1 text-[10px] text-muted-foreground font-bold tracking-wide italic">Auto-fills from validity</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className={labelClass}>Renewal Category</label>
                            <select
                                value={formData.renewalCategory}
                                onChange={e => setFormData({ ...formData, renewalCategory: e.target.value })}
                                className={inputClass}
                            >
                                <option value="Every Year">Every Year</option>
                                <option value="Every 2 Years">Every 2 Years</option>
                                <option value="Every 3 Years">Every 3 Years</option>
                                <option value="Every 5 Years">Every 5 Years</option>
                                <option value="One Time">One Time</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 3. REMINDER CONFIGURATION */}
                <div className="space-y-6 pt-2">
                    <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gold border-b border-border/40 pb-2">Reminder Configuration</h2>

                    <div className="space-y-4">
                        {formData.reminders.map((reminder, index) => (
                            <div key={index} className="flex items-center gap-4 animate-in fade-in duration-300">
                                <div className="flex-1 grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className={labelClass}>Days Before Expiry</label>
                                        <input
                                            required
                                            type="number"
                                            value={reminder.daysBeforeExpiry}
                                            onChange={e => handleUpdateReminder(index, 'daysBeforeExpiry', parseInt(e.target.value))}
                                            className={inputClass}
                                            min="0"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className={labelClass}>Channel</label>
                                        <select
                                            value={reminder.channel}
                                            onChange={e => handleUpdateReminder(index, 'channel', e.target.value)}
                                            className={inputClass}
                                        >
                                            <option value="Email + In-App">Email + In-App</option>
                                            <option value="Email">Email Only</option>
                                            <option value="In-App">In-App Only</option>
                                        </select>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveReminder(index)}
                                    className="p-2 border-2 border-border/40 hover:border-red-500 hover:text-red-500 rounded-xl transition-all self-end mb-1 mt-6"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={handleAddReminder}
                        className="text-xs font-black uppercase text-gold hover:text-gold/80 tracking-widest flex items-center gap-2 mt-2 transition-all hover:scale-102"
                    >
                        <Plus size={16} strokeWidth={3} /> + Add another reminder
                    </button>
                </div>

                {/* 4. TAGS & NOTES */}
                <div className="space-y-6">
                    <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gold border-b border-border/40 pb-2">Tags & Notes</h2>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <label className={labelClass}>Tags</label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                className={inputClass}
                                placeholder="Type tag and press comma or enter (e.g. ISO-9001, critical)"
                            />
                        </div>
                    </div>
                </div>

                {/* 5. ATTACHMENT */}
                <div className="space-y-6">
                    <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gold border-b border-border/40 pb-2">Attachment</h2>

                    <div className="space-y-3">
                        <label className={labelClass}>Upload File</label>
                        <div
                            onClick={() => fileInputRef.current.click()}
                            className="border-2 border-dashed border-border/60 hover:border-gold/60 bg-[#111827]/20 hover:bg-[#111827]/40 rounded-3xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group"
                        >
                            {uploading ? (
                                <Loader2 className="animate-spin text-gold" size={32} />
                            ) : (
                                <Upload className="text-muted-foreground group-hover:text-gold transition-colors" size={32} />
                            )}
                            <span className="text-sm text-foreground font-black uppercase tracking-wider">Click to upload or drag and drop</span>
                            <span className="text-[11px] text-muted-foreground font-bold">PDF, DOC/DOCX, JPG, PNG - Max 10 MB</span>
                            <input
                                ref={fileInputRef}
                                type="file"
                                onChange={handleFileUpload}
                                className="hidden"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />
                        </div>

                        {/* File Details Display */}
                        {formData.fileName && (
                            <div className="flex items-center justify-between px-5 py-4 bg-muted/30 border border-border/40 rounded-2xl animate-in fade-in duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-gold/15 text-gold rounded-xl">📄</div>
                                    <span className="text-sm font-black text-foreground">{formData.fileName}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, fileName: '', filePath: '' })}
                                    className="p-1 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg transition-all"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* 6. STATUS & OPTIONAL */}
                <div className="space-y-6">
                    <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gold border-b border-border/40 pb-2">Status & Optional</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className={labelClass}>Status</label>
                            <select
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                                className={inputClass}
                            >
                                <option value="Draft">Draft (save & continue)</option>
                                <option value="Submitted">Submitted (submit for approval)</option>
                                <option value="Approved">Approved</option>
                            </select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className={labelClass}>Notes / Description</label>
                            <textarea
                                value={formData.notes}
                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                className={`${inputClass} min-h-[120px]`}
                                placeholder="Optional description or review notes..."
                            />
                        </div>
                    </div>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-between pt-8 border-t border-border/40 mt-8">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                            className="accent-gold w-5 h-5 rounded cursor-pointer"
                        />
                        <span className="text-[13px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">Active Certificate</span>
                    </label>

                    <button
                        disabled={saving}
                        className="px-12 py-4 bg-gold hover:bg-gold/90 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-gold/20 hover:scale-105 transition-all flex items-center gap-3 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} strokeWidth={3} />}
                        {id ? 'Update Certificate' : 'Save Certificate'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CertificateForm;
