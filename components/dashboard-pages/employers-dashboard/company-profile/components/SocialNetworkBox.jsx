"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BeatLoader } from "react-spinners";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
const schema = z
  .object({
    name: z.string().regex(/^[A-Za-z ]+$/, "Name must contain only letters"),
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one digit"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

const SocialNetworkBox = () => {
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("#ffffff");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const registerSubAdmin = async (data) => {
    const reqData = {
      name: data.name,
      email: data.email,
      password: data.password,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        "/api/user/sub-admin/create-sub-admin",
        reqData
      );

      // Check for successful response status
      if (response.status === 201) {
        setLoading(false);
        toast.success("Sub Admin created successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        reset();
      } else {
        setLoading(false);
        toast.error("An error occurred. Please try again later", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.error, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <form className="default-form" onSubmit={handleSubmit(registerSubAdmin)}>
      <div className="row">
        {/* Name Input */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Full Name</label>
          <input type="text" {...register("name")} placeholder="" required />
          {(errors.name || isSubmitted) && (
            <p className="error-text text-danger">{errors.name?.message}</p>
          )}
        </div>

        {/* Email Input */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Email</label>
          <input type="email" {...register("email")} placeholder="" required />
          {(errors.email || isSubmitted) && (
            <p className="error-text text-danger">{errors.email?.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Password</label>
          <input
            type="text"
            {...register("password")}
            placeholder=""
            required
          />
          {(errors.password || isSubmitted) && (
            <p className="error-text text-danger">{errors.password?.message}</p>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Confirm Password</label>
          <input
            type="text"
            {...register("confirmPassword")}
            placeholder=""
            required
          />
          {(errors.confirmPassword || isSubmitted) && (
            <p className="error-text text-danger">
              {errors.confirmPassword?.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="form-group w-100 d-f">
          <button type="submit" className="theme-btn btn-style-one w-10 mt-2">
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
              "Create Account"
            )}
          </button>
        </div>
      </div>
      <style jsx>{`
        .error-text {
          color: red;
          font-size: 13px;
          margin-top: 5px;
        }
      `}</style>
    </form>
  );
};

export default SocialNetworkBox;
