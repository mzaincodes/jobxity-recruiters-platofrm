"use client";
import { useState } from "react";
import Register from "../register/Register";
import ForgotPassEmail from "./ForgotPassEmail";
import FormContent from "./FormContent";
import ForgotOtp from "./ForgotOtp";
import SetForgotPassword from "./SetForgotPassword";

const LoginPopup = () => {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false); 
  const [isOtpVerified, setIsOtpVerified] = useState(false); 
  return (
    <>
      <div className="modal fade" id="loginPopupModal">
        <div className="modal-dialog modal-lg modal-dialog-centered login-modal modal-dialog-scrollable">
          <div className="modal-content">
            <button
              type="button"
              className="closed-modal"
              data-bs-dismiss="modal"
            ></button>
            {/* End close modal btn */}

            <div className="modal-body">
              {/* <!-- Login modal --> */}
              <div id="login-modal">
                {/* <!-- Login Form --> */}
                <div className="login-form default-form">
                {isForgotPassword ? (
                    isOtpVerified ? ( 
                      <SetForgotPassword />
                    ) : isOtpSent ? (
                      <ForgotOtp onSuccesss={() => setIsOtpVerified(true)} /> // ✅ Handle OTP verification success
                    ) : (
                      <ForgotPassEmail onOtpSent={() => setIsOtpSent(true)} />
                    )
                  ) : (
                    <FormContent onForgotPassword={() => setIsForgotPassword(true)} />
                  )}
                </div>
                {/* <!--End Login Form --> */}
              </div>
              {/* <!-- End Login Module --> */}
            </div>
            {/* En modal-body */}
          </div>
          {/* End modal-content */}
        </div>
      </div>
      {/* <!-- Login Popup Modal --> */}

      <div className="modal fade" id="registerModal">
        <div className="modal-dialog modal-lg modal-dialog-centered login-modal modal-dialog-scrollable">
          <div className="modal-content">
            <button
              type="button"
              className="closed-modal"
              data-bs-dismiss="modal"
            ></button>
            {/* End close modal btn */}

            <div className="modal-body">
              {/* <!-- Login modal --> */}
              <div id="login-modal">
                {/* <!-- Login Form --> */}
                <div className="login-form default-form">
                  <Register />
                </div>
                {/* <!--End Login Form --> */}
              </div>
              {/* <!-- End Login Module --> */}
            </div>
            {/* En modal-body */}
          </div>
          {/* End modal-content */}
        </div>
      </div>
      {/* <!-- Login Popup Modal --> */}
    </>
  );
};

export default LoginPopup;
