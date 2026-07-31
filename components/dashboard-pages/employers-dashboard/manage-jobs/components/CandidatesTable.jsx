"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { HashLoader } from "react-spinners";
import { getIndustryLabel, getJobTypeLabel } from "@/utils/helping-func.js";

// Loader styles for the loading spinner
const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const CandidatesTable = () => {
  const [jobList, setJobList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [color, setColor] = useState("#1966d2");

  // Number of items per page for pagination
  const itemsPerPage = 50;

  // Fetch jobs with pagination logic
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/jobs/get-jobs?page=${currentPage}&limit=${itemsPerPage}`);
        
        setJobList(response?.data?.jobs);  // Set fetched jobs
        setTotalPages(response?.data?.totalPages); // Set total number of pages
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, [currentPage]); // Re-fetch when currentPage changes

  // Convert timestamp to date
  function convertTimestampToDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return formattedDate;
  }

  // Handle pagination logic
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Loading spinner
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "50vh",
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
  }

  return (
    <div className="tabs-box">
      <div className="widget-title">
        <h4>Total Posted Jobs: ({jobList.length})</h4>
      </div>

      <div className="table-outer">
        <table className="default-table manage-job-table">
          <thead>
            <tr>
              <th>Title</th>
              <th className="text-center">Applications</th>
              <th>Created & Deadline</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {jobList.map((item) => (
              <tr key={item._id}>
                <td>
                  <div className="job-block">
                    <div className="inner-box">
                      <h4>
                        <Link href={`/job-single-v1/${item._id}`}>
                          {item.jobTitle}
                        </Link>
                      </h4>
                      <ul className="job-info">
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
                          {item?.jobType
                            ? getJobTypeLabel(item?.jobType)
                            : "No job type available"}
                        </li>
                      </ul>
                    </div>
                  </div>
                </td>
                <td className="text-center">{item?.applicationCount}</td>
                <td>
                  {convertTimestampToDate(item?.createdAt)}
                  <br />
                  {convertTimestampToDate(item?.deadline)}
                </td>
                <td className="status">Active</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-flex pb-5 justify-content-center align-items-center gap-5 mt-3">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          style={{
            width: "70px",
            height: "40px",
            borderRadius: "10px",
            backgroundColor: "#1966D2",
            color: "white",
          }}
        >
          <i className="fa fa-arrow-left"></i>
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          style={{
            width: "70px",
            height: "40px",
            borderRadius: "10px",
            backgroundColor: "#1966D2",
            color: "white",
          }}
        >
          <i className="fa fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default CandidatesTable;
