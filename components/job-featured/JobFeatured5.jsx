"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  getIndustryLabel,
  getJobTypeLabel,
  timeAgo,
} from "@/utils/helping-func";
import { HashLoader } from "react-spinners";
import { toast } from "react-toastify";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const JobFeatured5 = () => {
  const { data: session } = useSession(); // Session hook to get the session data
  const [jobList, setJobList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("#1966d2");

  const backgroundColors = {
    "Full time": "#b3cde0", // Pastel blue
    "Part time": "#cce7d0", // Pastel green
    Contract: "#f4b6b6", // Pastel pink
    Freelancing: "#fef4b3", // Pastel yellow
    Temporary: "#e2e2e2", // Pastel gray
  };

  const getBackgroundColor = (jobType) => {
    const label = getJobTypeLabel(jobType);
    return backgroundColors[label] || "transparent"; // Default to transparent if not found
  };

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/jobs/get-latest-ten-jobs");
        setJobList(response?.data?.jobs);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  if (loading)
    return (
      <div
        style={{
          width: "100%",
          height: "50vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <HashLoader
          color={color}
          loading={loading}
          cssOverride={override}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );

  const handleJobClick = (e, item) => {
    e.preventDefault(); // Prevent default Link behavior

    // Case 1: If session doesn't exist (user is not logged in)
    if (!session) {
      // Open the login modal
      const loginModalButton = document.getElementById("loginPopupModalButton");
      if (loginModalButton) {
        loginModalButton.click(); // Trigger the login modal manually
      }
    }
    // Case 2: If session exists and profilePercentage is less than 80
    else if (session?.user?.profilePercentage < 80) {
      // Show toast error if profile percentage is less than 80
      toast.error("Complete your profile at least 80% to apply", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        closeButton: false,
        style: { fontSize: "16px", width: "400px" },
      });
    }
    // Case 3: If session exists and profilePercentage is 80 or greater
    else if (session?.user?.profilePercentage >= 80) {
      // Redirect directly to job details page
      window.location.href = `/job-single-v1/${item._id}`;
    }
  };

  return (
    <>
      {jobList.map((item) => (
        <div
          className="job-block-five"
          key={item._id}
          onClick={(e) => handleJobClick(e, item)}
        >
          <div className="inner-box ">
            <div>
              <h4>
                <Link href={`/job-single-v1/${item._id}`} passHref>
                  {item.jobTitle}
                </Link>
              </h4>
              <ul className="job-info mt-2 ml-5">
                <li>
                  <span className="icon flaticon-briefcase"></span>
                  {getIndustryLabel(item?.industry)}
                </li>
                <li>
                  <span className="icon flaticon-map-locator"></span>
                  {item?.address?.city}, {item?.address?.country}
                </li>
                <li>
                  <span className="icon flaticon-clock-3"></span>
                  {timeAgo(item?.createdAt)}
                </li>
                {/* <li>
                  <span className="icon flaticon-money"></span>{" "}
                  {Intl.NumberFormat().format(item?.salary)}/-
                </li> */}
              </ul>
            </div>
            <ul className="job-other-info">
              <li
                style={{ backgroundColor: getBackgroundColor(item?.jobType) }}
              >
                {getJobTypeLabel(item?.jobType)}
              </li>
            </ul>
            <div className="btn-box">
              <a
                href={`/job-single-v1/${item._id}`}
                className="theme-btn btn-style-three"
                // onClick={(e) => handleJobClick(e, item)}
              >
                {session?.user?.role === "3"
                  ? "Submit Profile"
                  : "Apply Now"}
              </a>

              {/* Hidden buttons to trigger modals manually */}
              <button
                type="button"
                id="loginPopupModalButton"
                style={{ display: "none" }}
                data-bs-toggle="modal"
                data-bs-target="#loginPopupModal"
              >
                Trigger Login Modal
              </button>

              <button
                type="button"
                id="applyJobModalButton"
                style={{ display: "none" }}
                data-bs-toggle="modal"
                data-bs-target="#applyJobModal"
              >
                Trigger Apply Job Modal
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default JobFeatured5;
