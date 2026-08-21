import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  ChevronLeft,
  Loader2,
  Upload,
} from "lucide-react";

import { certificateService } from "../../api/certificateService";
import { certificateTypeService } from "../../api/certificateTypeService";
import { toast } from "react-hot-toast";
import "../../css/CertificateForm.css";

const CertificateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [certificateTypes, setCertificateTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

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
    surveillanceAuditYears: "",
    surveillanceDate: "",
    renewalCategory: "Every Year",
    tags: "",
    fileName: "",
    filePath: "",
    status: "Draft",
    notes: "",
    isActive: true,
    reminders: [],
    CustomContacts: [],
  });

  const inputClass =
    "w-full bg-background border-2 border-border/60 rounded-xl px-4 py-3.5 text-sm font-bold text-foreground focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all shadow-sm placeholder:text-muted-foreground/50";

  const labelClass =
    "text-[14px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-1";

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) return;

    try {
      const user = JSON.parse(savedUser);

      setFormData((previous) => ({
        ...previous,
        idOwner: previous.idOwner || user?.idUser || "",
      }));
    } catch {
      console.error("Invalid logged-in user data.");
    }
  }, []);

  useEffect(() => {
    loadCertificateTypes();

    if (id) {
      loadCertificate();
    }
  }, [id]);

  useEffect(() => {
    if (!formData.issueDate || !formData.validForYears) {
      return;
    }

    if (formData.validForYears === "100") {
      setFormData((previous) => ({
        ...previous,
        expiryDate: "",
      }));

      return;
    }

    const expiry = new Date(formData.issueDate);

    expiry.setFullYear(
      expiry.getFullYear() +
        Number(formData.validForYears)
    );

    setFormData((previous) => ({
      ...previous,
      expiryDate: expiry.toISOString().split("T")[0],
    }));
  }, [formData.issueDate, formData.validForYears]);

  const loadCertificateTypes = async () => {
    try {
      const response = await certificateTypeService.getAll();

      if (response.success) {
        setCertificateTypes(response.data || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to load certificate types.");
    }
  };

  const loadCertificate = async () => {
    try {
      setLoading(true);

      const response = await certificateService.getById(id);

      if (!response.success || !response.data) {
        toast.error("Certificate could not be loaded.");
        return;
      }

      const data = response.data;

      const reminders = (
        data.reminders ||
        data.Reminders ||
        []
      ).map((item) => ({
        daysBeforeSurveillance:
          item.daysBeforeSurveillance ??
          item.DaysBeforeSurveillance ??
          30,
        channel:
          item.channel ??
          item.Channel ??
          "Whatsapp + PulseApp",
      }));

      setFormData((previous) => ({
        ...previous,

        idCertificate:
          data.idCertificate ??
          data.IDCertificate ??
          previous.idCertificate,

        certificateName:
          data.certificateName ??
          data.CertificateName ??
          "",

        certificateNumber:
          data.certificateNumber ??
          data.CertificateNumber ??
          "",

        idCertificateType:
          data.idCertificateType ??
          data.IDCertificateType ??
          "",

        idOwner:
          data.idOwner ??
          data.IDOwner ??
          previous.idOwner,

        idDepartment:
          data.idDepartment ??
          data.IDDepartment ??
          "",

        idCompany:
          data.idCompany ??
          data.IDCompany ??
          "",

        idLocation:
          data.idLocation ??
          data.IDLocation ??
          "",

        issueDate: data.issueDate
          ? data.issueDate.split("T")[0]
          : data.IssueDate
            ? data.IssueDate.split("T")[0]
            : "",

        validForYears:
          data.validForYears ??
          data.ValidForYears ??
          "",

        expiryDate: data.expiryDate
          ? data.expiryDate.split("T")[0]
          : data.ExpiryDate
            ? data.ExpiryDate.split("T")[0]
            : "",

        surveillanceAuditYears:
          data.surveillanceAuditYears ??
          data.SurveillanceAuditYears ??
          "",

        surveillanceDate: data.surveillanceDate
          ? data.surveillanceDate.split("T")[0]
          : data.SurveillanceDate
            ? data.SurveillanceDate.split("T")[0]
            : "",

        tags: data.tags ?? data.Tags ?? "",

        fileName:
          data.fileName ??
          data.FileName ??
          "",

        filePath:
          data.filePath ??
          data.FilePath ??
          "",

        status:
          data.status ??
          data.Status ??
          "Draft",

        notes:
          data.notes ??
          data.Notes ??
          "",

        isActive:
          data.isActive ??
          data.IsActive ??
          true,

        reminders,

        CustomContacts:
          data.customContacts ??
          data.CustomContacts ??
          [],
      }));
    } catch (error) {
      console.error(error);
      toast.error("Unable to load certificate.");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds the 10 MB limit.");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      setUploading(true);

      const response = await certificateService.upload(uploadData);

      if (response.success) {
        setFormData((previous) => ({
          ...previous,
          fileName: response.fileName,
          filePath: response.filePath,
        }));

        toast.success("Certificate uploaded successfully.");
      } else {
        toast.error(response.message || "File upload failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error("File upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const surveillanceMaxDate = useMemo(() => {
    if (
      !formData.issueDate ||
      !formData.surveillanceAuditYears
    ) {
      return "";
    }

    const date = new Date(formData.issueDate);

    date.setFullYear(
      date.getFullYear() +
        Number(formData.surveillanceAuditYears)
    );

    return date.toISOString().split("T")[0];
  }, [
    formData.issueDate,
    formData.surveillanceAuditYears,
  ]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const payload = {
        ...formData,

        idCertificateType: formData.idCertificateType
          ? Number(formData.idCertificateType)
          : null,

        idOwner: formData.idOwner
          ? Number(formData.idOwner)
          : null,

        idDepartment: formData.idDepartment
          ? Number(formData.idDepartment)
          : null,

        idCompany:
          user?.idCompany ||
          formData.idCompany ||
          0,

        idLocation:
          user?.idLocation ||
          formData.idLocation ||
          0,

        validForYears: formData.validForYears
          ? Number(formData.validForYears)
          : null,

        expiryDate:
          formData.validForYears === "100"
            ? null
            : formData.expiryDate || null,

        surveillanceAuditYears:
          formData.validForYears === "100"
            ? 0
            : Number(
                formData.surveillanceAuditYears || 0
              ),

        surveillanceDate:
          formData.validForYears === "100"
            ? null
            : formData.surveillanceDate || null,

        reminders: formData.reminders || [],

        CustomContacts:
          formData.CustomContacts || [],
      };

      const response = await certificateService.save(payload);

      if (response.result > 0) {
        toast.success(
          response.message ||
            "Certificate saved successfully."
        );

        navigate("/certificate");
      } else {
        toast.error(
          response.message ||
            "Certificate could not be saved."
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Error occurred while saving certificate.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2
          size={48}
          className="animate-spin text-gold"
        />
      </div>
    );
  }

  return (
    <div className="certificate-form-page">
      <div className="certificate-form-container">
        <div className="certificate-page-header">
          <div>
            <button
              type="button"
              onClick={() => navigate("/certificate")}
              className="certificate-back-button"
            >
              <ChevronLeft size={17} />
              Back to Certificate Registry
            </button>

            {/* <span className="certificate-eyebrow">
              Certificate Management
            </span> */}

            <h1>
              {id
                ? "Edit Certificate"
                : "Add Certificate"}
            </h1>

            <p>
              Register and manage certificate information,
              documents, validity and dates.
            </p>
          </div>

          <div className="certificate-status-badge">
            <span className="certificate-status-dot" />
            {id ? "Edit Record" : "New Record"}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="certificate-form-card"
        >
          <div className="certificate-form-grid certificate-single-column">
            <section className="certificate-section">
              <div className="certificate-section-heading">
                <div className="certificate-section-icon">
                  01
                </div>

                <div>
                  <span>Certificate Details</span>
                  <h2>Basic Information</h2>
                </div>
              </div>

              <div className="certificate-fields-grid">
                <div className="certificate-field-full">
                  <label className={labelClass}>
                    Certificate Name
                  </label>

                  <input
                    required
                    type="text"
                    value={formData.certificateName}
                    onChange={(event) =>
                      updateField(
                        "certificateName",
                        event.target.value
                      )
                    }
                    className={inputClass}
                    placeholder="Enter certificate name"
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Certificate Number
                  </label>

                  <input
                    required
                    type="text"
                    value={formData.certificateNumber}
                    onChange={(event) =>
                      updateField(
                        "certificateNumber",
                        event.target.value
                      )
                    }
                    className={inputClass}
                    placeholder="Enter certificate number"
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Certificate Type
                  </label>

                  <select
                    required
                    value={formData.idCertificateType}
                    onChange={(event) =>
                      updateField(
                        "idCertificateType",
                        event.target.value
                      )
                    }
                    className={inputClass}
                  >
                    <option value="">
                      Select certificate type
                    </option>

                    {certificateTypes.map((type) => (
                      <option
                        key={type.idCertificateType}
                        value={type.idCertificateType}
                      >
                        {type.certificateTypeName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            <section className="certificate-section">
              <div className="certificate-section-heading">
                <div className="certificate-section-icon">
                  02
                </div>

                <div>
                  <span>Document Storage</span>
                  <h2>Certificate Attachment</h2>
                </div>
              </div>

              {formData.fileName && (
                <div className="certificate-existing-file">
                  <div>
                    <strong>{formData.fileName}</strong>
                    <small>Existing uploaded document</small>
                  </div>

                  <a
                    href={`https://localhost:7294${formData.filePath}`}
                    target="_blank"
                    rel="noreferrer"
                    className="certificate-outline-button"
                  >
                    View File
                  </a>
                </div>
              )}

              <div
                className="certificate-upload-box"
                onClick={() =>
                  fileInputRef.current?.click()
                }
              >
                <input
                  ref={fileInputRef}
                  hidden
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                />

                {uploading ? (
                  <>
                    <Loader2
                      size={34}
                      className="animate-spin"
                    />
                    <strong>Uploading document...</strong>
                  </>
                ) : (
                  <>
                    <Upload size={34} />
                    <strong>
                      Click to upload certificate
                    </strong>
                    <span>
                      PDF, DOC, DOCX, PNG or JPG
                    </span>
                    <small>
                      Maximum file size: 10 MB
                    </small>
                  </>
                )}
              </div>
            </section>

            <section className="certificate-section">
              <div className="certificate-section-heading">
                <div className="certificate-section-icon">
                  03
                </div>

                <div>
                  <span>Certificate Lifecycle</span>
                  <h2>Validity & Dates</h2>
                </div>
              </div>

              <div className="certificate-fields-grid">
                <div>
                  <label className={labelClass}>
                    Issue Date
                  </label>

                  <input
                    required
                    type="date"
                    value={formData.issueDate}
                    onChange={(event) =>
                      updateField(
                        "issueDate",
                        event.target.value
                      )
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Recertification Period
                  </label>

                  <select
                    required
                    value={formData.validForYears}
                    onChange={(event) => {
                      updateField(
                        "validForYears",
                        event.target.value
                      );

                      setFormData((previous) => ({
                        ...previous,
                        surveillanceAuditYears: "",
                        surveillanceDate: "",
                      }));
                    }}
                    className={inputClass}
                  >
                    <option value="">
                      Select period
                    </option>
                    <option value="1">1 Year</option>
                    <option value="2">2 Years</option>
                    <option value="3">3 Years</option>
                    <option value="5">5 Years</option>
                    <option value="10">10 Years</option>
                    <option value="100">Lifetime</option>
                  </select>
                </div>

                {formData.validForYears !== "100" && (
                  <div>
                    <label className={labelClass}>
                      Expiry Date
                    </label>

                    <input
                      readOnly
                      type="date"
                      value={formData.expiryDate || ""}
                      className={`${inputClass} certificate-readonly`}
                    />
                  </div>
                )}

                {formData.validForYears &&
                  formData.validForYears !== "100" &&
                  Number(formData.validForYears) > 1 && (
                    <div>
                      <label className={labelClass}>
                        Surveillance Audit
                      </label>

                      <select
                        value={
                          formData.surveillanceAuditYears
                        }
                        onChange={(event) =>
                          updateField(
                            "surveillanceAuditYears",
                            event.target.value
                          )
                        }
                        className={inputClass}
                      >
                        <option value="">
                          Select frequency
                        </option>

                        {Array.from(
                          {
                            length:
                              Number(
                                formData.validForYears
                              ) - 1,
                          },
                          (_, index) => index + 1
                        ).map((year) => (
                          <option
                            key={year}
                            value={year}
                          >
                            After {year} Year
                            {year > 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                {formData.validForYears !== "100" &&
                  formData.surveillanceAuditYears && (
                    <div>
                      <label className={labelClass}>
                        Surveillance Date
                      </label>

                      <input
                        type="date"
                        value={
                          formData.surveillanceDate
                        }
                        min={formData.issueDate}
                        max={surveillanceMaxDate}
                        onChange={(event) =>
                          updateField(
                            "surveillanceDate",
                            event.target.value
                          )
                        }
                        className={inputClass}
                      />
                    </div>
                  )}
              </div>
            </section>

            <section className="certificate-section">
              <div className="certificate-section-heading">
                <div className="certificate-section-icon">
                  05
                </div>

                <div>
                  <span>Additional Information</span>
                  <h2>Tags & Notes</h2>
                </div>
              </div>

              <div className="certificate-fields-grid">
                <div className="certificate-field-full">
                  <label className={labelClass}>
                    Tags
                  </label>

                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(event) =>
                      updateField(
                        "tags",
                        event.target.value
                      )
                    }
                    className={inputClass}
                    placeholder="Example: ISO, Safety, Quality"
                  />
                </div>

                <div className="certificate-field-full">
                  <label className={labelClass}>
                    Notes
                  </label>

                  <textarea
                    rows={4}
                    value={formData.notes}
                    onChange={(event) =>
                      updateField(
                        "notes",
                        event.target.value
                      )
                    }
                    className="certificate-textarea"
                    placeholder="Add additional notes..."
                  />
                </div>
              </div>
            </section>
          </div>

          <div className="certificate-form-footer">
            <label className="certificate-active-toggle">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(event) =>
                  updateField(
                    "isActive",
                    event.target.checked
                  )
                }
              />

              <span>
                <strong>Active Certificate</strong>
                <small>
                  This certificate will be included in monitoring.
                </small>
              </span>
            </label>

            <div className="certificate-footer-actions">
              <button
                type="button"
                onClick={() => navigate("/certificate")}
                className="certificate-cancel-button"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving || uploading}
                className="certificate-save-button"
              >
                {saving ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Save size={18} />
                )}

                {id
                  ? "Update Certificate"
                  : "Save Certificate"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificateForm;