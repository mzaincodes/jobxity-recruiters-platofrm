"use client";

import {
  countries,
  experienceOptions,
  industries,
  jobTypes,
  jobMode,
  currencies,
} from "@/data/mydata";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { Country, State, City } from "country-state-city";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Make sure to import styles
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { BeatLoader } from "react-spinners";
const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
// Define Zod schema for validation
const jobPostSchema = z.object({
  jobTitle: z
    .string()
    .min(5, { message: "Job title must be at least 5 characters" })
    .regex(/^[A-Za-z ]+$/, { message: "Job title must contain only letters" }),
  description: z
    .string()
    .min(20, { message: "Description must be at least 20 characters" }),
  requiredSkills: z
    .array(z.string().min(1, "Each skill should be at least 1 character"))
    .refine((skills) => skills.length > 0, "At least one skill is required"),
  jobType: z.string().min(1, { message: "Job type is required" }),
  requiredExperience: z.string().min(1, { message: "Experience is required" }),
  minSalary: z
    .string()
    .regex(/^\d+$/, { message: "Salary must be a number" })
    .min(1, { message: "Minimum Salary is required" }),
  maxSalary: z
    .string()
    .regex(/^\d+$/, { message: "Salary must be a number" })
    .min(1, { message: "Maximum Salary is required" }),
  currency: z.string().min(1, { message: "Currency is required" }),
  hiringManager: z.string().min(1, { message: "Hiring Manager is required" }),
  gender: z.string().min(1, { message: "Gender is required" }),
  numberOfPositions: z
    .string()
    .regex(/^[1-9]\d*$/, {
      message: "Number of positions must be a positive number",
    })
    .min(1, { message: "Number of positions is required" }),
  industry: z.string().min(1, { message: "Industry is required" }),
  jobMode: z.string().min(1, { message: "Job Mode is required" }),
  deadline: z.date().min(new Date(), { message: "Deadline is required" }),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  postalCode: z
    .string()
    .max(30, { message: "Postal code must be 30 characters or less" })
    .optional(),
  completeAddress: z.string().optional(),
});

// Form component
const PostBoxForm = () => {
  const [startDate, setStartDate] = useState(null);
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      const newSkill = inputValue.trim().replace(/,$/, "");
      if (newSkill && !skills.includes(newSkill)) {
        const updatedSkills = [...skills, newSkill];
        setSkills(updatedSkills);
        setValue("requiredSkills", updatedSkills); // Set for react-hook-form
      }
      setInputValue("");
    }
  };

  const removeSkill = (indexToRemove) => {
    const updatedSkills = skills.filter((_, index) => index !== indexToRemove);
    setSkills(updatedSkills);
    setValue("requiredSkills", updatedSkills); // Update form value
  };
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);
    setStates(State.getStatesOfCountry(countryCode));
    setCities([]); // reset cities
  };

  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    setSelectedState(stateCode);
    setCities(City.getCitiesOfState(selectedCountry, stateCode));
  };

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ header: [1, 2, false] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "link",
    "align",
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(jobPostSchema),
    defaultValues: {
      gender: "Any", // Default gender value
    },
  });
  const handleSkillsChange = (e) => {
    setSkills(e.target.value); // Update the state with the new value
  };

  // 3. Define a handleBlur function to split and trim the skills
  const handleBlur = () => {
    // Process the input string to an array of skills
    const trimmedSkills = skills
      .split(",")
      .map((skill) => skill.trim()) // Trim extra spaces
      .filter((skill) => skill !== ""); // Remove empty skills

    // Update the form field with the processed skills
    setValue("requiredSkills", trimmedSkills);
  };

  const submitJobPost = async (data) => {
    setLoading(true);
    try {
      // Manually assign data to an object
      const jobData = {
        jobTitle: data.jobTitle,
        jobDescription: data.description,
        skills: data.requiredSkills,
        jobType: data.jobType,
        requiredExperience: data.requiredExperience,
        minSalary: parseFloat(data.minSalary),
        maxSalary: parseFloat(data.maxSalary),
        currency: data.currency,
        managerName: data.hiringManager,
        gender: data.gender,
        positions: parseInt(data.numberOfPositions), // Ensure positions is a number
        industry: data.industry,
        jobMode: data.jobMode,
        deadline: data.deadline,
        address: {
          country: data.country || "",
          state: data.state || "",
          city: data.city || "",
          postalCode: data.postalCode || "",
          completeAddress: data.completeAddress || "",
        },
      };
      console.log("DFgrwtg", jobData);
      // Making the API call using Axios
      const response = await axios.post("/api/jobs/create-job", jobData);

      // Handle success
      if (response.status === 201) {
        setLoading(false);
        console.log("Job posted successfully:", response.data);
        toast.success("Job posted successfully!", {
          position: "top-right", // Set the position of the toast
          autoClose: 3000, // Toast auto close after 3 seconds
          hideProgressBar: false, // Show progress bar
          closeOnClick: true, // Close the toast when clicked
          pauseOnHover: true, // Pause the toast on hover
          draggable: true, // Allow the toast to be draggable
          progress: undefined, // Optional: Set custom progress
          // style: {
          //   backgroundColor: "#1966d2", // Custom color

          // },
        });
        setSkills("");
        setDescription("");
        reset();
      }
    } catch (error) {
      setLoading(false);
      toast.error("Failed to post job. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // Handle error
      console.error(
        "Error posting job:",
        error.response?.data || error.message
      );
    }
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
    setValue("description", value); // Update React Hook Form value
  };

  return (
    <form className="default-form pt-4" onSubmit={handleSubmit(submitJobPost)}>
      <div className="row">
        {/* Job Title */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Job Title*</label>
          <input {...register("jobTitle")} type="text" placeholder="Title" />
          {errors.jobTitle && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.jobTitle.message}
            </span>
          )}
        </div>

        {/* Job Description */}
        {/* <div className="form-group col-lg-12 col-md-12">
          <label>Job Description*</label>
          <textarea
            {...register("description")}
            placeholder="Write job description here..."
          />
          {errors.description && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.description.message}
            </span>
          )}
        </div> */}

        <div className="form-group col-lg-12 col-md-12">
          <label>Job Description*</label>
          <ReactQuill
            value={description}
            onChange={handleDescriptionChange}
            modules={modules}
            formats={formats}
            theme="snow"
          />
          {errors.description && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.description.message}
            </span>
          )}
        </div>

        {/* Required Skills */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Required Skills</label>

          <div
            className="skills-input-container"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "5px",
              border: "1px solid #ccc",
              padding: "8px",
              borderRadius: "4px",
              minHeight: "40px",
            }}
          >
            {(Array.isArray(skills) ? skills : []).map((skill, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#f0f0f0",
                  padding: "4px 8px",
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span>{skill}</span>
                <span
                  onClick={() => removeSkill(index)}
                  style={{
                    marginLeft: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  &times;
                </span>
              </div>
            ))}
            <input
              type="text"
              onKeyDown={handleKeyDown}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter comma separated skills"
              style={{
                border: "none",
                outline: "none",
                flexGrow: 1,
                minWidth: "120px",
              }}
            />
          </div>

          {errors.requiredSkills && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.requiredSkills.message}
            </span>
          )}
        </div>

        {/* Job Type */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Job Type*</label>
          <select {...register("jobType")}>
            <option value="">Select Industry</option>
            {jobTypes.map((jobTypes) => (
              <option key={jobTypes.value} value={jobTypes.value}>
                {jobTypes.label}
              </option>
            ))}
          </select>
          {errors.jobType && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.jobType.message}
            </span>
          )}
        </div>

        {/* Required Experience */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Required Experience*</label>
          <select {...register("requiredExperience")}>
            {experienceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.requiredExperience && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.requiredExperience.message}
            </span>
          )}
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <div className="row">
            <div className="form-group col-lg-6 col-md-12">
              <label>Minimum Salary</label>
              <input
                {...register("minSalary")}
                type="text"
                placeholder="Enter Minimum Salary"
              />
              {errors.minSalary && (
                <span style={{ color: "red", fontSize: "13px" }}>
                  {errors.minSalary.message}
                </span>
              )}
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <label>Maximum Salary</label>
              <input
                {...register("maxSalary")}
                type="text"
                placeholder="Enter Maximum Salary"
              />
              {errors.maxSalary && (
                <span style={{ color: "red", fontSize: "13px" }}>
                  {errors.maxSalary.message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Currency */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Currency*</label>
          <select {...register("currency")}>
            <option value="">Select Currency</option>
            {currencies.map((currency) => (
              <option key={currency.value} value={currency.value}>
                {currency.symbol} - {currency.label}
              </option>
            ))}
          </select>
          {errors.currency && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.currency.message}
            </span>
          )}
        </div>

        {/* Hiring Manager */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Hiring Manager</label>
          <input
            {...register("hiringManager")}
            type="text"
            placeholder="Enter hiring manager name"
          />
          {errors.hiringManager && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.hiringManager.message}
            </span>
          )}
        </div>

        {/* Gender */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Gender</label>
          <select {...register("gender")}>
            <option value="A">Any</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>

        {/* Number of Positions */}
        <div className="form-group col-lg-6 col-md-12">
  <label>Number of Positions</label>
  <input
    {...register("numberOfPositions", {
      required: "This field is required",
      min: {
        value: 0,
        message: "Number of positions cannot be negative"
      }
    })}
    type="number"
    placeholder="Enter number of positions"
    min="0"
  />
  {errors.numberOfPositions && (
    <span style={{ color: "red", fontSize: "13px" }}>
      {errors.numberOfPositions.message}
    </span>
  )}
</div>


        {/* Industry */}
        <div className="form-group col-lg-6 col-md-12 ">
          <label>Industry</label>
          <select {...register("industry")}>
            <option value="">Select Industry</option>
            {industries.map((industry) => (
              <option key={industry.value} value={industry.value}>
                {industry.label}
              </option>
            ))}
          </select>
          {errors.industry && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.industry.message}
            </span>
          )}
        </div>

        {/* Job Mode */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Job Mode</label>
          <select {...register("jobMode")}>
            <option value="">Select Job Mode</option>
            {jobMode.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
          {errors.jobMode && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.jobMode.message}
            </span>
          )}
        </div>

        {/* Deadline */}
        <div className="form-group col-lg-6 col-md-12 d-flex flex-column">
          <label>Deadline</label>
          <DatePicker
            selected={startDate}
            placeholderText="Select Date by clicking"
            onChange={(date) => {
              setStartDate(date);
              setValue("deadline", date);
            }}
            minDate={new Date()}
          />
          {errors.deadline && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.deadline.message}
            </span>
          )}
        </div>

        {/* Address Details */}
        <h2 className="mt-5 mb-4">Address</h2>

        {/* 
        <div className="form-group col-lg-6 col-md-12 ">
          <label>Country</label>
          <select {...register("country")}>
            <option value="">Select</option>
            {countries.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </select>
          {errors.country && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.country.message}
            </span>
          )}
        </div>


        <div className="form-group col-lg-6 col-md-12">
          <label>State</label>
          <input
            {...register("state")}
            type="text"
            placeholder="Enter state name"
          />
          {errors.state && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.state.message}
            </span>
          )}
        </div>


        <div className="form-group col-lg-6 col-md-12 ">
          <label>City</label>
          <input
            {...register("city")}
            type="text"
            placeholder="Enter city name"
          />
          {errors.city && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.city.message}
            </span>
          )}
        </div>Country */}

        {/* Country */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Country</label>
          <select {...register("country")} onChange={handleCountryChange}>
            <option value="">Select</option>
            {countries.map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>
          {errors.country && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.country.message}
            </span>
          )}
        </div>

        {/* State */}
        <div className="form-group col-lg-6 col-md-12">
          <label>State</label>
          <select {...register("state")} onChange={handleStateChange}>
            <option value="">Select</option>
            {states.map((state) => (
              <option key={state.isoCode} value={state.isoCode}>
                {state.name}
              </option>
            ))}
          </select>
          {errors.state && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.state.message}
            </span>
          )}
        </div>

        {/* City */}
        <div className="form-group col-lg-6 col-md-12">
          <label>City</label>
          <select {...register("city")}>
            <option value="">Select</option>
            {cities.map((city, index) => (
              <option key={index} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
          {errors.city && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.city.message}
            </span>
          )}
        </div>

        {/* Postal Code */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Postal Code</label>
          <input
            {...register("postalCode")}
            type="text"
            placeholder="Enter postal code"
          />
          {errors.postalCode && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.postalCode.message}
            </span>
          )}
        </div>

        {/* Complete Address */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Complete Address</label>
          <input
            {...register("completeAddress")}
            type="text"
            placeholder="Address of the job location"
          />
          {errors.completeAddress && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.completeAddress.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          className="col-lg-12 my-5 col-md-12 theme-btn btn-style-one"
          type="submit"
          style={{ width: "200px", marginLeft: "10px" }}
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
            "Create Job Post"
          )}
        </button>
      </div>
    </form>
  );
};

export default PostBoxForm;
