import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  Loader2,
  Save,
  Search,
  UserRound,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { userApi } from "../../api/userApi";
import { companyService } from "../../api/companyService";
import { locationService } from "../../api/locationService";
import { designationService } from "../../api/designationService";
import "../../css/UserCss/UserForm.css";

const Field = ({ label, children, className = "" }) => (
  <div className={`user-field ${className}`}>
    <label className="user-field-label">{label}</label>
    {children}
  </div>
);

const Section = ({ eyebrow, title, description, children }) => (
  <section className="user-form-section">
    <div className="user-section-heading">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>

    {children}
  </section>
);

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [designations, setDesignations] = useState([]);

  const [airaEmployees, setAiraEmployees] = useState([]);
  const [airaSearch, setAiraSearch] = useState("");
  const [airaDropdownOpen, setAiraDropdownOpen] =
    useState(false);
  const [airaLoading, setAiraLoading] = useState(false);
  const [selectedAiraEmployee, setSelectedAiraEmployee] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    idUser: 0,
    userFullName: "",
    userName: "",
    email: "",
    phone: "",
    idCompany: "",
    idLocation: "",
    idDesignation: "",
    isActive: true,

    idUserManagement: "",
    airaEmployeeCode: "",
    airaRoleId: "",
    airaRoleName: "",
    airaImageFileURL: "",
  });

  useEffect(() => {
    loadPageData();
  }, [id]);

  const loadPageData = async () => {
    try {
      setLoading(true);

      const [companyResponse, locationResponse, designationResponse] =
        await Promise.all([
          companyService.getAll(),
          locationService.getAll(),
          designationService.getAll(),
        ]);

      if (companyResponse.success) {
        setCompanies(companyResponse.data || []);
      }

      if (locationResponse.success) {
        setLocations(locationResponse.data || []);
      }

      if (designationResponse.success) {
        setDesignations(designationResponse.data || []);
      }

      if (isEditMode) {
        const response = await userApi.getById(id);

        if (!response.success) {
          toast.error(
            response.message ||
              "User details could not be loaded."
          );
          return;
        }

        const data = response.data;

        setFormData({
          idUser: data.idUser || 0,
          userFullName: data.userFullName || "",
          userName: data.userName || "",
          email: data.email || "",
          phone: data.phone || "",
          idCompany: data.idCompany || "",
          idLocation: data.idLocation || "",
          idDesignation: data.idDesignation || "",
          isActive: data.isActive ?? true,

          idUserManagement: data.idUserManagement || "",
          airaEmployeeCode: data.airaEmployeeCode || "",
          airaRoleId: data.airaRoleId || "",
          airaRoleName: data.airaRoleName || "",
          airaImageFileURL: data.airaImageFileURL || "",
        });

        setLoading(false);
        return;
      }

      setLoading(false);
      loadAiraEmployees();
    } catch (error) {
      console.error("USER FORM LOAD ERROR:", error);
      toast.error("Unable to load user form.");
      setLoading(false);
    }
  };

  const loadAiraEmployees = async () => {
    try {
      setAiraLoading(true);

      const response = await userApi.getAiraEmployees();

      if (response.success) {
        setAiraEmployees(response.data || []);
      } else {
        toast.error(
          response.message ||
            "Aira employees could not be loaded."
        );
      }
    } catch (error) {
      console.error("AIRA EMPLOYEE ERROR:", error);

      toast.error(
        "Aira employees could not be loaded. Please refresh."
      );
    } finally {
      setAiraLoading(false);
    }
  };

  const filteredAiraEmployees = useMemo(() => {
    const search = airaSearch.toLowerCase().trim();

    const result = !search
      ? airaEmployees
      : airaEmployees.filter((employee) => {
          const code = String(
            employee.employeeCode || ""
          ).toLowerCase();

          const name = String(
            employee.name || ""
          ).toLowerCase();

          return (
            code.includes(search) ||
            name.includes(search)
          );
        });

    return result.slice(0, 50);
  }, [airaEmployees, airaSearch]);

  const handleSearchChange = (event) => {
    setAiraSearch(event.target.value);
    setAiraDropdownOpen(true);

    if (selectedAiraEmployee) {
      setSelectedAiraEmployee(null);

      setFormData((current) => ({
        ...current,
        idUserManagement: "",
        userFullName: "",
        userName: "",
        phone: "",
        airaEmployeeCode: "",
        airaRoleId: "",
        airaRoleName: "",
        airaImageFileURL: "",
      }));
    }
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedAiraEmployee(employee);
    setAiraDropdownOpen(false);

    setAiraSearch(
      `${employee.employeeCode} — ${employee.name}`
    );

    setFormData((current) => ({
      ...current,
      idUserManagement: employee.idUser,
      userFullName: employee.name || "",
      userName: String(employee.employeeCode || ""),
      phone: employee.contactNo || "",
      airaEmployeeCode: String(
        employee.employeeCode || ""
      ),
      airaRoleId: employee.idRole || "",
      airaRoleName: employee.umRoleName || "",
      airaImageFileURL: employee.imageFileURL || "",
    }));
  };

  const updateField = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isEditMode && !formData.idUserManagement) {
      toast.error("Please select an Aira employee.");
      return;
    }

    if (!formData.idDesignation) {
      toast.error("Please select a designation.");
      return;
    }

    if (!formData.idCompany) {
      toast.error("Please select a company.");
      return;
    }

    if (!formData.idLocation) {
      toast.error("Please select a location.");
      return;
    }

    try {
      setSaving(true);

      let response;

      if (!isEditMode) {
        response = await userApi.saveFromAira({
          idUserManagement: Number(
            formData.idUserManagement
          ),
          idDesignation: Number(
            formData.idDesignation
          ),
          idCompany: Number(formData.idCompany),
          idLocation: Number(formData.idLocation),
          email: formData.email || null,
        });
      } else {
        response = await userApi.save({
          ...formData,
          idUser: Number(formData.idUser),
          idDesignation: formData.idDesignation
            ? Number(formData.idDesignation)
            : null,
          idCompany: formData.idCompany
            ? Number(formData.idCompany)
            : null,
          idLocation: formData.idLocation
            ? Number(formData.idLocation)
            : null,
        });
      }

      if (
        response?.success === true ||
        response?.result === 1 ||
        response?.result === "1"
      ) {
        toast.success(
          response.message || "User saved successfully."
        );

        navigate("/users");
      } else {
        toast.error(
          response?.message || "User could not be saved."
        );
      }
    } catch (error) {
      console.error("USER SAVE ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Operation failed."
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredLocations = locations.filter(
    (location) =>
      String(location.idCompany) ===
      String(formData.idCompany)
  );

  if (loading) {
    return (
      <div className="user-form-loader">
        <Loader2 size={38} className="animate-spin" />
        <span>Loading user form...</span>
      </div>
    );
  }

  return (
    <div className="user-form-page">
      <div className="user-form-container">
        <div className="user-form-top">
          <div>
            <button
              type="button"
              className="user-back-button"
              onClick={() => navigate("/users")}
            >
              <ChevronLeft size={18} />
              Back to User Management
            </button>

            <div className="user-page-eyebrow">
              User Master
            </div>

            <h1 className="user-page-title">
              {isEditMode ? "Modify User" : "Add New User"}
            </h1>

            <p className="user-page-description">
              {isEditMode
                ? "Update user organization and access information."
                : "Select an Aira employee and assign QMS access."}
            </p>
          </div>

          <div className="user-page-badge">
            <UserRound size={17} />
            QMS User Management
          </div>
        </div>

        <form
          className="user-form-card"
          onSubmit={handleSubmit}
        >
          {!isEditMode && (
            <Section
              eyebrow="Aira User Management"
              title="Select Employee"
              description="Search by employee name or employee code."
            >
              <div className="user-dropdown">
                <Search
                  size={18}
                  className="user-search-icon"
                />

                <input
                  required
                  type="text"
                  value={airaSearch}
                  onChange={handleSearchChange}
                  onFocus={() =>
                    setAiraDropdownOpen(true)
                  }
                  onBlur={() =>
                    setTimeout(
                      () => setAiraDropdownOpen(false),
                      200
                    )
                  }
                  autoComplete="off"
                  className="user-input user-search-input"
                  placeholder={
                    airaLoading
                      ? "Loading Aira employees..."
                      : "Search employee name or code..."
                  }
                />

                {airaDropdownOpen && (
                  <div className="user-dropdown-menu">
                    {airaLoading ? (
                      <div className="user-dropdown-empty">
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                        Loading employees...
                      </div>
                    ) : filteredAiraEmployees.length === 0 ? (
                      <div className="user-dropdown-empty">
                        No employee found.
                      </div>
                    ) : (
                      filteredAiraEmployees.map((employee) => (
                        <button
                          key={employee.idUser}
                          type="button"
                          className="user-dropdown-item"
                          onMouseDown={() =>
                            handleEmployeeSelect(
                              employee
                            )
                          }
                        >
                          <span className="user-avatar-small">
                            <UserRound size={16} />
                          </span>

                          <span className="user-dropdown-details">
                            <strong>{employee.name}</strong>
                            <small>
                              Employee Code:{" "}
                              {employee.employeeCode}
                            </small>
                          </span>

                          <span className="user-role-pill">
                            {employee.umRoleName ||
                              "Aira User"}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {selectedAiraEmployee && (
                <div className="aira-summary">
                  <div>
                    <span>Employee Code</span>
                    <strong>
                      {selectedAiraEmployee.employeeCode}
                    </strong>
                  </div>

                  <div>
                    <span>Aira Role</span>
                    <strong>
                      {selectedAiraEmployee.umRoleName ||
                        "N/A"}
                    </strong>
                  </div>

                  <div>
                    <span>Registered Mobile</span>
                    <strong>
                      {selectedAiraEmployee.contactNo ||
                        "N/A"}
                    </strong>
                  </div>
                </div>
              )}
            </Section>
          )}

          <Section
            eyebrow="Employee Details"
            title="Employee Information"
            description="Employee identity details are received from Aira."
          >
            <div className="user-fields-grid">
              <Field label="Full Name">
                <input
                  required
                  value={formData.userFullName}
                  readOnly={!isEditMode}
                  onChange={(event) =>
                    updateField(
                      "userFullName",
                      event.target.value
                    )
                  }
                  className="user-input"
                  placeholder="Employee full name"
                />
              </Field>

              <Field label="Employee Code">
                <input
                  required
                  value={formData.userName}
                  readOnly={!isEditMode}
                  onChange={(event) =>
                    updateField(
                      "userName",
                      event.target.value
                    )
                  }
                  className="user-input"
                  placeholder="Employee code"
                />
              </Field>

              <Field label="Registered Mobile">
                <input
                  value={formData.phone}
                  readOnly={!isEditMode}
                  onChange={(event) =>
                    updateField(
                      "phone",
                      event.target.value
                    )
                  }
                  className="user-input"
                  placeholder="Registered mobile number"
                />
              </Field>

              <Field label="Email Address">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    updateField(
                      "email",
                      event.target.value
                    )
                  }
                  className="user-input"
                  placeholder="employee@example.com"
                />
              </Field>

              {formData.airaRoleName && (
                <Field label="Aira Role">
                  <input
                    value={formData.airaRoleName}
                    readOnly
                    className="user-input user-readonly"
                  />
                </Field>
              )}

              {formData.airaEmployeeCode && (
                <Field label="Aira Employee Code">
                  <input
                    value={formData.airaEmployeeCode}
                    readOnly
                    className="user-input user-readonly"
                  />
                </Field>
              )}
            </div>
          </Section>

          <Section
            eyebrow="QMS Access"
            title="Organization Assignment"
            description="These values are controlled by the QMS administrator."
          >
            <div className="user-fields-grid user-fields-three">
              <Field label="Designation">
                <select
                  required
                  value={formData.idDesignation}
                  onChange={(event) =>
                    updateField(
                      "idDesignation",
                      event.target.value
                    )
                  }
                  className="user-input"
                >
                  <option value="">
                    Select Designation
                  </option>

                  {designations.map((item) => (
                    <option
                      key={item.idDesignation}
                      value={item.idDesignation}
                    >
                      {item.designationName}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Company">
                <select
                  required
                  value={formData.idCompany}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      idCompany: event.target.value,
                      idLocation: "",
                    }))
                  }
                  className="user-input"
                >
                  <option value="">
                    Select Company
                  </option>

                  {companies.map((item) => (
                    <option
                      key={item.idCompany}
                      value={item.idCompany}
                    >
                      {item.companyName}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Location">
                <select
                  required
                  disabled={!formData.idCompany}
                  value={formData.idLocation}
                  onChange={(event) =>
                    updateField(
                      "idLocation",
                      event.target.value
                    )
                  }
                  className="user-input"
                >
                  <option value="">
                    Select Location
                  </option>

                  {filteredLocations.map((item) => (
                    <option
                      key={item.idLocation}
                      value={item.idLocation}
                    >
                      {item.locationName}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <label className="user-active-box">
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
                <strong>User is active</strong>
                <small>
                  Inactive users cannot access QMS.
                </small>
              </span>
            </label>
          </Section>

          <div className="user-form-actions">
            <button
              type="button"
              className="user-cancel-button"
              onClick={() => navigate("/users")}
            >
              <XCircle size={17} />
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || airaLoading}
              className="user-save-button"
            >
              {saving ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Save size={17} />
              )}

              {isEditMode ? "Update User" : "Save User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;