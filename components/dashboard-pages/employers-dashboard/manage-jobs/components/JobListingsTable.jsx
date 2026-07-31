"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { HashLoader } from "react-spinners";
import { getIndustryLabel, getJobModeLabel, getJobTypeLabel } from "@/utils/helping-func.js";
import { jobTypes } from "@/data/mydata";

// Loader styles for the loading spinner
const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const JobListingsTable = () => {
  const [jobList, setJobList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [color, setColor] = useState("#1966d2");
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("");
  const itemsPerPage = 50;
  const [jobStatus, setJobStatus] = useState("");
  const [jobType, setJobType] = useState("");
  const [showClearButton, setShowClearButton] = useState(false);
  const [toggleLoading, setToggleLoading] = useState({}); // Track loading state for each toggle

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/jobs/get-jobs?page=${currentPage}&limit=${itemsPerPage}&searchQuery=${searchQuery}&timeRange=${timeRange}&jobStatus=${jobStatus}&jobType=${jobType}`
      );
      console.log(response);
      setJobList(response?.data?.jobs);
      setTotalPages(response?.data?.totalPages);
      setTotalCount(response?.data?.totalCount);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [currentPage, searchQuery, timeRange, jobStatus, jobType]);

  useEffect(() => {
    if (timeRange || jobStatus || jobType || searchQuery) {
      setShowClearButton(true);
    } else {
      setShowClearButton(false);
    }
  }, [timeRange, jobStatus, jobType, searchQuery]);

  function convertTimestampToDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

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

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = () => {
    setCurrentPage(1);
    setSearchQuery(searchText);
  };

  // Handle Enter key press for search
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  // Handle time filter change
  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleJobStatusChange = (e) => setJobStatus(e.target.value); // 🆕 Job status handler

  const handleJobTypeChange = (e) => {
    setJobType(e.target.value);
    setCurrentPage(1);
  };

  const clearAll = () => {
    setSearchText("");
    setSearchQuery("");
    setTimeRange("");
    setJobStatus("");
    setJobType("");
    setCurrentPage(1);
    setShowClearButton(false);
  };

  // Handle job status toggle
  const handleJobStatusToggle = async (jobId, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    
    // Set loading state for this specific toggle
    setToggleLoading(prev => ({ ...prev, [jobId]: true }));
    
    try {
      const response = await axios.put('/api/jobs/update-job', {
        jobId: jobId,
        fields: {
          jobStatus: newStatus
        }
      });
      
      if (response.status === 200) {
        // Update the local state immediately for better UX
        setJobList(prev => prev.map(job => 
          job._id === jobId 
            ? { ...job, jobStatus: newStatus }
            : job
        ));
        
        // Refetch all jobs to ensure data consistency
        await fetchJobs();
      }
    } catch (error) {
      console.error('Error updating job status:', error);
      // You could add a toast notification here for error feedback
    } finally {
      // Clear loading state for this toggle
      setToggleLoading(prev => ({ ...prev, [jobId]: false }));
    }
  };
  // Loading spinner
  // if (loading) {
  //   return (
  //     <div
  //       style={{
  //         display: "flex",
  //         alignItems: "center",
  //         justifyContent: "center",
  //         width: "100%",
  //         height: "50vh",
  //       }}
  //     >
  //       <HashLoader
  //         color={color}
  //         loading={loading}
  //         cssOverride={override}
  //         size={50}
  //         aria-label="Loading Spinner"
  //         data-testid="loader"
  //       />
  //     </div>
  //   );
  // }

  return (
    <div className="tabs-box">
      <div className="widget-title">
        <h4>Showing {totalCount} Jobs</h4>

        <div
          style={{
            backgroundClip: "pink",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
        >
          {showClearButton && (
            <button
              onClick={clearAll}
              className="btn btn-danger mt-3 "
              style={{
                minHeight: "45px",
                marginBottom: "15px",
              }}
            >
              Clear All
            </button>
          )}
          <select
            style={{ width: "140px" }}
            className="chosen-single form-select"
            value={timeRange}
            onChange={handleTimeRangeChange}
          >
            <option value="">Select Time</option>
            <option value="lastWeek">Last Week</option>
            <option value="lastMonth">Last Month</option>
            <option value="last3Months">Last 3 Months</option>
            <option value="last6Months">Last 6 Months</option>
            <option value="lastYear">Last Year</option>
          </select>
          <select
            style={{ width: "140px" }}
            className="chosen-single form-select"
            value={jobStatus}
            onChange={handleJobStatusChange}
          >
            <option value="">Select Status</option>
            <option value="1">Open</option>
            <option value="0">Closed</option>
          </select>
          <select
            style={{ width: "140px" }}
            className="chosen-single form-select"
            value={jobType}
            onChange={handleJobTypeChange}
          >
            <option value="">Select Job Type</option>
            {jobTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>                                                              
      <div className="job-search-form mx-3 p-2" id="top-result">
        <div className="row">
          <div className="form-group col-lg-10 col-md-12 col-sm-12">
            <input
              type="text"
              placeholder="Enter job title"
              value={searchText}
              onChange={handleSearchChange}
              onKeyDown={handleKeyPress}
            />
            <span className="icon flaticon-search-3"></span>
          </div>

          <div className="form-group col-lg-2 col-md-12 col-sm-12 text-right d-flex align-items-center justify-content-center">
            <button
              type="button"
              style={{ fontSize: "20px", width: "100px", height: "40px" }}
              className="theme-btn btn-style-one"
              onClick={handleSearchSubmit}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="table-outer">
        <table className="default-table manage-job-table">
          <thead>
            <tr>
              <th>Title</th>
              <th className="text-center">Applications</th>
              <th className="text-center">Created & Deadline</th>
              <th className="text-center" >Status</th>
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
                          {getJobModeLabel(item?.jobMode)}
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
                <td className="text-center">
                  {convertTimestampToDate(item?.createdAt)}
                  <br />
                  {convertTimestampToDate(item?.deadline)}
                </td>
                <td className="status">
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id={`toggle-${item._id}`}
                        checked={item?.jobStatus === 1}
                        onChange={() => handleJobStatusToggle(item._id, item?.jobStatus)}
                        disabled={toggleLoading[item._id]}
                        style={{
                          width: '3rem',
                          height: '1.5rem',
                          cursor: toggleLoading[item._id] ? 'not-allowed' : 'pointer'
                        }}
                      />
                    </div>
                    {toggleLoading[item._id] ? (
                      <div className="ms-2">
                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <span className="ms-2 text-muted small">
                        {item?.jobStatus === 1 ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </div>
                </td>
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

export default JobListingsTable;
