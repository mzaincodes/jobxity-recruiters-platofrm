// "use client";

// import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
// import LoginWithSocial from "./LoginWithSocial";
// import Form from "./FormContent";
// import Link from "next/link";

// const Register = () => {
//   return (
//     <div className="form-inner">
//       <h3>Signup as a Recruiter!</h3>

//       <Form />

//       <div className="bottom-box">
//         <div className="text">
//           Already have an account?{" "}
//           <Link
//             href="#"
//             className="call-modal login"
//             data-bs-toggle="modal"
//             data-bs-dismiss="modal"
//             data-bs-target="#loginPopupModal"
//           >
//             LogIn
//           </Link>
//         </div>
//   <div className="divider">
//     <span>or</span>
//   </div>
//   <LoginWithSocial />
// </div>
//       {/* End bottom-box LoginWithSocial */}
//     </div>
//   );
// };

// export default Register;

"use client";

import { useState } from "react";
import LoginWithSocial from "./LoginWithSocial";
import Form from "./FormContent";
import Link from "next/link";
import RegOtp from "./RegOtp";

const Register = () => {
  const [showOTP, setShowOTP] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  return (
    <>
      <div className="form-inner">
        {verificationSuccess ? (
          <h3>Verification Successful</h3>
        ) : showOTP ? (
          <h3>Verify your email!</h3>
        ) : (
          <h3>Signup to Jobxity</h3>
        )}

        {showOTP ? (
          <RegOtp onSuccess={() => setVerificationSuccess(true)} />
        ) : (
          <Form onSuccess={() => setShowOTP(true)} />
        )}
      </div>
      {/* {showOTP ? null : (
        <div className="bottom-box">
          <div className="divider">
            <span>or</span>
          </div>
          <div className="mb-3">
            <span>Login with</span>
          </div>
          <LoginWithSocial />
        </div>
      )} */}
    </>
  );
};

export default Register;
