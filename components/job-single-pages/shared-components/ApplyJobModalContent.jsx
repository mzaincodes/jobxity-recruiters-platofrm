"use client";
import { experienceOptions, noticePeriods } from "@/data/mydata";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { usePathname } from "next/navigation";
import "react-phone-input-2/lib/bootstrap.css";
import PhoneInput from "react-phone-input-2";
import CvUploader from "@/components/dashboard-pages/candidates-dashboard/cv-manager/components/CvUploader";
import { getCurrencySymbol } from "@/utils/helping-func";
const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
// Zod validation schema
const applicationSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Full Name must be at least 3 characters long" })
    .regex(/^[A-Za-z ]+$/, { message: "Full Name can only contain letters" }),
  location: z
    .string()
    .min(1, { message: "Location is required" })
    .regex(/^[A-Za-z0-9 ]+$/, {
      message: "Location can only contain letters and numbers",
    }),
  email: z.string().email({ message: "Please enter a valid email" }),
  phone: z.string().min(1, "Phone Number is required"),
  currentCompanyName: z
    .string()
    .optional(),
  currentSalary: z
    .string()
    .min(1, { message: "Required, write 0 if unemployed" }),
  totalExperience: z
    .string()
    .min(1, { message: "Total Experience is required" }),
  expectedSalary: z.string().min(1, { message: "Expected Salary is required" }),
  noticePeriod: z.string().min(1, { message: "Notice Period is required" }),
  // currentlyApplyingFor: z.string().min(1, { message: "Currently Applying For is required" }),
  // cvLink: z
  //   .string()
  //   .url({ message: "CV Link must be a valid URL" })
  //   .min(1, { message: "CV Link is required" }),
  remarks: z.string().optional(),
  // cvPublicId: z.string().min(1, { message: "CV Public ID is required" }),
});

const ApplyJobModalContent = (currency) => {
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const pathname = usePathname();
  const job_id = pathname.split("/").pop();
  const [uploadedCV, setUploadedCV] = useState(null);
console.log("currency", currency)
  const [phone, setPhone] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(applicationSchema),
  });

  const onSubmit = async (data) => {
    if (!uploadedCV) {
      toast.error("Please upload your CV before submitting.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    try {
      setLoading(true);
      const requestData = {
        ...data,
        job_id,
        cvLink: data.cvLink || uploadedCV?.url,
        cvPublicId: uploadedCV?.publicId,
      };

      const response = await axios.post(
        "/api/user/candidate/create-candidate",
        requestData
      );

      if (response.status === 201) {
        setLoading(false);
        toast.success("Successfully applied for candidate", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        reset();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.error, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <form
      className="default-form mt-2"
      onSubmit={handleSubmit(onSubmit)}
      style={{ overflowY: "auto", overflowX: "hidden" }}
    >
      <div className="row">
        {/* Full Name */}
        <div className="form-group col-lg-6 col-md-12">
          <label className="auth-fields-labels">Full Name*</label>
          <input
            type="text"
            {...register("name")}
            className="auth-fields-height"
          />
          {errors.name && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.name.message}
            </span>
          )}
        </div>

        {/* Location */}
        <div className="form-group col-lg-6 col-md-12">
          <label className="auth-fields-labels">Location*</label>
          <input
            type="text"
            {...register("location")}
            className="auth-fields-height"
          />
          {errors.location && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.location.message}
            </span>
          )}
        </div>

        {/* Email */}
        <div className="form-group col-lg-6 col-md-12">
          <label className="auth-fields-labels">Email*</label>
          <input
            type="text"
            {...register("email")}
            className="auth-fields-height"
          />
          {errors.email && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Phone Number */}
        <div className="form-group col-lg-6 col-md-12">
          <label className="auth-fields-labels">Phone Number*</label>
          <PhoneInput
            country={"pk"}
            value={phone}
            onChange={(phone) => {
              // Format the phone number to match the validation regex
              const formattedPhone = phone
                .replace(/\s+/g, "")
                .replace(/[^0-9+]/g, "");
              setPhone(formattedPhone); // Update state with formatted phone number
              setValue("phone", formattedPhone); // Update react-hook-form state
              clearErrors("phone"); // Clear any phone errors
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
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.phone.message}
            </span>
          )}
        </div>
        {/* Current Company Name */}
        <div className="form-group col-lg-6 col-md-12">
          <label className="auth-fields-labels">Current Company Name</label>
          <input
            type="text"
            {...register("currentCompanyName")}
            className="auth-fields-height"
            placeholder="Leave empty if unemployed"
            style={{ fontSize: "14px" }}
          />

          {errors.currentCompanyName && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.currentCompanyName.message}
            </span>
          )}
        </div>

        {/* Total Experience */}
        <div className="form-group col-lg-6 col-md-12">
          <label className="auth-fields-labels">Total Experience*</label>
          <select
            {...register("totalExperience")}
            className="auth-fields-height"
          >
            <option value="">Select Experience</option>
            {experienceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.totalExperience && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.totalExperience.message}
            </span>
          )}
        </div>

        {/* Current Salary */}
        <div className="form-group col-lg-6 col-md-12">
          <label className="auth-fields-labels">Current Salary ({currency?.currency})</label>
          <input
            type="text"
            {...register("currentSalary")}
            className="auth-fields-height"
            placeholder="Write 0 if unemployed"
            style={{ fontSize: "14px" }}
          />
          {errors.currentSalary && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.currentSalary.message}
            </span>
          )}
        </div>

        {/* Expected Salary */}
        <div className="form-group col-lg-6 col-md-12">
          <label className="auth-fields-labels">Expected Salary ({currency?.currency})*</label>
          <input
            type="text"
            {...register("expectedSalary")}
            className="auth-fields-height"
            placeholder={getCurrencySymbol(currency?.currency)}
          />
          {errors.expectedSalary && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.expectedSalary.message}
            </span>
          )}
        </div>

 

  

        {/* Currently Applying For */}
        {/* <div className="form-group col-lg-6 col-md-12">
          <label className="auth-fields-labels">Currently Applying For*</label>
          <input
            type="text"
            {...register("currentlyApplyingFor")}
            className="auth-fields-height"
            placeholder="Enter the position you're applying for"
          />
          {errors.currentlyApplyingFor && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.currentlyApplyingFor.message}
            </span>
          )}
        </div> */}


        <div className="form-group col-lg-12 col-md-12">
          <label className="auth-fields-labels">Remarks</label>
          <input
            type="text"
            {...register("remarks")}
            className="auth-fields-height"
          />
          {errors.remarks && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.remarks.message}
            </span>
          )}
        </div>

               {/* Notice Period */}
               <div className="form-group col-lg-6 col-md-12">
          <label className="auth-fields-labels">Notice Period*</label>
          <select {...register("noticePeriod")} className="auth-fields-height">
            <option value="">Select Notice Period</option>
            {noticePeriods.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.noticePeriod && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.noticePeriod.message}
            </span>
          )}
        </div>

        {!uploadedCV ? (
          <div className="form-group col-lg-12 col-md-12">
            <label className="auth-fields-labels">Upload CV*</label>
            <CvUploader
              onUpload={(file) => {
                console.log("Uploaded CV:", file);
                setUploadedCV(file);
                setValue("cvLink", file.url);
                setValue("cvPublicId", file.public_id); // If you're storing it
                clearErrors("cvLink");
                clearErrors("cvPublicId");
              }}
            />
            {errors.cvLink && (
              <span style={{ color: "red", fontSize: "13px" }}>
                {errors.cvLink.message}
              </span>
            )}
          </div>
        ) : (
          <div className="form-group col-lg-12 col-md-12">
            <label className="auth-fields-labels">Upload CV*</label>
            <div
              style={{
                backgroundColor: "#d4edda",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #c3e6cb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ color: "#155724" }}>CV uploaded successfully</span>
              <div style={{ display: "flex", gap: "10px" }}>
                <a
                  href={uploadedCV.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-success"
                >
                  View CV
                </a>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => {
                    setUploadedCV(null);
                    setValue("cvLink", "");
                    setValue("cvPublicId", "");
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {errors.cvLink && (
          <span style={{ color: "red", fontSize: "13px" }}>
            {errors.cvLink.message}
          </span>
        )}
        {errors.cvPublicId && (
          <span style={{ color: "red", fontSize: "13px" }}>
            {errors.cvPublicId.message}
          </span>
        )}
        {/* <input type="hidden" {...register("cvPublicId")} /> */}

        {/* Submit Button */}
        <button
          className="col-lg-12 mt-2 col-md-12 theme-btn btn-style-one"
          type="submit"
          style={{ width: "98%", marginLeft: "10px", height: "45px" }}
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
            "Apply Now"
          )}
        </button>
      </div>
    </form>
  );
};

export default ApplyJobModalContent;
