// "use client";
// import {
//   experienceOptions,
//   industries,
//   jobTypes,
//   noticePeriods,
// } from "@/data/mydata";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { BeatLoader } from "react-spinners";
// import { usePathname } from "next/navigation";
// import DefaulHeader2 from "@/components/header/DefaulHeader2";
// import FooterDefault from "@/components/footer/common-footer/index";
// import JobSkills from "@/components/job-single-pages/shared-components/JobSkills";

// import MobileMenu from "@/components/header/MobileMenu";
// import "react-phone-input-2/lib/bootstrap.css";
// import PhoneInput from "react-phone-input-2";
// import React, { useEffect, useState } from "react";
// import { getSingleJob } from "@/lib/api";
// import { useSession } from "next-auth/react";
// import {
//   getIndustryLabel,
//   timeAgo,
//   convertTimestampToDate,
//   getExperienceLabel,
// } from "@/utils/helping-func";
// import JobOverView from "@/components/job-single-pages/job-overview/JobOverView";
// import { Country, State, City } from "country-state-city";

// const override = {
//   display: "block",
//   margin: "0 auto",
//   borderColor: "red",
// };
// // Zod validation schema
// const applicationSchema = z.object({
//   name: z
//     .string()
//     .min(3, { message: "Full Name must be at least 3 characters long" })
//     .regex(/^[A-Za-z ]+$/, { message: "Full Name can only contain letters" }),
//   location: z
//     .string()
//     .min(1, { message: "Location is required" })
//     .regex(/^[A-Za-z0-9 ]+$/, {
//       message: "Location can only contain letters and numbers",
//     }),
//   email: z.string().email({ message: "Please enter a valid email" }),
//   phone: z.string().min(1, "Phone Number is required"),
//   currentCompanyName: z
//     .string()
//     .regex(/^[A-Za-z0-9 ]*$/, {
//       message: "Current Company Name can only contain letters and numbers",
//     })
//     .optional(),
//   currentSalary: z
//     .string()
//     .min(1, { message: "Required, write 0 if unemployed" }),

//   totalExperience: z
//     .string()
//     .min(1, { message: "Total Experience is required" }),
//   expectedSalary: z.string().min(1, { message: "Expected Salary is required" }),
//   noticePeriod: z.string().min(1, { message: "Notice Period is required" }),
//   cvLink: z
//     .string()
//     .url({ message: "CV Link must be a valid URL" })
//     .min(1, { message: "CV Link is required" }),
// });

// const CandidateApplyForm = ({ params }) => {
//   const [loading, setLoading] = useState(false);
//   const [color, setColor] = useState("#ffffff");
//   const pathname = usePathname();
//   const [job, setJob] = useState(null);
//   const [applied, setAlreadyApplied] = useState(false);
//   const pathSegments = pathname.split("/");
//   const { data: session } = useSession();
//   const [maxWidth, setMaxWidth] = useState(getMaxWidth());

//   function getMaxWidth() {
//     return window.innerWidth < 576 ? "97vw" : "60vw";
//   }

//   useEffect(() => {
//     function handleResize() {
//       setMaxWidth(getMaxWidth());
//     }

//     window.addEventListener("resize", handleResize);

//     // Cleanup listener on unmount
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);
//   const getCountryName = (isoCode) => {
//     const country = Country.getCountryByCode(isoCode);
//     return country?.name || isoCode;
//   };

//   const industryLabel =
//     industries.find((item) => item.value === Number(job?.industry))?.label ||
//     "Unknown Industry";

//   const jobTypeLabel =
//     jobTypes.find((item) => item.value === Number(job?.jobType))?.label ||
//     "Unknown Job Type";

//   const getStateName = (countryCode, stateCode) => {
//     const state = State.getStateByCodeAndCountry(stateCode, countryCode);
//     return state?.name || stateCode;
//   };
//   // Extract recruiter and job IDs
//   const recruiter_id = pathSegments[2];
//   const job_id = pathSegments[3];

//   useEffect(() => {
//     const fetchJobDetails = async () => {
//       try {
//         setLoading(true);
//         const { job, alreadyApplied } = await getSingleJob(
//           job_id,
//           session?.user?.id || null
//         );
//         console.log("Job Details:", alreadyApplied);
//         setJob(job);
//         setAlreadyApplied(alreadyApplied);
//       } catch (error) {
//         console.error("Failed to fetch job details", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobDetails();
//   }, [job_id, session?.user?.id]);

//   console.log("Recruiter ID:", recruiter_id);
//   console.log("Job ID:", job_id);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     setValue,
//     clearErrors,
//   } = useForm({
//     resolver: zodResolver(applicationSchema),
//   });

//   const [phone, setPhone] = useState("");

//   const onSubmit = async (data) => {
//     try {
//       setLoading(true);
//       const requestData = {
//         ...data,
//         job_id,
//         recruiter_id,
//         isFromSocialMedia: true,
//       };

//       console.log("sdgshw4greg", requestData);
//       const response = await axios.post(
//         "/api/user/candidate/create-candidate",
//         requestData
//       );

//       if (response.status === 201) {
//         setLoading(false);
//         toast.success("Successfully applied for candidate", {
//           position: "top-center",
//           autoClose: 2000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         });
//         reset();
//         setTimeout(() => {
//           window.location.reload();
//         }, 2000);
//       }
//     } catch (error) {
//       setLoading(false);
//       toast.error(error?.response?.data?.error, {
//         position: "top-center",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });
//     }
//   };

//   return (
//     <>
//       <DefaulHeader2 />
//       <MobileMenu />

//       <section className="job-detail-section ">
//         <div className="upper-box">
//           <div className="auto-container">
//             <div className="job-block-seven">
//               <div className="inner-box">
//                 <div className="">
//                   <span className="company-logo">
//                     {/* <Image
//                       width={100}
//                       height={98}
//                       src={company?.logo}
//                       alt="logo"
//                     /> */}
//                   </span>
//                   <h4>{job?.jobTitle}</h4>

//                   <ul className="job-info">
//                     <li>
//                       <span className="icon flaticon-briefcase"></span>
//                       {getIndustryLabel(job?.industry)}
//                     </li>
//                     {/* compnay info */}

//                     {/* location info */}
//                     <li>
//                       <span className="icon flaticon-clock-3"></span>{" "}
//                       {timeAgo(job?.createdAt)}
//                     </li>
//                     {/* time info */}
//                     {/* <li>
//                       <span className="icon flaticon-money"></span> Rs.{" "}
//                       {Intl.NumberFormat().format(job?.salary)}/-
//                     </li> */}
//                     {/* salary info */}
//                     <li>
//                       <span className="icon flaticon-map-locator"></span>
//                       {job?.address?.city}
//                       {", "}
//                       {getCountryName(job?.address?.country)}
//                     </li>
//                   </ul>
//                 </div>
//                 {/* End .content */}

//                 <>
//                   {session?.user?.role === "5" && applied === true ? (
//                     <>
//                       <div className="btn-box d-flex flex-column gap-2">
//                         <div
//                           style={{
//                             width: "170px",
//                             height: "42px",
//                             backgroundColor: "#A9A9A9",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             borderRadius: "8px",
//                             color: "#404040",
//                           }}
//                         >
//                           <span style={{ marginRight: "10px" }}>
//                             <i class="bi bi-pass"></i>
//                           </span>
//                           Applied
//                         </div>
//                       </div>
//                     </>
//                   ) : (
//                     <div className="btn-box d-flex flex-column gap-2">
//                       <a
//                         href="#apply-form"
//                         className="theme-btn btn-style-one"
//                         onClick={() => {
//                           "";
//                         }}
//                       >
//                         <span style={{ marginRight: "10px" }}>
//                           {" "}
//                           <i class="bi bi-pass"></i>
//                         </span>

//                         {session?.user?.role === "5"
//                           ? "Apply Now"
//                           : "Submit a profile"}
//                       </a>
//                     </div>
//                   )}
//                 </>

//                 {/* End apply for job btn */}

//                 {/* End .modal */}
//               </div>
//             </div>
//             {/* <!-- Job Block --> */}
//           </div>
//         </div>
//         {/* <!-- Upper Box --> */}

//         <div className="job-detail-outer">
//           <div className="auto-container">
//             <div className="row">
//               <div className="content-column col-lg-8 col-md-12 col-sm-12 ">
//                 <h5>Job Description</h5>
//                 {/* <JobDetailsDescriptions /> */}
//                 {/* End jobdetails content */}

//                 <div
//                   style={{ minHeight: "auto", height: "auto", padding: 0 }}
//                   className="ql-editor mt-4"
//                   dangerouslySetInnerHTML={{ __html: job?.jobDescription }}
//                 />
//               </div>
//               {/* End .content-column */}

//               <div className="sidebar-column col-lg-4 col-md-12 col-sm-12">
//                 <aside className="sidebar">
//                   <div className="sidebar-widget">
//                     {/* <!-- Job Overview --> */}
//                     <h4 className="widget-title">Job Overview</h4>
//                     <JobOverView
//                       datePosted={timeAgo(job?.createdAt)}
//                       expirationDate={convertTimestampToDate(job?.deadline)}
//                       location={`${job?.address.completeAddress}, ${
//                         job?.address.city
//                       }, ${getStateName(
//                         job?.address.country,
//                         job?.address.state
//                       )}, ${getCountryName(job?.address.country)}`}
//                       jobTitle={industryLabel}
//                       hours={jobTypeLabel}
//                       rate="$15 - $25 / hour"
//                       salary={`Rs ${Intl.NumberFormat().format(
//                         job?.minSalary
//                       )} to ${Intl.NumberFormat().format(job?.maxSalary)}/-`}
//                     />

//                     <h4 className="widget-title mt-5 ">Required Skills</h4>
//                     <div className="widget-content mt-3">
//                       <JobSkills skills={job?.skills} />
//                     </div>
//                     {/* <!-- Job Skills --> */}
//                   </div>
//                   {/* End .sidebar-widget */}

//                   {/* End .company-widget */}
//                 </aside>
//                 {/* End .sidebar */}
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* <!-- job-detail-outer--> */}
//       </section>
//       <div
//         style={{
//           marginTop: "120px",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <div id="apply-form">
//           <h2>Please fill this form to apply</h2>
//           <form
//             className="default-form mt-5"
//             onSubmit={handleSubmit(onSubmit)}
//             style={{ overflowY: "auto", overflowX: "hidden", width: "80vw" }}
//           >
//             <div className="row">
//               {/* Full Name */}
//               <div className="form-group col-lg-6 col-md-12">
//                 <label className="auth-fields-labels">Full Name*</label>
//                 <input
//                   type="text"
//                   {...register("name")}
//                   className="auth-fields-height"
//                 />
//                 {errors.name && (
//                   <span style={{ color: "red", fontSize: "13px" }}>
//                     {errors.name.message}
//                   </span>
//                 )}
//               </div>

//               {/* Location */}
//               <div className="form-group col-lg-6 col-md-12">
//                 <label className="auth-fields-labels">Location*</label>
//                 <input
//                   type="text"
//                   {...register("location")}
//                   className="auth-fields-height"
//                 />
//                 {errors.location && (
//                   <span style={{ color: "red", fontSize: "13px" }}>
//                     {errors.location.message}
//                   </span>
//                 )}
//               </div>

//               {/* Email */}
//               <div className="form-group col-lg-6 col-md-12">
//                 <label className="auth-fields-labels">Email*</label>
//                 <input
//                   type="text"
//                   {...register("email")}
//                   className="auth-fields-height"
//                   onChange={(e) => {
//                     setValue("email", e.target.value.toLowerCase());
//                   }}
//                 />
//                 {errors.email && (
//                   <span style={{ color: "red", fontSize: "13px" }}>
//                     {errors.email.message}
//                   </span>
//                 )}
//               </div>

//               <div className="form-group col-lg-6 col-md-12">
//                 <label className="auth-fields-labels">Phone Number*</label>
//                 <PhoneInput
//                   country={"pk"}
//                   value={phone}
//                   onChange={(phone) => {
//                     // Format the phone number to match the validation regex
//                     const formattedPhone = phone
//                       .replace(/\s+/g, "")
//                       .replace(/[^0-9+]/g, "");
//                     setPhone(formattedPhone); // Update state with formatted phone number
//                     setValue("phone", formattedPhone); // Update react-hook-form state
//                     clearErrors("phone"); // Clear any phone errors
//                   }}
//                   inputStyle={{
//                     width: "100%",
//                     height: "45px",
//                     fontSize: "13px",
//                     backgroundColor: "#F0F5F7",
//                     border: "none",
//                     borderRadius: "8px",
//                     boxShadow: "none",
//                   }}
//                 />
//                 {errors.phone && (
//                   <span style={{ color: "red", fontSize: "13px" }}>
//                     {errors.phone.message}
//                   </span>
//                 )}
//               </div>

//               {/* Current Company Name */}
//               <div className="form-group col-lg-6 col-md-12">
//                 <label className="auth-fields-labels">
//                   Current Company Name
//                 </label>
//                 <input
//                   type="text"
//                   {...register("currentCompanyName")}
//                   className="auth-fields-height"
//                   placeholder="Leave empty if unemployed"
//                   style={{ fontSize: "14px" }}
//                 />

//                 {errors.currentCompanyName && (
//                   <span style={{ color: "red", fontSize: "13px" }}>
//                     {errors.currentCompanyName.message}
//                   </span>
//                 )}
//               </div>

//               {/* Total Experience */}
//               <div className="form-group col-lg-6 col-md-12">
//                 <label className="auth-fields-labels">Total Experience*</label>
//                 <select
//                   {...register("totalExperience")}
//                   className="auth-fields-height"
//                 >
//                   <option value="">Select Experience</option>
//                   {experienceOptions.map((option) => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.totalExperience && (
//                   <span style={{ color: "red", fontSize: "13px" }}>
//                     {errors.totalExperience.message}
//                   </span>
//                 )}
//               </div>

//               {/* Current Salary */}
//               <div className="form-group col-lg-6 col-md-12">
//                 <label className="auth-fields-labels">Current Salary</label>
//                 <input
//                   type="text"
//                   {...register("currentSalary")}
//                   className="auth-fields-height"
//                   placeholder="Write 0 if unemployed"
//                   style={{ fontSize: "14px" }}
//                 />
//                 {errors.currentSalary && (
//                   <span style={{ color: "red", fontSize: "13px" }}>
//                     {errors.currentSalary.message}
//                   </span>
//                 )}
//               </div>

//               {/* Expected Salary */}
//               <div className="form-group col-lg-6 col-md-12">
//                 <label className="auth-fields-labels">Expected Salary*</label>
//                 <input
//                   type="text"
//                   {...register("expectedSalary")}
//                   className="auth-fields-height"
//                 />
//                 {errors.expectedSalary && (
//                   <span style={{ color: "red", fontSize: "13px" }}>
//                     {errors.expectedSalary.message}
//                   </span>
//                 )}
//               </div>

//               {/* Notice Period */}
//               <div className="form-group col-lg-6 col-md-12">
//                 <label className="auth-fields-labels">Notice Period*</label>
//                 <select
//                   {...register("noticePeriod")}
//                   className="auth-fields-height"
//                 >
//                   <option value="">Select Notice Period</option>
//                   {noticePeriods.map((option) => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.noticePeriod && (
//                   <span style={{ color: "red", fontSize: "13px" }}>
//                     {errors.noticePeriod.message}
//                   </span>
//                 )}
//               </div>

//               {/* CV Link */}
//               <div className="form-group col-lg-6 col-md-12">
//                 <label className="auth-fields-labels">CV Link*</label>
//                 <input
//                   type="text"
//                   {...register("cvLink")}
//                   className="auth-fields-height"
//                 />
//                 {errors.cvLink && (
//                   <span style={{ color: "red", fontSize: "13px" }}>
//                     {errors.cvLink.message}
//                   </span>
//                 )}
//               </div>

//               {/* Submit Button */}
//               <button
//                 className="col-lg-12 mt-2 col-md-12 theme-btn btn-style-one"
//                 type="submit"
//                 style={{ width: "200px", marginLeft: "10px", height: "45px" }}
//               >
//                 {loading ? (
//                   <BeatLoader
//                     color={color}
//                     loading={loading}
//                     cssOverride={override}
//                     size={6}
//                     aria-label="Loading Spinner"
//                     data-testid="loader"
//                   />
//                 ) : (
//                   "Apply Now"
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       <FooterDefault />
//     </>
//   );
// };

// export default CandidateApplyForm;

"use client";
import {
  experienceOptions,
  industries,
  jobTypes,
  noticePeriods,
} from "@/data/mydata";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import { usePathname } from "next/navigation";
import DefaulHeader2 from "@/components/header/DefaulHeader2";
import FooterDefault from "@/components/footer/common-footer/index";
import JobSkills from "@/components/job-single-pages/shared-components/JobSkills";

import MobileMenu from "@/components/header/MobileMenu";
import "react-phone-input-2/lib/bootstrap.css";
import PhoneInput from "react-phone-input-2";
import React, { useEffect, useState } from "react";
import { getSingleJob } from "@/lib/api";
import { useSession } from "next-auth/react";
import {
  getIndustryLabel,
  timeAgo,
  convertTimestampToDate,
  getExperienceLabel,
  getJobModeLabel,
  getCurrencySymbol,
} from "@/utils/helping-func";
import JobOverView from "@/components/job-single-pages/job-overview/JobOverView";
import { Country, State, City } from "country-state-city";
import CvUploader from "@/components/dashboard-pages/candidates-dashboard/cv-manager/components/CvUploader";

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
    .regex(/^[A-Za-z0-9 ,.-]+$/, {
      message:
        "Location can only contain letters, numbers, and basic punctuation",
    }),
  email: z.string().email({ message: "Please enter a valid email" }),
  phone: z.string().min(1, "Phone Number is required"),
  currentCompanyName: z
    .string()
    .regex(/^[A-Za-z0-9 ]*$/, {
      message: "Current Company Name can only contain letters and numbers",
    })
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
});

const CandidateApplyForm = ({ params }) => {
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const pathname = usePathname();
  const [job, setJob] = useState(null);
  const [applied, setAlreadyApplied] = useState(false);
  const pathSegments = pathname.split("/");
  const { data: session } = useSession();
  // const [maxWidth, setMaxWidth] = useState(getMaxWidth());
  const [uploadedCV, setUploadedCV] = useState(null);

  console.log("Request Data:", uploadedCV);

  // function getMaxWidth() {
  //   return window.innerWidth < 576 ? "97vw" : "60vw";
  // }

  // useEffect(() => {
  //   function handleResize() {
  //     setMaxWidth(getMaxWidth());
  //   }

  //   window.addEventListener("resize", handleResize);

  //   // Cleanup listener on unmount
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  const getCountryName = (isoCode) => {
    const country = Country.getCountryByCode(isoCode);
    return country?.name || isoCode;
  };

  const getStateName = (countryCode, stateCode) => {
    const state = State.getStateByCodeAndCountry(stateCode, countryCode);
    return state?.name || stateCode;
  };

  // Helper function to construct location from session address
  const constructLocationFromSession = (address) => {
    if (!address) return "";

    const parts = [];
    if (address.completeAddress) parts.push(address.completeAddress);
    if (address.city) parts.push(address.city);
    if (address.state) {
      const stateName = getStateName(address.country, address.state);
      parts.push(stateName);
    }
    if (address.country) {
      const countryName = getCountryName(address.country);
      parts.push(countryName);
    }

    return parts.join(", ");
  };

  const industryLabel =
    industries.find((item) => item.value === Number(job?.industry))?.label ||
    "Unknown Industry";

  const jobTypeLabel =
    jobTypes.find((item) => item.value === Number(job?.jobType))?.label ||
    "Unknown Job Type";

  // Extract recruiter and job IDs
  const recruiter_id = pathSegments[2];
  const job_id = pathSegments[3];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    clearErrors,
  } = useForm({
    resolver: zodResolver(applicationSchema),
  });

  const [phone, setPhone] = useState("");

  // Populate form with session data
  useEffect(() => {
    if (session?.user) {
      const user = session.user;

      // Set form values from session data
      if (user.name) {
        setValue("name", user.name);
      }

      if (user.email) {
        setValue("email", user.email.toLowerCase());
      }

      if (user.phone) {
        const formattedPhone = user.phone
          .replace(/\s+/g, "")
          .replace(/[^0-9+]/g, "");
        setPhone(formattedPhone);
        setValue("phone", formattedPhone);
      }

      if (user.cv) {
        setValue("cvLink", user.cv);
      }

      if (user.address) {
        const locationString = constructLocationFromSession(user.address);
        if (locationString) {
          setValue("location", locationString);
        }
      }
    }
  }, [session, setValue]);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const { job, alreadyApplied } = await getSingleJob(
          job_id,
          session?.user?.id || null
        );
        console.log("Job Details:", alreadyApplied);
        setJob(job);
        setAlreadyApplied(alreadyApplied);
      } catch (error) {
        console.error("Failed to fetch job details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [job_id, session?.user?.id]);

  console.log("Recruiter ID:", recruiter_id);
  console.log("Job ID:", job_id);

  const onSubmit = async (data) => {
    if (!uploadedCV) {
      toast.error("Please upload your CV before submitting.");
      return;
    }

    try {
      setLoading(true);

      // Merge form data with session data, prioritizing form data
      const requestData = {
        ...data,
        job_id,
        recruiter_id,
        isFromSocialMedia: true,
        cvLink: uploadedCV.url,
        cvPublicId: uploadedCV.publicId,
        // Add session data that might not be in the form
        ...(session?.user?.id && { candidate_id: session.user.id }),
        ...(session?.user?.pic && { profilePicture: session.user.pic }),
        ...(session?.user?.description && {
          description: session.user.description,
        }),
        ...(session?.user?.educationLevel && {
          educationLevel: session.user.educationLevel,
        }),
        ...(session?.user?.gender && { gender: session.user.gender }),
      };

      console.log("Request Data:", requestData);
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
    <>
      <DefaulHeader2 />
      <MobileMenu />

      <section className="job-detail-section ">
        <div className="upper-box">
          <div className="auto-container">
            <div className="job-block-seven">
              <div className="inner-box">
                <div className="">
                  <span className="company-logo">
                    {/* <Image
                      width={100}
                      height={98}
                      src={company?.logo}
                      alt="logo"
                    /> */}
                  </span>
                  <h4>{job?.jobTitle}</h4>

                  <ul className="job-info">
                    <li>
                      <span className="icon flaticon-briefcase"></span>
                      {getIndustryLabel(job?.industry)}
                    </li>
                    {/* compnay info */}

                    {/* location info */}
                    <li>
                      <span className="icon flaticon-clock-3"></span>{" "}
                      {timeAgo(job?.createdAt)}
                    </li>
                    {/* time info */}
                    {/* <li>
                      <span className="icon flaticon-money"></span> Rs.{" "}
                      {Intl.NumberFormat().format(job?.salary)}/-
                    </li> */}
                    {/* salary info */}
                    <li>
                      <span className="icon flaticon-map-locator"></span>
                      {job?.address?.city}
                      {", "}
                      {getCountryName(job?.address?.country)}
                    </li>

                    <li>
                      <span className="icon flaticon-briefcase"></span>
                      {getJobModeLabel(job?.jobMode)}
                    </li>
                  </ul>
                </div>
                {/* End .content */}

                <>
                  {session?.user?.role === "5" && applied === true ? (
                    <>
                      <div className="btn-box d-flex flex-column gap-2">
                        <div
                          style={{
                            width: "170px",
                            height: "42px",
                            backgroundColor: "#A9A9A9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "8px",
                            color: "#404040",
                          }}
                        >
                          <span style={{ marginRight: "10px" }}>
                            <i className="bi bi-pass"></i>
                          </span>
                          Applied
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="btn-box d-flex flex-column ">
                      <a href="#apply-form" className="theme-btn btn-style-one">
                        <span style={{ marginRight: "10px" }}>
                          {" "}
                          <i className="bi bi-pass"></i>
                        </span>
                        Apply Now
                      </a>
                    </div>
                  )}
                </>

                {/* End apply for job btn */}

                {/* End .modal */}
              </div>
            </div>
            {/* <!-- Job Block --> */}
          </div>
        </div>
        {/* <!-- Upper Box --> */}

        <div className="job-detail-outer">
          <div className="auto-container">
            <div className="row">
              <div className="content-column col-lg-8 col-md-12 col-sm-12 ">
                <h5>Job Description</h5>
                {/* <JobDetailsDescriptions /> */}
                {/* End jobdetails content */}

                <div
                  style={{ minHeight: "auto", height: "auto", padding: 0 }}
                  className="ql-editor mt-4"
                  dangerouslySetInnerHTML={{ __html: job?.jobDescription }}
                />
              </div>
              {/* End .content-column */}

              <div className="sidebar-column col-lg-4 col-md-12 col-sm-12">
                <aside className="sidebar">
                  <div className="sidebar-widget">
                    {/* <!-- Job Overview --> */}
                    <h4 className="widget-title">Job Overview</h4>
                    <JobOverView
                      datePosted={timeAgo(job?.createdAt)}
                      expirationDate={convertTimestampToDate(job?.deadline)}
                      location={`${job?.address.completeAddress}, ${
                        job?.address.city
                      }, ${getStateName(
                        job?.address.country,
                        job?.address.state
                      )}, ${getCountryName(job?.address.country)}`}
                      jobTitle={industryLabel}
                      hours={jobTypeLabel}
                      currency={job?.currency}
                      minSalary={job?.minSalary}
                      maxSalary={job?.maxSalary}
                    />

                    <h4 className="widget-title mt-5 ">Required Skills</h4>
                    <div className="widget-content mt-3">
                      <JobSkills skills={job?.skills} />
                    </div>
                    {/* <!-- Job Skills --> */}
                  </div>
                  {/* End .sidebar-widget */}

                  {/* End .company-widget */}
                </aside>
                {/* End .sidebar */}
              </div>
            </div>
          </div>
        </div>
        {/* <!-- job-detail-outer--> */}
      </section>

      {!applied && (
        <div
          style={{
            marginTop: "120px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div id="apply-form">
            <h2>Please fill this form to apply</h2>
            <form
              className="default-form mt-5"
              onSubmit={handleSubmit(onSubmit)}
              style={{ overflowY: "auto", overflowX: "hidden", width: "80vw" }}
            >
              <div className="row">
                {/* Full Name */}
                <div className="form-group col-lg-6 col-md-12">
                  <label className="auth-fields-labels">Full Name*</label>
                  <input
                    type="text"
                    {...register("name")}
                    className="auth-fields-height"
                    placeholder={
                      session?.user?.name ? "" : "Enter your full name"
                    }
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
                    placeholder={
                      session?.user?.address ? "" : "Enter your location"
                    }
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
                    placeholder={session?.user?.email ? "" : "Enter your email"}
                    onChange={(e) => {
                      setValue("email", e.target.value.toLowerCase());
                    }}
                  />
                  {errors.email && (
                    <span style={{ color: "red", fontSize: "13px" }}>
                      {errors.email.message}
                    </span>
                  )}
                </div>

                <div className="form-group col-lg-6 col-md-12">
                  <label className="auth-fields-labels">Phone Number*</label>
                  <PhoneInput
                    country={"pk"}
                    value={phone}
                    placeholder={
                      session?.user?.phone ? "" : "Enter your phone number"
                    }
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
                  <label className="auth-fields-labels">
                    Current Company Name
                  </label>
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
                  <label className="auth-fields-labels">
                    Total Experience*
                  </label>
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
                <label className="auth-fields-labels">Current Salary ({job?.currency})</label>
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
                <label className="auth-fields-labels">Expected Salary ({job?.currency})*</label>
                <input
                    type="text"
                    {...register("expectedSalary")}
                    className="auth-fields-height"
                    placeholder={getCurrencySymbol(job?.currency)}
                  />
                  {errors.expectedSalary && (
                    <span style={{ color: "red", fontSize: "13px" }}>
                      {errors.expectedSalary.message}
                    </span>
                  )}
                </div>

                {/* Notice Period */}
                <div className="form-group col-lg-6 col-md-12">
                  <label className="auth-fields-labels">Notice Period*</label>
                  <select
                    {...register("noticePeriod")}
                    className="auth-fields-height"
                  >
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

                {/* <div className="form-group col-lg-6 col-md-12">
                  <label className="auth-fields-labels">CV Link*</label>
                  <input
                    type="text"
                    {...register("cvLink")}
                    className="auth-fields-height"
                    placeholder={session?.user?.cv ? "" : "Enter your CV link"}
                  />
                  {errors.cvLink && (
                    <span style={{ color: "red", fontSize: "13px" }}>
                      {errors.cvLink.message}
                    </span>
                  )}
                </div> */}

                <div className="form-group col-lg-12 col-md-12">
                  <label className="auth-fields-labels">CV Upload*</label>

                  {/* ✅ CASE 1: Show user's profile CV if logged in and has one */}
                  {session?.user?.cv && !uploadedCV ? (
                    <div style={{ marginTop: "10px", fontSize: "14px" }}>
              <span style={{ color: "green", marginRight: "6px" }}>
                ✅ CV Uploaded Successfully
              </span>
              <a
                href={session.user.cv}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#0d6efd",
                  textDecoration: "underline",
                }}
              >
                View now
              </a>
            </div>
                  ) : uploadedCV ? (
                    // ✅ CASE 2: Show uploaded CV (anonymous or override)
                    <div style={{ marginTop: "10px" }}>
                      <p className="text-success mb-1">
                        ✅ CV Uploaded Successfully
                      </p>
                      <a
                        href={uploadedCV.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#0d6efd",
                          textDecoration: "underline",
                          fontSize: "14px",
                        }}
                      >
                        View now
                      </a>
                    </div>
                  ) : (
                    // ✅ CASE 3: Show CVUploader (anonymous user or no profile CV)
                    <CvUploader
                      onUpload={(file) => {
                        setUploadedCV(file);
                        console.log("File uploaded:", file);
                      }}
                    />
                  )}
                </div>

                {/* Submit Button */}
                <button
                  className="col-lg-12 mt-2 col-md-12 theme-btn btn-style-one"
                  type="submit"
                  style={{ width: "200px", marginLeft: "10px", height: "45px" }}
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
          </div>
        </div>
      )}

      <FooterDefault />
    </>
  );
};

export default CandidateApplyForm;
