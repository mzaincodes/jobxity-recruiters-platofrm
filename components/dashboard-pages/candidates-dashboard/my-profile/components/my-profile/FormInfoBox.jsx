"use client";
import { useState } from "react";
import { educationLevel, experienceOptions } from "@/data/mydata";
import "react-phone-input-2/lib/bootstrap.css";
import PhoneInput from "react-phone-input-2";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import {
  convertTimestampToDate,
  getEducationLabel,
  getExperienceLabel,
} from "@/utils/helping-func";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

// Validation schema using Zod}
const formSchema = (phoneExists) => {
  const baseSchema = {
    gender: z.string().min(1, "Gender is required"),
    totalExperience: z
      .string()
      .min(1, "Total experience is required"),
    educationLevel: z.string().min(1, "Education level is required"),
    description: z
      .string()
      .min(150, "At least 150 characters of description required"),
    linkedinUrl: z
      .string()
      .optional()
      .refine(
        (url) => !url || url === "" || (url.includes("linkedin.com") && url.match(/^https?:\/\/.+/)),
        "Please enter a valid LinkedIn URL"
      ),
  };

  if (!phoneExists) {
    baseSchema.phone = z.string().min(1, "Phone Number is required");
  }

  return z.object(baseSchema);
};

const FormInfoBox = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [disbaleButton, setDisbaleButton] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const [phone, setPhone] = useState("");
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    clearErrors,
  } = useForm({
    resolver: zodResolver(formSchema(!!session?.user?.phone)), // Pass condition based on phone existence
  });

  // Submit function
  const submitbasicdetails = async (data) => {
    const id = session?.user?.id;

    // Conditionally remove phone from data if it exists in session
    if (session?.user?.phone) {
      const { phone, ...dataWithoutPhone } = data;
      data = dataWithoutPhone; // Exclude phone from data
    }

    try {
      setLoading(true);
      setDisbaleButton(true);
      const response = await axios.post(
        "/api/user/recruiter/update-basic-profile",
        {
          _id: id, // Include ID in the request body
          ...data, // Spread form data
        }
      );

      if (response.status === 200) {
        toast.success("Profile updated successfully!", {
          position: "top-center", // Set the position of the toast
          autoClose: 3000, // Toast auto close after 3 seconds
          hideProgressBar: false, // Show progress bar
          closeOnClick: true, // Close the toast when clicked
          pauseOnHover: false, // Pause the toast on hover
          draggable: false, // Allow the toast to be draggable
          progress: undefined, // Optional: Set custom progress
        });
        reset();
        setLoading(false);
        window.location.reload();
      } else {
        console.error("Error updating profile:", response.data.error);
        setDisbaleButton(false);
        setLoading(false); // Set loading to false if there's an error
      }
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response?.data || error.message
      );
      setLoading(false); // Set loading to false if there's an error
    }
  };

  return (
    <form onSubmit={handleSubmit(submitbasicdetails)} className="default-form">
      <div className="row">
        <div className="form-group col-lg-6 col-md-12">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder={session?.user?.name || "Enter Name"}
            disabled={!!session?.user?.name}
          />
        </div>

        {/* Email Input */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Email</label>
          <input
            type="text"
            name="email"
            placeholder={session?.user?.email || "Enter Email"}
            disabled={!!session?.user?.email}
          />
        </div>

      {session?.user?.phone ? (
               <div className="form-group col-lg-6 col-md-12">
                 <label>Phone</label>
                 <input
                   type="text"
                   name="phone"
                   placeholder={session?.user?.phone || "Enter Email"}
                   disabled={!!session?.user?.phone}
                 />
               </div>
             ) : (
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
             )}

        {session?.user?.gender ? (
          <div className="form-group col-lg-6 col-md-12">
            <label>Gender</label>
            <input
              type="text"
              name="text"
              placeholder={
                session?.user?.gender === "M"
                  ? "Male"
                  : session?.user?.gender === "F"
                  ? "Female"
                  : session?.user?.gender === "A"
                  ? "Other"
                  : "Enter Gender"
              }
              disabled={!!session?.user?.gender}
            />
          </div>
        ) : (
          <div className="form-group col-lg-6 col-md-12">
            <label>Gender</label>
            <select {...control.register("gender")}>
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="A">Other</option>
            </select>
            {errors.gender && (
              <span style={{ color: "red", fontSize: "13px" }}>
                {errors.gender.message}
              </span>
            )}
          </div>
        )}

        {session?.user?.totalExperience ? (
          <div className="form-group col-lg-6 col-md-12">
            <label>Total experience</label>
            <input
              type="text"
              name="text"
              placeholder={
                getExperienceLabel(session?.user?.totalExperience) ||
                "Enter exp"
              }
              disabled={!!session?.user?.totalExperience}
            />
          </div>
        ) : (
          <div className="form-group col-lg-6 col-md-12">
            <label>Total experience</label>
            <select {...control.register("totalExperience")}>
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
        )}

        {session?.user?.educationLevel ? (
          <div className="form-group col-lg-6 col-md-12">
            <label>Education Levels</label>
            <input
              type="text"
              name="text"
              placeholder={
                getEducationLabel(session?.user?.educationLevel) ||
                "Enter Education Level"
              }
              disabled={!!session?.user?.educationLevel}
            />
          </div>
        ) : (
          <div className="form-group col-lg-6 col-md-12">
            <label>Education Levels</label>
            <select {...control.register("educationLevel")}>
              <option value="">Select Education Level</option>
              {educationLevel.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.educationLevel && (
              <span style={{ color: "red", fontSize: "13px" }}>
                {errors.educationLevel.message}
              </span>
            )}
          </div>
        )}

        {session?.user?.linkedinUrl ? (
          <div className="form-group col-lg-6 col-md-12">
            <label>LinkedIn</label>
            <input
              type="text"
              name="linkedinUrl"
              placeholder={session?.user?.linkedinUrl || "Enter LinkedIn URL"}
              disabled={!!session?.user?.linkedinUrl}
            />
          </div>
        ) : (
          <div className="form-group col-lg-6 col-md-12">
            <label>LinkedIn URL</label>
            <input
              type="text"
              name="linkedinUrl"
              placeholder={"Enter your LinkedIn profile URL"}
              {...control.register("linkedinUrl")}
              disabled={!!session?.user?.linkedinUrl}
            />
            {errors.linkedinUrl && (
              <span style={{ color: "red", fontSize: "13px" }}>
                {errors.linkedinUrl.message}
              </span>
            )}
          </div>
        )}

        {session?.user?.description ? (
          <div className="form-group col-lg-12 col-md-12">
            <label>Description about yourself</label>
            <textarea
              placeholder={session?.user?.description || "Enter Description"}
              disabled={!!session?.user?.description}
            ></textarea>
          </div>
        ) : (
          <div className="form-group col-lg-12 col-md-12">
            <label>Description about yourself</label>
            <textarea
              placeholder="Write something about yourself"
              {...control.register("description")}
            ></textarea>
            {errors.description && (
              <span style={{ color: "red", fontSize: "13px" }}>
                {errors.description.message}
              </span>
            )}
          </div>
        )}

        {!session?.user?.description ? (
          <div className="form-group col-lg-6 col-md-12">
            <button type="submit" className="theme-btn btn-style-one mt-3">
              {loading ? (
                <BeatLoader
                  color={color}
                  loading={loading}
                  size={4}
                  aria-label="Loading Spinner"
                />
              ) : (
                "Save"
              )}
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </form>
  );
};

export default FormInfoBox;
