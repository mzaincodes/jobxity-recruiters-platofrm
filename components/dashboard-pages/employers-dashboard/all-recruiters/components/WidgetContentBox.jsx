

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios"; // Use axios to make API requests
import Loader from "@/components/my-components/Loader";
import { statuses } from "@/data/mydata";
import { useSession } from "next-auth/react";

const WidgetContentBox = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [totalCount, setTotalCount] = useState("");
  const [status, setStatus] = useState(""); // Status filter
  const [showClearButton, setShowClearButton] = useState(false); 
    const { data: session } = useSession();
  

  const itemsPerPage = 100; // Number of candidates per page

  // Fetch candidates with pagination and filters
  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/user/recruiter/get-recruiters`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          searchQuery: searchText,
          status, 
          id: session?.user?.id
        },
      });
      setCandidates(response.data.recruiters);
      setTotalPages(response.data.totalPages);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [currentPage, status, searchText]); // Re-fetch when page, filters, or search text change

  // Handle page change
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

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to the first page when new search is made
    fetchCandidates(); // Re-fetch candidates after search query
  };

  // Handle Status Filter Change
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };


  // Handle Clear All Filters
  const clearAll = () => {
    setSearchText("");
    setStatus("");
    setCurrentPage(1);
    setShowClearButton(false); // Hide clear button after reset
    fetchCandidates();
  };

  useEffect(() => {
    // Enable "Clear All" button if any filter or search text is applied
    if (searchText || status ) {
      setShowClearButton(true);
    } else {
      setShowClearButton(false);
    }
  }, [searchText, status]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setCurrentPage(1);
      fetchCandidates();
    }
  };

  return (
    <div className="p-2">
      <div className="widget-title">
        <h4>{totalCount} Recruiters Found</h4>
        {/* Filters and Clear All Button */}

        {/* <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
        >
          {showClearButton && (
            <button
              onClick={clearAll}
              className="btn btn-danger mt-3"
              style={{
                minHeight: "45px",
                marginBottom: "15px",
              }}
            >
              Clear All
            </button>
          )}
          <select
            className="chosen-single form-select"
            value={status}
            onChange={handleStatusChange}
            style={{ width: "200px" }}
          >
            <option value="">Select Status</option>
            {statuses.map((statusItem) => (
              <option key={statusItem.value} value={statusItem.value}>
                {statusItem.label}
              </option>
            ))}
          </select>

        </div> */}
      </div>

      <div className="job-search-form mx-3 p-2" id="top-result">
        <div className="row">
          {/* Search input section */}
          <div className="form-group col-lg-10 col-md-12 col-sm-12">
            <input
              type="text"
              placeholder="Enter Recruiter name"
              value={searchText}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown} // Listen for the Enter key press to trigger search
            />
            <span className="icon flaticon-search-3"></span>
          </div>

          {/* Search button section */}
          <div className="form-group col-lg-2 col-md-12 col-sm-12 text-right d-flex align-items-center justify-content-center">
            <button
              type="button"
              style={{
                fontSize: "20px",
                width: "100px",
                height: "40px",
                backgroundColor: "#1966D2",
                color: "white",
                borderRadius: "5px",
              }}
              className="theme-btn btn-style-one"
              onClick={handleSearchSubmit}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="row p-3">
        {/* Loading or displaying candidates */}
        {loading ? (
          <div className="text-center w-100">
            <Loader />
          </div>
        ) : candidates.length > 0 ? (
          candidates.map((candidate) => (
            <div
              className="company-block-four col-xl-3 col-lg-6 col-md-6 col-sm-12"
              key={candidate._id}
            >
                    <Link href={`/candidates-single-v2/${candidate._id}`}>
              <div className="inner-box">
                <div className="content-inner">
                  {/* <span className="featured">Featured</span> */}
                  <span className="company-logo">
                    <Image
                      width={50}
                      height={50}
                      src={candidate.pic || "/images/user.png"}
                      alt="candidate avatar"
                    />
                  </span>
                  <h4>
                      {candidate.name || "No Name"}
                  </h4>
                  <ul className="job-info flex-column">
                    <li>{candidate.email || "Email not available"}</li>
                    <li>{candidate.phone || "Phone not available"}</li>
                  </ul>
                </div>

                {/* <div className="job-type me-0">
                  {candidate.createdBy?.name || "Self"}
                </div> */}
              </div>
                    </Link>
            </div>
          ))
        ) : (
          <div className="text-center w-100">
            <p>No candidates found.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center align-items-center gap-5 mt-3">
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

export default WidgetContentBox;
