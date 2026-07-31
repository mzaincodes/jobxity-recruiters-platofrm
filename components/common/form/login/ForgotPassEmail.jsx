"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { BeatLoader } from "react-spinners";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

// Zod schema for email validation
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function ForgotPassEmail({ onOtpSent }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
  });

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState(""); // Success message state
  const [email, setEmail] = useState(""); // New state to hold the email

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setApiError(""); // Reset error state
      setApiSuccess(""); // Reset success state

      // API call to send OTP
      const response = await axios.post(
        "/api/user/recruiter/forgot-password",
        data
      );

      if (response.status === 200) {
        // Set success message
        setApiSuccess("OTP sent successfully. Check your email.");
        
        // Save the email in local storage
        localStorage.setItem("forgotEmail", data.email);
        setEmail(data.email); // Set email state
        
        // Call the onOtpSent callback to notify the parent component
        onOtpSent();

        reset(); // Clear form fields
      }
    } catch (error) {
      console.log(error.data?.error )
      setApiError(error?.response?.data?.error || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h3 className="text-center text-primary fw-bold mb-3">Forgot Password</h3>

      <form className="w-100" onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            style={{ textTransform: "lowercase" }}
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            {...register("email")}
            onChange={(e) => {
              // Clear the API error on typing
              setApiError("");
        
              // Convert the email input to lowercase and update the form value
              const lowerCaseEmail = e.target.value.toLowerCase();
              setValue("email", lowerCaseEmail, { shouldValidate: true, shouldDirty: true });
            }}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email.message}</div>
          )}
        </div>

        {/* API Response Messages */}
        {apiError && <div className="alert alert-danger">{apiError}</div>}
        {apiSuccess && <div className="alert alert-success">{apiSuccess}</div>}

        {/* Submit Button */}
        <button type="submit" className="theme-btn btn-style-one mt-4 w-100" disabled={loading}>
          {loading ? <BeatLoader color="#ffffff" loading={loading} cssOverride={override} size={6} /> : "Send OTP"}
        </button>
      </form>
    </div>
  );
}
