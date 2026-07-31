"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";

// Zod schema for validation
const passwordSchema = z.object({
  currentPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /(?=.*\d)(?=.*[A-Z])/,
      "Password must contain at least one digit and one uppercase letter"
    ),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /(?=.*\d)(?=.*[A-Z])/,
      "Password must contain at least one digit and one uppercase letter"
    ),
  confirmNewPassword: z.string().min(8, "Password must be at least 8 characters long"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New password and confirm password must match",
  path: ["confirmNewPassword"],
});

const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    trigger,
    clearErrors,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  // Trigger validation when the user types in the fields
  const handleInputChange = async (field) => {
    // Trigger validation for the specific field
    await trigger(field);
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/api/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      });

      // Handle success (you can show a success message or redirect)
      console.log("Password updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating password:", error);
      if (error.response?.data?.error) {
        // Show error message from API response
        setError("currentPassword", {
          type: "manual",
          message: error.response.data.error,
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="default-form">
      <div className="row">
        {/* Old Password Input */}
        <div className="form-group col-lg-7 col-md-12">
          <label>Old Password</label>
          <input
            type="password"
            {...register("currentPassword")}
            onChange={() => handleInputChange("currentPassword")}
            className={errors.currentPassword ? "error" : ""}
          />
          {errors.currentPassword && (
            <p
              className="error-message"
              style={{ color: "red", fontSize: "12px" }}
            >
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* New Password Input */}
        <div className="form-group col-lg-7 col-md-12">
          <label>New Password</label>
          <input
            type="password"
            {...register("newPassword")}
            onChange={() => handleInputChange("newPassword")}
            className={errors.newPassword ? "error" : ""}
          />
          {errors.newPassword && (
            <p
              className="error-message"
              style={{ color: "red", fontSize: "12px" }}
            >
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="form-group col-lg-7 col-md-12">
          <label>Confirm Password</label>
          <input
            type="password"
            {...register("confirmNewPassword")}
            onChange={() => handleInputChange("confirmNewPassword")}
            className={errors.confirmNewPassword ? "error" : ""}
          />
          {errors.confirmNewPassword && (
            <p
              className="error-message"
              style={{ color: "red", fontSize: "12px"}}
            >
              {errors.confirmNewPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="form-group col-lg-6 col-md-12">
          <button type="submit" className="theme-btn btn-style-one">
            Update
          </button>
        </div>
      </div>
    </form>
  );
};

export default Form;
