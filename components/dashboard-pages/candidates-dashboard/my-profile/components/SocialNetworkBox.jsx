"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import { banks, currencies } from "@/data/mydata";
import { getBankLabel, getCurrencyLabel } from "@/utils/helping-func";

// Loader styling
const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

// Zod Validation Schema
const schema = z
  .object({
    bankName: z.string().min(1, "Bank name is required"),
    otherBankName: z
      .string()
      .max(50, "Max 50 characters allowed")
      .regex(/^[a-zA-Z0-9 ]*$/, "Only alphanumeric characters allowed")
      .optional()
      .or(z.literal("")),
    currency: z.string().min(1, "Account currency is required"),
    accountNo: z
      .string()
      .min(11, "Account number must be between 11 to 35 characters")
      .max(35, "Account number must be between 11 to 35 characters")
      .regex(/^[A-Z0-9]*$/, "Only uppercase alphanumeric characters allowed"),
    accountHolderName: z
      .string()
      .min(4, "Minimum 4 characters required")
      .max(50, "Maximum 50 characters allowed")
      .regex(/^[a-zA-Z ]*$/, "Only alphabetical characters allowed"),
    swiftCode: z
      .string()
      .min(8, "Swift code must be between 8 to 11 characters")
      .max(11, "Swift code must be between 8 to 11 characters")
      .regex(/^[A-Z0-9]*$/, "Only uppercase alphanumeric characters allowed"),
  })
  .refine(
    (data) =>
      data.bankName !== "28" ||
      (data.otherBankName && data.otherBankName.trim() !== ""),
    {
      message: "Other Bank Name is required",
      path: ["otherBankName"],
    }
  );

const SocialNetworkBox = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [disbaleButton, setDisbaleButton] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const selectedBank = watch("bankName");

  const onSubmit = async (data) => {
    const recruiterId = session?.user?.id; // Get recruiter ID from session

    if (!recruiterId) {
      toast.error("User not authenticated. Please log in again.");
      return;
    }
    setDisbaleButton(true)
    setLoading(true);
    try {
      const response = await axios.post(
        "/api/user/recruiter/update-bank-details",
        {
          _id: recruiterId,
          ...data,
        }
      );

      if (response.status === 200) {
        setLoading(false);
        reset();
        toast.success("Profile updated successfully!", {
          position: "top-center", // Set the position of the toast
          autoClose: 3000, // Toast auto close after 3 seconds
          hideProgressBar: false, // Show progress bar
          closeOnClick: true, // Close the toast when clicked
          pauseOnHover: false, // Pause the toast on hover
          draggable: false, // Allow the toast to be draggable
          progress: undefined, // Optional: Set custom progress
        });
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setDisbaleButton(false)
        throw new Error(response.data.error || "Failed to update details");
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(error.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="default-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        {session?.user?.bankDetails?.bankName ? (
          <div className="form-group col-lg-6 col-md-12">
            <label>Bank Name</label>
            <input
              type="text"
              name="text"
              placeholder={
                session?.user?.bankDetails?.otherBankName ||
                getBankLabel(session?.user?.bankDetails?.bankName) ||
                "Enter Bank Name"
              }
              
              disabled={!!session?.user?.bankDetails?.bankName}
            />
          </div>
        ) : (
          <div className="form-group col-lg-6 col-md-12">
            <label>Bank Name</label>
            <select {...register("bankName")}>
              <option value="">Select Bank</option>
              {banks?.map((bank) => (
                <option key={bank.value} value={bank.value}>
                  {bank.label}
                </option>
              ))}
            </select>
            {errors.bankName && (
              <span style={{ color: "red", fontSize: "13px" }}>
                {errors.bankName.message}
              </span>
            )}
          </div>
        )}

        {selectedBank === "28" && (
          <div className="form-group col-lg-6 col-md-12">
            <label>Other Bank Name</label>
            <input
              type="text"
              placeholder="Enter bank name"
              {...register("otherBankName")}
            />
            {errors.otherBankName && (
              <span style={{ color: "red", fontSize: "13px" }}>
                {errors.otherBankName.message}
              </span>
            )}
          </div>
        )}

        {session?.user?.bankDetails?.currency ? (
          <div className="form-group col-lg-6 col-md-12">
            <label>Account Currency</label>
            <input
              type="text"
              name="text"
              placeholder={
                getCurrencyLabel(session?.user?.bankDetails?.currency) ||
                "Select Account Currency"
              }
              disabled={!!session?.user?.bankDetails?.currency}
            />
          </div>
        ) : (
          <div className="form-group col-lg-6 col-md-12">
            <label> Account Currency</label>
            <select {...register("currency")}>
              <option value="">Select Account Currency</option>
              {currencies?.map((currency, index) => (
                <option key={index} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </select>
            {errors.currency && (
              <span style={{ color: "red", fontSize: "13px" }}>
                {errors.currency.message}
              </span>
            )}
          </div>
        )}

        <div className="form-group col-lg-6 col-md-12">
          <label>Account Holder Name / Account Title</label>
          <input
            type="text"
            placeholder={
              session?.user?.bankDetails?.accountHolderName ||
              "Enter Account Title"
            }
            disabled={!!session?.user?.bankDetails?.accountHolderName}
            {...register("accountHolderName")}
          />
          {errors.accountHolderName && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.accountHolderName.message}
            </span>
          )}
        </div>

        {/* Account No */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Account No</label>
          <input
            type="text"
            placeholder={
              session?.user?.bankDetails?.accountNo || "Enter Account Number"
            }
            disabled={!!session?.user?.bankDetails?.accountNo}
            {...register("accountNo", {
              onChange: (e) => {
                e.target.value = e.target.value.toUpperCase();
              },
            })}
          />
          {errors.accountNo && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.accountNo.message}
            </span>
          )}
        </div>

        {/* Swift Code */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Swift Code</label>
          <input
            type="text"
            placeholder={
              session?.user?.bankDetails?.swiftCode || "Enter Swift Code"
            }
            disabled={!!session?.user?.bankDetails?.swiftCode}
            {...register("swiftCode", {
              onChange: (e) => {
                e.target.value = e.target.value.toUpperCase();
              },
            })}
          />
          {errors.swiftCode && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.swiftCode.message}
            </span>
          )}
        </div>

        {session?.user?.bankDetails?.accountNo ? (
          <></>
        ) : (
          <div className="form-group col-lg-12 col-md-12">
            <button
              type="submit"
              className="theme-btn btn-style-one"
              disabled={setDisbaleButton}
            >
              {loading ? (
                <BeatLoader
                  color="#ffffff"
                  loading={loading}
                  cssOverride={override}
                  size={6}
                />
              ) : (
                "Save"
              )}
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default SocialNetworkBox;
