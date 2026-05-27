import React, { useEffect, useState } from 'react';
import {
    ShieldCheck,
    User as UserIcon,
    RefreshCw,
    Save,
} from 'lucide-react';

import { userRightService } from '../../api/userRightService';
import { designationService } from '../../api/designationService';

import { toast } from 'react-hot-toast';

const UserRightForm = () => {

    /* ------------------------------------------------------------------ */
    /* STATE */
    /* ------------------------------------------------------------------ */

    const [rights, setRights] = useState([]);
    const [designations, setDesignations] = useState([]);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [selectedDesignationId, setSelectedDesignationId] = useState(null);

    /* ------------------------------------------------------------------ */
    /* LOAD DESIGNATIONS */
    /* ------------------------------------------------------------------ */

    useEffect(() => {
        loadDesignations();
    }, []);

    const loadDesignations = async () => {

        try {

            const res = await designationService.getAll();

            if (res.success) {
                setDesignations(res.data || []);
            }

        } catch (error) {

            console.error(error);
            toast.error('Failed to load designations');

        }

    };

    /* ------------------------------------------------------------------ */
    /* LOAD RIGHTS WHEN DESIGNATION CHANGES */
    /* ------------------------------------------------------------------ */

    useEffect(() => {

        if (selectedDesignationId) {
            loadUserRights();
        }
        else {
            setRights([]);
        }

    }, [selectedDesignationId]);

    /* ------------------------------------------------------------------ */
    /* LOAD RIGHTS */
    /* ------------------------------------------------------------------ */

    const loadUserRights = async () => {

        try {

            setLoading(true);

            const res = await userRightService.getByDesignationId(selectedDesignationId);

            console.log('RIGHTS RESPONSE', res);

            if (res.success) {

                // NORMALIZE DATA
                const normalizedRights = (res.data || []).map((right) => ({

                    idRight:
                        right.idRight ??
                        right.IDRight ??
                        0,

                    idPage:
                        right.idPage ??
                        right.IDPage ??
                        0,

                    pageName:
                        right.pageName ??
                        right.PageName ??
                        '',

                    canView:
                        right.canView ??
                        right.CanView ??
                        false,

                    canCreate:
                        right.canCreate ??
                        right.CanCreate ??
                        false,

                    canEdit:
                        right.canEdit ??
                        right.CanEdit ??
                        false,

                    canDelete:
                        right.canDelete ??
                        right.CanDelete ??
                        false,

                }));

                console.log('NORMALIZED RIGHTS', normalizedRights);

                setRights(normalizedRights);

            }
            else {

                toast.error(res.message || 'Failed to load rights');
                setRights([]);

            }

        } catch (error) {

            console.error(error);
            toast.error('Something went wrong');

        } finally {

            setLoading(false);

        }

    };

    /* ------------------------------------------------------------------ */
    /* TOGGLE CHECKBOX */
    /* ------------------------------------------------------------------ */

    const handleToggle = (index, field) => {

        setRights((prev) => {

            const updated = [...prev];

            updated[index] = {
                ...updated[index],
                [field]: !updated[index][field],
            };

            return updated;

        });

    };

    /* ------------------------------------------------------------------ */
    /* SAVE ALL RIGHTS */
    /* ------------------------------------------------------------------ */

    const handleSaveAll = async (event) => {

        event?.preventDefault?.();

        try {

            setSaving(true);

            const rightsToSave = rights.map((r) => ({

                idRight: r.idRight,

                idDesignation: Number(selectedDesignationId),

                idPage: r.idPage,

                canView: r.canView,

                canCreate: r.canCreate,

                canEdit: r.canEdit,

                canDelete: r.canDelete,

            }));

            console.log('FINAL PAYLOAD', rightsToSave);

            const res = await userRightService.updateBulk(rightsToSave);

            console.log('SAVE RESPONSE', res);

            if (res.success) {

                toast.success('Permissions updated successfully');

                await loadUserRights();

            }
            else {

                toast.error(res.message || 'Failed to save');

            }

        } catch (error) {

            console.error(error);
            toast.error('Something went wrong while saving');

        } finally {

            setSaving(false);

        }

    };

    /* ------------------------------------------------------------------ */
    /* STYLES */
    /* ------------------------------------------------------------------ */

    const inputClass =
        'w-full bg-background border-2 border-border/60 rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:border-gold transition-all shadow-sm';

    /* ------------------------------------------------------------------ */
    /* RENDER */
    /* ------------------------------------------------------------------ */

    return (

        <div className="p-6 space-y-6 animate-in fade-in duration-500">

            {/* HEADER */}

            <div className="flex items-center justify-between">

                <h1 className="text-3xl font-black text-foreground flex items-center gap-3">

                    <ShieldCheck
                        className="text-gold"
                        size={32}
                    />

                    Designation Rights Master

                </h1>

                {selectedDesignationId && (

                    <button
                        type="button"
                        onClick={handleSaveAll}
                        disabled={saving}
                        className="
                            px-8 py-3
                            bg-gold hover:bg-gold/90
                            text-white
                            rounded-xl
                            font-black
                            uppercase
                            tracking-widest
                            shadow-lg shadow-gold/20
                            flex items-center gap-3
                            transition-all
                            hover:scale-105
                            active:scale-95
                        "
                    >

                        {saving ? (
                            <RefreshCw
                                className="animate-spin"
                                size={18}
                            />
                        ) : (
                            <Save
                                size={18}
                                strokeWidth={3}
                            />
                        )}

                        Save All Rights

                    </button>

                )}

            </div>

            {/* DESIGNATION DROPDOWN */}

            <div className="bg-card border-2 border-border p-6 rounded-3xl shadow-xl max-w-md">

                <label
                    className="
                        text-[12px]
                        font-black
                        uppercase
                        text-muted-foreground
                        tracking-widest
                        ml-1
                        mb-2
                        block
                    "
                >
                    Select Designation
                </label>

                <div className="relative">

                    <UserIcon
                        className="absolute left-4 top-3.5 text-muted-foreground"
                        size={18}
                    />

                    <select
                        value={selectedDesignationId ?? ''}
                        onChange={(e) =>
                            setSelectedDesignationId(
                                e.target.value
                                    ? Number(e.target.value)
                                    : null
                            )
                        }
                        className={`${inputClass} pl-12`}
                    >

                        <option value="">
                            -- Choose Designation --
                        </option>

                        {designations.map((d) => (

                            <option
                                key={d.idDesignation}
                                value={d.idDesignation}
                            >
                                {d.designationName}
                            </option>

                        ))}

                    </select>

                </div>

            </div>

            {/* RIGHTS TABLE */}

            {selectedDesignationId && (

                <div
                    className="
                        bg-card/40
                        backdrop-blur-md
                        rounded-3xl
                        border border-border
                        shadow-2xl
                        overflow-hidden
                    "
                >

                    <div className="overflow-x-auto">

                        <table className="w-full text-left border-collapse">

                            <thead
                                className="
                                    bg-muted/50
                                    text-[10px]
                                    font-black
                                    uppercase
                                    tracking-[0.2em]
                                    text-muted-foreground
                                    border-b border-border
                                "
                            >

                                <tr>

                                    <th className="px-8 py-5">
                                        Page Name
                                    </th>

                                    <th className="px-6 py-5 text-center">
                                        View
                                    </th>

                                    <th className="px-6 py-5 text-center">
                                        Create
                                    </th>

                                    <th className="px-6 py-5 text-center">
                                        Edit
                                    </th>

                                    <th className="px-6 py-5 text-center">
                                        Delete
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y divide-border">

                                {loading ? (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="py-20 text-center"
                                        >

                                            <RefreshCw
                                                className="animate-spin text-gold mx-auto"
                                            />

                                        </td>

                                    </tr>

                                ) : (

                                    rights.map((item, index) => (

                                        <tr
                                            key={item.idPage}
                                            className="
                                                group
                                                hover:bg-gold/[0.03]
                                                transition-colors
                                            "
                                        >

                                            <td
                                                className="
                                                    px-8 py-4
                                                    font-black
                                                    text-sm
                                                    text-foreground
                                                "
                                            >
                                                {item.pageName}
                                            </td>

                                            {[
                                                'canView',
                                                'canCreate',
                                                'canEdit',
                                                'canDelete',
                                            ].map((field) => (

                                                <td
                                                    key={field}
                                                    className="
                                                        px-6 py-4
                                                        text-center
                                                    "
                                                >

                                                    <input
                                                        type="checkbox"
                                                        checked={item[field]}
                                                        onChange={() =>
                                                            handleToggle(index, field)
                                                        }
                                                        className="
                                                            w-5 h-5
                                                            rounded
                                                            accent-gold
                                                            cursor-pointer
                                                        "
                                                    />

                                                </td>

                                            ))}

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            )}

        </div>

    );

};

export default UserRightForm;