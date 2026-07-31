"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { TickVerifiedIcon } from "@/public/svg/svg";

const passwordSchema = z

  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(
    /(?=.*\d)(?=.*[A-Z])/,
    "Password must contain at least one digit and one uppercase letter"
  );

const schema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Both passwords must be the same",
  });

export default function SetForgotPassword({ toggleSection }) {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [myEmail, setMyEmail] = useState("");
  const [successdone, setSuccessdone] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("forgotEmail");
    if (storedEmail) {
      setMyEmail(storedEmail);
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setError("");

    try {
      console.log(myEmail, data.newPassword, data.confirmPassword);
      const response = await axios.post(
        "/api/user/recruiter/set-forgot-password",
        {
          email: myEmail,
          password: data.newPassword,
          confirmPassword: data.confirmPassword,
        }
      );

      if (response.status === 200) {
        localStorage.removeItem("forgotEmail");
        setSuccessdone(true);
        console.log("donwwwwwww")

        setTimeout(() => {
          window.location.reload();
        }, 1300);
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <>
      {!successdone ? (
        <div className="container d-flex flex-column align-items-center">
          <h2 className="text-primary fw-bold text-center mb-3">
            Reset Password
          </h2>

          <form className="w-100" onSubmit={handleSubmit(onSubmit)}>
            {/* New Password */}
            <div className="form-group position-relative mb-3">
              <label className="form-label">New Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showNewPassword ? "text" : "password"}
                  {...register("newPassword", {
                    onChange: () => clearErrors("newPassword"),
                  })}
                  className={`auth-fields-height form-control ${
                    errors.newPassword ? "is-invalid" : ""
                  }`}
                  placeholder="Enter new password"
                  style={{ paddingRight: "35px" }}
                />
                <span
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                >
                  <i
                    className={`bi ${
                      showNewPassword ? "bi-eye-slash" : "bi-eye"
                    }`}
                  ></i>
                </span>
              </div>
              {errors.newPassword && (
                <p className="text-danger small mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group position-relative mb-3">
              <label className="form-label">Confirm Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    onChange: () => clearErrors("confirmPassword"),
                  })}
                  className={`auth-fields-height form-control ${
                    errors.confirmPassword ? "is-invalid" : ""
                  }`}
                  placeholder="Confirm new password"
                  style={{ paddingRight: "35px" }}
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                >
                  <i
                    className={`bi ${
                      showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                    }`}
                  ></i>
                </span>
              </div>
              {errors.confirmPassword && (
                <p className="text-danger small mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            {error && <p className="text-danger text-sm mb-3">{error}</p>}

            <button
              type="submit"
              className="theme-btn btn-style-one mt-3 w-100 "
            >
              Reset Password
            </button>
          </form>
        </div>
      ) : (
        <div className="form-inner">
          <div className="d-flex mb-4 justify-content-center align-item-center">
            <TickVerifiedIcon />
          </div>
          <h3>Password Chnaged Successfully</h3>
          <h3>Please Login</h3>
        </div>
      )}
    </>
  );
}
