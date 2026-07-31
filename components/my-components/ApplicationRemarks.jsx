import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import { convertTimestampToDate, timeAgo } from "@/utils/helping-func";

const ApplicationRemarks = ({ applicationId, addedBy }) => {
  // State to hold the value of the textarea
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [remarksData, setRemarksData] = useState(null);
  
  // Fetch application remarks from GET API on component mount
  useEffect(() => {
    const fetchRemarks = async () => {
      try {
        const response = await axios.get(
          `/api/application/submit-application-remarks?applicationId=${applicationId}`
        );
        setRemarksData(response.data.applicationRemarks); // Set the fetched data to state
      } catch (error) {
        console.error("Error fetching application remarks:", error);
        setError("Failed to fetch remarks.");
      }
    };

    if (applicationId) {
      fetchRemarks(); // Fetch remarks if applicationId is provided
    }
  }, [applicationId]);

  // Handle the change in textarea
  const handleChange = (e) => {
    setRemarks(e.target.value);
  };

  // Handle the submit button click
  const handleSubmit = async () => {
    if (remarks.trim() === "") {
      console.log("Remarks are required!");
      setError("Remarks are required!");
      return;
    }

    try {
      setLoading(true); // Set loading state when making API call

      // Prepare the payload
      const payload = {
        applicationId,
        addedBy,
        remarksDescription: remarks,
      };

      // Make a POST request using axios
      const response = await axios.post(
        "/api/application/submit-application-remarks",
        payload
      );

      if (response.status === 200) {
        setSuccess("Remark added successfully!");
        setRemarks(""); // Clear textarea after success
      } else {
        setError(response.data.error || "Failed to add remark.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while adding the remark.");
    } finally {
      setLoading(false); // Set loading state to false once request is complete
    }
  };

  return (
    <div>
      <h3 className="my-2">Add Remarks</h3>

      {/* Error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Success message */}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <textarea
        value={remarks}
        onChange={handleChange}
        placeholder="Write here...."
        style={{
          width: "100%",
          height: "200px",
          backgroundColor: "#f0f0f0",
          padding: "15px",
          borderRadius: "15px",
        }}
        required
      />
      <button
        className="col-lg-12 my-1 col-md-12 theme-btn btn-style-one"
        onClick={handleSubmit}
        type="button" // Changed to button type="button" to prevent form submission
        disabled={loading} // Disable button when loading
      >
        {loading ? "Submitting..." : "Submit"}
      </button>

      {remarksData && (
        <div className="mt-5">
          <h3 className="mb-4">Application Remarks</h3>
          <ul>
            {remarksData.map((remark, index) => (
              <li
                key={index}
                className="mb-2"
                style={{
                  borderRadius: "5px",
                  backgroundColor: "#F4F7FB",
                  padding: "10px",
                }}
              >
                <p className="d-flex justify-content-between">
                  <h4>{remark.addedBy?.name}</h4>
                  <p>
                    {new Date(remark.addedAt * 1000).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true, // Use 12-hour clock format
                    })}
                  </p>
                </p>
                <div>
                  <h6 className="mt-1">Description:</h6>
                  <div
                    style={{
                      width: "100%",
                      wordWrap: "break-word", // Break words if they're too long to fit
                      overflowWrap: "break-word", // Make sure long words break and wrap inside
                      whiteSpace: "normal", // Ensure the text wraps instead of going in a single line
                      boxSizing: "border-box", // To include padding and border in the width calculation
                    }}
                  >
                    {remark.remarksDescription}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ApplicationRemarks;
