import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ChevronLeft, Loader2, XCircle } from "lucide-react";
import { userApi } from "../../api/userApi";
// import { departmentService } from "../../api/departmentService";
import { companyService } from "../../api/companyService"; // 👈 Add this
import { locationService } from "../../api/locationService";
import { designationService } from "../../api/designationService";
import { toast } from "react-hot-toast";

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // const [departments, setDepartments] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [designations, setDesignations] = useState([]);

  const [formData, setFormData] = useState({
    idUser: 0,
    userFullName: "",
    userName: "",
    password: "", // 🟢 Changed from userPassword
    email: "",
    phone: "",
    // idDepartment: "",
    idCompany: "",      // 👈 Added Company
    idLocation: "",     // 👈 Added Location
    idDesignation: "",
    isActive: true,
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [compRes, locRes, desigRes] = await Promise.all([
        companyService.getAll(),
        locationService.getAll(),
        // departmentService.getAll(),
        designationService.getAll(),
      ]);
      if (compRes.success) setCompanies(compRes.data);
      if (locRes.success) setLocations(locRes.data);

      // if (deptRes.success) setDepartments(deptRes.data);
      if (desigRes.success) setDesignations(desigRes.data);

      if (id) {
        const response = await userApi.getById(id);
        if (response.success) {
          const data = response.data;
          setFormData({
            idUser: data.idUser || 0,
            userFullName: data.userFullName || "",
            userName: data.userName || "",
            password: data.password || "", // 🟢 Map password so it's visible
            email: data.email || "", // 🟢 Map email
            phone: data.phone || "", // 🟢 Map phone
            // idDepartment: data.idDepartment || "",
            idCompany: data.idCompany || "",      // 👈 Added Company
            idLocation: data.idLocation || "",    // 👈
            idDesignation: data.idDesignation || "",
            isActive: data.isActive ?? true,
          });
        }
      }
    } catch (error) {
      toast.error("Error loading master data");
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setSaving(true);
  //   try {
  //     const response = await userApi.save(formData);

  //     // 🟢 Fix: Check for both 'success' OR 'result' to be safe
  //     if (response.success || response.result == 1||   response.result === "1") {
  //       toast.success(response.message);
  //       navigate("/users");
  //     } else {
  //       toast.error(response.message || "Failed to update user");
  //     }
  //   } catch (error) {
  //     toast.error("Operation failed");
  //   } finally {
  //     setSaving(false);
  //   }
  // };
  const handleSubmit = async (e) => {

    e.preventDefault();

    setSaving(true);

    try {

      const response =
        await userApi.save(formData);

      console.log(
        "SAVE RESPONSE",
        response
      );

      if (
        response.success === true ||
        response.result === 1 ||
        response.result === "1"
      ) {

        toast.success(
          response.message || "Saved Successfully"
        );

        navigate("/users");

      }
      else {

        toast.error(
          response.message || "Failed to save user"
        );

      }

    }
    catch (error) {

      console.error(
        "SAVE ERROR",
        error
      );

      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Operation failed"
      );

    }
    finally {

      setSaving(false);

    }

  };
  const inputClass =
    "w-full bg-background border-2 border-border/60 rounded-xl px-4 py-3.5 text-sm font-bold text-foreground focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all shadow-sm";

  if (loading)
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={48} />
      </div>
    );

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-10 duration-700">
      <button
        onClick={() => navigate("/users")}
        className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground hover:text-gold tracking-widest"
      >
        <ChevronLeft size={16} /> Back to registry
      </button>

      <h1 className="text-4xl font-black tracking-tight  ">
        {id ? "Modify User" : "Add New User"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-card border-2 border-border shadow-2xl p-8 md:p-12 rounded-[2.5rem] space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[14px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-1">
              Full Identity Name
            </label>
            <input
              required
              type="text"
              value={formData.userFullName}
              onChange={(e) =>
                setFormData({ ...formData, userFullName: e.target.value })
              }
              className={inputClass}
              placeholder="e.g. John Doe"
            />
          </div>
          {/* Email Identity */}
          <div className="space-y-2">
            <label className="text-[14px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-1">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={inputClass}
              placeholder="example@mail.com"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="text-[14px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-1">
              Phone Number
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className={inputClass}
              placeholder="98765 43210"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[14px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-1">
              Access ID (Username)
            </label>
            <input
              required
              type="text"
              value={formData.userName}
              onChange={(e) =>
                setFormData({ ...formData, userName: e.target.value })
              }
              className={inputClass}
              placeholder="username123"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[14px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-1">
              Secure Passkey
            </label>
            <input
              required={!id}
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className={inputClass}
              placeholder={
                id ? "•••••••• (Leave blank to keep current)" : "••••••••"
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-[14px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-1">
              Role (Designation)
            </label>
            <select
              required
              value={formData.idDesignation}
              onChange={(e) =>
                setFormData({ ...formData, idDesignation: e.target.value })
              }
              className={inputClass}
            >
              <option value="">-- Select Designation --</option>
              {designations.map((d) => (
                <option key={d.idDesignation} value={d.idDesignation}>
                  {d.designationName}
                </option>
              ))}
            </select>
          </div>
          {/* <div className="space-y-2">
            <label className="text-[14px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-1">
              Sector (Department)
            </label>

            <select
              required
              value={formData.idDepartment}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  idDepartment: e.target.value,
                })
              }
              className={inputClass}
            >
              <option value="">-- Select Department --</option>

              {Object.entries(
                departments.reduce((acc, dept) => {
                  const company = dept.companyName || "Unknown Company";

                  if (!acc[company]) {
                    acc[company] = [];
                  }

                  acc[company].push(dept);

                  return acc;
                }, {}),
              ).map(([company, depts]) => (
                <optgroup key={company} label={company}>
                  {depts.map((d) => (
                    <option key={d.idDepartment} value={d.idDepartment}>
                      {d.locationName} → {d.departmentName}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div> */}
          {/* Company */}
          <div className="space-y-2">
            <label className="text-[14px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-1">
              Company
            </label>
            <select
              required
              value={formData.idCompany}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  idCompany: e.target.value,
                  idLocation: "" // 👈 Reset location when company changes
                })
              }
              className={inputClass}
            >
              <option value="">-- Select Company --</option>
              {companies.map((c) => (
                <option key={c.idCompany} value={c.idCompany}>
                  {c.companyName}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-[14px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-1">
              Location
            </label>
            <select
              required
              value={formData.idLocation}
              onChange={(e) =>
                setFormData({ ...formData, idLocation: e.target.value })
              }
              className={inputClass}
              disabled={!formData.idCompany} // Disable if no company selected
            >
              <option value="">-- Select Location --</option>
              {locations
                .filter((l) => l.idCompany == formData.idCompany) // 👈 Filter locations based on selected company
                .map((l) => (
                  <option key={l.idLocation} value={l.idLocation}>
                    {l.locationName}
                  </option>
                ))}
            </select>
          </div>




          <div className="flex items-center gap-3 pt-8">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="accent-gold w-6 h-6 rounded cursor-pointer"
              />
              <span className="text-[14px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
                Authorization Active
              </span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-6 border-t border-border mt-4">
          {/* 🔴 Abort Button Added Back */}
          <button
            type="button"
            onClick={() => navigate("/users")}
            className="px-8 py-4 bg-muted text-foreground border-2 border-border rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all flex items-center gap-2"
          >
            <XCircle size={18} /> Cancel
          </button>

          <button
            disabled={saving}
            className="px-10 py-4 bg-gold hover:bg-gold-hover text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-gold/20 hover:scale-105 transition-all flex items-center gap-3 active:scale-95"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} strokeWidth={3} />
            )}
            {id ? "Commit Changes" : "Save User "}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
