"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import LoginWithSocial from "./LoginWithSocial";

// ✅ Updated schema including role
const schema = z.object({
  firstName: z
    .string()
    .min(1, "First Name is required")
    .regex(/^[A-Za-z]+$/, "Only characters allowed"),
  lastName: z
    .string()
    .min(1, "Last Name is required")
    .regex(/^[A-Za-z]+$/, "Only characters allowed"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone Number is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /(?=.*\d)(?=.*[A-Z])/,
      "Password must contain at least one digit and one uppercase letter"
    ),
  role: z.string().min(1, "Please select a role"),
});

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const FormContent = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const [error, setError] = useState("");

  const [selectedRole, setSelectedRole] = useState("");

  const handleRoleSelect = (roleValue) => {
    const newRole = selectedRole === roleValue ? "" : roleValue;
    setSelectedRole(newRole);
    setValue("role", newRole);
    clearErrors("role");
  };

  const onSubmit = async (data) => {
    console.log("Form data:", data);
    setError("");
    try {
      setLoading(true);
      const response = await axios.post(
        "/api/user/recruiter/signup-recruiter",
        data
      );
      if (response.status === 200 || response.status === 201) {
        onSuccess();
        localStorage.setItem("myEmail", data?.email);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div>
      {/* Role Selector */}
      <div
        className="row d-flex align-items-center justify-content-center"
        style={{ height: "80px" }}
      >
        <div className="col-6">
          <div
            onClick={() => handleRoleSelect("5")}
            style={{
              height: "50px",
              borderRadius: "10px",
              width: "100%",
              border: "1px solid #1966d2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: selectedRole === "5" ? "#1966d2" : "transparent",
              color: selectedRole === "5" ? "white" : "black",
              cursor: "pointer",
            }}
          >
            Candidate
          </div>
        </div>
        <div className="col-6">
          <div
            onClick={() => handleRoleSelect("3")}
            style={{
              height: "50px",
              border: "1px solid #1966d2",
              borderRadius: "10px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: selectedRole === "3" ? "#1966d2" : "transparent",
              color: selectedRole === "3" ? "white" : "black",
              cursor: "pointer",
            }}
          >
            Recruiter
          </div>
        </div>
        {/* Hidden input for role to be validated and submitted */}
        <input type="hidden" {...register("role")} />
        {errors.role && (
          <div style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
            {errors.role.message}
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="d-flex flex-row justify-content-between">
          <div className="form-group" style={{ width: "47%" }}>
            <label className="auth-fields-labels">First Name</label>
            <input
              className="auth-fields-height"
              type="text"
              {...register("firstName")}
              placeholder="John"
            />
            {errors.firstName && (
              <p
                className="error-message"
                style={{ color: "red", fontSize: "12px" }}
              >
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div className="form-group" style={{ width: "47%" }}>
            <label className="auth-fields-labels">Last Name</label>
            <input
              className="auth-fields-height"
              type="text"
              {...register("lastName")}
              placeholder="Doe"
            />
            {errors.lastName && (
              <p
                className="error-message"
                style={{ color: "red", fontSize: "12px" }}
              >
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="auth-fields-labels">Email Address</label>
          <input
            className="auth-fields-height"
            onChange={(e) => {
              const lowerCaseEmail = e.target.value.toLowerCase();
              setValue("email", lowerCaseEmail);
            }}
            type="email"
            {...register("email")}
            style={{ textTransform: "lowercase" }}
            placeholder="abc@example.com"
          />
          {errors.email && (
            <p
              className="error-message"
              style={{ color: "red", fontSize: "12px" }}
            >
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="form-group">
          <label className="auth-fields-labels">Phone Number</label>
          <PhoneInput
            country={"pk"}
            placeholder="Enter phone number"
            enableSearch={true}
            value={phone}
            onChange={(phone) => {
              setPhone(phone);
              setValue("phone", phone);
              clearErrors("phone");
            }}
            inputStyle={{
              width: "100%",
              height: "45px",
              fontSize: "13px",
              backgroundColor: "#F0F5F7",
              border: "none",
              borderRadius: "8px",
              boxShadow: "none",
            }}
          />
          {errors.phone && (
            <p
              className="error-message"
              style={{ color: "red", fontSize: "12px" }}
            >
              {errors.phone.message}
            </p>
          )}
        </div>

        <div className="form-group" style={{ position: "relative" }}>
          <label className="auth-fields-labels">Password</label>
          <div style={{ position: "relative" }}>
            <input
              id="register-password-field"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="Password"
              autoComplete="on"
              className="auth-fields-height"
              style={{ width: "100%", paddingRight: "35px" }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              {showPassword ? (
                <i className="bi bi-eye-slash"></i>
              ) : (
                <i className="bi bi-eye"></i>
              )}
            </span>
          </div>
          {errors.password && (
            <p
              className="error-message"
              style={{ color: "red", fontSize: "12px", marginTop: "5px" }}
            >
              {errors.password.message}
            </p>
          )}
        </div>

        {error && (
          <div className="my-2" style={{ color: "red", fontSize: "14px" }}>
            {error}
          </div>
        )}

        <div className="form-group" style={{ marginTop: "50px" }}>
          <button className="theme-btn btn-style-one mt-3" type="submit">
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
              "Register"
            )}
          </button>
        </div>
      </form>
      <div className="bottom-box">
        <div className="mb-3">
          <span>Login with</span>
        </div>
        <LoginWithSocial role={selectedRole} />
      </div>
    </div>
  );
};

export default FormContent;
