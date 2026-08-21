


// import React, { useEffect, useRef, useState } from "react";
// import { sendOtp, verifyOtp } from "../api/authApi";
// import { userRightService } from "../api/userRightService";
// import "../css/login.css";

// const OTP_VALIDITY_SECONDS = 5 * 60;

// const Login = () => {
//   const [loginStep, setLoginStep] = useState("credentials");
//   const [employeeCode, setEmployeeCode] = useState("");
//   const [password, setPassword] = useState("");
//   const [otp, setOtp] = useState("");
//   const [airaUserId, setAiraUserId] = useState(null);
//   const [maskedMobile, setMaskedMobile] = useState("");
//   const [remainingSeconds, setRemainingSeconds] = useState(0);
//   const [otpExpiresAt, setOtpExpiresAt] = useState(null);
//   const [otpExpired, setOtpExpired] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const otpInputRefs = useRef([]);

//   useEffect(() => {
//     if (!otpExpiresAt) return;

//     const updateTimer = () => {
//       const remaining = Math.max(
//         0,
//         Math.ceil((otpExpiresAt - Date.now()) / 1000)
//       );

//       setRemainingSeconds(remaining);

//       if (remaining === 0) {
//         setOtpExpired(true);
//       }
//     };

//     updateTimer();

//     const timer = setInterval(updateTimer, 1000);

//     return () => clearInterval(timer);
//   }, [otpExpiresAt]);

//   const formatTimer = () => {
//     const minutes = Math.floor(remainingSeconds / 60)
//       .toString()
//       .padStart(2, "0");

//     const seconds = (remainingSeconds % 60)
//       .toString()
//       .padStart(2, "0");

//     return `${minutes}:${seconds}`;
//   };

//   const handleSendOtp = async (event) => {
//     event?.preventDefault();

//     if (!employeeCode.trim() || !password) {
//       setError("Employee code and password are required.");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setOtp("");
//     setOtpExpired(false);
//     setRemainingSeconds(0);

//     try {
//       const response = await sendOtp(
//         employeeCode.trim(),
//         password
//       );

//       if (!response.success || !response.data) {
//         setError(response.message || "Unable to send OTP.");
//         return;
//       }

//       setAiraUserId(response.data.idUser);
//       setMaskedMobile(response.data.maskedMobile || "");
//       setOtpExpiresAt(Date.now() + OTP_VALIDITY_SECONDS * 1000);
//       setLoginStep("otp");

//       setTimeout(() => {
//         otpInputRefs.current[0]?.focus();
//       }, 150);
//     } catch (error) {
//       setError(error.message || "Unable to send OTP.");
//     } finally {
//       setLoading(false);
//     }
//   };










// const handleVerifyOtp = async (otpCode = otp) => {
//   if (loading) return;

//   // =========================================
//   // OTP EXPIRED
//   // =========================================
//   if (otpExpired) {
//     setError("OTP expired. Please request a new OTP.");
//     return;
//   }

//   // =========================================
//   // OTP VALIDATION
//   // =========================================
//   if (!/^\d{6}$/.test(otpCode)) {
//     setError("Please enter the complete 6-digit OTP.");
//     return;
//   }

//   setLoading(true);
//   setError("");

//   try {
//     // =========================================
//     // VERIFY OTP
//     // =========================================
//     const response = await verifyOtp(
//       airaUserId,
//       otpCode,
//       employeeCode.trim()
//     );

//     if (!response?.success || !response?.token) {
//       setError(
//         response?.message ||
//           "OTP verification failed."
//       );
//       return;
//     }

//     const user = response.user;

//     if (!user) {
//       setError("User information not found.");
//       return;
//     }

//     // =========================================
//     // NORMALIZE USER INFORMATION
//     // =========================================
//     const idUser = Number(
//       user.idUser ??
//         user.IDUser ??
//         0
//     );

//     const idDesignation = Number(
//       user.idDesignation ??
//         user.IDDesignation ??
//         0
//     );

//     const airaRoleId = Number(
//       user.airaRoleId ??
//         user.AiraRoleId ??
//         0
//     );

//     const airaRoleName = String(
//       user.airaRoleName ??
//         user.AiraRoleName ??
//         ""
//     )
//       .trim()
//       .toUpperCase();

//     const backendSuperAdmin =
//       user.isSuperAdmin === true ||
//       user.IsSuperAdmin === true;

//     const isMasterAdmin =
//       backendSuperAdmin ||
//       airaRoleId === 1 ||
//       airaRoleName === "MASTER_ADMIN";

//     console.log("LOGIN USER:", user);
//     console.log("LOCAL QMS USER ID:", idUser);
//     console.log(
//       "DESIGNATION ID:",
//       idDesignation
//     );
//     console.log("AIRA ROLE ID:", airaRoleId);
//     console.log(
//       "AIRA ROLE NAME:",
//       airaRoleName
//     );
//     console.log(
//       "IS MASTER ADMIN:",
//       isMasterAdmin
//     );

//     // =========================================
//     // LOCAL QMS USER ID IS REQUIRED
//     // =========================================
//     if (idUser <= 0) {
//       setError(
//         "Unable to identify the local QMS user."
//       );
//       return;
//     }

//     // =========================================
//     // NORMAL USER MUST HAVE DESIGNATION
//     // =========================================
//     if (
//       !isMasterAdmin &&
//       idDesignation <= 0
//     ) {
//       setError(
//         "You have not been assigned required permissions by the administrator. Please contact your admin."
//       );
//       return;
//     }

//     // =========================================
//     // PREPARE USER OBJECT
//     // =========================================
//     const loggedInUser = {
//       ...user,
//       idUser,
//       idDesignation:
//         idDesignation > 0
//           ? idDesignation
//           : null,
//       isSuperAdmin: isMasterAdmin
//     };

//     // =========================================
//     // MASTER ADMIN
//     // =========================================
//     if (isMasterAdmin) {
//       localStorage.setItem(
//         "token",
//         response.token
//       );

//       localStorage.setItem(
//         "user",
//         JSON.stringify(loggedInUser)
//       );

//       localStorage.setItem(
//         "userRights",
//         JSON.stringify([])
//       );

//       window.location.href = "/dashboard";
//       return;
//     }

//     // =========================================
//     // LOAD NORMAL USER'S EFFECTIVE RIGHTS
//     // =========================================
//     const rightsResponse =
//       await userRightService.getForUser(
//         idUser
//       );

//     if (!rightsResponse?.success) {
//       throw new Error(
//         rightsResponse?.message ||
//           "Failed to load user rights."
//       );
//     }

//     const finalRights = Array.isArray(
//       rightsResponse.data
//     )
//       ? rightsResponse.data
//       : [];

//     console.log(
//       "FINAL USER RIGHTS:",
//       finalRights
//     );

//     // =========================================
//     // PAGE CODE TO FRONTEND ROUTE MAPPING
//     // =========================================
//     const pagePathMap = {
//       DASHBOARD: "/dashboard",
//       COMPANY: "/company",
//       LOCATION: "/location",
//       DEPARTMENT: "/department",
//       DESIGNATION: "/designation",
//       USER: "/users",
//       USER_RIGHTS: "/user-rights",
//       PAGE_MASTER: "/page-master",
//       CERTIFICATE_TYPE:
//         "/certificate-type",
//       CERTIFICATE: "/certificate",
//       APPROVAL:
//         "/certificate/approvals",
//       REMINDER_CENTER:
//         "/reminder-center"
//     };

//     // =========================================
//     // GET ALL VIEWABLE PAGES
//     // =========================================
//     const allowedPages = finalRights
//       .map((right) => {
//         const pageCode = String(
//           right.pageCode ??
//             right.PageCode ??
//             ""
//         )
//           .trim()
//           .toUpperCase();

//         const canView =
//           right.canView === true ||
//           right.CanView === true ||
//           right.canView === 1 ||
//           right.CanView === 1 ||
//           right.canView === "1" ||
//           right.CanView === "1";

//         return {
//           ...right,
//           normalizedPageCode: pageCode,
//           normalizedCanView: canView
//         };
//       })
//       .filter(
//         (right) =>
//           right.normalizedCanView &&
//           right.normalizedPageCode !== ""
//       );

//     console.log(
//       "ALLOWED PAGES:",
//       allowedPages
//     );

//     // =========================================
//     // USER HAS NO VIEW RIGHTS
//     // =========================================
//     if (allowedPages.length === 0) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       localStorage.removeItem(
//         "userRights"
//       );

//       setError(
//         "You do not have permission to access any page. Please contact your administrator."
//       );
//       return;
//     }

//     // =========================================
//     // FIND FIRST PAGE THAT EXISTS IN FRONTEND
//     // =========================================
//     const firstAccessiblePage =
//       allowedPages.find((right) =>
//         Boolean(
//           pagePathMap[
//             right.normalizedPageCode
//           ]
//         )
//       );

//     if (!firstAccessiblePage) {
//       console.error(
//         "Rights exist, but no matching frontend route was found:",
//         allowedPages
//       );

//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       localStorage.removeItem(
//         "userRights"
//       );

//       setError(
//         "Your permissions do not match any available application page. Please contact your administrator."
//       );
//       return;
//     }

//     // =========================================
//     // SAVE AUTHENTICATION AND RIGHTS
//     // =========================================
//     localStorage.setItem(
//       "token",
//       response.token
//     );

//     localStorage.setItem(
//       "user",
//       JSON.stringify(loggedInUser)
//     );

//     localStorage.setItem(
//       "userRights",
//       JSON.stringify(finalRights)
//     );

//     // =========================================
//     // REDIRECT
//     //
//     // Prefer Dashboard when permitted.
//     // Otherwise open the first allowed page.
//     // =========================================
//     const dashboardRight =
//       allowedPages.find(
//         (right) =>
//           right.normalizedPageCode ===
//           "DASHBOARD"
//       );

//     const destinationPath = dashboardRight
//       ? pagePathMap.DASHBOARD
//       : pagePathMap[
//           firstAccessiblePage
//             .normalizedPageCode
//         ];

//     console.log(
//       "LOGIN REDIRECT:",
//       destinationPath
//     );

//     window.location.href =
//       destinationPath;
//   } catch (error) {
//     console.error(
//       "LOGIN ERROR:",
//       error
//     );

//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     localStorage.removeItem("userRights");

//     setError(
//       error?.response?.data?.message ||
//         error?.message ||
//         "OTP verification failed."
//     );
//   } finally {
//     setLoading(false);
//   }
// };
//   const handleOtpChange = (index, value) => {
//     if (loading || otpExpired) return;

//     const digit = value.replace(/\D/g, "").slice(-1);

//     const otpArray = otp
//       .padEnd(6, " ")
//       .split("");

//     otpArray[index] = digit || " ";

//     const nextOtp = otpArray
//       .join("")
//       .replace(/\s/g, "")
//       .slice(0, 6);

//     setOtp(nextOtp);
//     setError("");

//     if (digit && index < 5) {
//       otpInputRefs.current[index + 1]?.focus();
//     }

//     if (nextOtp.length === 6) {
//       handleVerifyOtp(nextOtp);
//     }
//   };

//   const handleOtpKeyDown = (index, event) => {
//     if (loading || otpExpired) return;

//     if (
//       event.key === "Backspace" &&
//       !otp[index] &&
//       index > 0
//     ) {
//       otpInputRefs.current[index - 1]?.focus();
//     }

//     if (event.key === "ArrowLeft" && index > 0) {
//       otpInputRefs.current[index - 1]?.focus();
//     }

//     if (event.key === "ArrowRight" && index < 5) {
//       otpInputRefs.current[index + 1]?.focus();
//     }
//   };

//   const handleOtpPaste = (event) => {
//     event.preventDefault();

//     if (loading || otpExpired) return;

//     const pastedOtp = event.clipboardData
//       .getData("text")
//       .replace(/\D/g, "")
//       .slice(0, 6);

//     setOtp(pastedOtp);
//     setError("");

//     const focusIndex = Math.min(pastedOtp.length, 5);
//     otpInputRefs.current[focusIndex]?.focus();

//     if (pastedOtp.length === 6) {
//       handleVerifyOtp(pastedOtp);
//     }
//   };

//   const handleBackToLogin = () => {
//     setLoginStep("credentials");
//     setOtp("");
//     setAiraUserId(null);
//     setMaskedMobile("");
//     setOtpExpiresAt(null);
//     setRemainingSeconds(0);
//     setOtpExpired(false);
//     setError("");
//   };

//   return (
//     <main className="login-page">
//       <section className="login-panel">
//         <div className="login-brand">
//           <div className="login-brand-mark">Q</div>

//           <div>
//             <strong>QMS</strong>
//             <span>Certificate Store</span>
//           </div>
//         </div>

//         <div className="login-panel-content">
//           <span className="login-eyebrow">
//             Quality Management System
//           </span>

//           <h1>Manage certificates with confidence.</h1>

//           <p>
//             Securely access certificate records, surveillance
//             reminders and compliance information.
//           </p>

//           <div className="login-panel-footer">
//             <span className="login-status-dot" />
//             Secure employee authentication
//           </div>
//         </div>
//       </section>

//       <section className="login-content">
//         <div className="login-card">
//           <div className="login-card-header">
//             <div className="login-mobile-mark">Q</div>

//             <span className="login-step">
//               {loginStep === "credentials"
//                 ? "01 / SIGN IN"
//                 : "02 / VERIFY"}
//             </span>

//             <h2>
//               {loginStep === "credentials"
//                 ? "Welcome back"
//                 : "Verify your identity"}
//             </h2>

//             <p>
//               {loginStep === "credentials"
//                 ? "Sign in using your employee credentials."
//                 : `Enter the 6-digit OTP sent to ${
//                     maskedMobile ||
//                     "your registered mobile number"
//                   }.`}
//             </p>
//           </div>

//           {error && (
//             <div className="login-error" role="alert">
//               {error}
//             </div>
//           )}

//           {loginStep === "credentials" && (
//             <form
//               className="login-form"
//               onSubmit={handleSendOtp}
//             >
//               <div className="login-field">
//                 <label htmlFor="employeeCode">
//                   Employee Code
//                 </label>

//                 <input
//                   id="employeeCode"
//                   type="text"
//                   value={employeeCode}
//                   autoComplete="username"
//                   placeholder="Enter employee code"
//                   onChange={(event) =>
//                     setEmployeeCode(event.target.value)
//                   }
//                   required
//                 />
//               </div>

//               <div className="login-field">
//                 <label htmlFor="password">
//                   Password
//                 </label>

//                 <input
//                   id="password"
//                   type="password"
//                   value={password}
//                   autoComplete="current-password"
//                   placeholder="Enter password"
//                   onChange={(event) =>
//                     setPassword(event.target.value)
//                   }
//                   required
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="login-primary-button"
//                 disabled={loading}
//               >
//                 {loading ? "Sending OTP..." : "Continue"}
//               </button>
//             </form>
//           )}

//           {loginStep === "otp" && (
//             <form
//               className="login-form"
//               onSubmit={(event) => {
//                 event.preventDefault();
//                 handleVerifyOtp();
//               }}
//             >
//               <div className="login-field">
//                 <label>One-Time Password</label>

//                 <div className="otp-grid">
//                   {[0, 1, 2, 3, 4, 5].map((index) => (
//                     <input
//                       key={index}
//                       ref={(element) => {
//                         otpInputRefs.current[index] = element;
//                       }}
//                       className="otp-input"
//                       type="text"
//                       inputMode="numeric"
//                       maxLength={1}
//                       value={otp[index] || ""}
//                       disabled={loading || otpExpired}
//                       onChange={(event) =>
//                         handleOtpChange(
//                           index,
//                           event.target.value
//                         )
//                       }
//                       onKeyDown={(event) =>
//                         handleOtpKeyDown(index, event)
//                       }
//                       onPaste={handleOtpPaste}
//                       aria-label={`OTP digit ${index + 1}`}
//                       required
//                     />
//                   ))}
//                 </div>

//                 <div className="otp-status-row">
//                   <span
//                     className={
//                       otpExpired
//                         ? "otp-expired"
//                         : "otp-timer"
//                     }
//                   >
//                     {otpExpired
//                       ? "OTP expired"
//                       : `OTP expires in ${formatTimer()}`}
//                   </span>

//                   {loading && (
//                     <span className="otp-verifying">
//                       Verifying...
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {otpExpired && (
//                 <button
//                   type="button"
//                   className="login-primary-button"
//                   onClick={handleSendOtp}
//                   disabled={loading}
//                 >
//                   Send OTP Again
//                 </button>
//               )}

//               <button
//                 type="button"
//                 className="login-back-button"
//                 onClick={handleBackToLogin}
//                 disabled={loading}
//               >
//                 Use different credentials
//               </button>
//             </form>
//           )}

//           <div className="login-card-footer">
//             <span>
//               © 2026 Aira Euro Automation Pvt. Ltd.
//             </span>

//             <span>Secure access portal</span>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// };

// export default Login;





import React, {
  useEffect,
  useRef,
  useState
} from "react";

import {
  sendOtp,
  verifyOtp
} from "../api/authApi";

import {
  userRightService
} from "../api/userRightService";

import "../css/login.css";

const OTP_VALIDITY_SECONDS = 5 * 60;

const PAGE_PATHS = {
  DASHBOARD: "/dashboard",
  COMPANY: "/company",
  LOCATION: "/location",
  DEPARTMENT: "/department",
  DESIGNATION: "/designation",
  USER: "/users",
  USER_RIGHTS: "/user-rights",
  PAGE_MASTER: "/page-master",
  CERTIFICATE_TYPE: "/certificate-type",
  CERTIFICATE: "/certificate",
  APPROVAL: "/certificate/approvals",
  REMINDER_CENTER: "/reminder-center"
};

const isPermissionEnabled = (value) => {
  return (
    value === true ||
    value === 1 ||
    value === "1"
  );
};

const clearAuthentication = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("userRights");
};

const Login = () => {
  const [loginStep, setLoginStep] =
    useState("credentials");

  const [employeeCode, setEmployeeCode] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [airaUserId, setAiraUserId] =
    useState(null);

  const [maskedMobile, setMaskedMobile] =
    useState("");

  const [remainingSeconds, setRemainingSeconds] =
    useState(0);

  const [otpExpiresAt, setOtpExpiresAt] =
    useState(null);

  const [otpExpired, setOtpExpired] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const otpInputRefs = useRef([]);

  useEffect(() => {
    if (!otpExpiresAt) {
      return;
    }

    const updateTimer = () => {
      const remaining = Math.max(
        0,
        Math.ceil(
          (otpExpiresAt - Date.now()) / 1000
        )
      );

      setRemainingSeconds(remaining);

      if (remaining === 0) {
        setOtpExpired(true);
      }
    };

    updateTimer();

    const timer = window.setInterval(
      updateTimer,
      1000
    );

    return () => {
      window.clearInterval(timer);
    };
  }, [otpExpiresAt]);

  const formatTimer = () => {
    const minutes = Math.floor(
      remainingSeconds / 60
    )
      .toString()
      .padStart(2, "0");

    const seconds = (
      remainingSeconds % 60
    )
      .toString()
      .padStart(2, "0");

    return `${minutes}:${seconds}`;
  };

  const handleSendOtp = async (event) => {
    event?.preventDefault();

    const normalizedEmployeeCode =
      employeeCode.trim();

    if (
      !normalizedEmployeeCode ||
      !password
    ) {
      setError(
        "Employee code and password are required."
      );

      return;
    }

    setLoading(true);
    setError("");
    setOtp("");
    setOtpExpired(false);
    setRemainingSeconds(0);

    // Remove any previous user's session.
    clearAuthentication();

    try {
      const response = await sendOtp(
        normalizedEmployeeCode,
        password
      );

      if (
        !response?.success ||
        !response?.data
      ) {
        setError(
          response?.message ||
            "Unable to send OTP."
        );

        return;
      }

      const receivedAiraUserId =
        response.data.idUser ??
        response.data.IDUser;

      if (!receivedAiraUserId) {
        setError(
          "Aira user information was not returned."
        );

        return;
      }

      setAiraUserId(receivedAiraUserId);

      setMaskedMobile(
        response.data.maskedMobile || ""
      );

      setOtpExpiresAt(
        Date.now() +
          OTP_VALIDITY_SECONDS * 1000
      );

      setLoginStep("otp");

      window.setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    } catch (requestError) {
      setError(
        requestError?.message ||
          "Unable to send OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (
    otpCode = otp
  ) => {
    if (loading) {
      return;
    }

    if (otpExpired) {
      setError(
        "OTP expired. Please request a new OTP."
      );

      return;
    }

    if (!/^\d{6}$/.test(otpCode)) {
      setError(
        "Please enter the complete 6-digit OTP."
      );

      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await verifyOtp(
        airaUserId,
        otpCode,
        employeeCode.trim()
      );

      if (
        !response?.success ||
        !response?.token
      ) {
        setError(
          response?.message ||
            "OTP verification failed."
        );

        return;
      }

      const user = response?.user;

      if (!user) {
        setError(
          "User information was not returned."
        );

        return;
      }

      const idUser = Number(
        user.idUser ??
          user.IDUser ??
          0
      );

      const idDesignation = Number(
        user.idDesignation ??
          user.IDDesignation ??
          0
      );

      /*
       * Use only the QMS backend Super Admin flag.
       * Do not grant QMS Super Admin access only
       * because the Aira role is MASTER_ADMIN.
       */
      const isSuperAdmin =
        user.isSuperAdmin === true ||
        user.IsSuperAdmin === true ||
        user.isSuperAdmin === 1 ||
        user.IsSuperAdmin === 1;

      if (idUser <= 0) {
        setError(
          "Unable to identify the local QMS user."
        );

        return;
      }

      if (
        !isSuperAdmin &&
        idDesignation <= 0
      ) {
        setError(
          "You have not been assigned a designation. Please contact your administrator."
        );

        return;
      }

      const loggedInUser = {
        ...user,

        idUser,

        idDesignation:
          idDesignation > 0
            ? idDesignation
            : null,

        isSuperAdmin
      };

      /*
       * IMPORTANT:
       * Save token before calling getForUser().
       *
       * The Axios request interceptor reads this
       * token and sends Authorization: Bearer ...
       */
      localStorage.setItem(
        "token",
        response.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(loggedInUser)
      );

      /*
       * Super Admin bypasses page-wise rights.
       */
      if (isSuperAdmin) {
        localStorage.setItem(
          "userRights",
          JSON.stringify([])
        );

        window.location.replace(
          "/dashboard"
        );

        return;
      }

      /*
       * Load effective rights:
       *
       * Designation rights
       *       +
       * User-specific rights
       */
      const rightsResponse =
        await userRightService.getForUser(
          idUser
        );

      if (!rightsResponse?.success) {
        throw new Error(
          rightsResponse?.message ||
            "Failed to load user rights."
        );
      }

      const finalRights = Array.isArray(
        rightsResponse?.data
      )
        ? rightsResponse.data
        : [];

      localStorage.setItem(
        "userRights",
        JSON.stringify(finalRights)
      );

      const allowedPages = finalRights
        .map((right) => {
          const pageCode = String(
            right.pageCode ??
              right.PageCode ??
              ""
          )
            .trim()
            .toUpperCase();

          const canView =
            isPermissionEnabled(
              right.canView
            ) ||
            isPermissionEnabled(
              right.CanView
            );

          return {
            ...right,
            normalizedPageCode: pageCode,
            normalizedCanView: canView
          };
        })
        .filter((right) => {
          return (
            right.normalizedCanView &&
            right.normalizedPageCode !== ""
          );
        });

      /*
       * User has a designation but Admin has not
       * provided access to any page.
       */
      if (allowedPages.length === 0) {
        window.location.replace("/403");
        return;
      }

      /*
       * Select only a page that exists in the
       * React application.
       */
      const accessiblePages =
        allowedPages.filter((right) => {
          return Boolean(
            PAGE_PATHS[
              right.normalizedPageCode
            ]
          );
        });

      if (accessiblePages.length === 0) {
        console.error(
          "No React route matches the user's rights:",
          allowedPages
        );

        window.location.replace("/403");
        return;
      }

      /*
       * Prefer Dashboard only when CanView is true.
       * Otherwise redirect to the first allowed page.
       */
      const dashboardRight =
        accessiblePages.find((right) => {
          return (
            right.normalizedPageCode ===
            "DASHBOARD"
          );
        });

      const destinationPath =
        dashboardRight
          ? PAGE_PATHS.DASHBOARD
          : PAGE_PATHS[
              accessiblePages[0]
                .normalizedPageCode
            ];

      window.location.replace(
        destinationPath
      );
    } catch (loginError) {
      console.error(
        "LOGIN ERROR:",
        loginError
      );

      clearAuthentication();

      setError(
        loginError?.response?.data?.message ||
          loginError?.message ||
          "OTP verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (
    index,
    value
  ) => {
    if (
      loading ||
      otpExpired
    ) {
      return;
    }

    const digit = value
      .replace(/\D/g, "")
      .slice(-1);

    const otpArray = otp
      .padEnd(6, " ")
      .split("");

    otpArray[index] =
      digit || " ";

    const nextOtp = otpArray
      .join("")
      .replace(/\s/g, "")
      .slice(0, 6);

    setOtp(nextOtp);
    setError("");

    if (
      digit &&
      index < 5
    ) {
      otpInputRefs.current[
        index + 1
      ]?.focus();
    }

    if (nextOtp.length === 6) {
      handleVerifyOtp(nextOtp);
    }
  };

  const handleOtpKeyDown = (
    index,
    event
  ) => {
    if (
      loading ||
      otpExpired
    ) {
      return;
    }

    if (
      event.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      otpInputRefs.current[
        index - 1
      ]?.focus();
    }

    if (
      event.key === "ArrowLeft" &&
      index > 0
    ) {
      otpInputRefs.current[
        index - 1
      ]?.focus();
    }

    if (
      event.key === "ArrowRight" &&
      index < 5
    ) {
      otpInputRefs.current[
        index + 1
      ]?.focus();
    }
  };

  const handleOtpPaste = (event) => {
    event.preventDefault();

    if (
      loading ||
      otpExpired
    ) {
      return;
    }

    const pastedOtp =
      event.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, 6);

    setOtp(pastedOtp);
    setError("");

    const focusIndex = Math.min(
      pastedOtp.length,
      5
    );

    otpInputRefs.current[
      focusIndex
    ]?.focus();

    if (pastedOtp.length === 6) {
      handleVerifyOtp(pastedOtp);
    }
  };

  const handleBackToLogin = () => {
    setLoginStep("credentials");
    setOtp("");
    setAiraUserId(null);
    setMaskedMobile("");
    setOtpExpiresAt(null);
    setRemainingSeconds(0);
    setOtpExpired(false);
    setError("");
  };

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="login-brand">
          <div className="login-brand-mark">
            Q
          </div>

          <div>
            <strong>QMS</strong>
            <span>Certificate Store</span>
          </div>
        </div>

        <div className="login-panel-content">
          <span className="login-eyebrow">
            Quality Management System
          </span>

          <h1>
            Manage certificates with confidence.
          </h1>

          <p>
            Securely access certificate records,
            surveillance reminders and compliance
            information.
          </p>

          <div className="login-panel-footer">
            <span className="login-status-dot" />

            Secure employee authentication
          </div>
        </div>
      </section>

      <section className="login-content">
        <div className="login-card">
          <div className="login-card-header">
            <div className="login-mobile-mark">
              Q
            </div>

            <span className="login-step">
              {loginStep === "credentials"
                ? "01 / SIGN IN"
                : "02 / VERIFY"}
            </span>

            <h2>
              {loginStep === "credentials"
                ? "Welcome back"
                : "Verify your identity"}
            </h2>

            <p>
              {loginStep === "credentials"
                ? "Sign in using your employee credentials."
                : `Enter the 6-digit OTP sent to ${
                    maskedMobile ||
                    "your registered mobile number"
                  }.`}
            </p>
          </div>

          {error && (
            <div
              className="login-error"
              role="alert"
            >
              {error}
            </div>
          )}

          {loginStep ===
            "credentials" && (
            <form
              className="login-form"
              onSubmit={handleSendOtp}
            >
              <div className="login-field">
                <label htmlFor="employeeCode">
                  Employee Code
                </label>

                <input
                  id="employeeCode"
                  type="text"
                  inputMode="numeric"
                  value={employeeCode}
                  autoComplete="username"
                  placeholder="Enter employee code"
                  onChange={(event) => {
                    setEmployeeCode(
                      event.target.value
                    );

                    setError("");
                  }}
                  required
                />
              </div>

              <div className="login-field">
                <label htmlFor="password">
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  autoComplete="current-password"
                  placeholder="Enter password"
                  onChange={(event) => {
                    setPassword(
                      event.target.value
                    );

                    setError("");
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                className="login-primary-button"
                disabled={loading}
              >
                {loading
                  ? "Sending OTP..."
                  : "Continue"}
              </button>
            </form>
          )}

          {loginStep === "otp" && (
            <form
              className="login-form"
              onSubmit={(event) => {
                event.preventDefault();
                handleVerifyOtp();
              }}
            >
              <div className="login-field">
                <label>
                  One-Time Password
                </label>

                <div className="otp-grid">
                  {[0, 1, 2, 3, 4, 5].map(
                    (index) => (
                      <input
                        key={index}
                        ref={(element) => {
                          otpInputRefs.current[
                            index
                          ] = element;
                        }}
                        className="otp-input"
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={
                          otp[index] || ""
                        }
                        disabled={
                          loading ||
                          otpExpired
                        }
                        onChange={(event) => {
                          handleOtpChange(
                            index,
                            event.target.value
                          );
                        }}
                        onKeyDown={(event) => {
                          handleOtpKeyDown(
                            index,
                            event
                          );
                        }}
                        onPaste={
                          handleOtpPaste
                        }
                        aria-label={`OTP digit ${
                          index + 1
                        }`}
                        required
                      />
                    )
                  )}
                </div>

                <div className="otp-status-row">
                  <span
                    className={
                      otpExpired
                        ? "otp-expired"
                        : "otp-timer"
                    }
                  >
                    {otpExpired
                      ? "OTP expired"
                      : `OTP expires in ${formatTimer()}`}
                  </span>

                  {loading && (
                    <span className="otp-verifying">
                      Verifying...
                    </span>
                  )}
                </div>
              </div>

              {otpExpired && (
                <button
                  type="button"
                  className="login-primary-button"
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  Send OTP Again
                </button>
              )}

              <button
                type="button"
                className="login-back-button"
                onClick={handleBackToLogin}
                disabled={loading}
              >
                Use different credentials
              </button>
            </form>
          )}

          <div className="login-card-footer">
            <span>
              © 2026 Aira Euro Automation
              Pvt. Ltd.
            </span>

            <span>
              Secure access portal
            </span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;