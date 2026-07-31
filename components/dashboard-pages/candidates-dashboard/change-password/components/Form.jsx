"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const passwordSchema = z
  .object({
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
    confirmNewPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New password and confirm password must match",
    path: ["confirmNewPassword"],
  });

const Form = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState();
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    setId(session?.user?.id);
  }, [session]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/user/recruiter/change-password", {
        id,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      });

      if (response.status === 200) {
        setLoading(false);
        reset();
        toast.success("Password updated successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.error, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
      if (error.response?.data?.error) {
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
        <div className="form-group col-lg-7 col-md-12">
          <label>Old Password</label>
          <input
            type="text"
            {...register("currentPassword")}
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

        <div className="form-group col-lg-7 col-md-12">
          <label>New Password</label>
          <input
            type="text"
            {...register("newPassword")}
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

        <div className="form-group col-lg-7 col-md-12">
          <label>Confirm Password</label>
          <input
            type="text"
            {...register("confirmNewPassword")}
            className={errors.confirmNewPassword ? "error" : ""}
          />
          {errors.confirmNewPassword && (
            <p
              className="error-message"
              style={{ color: "red", fontSize: "12px" }}
            >
              {errors.confirmNewPassword.message}
            </p>
          )}
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <button type="submit" className="theme-btn btn-style-one">
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
              "Update Password"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Form;
