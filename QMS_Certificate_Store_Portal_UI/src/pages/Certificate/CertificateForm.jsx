import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  ChevronLeft,
  Loader2,
  Upload,
  X,
  Calendar,
  Plus,
} from "lucide-react";
import { certificateService } from "../../api/certificateService";
import { certificateTypeService } from "../../api/certificateTypeService";
import { userApi } from "../../api/userApi";
import { departmentService } from "../../api/departmentService";
import { toast } from "react-hot-toast";
import { API_URL } from "@/Config/BaseUrl";

const CertificateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    idCertificate: 0,
    certificateName: "",
    certificateNumber: "",
    idCertificateType: "",
    idOwner: "",
    idDepartment: "",
    idLocation: "",
    idCompany: "",
    issueDate: "",
    validForYears: "",
    expiryDate: "",
    renewalCategory: "Every Year",
    renewalMonth: "January", // 👈 Add this line
    renewalYear: new Date().getFullYear().toString(), // 👈 Add this line
    tags: "",
    fileName: "",
    filePath: "",
    status: "Draft",
    notes: "",
    isActive: true,
    reminders: [
      { daysBeforeExpiry: 30, channel: "Email + In-App" },
      { daysBeforeExpiry: 15, channel: "Email + In-App" },
    ],
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
        const expDateStr = issue.toISOString().split("T")[0];
        setFormData((prev) => ({ ...prev, expiryDate: expDateStr }));
      }
    }
  }, [formData.issueDate, formData.validForYears]);

  // Load Lookup data for dropdowns
  const loadLookups = async () => {
    try {
      const [typesRes, usersRes, deptsRes] = await Promise.all([
        certificateTypeService.getAll(),
        userApi.getAll(),
        departmentService.getAll(),
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
        const data = res.data;

        // =========================================
        // SPLIT RENEWAL CATEGORY
        // =========================================
        let renewalMonth = "January";

        let renewalYear = new Date().getFullYear().toString();

        if (data.renewalCategory) {
          const parts = data.renewalCategory.split(" ");

          renewalMonth = parts[0] || "January";

          renewalYear = parts[1] || new Date().getFullYear().toString();
        }

        // =========================================
        // FORMAT REMINDERS
        // =========================================
        const reminders =
          (data.reminders || data.Reminders)?.map((r) => ({
            daysBeforeExpiry: r.daysBeforeExpiry || r.DaysBeforeExpiry,

            channel: r.channel || r.Channel,
          })) || [];

        // =========================================
        // SET FORM DATA
        // =========================================
        setFormData({
          ...data,

          idCertificate: data.idCertificate || data.IDCertificate,

          certificateName: data.certificateName || data.CertificateName,

          certificateNumber: data.certificateNumber || data.CertificateNumber,

          idCertificateType: data.idCertificateType || data.IDCertificateType,

          idOwner: data.idOwner || data.IDOwner,

          idDepartment: data.idDepartment || data.IDDepartment,

          validForYears: data.validForYears || data.ValidForYears,

          renewalCategory: data.renewalCategory || data.RenewalCategory,

          tags: data.tags || data.Tags,

          fileName: data.fileName || data.FileName,

          filePath: data.filePath || data.FilePath,

          status: data.status || data.Status,

          notes: data.notes || data.Notes,

          isActive: data.isActive ?? data.IsActive,

          issueDate: data.issueDate
            ? data.issueDate.split("T")[0]
            : data.IssueDate
              ? data.IssueDate.split("T")[0]
              : "",

          expiryDate: data.expiryDate
            ? data.expiryDate.split("T")[0]
            : data.ExpiryDate
              ? data.ExpiryDate.split("T")[0]
              : "",
          idCompany: data.idCompany || data.IDCompany || "",

          idLocation: data.idLocation || data.IDLocation || "",
          reminders,

          renewalMonth,
          renewalYear,
        });
      }
    } catch (error) {
      console.error(error);

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
    uploadData.append("file", file);

    try {
      setUploading(true);
      const res = await certificateService.upload(uploadData);
      if (res.success) {
        setFormData((prev) => ({
          ...prev,
          fileName: res.fileName,
          filePath: res.filePath,
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
    setFormData((prev) => ({
      ...prev,
      reminders: [
        ...prev.reminders,
        { daysBeforeExpiry: 30, channel: "Email + In-App" },
      ],
    }));
  };

  const handleUpdateReminder = (index, field, value) => {
    const updated = [...formData.reminders];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, reminders: updated }));
  };

  const handleRemoveReminder = (index) => {
    setFormData((prev) => ({
      ...prev,
      reminders: prev.reminders.filter((_, i) => i !== index),
    }));
  };
  const currentUser = JSON.parse(localStorage.getItem("user"));
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
        idDepartment: formData.idDepartment
          ? parseInt(formData.idDepartment)
          : null,
        validForYears: formData.validForYears
          ? parseInt(formData.validForYears)
          : null,
        idCompany: currentUser?.idCompany || 0,

        idLocation: currentUser?.idLocation || 0,

        renewalCategory: `${formData.renewalMonth} ${formData.renewalYear}`,
      };

      const res = await certificateService.save(payload);
      if (res.result > 0) {
        toast.success(res.message);
        navigate("/certificate");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Error occurred while saving certificate");
    } finally {
      setSaving(false);
    }
  };

  // Changed to match CompanyForm.jsx
  const inputClass =
    "w-full bg-background border-2 border-border/60 rounded-xl px-4 py-3.5 text-sm font-bold text-foreground focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all shadow-sm placeholder:text-muted-foreground/50";
  const labelClass =
    "text-[14px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-1";

  if (loading)
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={48} />
      </div>
    );

  return (
    <div className="w-full max-w-[1450px] mx-auto px-8 py-6 animate-in slide-in-from-bottom-10 duration-700">
      {/* HEADER */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/certificate")}
          className="
                            flex items-center gap-2
                            text-xs
                            font-black
                            uppercase
                            tracking-[0.2em]
                            text-muted-foreground
                            hover:text-gold
                            transition-colors
                            mb-4
      "
        >
          <ChevronLeft size={16} />
          Back to Registry
        </button>

        <h1 className="text-5xl font-black tracking-tight text-foreground">
          {id ? "Edit" : "Add"} Certificate
        </h1>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="
      bg-card
      border border-border/60
      shadow-2xl
      rounded-[32px]
      p-8
      space-y-8
    "
      >
        <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.9fr] gap-8">
          {/* LEFT SIDE */}
          <div className="space-y-6">
            {/* BASIC INFORMATION */}
            <div
              className="
            border border-border/50
            rounded-3xl
            p-6
            bg-background/40
            shadow-sm
          "
            >
              <h2
                className="
              text-[13px]
              font-black
              uppercase
              tracking-[0.25em]
              text-gold
              mb-5
            "
              >
                Basic Information
              </h2>

              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2 space-y-2">
                  <label className={labelClass}>Certificate Name</label>

                  <input
                    type="text"
                    value={formData.certificateName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        certificateName: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Certificate Number</label>

                  <input
                    type="text"
                    value={formData.certificateNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        certificateNumber: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Certificate Type</label>

                  <select
                    value={formData.idCertificateType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        idCertificateType: e.target.value,
                      })
                    }
                    className={inputClass}
                  >
                    <option value="">Select</option>

                    {certificateTypes.map((t) => (
                      <option
                        key={t.idCertificateType}
                        value={t.idCertificateType}
                      >
                        {t.certificateTypeName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Owner</label>

                  <select
                    value={formData.idOwner}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        idOwner: e.target.value,
                      })
                    }
                    className={inputClass}
                  >
                    <option value="">Select</option>

                    {users.map((u) => (
                      <option key={u.idUser} value={u.idUser}>
                        {u.userFullName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Department</label>

                  <select
                    value={formData.idDepartment}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        idDepartment: e.target.value,
                      })
                    }
                    className={inputClass}
                  >
                    <option value="">Select</option>

                    {departments.map((d) => (
                      <option key={d.idDepartment} value={d.idDepartment}>
                        {d.departmentName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* VALIDITY */}
            <div
              className="
            border border-border/50
            rounded-3xl
            p-6
            bg-background/40
            shadow-sm
          "
            >
              <h2
                className="
              text-[13px]
              font-black
              uppercase
              tracking-[0.25em]
              text-gold
              mb-5
            "
              >
                Validity & Dates
              </h2>

              <div className="grid grid-cols-2 gap-5">
                {/* ISSUE DATE */}
                <div className="space-y-2">
                  <label className={labelClass}>Issue Date</label>

                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        issueDate: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </div>

                {/* VALID FOR */}
                <div className="space-y-2">
                  <label className={labelClass}>Valid For</label>

                  <select
                    value={formData.validForYears}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        validForYears: e.target.value,
                      })
                    }
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

                {/* EXPIRY DATE */}
                <div className="space-y-2">
                  <label className={labelClass}>Expiry Date</label>

                  <input
                    readOnly
                    type="date"
                    value={formData.expiryDate}
                    className={`${inputClass} bg-muted/20`}
                  />
                </div>

                {/* RENEWAL MONTH */}
                <div className="space-y-2">
                  <label className={labelClass}>Renewal Month</label>

                  <select
                    value={formData.renewalMonth}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        renewalMonth: e.target.value,
                      })
                    }
                    className={inputClass}
                  >
                    {[
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ].map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* RENEWAL YEAR */}
                <div className="space-y-2 col-span-2">
                  <label className={labelClass}>Renewal Year</label>

                  <select
                    value={formData.renewalYear}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        renewalYear: e.target.value,
                      })
                    }
                    className={inputClass}
                  >
                    {Array.from({ length: 50 }, (_, i) =>
                      (new Date().getFullYear() + i).toString(),
                    ).map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-5">
            <div
              className="
        border border-border/50
        rounded-3xl
        p-5
        bg-background/40
        shadow-sm
    "
            >
              {/* TITLE */}
              <h2
                className="
            text-[13px]
            font-black
            uppercase
            tracking-[0.25em]
            text-muted-foreground
            mb-5
        "
              >
                Reminder Configuration
              </h2>

              {/* REMINDERS */}
              <div className="space-y-4">
                {formData.reminders.map((reminder, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end"
                  >
                    {/* DAYS */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">
                        Days Before Expiry
                      </label>

                      <input
                        type="number"
                        value={reminder.daysBeforeExpiry}
                        onChange={(e) =>
                          handleUpdateReminder(
                            index,
                            "daysBeforeExpiry",
                            e.target.value,
                          )
                        }
                        className={inputClass}
                      />
                    </div>

                    {/* CHANNEL */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">
                        Channel
                      </label>

                      <select
                        value={reminder.channel}
                        onChange={(e) =>
                          handleUpdateReminder(index, "channel", e.target.value)
                        }
                        className={inputClass}
                      >
                        <option value="Email">Email</option>

                        <option value="In-App">In-App</option>

                        <option value="Email + In-App">Email + In-App</option>
                      </select>
                    </div>

                    {/* REMOVE */}
                    <button
                      type="button"
                      onClick={() => handleRemoveReminder(index)}
                      className="
                        h-[54px]
                        w-[54px]
                        rounded-xl
                        border border-border
                        flex items-center justify-center
                        text-muted-foreground
                        hover:bg-red-500
                        hover:text-white
                        transition-all
                    "
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}

                {/* ADD REMINDER */}
                <button
                  type="button"
                  onClick={handleAddReminder}
                  className="
                text-sm
                font-bold
                text-gold
                hover:underline
                mt-2
            "
                >
                  + Add another reminder
                </button>
              </div>
            </div>
            {/* ATTACHMENT */}
            <div
              className="
    border border-border/50
    rounded-3xl
    p-5
    bg-background/40
    shadow-sm
  "
            >
              <h2
                className="
      text-[13px]
      font-black
      uppercase
      tracking-[0.25em]
      text-gold
      mb-4
    "
              >
                Attachment
              </h2>
              {/* SHOW EXISTING FILE */}
              {formData.fileName && (
                <div
                  className="
      mb-4
      p-4
      rounded-2xl
      border border-border/50
      bg-background/60
      flex items-center justify-between
    "
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">
                      {formData.fileName}
                    </p>

                    <p className="text-xs text-muted-foreground mt-1">
                      Existing uploaded file
                    </p>
                  </div>

                  {/* VIEW BUTTON */}
                  <a
                    href={`https://localhost:7294${formData.filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
        px-4
        py-2
        rounded-xl
        bg-gold
        text-white
        text-xs
        font-black
        uppercase
        tracking-[0.1em]
        hover:scale-105
        transition-all
      "
                  >
                    View
                  </a>
                </div>
              )}
              <div
                onClick={() => fileInputRef.current.click()}
                className="
      border-2
      border-dashed
      border-border/60
      rounded-3xl
      h-[140px]
      flex
      flex-col
      items-center
      justify-center
      hover:border-gold
      hover:bg-gold/5
      transition-all
      cursor-pointer
    "
              >
                <Upload size={34} className="text-muted-foreground mb-3" />

                <p className="text-sm font-black">Upload Certificate</p>

                <p className="text-[11px] text-muted-foreground mt-1">
                  PDF, DOC, PNG, JPG
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* TAGS & NOTES */}
            <div
              className="
    border border-border/50
    rounded-3xl
    p-5
    bg-background/40
    shadow-sm
  "
            >
              <h2
                className="
      text-[13px]
      font-black
      uppercase
      tracking-[0.25em]
      text-gold
      mb-4
    "
              >
                Tags & Notes
              </h2>

              <div className="space-y-4">
                {/* TAGS */}
                <div className="space-y-2">
                  <label className={labelClass}>Tags</label>

                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tags: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </div>

                {/* NOTES */}
                <div className="space-y-2">
                  <label className={labelClass}>Notes</label>

                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notes: e.target.value,
                      })
                    }
                    className="
                                                 w-full
                                                 bg-background
                                                 border border-border/60
                                                 rounded-2xl
                                                 px-4
                                                 py-3
                                                 text-[15px]
                                                 font-semibold
                                                 text-foreground
                                                 shadow-sm
                                                 transition-all
                                                 focus:outline-none
                                                 focus:ring-2
                                                 focus:ring-gold/30
                                                 focus:border-gold
                                                 resize-none
        "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div
          className="
        flex items-center justify-between
        border-t border-border/40
        pt-6
      "
        >
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isActive: e.target.checked,
                })
              }
              className="w-5 h-5 accent-gold"
            />

            <span className="text-sm font-bold">Active Certificate</span>
          </label>

          <button
            type="submit"
            disabled={saving}
            className="
          h-14
          px-10
          bg-gold
          hover:bg-gold/90
          text-white
          rounded-2xl
          font-black
          uppercase
          tracking-[0.15em]
          shadow-lg
          shadow-gold/20
          transition-all
          hover:scale-105
          disabled:opacity-50
          flex items-center gap-3
        "
          >
            {saving ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            Save Certificate
          </button>
        </div>
      </form>
    </div>
  );
};

export default CertificateForm;
