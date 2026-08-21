


// // import React, { useEffect, useState } from "react";
// // import {
// //     ShieldCheck,
// //     Users,
// //     RefreshCw,
// //     Save
// // } from "lucide-react";
// // import { toast } from "react-hot-toast";

// // import { userRightService } from "../../api/userRightService";
// // import { designationService } from "../../api/designationService";
// // import { userApi } from "../../api/userApi";

// // const UserRightForm = () => {
// //     const [activeTab, setActiveTab] = useState("role");

// //     const [designations, setDesignations] = useState([]);
// //     const [users, setUsers] = useState([]);

// //     const [selectedDesignationId, setSelectedDesignationId] =
// //         useState("");

// //     const [selectedUserId, setSelectedUserId] =
// //         useState("");

// //     const [rights, setRights] = useState([]);
// //     const [loading, setLoading] = useState(false);
// //     const [saving, setSaving] = useState(false);

// //     useEffect(() => {
// //         loadDesignations();
// //         loadUsers();
// //     }, []);

// //     const loadDesignations = async () => {
// //         try {
// //             const response = await designationService.getAll();

// //             if (response.success) {
// //                 setDesignations(response.data || []);
// //             }
// //         } catch {
// //             toast.error("Failed to load designations");
// //         }
// //     };

// //     const loadUsers = async () => {
// //         try {
// //             const response =
// //                 await userApi.getForRights?.();

// //             if (response?.success) {
// //                 setUsers(response.data || []);
// //                 return;
// //             }

// //             const fallback = await userApi.getAll();

// //             if (fallback.success) {
// //                 setUsers(fallback.data || []);
// //             }
// //         } catch {
// //             toast.error("Failed to load users");
// //         }
// //     };

// //     const normalizeRight = (item) => {
// //         const hasOverride = Boolean(
// //             item.hasUserOverride ??
// //             item.HasUserOverride ??
// //             false
// //         );

// //         return {
// //             idRight: item.idRight ?? item.IDRight ?? 0,
// //             idUser: item.idUser ?? item.IDUser ?? null,
// //             idDesignation:
// //                 item.idDesignation ??
// //                 item.IDDesignation ??
// //                 null,
// //             idPage: item.idPage ?? item.IDPage,
// //             pageName: item.pageName ?? item.PageName ?? "",
// //             pageCode: item.pageCode ?? item.PageCode ?? "",

// //             canView: Boolean(
// //                 item.canView ?? item.CanView ?? false
// //             ),
// //             canCreate: Boolean(
// //                 item.canCreate ?? item.CanCreate ?? false
// //             ),
// //             canEdit: Boolean(
// //                 item.canEdit ?? item.CanEdit ?? false
// //             ),
// //             canDelete: Boolean(
// //                 item.canDelete ?? item.CanDelete ?? false
// //             ),

// //             hasUserOverride: hasOverride,
// //             originalHasUserOverride: hasOverride
// //         };
// //     };

// //     const loadRoleRights = async (idDesignation) => {
// //         try {
// //             setLoading(true);

// //             const response =
// //                 await userRightService.getByDesignationId(
// //                     idDesignation
// //                 );

// //             if (!response.success) {
// //                 toast.error(
// //                     response.message ||
// //                     "Failed to load role rights"
// //                 );
// //                 return;
// //             }

// //             setRights(
// //                 (response.data || []).map(normalizeRight)
// //             );
// //         } catch {
// //             toast.error("Failed to load role rights");
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     const loadUserRights = async (idUser) => {
// //         try {
// //             setLoading(true);

// //             const response =
// //                 await userRightService.getForUser(idUser);

// //             if (!response.success) {
// //                 toast.error(
// //                     response.message ||
// //                     "Failed to load user rights"
// //                 );
// //                 return;
// //             }

// //             setRights(
// //                 (response.data || []).map(normalizeRight)
// //             );
// //         } catch {
// //             toast.error("Failed to load user rights");
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     const handleRoleChange = (event) => {
// //         const value = event.target.value;

// //         setSelectedDesignationId(value);
// //         setRights([]);

// //         if (value) {
// //             loadRoleRights(Number(value));
// //         }
// //     };

// //     const handleUserChange = (event) => {
// //         const value = event.target.value;

// //         setSelectedUserId(value);
// //         setRights([]);

// //         if (value) {
// //             loadUserRights(Number(value));
// //         }
// //     };

// //     const toggleRight = (index, field) => {
// //         setRights((current) => {
// //             const updated = [...current];

// //             if (
// //                 activeTab === "user" &&
// //                 !updated[index].hasUserOverride
// //             ) {
// //                 return current;
// //             }

// //             updated[index] = {
// //                 ...updated[index],
// //                 [field]: !updated[index][field]
// //             };

// //             return updated;
// //         });
// //     };

// //     const toggleUserOverride = (index) => {
// //         setRights((current) => {
// //             const updated = [...current];

// //             updated[index] = {
// //                 ...updated[index],
// //                 hasUserOverride:
// //                     !updated[index].hasUserOverride
// //             };

// //             return updated;
// //         });
// //     };

// //     const saveRoleRights = async () => {
// //         if (!selectedDesignationId) {
// //             toast.error("Select a designation first.");
// //             return;
// //         }

// //         try {
// //             setSaving(true);

// //             const payload = rights.map((right) => ({
// //                 idRight: right.idRight,
// //                 idUser: 0,
// //                 idDesignation: Number(
// //                     selectedDesignationId
// //                 ),
// //                 idPage: Number(right.idPage),
// //                 canView: right.canView,
// //                 canCreate: right.canCreate,
// //                 canEdit: right.canEdit,
// //                 canDelete: right.canDelete
// //             }));

// //             const response =
// //                 await userRightService.updateBulk(
// //                     payload
// //                 );

// //             if (!response.success) {
// //                 toast.error(
// //                     response.message ||
// //                     "Failed to save role rights"
// //                 );
// //                 return;
// //             }

// //             toast.success("Role rights saved successfully.");

// //             await loadRoleRights(
// //                 Number(selectedDesignationId)
// //             );
// //         } catch {
// //             toast.error("Failed to save role rights.");
// //         } finally {
// //             setSaving(false);
// //         }
// //     };

// //     const saveUserRights = async () => {
// //         if (!selectedUserId) {
// //             toast.error("Select a user first.");
// //             return;
// //         }

// //         try {
// //             setSaving(true);

// //             for (const right of rights) {
// //                 if (right.hasUserOverride) {
// //                     await userRightService.saveForUser({
// //                         idUser: Number(selectedUserId),
// //                         idDesignation: Number(selectedDesignationId || 0),
// //                         idPage: right.idPage,
// //                         canView: right.canView,
// //                         canCreate: right.canCreate,
// //                         canEdit: right.canEdit,
// //                         canDelete: right.canDelete
// //                     });
// //                 }

// //                 if (
// //                     !right.hasUserOverride &&
// //                     right.originalHasUserOverride
// //                 ) {
// //                     await userRightService.removeUserOverride(
// //                         Number(selectedUserId),
// //                         right.idPage
// //                     );
// //                 }
// //             }

// //             toast.success(
// //                 "User-specific rights saved successfully."
// //             );

// //             await loadUserRights(
// //                 Number(selectedUserId)
// //             );
// //         } catch {
// //             toast.error("Failed to save user rights.");
// //         } finally {
// //             setSaving(false);
// //         }
// //     };

// //     const selectedUser = users.find(
// //         (user) =>
// //             Number(user.idUser ?? user.IDUser) ===
// //             Number(selectedUserId)
// //     );

// //     return (
// //         <div className="p-6 space-y-6">
// //             <div>
// //                 <h1 className="flex items-center gap-3 text-3xl font-black text-foreground">
// //                     <ShieldCheck
// //                         className="text-gold"
// //                         size={32}
// //                     />
// //                     User Rights
// //                 </h1>

// //                 <p className="mt-2 text-muted-foreground">
// //                     Manage role permissions and user-specific access.
// //                 </p>
// //             </div>

// //             <div className="flex gap-2 rounded-xl border border-border bg-card p-2">
// //                 <button
// //                     type="button"
// //                     onClick={() => {
// //                         setActiveTab("role");
// //                         setRights([]);
// //                     }}
// //                     className={`flex items-center gap-2 rounded-lg px-5 py-3 font-bold ${
// //                         activeTab === "role"
// //                             ? "bg-gold text-white"
// //                             : "text-muted-foreground hover:bg-muted"
// //                     }`}
// //                 >
// //                     <ShieldCheck size={18} />
// //                     Role Access
// //                 </button>

// //                 <button
// //                     type="button"
// //                     onClick={() => {
// //                         setActiveTab("user");
// //                         setRights([]);
// //                     }}
// //                     className={`flex items-center gap-2 rounded-lg px-5 py-3 font-bold ${
// //                         activeTab === "user"
// //                             ? "bg-gold text-white"
// //                             : "text-muted-foreground hover:bg-muted"
// //                     }`}
// //                 >
// //                     <Users size={18} />
// //                     User Access
// //                 </button>
// //             </div>

// //             <div className="rounded-2xl border border-border bg-card p-5">
// //                 <label className="mb-2 block font-bold text-foreground">
// //                     {activeTab === "role"
// //                         ? "Select Role / Designation"
// //                         : "Search and Select User"}
// //                 </label>

// //                 {activeTab === "role" ? (
// //                     <select
// //                         value={selectedDesignationId}
// //                         onChange={handleRoleChange}
// //                         className="input-ui w-full max-w-lg"
// //                     >
// //                         <option value="">
// //                             Select designation
// //                         </option>

// //                         {designations.map((item) => (
// //                             <option
// //                                 key={item.idDesignation}
// //                                 value={item.idDesignation}
// //                             >
// //                                 {item.designationName}
// //                             </option>
// //                         ))}
// //                     </select>
// //                 ) : (
// //                     <select
// //                         value={selectedUserId}
// //                         onChange={handleUserChange}
// //                         className="input-ui w-full max-w-lg"
// //                     >
// //                         <option value="">
// //                             Select employee
// //                         </option>

// //                         {users.map((item) => (
// //                             <option
// //                                 key={item.idUser ?? item.IDUser}
// //                                 value={item.idUser ?? item.IDUser}
// //                             >
// //                                 {item.userFullName ||
// //                                     item.UserFullName}{" "}
// //                                 —{" "}
// //                                 {item.airaEmployeeCode ||
// //                                     item.AiraEmployeeCode ||
// //                                     item.userName ||
// //                                     item.UserName}
// //                             </option>
// //                         ))}
// //                     </select>
// //                 )}

// //                 {activeTab === "user" && selectedUser && (
// //                     <p className="mt-3 text-sm text-muted-foreground">
// //                         Designation:{" "}
// //                         <strong>
// //                             {selectedUser.designationName ||
// //                                 selectedUser.DesignationName ||
// //                                 "Not assigned"}
// //                         </strong>
// //                     </p>
// //                 )}
// //             </div>

// //             {rights.length > 0 && (
// //                 <div className="flex justify-end">
// //                     <button
// //                         type="button"
// //                         disabled={saving}
// //                         onClick={
// //                             activeTab === "role"
// //                                 ? saveRoleRights
// //                                 : saveUserRights
// //                         }
// //                         className="flex items-center gap-2 rounded-lg bg-gold px-6 py-3 font-bold text-white"
// //                     >
// //                         {saving ? (
// //                             <RefreshCw
// //                                 size={18}
// //                                 className="animate-spin"
// //                             />
// //                         ) : (
// //                             <Save size={18} />
// //                         )}

// //                         Save Rights
// //                     </button>
// //                 </div>
// //             )}

// //             <div className="overflow-hidden rounded-2xl border border-border bg-card">
// //                 <div className="overflow-x-auto">
// //                     <table className="w-full border-collapse">
// //                         <thead className="bg-muted">
// //                             <tr>
// //                                 {activeTab === "user" && (
// //                                     <th className="px-5 py-4 text-center">
// //                                         Custom
// //                                     </th>
// //                                 )}

// //                                 <th className="px-5 py-4 text-left">
// //                                     Page
// //                                 </th>

// //                                 <th className="px-5 py-4 text-center">
// //                                     View
// //                                 </th>

// //                                 <th className="px-5 py-4 text-center">
// //                                     Create
// //                                 </th>

// //                                 <th className="px-5 py-4 text-center">
// //                                     Edit
// //                                 </th>

// //                                 <th className="px-5 py-4 text-center">
// //                                     Delete
// //                                 </th>
// //                             </tr>
// //                         </thead>

// //                         <tbody>
// //                             {loading ? (
// //                                 <tr>
// //                                     <td
// //                                         colSpan={
// //                                             activeTab === "user"
// //                                                 ? 6
// //                                                 : 5
// //                                         }
// //                                         className="py-16 text-center"
// //                                     >
// //                                         <RefreshCw
// //                                             className="mx-auto animate-spin text-gold"
// //                                             size={28}
// //                                         />
// //                                     </td>
// //                                 </tr>
// //                             ) : rights.length === 0 ? (
// //                                 <tr>
// //                                     <td
// //                                         colSpan={
// //                                             activeTab === "user"
// //                                                 ? 6
// //                                                 : 5
// //                                         }
// //                                         className="py-16 text-center text-muted-foreground"
// //                                     >
// //                                         Select a role or employee.
// //                                     </td>
// //                                 </tr>
// //                             ) : (
// //                                 rights.map((right, index) => (
// //                                     <tr
// //                                         key={right.idPage}
// //                                         className="border-b border-border"
// //                                     >
// //                                         {activeTab === "user" && (
// //                                             <td className="px-5 py-4 text-center">
// //                                                 <input
// //                                                     type="checkbox"
// //                                                     checked={
// //                                                         right.hasUserOverride
// //                                                     }
// //                                                     onChange={() =>
// //                                                         toggleUserOverride(
// //                                                             index
// //                                                         )
// //                                                     }
// //                                                     className="h-5 w-5 accent-gold"
// //                                                 />
// //                                             </td>
// //                                         )}

// //                                         <td className="px-5 py-4 font-bold text-foreground">
// //                                             {right.pageName}
// //                                         </td>

// //                                         {[
// //                                             "canView",
// //                                             "canCreate",
// //                                             "canEdit",
// //                                             "canDelete"
// //                                         ].map((field) => (
// //                                             <td
// //                                                 key={field}
// //                                                 className="px-5 py-4 text-center"
// //                                             >
// //                                                 <input
// //                                                     type="checkbox"
// //                                                     checked={right[field]}
// //                                                     disabled={
// //                                                         activeTab ===
// //                                                             "user" &&
// //                                                         !right.hasUserOverride
// //                                                     }
// //                                                     onChange={() =>
// //                                                         toggleRight(
// //                                                             index,
// //                                                             field
// //                                                         )
// //                                                     }
// //                                                     className="h-5 w-5 accent-gold disabled:opacity-30"
// //                                                 />
// //                                             </td>
// //                                         ))}
// //                                     </tr>
// //                                 ))
// //                             )}
// //                         </tbody>
// //                     </table>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// // export default UserRightForm;


// import React, { useEffect, useState } from "react";
// import {
//     ShieldCheck,
//     Users,
//     RefreshCw,
//     Save
// } from "lucide-react";
// import { toast } from "react-hot-toast";

// import { userRightService } from "../../api/userRightService";
// import { designationService } from "../../api/designationService";
// import { userApi } from "../../api/userApi";

// const UserRightForm = () => {
//     const [activeTab, setActiveTab] = useState("role");

//     const [designations, setDesignations] = useState([]);
//     const [users, setUsers] = useState([]);

//     const [selectedDesignationId, setSelectedDesignationId] =
//         useState("");

//     const [selectedUserId, setSelectedUserId] =
//         useState("");

//     const [roleRights, setRoleRights] = useState([]);
//     const [userRights, setUserRights] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [saving, setSaving] = useState(false);

//     useEffect(() => {
//         loadDesignations();
//         loadUsers();
//     }, []);

//     const loadDesignations = async () => {
//         try {
//             const response = await designationService.getAll();

//             if (response.success) {
//                 setDesignations(response.data || []);
//             }
//         } catch {
//             toast.error("Failed to load designations");
//         }
//     };

//     const loadUsers = async () => {
//         try {
//             const response = await userApi.getForRights?.();

//             if (response?.success) {
//                 setUsers(response.data || []);
//                 return;
//             }

//             const fallback = await userApi.getAll();

//             if (fallback.success) {
//                 setUsers(fallback.data || []);
//             }
//         } catch {
//             toast.error("Failed to load users");
//         }
//     };

//     const normalizeRight = (item) => {
//         const hasOverride = Boolean(
//             item.hasUserOverride ??
//             item.HasUserOverride ??
//             false
//         );

//         return {
//             idRight: item.idRight ?? item.IDRight ?? 0,
//             idUser: item.idUser ?? item.IDUser ?? null,
//             idDesignation:
//                 item.idDesignation ??
//                 item.IDDesignation ??
//                 null,
//             idPage: item.idPage ?? item.IDPage ?? 0,
//             pageName: item.pageName ?? item.PageName ?? "",
//             pageCode: item.pageCode ?? item.PageCode ?? "",

//             canView: Boolean(
//                 item.canView ?? item.CanView ?? false
//             ),
//             canCreate: Boolean(
//                 item.canCreate ?? item.CanCreate ?? false
//             ),
//             canEdit: Boolean(
//                 item.canEdit ?? item.CanEdit ?? false
//             ),
//             canDelete: Boolean(
//                 item.canDelete ?? item.CanDelete ?? false
//             ),

//             hasUserOverride: hasOverride,
//             originalHasUserOverride: hasOverride
//         };
//     };

//     const loadRoleRights = async (idDesignation) => {
//         try {
//             setLoading(true);

//             const response =
//                 await userRightService.getByDesignationId(
//                     idDesignation
//                 );

//             if (!response.success) {
//                 toast.error(
//                     response.message ||
//                     "Failed to load role rights"
//                 );
//                 return;
//             }

//             setRoleRights(
//                 (response.data || []).map(normalizeRight)
//             );
//         } catch {
//             toast.error("Failed to load role rights");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const loadUserRights = async (idUser) => {
//         try {
//             setLoading(true);

//             const response =
//                 await userRightService.getForUser(idUser);

//             if (!response.success) {
//                 toast.error(
//                     response.message ||
//                     "Failed to load user rights"
//                 );
//                 return;
//             }

//             setUserRights(
//                 (response.data || []).map(normalizeRight)
//             );
//         } catch {
//             toast.error("Failed to load user rights");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleRoleChange = (event) => {
//         const value = event.target.value;

//         setSelectedDesignationId(value);
//         setRoleRights([]);

//         if (value) {
//             loadRoleRights(Number(value));
//         }
//     };

//     const handleUserChange = (event) => {
//         const value = event.target.value;

//         setSelectedUserId(value);
//         setUserRights([]);

//         if (value) {
//             loadUserRights(Number(value));
//         }
//     };

//     // const toggleRight = (index, field) => {
//     //     const currentRights =
//     //         activeTab === "role" ? roleRights : userRights;

//     //     const setCurrentRights =
//     //         activeTab === "role" ? setRoleRights : setUserRights;

//     //     if (
//     //         activeTab === "user" &&
//     //         !currentRights[index]?.hasUserOverride
//     //     ) {
//     //         return;
//     //     }

//     //     const updated = [...currentRights];
//     //     updated[index] = {
//     //         ...updated[index],
//     //         [field]: !updated[index][field]
//     //     };

//     //     setCurrentRights(updated);
//     // };


//     const toggleRight = (index, field) => {
//     const currentRights =
//         activeTab === "role" ? roleRights : userRights;

//     const setCurrentRights =
//         activeTab === "role"
//             ? setRoleRights
//             : setUserRights;

//     const updated = [...currentRights];

//     updated[index] = {
//         ...updated[index],

//         [field]: !updated[index][field],

//         // If admin changes anything in User Access,
//         // this becomes a user-specific extra permission.
//         ...(activeTab === "user"
//             ? { hasUserOverride: true }
//             : {})
//     };

//     setCurrentRights(updated);
// };
//     const toggleUserOverride = (index) => {
//         const currentRights =
//             activeTab === "role" ? roleRights : userRights;

//         const setCurrentRights =
//             activeTab === "role" ? setRoleRights : setUserRights;

//         const updated = [...currentRights];
//         updated[index] = {
//             ...updated[index],
//             hasUserOverride: !updated[index].hasUserOverride
//         };

//         setCurrentRights(updated);
//     };

//     const saveRoleRights = async () => {
//         if (!selectedDesignationId) {
//             toast.error("Select a designation first.");
//             return;
//         }

//         try {
//             setSaving(true);

//             const payload = roleRights.map((right) => ({
//                 idRight: right.idRight,
//                 idUser: 0,
//                 idDesignation: Number(selectedDesignationId),
//                 idPage: Number(right.idPage),
//                 canView: right.canView,
//                 canCreate: right.canCreate,
//                 canEdit: right.canEdit,
//                 canDelete: right.canDelete
//             }));

//             const response =
//                 await userRightService.updateBulk(payload);

//             if (!response.success) {
//                 toast.error(
//                     response.message ||
//                     "Failed to save role rights"
//                 );
//                 return;
//             }

//             toast.success("Role rights saved successfully.");

//             await loadRoleRights(Number(selectedDesignationId));
//         } catch {
//             toast.error("Failed to save role rights.");
//         } finally {
//             setSaving(false);
//         }
//     };

//     // const saveUserRights = async () => {
//     //     if (!selectedUserId) {
//     //         toast.error("Select a user first.");
//     //         return;
//     //     }

//     //     try {
//     //         setSaving(true);

//     //         for (const right of userRights) {
//     //             if (right.hasUserOverride) {
//     //                 await userRightService.saveForUser({
//     //                     idUser: Number(selectedUserId),
//     //                     idDesignation: Number(selectedDesignationId || 0),
//     //                     idPage: right.idPage,
//     //                     canView: right.canView,
//     //                     canCreate: right.canCreate,
//     //                     canEdit: right.canEdit,
//     //                     canDelete: right.canDelete
//     //                 });
//     //             }

//     //             if (
//     //                 !right.hasUserOverride &&
//     //                 right.originalHasUserOverride
//     //             ) {
//     //                 await userRightService.removeUserOverride(
//     //                     Number(selectedUserId),
//     //                     right.idPage
//     //                 );
//     //             }
//     //         }

//     //         toast.success("User-specific rights saved successfully.");

//     //         await loadUserRights(Number(selectedUserId));
//     //     } catch {
//     //         toast.error("Failed to save user rights.");
//     //     } finally {
//     //         setSaving(false);
//     //     }
//     // };
// const saveUserRights = async () => {
//     if (!selectedUserId) {
//         toast.error("Select a user first.");
//         return;
//     }

//     // Find selected user's actual designation
//     const selectedUserData = users.find(
//         (user) =>
//             Number(user.idUser ?? user.IDUser) ===
//             Number(selectedUserId)
//     );

//     const userDesignationId =
//         selectedUserData?.idDesignation ??
//         selectedUserData?.IDDesignation;

//     if (!userDesignationId) {
//         toast.error(
//             "Designation is not assigned to this user."
//         );
//         return;
//     }

//     try {
//         setSaving(true);

//         for (const right of userRights) {

//             /*
//                 CASE 1:
//                 Custom is ON.

//                 Save current View/Create/Edit/Delete values.
//             */
//             if (right.hasUserOverride) {

//                 const response =
//                     await userRightService.saveForUser({
//                         idUser:
//                             Number(selectedUserId),

//                         idDesignation:
//                             Number(userDesignationId),

//                         idPage:
//                             Number(right.idPage),

//                         canView:
//                             Boolean(right.canView),

//                         canCreate:
//                             Boolean(right.canCreate),

//                         canEdit:
//                             Boolean(right.canEdit),

//                         canDelete:
//                             Boolean(right.canDelete)
//                     });

//                 if (!response?.success) {
//                     throw new Error(
//                         response?.message ||
//                         `Failed to save ${right.pageName}`
//                     );
//                 }
//             }

//             /*
//                 CASE 2:
//                 Custom WAS ON before,
//                 but admin has now unchecked Custom.

//                 DO NOT DELETE THE ROW.

//                 Send all permission values = false.
//                 SaveForUser SP will UPDATE same IDRight.
//             */
//             if (
//                 !right.hasUserOverride &&
//                 right.originalHasUserOverride
//             ) {
//                 const response =
//                     await userRightService.saveForUser({
//                         idUser:
//                             Number(selectedUserId),

//                         idDesignation:
//                             Number(userDesignationId),

//                         idPage:
//                             Number(right.idPage),

//                         canView: false,
//                         canCreate: false,
//                         canEdit: false,
//                         canDelete: false
//                     });

//                 if (!response?.success) {
//                     throw new Error(
//                         response?.message ||
//                         `Failed to clear ${right.pageName}`
//                     );
//                 }
//             }
//         }

//         toast.success(
//             "User-specific rights saved successfully."
//         );

//         // Load fresh values from database
//         await loadUserRights(
//             Number(selectedUserId)
//         );

//     } catch (error) {

//         console.error(
//             "SAVE USER RIGHTS ERROR:",
//             error
//         );

//         toast.error(
//             error.message ||
//             "Failed to save user rights."
//         );

//     } finally {
//         setSaving(false);
//     }
// };
//     const selectedUser = users.find(
//         (user) =>
//             Number(user.idUser ?? user.IDUser) ===
//             Number(selectedUserId)
//     );

//     const currentRights =
//         activeTab === "role" ? roleRights : userRights;

//     return (
//         <div className="p-6 space-y-6">
//             <div>
//                 <h1 className="flex items-center gap-3 text-3xl font-black text-foreground">
//                     <ShieldCheck
//                         className="text-gold"
//                         size={32}
//                     />
//                     User Rights
//                 </h1>

//                 <p className="mt-2 text-muted-foreground">
//                     Manage role permissions and user-specific access.
//                 </p>
//             </div>

//             <div className="flex gap-2 rounded-xl border border-border bg-card p-2">
//                 <button
//                     type="button"
//                     onClick={() => {
//                         setActiveTab("role");
//                         setRoleRights([]);
//                     }}
//                     className={`flex items-center gap-2 rounded-lg px-5 py-3 font-bold ${
//                         activeTab === "role"
//                             ? "bg-gold text-white"
//                             : "text-muted-foreground hover:bg-muted"
//                     }`}
//                 >
//                     <ShieldCheck size={18} />
//                     Role Access
//                 </button>

//                 <button
//                     type="button"
//                     onClick={() => {
//                         setActiveTab("user");
//                         setUserRights([]);
//                     }}
//                     className={`flex items-center gap-2 rounded-lg px-5 py-3 font-bold ${
//                         activeTab === "user"
//                             ? "bg-gold text-white"
//                             : "text-muted-foreground hover:bg-muted"
//                     }`}
//                 >
//                     <Users size={18} />
//                     User Access
//                 </button>
//             </div>

//             <div className="rounded-2xl border border-border bg-card p-5">
//                 <label className="mb-2 block font-bold text-foreground">
//                     {activeTab === "role"
//                         ? "Select Role / Designation"
//                         : "Search and Select User"}
//                 </label>

//                 {activeTab === "role" ? (
//                     <select
//                         value={selectedDesignationId}
//                         onChange={handleRoleChange}
//                         className="input-ui w-full max-w-lg"
//                     >
//                         <option value="">
//                             Select designation
//                         </option>

//                         {designations.map((item) => (
//                             <option
//                                 key={item.idDesignation}
//                                 value={item.idDesignation}
//                             >
//                                 {item.designationName}
//                             </option>
//                         ))}
//                     </select>
//                 ) : (
//                     <select
//                         value={selectedUserId}
//                         onChange={handleUserChange}
//                         className="input-ui w-full max-w-lg"
//                     >
//                         <option value="">
//                             Select employee
//                         </option>

//                         {users.map((item) => (
//                             <option
//                                 key={item.idUser ?? item.IDUser}
//                                 value={item.idUser ?? item.IDUser}
//                             >
//                                 {item.userFullName ||
//                                     item.UserFullName}{" "}
//                                 —{" "}
//                                 {item.airaEmployeeCode ||
//                                     item.AiraEmployeeCode ||
//                                     item.userName ||
//                                     item.UserName}
//                             </option>
//                         ))}
//                     </select>
//                 )}

//                 {activeTab === "user" && selectedUser && (
//                     <p className="mt-3 text-sm text-muted-foreground">
//                         Designation:{" "}
//                         <strong>
//                             {selectedUser.designationName ||
//                                 selectedUser.DesignationName ||
//                                 "Not assigned"}
//                         </strong>
//                     </p>
//                 )}
//             </div>

//             {currentRights.length > 0 && (
//                 <div className="flex justify-end">
//                     <button
//                         type="button"
//                         disabled={saving}
//                         onClick={
//                             activeTab === "role"
//                                 ? saveRoleRights
//                                 : saveUserRights
//                         }
//                         className="flex items-center gap-2 rounded-lg bg-gold px-6 py-3 font-bold text-white"
//                     >
//                         {saving ? (
//                             <RefreshCw
//                                 size={18}
//                                 className="animate-spin"
//                             />
//                         ) : (
//                             <Save size={18} />
//                         )}

//                         Save Rights
//                     </button>
//                 </div>
//             )}

//             <div className="overflow-hidden rounded-2xl border border-border bg-card">
//                 <div className="overflow-x-auto">
//                     <table className="w-full border-collapse">
//                         <thead className="bg-muted">
//                             <tr>
//                                 {activeTab === "user" && (
//                                     <th className="px-5 py-4 text-center">
//                                         Custom
//                                     </th>
//                                 )}

//                                 <th className="px-5 py-4 text-left">
//                                     Page
//                                 </th>

//                                 <th className="px-5 py-4 text-center">
//                                     View
//                                 </th>

//                                 <th className="px-5 py-4 text-center">
//                                     Create
//                                 </th>

//                                 <th className="px-5 py-4 text-center">
//                                     Edit
//                                 </th>

//                                 {/* <th className="px-5 py-4 text-center">
//                                     Delete
//                                 </th> */}
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {loading ? (
//                                 <tr>
//                                     <td
//                                         colSpan={
//                                             activeTab === "user"
//                                                 ? 6
//                                                 : 5
//                                         }
//                                         className="py-16 text-center"
//                                     >
//                                         <RefreshCw
//                                             className="mx-auto animate-spin text-gold"
//                                             size={28}
//                                         />
//                                     </td>
//                                 </tr>
//                             ) : currentRights.length === 0 ? (
//                                 <tr>
//                                     <td
//                                         colSpan={
//                                             activeTab === "user"
//                                                 ? 6
//                                                 : 5
//                                         }
//                                         className="py-16 text-center text-muted-foreground"
//                                     >
//                                         Select a role or employee.
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 currentRights.map((right, index) => (
//                                     <tr
//                                         key={`${activeTab}-${right.idPage}`}
//                                         className="border-b border-border"
//                                     >
//                                         {activeTab === "user" && (
//                                             <td className="px-5 py-4 text-center">
//                                                 <input
//                                                     type="checkbox"
//                                                     checked={
//                                                         right.hasUserOverride
//                                                     }
//                                                     onChange={() =>
//                                                         toggleUserOverride(
//                                                             index
//                                                         )
//                                                     }
//                                                     className="h-5 w-5 accent-gold"
//                                                 />
//                                             </td>
//                                         )}

//                                         <td className="px-5 py-4 font-bold text-foreground">
//                                             {right.pageName}
//                                         </td>

//                                         {[
//                                             "canView",
//                                             "canCreate",
//                                             "canEdit",
//                                             // "canDelete"
//                                         ].map((field) => (
//                                             <td
//                                                 key={field}
//                                                 className="px-5 py-4 text-center"
//                                             >
//                                                 <input
//                                                     type="checkbox"
//                                                     checked={right[field]}
//                                                     disabled={
//                                                         activeTab ===
//                                                             "user" &&
//                                                         !right.hasUserOverride
//                                                     }
//                                                     onChange={() =>
//                                                         toggleRight(
//                                                             index,
//                                                             field
//                                                         )
//                                                     }
//                                                     className="h-5 w-5 accent-gold disabled:opacity-30"
//                                                 />
//                                             </td>
//                                         ))}
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UserRightForm;




import React, { useEffect, useState } from "react";
import {
    ShieldCheck,
    Users,
    RefreshCw,
    Save,
    CheckSquare,
    Square
} from "lucide-react";
import { toast } from "react-hot-toast";

import { userRightService } from "../../api/userRightService";
import { designationService } from "../../api/designationService";
import { userApi } from "../../api/userApi";

const permissionFields = [
    "canView",
    "canCreate",
    "canEdit"
];

const UserRightForm = () => {
    const [activeTab, setActiveTab] = useState("role");

    const [designations, setDesignations] = useState([]);
    const [users, setUsers] = useState([]);

    const [selectedDesignationId, setSelectedDesignationId] =
        useState("");

    const [selectedUserId, setSelectedUserId] =
        useState("");

    const [roleRights, setRoleRights] = useState([]);
    const [userRights, setUserRights] = useState([]);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadDesignations();
        loadUsers();
    }, []);

    const loadDesignations = async () => {
        try {
            const response =
                await designationService.getAll();

            if (response?.success) {
                setDesignations(response.data || []);
                return;
            }

            toast.error(
                response?.message ||
                "Failed to load designations"
            );
        } catch (error) {
            console.error(
                "LOAD DESIGNATIONS ERROR:",
                error
            );

            toast.error("Failed to load designations");
        }
    };

    const loadUsers = async () => {
        try {
            const response =
                await userApi.getForRights?.();

            if (response?.success) {
                setUsers(response.data || []);
                return;
            }

            const fallback =
                await userApi.getAll();

            if (fallback?.success) {
                setUsers(fallback.data || []);
                return;
            }

            toast.error(
                fallback?.message ||
                "Failed to load users"
            );
        } catch (error) {
            console.error(
                "LOAD USERS ERROR:",
                error
            );

            toast.error("Failed to load users");
        }
    };

    const normalizeRight = (item) => {
        const hasOverride = Boolean(
            item.hasUserOverride ??
            item.HasUserOverride ??
            false
        );

        return {
            idRight:
                item.idRight ??
                item.IDRight ??
                0,

            idUser:
                item.idUser ??
                item.IDUser ??
                null,

            idDesignation:
                item.idDesignation ??
                item.IDDesignation ??
                null,

            idPage:
                item.idPage ??
                item.IDPage ??
                0,

            pageName:
                item.pageName ??
                item.PageName ??
                "",

            pageCode:
                item.pageCode ??
                item.PageCode ??
                "",

            canView: Boolean(
                item.canView ??
                item.CanView ??
                false
            ),

            canCreate: Boolean(
                item.canCreate ??
                item.CanCreate ??
                false
            ),

            canEdit: Boolean(
                item.canEdit ??
                item.CanEdit ??
                false
            ),

            // Delete is unsupported in the application.
            canDelete: false,

            hasUserOverride: hasOverride,
            originalHasUserOverride: hasOverride
        };
    };

    const loadRoleRights = async (idDesignation) => {
        try {
            setLoading(true);

            const response =
                await userRightService
                    .getByDesignationId(idDesignation);

            if (!response?.success) {
                toast.error(
                    response?.message ||
                    "Failed to load role rights"
                );

                setRoleRights([]);
                return;
            }

            setRoleRights(
                (response.data || []).map(normalizeRight)
            );
        } catch (error) {
            console.error(
                "LOAD ROLE RIGHTS ERROR:",
                error
            );

            setRoleRights([]);
            toast.error("Failed to load role rights");
        } finally {
            setLoading(false);
        }
    };

    const loadUserRights = async (idUser) => {
        try {
            setLoading(true);

            const response =
                await userRightService.getForUser(idUser);

            if (!response?.success) {
                toast.error(
                    response?.message ||
                    "Failed to load user rights"
                );

                setUserRights([]);
                return;
            }

            setUserRights(
                (response.data || []).map(normalizeRight)
            );
        } catch (error) {
            console.error(
                "LOAD USER RIGHTS ERROR:",
                error
            );

            setUserRights([]);
            toast.error("Failed to load user rights");
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = (event) => {
        const value = event.target.value;

        setSelectedDesignationId(value);
        setRoleRights([]);

        if (value) {
            loadRoleRights(Number(value));
        }
    };

    const handleUserChange = (event) => {
        const value = event.target.value;

        setSelectedUserId(value);
        setUserRights([]);

        if (value) {
            loadUserRights(Number(value));
        }
    };

    const changeTab = (tab) => {
        setActiveTab(tab);

        if (tab === "role") {
            setUserRights([]);

            if (selectedDesignationId) {
                loadRoleRights(
                    Number(selectedDesignationId)
                );
            }
        } else {
            setRoleRights([]);

            if (selectedUserId) {
                loadUserRights(
                    Number(selectedUserId)
                );
            }
        }
    };

    const currentRights =
        activeTab === "role"
            ? roleRights
            : userRights;

    const setCurrentRights =
        activeTab === "role"
            ? setRoleRights
            : setUserRights;

    const toggleRight = (index, field) => {
        setCurrentRights((current) =>
            current.map((right, rightIndex) => {
                if (rightIndex !== index) {
                    return right;
                }

                return {
                    ...right,
                    [field]: !right[field],

                    ...(activeTab === "user"
                        ? { hasUserOverride: true }
                        : {}),

                    canDelete: false
                };
            })
        );
    };

    const toggleUserOverride = (index) => {
        setUserRights((current) =>
            current.map((right, rightIndex) => {
                if (rightIndex !== index) {
                    return right;
                }

                return {
                    ...right,
                    hasUserOverride:
                        !right.hasUserOverride,

                    canDelete: false
                };
            })
        );
    };

    /*
        Bulk Custom checkbox.

        Checked:
        Every page becomes a user-specific override.

        Unchecked:
        Every page returns to designation-based rights
        after Save Rights is clicked.
    */
    const setAllUserOverrides = (checked) => {
        setUserRights((current) =>
            current.map((right) => ({
                ...right,
                hasUserOverride: checked,
                canDelete: false
            }))
        );
    };

    /*
        Bulk permission column.

        Example:
        Clicking View in the heading gives/removes
        View permission for all pages.
    */
    const setPermissionForAll = (
        field,
        checked
    ) => {
        setCurrentRights((current) =>
            current.map((right) => ({
                ...right,
                [field]: checked,

                ...(activeTab === "user"
                    ? { hasUserOverride: true }
                    : {}),

                canDelete: false
            }))
        );
    };

    /*
        Bulk All Pages checkbox.

        Checked:
        Enables View, Create and Edit for every page.

        Unchecked:
        Clears View, Create and Edit for every page.
    */
    const setAllPagePermissions = (checked) => {
        setCurrentRights((current) =>
            current.map((right) => ({
                ...right,
                canView: checked,
                canCreate: checked,
                canEdit: checked,
                canDelete: false,

                ...(activeTab === "user"
                    ? { hasUserOverride: true }
                    : {})
            }))
        );
    };

    const isAllUserOverridesSelected =
        userRights.length > 0 &&
        userRights.every(
            (right) => right.hasUserOverride
        );

    const isPermissionSelectedForAll = (
        field
    ) => {
        if (currentRights.length === 0) {
            return false;
        }

        return currentRights.every((right) => {
            if (
                activeTab === "user" &&
                !right.hasUserOverride
            ) {
                return false;
            }

            return Boolean(right[field]);
        });
    };

    const areAllPagePermissionsSelected =
        currentRights.length > 0 &&
        currentRights.every((right) => {
            if (
                activeTab === "user" &&
                !right.hasUserOverride
            ) {
                return false;
            }

            return (
                right.canView &&
                right.canCreate &&
                right.canEdit
            );
        });

    const saveRoleRights = async () => {
        if (!selectedDesignationId) {
            toast.error(
                "Select a designation first."
            );
            return;
        }

        if (roleRights.length === 0) {
            toast.error(
                "No role rights are available to save."
            );
            return;
        }

        try {
            setSaving(true);

            const payload = roleRights.map(
                (right) => ({
                    idRight:
                        Number(right.idRight || 0),

                    idUser: 0,

                    idDesignation:
                        Number(selectedDesignationId),

                    idPage:
                        Number(right.idPage),

                    canView:
                        Boolean(right.canView),

                    canCreate:
                        Boolean(right.canCreate),

                    canEdit:
                        Boolean(right.canEdit),

                    // Delete is not supported.
                    canDelete: false
                })
            );

            const response =
                await userRightService
                    .updateBulk(payload);

            if (!response?.success) {
                throw new Error(
                    response?.message ||
                    "Failed to save role rights"
                );
            }

            toast.success(
                "Role rights saved successfully."
            );

            await loadRoleRights(
                Number(selectedDesignationId)
            );
        } catch (error) {
            console.error(
                "SAVE ROLE RIGHTS ERROR:",
                error
            );

            toast.error(
                error?.message ||
                "Failed to save role rights."
            );
        } finally {
            setSaving(false);
        }
    };

    const saveUserRights = async () => {
        if (!selectedUserId) {
            toast.error("Select a user first.");
            return;
        }

        if (userRights.length === 0) {
            toast.error(
                "No user rights are available to save."
            );
            return;
        }

        const selectedUserData =
            users.find(
                (user) =>
                    Number(
                        user.idUser ??
                        user.IDUser
                    ) === Number(selectedUserId)
            );

        const userDesignationId =
            selectedUserData?.idDesignation ??
            selectedUserData?.IDDesignation;

        if (!userDesignationId) {
            toast.error(
                "Designation is not assigned to this user."
            );
            return;
        }

        try {
            setSaving(true);

            for (const right of userRights) {
                /*
                    Custom enabled:

                    Save this user's personal values.
                */
                if (right.hasUserOverride) {
                    const response =
                        await userRightService
                            .saveForUser({
                                idUser:
                                    Number(
                                        selectedUserId
                                    ),

                                idDesignation:
                                    Number(
                                        userDesignationId
                                    ),

                                idPage:
                                    Number(
                                        right.idPage
                                    ),

                                canView:
                                    Boolean(
                                        right.canView
                                    ),

                                canCreate:
                                    Boolean(
                                        right.canCreate
                                    ),

                                canEdit:
                                    Boolean(
                                        right.canEdit
                                    ),

                                // Delete is unsupported.
                                canDelete: false
                            });

                    if (!response?.success) {
                        throw new Error(
                            response?.message ||
                            `Failed to save ${right.pageName}`
                        );
                    }
                }

                /*
                    Custom was previously enabled but
                    the administrator removed it.

                    Save zero permissions so that the
                    existing user-specific row is cleared.
                */
                if (
                    !right.hasUserOverride &&
                    right.originalHasUserOverride
                ) {
                    const response =
                        await userRightService
                            .saveForUser({
                                idUser:
                                    Number(
                                        selectedUserId
                                    ),

                                idDesignation:
                                    Number(
                                        userDesignationId
                                    ),

                                idPage:
                                    Number(
                                        right.idPage
                                    ),

                                canView: false,
                                canCreate: false,
                                canEdit: false,
                                canDelete: false
                            });

                    if (!response?.success) {
                        throw new Error(
                            response?.message ||
                            `Failed to clear ${right.pageName}`
                        );
                    }
                }
            }

            toast.success(
                "User-specific rights saved successfully."
            );

            await loadUserRights(
                Number(selectedUserId)
            );
        } catch (error) {
            console.error(
                "SAVE USER RIGHTS ERROR:",
                error
            );

            toast.error(
                error?.message ||
                "Failed to save user rights."
            );
        } finally {
            setSaving(false);
        }
    };

    const selectedUser =
        users.find(
            (user) =>
                Number(
                    user.idUser ??
                    user.IDUser
                ) === Number(selectedUserId)
        );

    const tableColumnCount =
        activeTab === "user" ? 5 : 4;

    return (
        <div className="p-6 space-y-6">
            {/* Page heading */}
            <div>
                <h1 className="flex items-center gap-3 text-3xl font-black text-foreground">
                    <ShieldCheck
                        className="text-gold"
                        size={32}
                    />

                    User Rights
                </h1>

                <p className="mt-2 text-muted-foreground">
                    Manage designation permissions and
                    user-specific access.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 rounded-xl border border-border bg-card p-2">
                <button
                    type="button"
                    onClick={() => changeTab("role")}
                    className={`flex items-center gap-2 rounded-lg px-5 py-3 font-bold transition ${
                        activeTab === "role"
                            ? "bg-gold text-white"
                            : "text-muted-foreground hover:bg-muted"
                    }`}
                >
                    <ShieldCheck size={18} />
                    Role Access
                </button>

                <button
                    type="button"
                    onClick={() => changeTab("user")}
                    className={`flex items-center gap-2 rounded-lg px-5 py-3 font-bold transition ${
                        activeTab === "user"
                            ? "bg-gold text-white"
                            : "text-muted-foreground hover:bg-muted"
                    }`}
                >
                    <Users size={18} />
                    User Access
                </button>
            </div>

            {/* Selector */}
            <div className="rounded-2xl border border-border bg-card p-5">
                <label className="mb-2 block font-bold text-foreground">
                    {activeTab === "role"
                        ? "Select Role / Designation"
                        : "Search and Select User"}
                </label>

                {activeTab === "role" ? (
                    <select
                        value={selectedDesignationId}
                        onChange={handleRoleChange}
                        className="input-ui w-full max-w-lg"
                    >
                        <option value="">
                            Select designation
                        </option>

                        {designations.map((item) => {
                            const id =
                                item.idDesignation ??
                                item.IDDesignation;

                            const name =
                                item.designationName ??
                                item.DesignationName;

                            return (
                                <option
                                    key={id}
                                    value={id}
                                >
                                    {name}
                                </option>
                            );
                        })}
                    </select>
                ) : (
                    <select
                        value={selectedUserId}
                        onChange={handleUserChange}
                        className="input-ui w-full max-w-lg"
                    >
                        <option value="">
                            Select employee
                        </option>

                        {users.map((item) => {
                            const id =
                                item.idUser ??
                                item.IDUser;

                            const name =
                                item.userFullName ??
                                item.UserFullName ??
                                "Unknown employee";

                            const employeeCode =
                                item.airaEmployeeCode ??
                                item.AiraEmployeeCode ??
                                item.userName ??
                                item.UserName ??
                                "";

                            return (
                                <option
                                    key={id}
                                    value={id}
                                >
                                    {name}
                                    {" — "}
                                    {employeeCode}
                                </option>
                            );
                        })}
                    </select>
                )}

                {activeTab === "user" &&
                    selectedUser && (
                        <p className="mt-3 text-sm text-muted-foreground">
                            Designation:{" "}
                            <strong className="text-foreground">
                                {selectedUser
                                    .designationName ??
                                    selectedUser
                                        .DesignationName ??
                                    "Not assigned"}
                            </strong>
                        </p>
                    )}
            </div>

            {/* Bulk controls and Save button */}
            {currentRights.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            disabled={saving}
                            onClick={() =>
                                setAllPagePermissions(
                                    !areAllPagePermissionsSelected
                                )
                            }
                            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 font-bold text-foreground transition hover:bg-muted disabled:opacity-50"
                        >
                            {areAllPagePermissionsSelected ? (
                                <CheckSquare
                                    size={18}
                                    className="text-gold"
                                />
                            ) : (
                                <Square size={18} />
                            )}

                            {areAllPagePermissionsSelected
                                ? "Clear All Pages"
                                : "Select All Pages"}
                        </button>

                        {activeTab === "user" && (
                            <button
                                type="button"
                                disabled={saving}
                                onClick={() =>
                                    setAllUserOverrides(
                                        !isAllUserOverridesSelected
                                    )
                                }
                                className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 font-bold text-foreground transition hover:bg-muted disabled:opacity-50"
                            >
                                {isAllUserOverridesSelected ? (
                                    <CheckSquare
                                        size={18}
                                        className="text-gold"
                                    />
                                ) : (
                                    <Square size={18} />
                                )}

                                {isAllUserOverridesSelected
                                    ? "Clear All Custom"
                                    : "Make All Custom"}
                            </button>
                        )}
                    </div>

                    <button
                        type="button"
                        disabled={saving || loading}
                        onClick={
                            activeTab === "role"
                                ? saveRoleRights
                                : saveUserRights
                        }
                        className="flex items-center gap-2 rounded-lg bg-gold px-6 py-3 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saving ? (
                            <RefreshCw
                                size={18}
                                className="animate-spin"
                            />
                        ) : (
                            <Save size={18} />
                        )}

                        {saving
                            ? "Saving..."
                            : "Save Rights"}
                    </button>
                </div>
            )}

            {/* Rights table */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-muted">
                            <tr>
                                {activeTab === "user" && (
                                    <th className="px-5 py-4 text-center">
                                        <label className="inline-flex cursor-pointer items-center justify-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    isAllUserOverridesSelected
                                                }
                                                disabled={
                                                    currentRights.length ===
                                                    0
                                                }
                                                onChange={(event) =>
                                                    setAllUserOverrides(
                                                        event.target
                                                            .checked
                                                    )
                                                }
                                                className="h-5 w-5 accent-gold"
                                                aria-label="Select all custom overrides"
                                            />

                                            <span>Custom</span>
                                        </label>
                                    </th>
                                )}

                                <th className="px-5 py-4 text-left">
                                    <label className="inline-flex cursor-pointer items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={
                                                areAllPagePermissionsSelected
                                            }
                                            disabled={
                                                currentRights.length ===
                                                0
                                            }
                                            onChange={(event) =>
                                                setAllPagePermissions(
                                                    event.target
                                                        .checked
                                                )
                                            }
                                            className="h-5 w-5 accent-gold"
                                            aria-label="Select all page permissions"
                                        />

                                        <span>Page</span>
                                    </label>
                                </th>

                                <th className="px-5 py-4 text-center">
                                    <label className="inline-flex cursor-pointer items-center justify-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={isPermissionSelectedForAll(
                                                "canView"
                                            )}
                                            disabled={
                                                currentRights.length ===
                                                0
                                            }
                                            onChange={(event) =>
                                                setPermissionForAll(
                                                    "canView",
                                                    event.target
                                                        .checked
                                                )
                                            }
                                            className="h-5 w-5 accent-gold"
                                            aria-label="Select View for all pages"
                                        />

                                        <span>View</span>
                                    </label>
                                </th>

                                <th className="px-5 py-4 text-center">
                                    <label className="inline-flex cursor-pointer items-center justify-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={isPermissionSelectedForAll(
                                                "canCreate"
                                            )}
                                            disabled={
                                                currentRights.length ===
                                                0
                                            }
                                            onChange={(event) =>
                                                setPermissionForAll(
                                                    "canCreate",
                                                    event.target
                                                        .checked
                                                )
                                            }
                                            className="h-5 w-5 accent-gold"
                                            aria-label="Select Create for all pages"
                                        />

                                        <span>Create</span>
                                    </label>
                                </th>

                                <th className="px-5 py-4 text-center">
                                    <label className="inline-flex cursor-pointer items-center justify-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={isPermissionSelectedForAll(
                                                "canEdit"
                                            )}
                                            disabled={
                                                currentRights.length ===
                                                0
                                            }
                                            onChange={(event) =>
                                                setPermissionForAll(
                                                    "canEdit",
                                                    event.target
                                                        .checked
                                                )
                                            }
                                            className="h-5 w-5 accent-gold"
                                            aria-label="Select Edit for all pages"
                                        />

                                        <span>Edit</span>
                                    </label>
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={
                                            tableColumnCount
                                        }
                                        className="py-16 text-center"
                                    >
                                        <RefreshCw
                                            className="mx-auto animate-spin text-gold"
                                            size={28}
                                        />

                                        <p className="mt-3 text-sm text-muted-foreground">
                                            Loading rights...
                                        </p>
                                    </td>
                                </tr>
                            ) : currentRights.length ===
                              0 ? (
                                <tr>
                                    <td
                                        colSpan={
                                            tableColumnCount
                                        }
                                        className="py-16 text-center text-muted-foreground"
                                    >
                                        {activeTab === "role"
                                            ? "Select a designation to manage its rights."
                                            : "Select an employee to manage personal rights."}
                                    </td>
                                </tr>
                            ) : (
                                currentRights.map(
                                    (right, index) => (
                                        <tr
                                            key={`${activeTab}-${right.idPage}`}
                                            className="border-b border-border transition last:border-b-0 hover:bg-muted/30"
                                        >
                                            {activeTab ===
                                                "user" && (
                                                <td className="px-5 py-4 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            right.hasUserOverride
                                                        }
                                                        onChange={() =>
                                                            toggleUserOverride(
                                                                index
                                                            )
                                                        }
                                                        className="h-5 w-5 accent-gold"
                                                        aria-label={`Custom rights for ${right.pageName}`}
                                                    />
                                                </td>
                                            )}

                                            <td className="px-5 py-4 font-bold text-foreground">
                                                {right.pageName}
                                            </td>

                                            {permissionFields.map(
                                                (field) => (
                                                    <td
                                                        key={
                                                            field
                                                        }
                                                        className="px-5 py-4 text-center"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={Boolean(
                                                                right[
                                                                    field
                                                                ]
                                                            )}
                                                            disabled={
                                                                activeTab ===
                                                                    "user" &&
                                                                !right.hasUserOverride
                                                            }
                                                            onChange={() =>
                                                                toggleRight(
                                                                    index,
                                                                    field
                                                                )
                                                            }
                                                            className="h-5 w-5 accent-gold disabled:cursor-not-allowed disabled:opacity-30"
                                                            aria-label={`${field} permission for ${right.pageName}`}
                                                        />
                                                    </td>
                                                )
                                            )}
                                        </tr>
                                    )
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserRightForm;