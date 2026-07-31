"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { countries } from "@/data/mydata";
import { useSession } from "next-auth/react";
import { Country, State, City } from "country-state-city";
import { useEffect, useState } from "react";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
// Zod Validation schema
const formSchema = z.object({
  country: z.string().min(1, { message: "Country is required" }),
  state: z
    .string()
    .regex(/^[A-Za-z ]+$/, { message: "State must contain only letters" })
    .min(1, { message: "State is required" }),
  city: z
    .string()
    .regex(/^[A-Za-z ]+$/, { message: "City must contain only letters" })
    .min(1, { message: "City is required" }),
  postalCode: z
    .string()
    .min(1, { message: "Postal code is required" })
    .max(30, { message: "Postal code must be at most 30 digits" }),
  completeAddress: z
    .string()
    .min(1, { message: "Complete address is required" }),
});

const ContactInfoBox = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const [disbaleButton, setDisbaleButton] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  const handleCountryChange = (e) => {
    const code = e.target.value;
    setSelectedCountry(code);
    setStates(State.getStatesOfCountry(code));
    setCities([]);
  };
  
  const handleStateChange = (e) => {
    const code = e.target.value;
    setSelectedState(code);
    setCities(City.getCitiesOfState(selectedCountry, code));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    clearErrors,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const submitContactDetails = async (data) => {
    const id = session?.user?.id;

    try {
      setDisbaleButton(true);
      setLoading(true); // Set loading to true when the API call starts
      const response = await axios.post("/api/user/recruiter/update-address", {
        _id: id, // Include ID in the request body
        ...data, // Spread form data
      });

      if (response.status === 200) {
        console.log("rrr", response);
        reset();
        setLoading(false);
        toast.success("Profile updated successfully!", {
          position: "top-center", // Set the position of the toast
          autoClose: 3000, // Toast auto close after 3 seconds
          hideProgressBar: false, // Show progress bar
          closeOnClick: true, // Close the toast when clicked
          pauseOnHover: false, // Pause the toast on hover
          draggable: false, // Allow the toast to be draggable
          progress: undefined, // Optional: Set custom progress
        });
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
    <form
      onSubmit={handleSubmit(submitContactDetails)}
      className="default-form"
    >
      <div className="row">
        {/* Country */}
        {session?.user?.address?.country ? (
          <div className="form-group col-lg-6 col-md-12">
            <label>Country</label>
            <input
              type="text"
              placeholder={
                Country.getAllCountries().find(
                  (c) => c.isoCode === session.user.address.country
                )?.name || "Enter Country"
              }
              
              disabled
            />
          </div>
        ) : (
          <div className="form-group col-lg-6 col-md-12">
            <label>Country</label>
            <select
              {...register("country")}
              onChange={handleCountryChange}
              defaultValue=""
            >
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
        )}

        {/* State */}
        {session?.user?.address?.state ? (
          <div className="form-group col-lg-6 col-md-12">
            <label>State</label>
            <input
              type="text"
              placeholder={
                State.getStatesOfCountry(session.user.address.country).find(
                  (s) => s.isoCode === session.user.address.state
                )?.name || "Enter State"
              }
              
              disabled
            />
          </div>
        ) : (
          <div className="form-group col-lg-6 col-md-12">
            <label>State</label>
            <select
              {...register("state")}
              onChange={handleStateChange}
              defaultValue=""
            >
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
        )}

        {/* City */}
        {session?.user?.address?.city ? (
          <div className="form-group col-lg-6 col-md-12">
            <label>City</label>
            <input
              type="text"
              placeholder={session.user.address.city}
              disabled
            />
          </div>
        ) : (
          <div className="form-group col-lg-6 col-md-12">
            <label>City</label>
            <select {...register("city")} defaultValue="">
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
        )}

        {/* Postal Code */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Postal Code</label>
          <input
            {...register("postalCode")}
            type="text"
            placeholder={
              session?.user?.address?.postalCode || "Enter Postal Code"
            }
            disabled={!!session?.user?.address?.postalCode}
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
            placeholder={
              session?.user?.address?.completeAddress ||
              "Address of the job location"
            }
            disabled={!!session?.user?.address?.completeAddress}
          />
          {errors.completeAddress && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.completeAddress.message}
            </span>
          )}
        </div>

        {session?.user?.address?.completeAddress ? (
          <> </>
        ) : (
          <div className="form-group col-lg-12 col-md-12">
            <button
              type="submit"
              className="theme-btn btn-style-one"
              disabled={disbaleButton}
            >
              {loading ? (
                <BeatLoader
                  color={color}
                  loading={loading}
                  cssOverride={override}
                  size={4}
                  aria-label="Loading Spinner"
                  data-testid="loader"
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

export default ContactInfoBox;
