


// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Building2,
//   CheckCircle2,
//   RefreshCw,
//   Search,
// } from "lucide-react";
// import { toast } from "react-hot-toast";

// import { airaCompanyService } from "../../api/airaCompanyService";
// import { companyService } from "../../api/companyService";
// import { usePagination } from "../../components/usePagination";
// import Pagination from "../../components/Pagination";
// import { usePermissions } from "../../hooks/usePermissions";
// const CompanyList = () => {
//   const [airaCompanies, setAiraCompanies] = useState([]);
//   const [qmsCompanies, setQmsCompanies] = useState([]);

//   const [selectedCompanyId, setSelectedCompanyId] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");

//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [saving, setSaving] = useState(false);

//   const loadAiraCompanies = async () => {
//     const response =
//       await airaCompanyService.getFromAira();

//     if (!response?.success) {
//       throw new Error(
//         response?.message ||
//           "Unable to load companies from Aira."
//       );
//     }

//     setAiraCompanies(response.data || []);
//   };



//   const {
//   canCreate,
//   canEdit,
//   loading: permissionLoading,
// } = usePermissions("COMPANY");

//   const loadQmsCompanies = async () => {
//     const response =
//       await companyService.getAll();

//     if (!response?.success) {
//       throw new Error(
//         response?.message ||
//           "Unable to load QMS companies."
//       );
//     }

//     setQmsCompanies(response.data || []);
//   };

//   const loadPageData = async () => {
//     try {
//       setLoading(true);

//       await Promise.all([
//         loadAiraCompanies(),
//         loadQmsCompanies(),
//       ]);
//     } catch (error) {
//       toast.error(
//         error.message ||
//           "Unable to load company data."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadPageData();
//   }, []);

//   const handleRefreshAiraCompanies = async () => {
//     try {
//       setRefreshing(true);
//       await loadAiraCompanies();

//       toast.success(
//         "Aira companies refreshed successfully."
//       );
//     } catch (error) {
//       toast.error(
//         error.message ||
//           "Unable to refresh Aira companies."
//       );
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   const handleSyncSelectedCompany = async () => {

//     if (!canCreate) {
//     toast.error(
//       "You do not have permission to add a company."
//     );
//     return;
//   }

//   if (!selectedCompanyId) {
//     toast.error("Please select a company first.");
//     return;
//   }

//     if (!selectedCompanyId) {
//       toast.error("Please select a company first.");
//       return;
//     }

//     try {
//       setSaving(true);

//       const response =
//         await airaCompanyService.syncSelectedCompany(
//           selectedCompanyId
//         );

//       if (!response?.success) {
//         toast.error(
//           response?.message ||
//             "Unable to save selected company."
//         );
//         return;
//       }

//       await loadQmsCompanies();

//       setSelectedCompanyId("");

//       window.dispatchEvent(
//         new Event("companyChanged")
//       );

//       toast.success(
//         "Selected company saved in QMS successfully."
//       );
//     } catch (error) {
//       toast.error(
//         error.message ||
//           "Unable to save selected company."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   const filteredCompanies = useMemo(() => {
//     const search = searchTerm.trim().toLowerCase();

//     if (!search) {
//       return qmsCompanies;
//     }

//     return qmsCompanies.filter((company) => {
//       return [
//         company.companyName,
//         company.address,
//         company.contactNo,
//         company.panNo,
//         company.gstNo,
//       ]
//         .filter(Boolean)
//         .some((value) =>
//           String(value)
//             .toLowerCase()
//             .includes(search)
//         );
//     });
//   }, [qmsCompanies, searchTerm]);

//   const {
//     currentItems,
//     paginationProps,
//   } = usePagination(filteredCompanies, 10);

//   return (
//     <div className="space-y-6 p-6">
//       {/* Page heading */}
//       <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
//         <div>
//           <div className="mb-2 flex items-center gap-3">
//             <Building2
//               size={30}
//               className="text-gold"
//             />

//             <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gold">
//               Company Configuration
//             </span>
//           </div>

//           <h1 className="text-3xl font-black text-foreground">
//             Company Master
//           </h1>

//           <p className="mt-2 text-sm font-medium text-muted-foreground">
//             Select a company from Aira and save it into QMS.
//           </p>
//         </div>

//         {/* <button
//           type="button"
//           onClick={handleRefreshAiraCompanies}
//           disabled={refreshing}
//           className="gold-button inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl px-5 text-sm font-black disabled:cursor-not-allowed disabled:opacity-60"
//         >
//           <RefreshCw
//             size={17}
//             className={
//               refreshing ? "animate-spin" : ""
//             }
//           />

//           {refreshing
//             ? "Refreshing..."
//             : "Refresh Aira Companies"}
//         </button> */}

//         {canCreate && (
//   <button
//     type="button"
//     onClick={handleSyncSelectedCompany}
//     disabled={
//       !selectedCompanyId ||
//       saving ||
//       permissionLoading
//     }
//     className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
//   >
//     <CheckCircle2 size={17} />

//     {saving
//       ? "Saving..."
//       : "Sync Selected Company"}
//   </button>
// )}
//       </div>

//       {/* Aira selection section */}
//       <div className="rounded-3xl border border-border bg-card p-6 shadow-xl">
//         <p className="text-[11px] font-black uppercase tracking-[0.18em] text-gold">
//           Aira Master Data
//         </p>

//         <h2 className="mt-2 text-xl font-black text-foreground">
//           Select Company From Aira
//         </h2>

//         <p className="mt-1 text-sm font-medium text-muted-foreground">
//           This dropdown contains live companies received from Aira.
//         </p>

//         <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center">
//           <select
//             value={selectedCompanyId}
//             onChange={(event) =>
//               setSelectedCompanyId(event.target.value)
//             }
//             disabled={
//               loading ||
//               saving ||
//               airaCompanies.length === 0
//             }
//             className="input-ui min-h-[46px] w-full text-sm font-bold lg:max-w-3xl"
//           >
//             <option value="">
//               {loading
//                 ? "Loading companies from Aira..."
//                 : airaCompanies.length === 0
//                 ? "No companies found in Aira"
//                 : "Select company"}
//             </option>

//             {airaCompanies.map((company) => (
//               <option
//                 key={company.idCompany}
//                 value={company.idCompany}
//               >
//                 {company.companyName}
//                 {company.companyCode
//                   ? ` (${company.companyCode})`
//                   : ""}
//               </option>
//             ))}
//           </select>

//           <button
//             type="button"
//             onClick={handleSyncSelectedCompany}
//             disabled={!selectedCompanyId || saving}
//             className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             <CheckCircle2 size={17} />

//             {saving
//               ? "Saving..."
//               : "Sync Selected Company"}
//           </button>
//         </div>
//       </div>

//       {/* QMS saved companies section */}
//       <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
//         <div className="flex flex-col gap-4 border-b border-border px-6 py-5 md:flex-row md:items-center md:justify-between">
//           <div>
//             <p className="text-[11px] font-black uppercase tracking-[0.18em] text-gold">
//               QMS Saved Data
//             </p>

//             <h2 className="mt-1 text-xl font-black text-foreground">
//               Saved Company Directory
//             </h2>

//             <p className="mt-1 text-sm font-medium text-muted-foreground">
//               Only companies saved into QMS are shown here.
//             </p>
//           </div>

//           <div className="relative w-full md:w-80">
//             <Search
//               size={17}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
//             />

//             <input
//               type="search"
//               value={searchTerm}
//               onChange={(event) =>
//                 setSearchTerm(event.target.value)
//               }
//               placeholder="Search saved company..."
//               className="input-ui w-full pl-10"
//             />
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[1250px] border-collapse text-left">
//             <thead className="border-b border-border bg-muted/70">
//               <tr className="text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">
//                 <th className="px-6 py-5">#</th>
//                 <th className="px-6 py-5">Company Name</th>
//                 <th className="px-6 py-5">Address</th>
//                 <th className="px-6 py-5">Contact No</th>
//                 <th className="px-6 py-5">PAN No</th>
//                 <th className="px-6 py-5">GST No</th>
//                 <th className="px-6 py-5 text-center">
//                   Status
//                 </th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-border">
//               {loading ? (
//                 <tr>
//                   <td
//                     colSpan="7"
//                     className="py-16 text-center text-sm font-bold text-muted-foreground"
//                   >
//                     Loading saved QMS companies...
//                   </td>
//                 </tr>
//               ) : currentItems.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan="7"
//                     className="py-16 text-center text-sm font-bold text-muted-foreground"
//                   >
//                     No company has been saved into QMS yet.
//                   </td>
//                 </tr>
//               ) : (
//                 currentItems.map((company, index) => (
//                   <tr
//                     key={company.idCompany}
//                     className="transition-colors hover:bg-gold/[0.04]"
//                   >
//                     <td className="px-6 py-5 text-sm font-black text-muted-foreground">
//                       {index + 1}
//                     </td>

//                     <td className="px-6 py-5 text-sm font-black text-foreground">
//                       {company.companyName || "—"}
//                     </td>

//                     <td className="max-w-[320px] truncate px-6 py-5 text-sm font-medium text-foreground">
//                       {company.address || "—"}
//                     </td>

//                     <td className="px-6 py-5 text-sm font-bold text-foreground">
//                       {company.contactNo || "—"}
//                     </td>

//                     <td className="px-6 py-5 text-sm font-black uppercase text-foreground">
//                       {company.panNo || "—"}
//                     </td>

//                     <td className="px-6 py-5 text-sm font-black uppercase text-foreground">
//                       {company.gstNo || "—"}
//                     </td>

//                     <td className="px-6 py-5 text-center">
//                       <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-black text-emerald-600">
//                         <CheckCircle2 size={14} />
//                         Saved in QMS
//                       </span>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {!loading && filteredCompanies.length > 0 && (
//           <Pagination {...paginationProps} />
//         )}
//       </div>
//     </div>
//   );
// };

// export default CompanyList;





import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Building2,
  CheckCircle2,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";

import { toast } from "react-hot-toast";

import { airaCompanyService } from "../../api/airaCompanyService";
import { companyService } from "../../api/companyService";
import { usePermissions } from "../../hooks/usePermissions";
import { usePagination } from "../../components/usePagination";
import Pagination from "../../components/Pagination";

const CompanyList = () => {
  const {
    canCreate,
    canEdit,
    loading: permissionLoading,
  } = usePermissions("COMPANY");

  const [airaCompanies, setAiraCompanies] = useState([]);
  const [qmsCompanies, setQmsCompanies] = useState([]);

  const [selectedCompanyId, setSelectedCompanyId] =
    useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [deletingCompanyId, setDeletingCompanyId] =
    useState(null);

  const loadAiraCompanies = async () => {
    const response =
      await airaCompanyService.getFromAira();

    if (!response?.success) {
      throw new Error(
        response?.message ||
          "Unable to load companies from Aira."
      );
    }

    setAiraCompanies(response.data || []);
  };

  const loadQmsCompanies = async () => {
    const response = await companyService.getAll();

    if (!response?.success) {
      throw new Error(
        response?.message ||
          "Unable to load saved QMS companies."
      );
    }

    setQmsCompanies(response.data || []);
  };

  const loadPageData = async () => {
    try {
      setLoading(true);

      await Promise.all([
        loadAiraCompanies(),
        loadQmsCompanies(),
      ]);
    } catch (error) {
      toast.error(
        error?.message ||
          "Unable to load company data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();
  }, []);

  const handleRefreshAiraCompanies = async () => {
    try {
      setRefreshing(true);

      await loadAiraCompanies();

      toast.success(
        "Aira companies refreshed successfully."
      );
    } catch (error) {
      toast.error(
        error?.message ||
          "Unable to refresh Aira companies."
      );
    } finally {
      setRefreshing(false);
    }
  };

  const handleSyncSelectedCompany = async () => {
    if (!canCreate) {
      toast.error(
        "You do not have permission to add a company."
      );
      return;
    }

    if (!selectedCompanyId) {
      toast.error("Please select a company first.");
      return;
    }

    try {
      setSaving(true);

      const response =
        await airaCompanyService.syncSelectedCompany(
          selectedCompanyId
        );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Unable to save the selected company."
        );
      }

      await loadQmsCompanies();

      setSelectedCompanyId("");

      window.dispatchEvent(
        new Event("companyChanged")
      );

      toast.success(
        "Selected company saved in QMS successfully."
      );
    } catch (error) {
      toast.error(
        error?.message ||
          "Unable to save selected company."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveCompany = async (idCompany) => {
    if (!canEdit) {
      toast.error(
        "You do not have permission to remove a company."
      );
      return;
    }

    if (!idCompany) {
      toast.error("Invalid company ID.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to remove this company from QMS?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingCompanyId(idCompany);

      const response =
        await companyService.delete(idCompany);

      const succeeded =
        response?.success === true ||
        response?.isSuccess === true ||
        Number(response?.result) > 0;

      if (!succeeded) {
        throw new Error(
          response?.message ||
            "Unable to remove the company."
        );
      }

      await loadQmsCompanies();

      window.dispatchEvent(
        new Event("companyChanged")
      );

      toast.success(
        response?.message ||
          "Company removed successfully."
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to remove the company."
      );
    } finally {
      setDeletingCompanyId(null);
    }
  };

  const filteredCompanies = useMemo(() => {
    const search = searchTerm
      .trim()
      .toLowerCase();

    if (!search) {
      return qmsCompanies;
    }

    return qmsCompanies.filter((company) => {
      const searchableValues = [
        company.companyName,
        company.address,
        company.contactNo,
        company.panNo,
        company.gstNo,
      ];

      return searchableValues
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(search)
        );
    });
  }, [qmsCompanies, searchTerm]);

  const {
    currentItems,
    paginationProps,
  } = usePagination(filteredCompanies, 10);

  return (
    <div className="space-y-6 p-6">
      {/* Page heading */}
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <Building2
              size={30}
              className="text-gold"
            />

            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gold">
              Company Configuration
            </span>
          </div>

          <h1 className="text-3xl font-black text-foreground">
            Company Master
          </h1>

          <p className="mt-2 text-sm font-medium text-muted-foreground">
            Select a company from Aira and save it
            into QMS.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefreshAiraCompanies}
          disabled={refreshing || loading}
          className="gold-button inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl px-5 text-sm font-black disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={
              refreshing ? "animate-spin" : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh Aira Companies"}
        </button>
      </div>

      {/* Aira company selection */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-xl">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-gold">
          Aira Master Data
        </p>

        <h2 className="mt-2 text-xl font-black text-foreground">
          Select Company From Aira
        </h2>

        <p className="mt-1 text-sm font-medium text-muted-foreground">
          This dropdown contains live companies
          received from Aira.
        </p>

        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center">
          <select
            value={selectedCompanyId}
            onChange={(event) =>
              setSelectedCompanyId(
                event.target.value
              )
            }
            disabled={
              loading ||
              saving ||
              permissionLoading ||
              !canCreate ||
              airaCompanies.length === 0
            }
            className="input-ui min-h-[46px] w-full text-sm font-bold lg:max-w-3xl"
          >
            <option value="">
              {loading
                ? "Loading companies from Aira..."
                : airaCompanies.length === 0
                ? "No companies found in Aira"
                : !canCreate
                ? "You do not have Create permission"
                : "Select company"}
            </option>

            {airaCompanies.map((company) => (
              <option
                key={company.idCompany}
                value={company.idCompany}
              >
                {company.companyName}

                {company.companyCode
                  ? ` (${company.companyCode})`
                  : ""}
              </option>
            ))}
          </select>

          {canCreate && (
            <button
              type="button"
              onClick={
                handleSyncSelectedCompany
              }
              disabled={
                !selectedCompanyId ||
                saving ||
                permissionLoading
              }
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCircle2 size={17} />

              {saving
                ? "Saving..."
                : "Sync Selected Company"}
            </button>
          )}
        </div>
      </div>

      {/* Saved companies */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
        <div className="flex flex-col gap-4 border-b border-border px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-gold">
              QMS Saved Data
            </p>

            <h2 className="mt-1 text-xl font-black text-foreground">
              Saved Company Directory
            </h2>

            <p className="mt-1 text-sm font-medium text-muted-foreground">
              Only companies saved into QMS are
              shown here.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              placeholder="Search saved company..."
              className="input-ui w-full pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1350px] border-collapse text-left">
            <thead className="border-b border-border bg-muted/70">
              <tr className="text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                <th className="px-6 py-5">
                  #
                </th>

                <th className="px-6 py-5">
                  Company Name
                </th>

                <th className="px-6 py-5">
                  Address
                </th>

                <th className="px-6 py-5">
                  Contact No
                </th>

                <th className="px-6 py-5">
                  PAN No
                </th>

                <th className="px-6 py-5">
                  GST No
                </th>

                <th className="px-6 py-5 text-center">
                  Status
                </th>

                <th className="px-6 py-5 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="py-16 text-center text-sm font-bold text-muted-foreground"
                  >
                    Loading saved QMS companies...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="py-16 text-center text-sm font-bold text-muted-foreground"
                  >
                    No company has been saved into
                    QMS yet.
                  </td>
                </tr>
              ) : (
                currentItems.map(
                  (company, index) => {
                    const idCompany =
                      company.idCompany ??
                      company.IDCompany;

                    const isDeleting =
                      deletingCompanyId ===
                      idCompany;

                    return (
                      <tr
                        key={idCompany}
                        className="transition-colors hover:bg-gold/[0.04]"
                      >
                        <td className="px-6 py-5 text-sm font-black text-muted-foreground">
                          {index + 1}
                        </td>

                        <td className="px-6 py-5 text-sm font-black text-foreground">
                          {company.companyName ||
                            "—"}
                        </td>

                        <td className="max-w-[320px] truncate px-6 py-5 text-sm font-medium text-foreground">
                          {company.address ||
                            "—"}
                        </td>

                        <td className="px-6 py-5 text-sm font-bold text-foreground">
                          {company.contactNo ||
                            "—"}
                        </td>

                        <td className="px-6 py-5 text-sm font-black uppercase text-foreground">
                          {company.panNo ||
                            "—"}
                        </td>

                        <td className="px-6 py-5 text-sm font-black uppercase text-foreground">
                          {company.gstNo ||
                            "—"}
                        </td>

                        <td className="px-6 py-5 text-center">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-black text-emerald-600">
                            <CheckCircle2
                              size={14}
                            />

                            Saved in QMS
                          </span>
                        </td>

                        <td className="px-6 py-5 text-center">
                          {canEdit ? (
                            <button
                              type="button"
                              title="Remove company"
                              aria-label={`Remove ${company.companyName}`}
                              onClick={() =>
                                handleRemoveCompany(
                                  idCompany
                                )
                              }
                              disabled={
                                isDeleting
                              }
                              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-300 bg-red-50 text-red-600 transition hover:border-red-500 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                            >
                              {isDeleting ? (
                                <RefreshCw
                                  size={17}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2
                                  size={17}
                                />
                              )}
                            </button>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  }
                )
              )}
            </tbody>
          </table>
        </div>

        {!loading &&
          filteredCompanies.length > 0 && (
            <Pagination
              {...paginationProps}
            />
          )}
      </div>
    </div>
  );
};

export default CompanyList;