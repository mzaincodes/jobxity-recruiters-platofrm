import React, { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import { BeatLoader } from "react-spinners";
import axios from "axios";
import { TickVerifiedIcon } from "@/public/svg/svg";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

function ForgotOtp({ onSuccesss }) {
  // onSuccess prop is passed from Register
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const [myEmail, setMyEmail] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("forgotEmail");
    if (storedEmail) {
      setMyEmail(storedEmail);
    }
  }, []);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "/api/user/recruiter/forgot-password-otp",
        {
          email: myEmail,
          f_otp: otp,
        }
      );

      if (response.status === 200) {
        console.log("Toysssssssss")
        setSuccess(true);
        onSuccesss();
      } else {
        setError("OTP Verification Failed");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="container bg-white rounded-lg px-4 sm:px-5 d-flex flex-column align-items-center justify-content-start">
        <p className="main-font text-center small sm:text-base">
          An OTP has been sent to your email. Please enter it below.
        </p>
        <p className="main-font text-center small sm:text-base mb-3">
          Kindly also check your spam folder
        </p>
        <form className="w-100" onSubmit={handleVerifyOtp}>
          <div className="w-100 sm-mb-1 mt-3 d-flex flex-column justify-content-start align-items-center">
            <OTPInput
              value={otp}
              onChange={(value) => {
                setOtp(value);
                setError(""); // Clear error on input change
              }}
              numInputs={6}
              inputType="tel"
              renderSeparator={<span></span>}
              renderInput={(props) => <input {...props} />}
              inputStyle={{
                width: "35px",
                height: "35px",
                margin: "0 5px",
                fontSize: "18px",
                borderRadius: "4px",
                border: error ? "1px solid red" : "1px solid #ccc",
              }}
            />
          </div>
          {error && (
            <p
              className="w-100 font-weight-semibold text-center text-danger mt-2"
              style={{ fontSize: "12px" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="main-font font-weight-bold w-100 h-42 d-flex align-items-center justify-content-center text-white mt-5 mb-4 rounded-sm sm:rounded-lg text-xs sm:text-base outline-none"
            style={{
              backgroundColor: "#1967d2",
              height: "42px",
              borderRadius: "10px",
            }}
            disabled={loading}
          >
            {loading ? (
              <BeatLoader
                color={color}
                loading={loading}
                cssOverride={override}
                size={6}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotOtp;
