import React, { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    CheckCircle2,
    Clock3,
    RefreshCw,
    Upload,
    Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { userApi } from "../../api/userApi";
import { getAiraImageUrl } from "../../utils/airaImage";
const UserImport = () => {
    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const loadEmployees = async () => {
        try {
            setLoading(true);

            const response = await userApi.getAiraEmployees();

            if (!response?.success) {
                toast.error(
                    response?.message ||
                        "Aira users could not be loaded."
                );
                return;
            }

            setEmployees(response.data || []);
            setSelectedIds([]);
        } catch (error) {
            console.error(error);
            toast.error("Unable to load Aira users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEmployees();
    }, []);

    const filteredEmployees = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) {
            return employees;
        }

        return employees.filter((employee) => {
            const code = String(
                employee.employeeCode || ""
            ).toLowerCase();

            const name = String(
                employee.name || ""
            ).toLowerCase();

            const role = String(
                employee.umRoleName || ""
            ).toLowerCase();

            return (
                code.includes(keyword) ||
                name.includes(keyword) ||
                role.includes(keyword)
            );
        });
    }, [employees, search]);

    const visibleIds = filteredEmployees.map(
        (employee) => employee.idUser
    );

    const allVisibleSelected =
        visibleIds.length > 0 &&
        visibleIds.every((id) => selectedIds.includes(id));

    const toggleEmployee = (idUser, isImported) => {
        if (isImported) {
            return;
        }

        setSelectedIds((current) =>
            current.includes(idUser)
                ? current.filter((id) => id !== idUser)
                : [...current, idUser]
        );
    };

    const toggleVisibleEmployees = () => {
        const importableIds = filteredEmployees
            .filter((employee) => !employee.isImported)
            .map((employee) => employee.idUser);

        if (!importableIds.length) {
            return;
        }

        setSelectedIds((current) => {
            const allSelected = importableIds.every((id) =>
                current.includes(id)
            );

            if (allSelected) {
                return current.filter(
                    (id) => !importableIds.includes(id)
                );
            }

            return [...new Set([...current, ...importableIds])];
        });
    };

    const importSelectedUsers = async () => {
        if (!selectedIds.length) {
            toast.error("Select at least one pending user.");
            return;
        }

        try {
            setSaving(true);

            const response = await userApi.importBulk(selectedIds);

            if (!response?.success) {
                toast.error(
                    response?.message || "User import failed."
                );
                return;
            }

            toast.success(
                response.message || "Users imported successfully."
            );

            await loadEmployees();
        } catch (error) {
            console.error(error);
            toast.error("Users could not be imported.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-full bg-background p-5 text-foreground md:p-8">
            <div className="mx-auto max-w-[1500px] space-y-6">

                <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <button
                            type="button"
                            onClick={() => navigate("/users")}
                            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-gold"
                        >
                            <ArrowLeft size={17} />
                            Back to User Management
                        </button>

                        <div className="flex items-center gap-3">
                            <Users className="text-gold" size={30} />
                            <h1 className="text-3xl font-black tracking-tight">
                                Import Aira Users
                            </h1>
                        </div>

                        <p className="mt-2 text-sm font-medium text-muted-foreground">
                            Import employees into QMS. Assign their local
                            designation later from User Management.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={loadEmployees}
                        disabled={loading || saving}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-bold text-foreground shadow-sm transition hover:border-gold hover:text-gold disabled:opacity-50"
                    >
                        <RefreshCw
                            size={17}
                            className={loading ? "animate-spin" : ""}
                        />
                        Refresh Aira Users
                    </button>
                </section>

                <section className="rounded-2xl border border-border bg-card p-5 shadow-md">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <input
                            type="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search employee name, code or Aira role..."
                            className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground outline-none transition placeholder:text-muted-foreground focus:border-gold focus:ring-2 focus:ring-gold/20 xl:max-w-xl"
                        />

                        <button
                            type="button"
                            onClick={importSelectedUsers}
                            disabled={
                                saving || selectedIds.length === 0
                            }
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gold px-5 text-sm font-bold text-white shadow-lg shadow-gold/20 transition hover:bg-gold-hover disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving ? (
                                <RefreshCw
                                    size={17}
                                    className="animate-spin"
                                />
                            ) : (
                                <Upload size={17} />
                            )}
                            Import Selected ({selectedIds.length})
                        </button>
                    </div>
                </section>

                <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-md">
                    <div className="overflow-x-auto">
                        <table className="min-w-[1050px] w-full border-collapse text-left">
                            <thead className="bg-muted text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                                <tr>
                                    <th className="w-16 px-5 py-4">
                                        <input
                                            type="checkbox"
                                            checked={allVisibleSelected}
                                            onChange={
                                                toggleVisibleEmployees
                                            }
                                            disabled={
                                                loading ||
                                                filteredEmployees.length ===
                                                    0
                                            }
                                            className="h-4 w-4 accent-[var(--gold)]"
                                        />
                                    </th>
                                    <th className="px-5 py-4">
                                        Employee Code
                                    </th>
                                    <th className="px-5 py-4">
                                        Employee Picture
                                    </th>
                                    <th className="px-5 py-4">
                                        Employee Name
                                    </th>
                                    <th className="px-5 py-4">
                                        Mobile
                                    </th>
                                    <th className="px-5 py-4">
                                        Aira Role
                                    </th>
                                    <th className="px-5 py-4">
                                        QMS Status
                                    </th>
                                    <th className="px-5 py-4 text-right">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-border">
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="py-20 text-center"
                                        >
                                            <RefreshCw
                                                size={30}
                                                className="mx-auto animate-spin text-gold"
                                            />
                                            <p className="mt-3 text-sm text-muted-foreground">
                                                Loading Aira users...
                                            </p>
                                        </td>
                                    </tr>
                                ) : filteredEmployees.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="py-20 text-center text-sm font-semibold text-muted-foreground"
                                        >
                                            No Aira users found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredEmployees.map((employee) => {
                                        const imported =
                                            employee.isImported === true;
                                        const synced =
                                            employee.isSync === true;

                                        return (
                                            <tr
                                                key={employee.idUser}
                                                className="transition hover:bg-gold/[0.04]"
                                            >
                                                <td className="px-5 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.includes(
                                                            employee.idUser
                                                        )}
                                                        disabled={imported}
                                                        onChange={() =>
                                                            toggleEmployee(
                                                                employee.idUser,
                                                                imported
                                                            )
                                                        }
                                                        className="h-4 w-4 accent-[var(--gold)]"
                                                    />
                                                </td>

                                                <td className="px-5 py-4 font-bold text-foreground">
                                                    {employee.employeeCode ||
                                                        "—"}
                                                </td>
                                                <td className="px-5 py-4 font-bold text-foreground">
                                                    <img
                                                   src={getAiraImageUrl(employee.imageFileURL)}
                                                   alt={employee.name || "Employee"}
                                                   className="h-10 w-10 rounded-full border border-border object-cover"
                                                   onError={(event) => {
                                                       event.currentTarget.src = "/default-user.png";
                                                   }}
                                                    />
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="font-bold text-foreground">
                                                        {employee.name || "—"}
                                                    </div>

                                                    {employee.companyName && (
                                                        <div className="mt-1 text-xs text-muted-foreground">
                                                            {
                                                                employee.companyName
                                                            }
                                                        </div>
                                                    )}
                                                </td>

                                                <td className="px-5 py-4 text-sm font-medium text-muted-foreground">
                                                    {employee.contactNo ||
                                                        "—"}
                                                </td>

                                                <td className="px-5 py-4 text-sm font-semibold text-foreground">
                                                    {employee.umRoleName ||
                                                        "Aira User"}
                                                </td>

                                                <td className="px-5 py-4">
                                                    {synced ? (
                                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600">
                                                            <CheckCircle2
                                                                size={14}
                                                            />
                                                            Synced
                                                        </span>
                                                    ) : imported ? (
                                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-600">
                                                            Imported
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-600">
                                                            <Clock3 size={14} />
                                                            Not imported
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-5 py-4 text-right">
                                                    {imported ? (
                                                        <span className="text-xs font-semibold text-muted-foreground">
                                                            Already in QMS
                                                        </span>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                userApi
                                                                    .saveFromAira(
                                                                        employee.idUser
                                                                    )
                                                                    .then(
                                                                        (
                                                                            response
                                                                        ) => {
                                                                            if (
                                                                                !response?.success
                                                                            ) {
                                                                                toast.error(
                                                                                    response?.message ||
                                                                                        "Import failed."
                                                                                );
                                                                                return;
                                                                            }

                                                                            toast.success(
                                                                                "User imported successfully."
                                                                            );
                                                                            loadEmployees();
                                                                        }
                                                                    )
                                                                    .catch(
                                                                        () =>
                                                                            toast.error(
                                                                                "User import failed."
                                                                            )
                                                                    )
                                                            }
                                                            className="inline-flex items-center gap-2 rounded-lg border border-gold/40 px-3 py-2 text-xs font-bold text-gold transition hover:bg-gold hover:text-white"
                                                        >
                                                            <Upload size={14} />
                                                            Import
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default UserImport;